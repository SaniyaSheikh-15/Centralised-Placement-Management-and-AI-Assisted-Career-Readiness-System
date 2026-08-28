import { useStudentProfile } from '../../context/StudentProfileContext';

/**
 * TabAcademic — Edit Tab 2
 * Renders Section 6.2 (Enrollment, Schooling, Backlogs) +
 * Section 6.3 (Placement Readiness Declarations).
 */

const ACADEMIC_YEARS = ['1st Year', '2nd Year', '3rd Year', 'Final Year'];
const GRADUATION_AREAS = [
  'Placement through College',
  'Higher Studies (M.Tech, MBA, NICMAR, MCA, etc.)',
  'Self Centre (Entrepreneur)',
  'Family Business',
  'Govt. Jobs and its Preparation',
  'None of the Above',
];

export default function TabAcademic() {
  const { editDraft, updateAcademicInfo, updatePlacementReadiness } = useStudentProfile();
  const a = editDraft.academicInfo;
  const pr = editDraft.placementReadiness;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Enrollment */}
      <div>
        <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          Enrollment Details
        </h4>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">University Enrollment No. *</label>
            <input className="form-input" value={a.universityEnrollmentNo} onChange={(e) => updateAcademicInfo({ universityEnrollmentNo: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">College *</label>
            <input className="form-input" value={a.college} onChange={(e) => updateAcademicInfo({ college: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Department *</label>
            <input className="form-input" value={a.department} readOnly style={{ opacity: 0.7 }} />
            <span className="form-helper">Auto-synced with Branch selection</span>
          </div>
          <div className="form-group">
            <label className="form-label">Degree *</label>
            <input className="form-input" value={a.degree} onChange={(e) => updateAcademicInfo({ degree: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Academic Year *</label>
            <select className="form-select" value={a.academicYear} onChange={(e) => updateAcademicInfo({ academicYear: e.target.value })}>
              <option value="">Select year</option>
              {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Schooling & Aggregate */}
      <div>
        <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          Schooling & Academic Aggregate
        </h4>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">SSC Percentage *</label>
            <input className="form-input" type="number" min="0" max="100" step="0.01" value={a.sscPercentage} onChange={(e) => updateAcademicInfo({ sscPercentage: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">SSC Passing Year *</label>
            <input className="form-input" type="number" min="2010" max="2035" value={a.sscPassingYear} onChange={(e) => updateAcademicInfo({ sscPassingYear: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">HSC / Diploma Percentage *</label>
            <input className="form-input" type="number" min="0" max="100" step="0.01" value={a.hscDiplomaPercentage} onChange={(e) => updateAcademicInfo({ hscDiplomaPercentage: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">HSC / Diploma Passing Year *</label>
            <input className="form-input" type="number" min="2010" max="2035" value={a.hscDiplomaPassingYear} onChange={(e) => updateAcademicInfo({ hscDiplomaPassingYear: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">B.Tech Aggregate *</label>
            <input className="form-input" type="number" min="0" max="100" step="0.01" value={a.btechAggregate} onChange={(e) => updateAcademicInfo({ btechAggregate: e.target.value })} />
            <span className="form-helper">Take average of B.Tech percentage from 1st to 5th semester</span>
          </div>
          <div className="form-group">
            <label className="form-label">Current CGPA *</label>
            <input className="form-input" type="number" min="0" max="10" step="0.01" value={a.cgpaCurrent} onChange={(e) => updateAcademicInfo({ cgpaCurrent: e.target.value })} />
            <span className="form-helper">Overall CGPA on 10-point scale</span>
          </div>
        </div>
      </div>

      {/* Backlogs */}
      <div>
        <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          Backlogs
        </h4>
        <div className="form-group">
          <label className="form-label">Do you have live backlogs? *</label>
          <div className="radio-group">
            {['Yes', 'No'].map((opt) => (
              <label key={opt} className="radio-option">
                <input type="radio" name="hasLiveBacklogs" value={opt} checked={a.hasLiveBacklogs === opt}
                  onChange={(e) => {
                    updateAcademicInfo({ hasLiveBacklogs: e.target.value, ...(e.target.value === 'No' ? { backlogDetails: '' } : {}) });
                  }} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
        {a.hasLiveBacklogs === 'Yes' && (
          <div className="form-group" style={{ marginTop: 'var(--space-3)' }}>
            <label className="form-label">Backlog Details *</label>
            <input className="form-input" value={a.backlogDetails} onChange={(e) => updateAcademicInfo({ backlogDetails: e.target.value })} placeholder="Number and details of backlogs" />
          </div>
        )}
      </div>

      {/* Placement Readiness (Section 6.3) */}
      <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: 'var(--space-6)' }}>
        <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          Placement Readiness Declarations
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Interested in T&P Activities? *</label>
            <div className="radio-group">
              {['Yes', 'No'].map((opt) => (
                <label key={opt} className="radio-option">
                  <input type="radio" name="interestedInTpActivities" value={opt} checked={pr.interestedInTpActivities === opt}
                    onChange={(e) => updatePlacementReadiness({ interestedInTpActivities: e.target.value })} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Interested in Placement through College? *</label>
            <div className="radio-group">
              {['Yes', 'No'].map((opt) => (
                <label key={opt} className="radio-option">
                  <input type="radio" name="interestedInCollegePlacement" value={opt} checked={pr.interestedInCollegePlacement === opt}
                    onChange={(e) => updatePlacementReadiness({ interestedInCollegePlacement: e.target.value })} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Area of Interest After Graduation *</label>
            <div className="radio-group" style={{ flexDirection: 'column' }}>
              {GRADUATION_AREAS.map((area) => (
                <label key={area} className="radio-option">
                  <input type="radio" name="areaOfInterestAfterGraduation" value={area} checked={pr.areaOfInterestAfterGraduation === area}
                    onChange={(e) => updatePlacementReadiness({ areaOfInterestAfterGraduation: e.target.value })} />
                  <span>{area}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Prepared for Aptitude? *</label>
            <div className="radio-group">
              {['Yes', 'No'].map((opt) => (
                <label key={opt} className="radio-option">
                  <input type="radio" name="preparedForAptitude" value={opt} checked={pr.preparedForAptitude === opt}
                    onChange={(e) => {
                      updatePlacementReadiness({ preparedForAptitude: e.target.value, ...(e.target.value === 'No' ? { aptitudeTrainingDetails: '' } : {}) });
                    }} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {pr.preparedForAptitude === 'Yes' && (
            <div className="form-group">
              <label className="form-label">Aptitude Training Details *</label>
              <input className="form-input" value={pr.aptitudeTrainingDetails} onChange={(e) => updatePlacementReadiness({ aptitudeTrainingDetails: e.target.value })} placeholder="Details of training program" />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Software / Languages Known *</label>
            <textarea className="form-textarea" value={pr.softwareLanguagesKnown} onChange={(e) => updatePlacementReadiness({ softwareLanguagesKnown: e.target.value })} placeholder="e.g. JavaScript, Python, Java, C++..." rows={2} />
          </div>

          <div className="form-group">
            <label className="form-label">English Communication Skills (1-5) *</label>
            <div className="rating-scale">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`rating-scale-option ${pr.englishCommunicationRating === n ? 'active' : ''}`}
                  onClick={() => updatePlacementReadiness({ englishCommunicationRating: n })}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ready to Relocate? *</label>
            <div className="radio-group">
              {['Yes', 'No'].map((opt) => (
                <label key={opt} className="radio-option">
                  <input type="radio" name="readyToRelocate" value={opt} checked={pr.readyToRelocate === opt}
                    onChange={(e) => updatePlacementReadiness({ readyToRelocate: e.target.value })} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
