import { useStudentProfile } from '../../context/StudentProfileContext';

/** OnlinePresenceCard — Clickable chips/icons for GitHub, LinkedIn, Portfolio, Coding */
export default function OnlinePresenceCard() {
  const { profile } = useStudentProfile();
  const o = profile.onlinePresence;

  const links = [
    { label: 'GitHub', url: o.githubUrl, icon: '🐙' },
    { label: 'LinkedIn', url: o.linkedinUrl, icon: '💼' },
    { label: 'Portfolio', url: o.portfolioUrl, icon: '🌐' },
    { label: 'Coding Profile', url: o.codingProfileUrl, icon: '💻' },
  ];

  const hasAnyLink = links.some((l) => l.url);

  return (
    <div className="card overview-section-card">
      <div className="card-header">
        <h3 className="card-title">🔗 Online Presence</h3>
      </div>
      {hasAnyLink ? (
        <div className="overview-social-chips">
          {links.map((link) =>
            link.url ? (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="chip chip-primary"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ) : null
          )}
        </div>
      ) : (
        <span className="overview-section-empty">
          No social profiles added — <a href="/profile/edit">Add links</a>
        </span>
      )}
    </div>
  );
}
