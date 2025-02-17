import * as React from 'react';
import type { ITabbedListProps } from './ITabbedListProps';
import PnpService from '../../../service/pnpService';
import { ANNOUNCEMENTS_LIST, EMPLOYEE_MASTER, EVENTS_LIST_NAME } from '../../../CONSTANTS';

interface ITabbedComponentState {
  announcements: any[];
  events: any[];
  birthdays: any[];
  anniversaries: any[];
  joiners: any[];
}

export default class TabbedList extends React.Component<ITabbedListProps, ITabbedComponentState> {
 constructor(props: ITabbedListProps) {
    super(props);
    this.state = {
      announcements: [],
      events: [],
      birthdays: [],
      anniversaries: [],
      joiners: []
    };
  }

  public async componentDidMount(): Promise<void> {
    PnpService.init(this.props.context);
    const [announcements, events, birthdays, anniversaries, joiners] =
      await Promise.all([
        this.getListItems(ANNOUNCEMENTS_LIST),
        this.getListItems(EVENTS_LIST_NAME),
        this.getListItems(EMPLOYEE_MASTER),
        this.getListItems(EMPLOYEE_MASTER),
        this.getListItems(EMPLOYEE_MASTER),
      ]);

    this.setState({ announcements, events, birthdays, anniversaries, joiners });
  }

  private async getListItems(listName: string): Promise<any[]> {
    return await PnpService.getItems(listName);
  }
  public render(): React.ReactElement<ITabbedListProps> {
    return (
      <div>
        <ul className="nav nav-tabs custom" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="announcements-tab"
              data-bs-toggle="tab"
              data-bs-target="#announcements"
            >
              Announcements
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="events-tab"
              data-bs-toggle="tab"
              data-bs-target="#events"
            >
              Events
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="birthdays-tab"
              data-bs-toggle="tab"
              data-bs-target="#birthdays"
            >
              Birthdays
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="anniversaries-tab"
              data-bs-toggle="tab"
              data-bs-target="#anniversaries"
            >
              Anniversaries
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="joiners-tab"
              data-bs-toggle="tab"
              data-bs-target="#joiners"
            >
              New Joiners
            </button>
          </li>
        </ul>

        <div
          className="tab-content bg-white p-3 border rounded-bottom-3 border-top-0"
          id="myTabContent"
        >
          <div className="tab-pane fade show active" id="announcements">
            {this.state.announcements.map((item, index) => (
              <div key={index} className="card">
                <img
                  src={item.ImageUrl || "assets/images/default-placeholder.png"}
                  alt={item.Title}
                />
                <div className="card-body">
                  <h4>{item.Title}</h4>
                  <p>{item.Description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="tab-pane fade" id="events">
            {this.state.events.map((item, index) => (
              <div key={index} className="card">
                <img
                  src={item.ImageUrl || "assets/images/default-placeholder.png"}
                  alt={item.Title}
                />
                <div className="card-body">
                  <h4>{item.Title}</h4>
                  <p>{item.Description}</p>
                  <a href={item.RegistrationLink} target="_blank">
                    Register
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="tab-pane fade" id="birthdays">
            {this.state.birthdays.map((item, index) => (
              <div key={index} className="card">
                <img
                  src={item.ImageUrl || "assets/images/default-placeholder.png"}
                  alt={item.Name}
                  className="rounded-circle"
                />
                <div className="card-body">
                  <h6>{item.Name}</h6>
                  <p>{item.Position}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="tab-pane fade" id="anniversaries">
            {this.state.anniversaries.map((item, index) => (
              <div key={index} className="card">
                <h6>{item.Name}</h6>
                <p>{item.Years} Year Work Anniversary</p>
              </div>
            ))}
          </div>

          <div className="tab-pane fade" id="joiners">
            {this.state.joiners.map((item, index) => (
              <div key={index} className="card">
                <h6>{item.Name}</h6>
                <p>{item.Position}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
