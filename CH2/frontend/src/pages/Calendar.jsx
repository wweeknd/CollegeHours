import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Calendar() {
  const { user } = useAuth();
  
  const isDemo = user?.email?.endsWith('@demo.edu');

  const fillerEvents = isDemo ? [
    { day: 14, title: 'Compiler Design Submission', type: 'deadline' },
    { day: 15, title: 'Ethics Seminar', type: 'deadline' },
    { day: 14, title: 'System Design Workshop', type: 'event' },
    { day: 18, title: 'Annual Cultural Fest', type: 'event' },
    { day: 19, title: 'Stripe Intern Deadline', type: 'placement' },
    { day: 16, title: 'Dr. Aris (11:00 AM)', type: 'faculty' },
    { day: 22, title: 'AI Guest Lecture', type: 'event' },
    { day: 25, title: 'NVIDIA Applications Close', type: 'placement' },
  ] : [];

  const renderDays = () => {
    let cells = [];
    const colorMap = {
      deadline: 'var(--alert-color)', // Red
      event: 'var(--primary-color)', // Green
      placement: '#1976D2', // Blue
      faculty: '#9C27B0' // Purple
    };

    for (let day = 1; day <= 31; day++) {
       const dayEvents = fillerEvents.filter(e => e.day === day);
       cells.push(
         <div key={day} style={{ 
            minHeight: 110, padding: 8, backgroundColor: 'var(--surface-color)',
            display: 'flex', flexDirection: 'column', gap: 4
         }}>
           <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{day}</div>
           {dayEvents.map((evt, idx) => (
              <div key={idx} style={{
                backgroundColor: colorMap[evt.type],
                color: '#fff', fontSize: 11, padding: '4px 6px',
                borderRadius: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600
              }}>
                {evt.title}
              </div>
           ))}
         </div>
       );
    }
    return cells;
  }

  return (
    <div style={{ padding: '0 48px' }}>
      <div className="section-header" style={{ marginBottom: 32 }}>
        <h2 className="section-title" style={{ fontSize: 24 }}>Academic Calendar</h2>
        <div style={{ display: 'flex', gap: 16 }}>
           <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, backgroundColor: 'var(--alert-color)', borderRadius: '50%' }}></div> Deadlines</span>
           <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, backgroundColor: 'var(--primary-color)', borderRadius: '50%' }}></div> Events</span>
           <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, backgroundColor: '#1976D2', borderRadius: '50%' }}></div> Placements</span>
           <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, backgroundColor: '#9C27B0', borderRadius: '50%' }}></div> Faculty Slots</span>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', padding: 1, borderRadius: 16, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
         <div style={{ padding: 24, backgroundColor: 'var(--surface-color)' }}>
            <h3 style={{ fontSize: 18, margin: 0, color: 'var(--text-primary)' }}>October 2024</h3>
         </div>
         
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: 'var(--border-color)' }}>
            {/* Headers */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(h => (
               <div key={h} style={{ padding: 12, backgroundColor: 'var(--surface-alt)', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{h}</div>
            ))}
            
            {/* Empty slots for Oct 2024 (starts on Tuesday) */}
            <div style={{ backgroundColor: 'var(--bg-color)' }}></div>
            {renderDays()}
            {/* Pad remaining to 35 grid cells (1 empty + 31 days = 32. 42 total items for 6 weeks) */}
            <div style={{ backgroundColor: 'var(--bg-color)' }}></div>
            <div style={{ backgroundColor: 'var(--bg-color)' }}></div>
            <div style={{ backgroundColor: 'var(--bg-color)' }}></div>
            <div style={{ backgroundColor: 'var(--bg-color)' }}></div>
            <div style={{ backgroundColor: 'var(--bg-color)' }}></div>
            <div style={{ backgroundColor: 'var(--bg-color)' }}></div>
            <div style={{ backgroundColor: 'var(--bg-color)' }}></div>
            <div style={{ backgroundColor: 'var(--bg-color)' }}></div>
            <div style={{ backgroundColor: 'var(--bg-color)' }}></div>
            <div style={{ backgroundColor: 'var(--bg-color)' }}></div>
         </div>
      </div>
    </div>
  );
}
