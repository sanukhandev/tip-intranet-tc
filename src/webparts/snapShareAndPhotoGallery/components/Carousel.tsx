import * as React from "react";
import { getUserProfilePicture } from "../../../helper";

interface CarouselProps {
  items: {
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
  }[];
  pageLink: string;
}

export default class Carousel extends React.Component<CarouselProps> {
  private onClickImageHandle(): void {
    window.location.href = this.props.pageLink;
  }
  public render(): React.ReactElement {
    return (
      <div
        className="tab-content rounded-bottom-3 mb-5 bg-white border"
        id="myTabContent"
      >
        <div
          className="tab-pane p-2 fade active show"
          id="snap-and-share"
          role="tabpanel"
          aria-labelledby="snap-and-share-tab"
        >
          <div className="row m-0">
            <div
              id="snapshareCarousel"
              className="carousel bg-white rounded-3 slide my-3 pointer-event"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {this.props.items.map((item, index) => (
                  <div
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                    key={index}
                  >
                    <div className="card border-0">
                      <img
                        onClick={() => this.onClickImageHandle()}
                        className="mx-290 object-fit-cover rounded-3"
                        src={item.images[0]}
                        alt={item.title}
                      />

                      <div className="card-body">
                        <div className="mb-3">
                          <div className="d-flex my-1">
                            <div className="left me-3">
                              <img
                                className="rounded-circle cmn-pro-pic"
                                src={getUserProfilePicture(item.postedByEmail)}
                                alt="Profile"
                              />
                            </div>
                            <div className="right w-100 d-flex justify-content-between">
                              <div>
                                <h6 className="form-label mb-0 d-flex justify-content-between">
                                  <strong>{item.postedBy}</strong>
                                </h6>
                                <p className="mb-0">
                                  <small>{item.postedByRole}</small>
                                </p>
                              </div>
                              <div className="text-end">
                                <button className="btn btn-secondary d-inline-flex align-items-center rounded-5 text-white text-12 px-3 py-1 fw-bold">
                                  ❤️ {item.likes.split(";").length}
                                </button>
                                <button className="btn btn-secondary d-inline-flex align-items-center rounded-5 text-white text-12 px-3 py-1 fw-bold ms-2">
                                  💬 {item.comments.length}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#snapshareCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#snapshareCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Next</span>
              </button>

              {/* Carousel Indicators */}
              <div className="carousel-indicators">
                {this.props.items.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#snapshareCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-current={index === 0 ? "true" : "false"}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <hr className="my-3 border-top border-gray" />
        <div className="d-flex justify-content-between align-items-center px-3">
          {/* View All Button (Left) */}
          <a
            className="btn btn-outline-primary d-flex align-items-center px-4 py-2 rounded-pill"
            href={this.props.pageLink}
          >
            <span>View All</span>
            <svg
              className="ms-2"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>

          {/* Add New Button (Right) */}
          <a
            href={`${this.props.pageLink}/SitePages/MarketPlace.aspx`}
            className="btn btn-primary d-flex align-items-center px-4 py-2 rounded-pill"
          >
            <svg
              className="me-2"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1429 6.85735H0.857143C0.342857 6.85735 0 6.51449 0 6.00021C0 5.48592 0.342857 5.14307 0.857143 5.14307H11.1429C11.6571 5.14307 12 5.48592 12 6.00021C12 6.51449 11.6571 6.85735 11.1429 6.85735Z"
                fill="#fff"
              />
              <path
                d="M6.00021 12C5.48592 12 5.14307 11.6571 5.14307 11.1429V0.857143C5.14307 0.342857 5.48592 0 6.00021 0C6.51449 0 6.85735 0.342857 6.85735 0.857143V11.1429C6.85735 11.6571 6.51449 12 6.00021 12Z"
                fill="#fff"
              />
            </svg>
            Add New
          </a>
        </div>
      </div>
    );
  }
}
