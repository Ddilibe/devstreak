import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { VerifyEmail } from "@/pages/auth/VerifyEmail";
import { Onboarding } from "@/pages/Onboarding";
import { Overview } from "@/pages/Overview";
import { Tasks } from "@/pages/Tasks";
import { Streaks } from "@/pages/Streaks";
import { Accountability } from "@/pages/Accountability";
import { GroupDetail } from "@/pages/GroupDetail";
import { Activity } from "@/pages/Activity";
import { Integrations } from "@/pages/Integrations";
import { Analytics } from "@/pages/Analytics";
import { Settings } from "@/pages/Settings";
import { NotFound } from "@/pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/onboarding" element={<Onboarding />} />

          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/streaks" element={<Streaks />} />
            <Route path="/accountability" element={<Accountability />} />
            <Route path="/accountability/:groupId" element={<GroupDetail />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
