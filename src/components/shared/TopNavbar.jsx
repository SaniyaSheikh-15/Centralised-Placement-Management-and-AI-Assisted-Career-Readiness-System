import { useLocation } from 'react-router-dom';
import './TopNavbar.css';

/**
 * TopNavbar — Shared Component Stub (Member 1)
 * Universal top bar with page title, search, notification, and profile avatar.
 */

const routeTitles = {
  '/profile': 'Profile Overview',
  '/profile/edit': 'Edit Profile',
  '/profile/resume': 'Resume Upload',
  '/profile/skills': 'Skills Management',
  '/profile/projects': 'Projects',
  '/profile/certifications': 'Certifications',
};

export default function TopNavbar() {
  const location = useLocation();
  const pageTitle = routeTitles[location.pathname] || 'Student Profile';

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <h1 className="navbar-page-title">{pageTitle}</h1>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <span className="navbar-search-icon">🔍</span>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>

        <button className="btn-icon navbar-notification" aria-label="Notifications">
          🔔
          <span className="navbar-notification-badge">3</span>
        </button>

        <div className="navbar-profile-trigger">
          <div className="navbar-avatar">AP</div>
          <div className="navbar-profile-info">
            <span className="navbar-user-name">Arjun Patil</span>
            <span className="navbar-user-role">Student</span>
          </div>
        </div>
      </div>
    </header>
  );
}
