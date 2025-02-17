import * as React from "react";
import type { IQuickLinksProps } from "./IQuickLinksProps";
import PnpService from "../../../service/pnpService";
import { QUICK_LINKS_LIST_NAME } from "../../../CONSTANTS";
import { getImageURL } from "../../../helper";

interface IQuickLinksState {
  items: { Title: string; ImageUrl: string; Link: string }[];
}

export default class QuickLinks extends React.Component<
  IQuickLinksProps,
  IQuickLinksState
> {
  constructor(props: IQuickLinksProps) {
    super(props);
    this.state = {
      items: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    PnpService.init(this.props.context);
    const items = await this.getQuickLinks();
    this.setState({ items });
  }

  private async getQuickLinks(): Promise<IQuickLinksState["items"]> {
    const items = await PnpService.getItemsWithAttachments(
      QUICK_LINKS_LIST_NAME
    );
    return items.map((item) => ({
      Title: item.AppName,
      ImageUrl: getImageURL(item),
      Link: item.AppLink,
    }));
  }

  public render(): React.ReactElement<IQuickLinksProps> {
    return (
      <div>
        <h4 className="text-left mt-4 fw-bold">Quick Links</h4>
        <div className="row mt-3">
          {this.state.items.map((item, index) => (
            <a
              key={index}
              href={item.Link}
              className="col-sm-6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="card border-0 bg-white rounded-3 mb-2">
                <div className="card-body text-left p-0 d-flex align-items-center">
                  <div className="box p-2 m-2 bg-light-gray d-flex rounded-2">
                    <img
                      className="min-w-20 min-h-20"
                      src={item.ImageUrl}
                      alt={item.Title}
                    />
                  </div>
                  <h6 className="card-title mb-0 d-inline-block text-base">
                    {item.Title}
                  </h6>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }
}
