import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import VerifyPage from './pages/VerifyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Student Protected Pages
import StudentDashboard from './pages/StudentDashboard';
import MyCertificates from './pages/MyCertificates';
import ProfileSettings from './pages/ProfileSettings';

// Admin Protected Pages
import AdminDashboard from './pages/AdminDashboard';
import UploadCertificates from './pages/UploadCertificates';
import ManageCertificates from './pages/ManageCertificates';
import GenerateCertificate from './pages/GenerateCertificate';
import AdminProfileSettings from './pages/AdminProfileSettings';

import CertificatePreview from './components/CertificatePreview';

// Global Toaster for notifications
import { Toaster } from 'react-hot-toast';
// Google OAuth Linkage
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <GoogleOAuthProvider clientId="673699888455-quk2c3vb44lojgsurpvvfei25pl27ni1.apps.googleusercontent.com">
      <Router>
        <Routes>
        {/* Public Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="verify" element={<VerifyPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="preview" element={<div className="container py-8"><CertificatePreview /></div>} />
        </Route>

        {/* Student Dashboard Routes */}
        <Route path="/student" element={<DashboardLayout role="student" />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="certificates" element={<MyCertificates />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="verify" element={<VerifyPage />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="upload" element={<UploadCertificates />} />
          <Route path="manage" element={<ManageCertificates />} />
          <Route path="generate" element={<GenerateCertificate />} />
          <Route path="profile" element={<AdminProfileSettings />} />
          <Route path="verify" element={<VerifyPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Router>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
