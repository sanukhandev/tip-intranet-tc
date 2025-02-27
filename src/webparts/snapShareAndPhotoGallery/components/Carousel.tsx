import * as React from "react";
import { getUserProfilePicture } from "../../../helper";

interface CarouselProps {
  items: {
    id: number;
    title: string;
    postedBy: string;
    postedByEmail: string;
    postedByRole: string;
    likes?: number;
    images: string[];
  }[];
}

export default class Carousel extends React.Component<CarouselProps> {
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
                                  ❤️ {item.likes}
                                </button>
                                <button className="btn btn-secondary d-inline-flex align-items-center rounded-5 text-white text-12 px-3 py-1 fw-bold ms-2">
                                  💬 {0}
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
      </div>
    );
  }
}
