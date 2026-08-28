import { useState, useEffect } from 'react';
import { useStudentProfile } from '../context/StudentProfileContext';
import ProfileSkeletonLoader from '../components/common/ProfileSkeletonLoader';
import ProfileErrorState from '../components/common/ProfileErrorState';
import TabPersonal from '../components/edit/TabPersonal';
import TabAcademic from '../components/edit/TabAcademic';
import TabSkills from '../components/edit/TabSkills';
import TabProjects from '../components/edit/TabProjects';
import TabInternships from '../components/edit/TabInternships';
import TabCertifications from '../components/edit/TabCertifications';
import TabAchievements from '../components/edit/TabAchievements';
import TabSocialLinks from '../components/edit/TabSocialLinks';
import TabResume from '../components/edit/TabResume';

/**
 * EditProfilePage — /profile/edit
 * Multi-step 9-tab stepper form with tab-state preservation.
 * Navigation: Previous, Save & Next, Save Draft.
 */

const TABS = [
  { key: 'personal', label: 'Personal', icon: '👤' },
  { key: 'academic', label: 'Academic', icon: '🎓' },
  { key: 'skills', label: 'Skills', icon: '⚡' },
  { key: 'projects', label: 'Projects', icon: '🔨' },
  { key: 'internships', label: 'Internships', icon: '💼' },
  { key: 'certifications', label: 'Certifications', icon: '🏆' },
  { key: 'achievements', label: 'Achievements', icon: '🌟' },
  { key: 'social', label: 'Social Links', icon: '🔗' },
  { key: 'resume', label: 'Resume', icon: '📄' },
];

export default function EditProfilePage() {
  const {
    activeEditTab, setActiveEditTab, saveDraft,
    isLoading, error, simulateLoading, clearError,
  } = useStudentProfile();
  const [loaded, setLoaded] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    simulateLoading(600).then(() => setLoaded(true));
  }, []);

  const handleSaveDraft = () => {
    saveDraft();
    setSaveMessage('Draft saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleNext = () => {
    saveDraft();
    setSaveMessage('Draft saved!');
    setTimeout(() => setSaveMessage(''), 2000);
    if (activeEditTab < TABS.length - 1) {
      setActiveEditTab(activeEditTab + 1);
    }
  };

  const handlePrevious = () => {
    if (activeEditTab > 0) {
      setActiveEditTab(activeEditTab - 1);
    }
  };

  const renderTabContent = () => {
    switch (TABS[activeEditTab]?.key) {
      case 'personal': return <TabPersonal />;
      case 'academic': return <TabAcademic />;
      case 'skills': return <TabSkills />;
      case 'projects': return <TabProjects />;
      case 'internships': return <TabInternships />;
      case 'certifications': return <TabCertifications />;
      case 'achievements': return <TabAchievements />;
      case 'social': return <TabSocialLinks />;
      case 'resume': return <TabResume />;
      default: return <TabPersonal />;
    }
  };

  if (isLoading && !loaded) return (
    <div className="page-container">
      <ProfileSkeletonLoader variant="form" />
    </div>
  );

  if (error) return (
    <div className="page-container">
      <ProfileErrorState message={error} onRetry={clearError} />
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Edit Profile</h2>
          <p className="page-subtitle">Update your career profile information across all sections</p>
        </div>
        <button className="btn btn-secondary" onClick={handleSaveDraft}>
          💾 Save Draft
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="inline-alert inline-alert-success" style={{ marginBottom: 'var(--space-4)' }}>
          <span>✅</span>
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Stepper Navigation */}
      <div className="stepper">
        {TABS.map((tab, index) => (
          <div key={tab.key} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={`stepper-item ${index === activeEditTab ? 'active' : ''} ${index < activeEditTab ? 'completed' : ''}`}
              onClick={() => setActiveEditTab(index)}
            >
              <span className="stepper-number">
                {index < activeEditTab ? '✓' : index + 1}
              </span>
              <span>{tab.label}</span>
            </div>
            {index < TABS.length - 1 && <div className="stepper-separator" />}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span>{TABS[activeEditTab]?.icon}</span>
            <span>{TABS[activeEditTab]?.label}</span>
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
            Step {activeEditTab + 1} of {TABS.length}
          </p>
        </div>

        {renderTabContent()}
      </div>

      {/* Navigation Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 'var(--space-6)',
        paddingTop: 'var(--space-4)',
        borderTop: '1px solid var(--border-card)',
      }}>
        <button
          className="btn btn-ghost"
          onClick={handlePrevious}
          disabled={activeEditTab === 0}
        >
          ← Previous
        </button>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-ghost" onClick={handleSaveDraft}>
            💾 Save Draft
          </button>
          {activeEditTab < TABS.length - 1 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Save & Next →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSaveDraft}>
              ✅ Complete Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
