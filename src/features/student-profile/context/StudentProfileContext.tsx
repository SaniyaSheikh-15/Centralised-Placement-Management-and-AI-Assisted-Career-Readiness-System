'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import {
  getStudentProfileByUserId,
  updateStudentProfile,
} from '@/lib/student-profile-api';

import type {
  StudentProfile,
  TechnicalSkill,
  Project,
  Certification,
  Internship,
  Achievement,
} from '@/types/student-profile';


const EMPTY_PROFILE: StudentProfile = {
  personalInfo: {
    fullName: '',
    profilePhoto: null,
    dateOfBirth: '',
    gender: '',
    phone: '',
    altPhone: '',
    email: '',
    altEmail: '',
    permanentAddress: '',
    presentAddress: '',
    fatherName: '',
    motherName: '',
    fatherOccupation: '',
    annualFamilyIncome: '',
    religion: '',
    category: '',
    panNumber: '',
    aadhaarNumber: '',
    abcId: '',
    branch: '',
  },

  academicInfo: {
    universityEnrollmentNo: '',
    college: '',
    department: '',
    degree: '',
    academicYear: '',
    sscPercentage: '',
    sscPassingYear: '',
    hscDiplomaPercentage: '',
    hscDiplomaPassingYear: '',
    btechAggregate: '',
    cgpaCurrent: '',
    hasLiveBacklogs: '',
    backlogDetails: '',
  },

  placementReadiness: {
    interestedInTpActivities: '',
    interestedInCollegePlacement: '',
    areaOfInterestAfterGraduation: '',
    preparedForAptitude: '',
    aptitudeTrainingDetails: '',
    softwareLanguagesKnown: '',
    englishCommunicationRating: 0,
    readyToRelocate: '',
  },

  technicalSkills: [],
  softSkills: [],
  certifications: [],
  internships: [],
  projects: [],
  achievements: [],

  onlinePresence: {
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    codingProfileUrl: '',
  },

  resume: {
    uploadedResume: null,
    fileName: '',
    fileSize: 0,
    uploadDate: '',
  },
};

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
  saveDraft: () => Promise<void>;
  resetDraft: () => void;

  // UI State Simulators
  simulateLoading: (ms?: number) => Promise<void>;
  simulateError: (msg?: string) => void;
  clearError: () => void;
}

const StudentProfileContext = createContext<StudentProfileContextType | null>(null);

// ─── Backend → Frontend Profile Mapper ───────────────────────────────────

function mapBackendProfileToStudentProfile(
  backendProfile: any,
  user: any,
  previousProfile: StudentProfile
): StudentProfile {
  return {
    ...previousProfile,

    personalInfo: {
      ...previousProfile.personalInfo,

      fullName:
        backendProfile.full_name ||
        `${backendProfile.first_name || ''} ${
          backendProfile.last_name || ''
        }`.trim(),

      profilePhoto:
        previousProfile.personalInfo.profilePhoto,

      dateOfBirth:
        backendProfile.date_of_birth || '',

      gender:
        backendProfile.gender || '',

      phone:
        backendProfile.phone ||
        user.phone ||
        '',

      altPhone:
        backendProfile.alternate_phone || '',

      email:
        backendProfile.email ||
        user.email ||
        '',

      altEmail:
        backendProfile.alternate_email || '',

      permanentAddress:
        previousProfile.personalInfo.permanentAddress,

      presentAddress:
        previousProfile.personalInfo.presentAddress,

      fatherName:
        backendProfile.father_name || '',

      motherName:
        backendProfile.mother_name || '',

      fatherOccupation:
        backendProfile.father_occupation || '',

      annualFamilyIncome:
        previousProfile.personalInfo.annualFamilyIncome,

      religion:
        previousProfile.personalInfo.religion,

      category:
        previousProfile.personalInfo.category,

      panNumber:
        previousProfile.personalInfo.panNumber,

      aadhaarNumber:
        previousProfile.personalInfo.aadhaarNumber,

      abcId:
        backendProfile.abc_id || '',

      branch:
        backendProfile.branch_name ||
        backendProfile.branch ||
        previousProfile.personalInfo.branch ||
        '',
    },

    academicInfo: {
      ...previousProfile.academicInfo,

      universityEnrollmentNo:
        backendProfile.enrollment_no || '',

      college:
        backendProfile.college || '',

      department:
        backendProfile.department ||
        previousProfile.academicInfo.department ||
        '',

      degree:
        backendProfile.degree || '',

      academicYear:
        backendProfile.graduation_year
          ? String(backendProfile.graduation_year)
          : previousProfile.academicInfo.academicYear,

      sscPercentage:
        backendProfile.ssc_percentage ?? '',

      sscPassingYear:
        backendProfile.ssc_passing_year ?? '',

      hscDiplomaPercentage:
        backendProfile.hsc_diploma_percentage ?? '',

      hscDiplomaPassingYear:
        backendProfile.hsc_diploma_passing_year ?? '',

      btechAggregate:
        backendProfile.btech_aggregate ?? '',

      cgpaCurrent:
        backendProfile.cgpa ?? '',

      hasLiveBacklogs:
        backendProfile.active_backlogs !== null &&
        backendProfile.active_backlogs !== undefined
          ? backendProfile.active_backlogs > 0
            ? 'Yes'
            : 'No'
          : '',

      backlogDetails:
        backendProfile.active_backlogs !== null &&
        backendProfile.active_backlogs !== undefined
          ? `${backendProfile.active_backlogs} active backlog(s)`
          : '',
    },

    placementReadiness: {
      ...previousProfile.placementReadiness,

      interestedInTpActivities:
        backendProfile.t_and_p_interest || '',

      interestedInCollegePlacement:
        backendProfile.placement_interest || '',

      areaOfInterestAfterGraduation:
        backendProfile.career_area || '',

      preparedForAptitude:
        backendProfile.aptitude_prepared || '',

      aptitudeTrainingDetails:
        backendProfile.aptitude_training_details || '',

      softwareLanguagesKnown:
        backendProfile.languages_known || '',

      englishCommunicationRating:
        backendProfile.english_rating ?? 0,

      readyToRelocate:
        backendProfile.ready_to_relocate || '',
    },

    onlinePresence: {
      ...previousProfile.onlinePresence,

      githubUrl:
        backendProfile.github_url || '',

      linkedinUrl:
        backendProfile.linkedin_url || '',

      portfolioUrl:
        backendProfile.portfolio_url || '',

      codingProfileUrl:
        previousProfile.onlinePresence.codingProfileUrl || '',
    },
  };
}

// Generate unique IDs
let idCounter = 100;
const genId = (prefix: string): string => `${prefix}-${++idCounter}`;

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  // ─── Core Profile State ─────────────────────────────────────────────────
  const [profile, setProfile] = useState<StudentProfile>(
  () => structuredClone(EMPTY_PROFILE)
);

  // ─── Edit Tab State (session-level preservation) ────────────────────────
  const [activeEditTab, setActiveEditTab] = useState(0);
const [editDraft, setEditDraft] = useState<StudentProfile>(
  () => structuredClone(EMPTY_PROFILE)
);
  // ─── UI States ──────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
  async function loadBackendProfile() {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');

      if (!token) {
        throw new Error('User is not authenticated');
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        'http://127.0.0.1:8000';

      // Get authenticated user
      const userResponse = await fetch(
        `${API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userResponse.ok) {
        const errorBody =
          await userResponse.json().catch(() => ({}));

        throw new Error(
          errorBody.detail ||
            'Failed to get authenticated user'
        );
      }

      const user = await userResponse.json();

      console.log('AUTH USER:', user);

      // Get student's profile
      const backendProfile =
        await getStudentProfileByUserId(user.user_id);

      setStudentId(backendProfile.student_id);

      console.log(
        'BACKEND STUDENT PROFILE:',
        backendProfile
      );

      // Map backend data to frontend structure
      setProfile((previousProfile) =>
        mapBackendProfileToStudentProfile(
          backendProfile,
          user,
          previousProfile
        )
      );

      setEditDraft((previousProfile) =>
        mapBackendProfileToStudentProfile(
          backendProfile,
          user,
          previousProfile
        )
      );

      console.log(
        'Student profile loaded successfully'
      );
    } catch (err) {
      console.error(
        'Failed to load student profile:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load student profile'
      );
    } finally {
      setIsLoading(false);
    }
  }

  loadBackendProfile();
}, []);

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
  const saveDraft = useCallback(async () => {
  if (!studentId) {
    throw new Error('Student ID is not available');
  }

  try {
    setIsSaving(true);

    const payload = {
      branch_id: undefined,

      date_of_birth:
        editDraft.personalInfo.dateOfBirth || undefined,

      gender:
        editDraft.personalInfo.gender || undefined,

      alternate_phone:
        editDraft.personalInfo.altPhone || undefined,

      alternate_email:
        editDraft.personalInfo.altEmail || undefined,

      father_name:
        editDraft.personalInfo.fatherName || undefined,

      mother_name:
        editDraft.personalInfo.motherName || undefined,

      father_occupation:
        editDraft.personalInfo.fatherOccupation || undefined,

      abc_id:
        editDraft.personalInfo.abcId || undefined,

      enrollment_no:
        editDraft.academicInfo.universityEnrollmentNo || undefined,

      college:
        editDraft.academicInfo.college || undefined,

      degree:
        editDraft.academicInfo.degree || undefined,

      ssc_percentage:
        editDraft.academicInfo.sscPercentage !== ''
          ? Number(editDraft.academicInfo.sscPercentage)
          : undefined,

      ssc_passing_year:
        editDraft.academicInfo.sscPassingYear !== ''
          ? Number(editDraft.academicInfo.sscPassingYear)
          : undefined,

      hsc_diploma_percentage:
        editDraft.academicInfo.hscDiplomaPercentage !== ''
          ? Number(editDraft.academicInfo.hscDiplomaPercentage)
          : undefined,

      hsc_diploma_passing_year:
        editDraft.academicInfo.hscDiplomaPassingYear !== ''
          ? Number(editDraft.academicInfo.hscDiplomaPassingYear)
          : undefined,

      btech_aggregate:
        editDraft.academicInfo.btechAggregate !== ''
          ? Number(editDraft.academicInfo.btechAggregate)
          : undefined,

      cgpa:
        editDraft.academicInfo.cgpaCurrent !== ''
          ? Number(editDraft.academicInfo.cgpaCurrent)
          : undefined,

      active_backlogs:
        editDraft.academicInfo.hasLiveBacklogs === 'Yes'
          ? 1
          : editDraft.academicInfo.hasLiveBacklogs === 'No'
            ? 0
            : undefined,

      t_and_p_interest:
        editDraft.placementReadiness.interestedInTpActivities || undefined,

      placement_interest:
        editDraft.placementReadiness.interestedInCollegePlacement || undefined,

      career_area:
        editDraft.placementReadiness.areaOfInterestAfterGraduation || undefined,

      aptitude_prepared:
        editDraft.placementReadiness.preparedForAptitude === 'Yes'
          ? true
          : editDraft.placementReadiness.preparedForAptitude === 'No'
            ? false
            : undefined,

      aptitude_training_details:
        editDraft.placementReadiness.aptitudeTrainingDetails || undefined,

      languages_known:
        editDraft.placementReadiness.softwareLanguagesKnown || undefined,

      english_rating:
        editDraft.placementReadiness.englishCommunicationRating || undefined,

      ready_to_relocate:
        editDraft.placementReadiness.readyToRelocate === 'Yes'
          ? true
          : editDraft.placementReadiness.readyToRelocate === 'No'
            ? false
            : undefined,

      linkedin_url:
        editDraft.onlinePresence.linkedinUrl || undefined,

      github_url:
        editDraft.onlinePresence.githubUrl || undefined,

      portfolio_url:
        editDraft.onlinePresence.portfolioUrl || undefined,
    };

    const updatedProfile = await updateStudentProfile(
      studentId,
      payload
    );

    setProfile((previousProfile) =>
      mapBackendProfileToStudentProfile(
        updatedProfile,
        {
          email: updatedProfile.email,
          phone: updatedProfile.phone,
        },
        previousProfile
      )
    );

    setEditDraft((previousProfile) =>
      mapBackendProfileToStudentProfile(
        updatedProfile,
        {
          email: updatedProfile.email,
          phone: updatedProfile.phone,
        },
        previousProfile
      )
    );

    console.log('Student profile updated successfully');

  } catch (err) {
    console.error('Failed to update student profile:', err);

    setError(
      err instanceof Error
        ? err.message
        : 'Failed to update student profile'
    );

    throw err;

  } finally {
    setIsSaving(false);
  }
}, [studentId, editDraft]);
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
