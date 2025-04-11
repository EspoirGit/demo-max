import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Import NavLink and useLocation
import { FaTrash, FaTruck, FaChartBar } from 'react-icons/fa'; // Ajout de FaChartBar pour Statistiques
import './Navbar.css'; // Assuming you have a CSS file for styling

const Navbar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove auth token
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <nav style={{ 
      width: '220px', 
      height: 'calc(100vh - 2rem)', 
      backgroundColor: '#2c3e50', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-start', 
      padding: '1rem', 
      boxSizing: 'border-box',
      position: 'fixed',
      top: '1rem',
      left: '1rem',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 1000 // Assurez-vous que la Navbar est au-dessus des autres éléments
    }}>
      <h1 style={{ 
        fontSize: '1.5rem', 
        marginBottom: '2rem', 
        color: '#ecf0f1' 
      }}>
        Dashboard
      </h1>
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0, 
        width: '100%' 
      }}>
        <li style={{ marginBottom: '1rem', width: '100%' }}>
          <NavLink 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
            style={{ 
              textDecoration: 'none', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px',
              transition: 'background-color 0.3s ease-in-out'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FaTrash style={{ marginRight: '10px' }} />
            <span>Poubelles</span>
          </NavLink>
        </li>
        <li style={{ marginBottom: '1rem', width: '100%' }}>
          <NavLink 
            to="/ramassage" 
            className={location.pathname === '/ramassage' ? 'active' : ''}
            style={{ 
              textDecoration: 'none', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px',
              transition: 'background-color 0.3s ease-in-out'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FaTruck style={{ marginRight: '10px' }} />
            <span>Ramassage</span>
          </NavLink>
        </li>
        <li style={{ marginBottom: '1rem', width: '100%' }}>
          <NavLink 
            to="/statistiques" 
            className={location.pathname === '/statistiques' ? 'active' : ''}
            style={{ 
              textDecoration: 'none', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px',
              transition: 'background-color 0.3s ease-in-out'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FaChartBar style={{ marginRight: '10px' }} />
            <span>Statistiques</span>
          </NavLink>
        </li>
      </ul>
      <button
        onClick={handleLogout}
        style={{
          marginTop: 'auto',
          backgroundColor: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#c0392b')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#e74c3c')}
      >
        Déconnexion
      </button>
    </nav>
  );
};

export default Navbar;
