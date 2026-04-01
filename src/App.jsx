import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AppDataProvider } from "./context/AppDataContext";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AboutPage from "./pages/AboutPage";
import ApplyPage from "./pages/ApplyPage";
import EmployerPage from "./pages/EmployerPage";
import FaqPage from "./pages/FaqPage";
import HomePage from "./pages/HomePage";
import JobDetailPage from "./pages/JobDetailPage";
import JobsPage from "./pages/JobsPage";
import TeamContactPage from "./pages/TeamContactPage";

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/apply/:jobId" element={<ApplyPage />} />
            <Route path="/employers" element={<EmployerPage />} />
            <Route path="/team-contact" element={<TeamContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage initialTab="applications" />} />
            <Route path="/admin/jobs" element={<AdminDashboardPage initialTab="jobs" />} />
            <Route path="/admin/applications" element={<AdminDashboardPage initialTab="applications" />} />
          </Route>
        </Routes>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
