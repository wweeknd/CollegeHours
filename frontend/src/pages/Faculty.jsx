import React from 'react';
import { useAuth } from '../context/AuthContext';
import { IconUsers, IconMessageFill } from '../utils/icons';

export default function Faculty() {
  const { user } = useAuth();
  let facultyData = [];
  if (user?.email === 'teja@gmail.com') {
    facultyData = [

    { id: 1, name: 'Professor Aris Thorne', dept: 'Systems Architecture', slots: 3, available: true, color: '#d1dfc7' },
    { id: 2, name: 'Dr. Sarah Jenkins', dept: 'Applied Mathematics', slots: 0, available: false, color: '#dce1e3' },
    { id: 3, name: 'Dr. Elena Rodriguez', dept: 'Artificial Intelligence', slots: 6, available: true, color: '#f2ebd9' },
  
    ];
  }

  return (
    <div style={{ padding: '0 48px' }}>
      <div className="section-header" style={{ marginBottom: 32 }}>
        <h2 className="section-title" style={{ fontSize: 24 }}>Faculty Directory & Office Hours</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {facultyData.map(fac => (
           <div className="widget-card alt-bg" key={fac.id} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                 <div className="fac-avatar" style={{ width: 56, height: 56 }}>
                   <div style={{width:'100%', height:'100%', borderRadius: 12, backgroundColor: fac.color}}></div>
                   <div className="status-dot" style={{backgroundColor: fac.available ? '#4CAF50' : '#FF9800', width: 14, height: 14}}></div>
                 </div>
                 <div className="fac-info">
                   <div className="fac-name" style={{ fontSize: 16 }}>{fac.name}</div>
                   <div className="fac-status-text" style={{ fontSize: 13 }}>{fac.dept}</div>
                 </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border-color)', margin: '8px 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    <strong>{fac.slots}</strong> slots available
                 </div>
                 <button className="btn-outline" style={{ margin: 0, padding: '8px 16px', width: 'auto' }} disabled={!fac.available}>
                    {fac.available ? 'Book a Slot' : 'Unavailable'}
                 </button>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
