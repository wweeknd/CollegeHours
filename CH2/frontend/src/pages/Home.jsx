import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  IconMapPin, IconMegaphone, IconRotate, IconClock, 
  IconMessageFill, IconEdit, IconBell, 
  IconGrid, IconMessage, IconCalendar, IconBriefcase, 
} from '../utils/icons';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Provide fallbacks just in case
  const role = user?.role || 'Student';
  const name = user?.name || 'Guest User';
  
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('normal');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard', err);
        // If token is invalid/expired, force re-login
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboard();
  }, []);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/announcements', {
        title: newTitle,
        description: newDesc,
        priority: newPriority,
        tags: ['general']
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newAnn = {
        id: res.data._id,
        title: res.data.title,
        desc: res.data.description,
        time: new Date(res.data.createdAt).toLocaleDateString(),
        priority: res.data.priority,
        author: res.data.createdBy?.name || 'Faculty'
      };

      setDashboardData(prev => ({
        ...prev,
        announcements: [newAnn, ...prev.announcements]
      }));

      // Clear and close
      setNewTitle('');
      setNewDesc('');
      setNewPriority('normal');
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to post announcement.');
    }
  };


  if (isLoading || !dashboardData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  const mockData = dashboardData;

  return (
    <div style={{ paddingBottom: 40 }}>

      {/* 2. Quick Summary / Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 32 }}>
        {[
          { icon: <IconClock />, value: mockData.deadlines.length, label: 'Upcoming Deadlines', color: 'var(--alert-color)' },
          { icon: <IconCalendar />, value: mockData.timetable.length, label: 'Classes Today', color: 'var(--primary-color)' },
          { icon: <IconMegaphone />, value: mockData.announcements.filter(a => a.priority === 'urgent').length, label: 'Urgent Notices', color: 'var(--alert-color)' },
          { icon: <IconGrid />, value: mockData.events.length, label: 'Upcoming Events', color: 'var(--text-primary)' },
        ].map((stat, i) => (
          <div key={i} className="widget-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
             <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                {stat.icon}
             </div>
             <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</div>
             </div>
          </div>
        ))}
      </div>

      <div className="dashboard-layout">
        {/* LEFT COLUMN */}
        <div className="main-column">
           
           {/* 4. Today's Timetable */}
           <div className="widget-card">
              <div className="section-header">
                <h3 className="section-title">Today's Timetable</h3>
                <button className="view-all">Full schedule</button>
              </div>
              
              {mockData.timetable.length === 0 ? (
                <p style={{color: 'var(--text-muted)'}}>No classes scheduled for today.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {mockData.timetable.map(cls => (
                     <div key={cls.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 12, backgroundColor: cls.status === 'current' ? 'var(--primary-light)' : 'var(--surface-alt)', borderLeft: cls.status === 'current' ? '4px solid var(--primary-color)' : '4px solid transparent' }}>
                       <div style={{ width: 80, fontSize: 13, fontWeight: 600, color: cls.status === 'completed' ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                         {cls.time.split(' - ')[0]}
                       </div>
                       <div style={{ flex: 1 }}>
                         <div style={{ fontSize: 15, fontWeight: 600, color: cls.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)', marginBottom: 2 }}>{cls.subject}</div>
                         <div style={{ fontSize: 12, color: cls.status === 'completed' ? 'var(--text-muted)' : 'var(--text-secondary)' }}>{cls.time}</div>
                       </div>
                       {cls.status === 'current' && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-color)', backgroundColor: 'rgba(91, 108, 65, 0.1)', padding: '4px 10px', borderRadius: 20 }}>NOW</span>}
                     </div>
                  ))}
                </div>
              )}
           </div>

           {/* 3. Announcements Section */}
           <div>
              <div className="section-header">
                <h3 className="section-title">Latest Announcements</h3>
                <button className="view-all">View all</button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {mockData.announcements.length === 0 ? (
                  <p style={{color: 'var(--text-muted)'}}>No announcements yet.</p>
                ) : (
                  mockData.announcements.map(item => (
                     <div className="list-card" key={item.id} style={{ alignItems: 'flex-start' }}>
                       <div className="icon-box" style={{ 
                          backgroundColor: item.priority === 'urgent' ? 'var(--alert-light)' : '#e8e2d2',
                          color: item.priority === 'urgent' ? 'var(--alert-color)' : 'var(--primary-color)'
                       }}>
                          {item.priority === 'urgent' ? <IconMegaphone /> : <IconRotate />}
                       </div>
                       <div className="list-content">
                          <div className="list-title" style={{ color: item.priority === 'urgent' ? 'var(--alert-color)' : 'inherit', marginBottom: 6 }}>
                             {item.title}
                          </div>
                          <div className="list-subtitle" style={{ lineHeight: 1.4 }}>{item.desc}</div>
                          <div className="list-meta" style={{marginTop: 8}}>By {item.author} • {item.time}</div>
                       </div>
                     </div>
                  ))
                )}
              </div>
           </div>

           {/* 6. Upcoming Events */}
           <div className="widget-card alt-bg">
              <div className="section-header">
                <h3 className="section-title">Upcoming Events</h3>
                <button className="view-all">Explore</button>
              </div>
              
              {mockData.events.length === 0 ? (
                <p style={{color: 'var(--text-muted)'}}>No upcoming events.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {mockData.events.map(ev => (
                    <div key={ev.id} style={{ padding: 20, backgroundColor: 'var(--surface-color)', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16, fontWeight: 500 }}>
                        <IconCalendar /> {ev.date}
                      </div>
                      <button className={ev.registered ? 'btn-outline' : 'btn-primary'} style={{ width: '100%', marginTop: 0, padding: '10px', fontSize: 13, justifyContent: 'center' }}>
                        {ev.registered ? 'Registered' : 'Register Now'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
           </div>

           {/* 8. Recent Q&A / Doubts */}
           <div className="widget-card">
              <div className="section-header">
                <h3 className="section-title">{role === 'Faculty' ? 'Pending Student Doubts' : 'Your Recent Doubts'}</h3>
                <button className="view-all">Go to Q&A</button>
              </div>
              
              {mockData.questions.length === 0 ? (
                <p style={{color: 'var(--text-muted)'}}>No active doubts.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {mockData.questions.map(q => (
                     <div key={q.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                         <div style={{ color: 'var(--text-secondary)' }}><IconMessage /></div>
                         <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{q.title}</div>
                       </div>
                       <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, backgroundColor: q.status === 'Resolved' ? 'var(--primary-light)' : 'var(--surface-alt)', color: q.status === 'Resolved' ? 'var(--primary-hover)' : 'var(--text-secondary)' }}>
                         {q.status}
                       </span>
                     </div>
                  ))}
                </div>
              )}
           </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="side-column">
           
           {/* 7. Quick Actions */}
           <div className="widget-card" style={{ padding: 24 }}>
              <div className="section-header">
                <h3 className="section-title">Quick Actions</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                 <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 12px', backgroundColor: 'var(--surface-alt)', borderRadius: 12, color: 'var(--text-primary)' }}>
                    <div style={{ color: 'var(--primary-color)' }}><IconMessage /></div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Ask Doubt</span>
                 </button>
                 <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 12px', backgroundColor: 'var(--surface-alt)', borderRadius: 12, color: 'var(--text-primary)' }}>
                    <div style={{ color: 'var(--primary-color)' }}><IconCalendar /></div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Timetable</span>
                 </button>
                 <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 12px', backgroundColor: 'var(--surface-alt)', borderRadius: 12, color: 'var(--text-primary)' }}>
                    <div style={{ color: 'var(--primary-color)' }}><IconClock /></div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Deadlines</span>
                 </button>
                 <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 12px', backgroundColor: 'var(--surface-alt)', borderRadius: 12, color: 'var(--text-primary)' }}>
                    <div style={{ color: 'var(--primary-color)' }}><IconMapPin /></div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Events</span>
                 </button>
              </div>
              
              {role === 'Faculty' && (
                <button onClick={() => setShowModal(true)} className="btn-primary" style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}>
                   <IconEdit /> Post Announcement
                </button>
              )}
           </div>

           {/* 5. Deadlines Section */}
           <div className="widget-card">
             <div className="widget-header">
               <IconClock />
               <span className="widget-title">Upcoming Deadlines</span>
             </div>
             
             {mockData.deadlines.length === 0 ? (
               <p style={{fontSize: 13, color: 'var(--text-muted)'}}>No upcoming deadlines.</p>
             ) : (
               mockData.deadlines.map((d) => (
                 <div className={`deadline-item ${d.urgent ? 'urgent' : ''}`} key={d.id}>
                   <div className="d-title">{d.title}</div>
                   <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 500 }}>{d.subject}</div>
                   <div className={`d-time ${d.urgent ? 'urgent' : ''}`}>
                     Due: {d.date}
                   </div>
                 </div>
               ))
             )}
             <button className="btn-outline">View All Deadlines</button>
           </div>

           {/* 10. Placement Updates Preview (For Students) */}
           {role === 'Student' && (
             <div className="widget-card alt-bg">
               <div className="widget-header" style={{ marginBottom: 16 }}>
                 <IconBriefcase />
                 <span className="widget-title">Placement Updates</span>
               </div>
               {mockData.placements.length > 0 ? (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   {mockData.placements.map(p => (
                     <div key={p.id} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 12, fontWeight: 500 }}>
                        <div style={{ color: 'var(--primary-color)' }}>•</div>
                        <div>{p.text}</div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p style={{fontSize: 13, color: 'var(--text-muted)'}}>No new updates.</p>
               )}
             </div>
           )}

           {/* 9. Upcoming Bookings */}
           <div className="promo-card">
             <div className="promo-title">Book a Space</div>
             <div className="promo-text">Reserve library pods or lab equipment beforehand.</div>
             {mockData.bookings.length > 0 && (
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                  <strong>Next:</strong> {mockData.bookings[0].text}
                </div>
             )}
             <button className="btn-neutral">Reservations</button>
           </div>
           
           {/* 11. Notifications Preview */}
           <div className="widget-card" style={{ padding: 24 }}>
             <div className="widget-header" style={{ marginBottom: 16 }}>
               <IconBell />
               <span className="widget-title">System Alerts</span>
             </div>
             {mockData.notifications.length > 0 ? (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   {mockData.notifications.map(n => (
                     <div key={n.id} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 12, fontWeight: 500 }}>
                        <div style={{ color: 'var(--alert-color)' }}>•</div>
                        <div>{n.text}</div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p style={{fontSize: 13, color: 'var(--text-muted)'}}>All caught up!</p>
             )}
           </div>

        </div>
      </div>

      {/* ANNOUNCEMENT MODAL FOR FACULTY */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ backgroundColor: '#fff', padding: 32, borderRadius: 16, width: '100%', maxWidth: 500 }}>
            <h3 style={{ marginBottom: 24, color: 'var(--primary-color)', fontSize: 18, fontWeight: 700 }}>Post New Announcement</h3>
            <form onSubmit={handlePostAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input 
                 type="text" required placeholder="Announcement Title" 
                 value={newTitle} onChange={e => setNewTitle(e.target.value)}
                 style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none', fontSize: 14 }}
              />
              <textarea 
                 required placeholder="Details..." rows={4}
                 value={newDesc} onChange={e => setNewDesc(e.target.value)}
                 style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none', resize: 'none', fontSize: 14 }}
              />
              <select 
                 value={newPriority} onChange={e => setNewPriority(e.target.value)}
                 style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none', fontSize: 14 }}>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="info">Info</option>
              </select>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'flex-end' }}>
                 <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Cancel</button>
                 <button type="submit" className="btn-primary" style={{ padding: '8px 24px' }}>Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
