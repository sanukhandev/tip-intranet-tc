import * as React from "react";
import type { IWelcomeMessageProps } from "./IWelcomeMessageProps";

export default class WelcomeMessage extends React.Component<
  IWelcomeMessageProps,
  {}
> {
  public render(): React.ReactElement<IWelcomeMessageProps> {
    const { userDisplayName } = this.props;

    return (
      <div
        className="d-flex justify-content-center align-items-center"
        bis-skin-checked="1"
      >
        <div className="custom-card welcome-info" bis-skin-checked="1">
          <span className="close-btn">&times;</span>
          <p className="mb-1">
            {new Date().toLocaleString("en-US", {
              weekday: "long",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </p>
          <h2>Good Morning! {userDisplayName}</h2>
          <p>
            We value teamwork and communication.
            <br />
            Explore, connect and thrive with us!
          </p>
          <a href="#">
            Explore more
            <svg
              className="ms-1 mb-1"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.69212 4.60568L5.22577 9.14887L4.7986 8.71434L8.53401 4.91468H0V4.29669H8.53401L4.7986 0.497023L5.22577 0.0625L9.69212 4.60568Z"
                fill="white"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    );
  }
}
