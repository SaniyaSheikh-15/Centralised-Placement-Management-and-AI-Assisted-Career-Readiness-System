import { useStudentProfile } from '../../context/StudentProfileContext';

/** PersonalInfoCard — Displays Section 6.1 fields */
export default function PersonalInfoCard() {
  const { profile } = useStudentProfile();
  const p = profile.personalInfo;

  const rows = [
    ['Full Name', p.fullName],
    ['Date of Birth', p.dateOfBirth],
    ['Gender', p.gender],
    ['Phone', p.phone],
    ['Alt. Phone', p.altPhone],
    ['Email', p.email],
    ['Alt. Email', p.altEmail],
    ['Father\'s Name', p.fatherName],
    ['Mother\'s Name', p.motherName],
    ['Father\'s Occupation', p.fatherOccupation],
    ['Annual Family Income', p.annualFamilyIncome],
    ['Religion', p.religion],
    ['Category', p.category],
    ['Aadhaar', p.aadhaarNumber ? `${p.aadhaarNumber.slice(0, 4)} **** ${p.aadhaarNumber.slice(-4)}` : ''],
    ['PAN', p.panNumber || '—'],
    ['Branch', p.branch],
  ];

  return (
    <div className="card overview-section-card">
      <div className="card-header">
        <h3 className="card-title">👤 Personal Information</h3>
      </div>
      {rows.map(([label, value]) => (
        <div key={label} className="info-row">
          <span className="info-label">{label}</span>
          <span className="info-value">{value || <span className="overview-section-empty">Not provided</span>}</span>
        </div>
      ))}
    </div>
  );
}
