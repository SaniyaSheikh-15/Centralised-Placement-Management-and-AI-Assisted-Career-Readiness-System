"use client";

import { useAuth } from "@/lib/auth-context";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  getStudentProfileByUserId,
  updateStudentProfile,
} from "@/lib/student-profile-api";

import type {
  StudentProfile,
  TechnicalSkill,
  Project,
  Certification,
  Internship,
  Achievement,
} from "@/types/student-profile";

/* ============================================================
   EMPTY PROFILE
============================================================ */

const EMPTY_PROFILE: StudentProfile = {
  personalInfo: {
    fullName: "",
    profilePhoto: null,
    dateOfBirth: "",
    gender: "",
    phone: "",
    altPhone: "",
    email: "",
    altEmail: "",
    permanentAddress: "",
    presentAddress: "",
    fatherName: "",
    motherName: "",
    fatherOccupation: "",
    annualFamilyIncome: "",
    religion: "",
    category: "",
    panNumber: "",
    aadhaarNumber: "",
    abcId: "",
    branch: "",
  },

  academicInfo: {
    universityEnrollmentNo: "",
    college: "",
    department: "",
    degree: "",
    academicYear: "",
    sscPercentage: "",
    sscPassingYear: "",
    hscDiplomaPercentage: "",
    hscDiplomaPassingYear: "",
    btechAggregate: "",
    cgpaCurrent: "",
    hasLiveBacklogs: "",
    backlogDetails: "",
  },

  placementReadiness: {
    interestedInTpActivities: "",
    interestedInCollegePlacement: "",
    areaOfInterestAfterGraduation: "",
    preparedForAptitude: "",
    aptitudeTrainingDetails: "",
    softwareLanguagesKnown: "",
    englishCommunicationRating: 0,
    readyToRelocate: "",
  },

  technicalSkills: [],
  softSkills: [],
  certifications: [],
  internships: [],
  projects: [],
  achievements: [],

  onlinePresence: {
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    codingProfileUrl: "",
  },

  resume: {
    uploadedResume: null,
    fileName: "",
    fileSize: 0,
    uploadDate: "",
  },
};

/* ============================================================
   CONTEXT TYPE
============================================================ */

interface StudentProfileContextType {
  profile: StudentProfile;
  editDraft: StudentProfile;
  activeEditTab: number;
  isLoading: boolean;
  error: string | null;

  setActiveEditTab: (tab: number) => void;
  setEditDraft: Dispatch<SetStateAction<StudentProfile>>;

  updatePersonalInfo: (
    updates: Partial<StudentProfile["personalInfo"]>
  ) => void;

  updateAcademicInfo: (
    updates: Partial<StudentProfile["academicInfo"]>
  ) => void;

  updatePlacementReadiness: (
    updates: Partial<StudentProfile["placementReadiness"]>
  ) => void;

  updateOnlinePresence: (
    updates: Partial<StudentProfile["onlinePresence"]>
  ) => void;

  addSkill: (skill: Omit<TechnicalSkill, "id">) => void;

  updateSkillProficiency: (
    skillId: string,
    proficiency: TechnicalSkill["proficiency"]
  ) => void;

  removeSkill: (skillId: string) => void;

  addProject: (project: Omit<Project, "id">) => void;

  updateProject: (
    projectId: string,
    updates: Partial<Project>
  ) => void;

  deleteProject: (projectId: string) => void;

  addCertification: (
    cert: Omit<Certification, "id">
  ) => void;

  updateCertification: (
    certId: string,
    updates: Partial<Certification>
  ) => void;

  deleteCertification: (certId: string) => void;

  addInternship: (
    internship: Omit<Internship, "id">
  ) => void;

  updateInternship: (
    internId: string,
    updates: Partial<Internship>
  ) => void;

  deleteInternship: (internId: string) => void;

  addAchievement: (
    achievement: Omit<Achievement, "id">
  ) => void;

  updateAchievement: (
    achId: string,
    updates: Partial<Achievement>
  ) => void;

  deleteAchievement: (achId: string) => void;

  updateSoftSkills: (skills: string[]) => void;

  setResume: (file: File) => void;
  deleteResume: () => void;

  saveDraft: () => Promise<void>;
  resetDraft: () => void;

  simulateLoading: (ms?: number) => Promise<void>;
  simulateError: (msg?: string) => void;
  clearError: () => void;
}

/* ============================================================
   CONTEXT
============================================================ */

const StudentProfileContext =
  createContext<StudentProfileContextType | null>(null);

/* ============================================================
   BACKEND → FRONTEND MAPPER
============================================================ */

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
        `${backendProfile.first_name || ""} ${
          backendProfile.last_name || ""
        }`.trim(),

      profilePhoto:
        previousProfile.personalInfo.profilePhoto,

      dateOfBirth:
        backendProfile.date_of_birth || "",

      gender:
        backendProfile.gender || "",

      phone:
        backendProfile.phone ||
        user?.phone ||
        "",

      altPhone:
        backendProfile.alternate_phone || "",

      email:
        backendProfile.email ||
        user?.email ||
        "",

      altEmail:
        backendProfile.alternate_email || "",

      permanentAddress:
        previousProfile.personalInfo.permanentAddress,

      presentAddress:
        previousProfile.personalInfo.presentAddress,

      fatherName:
        backendProfile.father_name || "",

      motherName:
        backendProfile.mother_name || "",

      fatherOccupation:
        backendProfile.father_occupation || "",

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
        backendProfile.abc_id || "",

      branch:
        backendProfile.branch_name ||
        backendProfile.branch ||
        previousProfile.personalInfo.branch ||
        "",
    },

    academicInfo: {
      ...previousProfile.academicInfo,

      universityEnrollmentNo:
        backendProfile.enrollment_no || "",

      college:
        backendProfile.college || "",

      department:
        backendProfile.department ||
        previousProfile.academicInfo.department ||
        "",

      degree:
        backendProfile.degree || "",

      academicYear:
        backendProfile.graduation_year
          ? String(backendProfile.graduation_year)
          : previousProfile.academicInfo.academicYear,

      sscPercentage:
        backendProfile.ssc_percentage ?? "",

      sscPassingYear:
        backendProfile.ssc_passing_year ?? "",

      hscDiplomaPercentage:
        backendProfile.hsc_diploma_percentage ?? "",

      hscDiplomaPassingYear:
        backendProfile.hsc_diploma_passing_year ?? "",

      btechAggregate:
        backendProfile.btech_aggregate ?? "",

      cgpaCurrent:
        backendProfile.cgpa ?? "",

      hasLiveBacklogs:
        backendProfile.active_backlogs !== null &&
        backendProfile.active_backlogs !== undefined
          ? backendProfile.active_backlogs > 0
            ? "Yes"
            : "No"
          : "",

      backlogDetails:
        backendProfile.active_backlogs !== null &&
        backendProfile.active_backlogs !== undefined
          ? `${backendProfile.active_backlogs} active backlog(s)`
          : "",
    },

    placementReadiness: {
      ...previousProfile.placementReadiness,

      interestedInTpActivities:
        backendProfile.t_and_p_interest || "",

      interestedInCollegePlacement:
        backendProfile.placement_interest || "",

      areaOfInterestAfterGraduation:
        backendProfile.career_area || "",

      preparedForAptitude:
        backendProfile.aptitude_prepared === true
          ? "Yes"
          : backendProfile.aptitude_prepared === false
            ? "No"
            : "",

      aptitudeTrainingDetails:
        backendProfile.aptitude_training_details || "",

      softwareLanguagesKnown:
        backendProfile.languages_known || "",

      englishCommunicationRating:
        backendProfile.english_rating ?? 0,

      readyToRelocate:
        backendProfile.ready_to_relocate === true
          ? "Yes"
          : backendProfile.ready_to_relocate === false
            ? "No"
            : "",
    },

    onlinePresence: {
      ...previousProfile.onlinePresence,

      githubUrl:
        backendProfile.github_url || "",

      linkedinUrl:
        backendProfile.linkedin_url || "",

      portfolioUrl:
        backendProfile.portfolio_url || "",

      codingProfileUrl:
        previousProfile.onlinePresence.codingProfileUrl || "",
    },
  };
}

/* ============================================================
   LOCAL ID GENERATOR
============================================================ */

let idCounter = 100;

const genId = (prefix: string): string =>
  `${prefix}-${++idCounter}`;

/* ============================================================
   PROVIDER
============================================================ */

export function StudentProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [profile, setProfile] =
    useState<StudentProfile>(
      () => structuredClone(EMPTY_PROFILE)
    );

  const [editDraft, setEditDraft] =
    useState<StudentProfile>(
      () => structuredClone(EMPTY_PROFILE)
    );

  const [activeEditTab, setActiveEditTab] =
    useState(0);

  /* ----------------------------------------------------------
     AUTH
  ---------------------------------------------------------- */

  const {
    user,
    token,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  /* ----------------------------------------------------------
     UI STATE
  ---------------------------------------------------------- */

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [studentId, setStudentId] =
    useState<string | null>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  /* ==========================================================
     LOAD AUTHENTICATED STUDENT PROFILE
  ========================================================== */

  useEffect(() => {
    /*
     * DO NOT attempt profile loading while AuthProvider
     * is still restoring the authentication state.
     */
    if (authLoading) {
      return;
    }

    /*
     * No authenticated session.
     */
    if (!isAuthenticated || !token || !user) {
      setIsLoading(false);
      setError(null);
      setStudentId(null);
      return;
    }

    /*
     * Only students should load the student profile.
     */
    if (user.role?.toLowerCase() !== "student") {
      setIsLoading(false);
      setError(null);
      setStudentId(null);
      return;
    }

    /*
     * IMPORTANT:
     * Create stable non-null references AFTER the guards.
     *
     * This fixes:
     * "user is possibly null"
     *
     * TypeScript can safely understand that these constants
     * cannot be null inside the async function.
     */
    const authenticatedUser = user;
    const authenticatedToken = token;

    let cancelled = false;

    async function loadBackendProfile() {
      try {
        setIsLoading(true);
        setError(null);

        console.log(
          "AUTH READY - loading student profile"
        );

        console.log(
          "AUTH USER:",
          authenticatedUser
        );

        console.log(
          "AUTH TOKEN EXISTS:",
          Boolean(authenticatedToken)
        );

        /*
 * IMPORTANT:
 * Profile is loaded using the authenticated
 * user's user_id.
 */

console.log(
  "AUTHENTICATED USER:",
  authenticatedUser
);

console.log(
  "AUTHENTICATED USER_ID:",
  authenticatedUser.user_id
);

const backendProfile =
  await getStudentProfileByUserId(
    authenticatedUser.user_id
  );

        if (cancelled) {
          return;
        }

        if (!backendProfile?.student_id) {
          throw new Error(
            "Student profile was not found for this account."
          );
        }

        setStudentId(
          backendProfile.student_id
        );

        console.log(
          "BACKEND STUDENT PROFILE:",
          backendProfile
        );

        const mappedProfile =
          mapBackendProfileToStudentProfile(
            backendProfile,
            authenticatedUser,
            EMPTY_PROFILE
          );

        setProfile(mappedProfile);

        setEditDraft(
          structuredClone(mappedProfile)
        );

        console.log(
          "Student profile loaded successfully"
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load student profile:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load student profile"
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadBackendProfile();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    isAuthenticated,
    token,
    user,
  ]);

  /* ============================================================
     PERSONAL INFO
  ============================================================ */

  const updatePersonalInfo = useCallback(
    (
      updates: Partial<
        StudentProfile["personalInfo"]
      >
    ) => {
      setEditDraft((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          ...updates,
        },
      }));
    },
    []
  );

  /* ============================================================
     ACADEMIC INFO
  ============================================================ */

  const updateAcademicInfo = useCallback(
    (
      updates: Partial<
        StudentProfile["academicInfo"]
      >
    ) => {
      setEditDraft((prev) => ({
        ...prev,
        academicInfo: {
          ...prev.academicInfo,
          ...updates,
        },
      }));
    },
    []
  );

  /* ============================================================
     PLACEMENT READINESS
  ============================================================ */

  const updatePlacementReadiness = useCallback(
    (
      updates: Partial<
        StudentProfile["placementReadiness"]
      >
    ) => {
      setEditDraft((prev) => ({
        ...prev,
        placementReadiness: {
          ...prev.placementReadiness,
          ...updates,
        },
      }));
    },
    []
  );

  /* ============================================================
     ONLINE PRESENCE
  ============================================================ */

  const updateOnlinePresence = useCallback(
    (
      updates: Partial<
        StudentProfile["onlinePresence"]
      >
    ) => {
      setEditDraft((prev) => ({
        ...prev,
        onlinePresence: {
          ...prev.onlinePresence,
          ...updates,
        },
      }));
    },
    []
  );

  /* ============================================================
     TECHNICAL SKILLS
  ============================================================ */

  const addSkill = useCallback(
    (skill: Omit<TechnicalSkill, "id">) => {
      const newSkill: TechnicalSkill = {
        ...skill,
        id: genId("sk"),
      };

      setProfile((prev) => ({
        ...prev,
        technicalSkills: [
          ...prev.technicalSkills,
          newSkill,
        ],
      }));

      setEditDraft((prev) => ({
        ...prev,
        technicalSkills: [
          ...prev.technicalSkills,
          newSkill,
        ],
      }));
    },
    []
  );

  const updateSkillProficiency = useCallback(
    (
      skillId: string,
      proficiency: TechnicalSkill["proficiency"]
    ) => {
      const updater = (
        prev: StudentProfile
      ): StudentProfile => ({
        ...prev,
        technicalSkills:
          prev.technicalSkills.map((skill) =>
            skill.id === skillId
              ? {
                  ...skill,
                  proficiency,
                }
              : skill
          ),
      });

      setProfile(updater);
      setEditDraft(updater);
    },
    []
  );

  const removeSkill = useCallback(
    (skillId: string) => {
      const updater = (
        prev: StudentProfile
      ): StudentProfile => ({
        ...prev,
        technicalSkills:
          prev.technicalSkills.filter(
            (skill) => skill.id !== skillId
          ),
      });

      setProfile(updater);
      setEditDraft(updater);
    },
    []
  );

  /* ============================================================
     PROJECTS
  ============================================================ */

  const addProject = useCallback(
    (project: Omit<Project, "id">) => {
      const newProject: Project = {
        ...project,
        id: genId("proj"),
      };

      setProfile((prev) => ({
        ...prev,
        projects: [
          ...prev.projects,
          newProject,
        ],
      }));

      setEditDraft((prev) => ({
        ...prev,
        projects: [
          ...prev.projects,
          newProject,
        ],
      }));
    },
    []
  );

  const updateProject = useCallback(
    (
      projectId: string,
      updates: Partial<Project>
    ) => {
      const updater = (
        prev: StudentProfile
      ): StudentProfile => ({
        ...prev,
        projects: prev.projects.map(
          (project) =>
            project.id === projectId
              ? {
                  ...project,
                  ...updates,
                }
              : project
        ),
      });

      setProfile(updater);
      setEditDraft(updater);
    },
    []
  );

  const deleteProject = useCallback(
    (projectId: string) => {
      const updater = (
        prev: StudentProfile
      ): StudentProfile => ({
        ...prev,
        projects: prev.projects.filter(
          (project) =>
            project.id !== projectId
        ),
      });

      setProfile(updater);
      setEditDraft(updater);
    },
    []
  );

  /* ============================================================
     CERTIFICATIONS
  ============================================================ */

  const addCertification = useCallback(
    (
      cert: Omit<Certification, "id">
    ) => {
      const newCert: Certification = {
        ...cert,
        id: genId("cert"),
      };

      setProfile((prev) => ({
        ...prev,
        certifications: [
          ...prev.certifications,
          newCert,
        ],
      }));

      setEditDraft((prev) => ({
        ...prev,
        certifications: [
          ...prev.certifications,
          newCert,
        ],
      }));
    },
    []
  );

  const updateCertification = useCallback(
    (
      certId: string,
      updates: Partial<Certification>
    ) => {
      const updater = (
        prev: StudentProfile
      ): StudentProfile => ({
        ...prev,
        certifications:
          prev.certifications.map(
            (cert) =>
              cert.id === certId
                ? {
                    ...cert,
                    ...updates,
                  }
                : cert
          ),
      });

      setProfile(updater);
      setEditDraft(updater);
    },
    []
  );

  const deleteCertification = useCallback(
    (certId: string) => {
      const updater = (
        prev: StudentProfile
      ): StudentProfile => ({
        ...prev,
        certifications:
          prev.certifications.filter(
            (cert) =>
              cert.id !== certId
          ),
      });

      setProfile(updater);
      setEditDraft(updater);
    },
    []
  );

  /* ============================================================
     INTERNSHIPS
  ============================================================ */

  const addInternship = useCallback(
    (
      internship: Omit<Internship, "id">
    ) => {
      const newInternship: Internship = {
        ...internship,
        id: genId("intern"),
      };

      setEditDraft((prev) => ({
        ...prev,
        internships: [
          ...prev.internships,
          newInternship,
        ],
      }));
    },
    []
  );

  const updateInternship = useCallback(
    (
      internId: string,
      updates: Partial<Internship>
    ) => {
      setEditDraft((prev) => ({
        ...prev,
        internships:
          prev.internships.map(
            (internship) =>
              internship.id === internId
                ? {
                    ...internship,
                    ...updates,
                  }
                : internship
          ),
      }));
    },
    []
  );

  const deleteInternship = useCallback(
    (internId: string) => {
      setEditDraft((prev) => ({
        ...prev,
        internships:
          prev.internships.filter(
            (internship) =>
              internship.id !== internId
          ),
      }));
    },
    []
  );

  /* ============================================================
     ACHIEVEMENTS
  ============================================================ */

  const addAchievement = useCallback(
    (
      achievement: Omit<Achievement, "id">
    ) => {
      const newAchievement: Achievement = {
        ...achievement,
        id: genId("ach"),
      };

      setEditDraft((prev) => ({
        ...prev,
        achievements: [
          ...prev.achievements,
          newAchievement,
        ],
      }));
    },
    []
  );

  const updateAchievement = useCallback(
    (
      achId: string,
      updates: Partial<Achievement>
    ) => {
      setEditDraft((prev) => ({
        ...prev,
        achievements:
          prev.achievements.map(
            (achievement) =>
              achievement.id === achId
                ? {
                    ...achievement,
                    ...updates,
                  }
                : achievement
          ),
      }));
    },
    []
  );

  const deleteAchievement = useCallback(
    (achId: string) => {
      setEditDraft((prev) => ({
        ...prev,
        achievements:
          prev.achievements.filter(
            (achievement) =>
              achievement.id !== achId
          ),
      }));
    },
    []
  );

  /* ============================================================
     SOFT SKILLS
  ============================================================ */

  const updateSoftSkills = useCallback(
    (skills: string[]) => {
      setEditDraft((prev) => ({
        ...prev,
        softSkills: skills,
      }));
    },
    []
  );

  /* ============================================================
     RESUME
  ============================================================ */

  const setResume = useCallback(
    (file: File) => {
      const resumeData = {
        uploadedResume: file,
        fileName: file.name,
        fileSize: file.size,
        uploadDate:
          new Date().toISOString(),
      };

      setProfile((prev) => ({
        ...prev,
        resume: resumeData,
      }));

      setEditDraft((prev) => ({
        ...prev,
        resume: resumeData,
      }));
    },
    []
  );

  const deleteResume = useCallback(() => {
    const emptyResume = {
      uploadedResume: null,
      fileName: "",
      fileSize: 0,
      uploadDate: "",
    };

    setProfile((prev) => ({
      ...prev,
      resume: emptyResume,
    }));

    setEditDraft((prev) => ({
      ...prev,
      resume: emptyResume,
    }));
  }, []);

  /* ============================================================
     SAVE DRAFT
  ============================================================ */

  const saveDraft = useCallback(
    async () => {
      if (!studentId) {
        throw new Error(
          "Student ID is not available"
        );
      }

      try {
        setIsSaving(true);
        setError(null);

        const payload = {
          branch_id: undefined,

          date_of_birth:
            editDraft.personalInfo
              .dateOfBirth || undefined,

          gender:
            editDraft.personalInfo.gender ||
            undefined,

          alternate_phone:
            editDraft.personalInfo.altPhone ||
            undefined,

          alternate_email:
            editDraft.personalInfo.altEmail ||
            undefined,

          father_name:
            editDraft.personalInfo
              .fatherName || undefined,

          mother_name:
            editDraft.personalInfo
              .motherName || undefined,

          father_occupation:
            editDraft.personalInfo
              .fatherOccupation || undefined,

          abc_id:
            editDraft.personalInfo.abcId ||
            undefined,

          enrollment_no:
            editDraft.academicInfo
              .universityEnrollmentNo ||
            undefined,

          college:
            editDraft.academicInfo.college ||
            undefined,

          degree:
            editDraft.academicInfo.degree ||
            undefined,

          ssc_percentage:
            editDraft.academicInfo
              .sscPercentage !== ""
              ? Number(
                  editDraft.academicInfo
                    .sscPercentage
                )
              : undefined,

          ssc_passing_year:
            editDraft.academicInfo
              .sscPassingYear !== ""
              ? Number(
                  editDraft.academicInfo
                    .sscPassingYear
                )
              : undefined,

          hsc_diploma_percentage:
            editDraft.academicInfo
              .hscDiplomaPercentage !== ""
              ? Number(
                  editDraft.academicInfo
                    .hscDiplomaPercentage
                )
              : undefined,

          hsc_diploma_passing_year:
            editDraft.academicInfo
              .hscDiplomaPassingYear !== ""
              ? Number(
                  editDraft.academicInfo
                    .hscDiplomaPassingYear
                )
              : undefined,

          btech_aggregate:
            editDraft.academicInfo
              .btechAggregate !== ""
              ? Number(
                  editDraft.academicInfo
                    .btechAggregate
                )
              : undefined,

          cgpa:
            editDraft.academicInfo
              .cgpaCurrent !== ""
              ? Number(
                  editDraft.academicInfo
                    .cgpaCurrent
                )
              : undefined,

          active_backlogs:
            editDraft.academicInfo
              .hasLiveBacklogs === "Yes"
              ? 1
              : editDraft.academicInfo
                    .hasLiveBacklogs === "No"
                ? 0
                : undefined,

          t_and_p_interest:
            editDraft.placementReadiness
              .interestedInTpActivities ||
            undefined,

          placement_interest:
            editDraft.placementReadiness
              .interestedInCollegePlacement ||
            undefined,

          career_area:
            editDraft.placementReadiness
              .areaOfInterestAfterGraduation ||
            undefined,

          aptitude_prepared:
            editDraft.placementReadiness
              .preparedForAptitude === "Yes"
              ? true
              : editDraft.placementReadiness
                    .preparedForAptitude === "No"
                ? false
                : undefined,

          aptitude_training_details:
            editDraft.placementReadiness
              .aptitudeTrainingDetails ||
            undefined,

          languages_known:
            editDraft.placementReadiness
              .softwareLanguagesKnown ||
            undefined,

          english_rating:
            editDraft.placementReadiness
              .englishCommunicationRating ||
            undefined,

          ready_to_relocate:
            editDraft.placementReadiness
              .readyToRelocate === "Yes"
              ? true
              : editDraft.placementReadiness
                    .readyToRelocate === "No"
                ? false
                : undefined,

          linkedin_url:
            editDraft.onlinePresence
              .linkedinUrl || undefined,

          github_url:
            editDraft.onlinePresence
              .githubUrl || undefined,

          portfolio_url:
            editDraft.onlinePresence
              .portfolioUrl || undefined,
        };

        const updatedProfile =
          await updateStudentProfile(
            studentId,
            payload
          );

        const mappedProfile =
          mapBackendProfileToStudentProfile(
            updatedProfile,
            {
              email:
                updatedProfile.email ||
                user?.email,

              phone:
                updatedProfile.phone ||
                user?.phone,
            },
            profile
          );

        setProfile(mappedProfile);

        setEditDraft(
          structuredClone(mappedProfile)
        );

        console.log(
          "Student profile updated successfully"
        );
      } catch (err) {
        console.error(
          "Failed to update student profile:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to update student profile"
        );

        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [
      studentId,
      editDraft,
      profile,
      user,
    ]
  );

  /* ============================================================
     RESET DRAFT
  ============================================================ */

  const resetDraft = useCallback(() => {
    setEditDraft(
      structuredClone(profile)
    );
  }, [profile]);

  /* ============================================================
     SIMULATE LOADING
  ============================================================ */

  const simulateLoading = useCallback(
    (ms = 800): Promise<void> => {
      setIsLoading(true);
      setError(null);

      return new Promise((resolve) => {
        setTimeout(() => {
          setIsLoading(false);
          resolve();
        }, ms);
      });
    },
    []
  );

  /* ============================================================
     SIMULATE ERROR
  ============================================================ */

  const simulateError = useCallback(
    (
      msg = "Something went wrong. Please try again."
    ) => {
      setError(msg);
      setIsLoading(false);
    },
    []
  );

  const clearError = useCallback(
    () => setError(null),
    []
  );

  /* ============================================================
     CONTEXT VALUE
  ============================================================ */

  const value: StudentProfileContextType = {
    profile,
    editDraft,
    activeEditTab,

    isLoading:
      isLoading ||
      authLoading,

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
    <StudentProfileContext.Provider
      value={value}
    >
      {children}
    </StudentProfileContext.Provider>
  );
}

/* ============================================================
   HOOK
============================================================ */

export function useStudentProfile(): StudentProfileContextType {
  const context =
    useContext(StudentProfileContext);

  if (!context) {
    throw new Error(
      "useStudentProfile must be used within a StudentProfileProvider"
    );
  }

  return context;
}

export default StudentProfileContext;