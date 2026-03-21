import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { 
  IconMapPin, IconMegaphone, IconRotate, IconClock, 
  IconUsers, IconMessageFill, IconEdit 
} from '../utils/icons';

const socket = io('http://localhost:5000');

export default function Home() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('normal');

  useEffect(() => {
    // Fetch initial Dashboard Data
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnnouncements(res.data.announcements);
        setDeadlines(res.data.deadlines);
        setFacultyList(res.data.faculty);
      } catch (err) {
        console.error('Error fetching dashboard', err);
      }
    };
    
    fetchDashboard();

    // Socket listeners for real-time announcements
    socket.on('new_announcement', (announcement) => {
      setAnnouncements((prev) => [announcement, ...prev]);
    });

    return () => {
      socket.off('new_announcement');
    };
  }, []);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/announcements', {
        title: newTitle,
        description: newDesc,
        priority: newPriority,
        tags: ['general']
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Clear and close
      setNewTitle('');
      setNewDesc('');
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to post announcement. Are you a faculty member?');
    }
  };

  return (
    <>
      <div className="dashboard-layout">
        {/* LEFT COLUMN */}
        <div className="main-column">
           {/* Hero Banner */}
           <div className="hero-card">
             <span className="tag-active-now">Active Now</span>
             <h2 className="hero-title">System Design Workshop</h2>
             <p className="hero-subtitle">
               Join Professor Aris in Auditorium B to explore high-availability architecture patterns and microservices orchestration.
             </p>
             <div className="hero-actions">
               <button className="btn-primary">
                  <IconMapPin />
                  Join In Person
               </button>
               <button className="btn-text">View Materials</button>
             </div>
           </div>

           {/* Recent Announcements */}
           <div>
              <div className="section-header">
                <h3 className="section-title">Recent Announcements</h3>
                <button className="view-all">View all</button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {announcements.length === 0 && <p style={{color: 'var(--text-muted)'}}>No announcements yet.</p>}
                
                {announcements.map(item => (
                   <div className="list-card" key={item._id}>
                     <div className="icon-box" style={{ 
                        backgroundColor: item.priority === 'urgent' ? 'var(--alert-light)' : '#e8e2d2',
                        color: item.priority === 'urgent' ? 'var(--alert-color)' : 'var(--primary-color)'
                     }}>
                        {item.priority === 'urgent' ? <IconMegaphone /> : <IconRotate />}
                     </div>
                     <div className="list-content">
                        <div className="list-title" style={{ color: item.priority === 'urgent' ? 'var(--alert-color)' : 'inherit' }}>
                           {item.title}
                        </div>
                        <div className="list-subtitle">{item.description}</div>
                        {item.createdBy?.name && (
                            <div className="list-meta" style={{marginTop: 4}}>By {item.createdBy.name}</div>
                        )}
                     </div>
                     <div className="list-meta">Just now</div>
                   </div>
                ))}
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="side-column">
           {/* Deadlines Widget */}
           <div className="widget-card">
             <div className="widget-header">
               <IconClock />
               <span className="widget-title">Deadlines</span>
             </div>
             
             {deadlines.length === 0 && <p style={{fontSize: 13, color: 'var(--text-muted)'}}>No upcoming deadlines.</p>}

             {deadlines.map((d, index) => {
               // Fake "Urgent" coloring for the first item for demo visual match
               const isUrgent = index === 0;
               return (
                 <div className={`deadline-item ${isUrgent ? 'urgent' : ''}`} key={d._id}>
                   <div className="d-title">{d.title}</div>
                   <div className={`d-time ${isUrgent ? 'urgent' : ''}`}>
                     {new Date(d.dueDate).toLocaleDateString()}
                   </div>
                 </div>
               )
             })}

             <button className="btn-outline">Open Calendar</button>
           </div>

           {/* Faculty Status Widget */}
           <div className="widget-card alt-bg">
             <div className="widget-header">
               <IconUsers />
               <span className="widget-title">Faculty Status</span>
             </div>

             {facultyList.length === 0 && <p style={{fontSize: 13, color: 'var(--text-muted)'}}>No faculty data.</p>}

             {facultyList.map(fac => (
               <div className="faculty-item" key={fac._id}>
                 <div className="fac-avatar">
                   <div style={{width:'100%', height:'100%', borderRadius: 10, backgroundColor: fac.avatarBg || '#d1dfc7'}}></div>
                   <div className="status-dot" style={{backgroundColor: fac.dotColor}}></div>
                 </div>
                 <div className="fac-info">
                   <div className="fac-name">{fac.name}</div>
                   <div className="fac-status-text">{fac.status}</div>
                 </div>
                 <IconMessageFill />
               </div>
             ))}
           </div>

           {/* Study Space Promo */}
           <div className="promo-card">
             <div className="promo-title">Need a study space?</div>
             <div className="promo-text">Book private pods in the Central Library.</div>
             <button className="btn-neutral">Reserve Now</button>
           </div>
        </div>
      </div>

      {/* FAB - ONLY FOR FACULTY */}
      {user?.role === 'Faculty' && (
        <button className="fab" onClick={() => setShowModal(true)}>
          <IconEdit />
        </button>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ backgroundColor: '#fff', padding: 32, borderRadius: 16, width: '100%', maxWidth: 500 }}>
            <h3 style={{ marginBottom: 24, color: 'var(--primary-color)' }}>Post New Announcement</h3>
            <form onSubmit={handlePostAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input 
                 type="text" required placeholder="Announcement Title" 
                 value={newTitle} onChange={e => setNewTitle(e.target.value)}
                 style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none' }}
              />
              <textarea 
                 required placeholder="Details..." rows={4}
                 value={newDesc} onChange={e => setNewDesc(e.target.value)}
                 style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none', resize: 'none' }}
              />
              <select 
                 value={newPriority} onChange={e => setNewPriority(e.target.value)}
                 style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none' }}
              >
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
    </>
  );
}
