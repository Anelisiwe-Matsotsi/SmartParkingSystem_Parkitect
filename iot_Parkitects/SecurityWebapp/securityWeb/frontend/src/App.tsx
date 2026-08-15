import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SideBar } from "./components/SideBar";
import { TopBar } from "./components/TopBar";
import { BookPage } from "./pages/BookPage";
import { HealthCheckPage } from "./pages/HealthCheckPage";
import { TicketsPage } from "./pages/TicketsPage";
import { TicketResponsesPage } from "./pages/TicketResponsesPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
     <div className="app-shell">

        <SideBar />

        <div className="workspace">

          <TopBar />

        <main className="page-wrap">
        <Routes>

          
          {/* Dashboard */}
          <Route path="/dashboard" element={<BookPage />} />

          {/* Other Parkitects pages */}
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/responses" element={<TicketResponsesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Existing backend health page */}
          <Route path="/health" element={<HealthCheckPage />} />

          {/* If someone goes to "/", send them to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Unknown URL */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

      </main>
      </div>
       </div>
    </BrowserRouter>
  );
};

export default App;