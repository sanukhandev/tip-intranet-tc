import * as React from "react";
import type { ISnapShareAndPhotoGalleryProps } from "./ISnapShareAndPhotoGalleryProps";
import Tabs from "./Tabs";
import Carousel from "./Carousel";
import Gallery from "./Gallery";
import PnpService from "../../../service/pnpService";

interface ISnapShareAndPhotoGalleryState {
  carouselItems: {
    id: number;
    title: string;
    postedBy: string;
    postedByEmail: string;
    postedByRole: string;
    likes?: number; // Making 'likes' optional since it wasn't included in your sample data
    images: string[];
    comments: {
      id: number;
      comment: string;
    }[];
  }[];
  galleryItems: Record<string, string[]>;
}

export default class SnapShareAndPhotoGallery extends React.Component<
  ISnapShareAndPhotoGalleryProps,
  ISnapShareAndPhotoGalleryState
> {
  constructor(props: ISnapShareAndPhotoGalleryProps) {
    super(props);
    this.state = {
      carouselItems: [],
      galleryItems: {},
    };
  }

  async componentDidMount(): Promise<void> {
    PnpService.init(this.props.context);

    // Fetch data in parallel
    const [carouselItems, galleryItems] = await Promise.all([
      PnpService.getSnapAndShareAndImages(),
      PnpService.getDocumentLibraryWithFoldersAndImages(),
    ]);

    this.setState({ carouselItems, galleryItems });
  }

  public render(): React.ReactElement<ISnapShareAndPhotoGalleryProps> {
    const { carouselItems, galleryItems } = this.state;

    return (
      <div className="container">
        <Tabs />
        <div className="tab-content rounded-bottom-3 bg-white border">
          <div
            className="tab-pane p-2 fade show active"
            id="snap-and-share"
            role="tabpanel"
          >
            <Carousel items={carouselItems} />
            <a
              className="main-btn background-none d-inline-flex align-items-center px-4 py-2 mb-1 rounded-5"
              href={`${this.props.context.pageContext.web.absoluteUrl}/SitePages/SnapAndShareDetail.aspx`}
            >
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
                />
              </svg>
            </a>
          </div>
          <div className="tab-pane p-2 fade" id="photo-gallery" role="tabpanel">
            <Gallery items={galleryItems} />
            <a
              className="main-btn background-none d-inline-flex align-items-center px-4 py-2 mb-1 rounded-5"
              href={`${this.props.context.pageContext.web.absoluteUrl}/SitePages/GalleryDetail.aspx`}
            >
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
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
