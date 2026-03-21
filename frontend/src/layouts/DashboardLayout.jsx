import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* === SVG ICONS === */
import { 
  IconBell, IconMessage, IconClock, IconCalendar, IconMapPin,
  IconBriefcase, IconUsers, IconBarChart, IconSettings, IconHelp, IconMegaphone, PenNibLogo
} from '../utils/icons';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon, label }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, color: 'var(--primary-color)', marginBottom: 12 }}>
            <PenNibLogo />
          </div>
          <div className="brand-name">College Hours</div>
          <div className="brand-subtitle">The Mindful Scholar</div>
        </div>
        
        <nav className="nav-section">
          <NavItem to="/" icon={<IconMegaphone />} label="Announcements" />
          <NavItem to="/qa" icon={<IconMessage />} label="Q&A" />
          <NavItem to="/deadlines" icon={<IconClock />} label="Deadlines" />
          <NavItem to="/calendar" icon={<IconCalendar />} label="Calendar" />
          <NavItem to="/events" icon={<IconMapPin />} label="Events" />
          <NavItem to="/placements" icon={<IconBriefcase />} label="Placements" />
          <NavItem to="/faculty" icon={<IconUsers />} label="Faculty" />
          <NavItem to="/polls" icon={<IconBarChart />} label="Polls" />
        </nav>
        
        <div className="nav-section sidebar-bottom">
          <NavItem to="/settings" icon={<IconSettings />} label="Settings" />
          <div className="nav-item" onClick={handleLogout}>
            <IconHelp />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-wrapper">
        <header className="top-header">
          <div className="header-titles">
            <h1 className="greeting">Good Morning, {user?.name?.split(' ')[0]}.</h1>
            <div className="subtitle">Monday, October 14th &bull; 4 items require your attention.</div>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <IconBell />
              <span className="notification-dot"></span>
            </button>
            <button className="icon-btn" style={{ borderRadius: '50%', backgroundColor: user?.avatarBg || '#e2e2e2', width: 44, height: 44, overflow: 'hidden', border: '1px solid var(--border-color)'}}>
               <svg viewBox="0 0 24 24" fill="currentColor" opacity="0.4" style={{marginTop: '8px'}}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </button>
          </div>
        </header>

        <Outlet />

      </main>
    </div>
  );
}
