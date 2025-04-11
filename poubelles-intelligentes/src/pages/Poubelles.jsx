import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import de useNavigate pour la redirection
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Poubelles = () => {
  const [poubelles, setPoubelles] = useState([]);
  const navigate = useNavigate(); // Hook pour la navigation

  useEffect(() => {
    // Initialiser AOS
    AOS.init({ duration: 1000, once: true });

    // Récupération des données des poubelles
    const fetchPoubelles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/poubelles`);
        setPoubelles(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des poubelles :', error);
      }
    };

    fetchPoubelles();
    const interval = setInterval(fetchPoubelles, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fonction pour déterminer la couleur du bouton en fonction du niveau de remplissage
  const getButtonColor = (niveau) => {
    if (niveau === 50) return '#2ecc71'; // Vert pour 50%
    if (niveau >0 && niveau <=99 ) return '#FFA500'; // Vert pour 50%
    if (niveau === 0 ) return '#D3D3D3'; // Vert pour 50%
    if (niveau === 100) return '#e74c3c'; // Rouge pour 100%
    return '#bdc3c7'; // Gris pour l'état "vide" ou inconnu
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Liste des Poubelles</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {poubelles.map((poubelle) => (
          <div 
            key={poubelle.id} 
            data-aos="fade-up" // Animation AOS
            style={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
              padding: '1rem', 
              width: 'calc(33.333% - 1rem)', 
              minWidth: '250px',
              boxSizing: 'border-box',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out' // Smooth animation
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
          >
            <h3 style={{ margin: 0, color: '#34495e' }}>{poubelle.nom || 'Poubelle inconnue'}</h3>
            <button
              style={{
                backgroundColor: getButtonColor(poubelle.niveau),
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease, transform 0.3s ease' // Smooth animation
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} 
            >
              {poubelle.niveau !== undefined ? `${poubelle.niveau}%` : 'Vide'}
            </button>
          </div>
        ))}
      </div>
      {/* Légende des couleurs */}
      <div style={{ marginTop: '2rem', marginBottom: '1rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#2ecc71', borderRadius: '50%' }}></div>
            <span style={{ color: '#34495e', fontWeight: 'bold' }}>Pas remplies</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#e74c3c', borderRadius: '50%' }}></div>
            <span style={{ color: '#34495e', fontWeight: 'bold' }}>Remplies</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#bdc3c7', borderRadius: '50%' }}></div>
            <span style={{ color: '#34495e', fontWeight: 'bold' }}>Vide</span>
          </div>
        </div>
      </div>
      {/* Bouton Voir sur la carte */}
      <div style={{ textAlign: 'left' }}>
        <button
          onClick={() => navigate('/ramassage')} // Redirection vers la page Ramassage
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
        >
          Voir sur la carte
        </button>
      </div>
    </div>
  );
};

export default Poubelles;
