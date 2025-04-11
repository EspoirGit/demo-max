import React from 'react';

const PoubelleList = ({ poubelles, selectedPoubelle, setSelectedPoubelle, getNiveauColor, isMobile }) => (
  <div style={{ 
    flex: '1', 
    minWidth: isMobile ? '100%' : '300px', 
    backgroundColor: '#fff', 
    borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(255, 255, 255, 0.1)', 
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
          onClick={() => setSelectedPoubelle(p)}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '10px',
            alignItems: 'center'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>{p.nom}</div>
            <div style={{ color: getNiveauColor(p.niveau), fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
              {p.niveau}%
            </div>
          </div>
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
        </div>
      ))}
    </div>
  </div>
);

export default PoubelleList;
