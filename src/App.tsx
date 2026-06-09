import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers contexts
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Layout wrappers
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Branches from './pages/Branches';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';

// Types
import { UserRole } from './types';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <BookingProvider>
              <Routes>
                
                {/* 1. Customer facing paths */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="branches" element={<Branches />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* 2. Management panel portals (only administrators & operator workers) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.HeadAdmin, UserRole.BranchAdmin, UserRole.Operator]}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                />

                {/* 3. Fallback redirects */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </BookingProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
