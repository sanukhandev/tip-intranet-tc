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
      {/* Tab Navigation */}
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

      {/* Tab Content */}
      <div
        className="tab-content bg-white p-3 border rounded-bottom-3 border-top-0"
        id="myTabContent"
      >
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
            id={tab.id}
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
          >
            {children[index] || <p>No Content Available</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabbedLayout;
