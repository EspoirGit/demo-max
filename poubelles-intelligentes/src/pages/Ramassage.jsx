import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polyline } from 'react-leaflet'; // Import de Tooltip
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Configuration des icônes Leaflet
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const Ramassage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');

  const [userPosition, setUserPosition] = useState(null);
  const [route, setRoute] = useState(null);
  const [poubelles, setPoubelles] = useState([]);
  const [locationDetails, setLocationDetails] = useState({ city: '', district: '' }); // Stocke la ville et le quartier

  useEffect(() => {
    // Géolocalisation de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération de la position :', error);
        }
      );
    } else {
      console.error('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  }, []);

  useEffect(() => {
    // Si des coordonnées spécifiques sont fournies et que la position de l'utilisateur est disponible
    if (latitude && longitude && userPosition) {
      const fetchRoute = async () => {
        try {
          const response = await axios.get(
            `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624811968bc4fa4f423c9fe2eb6139546ec0&start=${userPosition.longitude},${userPosition.latitude}&end=${longitude},${latitude}`
          );
          const coordinates = response.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRoute(coordinates);
        } catch (error) {
          console.error('Erreur lors de la récupération du trajet :', error);
        }
      };

      fetchRoute();
    }
  }, [latitude, longitude, userPosition]);

  useEffect(() => {
    // Si aucune latitude et longitude ne sont spécifiées, récupérer toutes les poubelles
    if (!latitude || !longitude) {
      const fetchPoubelles = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/poubelles'); // Remplacez par votre endpoint API
          setPoubelles(response.data);

          // Récupérer les détails de localisation pour chaque poubelle
          const details = {};
          for (const poubelle of response.data) {
            const { latitude, longitude } = poubelle;
            try {
              const locationResponse = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=99afeb935f604165a28df710f231700a`
              );
              const { city, suburb } = locationResponse.data.results[0].components;
              details[poubelle.id] = { city: city || 'Inconnu', district: suburb || 'Inconnu' };
            } catch (error) {
              console.error(`Erreur lors de la récupération des détails pour la poubelle ${poubelle.id} :`, error);
              details[poubelle.id] = { city: 'Erreur', district: 'Erreur' };
            }
          }
          setLocationDetails(details);
        } catch (error) {
          console.error('Erreur lors de la récupération des poubelles :', error);
        }
      };

      fetchPoubelles();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // Géocodage inversé pour obtenir la ville et le quartier
    const fetchLocationDetails = async () => {
      if (latitude && longitude) {
        try {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=99afeb935f604165a28df710f231700a`
          );
          const { city, suburb } = response.data.results[0].components;
          setLocationDetails({ city: city || 'Inconnu', district: suburb || 'Inconnu' });
        } catch (error) {
          console.error('Erreur lors de la récupération des détails de localisation :', error);
        }
      }
    };

    fetchLocationDetails();
  }, [latitude, longitude]);

  // Fonction pour déterminer la couleur et l'icône du marqueur en fonction du niveau de remplissage
  const getMarkerIcon = (niveau) => {
    if (niveau > 80) return createCustomIcon('red'); // Rouge pour les poubelles pleines
    if (niveau > 50) return createCustomIcon('orange'); // Orange pour les poubelles moyennement pleines
    if (niveau = 0) return createCustomIcon('black'); // Orange pour les poubelles moyennement pleines
    return createCustomIcon('green'); // Vert pour les poubelles vides ou peu remplies
  };

  return (
    <div style={{ 
      padding: '1rem', 
      fontFamily: 'Arial, sans-serif', 
      marginLeft: '', 
      width: '80vw', 
      height: '100%'
    }}>
      <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
        {latitude && longitude ? 'Position de la Poubelle' : 'Carte des Poubelles'}
      </h2>
      {latitude && longitude && (
        <p style={{ marginBottom: '1rem', color: '#34495e' }}>
          Ville : {locationDetails.city}, Quartier : {locationDetails.district}
        </p>
      )}
      <div style={{ 
        height: '500px', 
        width: '100%', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        background: 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent
        backdropFilter: 'blur(10px)', // Effet de flou
        WebkitBackdropFilter: 'blur(10px)', // Compatibilité avec Safari
        border: '1px solid rgba(255, 255, 255, 0.3)' // Bordure fine translucide
      }}>
        <MapContainer 
          center={latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : [6.4483, 2.3557]} 
          zoom={latitude && longitude ? 16 : 14} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Marqueur pour la position de l'utilisateur */}
          {userPosition && (
            <Marker 
              position={[userPosition.latitude, userPosition.longitude]} 
              icon={createCustomIcon('blue')} // Icône bleue pour l'utilisateur
            >
              <Popup>
                Votre position actuelle : <br />
                Latitude: {userPosition.latitude}, Longitude: {userPosition.longitude}
              </Popup>
            </Marker>
          )}

          {/* Si des coordonnées spécifiques sont fournies, afficher uniquement cette poubelle */}
          {latitude && longitude ? (
            <Marker 
              position={[parseFloat(latitude), parseFloat(longitude)]} 
              icon={createCustomIcon('red')} // Icône rouge pour la poubelle sélectionnée
            >
              <Popup>
                Poubelle située ici : <br />
                Latitude: {latitude}, Longitude: {longitude}
              </Popup>
              <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                Poubelle sélectionnée
              </Tooltip>
            </Marker>
          ) : (
            // Sinon, afficher toutes les poubelles
            poubelles.map((poubelle) => (
              <Marker 
                key={poubelle.id} 
                position={[poubelle.latitude, poubelle.longitude]} 
                icon={getMarkerIcon(poubelle.niveau)}
              >
                <Popup>
                  <strong>{poubelle.nom}</strong> <br />
                  Niveau de remplissage : {poubelle.niveau}% <br />
                  Latitude : {poubelle.latitude}, Longitude : {poubelle.longitude} <br />
                  Ville : {locationDetails[poubelle.id]?.city || 'Chargement...'} <br />
                  Quartier : {locationDetails[poubelle.id]?.district || 'Chargement...'}
                </Popup>
                <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                  {poubelle.nom}
                </Tooltip>
              </Marker>
            ))
          )}

          {/* Tracé du trajet */}
          {route && <Polyline positions={route} color="blue" />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Ramassage;
