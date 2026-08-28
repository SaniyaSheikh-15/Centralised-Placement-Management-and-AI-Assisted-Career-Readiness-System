import { NavLink } from 'react-router-dom';
import './Sidebar.css';

/**
 * Sidebar — Shared Component Stub (Member 1)
 * Global application navigation frame with active route highlighting.
 */

const navItems = [
  { path: '/profile', icon: '👤', label: 'Profile Overview' },
  { path: '/profile/edit', icon: '✏️', label: 'Edit Profile' },
  { path: '/profile/resume', icon: '📄', label: 'Resume' },
  { path: '/profile/skills', icon: '⚡', label: 'Skills' },
  { path: '/profile/projects', icon: '🔨', label: 'Projects' },
  { path: '/profile/certifications', icon: '🏆', label: 'Certifications' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">CC</div>
        <div>
          <div className="sidebar-brand-name">CampusConnect</div>
          <div className="sidebar-brand-tagline">Career Platform</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Student Profile</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/profile'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-avatar">AP</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">Arjun Patil</div>
          <div className="sidebar-user-role">Student</div>
        </div>
      </div>
    </aside>
  );
}
