'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { defaultMockProfile } from '../mock/studentProfileMockData';
import type {
  StudentProfile,
  TechnicalSkill,
  Project,
  Certification,
  Internship,
  Achievement,
} from '@/types/student-profile';

/**
 * StudentProfileContext
 * In-memory mock data store & tab state management.
 * Provides CRUD action handlers for skills, projects, certifications,
 * internships, achievements, and resume.
 */

interface StudentProfileContextType {
  // State
  profile: StudentProfile;
  editDraft: StudentProfile;
  activeEditTab: number;
  isLoading: boolean;
  error: string | null;

  // Setters
  setActiveEditTab: (tab: number) => void;
  setEditDraft: React.Dispatch<React.SetStateAction<StudentProfile>>;

  // Personal / Academic / Placement / Social
  updatePersonalInfo: (updates: Partial<StudentProfile['personalInfo']>) => void;
  updateAcademicInfo: (updates: Partial<StudentProfile['academicInfo']>) => void;
  updatePlacementReadiness: (updates: Partial<StudentProfile['placementReadiness']>) => void;
  updateOnlinePresence: (updates: Partial<StudentProfile['onlinePresence']>) => void;

  // Skills
  addSkill: (skill: Omit<TechnicalSkill, 'id'>) => void;
  updateSkillProficiency: (skillId: string, proficiency: TechnicalSkill['proficiency']) => void;
  removeSkill: (skillId: string) => void;

  // Projects
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;

  // Certifications
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (certId: string, updates: Partial<Certification>) => void;
  deleteCertification: (certId: string) => void;

  // Internships
  addInternship: (internship: Omit<Internship, 'id'>) => void;
  updateInternship: (internId: string, updates: Partial<Internship>) => void;
  deleteInternship: (internId: string) => void;

  // Achievements
  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  updateAchievement: (achId: string, updates: Partial<Achievement>) => void;
  deleteAchievement: (achId: string) => void;

  // Soft Skills
  updateSoftSkills: (skills: string[]) => void;

  // Resume
  setResume: (file: File) => void;
  deleteResume: () => void;

  // Draft Management
  saveDraft: () => void;
  resetDraft: () => void;

  // UI State Simulators
  simulateLoading: (ms?: number) => Promise<void>;
  simulateError: (msg?: string) => void;
  clearError: () => void;
}

const StudentProfileContext = createContext<StudentProfileContextType | null>(null);

// Generate unique IDs
let idCounter = 100;
const genId = (prefix: string): string => `${prefix}-${++idCounter}`;

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  // ─── Core Profile State ─────────────────────────────────────────────────
  const [profile, setProfile] = useState<StudentProfile>(() => structuredClone(defaultMockProfile));

  // ─── Edit Tab State (session-level preservation) ────────────────────────
  const [activeEditTab, setActiveEditTab] = useState(0);
  const [editDraft, setEditDraft] = useState<StudentProfile>(() => structuredClone(defaultMockProfile));

  // ─── UI States ──────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Personal Info ──────────────────────────────────────────────────────
  const updatePersonalInfo = useCallback((updates: Partial<StudentProfile['personalInfo']>) => {
    setEditDraft((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...updates },
    }));
  }, []);

  // ─── Academic Info ──────────────────────────────────────────────────────
  const updateAcademicInfo = useCallback((updates: Partial<StudentProfile['academicInfo']>) => {
    setEditDraft((prev) => ({
      ...prev,
      academicInfo: { ...prev.academicInfo, ...updates },
    }));
  }, []);

  // ─── Placement Readiness ────────────────────────────────────────────────
  const updatePlacementReadiness = useCallback((updates: Partial<StudentProfile['placementReadiness']>) => {
    setEditDraft((prev) => ({
      ...prev,
      placementReadiness: { ...prev.placementReadiness, ...updates },
    }));
  }, []);

  // ─── Online Presence ────────────────────────────────────────────────────
  const updateOnlinePresence = useCallback((updates: Partial<StudentProfile['onlinePresence']>) => {
    setEditDraft((prev) => ({
      ...prev,
      onlinePresence: { ...prev.onlinePresence, ...updates },
    }));
  }, []);

  // ─── Technical Skills CRUD ──────────────────────────────────────────────
  const addSkill = useCallback((skill: Omit<TechnicalSkill, 'id'>) => {
    const newSkill: TechnicalSkill = { ...skill, id: genId('sk') };
    setProfile((prev) => ({
      ...prev,
      technicalSkills: [...prev.technicalSkills, newSkill],
    }));
    setEditDraft((prev) => ({
      ...prev,
      technicalSkills: [...prev.technicalSkills, newSkill],
    }));
  }, []);

  const updateSkillProficiency = useCallback((skillId: string, proficiency: TechnicalSkill['proficiency']) => {
    const updater = (prev: StudentProfile): StudentProfile => ({
      ...prev,
      technicalSkills: prev.technicalSkills.map((s) =>
        s.id === skillId ? { ...s, proficiency } : s
      ),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  const removeSkill = useCallback((skillId: string) => {
    const updater = (prev: StudentProfile): StudentProfile => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((s) => s.id !== skillId),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  // ─── Projects CRUD ─────────────────────────────────────────────────────
  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject: Project = { ...project, id: genId('proj') };
    setProfile((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
    setEditDraft((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    const updater = (prev: StudentProfile): StudentProfile => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId ? { ...p, ...updates } : p
      ),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    const updater = (prev: StudentProfile): StudentProfile => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projectId),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  // ─── Certifications CRUD ───────────────────────────────────────────────
  const addCertification = useCallback((cert: Omit<Certification, 'id'>) => {
    const newCert: Certification = { ...cert, id: genId('cert') };
    setProfile((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }));
    setEditDraft((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  }, []);

  const updateCertification = useCallback((certId: string, updates: Partial<Certification>) => {
    const updater = (prev: StudentProfile): StudentProfile => ({
      ...prev,
      certifications: prev.certifications.map((c) =>
        c.id === certId ? { ...c, ...updates } : c
      ),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  const deleteCertification = useCallback((certId: string) => {
    const updater = (prev: StudentProfile): StudentProfile => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== certId),
    });
    setProfile(updater);
    setEditDraft(updater);
  }, []);

  // ─── Internships CRUD ──────────────────────────────────────────────────
  const addInternship = useCallback((internship: Omit<Internship, 'id'>) => {
    const newInternship: Internship = { ...internship, id: genId('intern') };
    setEditDraft((prev) => ({ ...prev, internships: [...prev.internships, newInternship] }));
  }, []);

  const updateInternship = useCallback((internId: string, updates: Partial<Internship>) => {
    setEditDraft((prev) => ({
      ...prev,
      internships: prev.internships.map((i) =>
        i.id === internId ? { ...i, ...updates } : i
      ),
    }));
  }, []);

  const deleteInternship = useCallback((internId: string) => {
    setEditDraft((prev) => ({
      ...prev,
      internships: prev.internships.filter((i) => i.id !== internId),
    }));
  }, []);

  // ─── Achievements CRUD ─────────────────────────────────────────────────
  const addAchievement = useCallback((achievement: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = { ...achievement, id: genId('ach') };
    setEditDraft((prev) => ({ ...prev, achievements: [...prev.achievements, newAch] }));
  }, []);

  const updateAchievement = useCallback((achId: string, updates: Partial<Achievement>) => {
    setEditDraft((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) =>
        a.id === achId ? { ...a, ...updates } : a
      ),
    }));
  }, []);

  const deleteAchievement = useCallback((achId: string) => {
    setEditDraft((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== achId),
    }));
  }, []);

  // ─── Soft Skills ────────────────────────────────────────────────────────
  const updateSoftSkills = useCallback((skills: string[]) => {
    setEditDraft((prev) => ({ ...prev, softSkills: skills }));
  }, []);

  // ─── Resume ─────────────────────────────────────────────────────────────
  const setResume = useCallback((file: File) => {
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
  const simulateLoading = useCallback((ms = 800): Promise<void> => {
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

  const value: StudentProfileContextType = {
    profile,
    editDraft,
    activeEditTab,
    isLoading,
    error,
    setActiveEditTab,
    setEditDraft,
    updatePersonalInfo,
    updateAcademicInfo,
    updatePlacementReadiness,
    updateOnlinePresence,
    addSkill,
    updateSkillProficiency,
    removeSkill,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    updateCertification,
    deleteCertification,
    addInternship,
    updateInternship,
    deleteInternship,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    updateSoftSkills,
    setResume,
    deleteResume,
    saveDraft,
    resetDraft,
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

export function useStudentProfile(): StudentProfileContextType {
  const context = useContext(StudentProfileContext);
  if (!context) {
    throw new Error('useStudentProfile must be used within a StudentProfileProvider');
  }
  return context;
}

export default StudentProfileContext;
