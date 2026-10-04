import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
//(Firebase, 2026)/
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";

import { SideBar } from "./components/SideBar";
import { TopBar } from "./components/TopBar";

import { BookPage } from "./pages/BookPage";
import { HealthCheckPage } from "./pages/HealthCheckPage";
import { TicketsPage } from "./pages/TicketsPage";
import { TicketResponsesPage } from "./pages/TicketResponsesPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Login } from "./pages/Login";

//(Hanss, 2022)
// Only lets security personnel login, everyone else is sent to /login page 
const RequireSecurity: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  //(Bratslavsky, 2025)
  const [state, setState] = useState<"loading" | "ok" | "no">("loading");

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState("no");
        return;
      }
      const token = await user.getIdTokenResult();
      setState(token.claims.role === "security" ? "ok" : "no");
    });                                                                                                                                       
  }, []);

  //(Amour, 2026)
  if (state === "loading") return null;
  return state === "ok" ? children : <Navigate to="/login" replace />;
};


const AppContent: React.FC = () => {
  const location = useLocation();

  // const isLoginPage = location.pathname === "/login";
  const isLoginPage =
  location.pathname === "/login";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className={
        isLoginPage
          ? ""
          : `app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`
      }
    >

      {/* dont show sidebar when on login */}
      {!isLoginPage && <SideBar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />}

      <div className={isLoginPage ? "" : "workspace"}>

          {/* dont show topbar when on login */}
        {!isLoginPage && <TopBar />}

        <main className={isLoginPage ? "" : "page-wrap"}>
          <Routes>
            {/* Login */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<RequireSecurity><BookPage /></RequireSecurity>}
            />

           
            <Route
              path="/tickets"
              element={<RequireSecurity><TicketsPage /></RequireSecurity>}
            />

            <Route
              path="/responses"
              element={<RequireSecurity><TicketResponsesPage /></RequireSecurity>}
            />

            <Route
              path="/analytics"
              element={<RequireSecurity><AnalyticsPage /></RequireSecurity>}
            />

            <Route
              path="/settings"
              element={<RequireSecurity><SettingsPage /></RequireSecurity>}
            />

            {/* Backend health */}
            <Route
              path="/health"
              element={<RequireSecurity><HealthCheckPage /></RequireSecurity>}
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </main>

      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
{/*
  References
  Amour, D. 2026. Protecting an Admin Page in React Using JWT + Route Guards. (Version 2.0) [Source code] Available at:<https://www.paxium.co.uk/LinkedInArticles/AuthorisationInReact> [Accessed 3 October 2026].
  Bratslavsky, P. 2025. Mastering React useState Hook: A Full Guide with Best Practices. (Version 2.0) [Source code]. Available at:<https://strapi.io/blog/react-usestate-hook-guide-best-practices> [Accessed 3 October 2026].
  Firebase, 2026. Get Started with Firebase Authentication in React Native. [source code] Available: <https://firebase.google.com/docs/auth/web/start> [Accessed 30 August. 2026].
  Hanss, A. 2022. How to Use React.FC Children Prop in React 18 with TypeScript. (Version 2.0) [Source code]. Available at:<https://plainenglish.io/react/how-to-use-react-fc-children-prop-in-react-18-with-typescript-6ab7b2c901ce> [Accessed 3 October 2026].
  rudderz243.2026. rudderz243/insy7314-library.  (Version 2.0) [Source code]. Available at: <https://github.com/rudderz243/insy7314-library> [Accessed 17 Aug. 2026].
           */}