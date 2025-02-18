import * as React from "react";

interface ITabbedLayoutProps {
  children: React.ReactNode[];
}

const tabs = [
  { id: "announcements", label: "Announcements" },
  { id: "events", label: "Events" },
  { id: "birthdays", label: "Birthdays" },
  { id: "anniversaries", label: "Anniversaries" },
  { id: "joiners", label: "New Joiners" },
];

const TabbedLayout: React.FC<ITabbedLayoutProps> = ({ children }) => {
  return (
    <div>
      <ul className="nav nav-tabs custom" id="myTab" role="tablist">
        {tabs.map((tab, index) => (
          <li key={tab.id} className="nav-item" role="presentation">
            <button
              className={`nav-link ${index === 0 ? "active" : ""}`}
              id={`${tab.id}-tab`}
              data-bs-toggle="tab"
              data-bs-target={`#${tab.id}`}
              role="tab"
              aria-controls={tab.id}
              aria-selected={index === 0 ? "true" : "false"}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div
        className="tab-content bg-white p-3 border rounded-bottom-3 border-top-0"
        id="myTabContent"
      >
        {children.map((child, index) => (
          <div
            key={tabs[index].id}
            className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
            id={tabs[index].id}
            role="tabpanel"
            aria-labelledby={`${tabs[index].id}-tab`}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabbedLayout;
