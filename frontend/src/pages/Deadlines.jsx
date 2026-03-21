import React from 'react';
import { useAuth } from '../context/AuthContext';
import { IconClock } from '../utils/icons';

export default function Deadlines() {
  const { user } = useAuth();
  let deadlineData = [];
  if (user?.email === 'teja@gmail.com') {
    deadlineData = [

    { id: 1, title: 'Compiler Design Submission', subject: 'CS402', due: 'Today, 11:59 PM', urgent: true },
    { id: 2, title: 'Ethics Seminar Registration', subject: 'GEN101', due: 'Tomorrow, 5:00 PM', urgent: false },
    { id: 3, title: 'Final Year Project Synopsis', subject: 'CS500', due: 'Oct 20, 11:59 PM', urgent: false },
  
    ];
  }

  return (
    <div style={{ padding: '0 48px' }}>
      <div className="section-header" style={{ marginBottom: 32 }}>
        <h2 className="section-title" style={{ fontSize: 24 }}>Upcoming Deadlines</h2>
        <button className="btn-outline" style={{width: 'auto', margin: 0}}>Sync Calendar</button>
      </div>

      <div className="widget-card">
         {deadlineData.map(d => (
             <div className="list-card" key={d.id} style={{ marginBottom: 16, backgroundColor: d.urgent ? 'var(--alert-light)' : 'var(--surface-alt)' }}>
                <div className="icon-box" style={{ backgroundColor: '#fff', color: d.urgent ? 'var(--alert-color)' : 'var(--primary-color)' }}>
                   <IconClock />
                </div>
                <div className="list-content">
                   <div className="list-title" style={{ color: d.urgent ? 'var(--alert-color)' : 'var(--text-primary)' }}>{d.title}</div>
                   <div className="list-subtitle">{d.subject}</div>
                </div>
                <div className="list-meta" style={{ fontSize: 13, fontWeight: 600, color: d.urgent ? 'var(--alert-color)' : 'var(--text-primary)'}}>
                   {d.due}
                </div>
             </div>
         ))}
      </div>
    </div>
  );
}
