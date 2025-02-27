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
          </div>
          <div className="tab-pane p-2 fade" id="photo-gallery" role="tabpanel">
            <Gallery items={galleryItems} />
          </div>
        </div>
      </div>
    );
  }
}
