import * as React from "react";

interface GalleryProps {
  items: Record<string, string[]>; // Folder names as keys, array of image URLs as values
  pageLink: string;
}

interface GalleryState {
  selectedFolder: string | null;
  selectedImages: string[];
  currentIndex: number;
  showModal: boolean;
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
      showModal: false, // Track modal visibility
    };
  }

  openModal = (folder: string, images: string[], index: number) => {
    this.setState({
      selectedFolder: folder,
      selectedImages: images,
      currentIndex: index,
      showModal: true,
    });

    // Ensure Bootstrap modal classes are applied properly
    document.body.classList.add("modal-open");
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop fade show";
    backdrop.id = "gallery-modal-backdrop";
    document.body.appendChild(backdrop);
  };

  closeModal = () => {
    this.setState({
      selectedFolder: null,
      selectedImages: [],
      currentIndex: 0,
      showModal: false,
    });

    // Remove Bootstrap modal classes and backdrop
    document.body.classList.remove("modal-open");
    const backdrop = document.getElementById("gallery-modal-backdrop");
    if (backdrop) backdrop.remove();
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

  handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as Element).classList.contains("modal")) {
      this.closeModal();
    }
  };

  render(): React.ReactElement {
    const { selectedFolder, selectedImages, currentIndex, showModal } =
      this.state;

    return (
      <>
        {/* Gallery Grid */}
        <div
          className="tab-pane p-2 fade active show"
          id="photo-gallery"
          role="tabpanel"
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
                      alt={`Preview of ${folder}`}
                      onClick={() => this.openModal(folder, images, 0)}
                    />
                    <button
                      className="card-body border-0 bg-transparent w-100 text-start"
                      onClick={() => this.openModal(folder, images, 0)}
                    >
                      <p className="card-text text-white position-relative mb-1">
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
                              d="M9.35081 0H2.65314C1.95001 0 1.27567 0.279318 0.778484 0.776508C0.281295 1.2737 0.00197688 1.94803 0.00197688 2.65116V9.34884C-0.000658961 9.35795 -0.000658961 9.36763 0.00197688 9.37674C0.00932766 10.075 0.291887 10.7422 0.788282 11.2334C1.28468 11.7246 1.95482 12 2.65314 12H9.35081C10.0463 11.9986 10.7133 11.724 11.2082 11.2354C11.7031 10.7468 11.9861 10.0833 11.9964 9.38791V2.65116C11.9964 1.949 11.7178 1.27551 11.2219 0.778478C10.7259 0.281449 10.053 0.00147824 9.35081 0Z"
                              fill="white"
                            />
                          </svg>
                          {images.length} Photos
                        </span>
                      </p>
                      <h5 className="card-title text-white mb-0 text-truncate">
                        {folder}
                      </h5>
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <a
            className="main-btn background-none d-inline-flex align-items-center px-4 py-2 mb-1 rounded-5"
            href={this.props.pageLink}
          >
            <span>View All</span>
          </a>
        </div>

        {/* Image Modal with Carousel */}
        {showModal && (
          <div
            className="modal fade show"
            tabIndex={-1}
            role="dialog"
            style={{ display: "block" }}
            onClick={this.handleOutsideClick}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">{selectedFolder}</h5>
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
                            className="d-block w-100 rounded-3"
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
