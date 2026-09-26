//(rudderz243,2026)
import React, { useEffect,useState } from "react";
import {auth} from "../config/firebase";

const API_BASE_URL = "http://192.168.101.104:8080";

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("General");

  //Web security settings
  const [notifications, setNotifications] = useState({
    ticketUpdates: true,
    parkingAlerts: true,
    systemAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    compactTables: false,
  });

  //changes mode (Mustafamulla, 2024)
  useEffect(() =>{
    document.documentElement.setAttribute("data-theme", preferences.darkMode? "dark" : "light");
   }, [preferences.darkMode]);

   //changes the compact tables
  useEffect(() =>{
    document.documentElement.setAttribute("data-compact", preferences.compactTables? "true" : "false");
   }, [preferences.compactTables]);

  //This load's user's settings from the backend
  useEffect(() => {
    const loadSettings = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log("No user is logged in.");
        return;
      }
      try{
        const response = await fetch(`${API_BASE_URL}/api/Settings/user/${currentUser.uid}`);

        if (!response.ok){
          throw new Error("Failed to load settings.");
        }
        const settings = await response.json();

        //load web settings
        setNotifications({
          ticketUpdates: settings.ticketUpdates ?? true,
          parkingAlerts: settings.parkingAlerts ??  true,
          systemAlerts: settings.systemAlerts ?? true,
        });

        setPreferences({
          darkMode: settings.darkMode ?? false,
          compactTables: settings.compactTables ?? false,
        })
      }
      catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  //Saves the user's settings 
  const handleSave = async () => {
    const currentUser = auth.currentUser;

    if(!currentUser) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Settings/user/${currentUser.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: currentUser.uid,

            // Web settings
            darkMode: preferences.darkMode,
            compactTables: preferences.compactTables,
            ticketUpdates: notifications.ticketUpdates,
            parkingAlerts: notifications.parkingAlerts,
            systemAlerts: notifications.systemAlerts,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);

        throw new Error(errorText);
      }

      alert("Settings saved successfully.");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    }
  };
  
  return (
    <section
      className="page is-active"
      aria-labelledby="settingsTitle"
    >

      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">System preferences</p>

          <h1 id="settingsTitle">
            Settings
          </h1>

          <p>
            Manage your account, notifications, and parking system preferences.
          </p>
        </div>

        <button
          className="button primary"
          type="button"
          onClick={handleSave}
        >
          Save changes
        </button>
      </div>

      <div className="settings-layout">

        <nav
          className="settings-nav"
          aria-label="Settings sections"
        >
          {[
            "General",
            "Notifications",
            "System",
          ].map((section) => (
            <button
              key={section}
              type="button"
              className={
                activeSection === section
                  ? "is-active"
                  : ""
              }
              onClick={() => setActiveSection(section)}
            >
              {section}
            </button>
          ))}
        </nav>


        {/* SETTINGS CONTENT */}
        <div className="settings-content">

          {/* GENERAL */}
          {activeSection === "General" && (
            <>
              <article className="panel setting-group searchable">
                <h2>Account details</h2>

                <p>
                  Manage the information associated with your Parkitects
                  security account.
                </p>

                <div className="form-row">
                  <label>
                    Full name
                    <input
                      type="text"
                      defaultValue="Security Guard"
                    />
                  </label>

                  <label>
                    Email address
                    <input
                      type="email"
                      defaultValue="security@parkitects.co.za"
                    />
                  </label>
                </div>
              </article>

              <article className="panel setting-group searchable">
                <h2>Appearance</h2>

                <p>
                  Choose how the Parkitects dashboard appears.
                </p>

                {/* DARK MODE */}
                <div className="setting-line">
                  <span>
                    <strong>Dark theme</strong>

                    <small>
                      Use a darker interface in low-light environments.
                    </small>
                  </span>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={preferences.darkMode}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          darkMode: e.target.checked,
                        })
                      }
                    />

                    <span></span>
                  </label>
                </div>

                {/* COMPACT TABLES */}
                <div className="setting-line">
                  <span>
                    <strong>Compact tables</strong>

                    <small>
                      Display more parking records in tables.
                    </small>
                  </span>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={preferences.compactTables}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          compactTables: e.target.checked,
                        })
                      }
                    />

                    <span></span>
                  </label>
                </div>
              </article>
            </>
          )}

          {/* NOTIFICATION SETTINGS */}
          {activeSection === "Notifications" && (
            <article className="panel setting-group searchable">

              <h2>Notifications</h2>

              <p>
                Choose which parking system events security staff are
                notified about.
              </p>

              {/* TICKET UPDATES */}
              <div className="setting-line">
                <span>
                  <strong>Ticket updates</strong>

                  <small>
                    Receive notifications when a ticket is created,
                    disputed, or resolved.
                  </small>
                </span>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications.ticketUpdates}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        ticketUpdates: e.target.checked,
                      })
                    }
                  />

                  <span></span>
                </label>
              </div>

              {/* PARKING ALERTS */}
              <div className="setting-line">
                <span>
                  <strong>Parking alerts</strong>

                  <small>
                    Receive alerts about parking capacity and bay
                    availability.
                  </small>
                </span>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications.parkingAlerts}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        parkingAlerts: e.target.checked,
                      })
                    }
                  />

                  <span></span>
                </label>
              </div>

              {/* SYSTEM ALERTS */}
              <div className="setting-line">
                <span>
                  <strong>System alerts</strong>

                  <small>
                    Receive important system and sensor notifications.
                  </small>
                </span>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications.systemAlerts}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        systemAlerts: e.target.checked,
                      })
                    }
                  />

                  <span></span>
                </label>
              </div>

            </article>
          )}

          {/* SYSTEM SETTINGS */}
          {activeSection === "System" && (
            <>
              <article className="panel setting-group searchable">

                <h2>Parking system</h2>

                <p>
                  Information about the Parkitects parking monitoring
                  system.
                </p>

                <div className="setting-line">
                  <span>
                    <strong>Parking sensors</strong>

                    <small>
                      Monitor the connection status of parking bay sensors.
                    </small>
                  </span>

                  <span className="status success">
                    Connected
                  </span>
                </div>

                <div className="setting-line">
                  <span>
                    <strong>System status</strong>

                    <small>
                      Current Parkitects system availability.
                    </small>
                  </span>

                  <span className="status success">
                    Operational
                  </span>
                </div>

              </article>

              <article className="panel setting-group searchable">

                <h2>Data management</h2>

                <p>
                  Manage historical parking and ticket information.
                </p>

                <button
                  className="button secondary"
                  type="button"
                >
                  Export parking data
                </button>

              </article>
            </>
          )}

        </div>
      </div>
    </section>
  );
};


export default SettingsPage;
{/*References
           realCAiN. 2024. Updated* Dashboard for sales, ect / Admin Dashboard. (Version 2.0) [Source code] Available at: < https://codepen.io/realCaiN/pen/yLdEzwv > [Accessed 16 Aug. 2026].        
  rudderz243.2026. rudderz243/insy7314-library.  (Version 2.0) [Source code]. Available at: <https://github.com/rudderz243/insy7314-library> [Accessed 17 Aug. 2026].
           */}
       