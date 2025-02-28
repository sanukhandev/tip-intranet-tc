import * as React from "react";
import type { IBuySellItemsProps } from "./IBuySellItemsProps";
import PnpService from "../../../service/pnpService";
import {
  BUY_SELL_ITEMS_IMAGES_LIBRARY,
  BUY_SELL_ITEMS_LIST,
} from "../../../CONSTANTS";

interface IBuySellState {
  items: {
    Title: string;
    Price: string;
    Description: string;
    Location: string;
    DatePosted: string;
    ImageUrl: string;
  }[];
}

export default class BuySellItems extends React.Component<
  IBuySellItemsProps,
  IBuySellState
> {
  constructor(props: IBuySellItemsProps) {
    super(props);
    this.state = {
      items: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    PnpService.init(this.props.context);
    const items = await this.getBuySellItems();
    this.setState({ items });
  }

  private async getBuySellItems(): Promise<IBuySellState["items"]> {
    const items = await PnpService.getItemsWithAttachments(BUY_SELL_ITEMS_LIST);
    return await Promise.all(
      items.map(async (item) => {
        const images = await PnpService.getLibraryImages(
          BUY_SELL_ITEMS_IMAGES_LIBRARY,
          item.ID
        );
        return {
          Title: item.Title,
          Price: item.Price,
          Description: item.Description || "No description available",
          Location: item.Location || "Unknown location",
          DatePosted: item.DatePosted || "Unknown date",
          ImageUrl:
            images.length > 0
              ? images[0]
              : "assets/images/default-placeholder.png",
        };
      })
    );
  }

  public render(): React.ReactElement<IBuySellItemsProps> {
    return (
      <div>
        <h4 className="text-left mt-4 fw-bold">Buy & Sell</h4>
        <div
          id="productCarousel"
          className="carousel slide pointer-event"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {this.state.items.map((item, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div className="card border-0">
                  <img
                    src={item.ImageUrl}
                    className="d-block w-100 card-img-top"
                    alt={item.Title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.Title}</h5>
                    <p className="card-text">AED {item.Price}</p>
                    <p className="card-text">
                      <small className="text-muted">
                        Listed on {item.DatePosted}
                      </small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">{item.Description}</small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center p-3">
            <a
              href={`${this.props.context.pageContext.web.absoluteUrl}/SitePages/MarketPlace.aspx`}
              className="add-btn rounded-pill bg-blue custom px-4 py-2 d-flex align-items-center"
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
                  fill="#2B2B6B"
                />
                <path
                  d="M6.00021 12C5.48592 12 5.14307 11.6571 5.14307 11.1429V0.857143C5.14307 0.342857 5.48592 0 6.00021 0C6.51449 0 6.85735 0.342857 6.85735 0.857143V11.1429C6.85735 11.6571 6.51449 12 6.00021 12Z"
                  fill="#2B2B6B"
                />
              </svg>
              Add New
            </a>
            <div className="carousel-indicators position-relative me-0 ms-0 mb-0">
              {this.state.items.slice(1, 5).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#productCarousel"
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
