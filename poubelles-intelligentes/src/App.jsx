import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Poubelles from './pages/Poubelles';
import Ramassage from './pages/Ramassage';
import Statistiques from './pages/Statistiques';
import Login from './pages/Login';
import './index.css';

// Mock authentication function
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken'); // Check if authToken exists in localStorage
};

// Protected route wrapper
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <div style={{ display: 'flex' }}>
              <Navbar /> {/* Show Navbar only for authenticated routes */}
              <div style={{ marginLeft: '240px', width: 'calc(100% - 240px)', padding: '1rem' }}>
                <Routes>
                  <Route path="/" element={<ProtectedRoute element={<Poubelles />} />} />
                  <Route path="/ramassage" element={<ProtectedRoute element={<Ramassage />} />} />
                  <Route path="/statistiques" element={<ProtectedRoute element={<Statistiques />} />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;