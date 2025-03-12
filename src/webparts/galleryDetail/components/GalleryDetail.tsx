import * as React from "react";
import type { IGalleryDetailProps } from "./IGalleryDetailProps";
import Gallery from "./Gallery";
import PnpService from "../../../service/pnpService";
interface IGalleryDetailState {
  galleryItems: Record<string, string[]>;
}
export default class GalleryDetail extends React.Component<
  IGalleryDetailProps,
  IGalleryDetailState
> {
  constructor(props: IGalleryDetailProps) {
    super(props);
    this.state = {
      galleryItems: {},
    };
  }
  async componentDidMount(): Promise<void> {
    PnpService.init(this.props.context);

    // Fetch data in parallel
    const [galleryItems] = await Promise.all([
      PnpService.getDocumentLibraryWithFoldersAndImages(),
    ]);

    this.setState({ galleryItems });
  }

  public render(): React.ReactElement<IGalleryDetailProps> {
    const { galleryItems } = this.state;
    return <Gallery items={galleryItems} />;
  }
}
