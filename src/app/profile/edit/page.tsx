'use client';

import { useState, useEffect } from 'react';
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
          <h2 className="text-2xl font-bold text-[#F1F5F9]">Edit Profile</h2>
          <p className="text-sm text-[#64748B]">Update your career profile information across all 9 sections</p>
        </div>
        <button
          onClick={handleSaveDraft}
          className="inline-flex items-center gap-2 rounded-lg border border-[#1A2B42] bg-[#0E1B2E] px-4 py-2 text-sm font-medium text-[#F1F5F9] transition-colors hover:bg-[#1A2B42]"
        >
          <Save className="h-4 w-4" />
          Save Draft
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-[#10B981] animate-slide-in-left">
          <Check className="h-4 w-4" /> {saveMessage}
        </div>
      )}

      {/* 9-Step Pill Stepper Navigation */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-2">
        {TABS.map((tab, index) => (
          <button
            key={tab.key}
            onClick={() => setActiveEditTab(index)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              index === activeEditTab
                ? 'bg-[#1683FF] text-white shadow-sm'
                : index < activeEditTab
                  ? 'text-[#10B981] hover:bg-white/5'
                  : 'border border-transparent text-[#64748B] hover:bg-white/5 hover:text-[#94A3B8]'
            }`}
          >
            <span>{index < activeEditTab ? '✓' : tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-xl font-bold text-[#F1F5F9]">
            <span>{TABS[activeEditTab]?.icon}</span>
            <span>{TABS[activeEditTab]?.label}</span>
          </h3>
          <p className="mt-1 text-sm text-[#64748B]">Step {activeEditTab + 1} of {TABS.length}</p>
        </div>
        {renderTabContent()}
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 flex items-center justify-between border-t border-[#1A2B42] pt-4">
        <button
          onClick={handlePrevious}
          disabled={activeEditTab === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-[#F1F5F9] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-[#F1F5F9]"
          >
            <Save className="h-4 w-4" /> Save Draft
          </button>
          {activeEditTab < TABS.length - 1 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1683FF] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0D6FE0]"
            >
              Save & Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1683FF] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0D6FE0]"
            >
              <Check className="h-4 w-4" /> Complete Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
