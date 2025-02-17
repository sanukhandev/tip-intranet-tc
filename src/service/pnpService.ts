import { spfi, SPFx } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export default class PnpService {
  private static sp: any;

  public static init(context: WebPartContext): void {
    this.sp = spfi().using(SPFx(context));
  }

  public static async getItems(listName: string): Promise<any[]> {
    const items = await this.sp.web.lists.getByTitle(listName).items.get();
    return items;
  }

  public static async getItemById(listName: string, id: number): Promise<any> {
    const item = await this.sp.web.lists
      .getByTitle(listName)
      .items.getById(id)
      .get();
    return item;
  }

  public static async createItem(listName: string, item: any): Promise<any> {
    const newItem = await this.sp.web.lists
      .getByTitle(listName)
      .items.add(item);
    return newItem;
  }

  public static async updateItem(
    listName: string,
    id: number,
    item: any
  ): Promise<any> {
    const updatedItem = await this.sp.web.lists
      .getByTitle(listName)
      .items.getById(id)
      .update(item);
    return updatedItem;
  }

  public static async deleteItem(listName: string, id: number): Promise<any> {
    const deletedItem = await this.sp.web.lists
      .getByTitle(listName)
      .items.getById(id)
      .delete();
    return deletedItem;
  }

  public static async getItemsWithAttachments(
    listName: string
  ): Promise<any[]> {
    const items = await this.sp.web.lists
      .getByTitle(listName)
      .items.select("*, AttachmentFiles")
      .expand("AttachmentFiles")
      .get();
    return items;
  }

  public static async getItemWithAttachmentsById(
    listName: string,
    id: number
  ): Promise<any> {
    const item = await this.sp.web.lists
      .getByTitle(listName)
      .items.getById(id)
      .select("*, AttachmentFiles")
      .expand("AttachmentFiles")
      .get();
    return item;
  }
}
