import React from "react";
import parkitechlogo from "../assets/parkitechlogo";
import { NavLink } from "react-router-dom";

export const SideBar: React.FC = () => {
  return (
    <aside className="sidebar">

      {/* Collapse button */}
      <button
        className="sidebar-toggle"
        type="button"
        aria-label="Collapse sidebar"
      >
        <i
          className="fa-solid fa-chevron-left"
          aria-hidden="true"
        ></i>
      </button>

      {/* Brand */}
      <div className="brand">
        <span className="brand-mark">P</span>

        <span className="brand-copy">
          <strong>Parkitects</strong>
          <small>Smart Parking</small>
        </span>
      </div>

      {/* Navigation */}
      <nav className="primary-nav" aria-label="Primary navigation">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-item ${isActive ? "is-active" : ""}`
          }
        >
          <i
            className="nav-icon fa-solid fa-table-columns"
            aria-hidden="true"
          ></i>

          <span className="nav-label">Dashboard</span>
        </NavLink>

        <NavLink
          to="/tickets"
          className={({ isActive }) =>
            `nav-item ${isActive ? "is-active" : ""}`
          }
        >
          <i
            className="nav-icon fa-solid fa-ticket"
            aria-hidden="true"
          ></i>

          <span className="nav-label">Tickets</span>
        </NavLink>

        <NavLink
          to="/responses"
          className={({ isActive }) =>
            `nav-item ${isActive ? "is-active" : ""}`
          }
        >
          <i
            className="nav-icon fa-solid fa-square-parking"
            aria-hidden="true"
          ></i>

          <span className="nav-label">Ticket Responses</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `nav-item ${isActive ? "is-active" : ""}`
          }
        >
          <i
            className="nav-icon fa-solid fa-chart-line"
            aria-hidden="true"
          ></i>

          <span className="nav-label">Analytics</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "is-active" : ""}`
          }
        >
          <i
            className="nav-icon fa-solid fa-gear"
            aria-hidden="true"
          ></i>

          <span className="nav-label">Settings</span>
        </NavLink>

      </nav>

      {/* Sidebar footer */}
      <div className="sidebar-footer">

        <div className="plan-card">

          <div className="plan-row">
            <span>Parking status</span>
            <strong>Live</strong>
          </div>

          <div className="progress-track">
            <span style={{ width: "72%" }}></span>
          </div>

          <small>Campus parking activity</small>

        </div>

        <button className="sidebar-user" type="button">

          <span className="avatar">P</span>

          <span className="user-copy">
            <strong>Parkitects</strong>
            <small>Administrator</small>
          </span>

          <i
            className="more-mark fa-solid fa-ellipsis"
            aria-hidden="true"
          ></i>

        </button>

      </div>

    </aside>
  );
};


export default SideBar;