import { spfi, SPFx } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import "@pnp/sp/webs"; // ✅ Required for `sp.web`
import "@pnp/sp/lists"; // ✅ Required for lists
import "@pnp/sp/items"; // ✅ Required for items

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
}
