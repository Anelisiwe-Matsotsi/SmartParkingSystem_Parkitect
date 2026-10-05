import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { getNotifications, getWebSettings, saveWebSettings } from "../services/api";
import type { AppNotification, WebSettings } from "../services/api";
import {applyAppearance, cacheAppearance, readCachedAppearance, resetAppearance} from "../utils/appearance";

//shows how long ago a notification was created (//Stack Overflow, 2020)
const timeAgo = (value: string) => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
};

export const TopBar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  //real notifications from the backend, as well as the time the user last marked them as read
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [lastReadTime, setLastReadTime] = useState(0);

  //the last settings loaded 
  const savedSettings = useRef<WebSettings | null>(null);

  //gets the logged in users details
  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUserName("");
        setUserEmail("");
        setDarkMode(false);
        savedSettings.current = null;
        resetAppearance();

        return;
      }

      const uid = currentUser.uid;

      setUserName(currentUser.displayName || "");
      setUserEmail(currentUser.email || "");

      // Apply this user's cached theme while settings load.
      const cached = readCachedAppearance(uid);
      setDarkMode(cached.darkMode);
      applyAppearance(cached);

      try {
        // Fetch the saved settings for this Firebase UID.
        const settings = await getWebSettings(uid);

        // Ignore responses for an account that has changed or signed out.
        if (!active || auth.currentUser?.uid !== uid) return;

        savedSettings.current = settings;

        // Applies dark mode, compact tables, larger text and reduced motion on every page
        applyAppearance(settings);
        cacheAppearance(uid, settings);
        setDarkMode(settings.darkMode);

        window.dispatchEvent(
          new CustomEvent("themeChange", {
            detail: {
              darkMode: settings.darkMode,
              uid,
            },
          })
        );
      } catch (error) {
        console.error("Error loading the user's settings:", error);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  },[]);

  //loads the notifications from the backend and refreshes them every 30 seconds
  useEffect(() => {
    let active = true;
    let timer: number | undefined;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      window.clearInterval(timer);

      if (!currentUser) {
        setNotifications([]);
        return;
      }

      setLastReadTime(Number(localStorage.getItem(`parkitects_${currentUser.uid}_notificationsRead`)) || 0);

      const load = async () => {
        try {
          const items = await getNotifications();
          if (active) setNotifications(items.slice(0, 20));
        } catch (error) {
          console.error("Error loading notifications:", error);
        }
      };

      load();
      timer = window.setInterval(load, 30000);
    });

    return () => {
      active = false;
      window.clearInterval(timer);
      unsubscribe();
    };
  }, []);


  //(Akbulut, 2022)
  useEffect(() => {
    const onLoad = (e: Event) => {
      const detail = (e as CustomEvent).detail;
        setUserName(detail.name || "");
        setUserEmail(detail.email || "");
      };
      const onUnload = () => {
        const user =auth.currentUser;
        setUserName(user?.displayName || "");
        setUserEmail(user?.email || "");
      };

    window.addEventListener("profileLoad", onLoad);
    window.addEventListener("profileUnload", onUnload);
    return () => {
      window.removeEventListener("profileLoad", onLoad);
      window.removeEventListener("profileUnload", onUnload);
    };
  }, []);


  //this applies the dark theme across the entire website using the toggle at the top
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");

  },[darkMode]);

  //keeps track of what the settings page saved
  useEffect(() => {
    const onSaved = (e: Event) => {
      savedSettings.current = (e as CustomEvent).detail as WebSettings;
    };

    window.addEventListener("webSettingsSaved", onSaved);
    return () => window.removeEventListener("webSettingsSaved", onSaved);
  }, []);

useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const currentUid = auth.currentUser?.uid;
      const eventUid = detail?.uid;

      if (eventUid && currentUid && eventUid !== currentUid) {
        return;
      }

      setDarkMode(Boolean(detail?.darkMode));
    };


    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  //changes between dark mode and light mode when the toggle is clicked
  const toggleDarkMode = async () => {
    const uid = auth.currentUser?.uid;

      if (!uid) {
      alert("Please log in first.");
      return;
    }

    const newValue = !darkMode;

    setDarkMode(newValue);
    document.documentElement.setAttribute("data-theme", newValue ? "dark" : "light");
    cacheAppearance(uid, { ...readCachedAppearance(uid), darkMode: newValue });


      window.dispatchEvent(new CustomEvent("themeChange", {
        detail: { darkMode: newValue, uid },
    })
      );
          //saves the choice so it is still there after logging out and back in
    if (!savedSettings.current) return;

    try {
      savedSettings.current = await saveWebSettings(uid, {
        ...savedSettings.current,
        darkMode: newValue,
      });
    } catch (error) {
      console.error("Could not save the theme:", error);
    }
  };

  const isUnread = (item: AppNotification) => new Date(item.time).getTime() > lastReadTime;
  const unreadCount = notifications.filter(isUnread).length;

  //remembers that everything up to now has been read
  const markAllRead = () => {
    const uid = auth.currentUser?.uid;
    const now = Date.now();

    setLastReadTime(now);
    if (uid) localStorage.setItem(`parkitects_${uid}_notificationsRead`, String(now));
  };

  const toggleNotifications = () => {
    setShowNotifications((current) => !current);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile((current) => !current);
    setShowNotifications(false);
  };

  //gets the user's initials for the avatar
  const getInitials = () => {
    if(!userName) {
      return "SG";
    }
    return userName
    .split(" ")
    .map((name) => name[0]).join("").substring(0, 2).toUpperCase();
  }
  

  

  return (
    <header className={`topbar ${darkMode ? "dark-mode" : ""}`}>

      {/* MOBILE BRAND */}
      <div className="mobile-brand">
        <span className="brand-mark">P</span>
        <strong>Parkitects</strong>
      </div>


      {/* SEARCH */}
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


      {/* TOPBAR ACTIONS */}
      <div className="topbar-actions">

        {/* DARK MODE */}
        <button
          className="icon-button theme-button"
          type="button"
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          onClick={toggleDarkMode}
        >
          <i
            className={
              darkMode
                ? "theme-icon fa-solid fa-sun"
                : "theme-icon fa-solid fa-moon"
            }
            aria-hidden="true"
          ></i>
        </button>


        {/* NOTIFICATIONS */}
        <div className="menu-wrap">

          <button
            className="icon-button notification-button"
            type="button"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            onClick={toggleNotifications}
          >
            <i
              className="fa-solid fa-bell"
              aria-hidden="true"
            ></i>

             {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>


          {/* NOTIFICATION DROPDOWN */}
          {showNotifications && (
            <div className="popover notification-popover">

              <div className="popover-heading">

                <div>
                  <strong>Notifications</strong>
                  <small>{unreadCount === 0 ? "No unread updates" : `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`}</small>
                </div>

                <button type="button"
                onClick={markAllRead} disabled= {unreadCount === 0}>
                  Mark all read
                </button>

              </div>


              <div className="notice-list">

                
                {notifications.length === 0 && (
                  <p className="notice-empty">No notifications yet.</p>
                )}

                {notifications.map((item) => (
                  <button
                    key={item.notificationID}
                    className={`notice ${isUnread(item) ? "is-unread" : ""}`}
                    type="button"
                  >
                    <span className="notice-mark violet">
                      <i
                        className="fa-solid fa-bell"
                        aria-hidden="true"
                      ></i>
                    </span>

                    <span>
                      <strong>{item.title}</strong>
                      <small>
                        {item.description} · {timeAgo(item.time)}
                      </small>
                    </span>
                  </button>
                ))}

              </div>




              <button
                className="popover-footer"
                type="button"
                onClick={()=> navigate("/ticketsresponse")}
              >
                View notification center
              </button>

            </div>
          )}

        </div>


        {/* PROFILE */}
        <div className="menu-wrap desktop-profile">

          <button
            className="profile-button"
            type="button"
            aria-expanded={showProfile}
            onClick={toggleProfile}
          >
            <span className="avatar">
              {getInitials()}
            </span>

            <span className="profile-name">
              <strong>{userName || "" }</strong>
              <small>{userEmail}</small>
            </span>

            <i
              className="fa-solid fa-chevron-down"
              aria-hidden="true"
            ></i>
          </button>


          {/* PROFILE DROPDOWN */}
          {showProfile && (
            <div className="popover profile-popover">

              <div className="profile-summary">

                <span className="avatar large">
                  {getInitials()}
                </span>

                <span>
                  <strong>{userName || ""}</strong>
                  <small>{userEmail}</small>
                </span>

              </div>


              <button type="button"
              onClick={()=> navigate("/settings")}
              >
                Account settings
              </button>

              <button
                type="button"
                onClick={toggleDarkMode}
              >
                Appearance
              </button>

              <button type="button"
              onClick={()=> navigate("/login")}>
                Sign out
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default TopBar;
{/*References
  Akbulut, U. 2022. JavaScript: Understanding CustomEvent and dispatchEvent. (Version 2.0) [Source Code] Available at:<https://medium.com/cstech/javascript-understanding-customevent-and-dispatchevent-a33d10075818> [Accessed 1 October 2026].
 realCAiN. 2024. Updated* Dashboard for sales, ect / Admin Dashboard. (Version 2.0) [Source code] Available at: < https://codepen.io/realCaiN/pen/yLdEzwv > [Accessed 16 Aug. 2026]. 
               
 */}