import React from "react";

export const TopBar: React.FC = () => {
  return (
    <header className="topbar">

      <div className="mobile-brand">
        <span className="brand-mark">P</span>
        <strong>Parkitects</strong>
      </div>

      <label className="search-box">
        <i
          className="fa-solid fa-magnifying-glass"
          aria-hidden="true"
        ></i>

        <input
          type="search"
          placeholder="Search this view"
          autoComplete="off"
        />

        <kbd>⌘ K</kbd>
      </label>

      <div className="topbar-actions">

        <button
          className="icon-button theme-button"
          type="button"
          aria-label="Switch theme"
        >
          <i
            className="theme-icon fa-solid fa-moon"
            aria-hidden="true"
          ></i>
        </button>

        <button
          className="icon-button notification-button"
          type="button"
          aria-label="Notifications"
        >
          <i
            className="fa-solid fa-bell"
            aria-hidden="true"
          ></i>

          <span className="notification-dot"></span>
        </button>

        <button
          className="profile-button"
          type="button"
        >
          <span className="avatar">
            SG
          </span>

          <span className="profile-name">
            Security
          </span>

          <i
            className="fa-solid fa-chevron-down"
            aria-hidden="true"
          ></i>
        </button>

      </div>

    </header>
  );
};

export default TopBar;