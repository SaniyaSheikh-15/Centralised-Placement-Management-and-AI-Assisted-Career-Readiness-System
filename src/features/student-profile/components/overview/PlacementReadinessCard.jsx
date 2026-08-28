import { useStudentProfile } from '../../context/StudentProfileContext';

/** PlacementReadinessCard — Displays Section 6.3 placement readiness data */
export default function PlacementReadinessCard() {
  const { profile } = useStudentProfile();
  const pr = profile.placementReadiness;

  const ratingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const rows = [
    ['T&P Interest', pr.interestedInTpActivities],
    ['Placement Interest', pr.interestedInCollegePlacement],
    ['Career Area', pr.areaOfInterestAfterGraduation],
    ['Aptitude Prepared', pr.preparedForAptitude],
    ['Languages Known', pr.softwareLanguagesKnown],
    ['English Rating', pr.englishCommunicationRating ? `${ratingStars(pr.englishCommunicationRating)} (${pr.englishCommunicationRating}/5)` : ''],
    ['Ready to Relocate', pr.readyToRelocate],
  ];

  if (pr.preparedForAptitude === 'Yes' && pr.aptitudeTrainingDetails) {
    rows.splice(4, 0, ['Training Details', pr.aptitudeTrainingDetails]);
  }

  return (
    <div className="card overview-section-card">
      <div className="card-header">
        <h3 className="card-title">🎯 Placement Readiness</h3>
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
