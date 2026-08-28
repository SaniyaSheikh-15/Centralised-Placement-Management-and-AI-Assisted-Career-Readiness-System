import { useStudentProfile } from '../../context/StudentProfileContext';
import './OverviewCards.css';

/**
 * ProfileHeaderBlock
 * Header with avatar, name, branch, degree + year, and edit button.
 */

export default function ProfileHeaderBlock({ onEdit }) {
  const { profile } = useStudentProfile();
  const p = profile.personalInfo;
  const a = profile.academicInfo;

  const initials = p.fullName
    ? p.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className="profile-header-card card">
      <div className="profile-header-content">
        <div className="profile-avatar-large">
          {p.profilePhoto ? (
            <img src={URL.createObjectURL(p.profilePhoto)} alt="Profile" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="profile-header-info">
          <h1 className="profile-name">{p.fullName || 'Student Name'}</h1>
          <p className="profile-branch">{p.branch || 'Branch not set'}</p>
          <p className="profile-degree">
            {a.degree || 'B.Tech'} · {a.academicYear || 'Year not set'} · {a.college || 'College'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={onEdit}>
          ✏️ Edit Profile
        </button>
      </div>
    </div>
  );
}
