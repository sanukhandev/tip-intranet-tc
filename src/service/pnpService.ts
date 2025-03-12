import { spfi, SPFx } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/site-users/web";
import { PHOTO_GALLERY, SNAP_SHARE, SNAP_SHARE_LIST } from "../CONSTANTS";

export default class PnpService {
  private static sp: ReturnType<typeof spfi> | null = null;

  /**
   * Initializes PnP service with WebPart context.
   * Must be called before using any service methods.
   */
  public static init(context: WebPartContext): void {
    if (!PnpService.sp) {
      console.log("Initializing PnP Service...");
      PnpService.sp = spfi().using(SPFx(context));
    }
  }

  /**
   * Ensures PnP Service is initialized before making any API calls.
   */
  private static ensureInitialized(): void {
    if (!PnpService.sp) {
      throw new Error(
        "PnpService is not initialized. Call PnpService.init(context) before using it."
      );
    }
  }

  /**
   * ✅ Fix: Gets items from a SharePoint list (no need for `get()`)
   */
  public static async getItems(
    listName: string,
    filters: string[] = []
  ): Promise<any[]> {
    PnpService.ensureInitialized();

    let query = PnpService.sp!.web.lists.getByTitle(listName).items;

    // Combine all filters into a single filter string
    if (filters.length > 0) {
      query = query.filter(filters.join(" and "));
    }

    return await query();
  }

  /**
   * ✅ Fix: Gets a single item by ID from a SharePoint list (no need for `get()`)
   */
  public static async getItemById(listName: string, id: number): Promise<any> {
    PnpService.ensureInitialized();
    return await PnpService.sp!.web.lists.getByTitle(listName).items.getById(
      id
    )();
  }

  /**
   * Creates a new item in a SharePoint list.
   */
  public static async createItem(listName: string, item: any): Promise<any> {
    PnpService.ensureInitialized();
    return await PnpService.sp!.web.lists.getByTitle(listName).items.add(item);
  }

  /**
   * Updates an item in a SharePoint list.
   */
  public static async updateItem(
    listName: string,
    id: number,
    item: any
  ): Promise<any> {
    PnpService.ensureInitialized();
    return await PnpService.sp!.web.lists.getByTitle(listName)
      .items.getById(id)
      .update(item);
  }

  /**
   * Deletes an item from a SharePoint list.
   */
  public static async deleteItem(listName: string, id: number): Promise<any> {
    PnpService.ensureInitialized();
    return await PnpService.sp!.web.lists.getByTitle(listName)
      .items.getById(id)
      .delete();
  }

  public static async getItemsWithAttachments(
    listName: string,
    filters: string[] = []
  ): Promise<any[]> {
    PnpService.ensureInitialized();
    // return await PnpService.sp!.web.lists.getByTitle(listName).items.expand(
    //   "AttachmentFiles"
    // )();
    let query =
      PnpService.sp!.web.lists.getByTitle(listName).items.expand(
        "AttachmentFiles"
      );
    if (filters.length > 0) {
      query = query.filter(filters.join(" and "));
    }
    return await query();
  }

  public static async getLibraryImages(
    libraryName: string,
    itemId: number
  ): Promise<string[]> {
    PnpService.ensureInitialized();

    try {
      // Fetch the item first to get its folder URL
      const item = await PnpService.sp!.web.lists.getByTitle(libraryName)
        .items.getById(itemId)
        .select("FileRef")(); // ✅ Ensure to select FileRef for folder path

      if (!item.FileRef) {
        return [];
      }

      // Get all files in the item's folder
      const folderPath = item.FileRef.substring(
        0,
        item.FileRef.lastIndexOf("/")
      );
      const files = await PnpService.sp!.web.getFolderByServerRelativePath(
        folderPath
      ).files();

      return files.map((file) => file.ServerRelativeUrl);
    } catch (error) {
      console.error(
        `Error fetching images for item ${itemId} in ${libraryName}:`,
        error
      );
      return [];
    }
  }

  public static async getItemsAndExpand(
    listName: string,
    selectFields: string[],
    expandFields: string[],
    filters: string[] = []
  ): Promise<any[]> {
    PnpService.ensureInitialized();
    let query = PnpService.sp!.web.lists.getByTitle(listName).items.select(
      ...selectFields
    );
    if (expandFields.length > 0) {
      query = query.expand(...expandFields);
    }
    if (filters.length > 0) {
      query = query.filter(filters.join(" and "));
    }
    return await query();
  }

  public static async getCurrentUserId(): Promise<number> {
    PnpService.ensureInitialized();
    const user = await PnpService.sp!.web.currentUser.select("Id")();
    return user.Id;
  }

  public static async getDocumentLibraryWithFoldersAndImages(): Promise<
    Record<string, string[]>
  > {
    PnpService.ensureInitialized();

    try {
      const libraryRoot = PnpService.sp!.web.getFolderByServerRelativePath(
        `${PHOTO_GALLERY}`
      );

      // Fetch all folders inside the library
      const folders = await libraryRoot.folders.select(
        "Name",
        "ServerRelativeUrl"
      )();

      const folderData: Record<string, string[]> = {};

      for (const folder of folders) {
        const files = await PnpService.sp!.web.getFolderByServerRelativePath(
          folder.ServerRelativeUrl
        ).files.select("ServerRelativeUrl")();

        folderData[folder.Name] = files.map((file) => file.ServerRelativeUrl);
      }

      return folderData;
    } catch (error) {
      console.error(`Error fetching document library folders & images:`, error);
      return {};
    }
  }

  public static async getSnapAndShareAndImages(): Promise<
    {
      id: number;
      title: string;
      postedBy: string;
      postedByEmail: string;
      postedByRole: string;
      likes?: string;
      images: string[];
      comments: {
        id: number;
        comment: string;
      }[];
    }[]
  > {
    PnpService.ensureInitialized();

    try {
      // Get the current site's server-relative URL
      const web = PnpService.sp!.web;
      const siteUrl = await web.select("ServerRelativeUrl")();

      // Step 1: Fetch all items from SnapAndShareList
      const listItems = await web.lists
        .getByTitle(SNAP_SHARE_LIST)
        .items.select(
          "ID",
          "Title",
          "PostedBy/Id",
          "PostedBy/Title",
          "PostedBy/Name",
          "PostedBy/EMail",
          "PostedBy/Department",
          "PostedBy/JobTitle",
          "Likes"
        )
        .expand("PostedBy")()
        .then((items) =>
          items.map((item) => ({
            id: item.ID,
            title: item.Title,
            postedBy: item.PostedBy?.Title || "Unknown",
            postedByEmail: item.PostedBy?.EMail || "N/A",
            postedByRole: item.PostedBy?.JobTitle || "N/A",
            likes: item.Likes || 0,
            images: [] as string[],
            comments: [] as { id: number; comment: string }[], // Placeholder for comments, fetched later
          }))
        );

      // Step 2: Fetch images from SnapAndShare document library based on the list item ID
      const snapShareItems = await Promise.all(
        listItems.map(async (item) => {
          const folderPath = `${siteUrl.ServerRelativeUrl}/${SNAP_SHARE}/${item.id}`;
          try {
            const files = await web
              .getFolderByServerRelativePath(folderPath)
              .files.select("ServerRelativeUrl")();
            return {
              ...item,
              images: files.map((file) => file.ServerRelativeUrl),
            };
          } catch (error) {
            console.warn(`No images found for item ID: ${item.id}`, error);
            return { ...item, images: [] };
          }
        })
      );

      // Step 3: Fetch comments related to each Snap & Share item
      const snapShareWithComments = await Promise.all(
        snapShareItems.map(async (item) => {
          try {
            const comments = await PnpService.getItems("BirthdayComments", [
              `CommentType eq 'SNP'`,
              `PostId eq ${item.id}`,
            ]);

            const formattedComments = comments.map((comment) => ({
              id: comment.ID,
              comment: comment.Comment || "",
            }));

            return { ...item, comments: formattedComments };
          } catch (error) {
            console.warn(
              `Error fetching comments for item ID: ${item.id}`,
              error
            );
            return { ...item, comments: [] }; // Return empty comments if none found
          }
        })
      );

      return snapShareWithComments;
    } catch (error) {
      console.error(
        "Error fetching SnapAndShareList items with images and comments:",
        error
      );
      return [];
    }
  }
  public static async getCurrentUser(): Promise<
    | {
        id: number;
        name: string;
        email: string;
        loginName: string;
        jobTitle: string;
      }
    | undefined
  > {
    PnpService.ensureInitialized();
    try {
      const user = await PnpService.sp!.web.currentUser.select(
        "Id",
        "Title",
        "Email",
        "LoginName",
        "JobTitle"
      )();
      return {
        id: user.Id,
        name: user.Title,
        email: user.Email,
        loginName: user.LoginName,
        jobTitle: "",
      };
    } catch (error) {
      console.error("Error fetching current user details:", error);
      return null;
    }
  }
}
