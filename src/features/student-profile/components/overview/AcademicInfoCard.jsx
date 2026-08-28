import { useStudentProfile } from '../../context/StudentProfileContext';

/** AcademicInfoCard — Displays Section 6.2 fields */
export default function AcademicInfoCard() {
  const { profile } = useStudentProfile();
  const a = profile.academicInfo;

  const rows = [
    ['Enrollment No.', a.universityEnrollmentNo],
    ['College', a.college],
    ['Department', a.department],
    ['Degree', a.degree],
    ['Academic Year', a.academicYear],
    ['SSC Percentage', a.sscPercentage ? `${a.sscPercentage}%` : ''],
    ['SSC Passing Year', a.sscPassingYear],
    ['HSC/Diploma %', a.hscDiplomaPercentage ? `${a.hscDiplomaPercentage}%` : ''],
    ['HSC/Diploma Year', a.hscDiplomaPassingYear],
    ['B.Tech Aggregate', a.btechAggregate ? `${a.btechAggregate}%` : ''],
    ['Current CGPA', a.cgpaCurrent],
    ['Live Backlogs', a.hasLiveBacklogs],
  ];

  if (a.hasLiveBacklogs === 'Yes' && a.backlogDetails) {
    rows.push(['Backlog Details', a.backlogDetails]);
  }

  return (
    <div className="card overview-section-card">
      <div className="card-header">
        <h3 className="card-title">🎓 Academic Information</h3>
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
