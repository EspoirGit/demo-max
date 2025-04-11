import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Fonction pour personnaliser les icônes selon le niveau de remplissage
const getMarkerIcon = (niveau) => {
  let color = niveau > 80 ? 'red' : niveau > 50 ? 'orange' : 'green';
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

function App() {
  const [poubelles, setPoubelles] = useState([]);
  const [selectedPoubelle, setSelectedPoubelle] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pleines: 0,
    moyenRemplissage: 0
  });
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchPoubelles();
    // Actualisation toutes les 30 secondes
    const interval = setInterval(fetchPoubelles, 30000);
    
    // Gestion du redimensionnement de la fenêtre
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchPoubelles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/poubelles');
      setPoubelles(response.data);
      
      // Calcul des statistiques
      const total = response.data.length;
      const pleines = response.data.filter(p => p.niveau > 80).length;
      const moyenRemplissage = total > 0 
        ? response.data.reduce((acc, p) => acc + p.niveau, 0) / total
        : 0;
      
      setStats({
        total,
        pleines,
        moyenRemplissage: Math.round(moyenRemplissage)
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  // Fonction pour récupérer la couleur selon le niveau
  const getNiveauColor = (niveau) => {
    if (niveau > 80) return '#e74c3c'; // Rouge
    if (niveau > 50) return '#f39c12'; // Orange
    return '#2ecc71'; // Vert
  };

  // Fonction pour déterminer si on est sur mobile
  const isMobile = viewportWidth < 768;

  return (
    <div style={{ 
      padding: isMobile ? '10px' : '20px', 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh'
    }}>
      <header style={{ 
        marginBottom: '15px', 
        borderBottom: '1px solid #ddd', 
        paddingBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          color: '#2c3e50',
          fontSize: isMobile ? '1.5rem' : '2rem',
          margin: '0'
        }}>
          Dashboard Poubelles Intelligentes
        </h1>
        
        {isMobile && (
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: '#3498db',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isMenuOpen ? 'Fermer' : 'Menu'}
          </button>
        )}
      </header>

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: isMobile ? '10px' : '20px', 
        marginBottom: isMobile ? '10px' : '20px' 
      }}>
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '15px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          width: '100%' 
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Statistiques</h3>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            textAlign: 'center',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? '10px' : '0'
          }}>
            <div style={{ 
              flex: isMobile ? '1 0 30%' : '1',
              padding: '5px'
            }}>
              <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold' }}>{stats.total}</div>
              <div>Total</div>
            </div>
            <div style={{ 
              flex: isMobile ? '1 0 30%' : '1',
              padding: '5px'
            }}>
              <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: '#e74c3c' }}>
                {stats.pleines}
              </div>
              <div>Pleines</div>
            </div>
            <div style={{ 
              flex: isMobile ? '1 0 30%' : '1',
              padding: '5px'
            }}>
              <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold' }}>
                {stats.moyenRemplissage}%
              </div>
              <div>Moyen</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '10px' : '20px',
      }}>
        {/* Carte - toujours visible */}
        <div style={{ 
          flex: '2', 
          minWidth: isMobile ? '100%' : '300px', 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          order: isMobile ? '1' : '0'
        }}>
          <h3 style={{ 
            padding: isMobile ? '10px' : '15px', 
            borderBottom: '1px solid #ddd', 
            margin: 0 
          }}>
            Carte des poubelles
          </h3>
          <div style={{ height: isMobile ? '300px' : '500px', padding: isMobile ? '10px' : '15px' }}>
            <MapContainer 
              center={[48.8566, 2.3522]} 
              zoom={13} 
              style={{ height: '100%', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {poubelles.map(p => (
                <Marker 
                  key={p.id} 
                  position={[p.latitude, p.longitude]}
                  icon={getMarkerIcon(p.niveau)}
                  eventHandlers={{
                    click: () => {
                      setSelectedPoubelle(p);
                      if (isMobile) setIsMenuOpen(false);
                    }
                  }}
                >
                  <Popup>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{p.nom}</h4>
                      <div style={{ marginBottom: '5px' }}>Niveau: <strong>{p.niveau}%</strong></div>
                      <div style={{ 
                        width: '100%', 
                        height: '10px', 
                        backgroundColor: '#eee', 
                        borderRadius: '5px', 
                        overflow: 'hidden' 
                      }}>
                        <div style={{ 
                          width: `${p.niveau}%`, 
                          height: '100%', 
                          backgroundColor: getNiveauColor(p.niveau) 
                        }}></div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Liste des poubelles - conditionnellement visible sur mobile */}
        {(!isMobile || isMenuOpen) && (
          <div style={{ 
            flex: '1', 
            minWidth: isMobile ? '100%' : '300px', 
            backgroundColor: '#fff', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
            maxHeight: isMobile ? '300px' : '550px', 
            overflow: 'auto',
            order: isMobile ? '0' : '1'
          }}>
            <h3 style={{ 
              padding: isMobile ? '10px' : '15px', 
              borderBottom: '1px solid #ddd', 
              margin: 0, 
              position: 'sticky', 
              top: 0, 
              backgroundColor: '#fff' 
            }}>
              État des poubelles
            </h3>
            <div>
              {poubelles.map(p => (
                <div 
                  key={p.id}
                  style={{ 
                    padding: isMobile ? '10px' : '15px', 
                    borderBottom: '1px solid #eee',
                    backgroundColor: selectedPoubelle?.id === p.id ? '#f0f7ff' : 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedPoubelle(p);
                    if (isMobile) setIsMenuOpen(false);
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '10px',
                    alignItems: 'center'
                  }}>
                    <div style={{ 
                      fontWeight: 'bold',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                      {p.nom}
                    </div>
                    <div style={{ 
                      color: getNiveauColor(p.niveau),
                      fontWeight: 'bold',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                      {p.niveau}%
                    </div>
                  </div>
                  
                  {/* Jauge de niveau */}
                  <div style={{ 
                    width: '100%', 
                    height: '12px', 
                    backgroundColor: '#eee',
                    borderRadius: '6px', 
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      width: `${p.niveau}%`, 
                      height: '100%', 
                      backgroundColor: getNiveauColor(p.niveau),
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>

                  {/* Représentation visuelle de la poubelle (masquée sur très petits écrans) */}
                  {viewportWidth > 480 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                      <div style={{ 
                        width: isMobile ? '30px' : '40px',
                        height: isMobile ? '45px' : '60px',
                        border: '2px solid #555',
                        borderRadius: '0 0 5px 5px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          width: '100%',
                          height: `${p.niveau}%`,
                          backgroundColor: getNiveauColor(p.niveau),
                          transition: 'height 0.5s ease'
                        }}></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Détails de la poubelle sélectionnée */}
      {selectedPoubelle && (
        <div style={{ 
          marginTop: isMobile ? '10px' : '20px', 
          backgroundColor: '#fff', 
          padding: isMobile ? '10px' : '15px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
            Détails: {selectedPoubelle.nom}
          </h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: '20px' 
          }}>
            <div style={{ flex: '1', minWidth: isMobile ? '100%' : '250px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>ID:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                      {selectedPoubelle.id}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Niveau:</td>
                    <td style={{ 
                      padding: '8px', 
                      borderBottom: '1px solid #eee', 
                      fontWeight: 'bold', 
                      color: getNiveauColor(selectedPoubelle.niveau) 
                    }}>
                      {selectedPoubelle.niveau}%
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Coordonnées:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                      {selectedPoubelle.latitude}, {selectedPoubelle.longitude}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ 
              flex: '1', 
              minWidth: isMobile ? '100%' : '250px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              paddingBottom: isMobile ? '15px' : '0'
            }}>
              <div style={{ 
                width: isMobile ? '80px' : '100px',
                height: isMobile ? '120px' : '150px',
                border: '3px solid #555',
                borderRadius: '0 0 10px 10px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  height: `${selectedPoubelle.niveau}%`,
                  backgroundColor: getNiveauColor(selectedPoubelle.niveau),
                  transition: 'height 0.5s ease'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: isMobile ? '16px' : '20px',
                  fontWeight: 'bold',
                  color: selectedPoubelle.niveau > 50 ? '#fff' : '#333'
                }}>
                  {selectedPoubelle.niveau}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;