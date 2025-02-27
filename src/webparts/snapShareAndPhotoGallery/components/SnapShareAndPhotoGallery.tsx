import * as React from "react";
import type { ISnapShareAndPhotoGalleryProps } from "./ISnapShareAndPhotoGalleryProps";
import Tabs from "./Tabs";
import Carousel from "./Carousel";
import Gallery from "./Gallery";
import PnpService from "../../../service/pnpService";

interface ISnapShareAndPhotoGalleryState {
  carouselItems: {
    image: string;
    alt: string;
    profilePic: string;
    name: string;
    role: string;
    likes: number;
    comments: number;
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
      carouselItems: [
        {
          image:
            "https://techcarrot.co.in/staging/tip/assets/images/snapshare-01.jpg",
          alt: "Snap 1",
          profilePic:
            "https://techcarrot.co.in/staging/tip/assets/images/ans.jpg",
          name: "Sivabalan Sivakumar",
          role: "Technology Head Analyst",
          likes: 99,
          comments: 23,
        },
        {
          image:
            "https://techcarrot.co.in/staging/tip/assets/images/announcements.jpg",
          alt: "Snap 1",
          profilePic:
            "https://techcarrot.co.in/staging/tip/assets/images/ans.jpg",
          name: "Sivabalan Sivakumar",
          role: "Technology Head Analyst",
          likes: 99,
          comments: 23,
        },
      ],
      galleryItems: {},
    };
  }

  async componentDidMount(): Promise<void> {
    PnpService.init(this.props.context);
    await this.fetchPhotoGallery();
  }
  private async fetchPhotoGallery(): Promise<void> {
    const items = await PnpService.getDocumentLibraryWithFoldersAndImages();
    this.setState({
      ...this.state,
      galleryItems: items,
    });
  }
  public render(): React.ReactElement<ISnapShareAndPhotoGalleryProps> {
    return (
      <div className="container">
        <Tabs />
        <div className="tab-content rounded-bottom-3 bg-white border">
          <div
            className="tab-pane p-2 fade show active"
            id="snap-and-share"
            role="tabpanel"
          >
            <Carousel items={this.state.carouselItems} />
          </div>
          <div className="tab-pane p-2 fade" id="photo-gallery" role="tabpanel">
            <Gallery items={this.state.galleryItems} />
          </div>
        </div>
      </div>
    );
  }
}
