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

export const getUserProfilePicture = (email: string) => {
  return email
    ? `${siteUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${email}`
    : "https://via.placeholder.com/50"; // Default image if email is missing
};
