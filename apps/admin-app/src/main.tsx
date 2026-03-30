import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/app-shell";
import { GuardedRoute } from "./components/guarded-route";
import { AuthProvider } from "./contexts/auth-context";
import { AdCreatePage } from "./pages/ad-create-page";
import { AdsPage } from "./pages/ads-page";
import { DashboardPage } from "./pages/dashboard-page";
import { DemoPage } from "./pages/demo-page";
import { LoginPage } from "./pages/login-page";
import { ReportsPage } from "./pages/reports-page";
import { SdkGuidePage } from "./pages/sdk-guide-page";
import { SignupPage } from "./pages/signup-page";
import { SiteCreatePage } from "./pages/site-create-page";
import { SiteDetailPage } from "./pages/site-detail-page";
import { SitesPage } from "./pages/sites-page";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={
              <GuardedRoute>
                <AppShell />
              </GuardedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="sites" element={<SitesPage />} />
            <Route path="sites/new" element={<SiteCreatePage />} />
            <Route path="sites/:siteId" element={<SiteDetailPage />} />
            <Route path="ads" element={<AdsPage />} />
            <Route path="ads/new" element={<AdCreatePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="sdk" element={<SdkGuidePage />} />
            <Route path="demo" element={<DemoPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
