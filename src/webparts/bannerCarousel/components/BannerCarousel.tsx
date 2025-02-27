import * as React from "react";
import PnpService from "../../../service/pnpService";
import { CAROUSEL_LIST_NAME } from "../../../CONSTANTS";
import { IBannerCarouselProps } from "./IBannerCarouselProps";
import { getImageURL } from "../../../helper";

interface ICarouselState {
  items: any[];
}

export default class CarouselComponent extends React.Component<
  IBannerCarouselProps,
  ICarouselState
> {
  constructor(props: IBannerCarouselProps) {
    super(props);
    PnpService.init(this.props.context);
    this.state = {
      items: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    PnpService.init(this.props.context);
    const items = await this.getCarouselItems();
    this.setState({ items });
  }

  private async getCarouselItems(): Promise<any[]> {
    const items = await PnpService.getItemsWithAttachments(CAROUSEL_LIST_NAME);
    return items.map((item) => {
      return {
        Title: item.Title,
        ImageUrl: getImageURL(item),
      };
    });
  }

  public render(): React.ReactElement<{}> {
    return (
      <div
        id="carouselExampleIndicators"
        className="banner carousel slide pointer-event"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators justify-content-end me-5">
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
             />
            <span className="visually-hidden">Previous</span>
          </button>
          {this.state.items.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-label={`Slide ${index + 1}`}
              aria-current={index === 0 ? "true" : undefined}
             />
          ))}
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
             />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <div className="carousel-inner">
          {this.state.items.map((item, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={item.ImageUrl}
                className="d-block w-100"
                alt={item.Title}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
