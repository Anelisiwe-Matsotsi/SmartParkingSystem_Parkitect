//(rudderz243,2026)
import React, { useEffect, useState , useCallback} from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth"; //(Firebase, 2026)
import { defaultWebSettings, getParkingHistory, getSystemStatus, getWebSettings, saveWebSettings, syncUserProfile } from "../services/api";
import type { SystemStatus, WebSettings } from "../services/api"; 
import { applyAppearance, cacheAppearance, readCachedAppearance, resetAppearance } from "../utils/appearance";
import { useLocation } from "react-router-dom";

//(Stack Overflow, 2023)
type Status = { type: "success" | "error" | "info"; message: string } | null;
const SECTIONS = ["General", "Notifications", "System"];
//(Stack Overflow, 2023)
const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

const liveDarkMode =() => document.documentElement.getAttribute("data-theme") === "dark";

//Reusable on/off so every toggle behaves the same way
const Toggle: React.FC<{
  //(Schuyler, 2021)
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, description, checked, onChange }) => (
  <div className="setting-line">
    <span>
      <strong>{label}</strong>
      <small>{description}</small>
    </span>

    <label className="switch">
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span></span>
    </label>
  </div>
);



export const SettingsPage: React.FC = () => {

  
  const location = useLocation();
  const requestedSection = (location.state as {section?: string} | null)?.section;
  const [activeSection, setActiveSection] = useState( requestedSection && SECTIONS.includes(requestedSection)? requestedSection : "General");

  //Stores the loggd in user's details
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [settings, setSettings] = useState<WebSettings>(() =>
  ({...defaultWebSettings,
    ...readCachedAppearance(auth.currentUser?.uid ?? ""),
    darkMode: liveDarkMode(),
  }));
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [exporting, setExporting] = useState(false);

  const { darkMode, compactTables, largerText, reducedMotion } = settings;

  //(Stack Over, 2020)
  const updateSetting = <K extends keyof WebSettings>(key: K, value: WebSettings[K]) =>
    setSettings((current) => (current[key] === value ? current : { ...current, [key]: value }));


  useEffect(() => {
  if (requestedSection && SECTIONS.includes(requestedSection)) {
    setActiveSection(requestedSection);
  }
}, [requestedSection]);

  //(CoddyKit, 2026)
    useEffect(() => {

    const handleThemeChange = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const currentUid = auth.currentUser?.uid;

      if (detail?.uid && currentUid && detail.uid !== currentUid) {
        return;
      }

      updateSetting("darkMode", Boolean(detail?.darkMode));
    };

    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  // Apply appearance preferences and cache them for this user.
 useEffect(() => {
    if (!settingsLoaded) return;

    applyAppearance({ darkMode, compactTables, largerText, reducedMotion });

    const uid = auth.currentUser?.uid;
    window.dispatchEvent(new CustomEvent("themeChange", { detail: { darkMode, uid } }));
  }, [settingsLoaded, darkMode, compactTables, largerText, reducedMotion]);

  useEffect(() => {
    return () => {
    const uid = auth.currentUser?.uid;

    if (uid) {
        const saved = readCachedAppearance(uid);
        applyAppearance(saved);
        window.dispatchEvent(
          new CustomEvent("themeChange", { detail: { darkMode: saved.darkMode, uid } })
      );
    }
       window.dispatchEvent(new CustomEvent("profileUnload"));
       

    };
  }, []);


  //This loads the current user's details
  useEffect(() => {
    let active = true;

    //Firebase loads the logged in user
    const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {

    
      if (!currentUser) {
        setUserName("");
        setUserEmail("");
        setProfileLoaded(false);
        setSettings(defaultWebSettings);
        setSettingsLoaded(false);
        resetAppearance();
        return;
      }

      //get's the logged in user's name from firebase
      setUserName(currentUser.displayName || "");
      //get's the user's email from firebase
      setUserEmail(currentUser.email || "");
      setProfileLoaded(true);
    const uid = currentUser.uid;

      try {
        const saved = await getWebSettings(uid);

        if (!active || auth.currentUser?.uid !== uid) return;

        console.log("[Settings] server darkMode:", saved?.darkMode, "live:", liveDarkMode());

        const merged: WebSettings ={...defaultWebSettings, ...saved, darkMode:liveDarkMode()};

        setSettings(merged);
        cacheAppearance(uid, merged);
      } catch (error) {
        console.error("Error loading settings:", error);
        if (!active || auth.currentUser?.uid !== uid) return;

        setSettings((current) => ({ ...current, ...readCachedAppearance(uid),darkMode: liveDarkMode() }));
        setStatus({
          type: "error",
          message: "Could not load your saved settings from the server. Showing this browser's settings instead.",
        });
      } finally {
        if (active && auth.currentUser?.uid === uid) setSettingsLoaded(true);
      }
    });
    return() => {
      active = false;
      unsubscribe();
  };
},[]);

  //(Akbulut, 2022)
  //This sends the user's details to the top bar so it can be displayed in the profile section
  useEffect(() => {
    if(!profileLoaded) 
      {
        return;
      }
    window.dispatchEvent(
      new CustomEvent("profileLoad", {
        detail: { 
          name: userName,
          email: userEmail
        },
      })
    );
  }, [profileLoaded, userName, userEmail]);

  //Loads the real sensor status
  useEffect(() => {
    if (activeSection !== "System") return;

    let active = true;

    getSystemStatus().then((result) => {
      if (active) setSystemStatus(result);
    });

    return () => {
      active = false;
    };
  }, [activeSection]);

  //Saves the user's settings
  const handleSave = useCallback(async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setStatus({ type: "error", message: "Please log in first." });
      return;
    }

    const uid = currentUser.uid;
    const trimmedName = userName.trim();
    const trimmedEmail = userEmail.trim();

    if (trimmedName === "") {
      setStatus({ type: "error", message: "Full name cannot be empty." });
      setActiveSection("General");
      return;
    }
    setSaving(true);
    setStatus(null);

    const problems: string[] = [];

    //Settings are saved
    try {
      const saved = await saveWebSettings(uid, settings);

      cacheAppearance(uid, saved);
      applyAppearance(saved);
      //(Leiberman, 2021)
      localStorage.setItem(`parkitects_${uid}_alertSound`, String(saved.alertSound));

      //(Akbulut, 2022)
      window.dispatchEvent(
        new CustomEvent("themeChange", { detail: { darkMode: saved.darkMode, uid } })
      );
      window.dispatchEvent(new CustomEvent("webSettingsSaved", { detail: saved }));
    } catch (error) {
      console.error("Error saving settings:", error);
      problems.push(`Settings were not saved: ${errorMessage(error)}`);
    }

    if (trimmedName !== (currentUser.displayName || "")) {
      try {
        await updateProfile(currentUser, { displayName: trimmedName });
        await syncUserProfile(uid, trimmedName, currentUser.email || trimmedEmail).catch((error) =>
          console.error("Could not sync name to the database:", error)
        );
      } catch (error) {
        console.error("Error updating name:", error);
        problems.push(`Name was not updated: ${errorMessage(error)}`);
      }
    }


    //(Akbulut, 2022)
    setUserName(auth.currentUser?.displayName || trimmedName);
    setUserEmail(auth.currentUser?.email || "");
    window.dispatchEvent(
      new CustomEvent("profileLoad", {
        detail: {
          name: auth.currentUser?.displayName || trimmedName,
          email: auth.currentUser?.email || "",
        },
      })
    );

    if (problems.length > 0) {
      setStatus({ type: "error", message: problems.join(" ") });
    } else {
      setStatus({
        type: "success",
        message: ["Settings saved successfully."].join(" "),
      });
    }

    setSaving(false);
  }, [settings, userName, userEmail]);

  //Downloads the parking history as a CSV file
  const handleExport = async () => {
    setExporting(true);
    setStatus(null);

    try {
      const rows = await getParkingHistory();

      if (rows.length === 0) {
        setStatus({ type: "info", message: "There is no parking data to export yet." });
        return;
      }

      const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
      const header = ["Bay", "User", "User type", "Time in", "Time out", "Duration", "Status"];
      const lines = rows.map((row) =>
        [row.bay, row.user, row.userType, row.timeIn, row.timeOut, row.duration, row.status]
          .map(escape)
          .join(",")
      );


      //(Code-Maven, 2026)
      const csv = "\uFEFF" + [header.map(escape).join(","), ...lines].join("\r\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
      const link = document.createElement("a");

      link.href = url;
      link.download = `parkitects-parking-data-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setStatus({ type: "success", message: `Exported ${rows.length} parking records.` });
    } catch (error) {
      console.error("Error exporting parking data:", error);
      setStatus({ type: "error", message: `Could not export parking data: ${errorMessage(error)}` });
    } finally {
      setExporting(false);
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
          disabled={saving || !settingsLoaded}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

            {status && (
        <div
          className={`settings-banner ${status.type}`}
          role={status.type === "error" ? "alert" : "status"}
        >
          <span>{status.message}</span>
          <button type="button" aria-label="Dismiss message" onClick={() => setStatus(null)}>
            ×
          </button>
        </div>
      )}

      <div className="settings-layout">

    {/* Settings nav */}
        <nav
          className="settings-nav"
          aria-label="Settings sections"
        >
          {SECTIONS.map((section) => (
            <button
              key={section}
              type="button"
              className={
                activeSection === section
                  ? "is-active"
                  : ""
              }
              onClick={() => { if (section === "System") setSystemStatus(null);setActiveSection(section);}}
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
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </label>

                  <label>
                    Email address
                    <input
                      type="email"
                      value={userEmail}
                      readOnly title="Contact an administrator to change your email address."
                    />
                  </label>
                </div>
              </article>

              <article className="panel setting-group searchable">
                <h2>Appearance</h2>

                <p>
                  Choose how the Parkitects dashboard appears.
                </p>

                 <Toggle
                  label="Dark theme"
                  description="Use a darker interface in low-light environments."
                  checked={settings.darkMode}
                  onChange={(value) => updateSetting("darkMode", value)}
                />

                <Toggle
                  label="Compact tables"
                  description="Display more parking records in tables."
                  checked={settings.compactTables}
                  onChange={(value) => updateSetting("compactTables", value)}
                />

                <Toggle
                  label="Larger text"
                  description="Increase text size throughout the Parkitects dashboard."
                  checked={settings.largerText}
                  onChange={(value) => updateSetting("largerText", value)}
                />

                <Toggle
                  label="Reduce motion"
                  description="Reduce animations and movement throughout the dashboard."
                  checked={settings.reducedMotion}
                  onChange={(value) => updateSetting("reducedMotion", value)}
                />

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

              <Toggle
                label="Ticket updates"
                description="Receive notifications when a ticket is created, disputed, or resolved."
                checked={settings.ticketUpdates}
                onChange={(value) => updateSetting("ticketUpdates", value)}
              />

              <Toggle
                label="Parking alerts"
                description="Receive alerts about parking capacity and bay availability."
                checked={settings.parkingAlerts}
                onChange={(value) => updateSetting("parkingAlerts", value)}
              />

              <Toggle
                label="System alerts"
                description="Receive important system and sensor notifications."
                checked={settings.systemAlerts}
                onChange={(value) => updateSetting("systemAlerts", value)}
              />

              <Toggle
                label="Alert sound"
                description="Play a sound when important parking or system alerts are received."
                checked={settings.alertSound}
                onChange={(value) => updateSetting("alertSound", value)}
              />

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
                        {systemStatus && systemStatus.online
                        ? `${systemStatus.baysWithSensors} of ${systemStatus.totalBays} parking bays have a sensor.`
                        : "Monitor the connection status of parking bay sensors."}
                    </small>
                  </span>

                  <span className={`status ${
                      systemStatus && systemStatus.online && systemStatus.baysWithSensors > 0
                        ? "success"
                        : "pending"
                    }`}
                  >
                    {systemStatus === null
                      ? "Checking..."
                      : !systemStatus.online
                        ? "Unknown"
                        : systemStatus.baysWithSensors > 0
                          ? "Connected"
                          : "No sensors"}
                  </span>
                </div>

                <div className="setting-line">
                  <span>
                    <strong>System status</strong>

                    <small>
                      Current Parkitects system availability.
                    </small>
                  </span>

                  <span className={`status ${systemStatus === null || systemStatus.online ? "success" : "danger"}`}
                  >
                    {systemStatus === null
                      ? "Checking..."
                      : systemStatus.online
                        ? "Operational"
                        : "Unavailable"}
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
                  onClick={handleExport}
                  disabled={exporting}
                >
                 {exporting ? "Exporting..." : "Export parking data"}
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
  Akbulut, U. 2022. JavaScript: Understanding CustomEvent and dispatchEvent. (Version 2.0) [Source Code] Available at:<https://medium.com/cstech/javascript-understanding-customevent-and-dispatchevent-a33d10075818> [Accessed 1 October 2026].
  CoddyKit. 2026. Building a Persistent Settings Screen. (Version 2.0) [Source code] Available at:<https://www.coddykit.com/courses/learn_react_native/building-a-persistent-settings-screen-10685241> [Accessed 4 October 2026].
  Code-Maven. 2026.Create and download data in CSV format using plain JavaScript.(Version 2.0) [Source code] Available at:<https://code-maven.com/create-and-download-csv-with-javascript> [Accessed 4 October 2026].
  Firebase. 2026. Manage Users in Firebase. (Version 2.0) [Source Code] Available at:<https://firebase.google.com/docs/auth/web/manage-users> [Accessed 27 September 2026].
  Leiberman, L. 2021. Dark Mode 2.0 : With Local Storage. (Version 2.0) [Source Code] Available at:<https://dr-lucasleibs.medium.com/dark-mode-2-0-with-local-storage-6f992683204d> [Accessed 27 September 2026].
  Mustafamulla. 2024. How to Implement Dark Mode in React with Tailwind CSS. (Version 2.0) [Source Code] Available at:<https://medium.com/@mustafamulla765/how-to-implement-dark-mode-in-react-with-tailwind-css-94df7522ed82> [Accessed 25 September 2026].
  realCAiN. 2024. Updated* Dashboard for sales, ect / Admin Dashboard. (Version 2.0) [Source code] Available at: < https://codepen.io/realCaiN/pen/yLdEzwv > [Accessed 16 August 2026].        
  rudderz243.2026. rudderz243/insy7314-library.  (Version 2.0) [Source code]. Available at: <https://github.com/rudderz243/insy7314-library> [Accessed 17 August 2026].
  Schuyler, A.2021. Create a Simple Reusable Toggle Switch Component In React.(Version 2.0) [Source code] Available at:<https://medium.com/@aaron_schuyler/create-a-simple-reusable-toggle-switch-component-in-react-a82a1ded1b17> [Accessed 4 October 2026].
  Stack Overflow. 2023.What's the correct type for error in useRouteError() from react-router-dom? (Version 2.0) [Source code] Available at:<https://stackoverflow.com/questions/75944820/whats-the-correct-type-for-error-in-userouteerror-from-react-router-dom> [Accessed 4 October 2026].
  Stack Overflow. 2020. How do you dynamically update a key-value pair on a typed object in TypeScript.(Veersion 2.0) [Source code] Available at:<https://stackoverflow.com/questions/62987779/how-do-you-dynamically-update-a-key-value-pair-on-a-typed-object-in-typescript> [Accessed 4 October 2026].
  */}
       