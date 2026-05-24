import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import useReminder from './hooks/useReminder';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import AddMedicine from './pages/AddMedicine';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ReminderToast from './components/ReminderToast';

const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AppContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  useReminder();

  return (
    <>
      <ReminderToast />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="medicines" element={<Medicines />} />
          <Route path="add-medicine" element={<AddMedicine />} />
          <Route path="edit-medicine/:id" element={<AddMedicine />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
