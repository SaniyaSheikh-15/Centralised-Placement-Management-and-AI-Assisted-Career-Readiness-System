'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import ProfileSkeletonLoader from '@/components/student-profile/common/ProfileSkeletonLoader';
import ProfileErrorState from '@/components/student-profile/common/ProfileErrorState';
import TabPersonal from '@/components/student-profile/edit/TabPersonal';
import TabAcademic from '@/components/student-profile/edit/TabAcademic';
import TabSkills from '@/components/student-profile/edit/TabSkills';
import TabProjects from '@/components/student-profile/edit/TabProjects';
import TabInternships from '@/components/student-profile/edit/TabInternships';
import TabCertifications from '@/components/student-profile/edit/TabCertifications';
import TabAchievements from '@/components/student-profile/edit/TabAchievements';
import TabSocialLinks from '@/components/student-profile/edit/TabSocialLinks';
import TabResume from '@/components/student-profile/edit/TabResume';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (activeEditTab > 0) setActiveEditTab(activeEditTab - 1);
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

  if (isLoading && !loaded) return <ProfileSkeletonLoader variant="form" />;
  if (error) return <ProfileErrorState message={error} onRetry={clearError} />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Edit Profile</h2>
          <p className="text-sm text-[var(--text-muted)]">Update your career profile information across all sections</p>
        </div>
        <Button variant="secondary" onClick={handleSaveDraft}>
          <Save className="mr-1.5 h-4 w-4" /> Save Draft
        </Button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/20 bg-[var(--color-success-subtle)] px-4 py-3 text-sm text-[var(--color-success)] animate-slide-in-left">
          <Check className="h-4 w-4" /> {saveMessage}
        </div>
      )}

      {/* Stepper Navigation */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-2">
        {TABS.map((tab, index) => (
          <button
            key={tab.key}
            onClick={() => setActiveEditTab(index)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              index === activeEditTab
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : index < activeEditTab
                  ? 'text-[var(--color-success)] hover:bg-white/5'
                  : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-secondary)]'
            }`}
          >
            <span>{index < activeEditTab ? '✓' : tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className="border-[var(--border-card)] bg-[var(--bg-card)]">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-[var(--text-primary)]">
              <span>{TABS[activeEditTab]?.icon}</span>
              <span>{TABS[activeEditTab]?.label}</span>
            </h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Step {activeEditTab + 1} of {TABS.length}</p>
          </div>
          {renderTabContent()}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="mt-6 flex items-center justify-between border-t border-[var(--border-card)] pt-4">
        <Button variant="ghost" onClick={handlePrevious} disabled={activeEditTab === 0}>
          <ChevronLeft className="mr-1.5 h-4 w-4" /> Previous
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleSaveDraft}>
            <Save className="mr-1.5 h-4 w-4" /> Save Draft
          </Button>
          {activeEditTab < TABS.length - 1 ? (
            <Button onClick={handleNext}>
              Save & Next <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSaveDraft}>
              <Check className="mr-1.5 h-4 w-4" /> Complete Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
