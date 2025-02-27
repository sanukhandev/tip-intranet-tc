import * as React from "react";

interface GalleryProps {
  items: Record<string, string[]>; // Folder names as keys, array of image URLs as values
}

interface GalleryState {
  selectedFolder: string | null;
  selectedImages: string[];
  currentIndex: number;
}

export default class Gallery extends React.Component<
  GalleryProps,
  GalleryState
> {
  constructor(props: GalleryProps) {
    super(props);
    this.state = {
      selectedFolder: null,
      selectedImages: [],
      currentIndex: 0,
    };
  }

  openModal = (folder: string, images: string[], index: number) => {
    this.setState({
      selectedFolder: folder,
      selectedImages: images,
      currentIndex: index,
    });
  };

  closeModal = () => {
    this.setState({
      selectedFolder: null,
      selectedImages: [],
      currentIndex: 0,
    });
  };

  prevImage = () => {
    this.setState((prevState) => ({
      currentIndex:
        prevState.currentIndex === 0
          ? prevState.selectedImages.length - 1
          : prevState.currentIndex - 1,
    }));
  };

  nextImage = () => {
    this.setState((prevState) => ({
      currentIndex:
        (prevState.currentIndex + 1) % prevState.selectedImages.length,
    }));
  };

  public render(): React.ReactElement {
    const { selectedFolder, selectedImages, currentIndex } = this.state;

    return (
      <>
        {/* Gallery Grid */}
        <div
          className="tab-pane p-2 fade active show"
          id="photo-gallery"
          role="tabpanel"
          aria-labelledby="photo-gallery-tab"
        >
          <div className="row m-0">
            {Object.entries(this.props.items)
              .filter(([folder]) => folder !== "Forms")
              .map(([folder, images], folderIndex) => (
                <div
                  className="col-md-6 col-sm-6 p-3"
                  key={`${folderIndex}-${folder}`}
                >
                  <div className="gallery-sec rounded-3 overflow-hidden">
                    <img
                      src={images[0]}
                      className="card-img-top cursor-pointer"
                      alt={folder}
                      onClick={() => this.openModal(folder, images, 0)}
                    />
                    <a
                      className="card-body"
                      data-bs-toggle="modal"
                      data-bs-target="#galleryModal"
                    >
                      <p className="card-text text-white position-relative">
                        <span className="front-tag left-0 top-5 text-white bg-gray-shade px-4 py-1 rounded-4 d-flex align-items-center">
                          <svg
                            className="me-2"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.35081 0H2.65314C1.95001 0 1.27567 0.279318 0.778484 0.776508C0.281295 1.2737 0.00197688 1.94803 0.00197688 2.65116V9.34884C-0.000658961 9.35795 -0.000658961 9.36763 0.00197688 9.37674C0.00932766 10.075 0.291887 10.7422 0.788282 11.2334C1.28468 11.7246 1.95482 12 2.65314 12H9.35081C10.0463 11.9986 10.7133 11.724 11.2082 11.2354C11.7031 10.7468 11.9861 10.0833 11.9964 9.38791V2.65116C11.9964 1.949 11.7178 1.27551 11.2219 0.778478C10.7259 0.281449 10.053 0.00147824 9.35081 0ZM11.1648 8.23256L8.83174 5.56465C8.68351 5.40685 8.50453 5.28108 8.30582 5.19511C8.10711 5.10914 7.8929 5.06478 7.67639 5.06478C7.45989 5.06478 7.24568 5.10914 7.04697 5.19511C6.84827 5.28108 6.66928 5.40685 6.52105 5.56465L4.91919 7.39535L4.39453 6.75907C4.24996 6.58564 4.06904 6.44611 3.86456 6.35036C3.66009 6.25461 3.43706 6.20498 3.21128 6.20498C2.9855 6.20498 2.76247 6.25461 2.558 6.35036C2.35352 6.44611 2.1726 6.58564 2.02802 6.75907L0.839186 8.19349V2.65116C0.840658 2.17053 1.03224 1.70999 1.37211 1.37013C1.71197 1.03027 2.1725 0.838681 2.65314 0.837209H9.35081C9.83145 0.838681 10.292 1.03027 10.6318 1.37013C10.9717 1.70999 11.1633 2.17053 11.1648 2.65116V8.23256Z"
                              fill="white"
                            />
                          </svg>
                          {images.length}
                        </span>
                      </p>
                      <h5 className="card-title text-white mb-3 d-grid align-items-end">
                        {folder}
                      </h5>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Image Modal with Carousel */}
        {selectedFolder && (
          <div
            className="modal fade show d-block"
            id="galleryModal"
            tabIndex={-1}
            aria-labelledby="galleryModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedFolder}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={this.closeModal}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="carousel slide" id="galleryCarousel">
                    <div className="carousel-inner">
                      {selectedImages.map((image, index) => (
                        <div
                          key={index}
                          className={`carousel-item ${
                            index === currentIndex ? "active" : ""
                          }`}
                        >
                          <img
                            src={image}
                            className="d-block w-100"
                            alt={`Slide ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      className="carousel-control-prev"
                      onClick={this.prevImage}
                    >
                      <span className="carousel-control-prev-icon" />
                    </button>
                    <button
                      className="carousel-control-next"
                      onClick={this.nextImage}
                    >
                      <span className="carousel-control-next-icon" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
