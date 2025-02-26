import * as React from "react";
import type { ICompanyCalenderProps } from "./ICompanyCalenderProps";
import PnpService from "../../../service/pnpService";
import { EVENTS_LIST_NAME } from "../../../CONSTANTS";
import styles from "./CompanyCalender.module.scss";

interface ICompanyCalendarState {
  events: { [key: string]: IEvent[] }; // Grouped by date
  currentMonth: Date;
  calendarDays: (number | null)[][];
  selectedDate: string; // YYYY-MM-DD format
  selectedDateEvents: IEvent[];
}

interface IEvent {
  Title: string;
  Description: string;
  Location: string;
  Category: string;
  ImageUrl: string;
  RegistrationLink: string;
  StartDate: string;
  EndDate: string;
  EventType: string;
}

export default class CompanyCalender extends React.Component<
  ICompanyCalenderProps,
  ICompanyCalendarState
> {
  constructor(props: ICompanyCalenderProps) {
    super(props);
    const today = new Date().toISOString().split("T")[0];

    this.state = {
      events: {},
      currentMonth: new Date(),
      calendarDays: this.generateCalendar(new Date()),
      selectedDate: today, // Select today's date by default
      selectedDateEvents: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    PnpService.init(this.props.context);
    const eventsByDate = await this.getEvents();
    const todayEvents = eventsByDate[this.state.selectedDate] || [];

    this.setState({
      events: eventsByDate,
      selectedDateEvents: todayEvents, // Display today's events by default
    });
  }

  private generateCalendar(date: Date): (number | null)[][] {
    date.setDate(1);
    const firstDayIndex = (date.getDay() + 6) % 7; // Adjust Sunday-based index to Monday-based
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    const daysArray: (number | null)[][] = [];
    const week: (number | null)[] = new Array(7).fill(null);
    let dayCounter = 1;

    for (let i = firstDayIndex; i < 7; i++) {
      week[i] = dayCounter++;
    }
    daysArray.push([...week]);

    while (dayCounter <= daysInMonth) {
      const week: (number | null)[] = [];
      for (let i = 0; i < 7; i++) {
        if (dayCounter <= daysInMonth) {
          week.push(dayCounter++);
        } else {
          week.push(null);
        }
      }
      daysArray.push([...week]);
    }
    return daysArray;
  }

  private async getEvents(): Promise<{ [key: string]: IEvent[] }> {
    const items = await PnpService.getItems(EVENTS_LIST_NAME, [
      "Status eq 'Published'",
    ]);
    const eventsByDate: { [key: string]: IEvent[] } = {};
    items.forEach((item) => {
      const eventDate = new Date(item.StartDate).toISOString().split("T")[0];
      if (!eventsByDate[eventDate]) {
        eventsByDate[eventDate] = [];
      }
      eventsByDate[eventDate].push({
        Title: item.Title,
        Description: item.Description,
        Location: item.Location,
        Category: item.Category,
        ImageUrl: item.Image
          ? item.Image.Url
          : "assets/images/default-placeholder.png",
        RegistrationLink: item.RegistrationLink,
        StartDate: item.StartDate,
        EndDate: item.EndDate,
        EventType: item.EventType,
      });
    });

    return eventsByDate;
  }

  private changeMonth(offset: number): void {
    const newMonth = new Date(this.state.currentMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    this.setState({
      currentMonth: newMonth,
      calendarDays: this.generateCalendar(newMonth),
    });
  }

  private handleDateClick(day: number): void {
    const selectedDate = new Date(
      this.state.currentMonth.getFullYear(),
      this.state.currentMonth.getMonth(),
      day + 1
    )
      .toISOString()
      .split("T")[0];

    this.setState({
      selectedDate,
      selectedDateEvents: this.state.events[selectedDate] || [],
    });
  }

  public render(): React.ReactElement<ICompanyCalenderProps> {
    return (
      <div id="calendar">
        <div className="d-flex align-items-center justify-content-between py-2 pb-4">
          <h4 className="text-left fw-bold mb-0">Company Calendar</h4>
        </div>

        <div
          id="calendar-controls"
          className="bg-blue custom p-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
        >
          <button
            className="btn btn-light border-0 bg-transparent"
            onClick={() => this.changeMonth(-1)}
          >
            &lt;
          </button>
          <span id="monthYear">
            {this.state.currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            className="btn btn-light border-0 bg-transparent"
            onClick={() => this.changeMonth(1)}
          >
            &gt;
          </button>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Mo</th>
              <th>Tu</th>
              <th>We</th>
              <th>Th</th>
              <th>Fr</th>
              <th>Sa</th>
              <th>Su</th>
            </tr>
          </thead>
          <tbody>
            {this.state.calendarDays.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((day, dayIndex) => {
                  if (day) {
                    const formattedDate = new Date(
                      this.state.currentMonth.getFullYear(),
                      this.state.currentMonth.getMonth(),
                      day + 1
                    )
                      .toISOString()
                      .split("T")[0];

                    const today = new Date();
                    const todayFormatted = `${today.getFullYear()}-${String(
                      today.getMonth() + 1
                    ).padStart(2, "0")}-${String(today.getDate()).padStart(
                      2,
                      "0"
                    )}`;

                    return (
                      <td
                        key={dayIndex}
                        className={`calendar-day 
          ${
            this.state.selectedDate === formattedDate
              ? "highlight-selected"
              : ""
          } 
          ${todayFormatted === formattedDate ? "highlight-today" : ""} 
        `}
                        onClick={() => this.handleDateClick(day)}
                        style={{ cursor: "pointer", position: "relative" }}
                      >
                        {day}
                      </td>
                    );
                  } else {
                    return <td key={dayIndex} className="empty-day" />;
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex flex-wrap justify-content-between w-100 py-3 border px-3 rounded-3">
          <div className="d-flex align-items-center">
            <span className="event" />
            Events
          </div>

          <div className="d-flex align-items-center">
            <span className="holiday" />
            Holidays
          </div>
        </div>

        {/* Events Displayed Below the Calendar */}
        <div className="pt-4">
          {this.state.selectedDateEvents.length > 0 ? (
            this.state.selectedDateEvents.map((event, index) => (
              <div key={index} className="event-item py-2">
                <span className={event.EventType.toLocaleLowerCase()} />
                <span className="ps-1">
                  {new Date(event.StartDate).toLocaleDateString()}
                </span>
                <h5 className="fw-bold pt-2">{event.Title}</h5>
              </div>
            ))
          ) : (
            <p>No events for this date.</p>
          )}
        </div>
      </div>
    );
  }
}
