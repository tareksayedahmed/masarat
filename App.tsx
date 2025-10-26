
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import HomePage from './pages/HomePage';
import BranchesPage from './pages/BranchesPage';
import CarsPage from './pages/CarsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminFleetPage from './pages/admin/AdminFleetPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminPricingPage from './pages/admin/AdminPricingPage';
import AdminLayout from './components/layout/AdminLayout';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { UserRole } from './types';
import AdminLogsPage from './pages/admin/AdminLogsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="branches" element={<BranchesPage />} />
              <Route path="cars/:branchId" element={<CarsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[UserRole.HeadAdmin, UserRole.BranchAdmin, UserRole.Operator]}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={
                 <ProtectedRoute allowedRoles={[UserRole.HeadAdmin, UserRole.BranchAdmin, UserRole.Operator]}>
                    <AdminDashboardPage />
                 </ProtectedRoute>
              } />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="fleet" element={
                <ProtectedRoute allowedRoles={[UserRole.HeadAdmin, UserRole.BranchAdmin]}>
                  <AdminFleetPage />
                </ProtectedRoute>
              } />
              <Route path="pricing" element={
                <ProtectedRoute allowedRoles={[UserRole.HeadAdmin]}>
                  <AdminPricingPage />
                </ProtectedRoute>
              } />
               <Route path="logs" element={
                <ProtectedRoute allowedRoles={[UserRole.HeadAdmin]}>
                  <AdminLogsPage />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute allowedRoles={[UserRole.HeadAdmin]}>
                  <AdminSettingsPage />
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute allowedRoles={[UserRole.HeadAdmin]}>
                  <AdminReportsPage />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </HashRouter>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;