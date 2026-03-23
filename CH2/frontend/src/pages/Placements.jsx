import React from 'react';
import { useAuth } from '../context/AuthContext';
import { IconBriefcase } from '../utils/icons';

export default function Placements() {
  const { user } = useAuth();
  let placementData = [];
  if (user?.email?.endsWith('@demo.edu')) {
    placementData = [

    { id: 1, company: 'Google Cloud India', role: 'Software Engineer', ctc: '32 LPA', deadline: 'Tomorrow', type: 'Full-Time' },
    { id: 2, company: 'Stripe', role: 'Backend Engineering Intern', ctc: '18 LPA', deadline: 'Oct 20', type: 'Summer Internship' },
    { id: 3, company: 'NVIDIA', role: 'AI Researcher', ctc: '24 LPA', deadline: 'Oct 25', type: 'Full-Time' }
  
    ];
  }

  return (
    <div style={{ padding: '0 48px' }}>
      <div className="section-header" style={{ marginBottom: 32 }}>
        <h2 className="section-title" style={{ fontSize: 24 }}>Placement Opportunities</h2>
        <button className="btn-outline" style={{width: 'auto', margin: 0}}>Upload Resume</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        {placementData.map(p => (
           <div className="list-card" key={p.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div className="icon-box" style={{ backgroundColor: 'var(--primary-light)', padding: 12 }}>
                 <IconBriefcase />
              </div>
              <div className="list-content" style={{ marginLeft: 20, flex: 1 }}>
                 <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span className="tag-active-now" style={{ margin: 0, padding: '2px 8px', fontSize: 9 }}>{p.type}</span>
                    <span style={{ fontSize: 11, color: 'var(--primary-color)', fontWeight: 600, border: '1px solid var(--primary-color)', borderRadius: 12, padding: '2px 8px' }}>{p.ctc}</span>
                 </div>
                 <div className="list-title" style={{ fontSize: 18 }}>{p.company}</div>
                 <div className="list-subtitle">{p.role}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: 13, color: 'var(--alert-color)', fontWeight: 600, marginBottom: 8 }}>Closes {p.deadline}</div>
                 <button className="btn-primary" style={{ padding: '8px 16px' }}>Apply Now</button>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
