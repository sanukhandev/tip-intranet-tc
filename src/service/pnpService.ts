import { spfi, SPFx } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import "@pnp/sp/webs"; // ✅ Required for `sp.web`
import "@pnp/sp/lists"; // ✅ Required for lists
import "@pnp/sp/items"; // ✅ Required for items
import "@pnp/sp/folders"; // ✅ Ensure folders are imported
import "@pnp/sp/files"; // ✅ Ensure files are imported
import "@pnp/sp/site-users/web"; // ✅ Ensure site-users are imported

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
  public static async getItems(listName: string): Promise<any[]> {
    PnpService.ensureInitialized();
    return await PnpService.sp!.web.lists.getByTitle(listName).items();
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
    listName: string
  ): Promise<any[]> {
    PnpService.ensureInitialized();
    return await PnpService.sp!.web.lists.getByTitle(listName).items.expand(
      "AttachmentFiles"
    )();
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
    expandFields: string[]
  ): Promise<any[]> {
    PnpService.ensureInitialized();
    return await PnpService.sp!.web.lists.getByTitle(listName)
      .items.select(...selectFields)
      .expand(...expandFields)();
  }

  public static async getCurrentUserId(): Promise<number> {
    PnpService.ensureInitialized();
    const user = await PnpService.sp!.web.currentUser.select("Id")();
    return user.Id;
  }
}
