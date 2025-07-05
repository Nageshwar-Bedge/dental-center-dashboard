import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Lazy load components for better performance
const PatientManagement = React.lazy(() => import('./components/PatientManagement.jsx'));
const AppointmentManagement = React.lazy(() => import('./components/AppointmentManagement.jsx'));
const CalendarView = React.lazy(() => import('./components/CalendarView.jsx'));
const PatientAppointments = React.lazy(() => import('./components/PatientAppointments.jsx'));

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="patients" element={
                <ProtectedRoute adminOnly>
                  <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>}>
                    <PatientManagement />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              <Route path="appointments" element={
                <ProtectedRoute adminOnly>
                  <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>}>
                    <AppointmentManagement />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              <Route path="calendar" element={
                <ProtectedRoute adminOnly>
                  <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>}>
                    <CalendarView />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              <Route path="my-appointments" element={
                <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>}>
                  <PatientAppointments />
                </React.Suspense>
              } />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;