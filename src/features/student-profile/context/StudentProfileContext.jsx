import { createContext, useContext, useState, useCallback } from 'react';
import { defaultMockProfile } from '../mock/studentProfileMockData';

/**
 * StudentProfileContext
 * In-memory mock data store & tab state management.
 * Provides CRUD action handlers for skills, projects, certifications,
 * internships, achievements, and resume.
 */

const StudentProfileContext = createContext(null);

// Generate unique IDs
let idCounter = 100;
const genId = (prefix) => `${prefix}-${++idCounter}`;

export function StudentProfileProvider({ children }) {
  // ─── Core Profile State ─────────────────────────────────────────────────
  const [profile, setProfile] = useState(() => structuredClone(defaultMockProfile));

  // ─── Edit Tab State (session-level preservation) ────────────────────────
  const [activeEditTab, setActiveEditTab] = useState(0);
  const [editDraft, setEditDraft] = useState(() => structuredClone(defaultMockProfile));

  // ─── UI States ──────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Personal Info ──────────────────────────────────────────────────────
  const updatePersonalInfo = useCallback((updates) => {
    setEditDraft((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...updates },
    }));
  }, []);

  // ─── Academic Info ──────────────────────────────────────────────────────
  const updateAcademicInfo = useCallback((updates) => {
    setEditDraft((prev) => ({
      ...prev,
      academicInfo: { ...prev.academicInfo, ...updates },
    }));
  }, []);

  // ─── Placement Readiness ────────────────────────────────────────────────
  const updatePlacementReadiness = useCallback((updates) => {
    setEditDraft((prev) => ({
      ...prev,
      placementReadiness: { ...prev.placementReadiness, ...updates },
    }));
  }, []);

  // ─── Online Presence ────────────────────────────────────────────────────
  const updateOnlinePresence = useCallback((updates) => {
    setEditDraft((prev) => ({
      ...prev,
      onlinePresence: { ...prev.onlinePresence, ...updates },
    }));
  }, []);

  // ─── Technical Skills CRUD ──────────────────────────────────────────────
  const addSkill = useCallback((skill) => {
    const newSkill = { ...skill, id: genId('sk') };
    setProfile((prev) => ({
      ...prev,
      technicalSkills: [...prev.technicalSkills, newSkill],
    }));
    setEditDraft((prev) => ({
      ...prev,
      technicalSkills: [...prev.technicalSkills, newSkill],
    }));
  }, []);

  const updateSkillProficiency = useCallback((skillId, proficiency) => {
    const updater = (prev) => ({
      ...prev,
      technicalSkills: prev.technicalSkills.map((s) =>
        s.id === skillId ? { ...s, proficiency } : s
      ),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  const removeSkill = useCallback((skillId) => {
    const updater = (prev) => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((s) => s.id !== skillId),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  // ─── Projects CRUD ─────────────────────────────────────────────────────
  const addProject = useCallback((project) => {
    const newProject = { ...project, id: genId('proj') };
    setProfile((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
    setEditDraft((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  }, []);

  const updateProject = useCallback((projectId, updates) => {
    const updater = (prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId ? { ...p, ...updates } : p
      ),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  const deleteProject = useCallback((projectId) => {
    const updater = (prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projectId),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  // ─── Certifications CRUD ───────────────────────────────────────────────
  const addCertification = useCallback((cert) => {
    const newCert = { ...cert, id: genId('cert') };
    setProfile((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }));
    setEditDraft((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  }, []);

  const updateCertification = useCallback((certId, updates) => {
    const updater = (prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) =>
        c.id === certId ? { ...c, ...updates } : c
      ),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  const deleteCertification = useCallback((certId) => {
    const updater = (prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== certId),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  // ─── Internships CRUD ──────────────────────────────────────────────────
  const addInternship = useCallback((internship) => {
    const newInternship = { ...internship, id: genId('intern') };
    setEditDraft((prev) => ({ ...prev, internships: [...prev.internships, newInternship] }));
  }, []);

  const updateInternship = useCallback((internId, updates) => {
    setEditDraft((prev) => ({
      ...prev,
      internships: prev.internships.map((i) =>
        i.id === internId ? { ...i, ...updates } : i
      ),
    }));
  }, []);

  const deleteInternship = useCallback((internId) => {
    setEditDraft((prev) => ({
      ...prev,
      internships: prev.internships.filter((i) => i.id !== internId),
    }));
  }, []);

  // ─── Achievements CRUD ─────────────────────────────────────────────────
  const addAchievement = useCallback((achievement) => {
    const newAch = { ...achievement, id: genId('ach') };
    setEditDraft((prev) => ({ ...prev, achievements: [...prev.achievements, newAch] }));
  }, []);

  const updateAchievement = useCallback((achId, updates) => {
    setEditDraft((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) =>
        a.id === achId ? { ...a, ...updates } : a
      ),
    }));
  }, []);

  const deleteAchievement = useCallback((achId) => {
    setEditDraft((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== achId),
    }));
  }, []);

  // ─── Soft Skills ────────────────────────────────────────────────────────
  const updateSoftSkills = useCallback((skills) => {
    setEditDraft((prev) => ({ ...prev, softSkills: skills }));
  }, []);

  // ─── Resume ─────────────────────────────────────────────────────────────
  const setResume = useCallback((file) => {
    const resumeData = {
      uploadedResume: file,
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
    };
    setProfile((prev) => ({ ...prev, resume: resumeData }));
    setEditDraft((prev) => ({ ...prev, resume: resumeData }));
  }, []);

  const deleteResume = useCallback(() => {
    const emptyResume = { uploadedResume: null, fileName: '', fileSize: 0, uploadDate: '' };
    setProfile((prev) => ({ ...prev, resume: emptyResume }));
    setEditDraft((prev) => ({ ...prev, resume: emptyResume }));
  }, []);

  // ─── Save Draft (commit edit draft to profile) ─────────────────────────
  const saveDraft = useCallback(() => {
    setProfile(structuredClone(editDraft));
  }, [editDraft]);

  // ─── Reset Draft (discard changes) ─────────────────────────────────────
  const resetDraft = useCallback(() => {
    setEditDraft(structuredClone(profile));
  }, [profile]);

  // ─── Simulate Loading ──────────────────────────────────────────────────
  const simulateLoading = useCallback((ms = 800) => {
    setIsLoading(true);
    setError(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve();
      }, ms);
    });
  }, []);

  // ─── Simulate Error ────────────────────────────────────────────────────
  const simulateError = useCallback((msg = 'Something went wrong. Please try again.') => {
    setError(msg);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    // State
    profile,
    editDraft,
    activeEditTab,
    isLoading,
    error,

    // Setters
    setActiveEditTab,
    setEditDraft,

    // Personal / Academic / Placement / Social
    updatePersonalInfo,
    updateAcademicInfo,
    updatePlacementReadiness,
    updateOnlinePresence,

    // Skills
    addSkill,
    updateSkillProficiency,
    removeSkill,

    // Projects
    addProject,
    updateProject,
    deleteProject,

    // Certifications
    addCertification,
    updateCertification,
    deleteCertification,

    // Internships
    addInternship,
    updateInternship,
    deleteInternship,

    // Achievements
    addAchievement,
    updateAchievement,
    deleteAchievement,

    // Soft Skills
    updateSoftSkills,

    // Resume
    setResume,
    deleteResume,

    // Draft Management
    saveDraft,
    resetDraft,

    // UI State Simulators
    simulateLoading,
    simulateError,
    clearError,
  };

  return (
    <StudentProfileContext.Provider value={value}>
      {children}
    </StudentProfileContext.Provider>
  );
}

export function useStudentProfile() {
  const context = useContext(StudentProfileContext);
  if (!context) {
    throw new Error('useStudentProfile must be used within a StudentProfileProvider');
  }
  return context;
}

export default StudentProfileContext;
