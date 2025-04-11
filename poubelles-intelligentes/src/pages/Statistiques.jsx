import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import pour la navigation

const Statistiques = () => {
  const [poubelles, setPoubelles] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pleines: 0,
    moities: 0,
    vides: 0
  });

  const navigate = useNavigate(); // Hook pour naviguer vers une autre page

  useEffect(() => {
    // Récupération des données des poubelles
    const fetchPoubelles = async () => {
      try {
        // Revert to localhost for local development
        const response = await axios.get('http://localhost:3000/api/poubelles');
        const poubellesData = response.data;

        // Calculate statistics immediately
        const total = poubellesData.length;
        const pleines = poubellesData.filter(p => p.niveau === 100).length;
        const moities = poubellesData.filter(p => p.niveau === 50).length;
        const vides = poubellesData.filter(p => p.niveau === 0).length;

        setStats({ total, pleines, moities, vides });

        // Fetch additional details (city and district) asynchronously
        const updatedPoubelles = await Promise.all(
          poubellesData.map(async (poubelle) => {
            try {
              const geoResponse = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${poubelle.latitude}+${poubelle.longitude}&key=99afeb935f604165a28df710f231700a`
              );
              const { city, suburb } = geoResponse.data.results[0].components;
              return {
                ...poubelle,
                city: city || 'Inconnu',
                district: suburb || 'Inconnu'
              };
            } catch (error) {
              console.error(`Erreur lors de la conversion des coordonnées pour la poubelle ${poubelle.id} :`, error);
              return { ...poubelle, city: 'Erreur', district: 'Erreur' };
            }
          })
        );

        setPoubelles(updatedPoubelles);
      } catch (error) {
        console.error('Erreur lors de la récupération des poubelles :', error);
      }
    };

    fetchPoubelles();
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Statistiques</h2>
      <p>Cette page affichera des statistiques sur les poubelles.</p>
      {/* Ajoutez ici les graphiques ou données statistiques */}
      {/* Barre des statistiques globales */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#ffffff', 
        padding: '1rem',
        margin: '10rem 0 0rem ', 
        borderRadius: '12px', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        width: '100%', 
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#34495e' }}>{stats.total}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Total</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#e74c3c' }}>{stats.pleines}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Remplies (100%)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#2ecc71' }}>{stats.moities}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Remplis à moitié (50%)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#7f8c8d' }}>{stats.vides}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Vides (0%)</p>
        </div>
      </div>

      {/* Cartes des poubelles */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        marginTop: '2rem', 
        marginLeft: '0' 
      }}>
        {poubelles.map((poubelle) => (
          <div 
            key={poubelle.id} 
            style={{ 
              backgroundColor: '#fff', 
              borderRadius: '12px', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
              padding: '1rem', 
              width: 'calc(33.333% - 1rem)', 
              minWidth: '300px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
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
            {/* Icône de la poubelle */}
            <FaTrashAlt 
              style={{ 
                fontSize: '3rem', 
                color: '#34495e', 
                marginBottom: '1rem' 
              }} 
            />

            {/* Nom de la poubelle */}
            <h3 style={{ margin: '0 0 1rem 0', color: '#34495e', textAlign: 'center' }}>
              {poubelle.nom}
            </h3>

            {/* Diagramme circulaire */}
            <div style={{ width: '80px', height: '80px', marginBottom: '1rem' }}>
              <CircularProgressbar 
                value={poubelle.niveau} 
                text={`${poubelle.niveau}%`} 
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: poubelle.niveau > 80 ? '#e74c3c' : poubelle.niveau > 50 ? '#f39c12' : '#2ecc71',
                  textColor: '#34495e',
                  trailColor: '#d6d6d6'
                })}
              />
            </div>

            {/* Ville et Quartier */}
            <p style={{ margin: 0, color: '#7f8c8d', textAlign: 'center' }}>
              Ville : {poubelle.city} <br />
              Quartier : {poubelle.district}
            </p>

            {/* Bouton Voir */}
            <button 
              onClick={() => navigate(`/ramassage?latitude=${poubelle.latitude}&longitude=${poubelle.longitude}`)}
              style={{ 
                marginTop: '1rem', 
                padding: '0.5rem 1rem', 
                backgroundColor: '#3498db', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                transition: 'background-color 0.3s ease, transform 0.3s ease' // Smooth animation
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2980b9';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3498db';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Voir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistiques;
