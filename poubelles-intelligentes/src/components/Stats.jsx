import React from 'react';

const Stats = ({ stats, isMobile }) => (
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
      <div style={{ flex: isMobile ? '1 0 30%' : '1', padding: '5px' }}>
        <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold' }}>{stats.total}</div>
        <div>Total</div>
      </div>
      <div style={{ flex: isMobile ? '1 0 30%' : '1', padding: '5px' }}>
        <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: '#e74c3c' }}>
          {stats.pleines}
        </div>
        <div>Pleines</div>
      </div>
      <div style={{ flex: isMobile ? '1 0 30%' : '1', padding: '5px' }}>
        <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold' }}>
          {stats.moyenRemplissage}%
        </div>
        <div>Moyen</div>
      </div>
    </div>
  </div>
);

export default Stats;
