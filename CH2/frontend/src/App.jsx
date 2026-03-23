import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import QA from './pages/QA';
import Deadlines from './pages/Deadlines';
import Calendar from './pages/Calendar';
import Events from './pages/Events';
import Placements from './pages/Placements';
import Faculty from './pages/Faculty';
import Polls from './pages/Polls';
import Profile from './pages/Profile';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading Auth...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="qa" element={<QA />} />
        <Route path="deadlines" element={<Deadlines />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="events" element={<Events />} />
        <Route path="placements" element={<Placements />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="polls" element={<Polls />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<div style={{padding: 40}}><h2>Settings (Coming Soon)</h2></div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
