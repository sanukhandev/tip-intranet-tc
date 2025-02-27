import * as React from "react";

export default class Tabs extends React.Component<{}, {}> {
  public render(): React.ReactElement<{}> {
    return (
      <ul className="nav nav-tabs custom border-0" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link text-black py-3 active"
            id="snap-and-share-tab"
            data-bs-toggle="tab"
            data-bs-target="#snap-and-share"
            type="button"
            role="tab"
            aria-controls="snap-and-share"
            aria-selected="true"
          >
            Snap And Share
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link text-black py-3"
            id="photo-gallery-tab"
            data-bs-toggle="tab"
            data-bs-target="#photo-gallery"
            type="button"
            role="tab"
            aria-controls="photo-gallery"
            aria-selected="false"
          >
            Photo Gallery
          </button>
        </li>
      </ul>
    );
  }
}
