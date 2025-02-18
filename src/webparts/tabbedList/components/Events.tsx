import * as React from "react";
import PnpService from "../../../service/pnpService";
import { EVENTS_LIST_NAME } from "../../../CONSTANTS";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface IEvent {
  Title: string;
  Category: string;
  Description: string;
  ImageUrl: string;
  ReadMoreLink: string;
}

interface IEventsState {
  events: IEvent[];
}

export default class Events extends React.Component<
  { context: WebPartContext },
  IEventsState
> {
  constructor(props: { context: WebPartContext }) {
    super(props);
    this.state = {
      events: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    const events = await this.getEvents();
    this.setState({ events });
  }

  private async getEvents(): Promise<IEvent[]> {
    PnpService.init(this.props.context);
    const items = await PnpService.getItemsWithAttachments(EVENTS_LIST_NAME);
    return items.map((item) => ({
      Title: item.Title,
      Category: item.Category,
      Description: item.Description,
      ImageUrl: item.AttachmentFiles?.length
        ? item.AttachmentFiles[0].ServerRelativeUrl
        : "assets/images/default-placeholder.png",
      ReadMoreLink: item.ReadMore || "#",
    }));
  }

  public render(): React.ReactElement<{}> {
    const { events } = this.state;
    return (
      <div
        className="tab-pane fade active show"
        id="events"
        role="tabpanel"
        aria-labelledby="events-tab"
      >
        <div className="row">
          {events.slice(0, 2).map((event, index) => (
            <div key={index} className="col-lg-12 col-xl-6">
              <div className="card-before-shade rounded-3 overflow-hidden position-relative h-100">
                <span className="front-tag text-white bg-primary px-3 py-1 rounded-4">
                  {event.Category}
                </span>
                <img
                  className="w-100 h-100"
                  src={event.ImageUrl}
                  alt={event.Title}
                />
                <div className="p-3 ps-0 pb-0 position-absolute left-1 bottom-2">
                  <h4 className="text-white">{event.Title}</h4>
                  <a className="text-white" href={event.ReadMoreLink}>
                    Read more{" "}
                    <svg
                      className="ms-1 mb-1"
                      width="14"
                      height="15"
                      viewBox="0 0 10 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_4257_12219)">
                        <path
                          d="M9.69212 5.76437L5.22577 10.3076L4.7986 9.87303L8.53401 6.07337H0V5.45538H8.53401L4.7986 1.65571L5.22577 1.22119L9.69212 5.76437Z"
                          fill="white"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_4257_12219">
                          <rect
                            width="9.69212"
                            height="10.2979"
                            fill="white"
                            transform="translate(0 0.00952148)"
                          ></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
          <div className="col-12">
            <a className="main-btn background-none d-inline-flex align-items-center px-4 py-2 mt-4 rounded-5">
              <span>View All</span>
              <svg
                className="ml-2"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
