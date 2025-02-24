import { siteUrl } from "./CONSTANTS";

interface AttachmentFile {
  ServerRelativeUrl: string;
}

interface Item {
  Attachments: boolean;
  AttachmentFiles: AttachmentFile[];
}

export const getImageURL = (item: Item): string => {
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

export const getUserProfilePicture = (email: string): string => {
  return email
    ? `${siteUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${email}`
    : "https://via.placeholder.com/50"; // Default image if email is missing
};
