import { siteUrl } from "./CONSTANTS";

export const getImageURL = (item: any): string => {
  if (
    item.Attachments &&
    item.AttachmentFiles &&
    item.AttachmentFiles.length > 0
  ) {
    const attachment = item.AttachmentFiles[0];
    return `${siteUrl}${attachment.ServerRelativeUrl}`;
  }
  return "";
};
