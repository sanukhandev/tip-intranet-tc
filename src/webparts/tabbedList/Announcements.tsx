import * as React from "react";
import PnpService from "../../service/pnpService";
import { ANNOUNCEMENTS_LIST } from "../../CONSTANTS";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface IAnnouncement {
  Title: string;
  Category: string;
  Description: string;
  ImageUrl: string;
  ReadMoreUrl: string;
}

interface IAnnouncementsState {
  announcements: IAnnouncement[];
}

export default class Announcements extends React.Component<
  { context: WebPartContext },
  IAnnouncementsState
> {
  constructor(props: { context: WebPartContext }) {
    super(props);
    this.state = {
      announcements: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    const announcements = await this.getAnnouncements();
    this.setState({ announcements });
  }

  private async getAnnouncements(): Promise<IAnnouncement[]> {
    PnpService.init(this.props.context);
    const items = await PnpService.getItemsWithAttachments(ANNOUNCEMENTS_LIST);
    return items.map((item) => ({
      Title: item.Title,
      Category: item.Category,
      Description: item.Description,
      ImageUrl:
        item.AttachmentFiles?.length > 0
          ? item.AttachmentFiles[0].ServerRelativeUrl
          : "assets/images/default-placeholder.png",
      ReadMoreUrl: item.ReadMoreUrl || "#",
    }));
  }

  public render(): React.ReactElement<{}> {
    const { announcements } = this.state;
    const featuredAnnouncement =
      announcements.length > 0 ? announcements[0] : null;
    //   take only top 3 announcements
    const otherAnnouncements = announcements.slice(1, 4);

    return (
      <div
        className="tab-pane fade show active"
        id="announcements"
        role="tabpanel"
        aria-labelledby="announcements-tab"
      >
        <div className="row">
          {featuredAnnouncement && (
            <div className="col-lg-12 col-xl-6">
              <div className="card-before-shade rounded-3 overflow-hidden position-relative h-100">
                <span className="front-tag text-white bg-primary px-3 rounded-4">
                  {featuredAnnouncement.Category}
                </span>
                <img
                  className="w-100 h-100"
                  src={featuredAnnouncement.ImageUrl}
                  alt={featuredAnnouncement.Title}
                />
                <div className="p-3 ps-0 pb-0 position-absolute left-1 bottom-2">
                  <h4 className="text-white">{featuredAnnouncement.Title}</h4>
                  <a
                    className="text-white"
                    href={featuredAnnouncement.ReadMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>
          )}
          <div className="col-lg-12 col-xl-6">
            <ul className="list-group">
              {otherAnnouncements.map((announcement, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex p-3 justify-content-between align-items-center"
                >
                  <div className="col-3">
                    <img
                      className="img-thumbnail w-100 border-0 p-0"
                      src={announcement.ImageUrl}
                      alt={announcement.Title}
                    />
                  </div>
                  <div className="col-9 ps-3">
                    <span
                      className={`badge rounded-5 py-2 px-3 custom bg-${announcement.Category.toLowerCase()}`}
                    >
                      {announcement.Category}
                    </span>
                    <span className="w-100 d-block">{announcement.Title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="view-all p-3">
            <a
              className="main-btn background-none d-inline-flex align-items-center px-4 py-2 mt-3 rounded-5"
              href="#"
            >
              <span>View All</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
