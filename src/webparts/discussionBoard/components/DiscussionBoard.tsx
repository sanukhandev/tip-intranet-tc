import * as React from "react";
import type { IDiscussionBoardProps } from "./IDiscussionBoardProps";
import PnpService from "../../../service/pnpService";
import { getUserProfilePicture } from "../../../helper";

interface IDiscussionBoardState {
  currentUser: {
    id: number;
    name: string;
    email: string;
    loginName: string;
    jobTitle: string;
  };
}

export default class DiscussionBoard extends React.Component<
  IDiscussionBoardProps,
  IDiscussionBoardState
> {
  constructor(props: IDiscussionBoardProps) {
    super(props);
    PnpService.init(this.props.context);
    this.state = {
      currentUser: {
        id: 0,
        name: "",
        email: "",
        loginName: "",
        jobTitle: "",
      },
    };
  }

  async componentDidMount(): Promise<void> {
    await this.fetchCurrentUser();
  }
  async fetchCurrentUser(): Promise<void> {
    PnpService.init(this.props.context);
    const currentUser = await PnpService.getCurrentUser();
    this.setState({ currentUser });
  }
  private renderDiscussionBoard(): JSX.Element {
    return (
      <div className="list-group">
        <div className="list-group-item bg-transparent p-0 border-0">
          <div className="mb-3">
            <div className="d-flex my-1">
              <div className="left me-3">
                <img
                  className="rounded-circle cmn-pro-pic"
                  src={getUserProfilePicture(this.state.currentUser.email)}
                  alt="Profile"
                />
              </div>
              <div className="right">
                <label htmlFor="newPost" className="form-label mb-0">
                  <strong>{this.state.currentUser.name}</strong>
                </label>
                <p className="mb-0">
                  <small>- {this.state.currentUser.jobTitle} </small>
                </p>
              </div>
            </div>
          </div>
          <div className="mb-3 p-3 bg-white rounded-3">
            <div className="content">
              <textarea
                className="form-control custom w-100 border-0 text-base"
                id="newPost"
                rows={3}
                placeholder="Hi everyone! What are your top tips for staying productive while working from home?"
              />
            </div>
            <hr />
            <div className="text-end">
              <button className="btn btn-secondary rounded-5 text-white">
                Cancel
              </button>
              <button className="btn btn-primary rounded-5 text-white">
                Post
              </button>
            </div>
          </div>
        </div>
        {this.renderDiscussionPosts()}
      </div>
    );
  }

  private renderDiscussionPosts(): JSX.Element {
    const posts = [
      {
        name: "Ans Qaiser",
        role: "Software Engineer",
        date: "Sept 14, 2024",
        profilePic: "assets/images/ans.jpg",
        content: "What training or workshops would you like to see offered?",
        likes: 99,
        comments: 23,
      },
      {
        name: "Sivabalan Sivakumar",
        role: "Technology Head Analyst",
        date: "Sept 14, 2024",
        profilePic: "assets/images/ans.jpg",
        content: "What training or workshops would you like to see offered?",
        likes: 99,
        comments: 23,
      },
    ];

    return (
      <>
        {posts.map((post, index) => (
          <div
            key={index}
            className="list-group-item p-3 bg-white rounded-3 border-0 mb-3"
          >
            <div className="mb-3">
              <div className="d-flex my-1">
                <div className="left me-3">
                  <img
                    className="rounded-circle cmn-pro-pic"
                    src={post.profilePic}
                    alt="Profile"
                  />
                </div>
                <div className="right w-100">
                  <label
                    htmlFor="newPost"
                    className="form-label mb-0 d-flex justify-content-between"
                  >
                    <strong>{post.name}</strong>
                    <span className="text-end">
                      <small>{post.date}</small>
                    </span>
                  </label>
                  <p className="mb-0">
                    <small>{post.role}</small>
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-3 p-0 bg-white rounded-3">
              <div className="content">
                <p className="text-base">{post.content}</p>
              </div>
              <hr />
              <div className="text-start">
                <button className="btn btn-secondary d-inline-flex align-items-center rounded-5 text-white text-12 px-3 py-1 fw-bold">
                  <svg
                    className="me-1"
                    width="14"
                    height="12"
                    viewBox="0 0 14 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.7652 1.17436C12.067 0.417075 11.1089 0 10.0673 0C9.28872 0 8.57569 0.24615 7.94796 0.731554C7.63122 0.976572 7.34422 1.27634 7.09117 1.62621C6.83823 1.27644 6.55113 0.976572 6.23428 0.731554C5.60666 0.24615 4.89363 0 4.11505 0C3.07344 0 2.11529 0.417075 1.41708 1.17436C0.727197 1.92279 0.347168 2.94525 0.347168 4.05354C0.347168 5.19425 0.77227 6.23843 1.68494 7.33973C2.50139 8.32484 3.67482 9.32487 5.03368 10.4829C5.49768 10.8783 6.02363 11.3266 6.56975 11.8041C6.71403 11.9304 6.89915 12 7.09117 12C7.28309 12 7.46832 11.9304 7.61239 11.8043C8.15851 11.3267 8.68477 10.8782 9.14897 10.4826C10.5076 9.32477 11.6811 8.32484 12.4975 7.33962C13.4102 6.23843 13.8352 5.19425 13.8352 4.05344C13.8352 2.94525 13.4551 1.92279 12.7652 1.17436Z"
                      fill="#EE7744"
                    />
                  </svg>
                  {post.likes}
                </button>
                <button className="btn btn-secondary d-inline-flex align-items-center rounded-5 text-white text-12 px-3 py-1 fw-bold">
                  {post.comments}
                </button>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  public render(): React.ReactElement<IDiscussionBoardProps> {
    return (
      <div className="card border-0 bg-transparent">
        <div className="card-body px-0">
          <h4 className="text-left fw-bold pb-4">Discussion Board</h4>
          {this.renderDiscussionBoard()}
        </div>
      </div>
    );
  }
}
