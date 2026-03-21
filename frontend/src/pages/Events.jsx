import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Events() {
  const { user } = useAuth();
  let eventData = [];
  if (user?.email === 'teja@gmail.com') {
    eventData = [

    { id: 1, title: 'System Design Workshop', date: 'Oct 14, 2:00 PM', location: 'Auditorium B', attendees: 142 },
    { id: 2, title: 'Annual Cultural Fest Registrations', date: 'Oct 18, 9:00 AM', location: 'Main Ground', attendees: 580 },
    { id: 3, title: 'AI Guest Lecture by Dr. Harrison', date: 'Oct 22, 11:00 AM', location: 'Seminar Hall 1', attendees: 84 },
  
    ];
  }

  return (
    <div style={{ padding: '0 48px' }}>
      <div className="section-header" style={{ marginBottom: 32 }}>
        <h2 className="section-title" style={{ fontSize: 24 }}>Campus Events</h2>
        <button className="btn-primary">Host an Event</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
        {eventData.map(e => (
           <div className="widget-card alt-bg" key={e.id} style={{ padding: 24 }}>
              <div className="tag-active-now" style={{ backgroundColor: 'var(--dark-accent)', marginBottom: 16 }}>{e.date}</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{e.title}</h3>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>📍 {e.location}</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-color)' }}>{e.attendees} Registered</div>
                 <button className="btn-outline" style={{ margin: 0, padding: '8px 16px', width: 'auto' }}>Reserve Seat</button>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
