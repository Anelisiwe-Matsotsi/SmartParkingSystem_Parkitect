import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { SideBar } from "./components/SideBar";
import { TopBar } from "./components/TopBar";

import { BookPage } from "./pages/BookPage";
import { HealthCheckPage } from "./pages/HealthCheckPage";
import { TicketsPage } from "./pages/TicketsPage";
import { TicketResponsesPage } from "./pages/TicketResponsesPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Login } from "./pages/Login";

const AppContent: React.FC = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div
      className={
        isLoginPage
          ? ""
          : `app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`
      }
    >

      {/* Only show Sidebar when NOT on login */}
      {!isLoginPage && <SideBar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />}

      <div className={isLoginPage ? "" : "workspace"}>

        {/* Only show TopBar when NOT on login */}
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
              element={<BookPage />}
            />

            {/* Other Parkitects pages */}
            <Route
              path="/tickets"
              element={<TicketsPage />}
            />

            <Route
              path="/responses"
              element={<TicketResponsesPage />}
            />

            <Route
              path="/analytics"
              element={<AnalyticsPage />}
            />

            <Route
              path="/settings"
              element={<SettingsPage />}
            />

            {/* Backend health */}
            <Route
              path="/health"
              element={<HealthCheckPage />}
            />

            {/* Root */}
            <Route
              path="/"
              element={<Navigate to="/login" replace />}
            />

            {/* Unknown URL */}
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />

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