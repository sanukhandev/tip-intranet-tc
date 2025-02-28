import * as React from "react";
import type { IMyTaskProps } from "./IMyTaskProps";

export default class MyTask extends React.Component<IMyTaskProps, {}> {
  public renderTasks(): JSX.Element[] {
    const tasks = [
      {
        title: "Sobha Mobile App Development",
        status: "In progress",
        priority: "High",
        due: "Oct 14, 2024",
      },
      {
        title: "Ajman HRD",
        status: "Not Started",
        priority: "Low",
        due: "Oct 14, 2024",
      },
    ];

    return tasks.map((task, index) => (
      <div key={index} className="card p-3 my-2">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <span
            className={`task-badge badge custom bg-${task.status
              .replace(" ", "")
              .toLowerCase()} rounded-5 py-2 px-3`}
          >
            {task.status}
          </span>
          <span
            className={`task-badge badge custom bg-${task.priority
              .replace(" ", "")
              .toLowerCase()} rounded-5 py-2 px-4`}
          >
            {task.priority}
          </span>
          <div className="text-muted">
            <small>Due: {task.due}</small>
          </div>
        </div>
        <p className="card-text mt-3 text-base">{task.title}</p>
      </div>
    ));
  }

  public render(): React.ReactElement<IMyTaskProps> {
    return (
      <div className="card mb-5">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title fw-700">My Task</h5>
            <a className="main-btn background-none d-inline-flex align-items-center px-4 py-2 mb-1 rounded-5">
              <span>View All</span>
              <svg
                className="ml-2"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
          {this.renderTasks()}
        </div>
      </div>
    );
  }
}
