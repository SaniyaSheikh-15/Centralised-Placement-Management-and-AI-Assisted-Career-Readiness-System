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
  createStudentProfile,
  updateStudentProfile,
  getBranches,
  addStudentSkill,
  getStudentSkills,
  updateStudentSkill,
  deleteStudentSkill,
  getStudentProjects,
  addStudentProject,
  updateStudentProject,
  deleteStudentProject,
  getStudentCertifications,
  addStudentCertification,
  updateStudentCertification,
  deleteStudentCertification,
  addStudentInternship,
  updateStudentInternship,
  deleteStudentInternship,
  getStudentInternships,
  addStudentAchievement,
  updateStudentAchievement,
  deleteStudentAchievement,
  getStudentAchievements,
  addStudentSocialLink,
  updateStudentSocialLink,
  deleteStudentSocialLink,
  getStudentSocialLinks,
  getStudentResumes,
  uploadStudentResume,
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
    branchId: "",
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

  addSkill: (
    skill: Omit<TechnicalSkill, "id">
  ) => Promise<void>;

  updateSkillProficiency: (
    skillId: string,
    proficiency: TechnicalSkill["proficiency"]
  ) => Promise<void>;

  removeSkill: (skillId: string) => Promise<void>;

  addProject: (project: Omit<Project, "id">) => Promise<void>;

  updateProject: (
    projectId: string,
    updates: Partial<Project>
  ) => Promise<void>;

  deleteProject: (projectId: string) => Promise<void>;

  addCertification: (
    cert: Omit<Certification, "id">
  ) => Promise<void>;

  updateCertification: (
    certId: string,
    updates: Partial<Certification>
  ) => Promise<void>;

  deleteCertification: (certId: string) => Promise<void>;

  addInternship: (
    internship: Omit<Internship, "id">
  ) => Promise<void>;

  updateInternship: (
    internId: string,
    updates: Partial<Internship>
  ) => Promise<void>;

  deleteInternship: (internId: string) => Promise<void>;

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

type BackendSocialLink = {
  social_link_id: string;
  student_id: string;
  platform: string;
  profile_url: string;
};

/* ============================================================
   BRANCH TYPE
============================================================ */

type BackendBranch = {
  branch_id: string;
  branch_code: string;
  branch_name: string;
  department: string | null;
};

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
  previousProfile: StudentProfile,
  branches: BackendBranch[] = []
): StudentProfile {
  /*
   * ============================================================
   * BRANCH + DEPARTMENT
   * ============================================================
   *
   * Backend student profile gives us branch_id.
   *
   * Master branch data gives us:
   * - branch_name
   * - department
   *
   * Find the matching branch using branch_id.
   */

  const branchId =
    backendProfile.branch_id ||
    previousProfile.personalInfo.branchId ||
    "";

  const selectedBranch = branches.find(
    (branch) => branch.branch_id === branchId
  );

  const branchName =
    selectedBranch?.branch_name ||
    backendProfile.branch_name ||
    backendProfile.branch ||
    previousProfile.personalInfo.branch ||
    "";

  const department =
    selectedBranch?.department ||
    backendProfile.department ||
    previousProfile.academicInfo.department ||
    "";

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

      abcId:
        backendProfile.abc_id || "",

      /*
       * BRANCH NAME
       */
      branch: branchName,

      /*
       * BRANCH UUID
       */
      branchId: branchId,
    },

    academicInfo: {
      ...previousProfile.academicInfo,

      universityEnrollmentNo:
        backendProfile.enrollment_no || "",

      college:
        backendProfile.college || "",

      /*
       * DEPARTMENT FROM MASTER BRANCH DATA
       */
      department: department,

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

const mapProjectToBackend = (
  project: Omit<Project, "id">
) => ({
  title: project.name,
  description: project.description,
  github_url: project.githubUrl || null,
  live_demo_url: project.liveUrl || null,
});

const mapCertificationFromBackend = (
  cert: any
): Certification => ({
  id: cert.certificate_id,
  name: cert.certificate_name,
  organization: cert.issuing_organization,
  date: cert.issue_date || "",
  link: cert.credential_url || "",
});

const mapAchievementFromBackend = (
  achievement: any
): Achievement => ({
  id: achievement.achievement_id,
  title: achievement.title,
  description: achievement.description ?? "",
  date: achievement.achievement_date
    ? achievement.achievement_date.slice(0, 7)
    : "",
});

const parseInternshipDuration = (
  duration: string
): {
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
} => {
  const value = duration.trim();

  if (!value) {
    return {
      start_date: null,
      end_date: null,
      is_current: false,
    };
  }

  const parts = value.split(/\s*[–-]\s*/);

  const parseMonth = (
    month: string
  ): string | null => {
    const match = month
      .trim()
      .match(/^([A-Za-z]+)\s+(\d{4})$/);

    if (!match) return null;

    const [, monthName, year] = match;

    const monthIndex = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ].indexOf(
      monthName.slice(0, 3).toLowerCase()
    );

    if (monthIndex === -1) return null;

    return `${year}-${String(
      monthIndex + 1
    ).padStart(2, "0")}-01`;
  };

  const startDate = parseMonth(parts[0]);

  if (!startDate) {
    return {
      start_date: null,
      end_date: null,
      is_current: false,
    };
  }

  const endText =
    parts[1]?.trim().toLowerCase();

  if (
    !endText ||
    endText === "present" ||
    endText === "current"
  ) {
    return {
      start_date: startDate,
      end_date: null,
      is_current: true,
    };
  }

  return {
    start_date: startDate,
    end_date: parseMonth(parts[1]),
    is_current: false,
  };
};

const formatInternshipDuration = (
  startDate: string | null,
  endDate: string | null,
  isCurrent: boolean | null
): string => {
  const formatMonth = (
    date: string | null
  ): string => {
    if (!date) return "";

    const parsed = new Date(
      `${date}T00:00:00`
    );

    return parsed.toLocaleDateString(
      "en-US",
      {
        month: "short",
        year: "numeric",
      }
    );
  };

  const start = formatMonth(startDate);

  if (!start) return "";

  if (isCurrent || !endDate) {
    return `${start} – Present`;
  }

  return `${start} – ${formatMonth(endDate)}`;
};

const mapInternshipFromBackend = (
  internship: any
): Internship => ({
  id: internship.internship_id,
  organization:
    internship.company_name || "",
  role:
    internship.role_title || "",
  duration:
    formatInternshipDuration(
      internship.start_date,
      internship.end_date,
      internship.is_current
    ),
  description:
    internship.description || "",
});

const mapSocialLinksToOnlinePresence = (
  socialLinks: any[]
): StudentProfile["onlinePresence"] => {
  const onlinePresence = {
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    codingProfileUrl: "",
  };

  socialLinks.forEach((link) => {
    switch (link.platform) {
      case "github":
        onlinePresence.githubUrl =
          link.profile_url;
        break;

      case "linkedin":
        onlinePresence.linkedinUrl =
          link.profile_url;
        break;

      case "portfolio":
        onlinePresence.portfolioUrl =
          link.profile_url;
        break;

      case "coding":
        onlinePresence.codingProfileUrl =
          link.profile_url;
        break;
    }
  });

  return onlinePresence;
};

const saveSocialLinks = async (
  studentId: string,
  onlinePresence: StudentProfile["onlinePresence"]
) => {
  const existingLinks =
    (await getStudentSocialLinks(
      studentId
    )) as BackendSocialLink[];

  const socialLinks = [
    {
      platform: "github",
      profile_url:
        onlinePresence.githubUrl,
    },
    {
      platform: "linkedin",
      profile_url:
        onlinePresence.linkedinUrl,
    },
    {
      platform: "portfolio",
      profile_url:
        onlinePresence.portfolioUrl,
    },
    {
      platform: "coding",
      profile_url:
        onlinePresence.codingProfileUrl,
    },
  ];

  for (const link of socialLinks) {
    const existing =
      existingLinks.find(
        (item) =>
          item.platform ===
          link.platform
      );

    if (link.profile_url.trim()) {
      if (existing) {
        await updateStudentSocialLink(
          studentId,
          existing.social_link_id,
          link
        );
      } else {
        await addStudentSocialLink(
          studentId,
          link
        );
      }
    } else if (existing) {
      await deleteStudentSocialLink(
        studentId,
        existing.social_link_id
      );
    }
  }
};

/* ============================================================
   LOCAL ID GENERATOR
============================================================ */

let idCounter = 100;

const genId = (
  prefix: string
): string =>
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
    if (authLoading) {
      return;
    }

    if (
      !isAuthenticated ||
      !token ||
      !user
    ) {
      setIsLoading(false);
      setError(null);
      setStudentId(null);
      return;
    }

    if (
      user.role?.toLowerCase() !==
      "student"
    ) {
      setIsLoading(false);
      setError(null);
      setStudentId(null);
      return;
    }

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

        if (
          !backendProfile?.student_id
        ) {
          throw new Error(
            "Student profile was not found for this account."
          );
        }

        setStudentId(
          backendProfile.student_id
        );

        /*
         * ========================================================
         * LOAD MASTER BRANCHES
         * ========================================================
         *
         * This is only for resolving:
         * branch_id → branch_name + department
         *
         * No branch data is modified here.
         */

        const branchesResponse =
          await getBranches();

        const branches =
          branchesResponse as BackendBranch[];

        if (cancelled) {
          return;
        }

        const backendSkills =
          await getStudentSkills(
            backendProfile.student_id
          );

        const backendProjects =
          await getStudentProjects(
            backendProfile.student_id
          );

        const certificationsResponse =
          await getStudentCertifications(
            backendProfile.student_id
          );

        const certifications =
          certificationsResponse.map(
            mapCertificationFromBackend
          );

        const internshipsResponse =
          await getStudentInternships(
            backendProfile.student_id
          );

        const internships: Internship[] =
          internshipsResponse.map(
            mapInternshipFromBackend
          );

        const projects: Project[] =
          backendProjects.map(
            (project: {
              project_id: string;
              title: string | null;
              description: string | null;
              github_url: string | null;
              live_demo_url: string | null;
            }) => ({
              id: project.project_id,
              name: project.title || "",
              description:
                project.description || "",
              techStack: [],
              githubUrl:
                project.github_url || "",
              liveUrl:
                project.live_demo_url || "",
            })
          );

        const technicalSkills: TechnicalSkill[] =
          backendSkills.map(
            (skill: {
              student_skill_id: string;
              skill_name: string;
              proficiency_level:
                TechnicalSkill["proficiency"];
            }) => ({
              id: skill.student_skill_id,
              name: skill.skill_name,
              proficiency:
                skill.proficiency_level,
            })
          );

        const achievementsResponse =
          await getStudentAchievements(
            backendProfile.student_id
          );

        const achievements: Achievement[] =
          achievementsResponse.map(
            mapAchievementFromBackend
          );

        const socialLinksResponse =
          await getStudentSocialLinks(
            backendProfile.student_id
          );
        const resumesResponse =
      await getStudentResumes(
        backendProfile.student_id
      );

      console.log(
      "STUDENT RESUMES FROM BACKEND:",
      resumesResponse
    );

    const latestResume =
      resumesResponse?.length > 0
        ? resumesResponse[0]
        : null;

    const resumeData = latestResume
      ? {
          uploadedResume: null,
          fileName:
            latestResume.resume_file_name,
          fileSize:
            (latestResume.file_size_kb ?? 0) *
            1024,
          uploadDate:
            latestResume.uploaded_at,
        }
      : {
          uploadedResume: null,
          fileName: "",
          fileSize: 0,
          uploadDate: "",
        };

        const onlinePresence =
          mapSocialLinksToOnlinePresence(
            socialLinksResponse
          );

        console.log(
          "BACKEND STUDENT PROFILE:",
          backendProfile
        );

        /*
         * ========================================================
         * MAP BRANCH + DEPARTMENT
         * ========================================================
         */

        const mappedProfile =
          mapBackendProfileToStudentProfile(
            backendProfile,
            authenticatedUser,
            EMPTY_PROFILE,
            branches
          );

        mappedProfile.technicalSkills =
          technicalSkills;

        mappedProfile.projects =
          projects;

        mappedProfile.certifications =
          certifications;

        mappedProfile.internships =
          internships;

        mappedProfile.achievements =
          achievements;

        mappedProfile.onlinePresence =
          onlinePresence;

        mappedProfile.resume = resumeData;

        

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

  const updatePlacementReadiness =
    useCallback(
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

  const updateOnlinePresence =
    useCallback(
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
    async (
      skill: Omit<TechnicalSkill, "id">
    ) => {
      if (!studentId) {
        throw new Error(
          "Student ID is not available"
        );
      }

      const backendSkill =
        await addStudentSkill(
          studentId,
          {
            skill_name: skill.name,
            proficiency_level:
              skill.proficiency,
            years_of_experience: 0,
          }
        );

      const newSkill: TechnicalSkill = {
        id: backendSkill.student_skill_id,
        name: backendSkill.skill_name,
        proficiency:
          backendSkill.proficiency_level,
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
    [studentId]
  );

  const updateSkillProficiency =
    useCallback(
      async (
        skillId: string,
        proficiency: TechnicalSkill["proficiency"]
      ) => {
        if (!studentId) {
          throw new Error(
            "Student ID is not available"
          );
        }

        const existingSkill =
          profile.technicalSkills.find(
            (skill) =>
              skill.id === skillId
          );

        if (!existingSkill) {
          throw new Error(
            "Skill not found"
          );
        }

        await updateStudentSkill(
          studentId,
          skillId,
          {
            skill_name:
              existingSkill.name,
            proficiency_level:
              proficiency,
          }
        );

        const updater = (
          prev: StudentProfile
        ): StudentProfile => ({
          ...prev,
          technicalSkills:
            prev.technicalSkills.map(
              (skill) =>
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
      [
        studentId,
        profile.technicalSkills,
      ]
    );

  const removeSkill = useCallback(
    async (skillId: string) => {
      if (!studentId) {
        throw new Error(
          "Student ID is not available"
        );
      }

      await deleteStudentSkill(
        studentId,
        skillId
      );

      const updater = (
        prev: StudentProfile
      ): StudentProfile => ({
        ...prev,
        technicalSkills:
          prev.technicalSkills.filter(
            (skill) =>
              skill.id !== skillId
          ),
      });

      setProfile(updater);
      setEditDraft(updater);
    },
    [studentId]
  );

  /* ============================================================
     PROJECTS
  ============================================================ */

  const addProject = useCallback(
    async (
      project: Omit<Project, "id">
    ) => {
      if (!studentId) return;

      const backendProject =
        await addStudentProject(
          studentId,
          mapProjectToBackend(project)
        );

      const newProject: Project = {
        id: backendProject.project_id,
        name:
          backendProject.title ?? "",
        description:
          backendProject.description ??
          "",
        techStack:
          project.techStack,
        githubUrl:
          backendProject.github_url ??
          "",
        liveUrl:
          backendProject.live_demo_url ??
          "",
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
    [studentId]
  );

  const updateProject = useCallback(
    async (
      projectId: string,
      updates: Partial<Project>
    ) => {
      if (!studentId) return;

      const backendUpdates: Record<
        string,
        unknown
      > = {};

      if (updates.name !== undefined) {
        backendUpdates.title =
          updates.name;
      }

      if (
        updates.description !==
        undefined
      ) {
        backendUpdates.description =
          updates.description;
      }

      if (
        updates.githubUrl !==
        undefined
      ) {
        backendUpdates.github_url =
          updates.githubUrl || null;
      }

      if (
        updates.liveUrl !== undefined
      ) {
        backendUpdates.live_demo_url =
          updates.liveUrl || null;
      }

      const backendProject =
        await updateStudentProject(
          studentId,
          projectId,
          backendUpdates
        );

      const updater = (
        prev: StudentProfile
      ): StudentProfile => ({
        ...prev,
        projects: prev.projects.map(
          (project) =>
            project.id === projectId
              ? {
                  ...project,
                  name:
                    backendProject.title ??
                    project.name,
                  description:
                    backendProject.description ??
                    project.description,
                  githubUrl:
                    backendProject.github_url ??
                    project.githubUrl,
                  liveUrl:
                    backendProject.live_demo_url ??
                    project.liveUrl,
                }
              : project
        ),
      });

      setProfile(updater);
      setEditDraft(updater);
    },
    [studentId]
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      if (!studentId) return;

      await deleteStudentProject(
        studentId,
        projectId
      );

      const updater = (
        prev: StudentProfile
      ): StudentProfile => ({
        ...prev,
        projects:
          prev.projects.filter(
            (project) =>
              project.id !== projectId
          ),
      });

      setProfile(updater);
      setEditDraft(updater);
    },
    [studentId]
  );

  /* ============================================================
     CERTIFICATIONS
  ============================================================ */

  const addCertification = useCallback(
    async (
      cert: Omit<Certification, "id">
    ) => {
      if (!studentId) {
        throw new Error(
          "Student ID is not available"
        );
      }

      const response =
        await addStudentCertification(
          studentId,
          {
            certificate_name: cert.name,
            issuing_organization:
              cert.organization,
            issue_date: cert.date
              ? `${cert.date}-01`
              : null,
            expiry_date: null,
            credential_url:
              cert.link || null,
          }
        );

      const newCert =
        mapCertificationFromBackend(
          response
        );

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
    [studentId]
  );

  const updateCertification =
    useCallback(
      async (
        certId: string,
        updates: Partial<Certification>
      ) => {
        if (!studentId) {
          throw new Error(
            "Student ID is not available"
          );
        }

        const backendUpdates: Record<
          string,
          unknown
        > = {};

        if (updates.name !== undefined) {
          backendUpdates.certificate_name =
            updates.name;
        }

        if (
          updates.organization !==
          undefined
        ) {
          backendUpdates.issuing_organization =
            updates.organization;
        }

        if (updates.date !== undefined) {
          backendUpdates.issue_date =
            updates.date
              ? `${updates.date}-01`
              : null;
        }

        if (updates.link !== undefined) {
          backendUpdates.credential_url =
            updates.link || null;
        }

        const response =
          await updateStudentCertification(
            studentId,
            certId,
            backendUpdates
          );

        const updatedCert =
          mapCertificationFromBackend(
            response
          );

        const updater = (
          prev: StudentProfile
        ): StudentProfile => ({
          ...prev,
          certifications:
            prev.certifications.map(
              (cert) =>
                cert.id === certId
                  ? updatedCert
                  : cert
            ),
        });

        setProfile(updater);
        setEditDraft(updater);
      },
      [studentId]
    );

  const deleteCertification =
    useCallback(
      async (certId: string) => {
        if (!studentId) {
          throw new Error(
            "Student ID is not available"
          );
        }

        await deleteStudentCertification(
          studentId,
          certId
        );

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
      [studentId]
    );

  /* ============================================================
     INTERNSHIPS
  ============================================================ */

  const addInternship = useCallback(
    async (
      internship: Omit<Internship, "id">
    ) => {
      if (!studentId) {
        throw new Error(
          "Student ID is not available"
        );
      }

      const duration =
        parseInternshipDuration(
          internship.duration
        );

      const response =
        await addStudentInternship(
          studentId,
          {
            company_name:
              internship.organization,
            role_title:
              internship.role || null,
            location: null,
            start_date:
              duration.start_date,
            end_date:
              duration.end_date,
            is_current:
              duration.is_current,
            description:
              internship.description ||
              null,
            certificate_url: null,
          }
        );

      const newInternship =
        mapInternshipFromBackend(
          response
        );

      setProfile((prev) => ({
        ...prev,
        internships: [
          ...prev.internships,
          newInternship,
        ],
      }));

      setEditDraft((prev) => ({
        ...prev,
        internships: [
          ...prev.internships,
          newInternship,
        ],
      }));
    },
    [studentId]
  );

  const updateInternship =
    useCallback(
      async (
        internId: string,
        updates: Partial<Internship>
      ) => {
        if (!studentId) {
          throw new Error(
            "Student ID is not available"
          );
        }

        const backendUpdates: Record<
          string,
          unknown
        > = {};

        if (
          updates.duration !==
          undefined
        ) {
          const duration =
            parseInternshipDuration(
              updates.duration
            );

          backendUpdates.start_date =
            duration.start_date;

          backendUpdates.end_date =
            duration.end_date;

          backendUpdates.is_current =
            duration.is_current;
        }

        if (
          updates.organization !==
          undefined
        ) {
          backendUpdates.company_name =
            updates.organization;
        }

        if (updates.role !== undefined) {
          backendUpdates.role_title =
            updates.role || null;
        }

        if (
          updates.description !==
          undefined
        ) {
          backendUpdates.description =
            updates.description || null;
        }

        const response =
          await updateStudentInternship(
            studentId,
            internId,
            backendUpdates
          );

        const updatedInternship =
          mapInternshipFromBackend(
            response
          );

        const updater = (
          prev: StudentProfile
        ): StudentProfile => ({
          ...prev,
          internships:
            prev.internships.map(
              (internship) =>
                internship.id === internId
                  ? {
                      ...internship,
                      ...updatedInternship,
                      duration:
                        internship.duration,
                    }
                  : internship
            ),
        });

        setProfile(updater);
        setEditDraft(updater);
      },
      [studentId]
    );

  const deleteInternship =
    useCallback(
      async (internId: string) => {
        if (!studentId) {
          throw new Error(
            "Student ID is not available"
          );
        }

        await deleteStudentInternship(
          studentId,
          internId
        );

        const updater = (
          prev: StudentProfile
        ): StudentProfile => ({
          ...prev,
          internships:
            prev.internships.filter(
              (internship) =>
                internship.id !==
                internId
            ),
        });

        setProfile(updater);
        setEditDraft(updater);
      },
      [studentId]
    );

  /* ============================================================
     ACHIEVEMENTS
  ============================================================ */

  const addAchievement = useCallback(
    async (
      achievement: Omit<Achievement, "id">
    ) => {
      if (!studentId) return;

      const response =
        await addStudentAchievement(
          studentId,
          {
            title: achievement.title,
            description:
              achievement.description ||
              null,
            achievement_date:
              achievement.date
                ? `${achievement.date}-01`
                : null,
          }
        );

      const newAchievement: Achievement =
        {
          id: response.achievement_id,
          title: response.title,
          description:
            response.description ?? "",
          date: response.achievement_date
            ? response.achievement_date.slice(
                0,
                7
              )
            : "",
        };

      setEditDraft((prev) => ({
        ...prev,
        achievements: [
          ...prev.achievements,
          newAchievement,
        ],
      }));
    },
    [studentId]
  );

  const updateAchievement =
    useCallback(
      async (
        achId: string,
        updates: Partial<Achievement>
      ) => {
        if (!studentId) return;

        const response =
          await updateStudentAchievement(
            studentId,
            achId,
            {
              title: updates.title,
              description:
                updates.description ||
                null,
              achievement_date:
                updates.date
                  ? `${updates.date}-01`
                  : null,
            }
          );

        const updatedAchievement: Achievement =
          {
            id: response.achievement_id,
            title: response.title,
            description:
              response.description ?? "",
            date: response.achievement_date
              ? response.achievement_date.slice(
                  0,
                  7
                )
              : "",
          };

        setEditDraft((prev) => ({
          ...prev,
          achievements:
            prev.achievements.map(
              (achievement) =>
                achievement.id === achId
                  ? updatedAchievement
                  : achievement
            ),
        }));
      },
      [studentId]
    );

  const deleteAchievement =
    useCallback(
      async (achId: string) => {
        if (!studentId) return;

        await deleteStudentAchievement(
          studentId,
          achId
        );

        setEditDraft((prev) => ({
          ...prev,
          achievements:
            prev.achievements.filter(
              (achievement) =>
                achievement.id !== achId
            ),
        }));
      },
      [studentId]
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
  async (file: File) => {
    if (!studentId) {
      throw new Error(
        "Student ID is not available"
      );
    }

    const response =
      await uploadStudentResume(
        studentId,
        file
      );

    const resumeData = {
      uploadedResume: file,
      fileName:
        response.resume_file_name ||
        file.name,
      fileSize:
        (response.file_size_kb ?? 0) * 1024,
      uploadDate:
        response.uploaded_at ||
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
  [studentId]
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
    try {
      setIsSaving(true);
      setError(null);

      const payload = {
        branch_id:
          editDraft.personalInfo.branchId ||
          undefined,

        date_of_birth:
          editDraft.personalInfo.dateOfBirth ||
          undefined,

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
          editDraft.personalInfo.fatherName ||
          undefined,

        mother_name:
          editDraft.personalInfo.motherName ||
          undefined,

        father_occupation:
          editDraft.personalInfo.fatherOccupation ||
          undefined,

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

        graduation_year:
          editDraft.academicInfo.academicYear !== ""
            ? Number(
                editDraft.academicInfo.academicYear
              )
            : undefined,

        ssc_percentage:
          editDraft.academicInfo.sscPercentage !== ""
            ? Number(
                editDraft.academicInfo.sscPercentage
              )
            : undefined,

        ssc_passing_year:
          editDraft.academicInfo.sscPassingYear !== ""
            ? Number(
                editDraft.academicInfo.sscPassingYear
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
          editDraft.academicInfo.btechAggregate !== ""
            ? Number(
                editDraft.academicInfo.btechAggregate
              )
            : undefined,

        cgpa:
          editDraft.academicInfo.cgpaCurrent !== ""
            ? Number(
                editDraft.academicInfo.cgpaCurrent
              )
            : undefined,

        active_backlogs:
          editDraft.academicInfo.hasLiveBacklogs ===
          "Yes"
            ? 1
            : editDraft.academicInfo.hasLiveBacklogs ===
                "No"
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
          editDraft.onlinePresence.linkedinUrl ||
          undefined,

        github_url:
          editDraft.onlinePresence.githubUrl ||
          undefined,

        portfolio_url:
          editDraft.onlinePresence.portfolioUrl ||
          undefined,
      };

      /* ========================================================
         CREATE OR UPDATE STUDENT PROFILE
      ======================================================== */

      let savedProfile: any;

      if (!studentId) {
        /*
         * FIRST TIME:
         * Student has no profile yet.
         *
         * POST /students/profile
         */
        console.log(
          "No student profile found. Creating profile..."
        );

        savedProfile =
          await createStudentProfile(payload);

        if (!savedProfile?.student_id) {
          throw new Error(
            "Student profile was created but student_id was not returned."
          );
        }

        setStudentId(
          savedProfile.student_id
        );

        console.log(
          "Student profile created successfully:",
          savedProfile.student_id
        );
      } else {
        /*
         * EXISTING PROFILE:
         * Update the existing profile.
         *
         * PUT /students/profile/{student_id}
         */
        console.log(
          "Existing student profile found. Updating profile..."
        );

        savedProfile =
          await updateStudentProfile(
            studentId,
            payload
          );

        console.log(
          "Student profile updated successfully"
        );
      }

      /* ========================================================
         SAVE SOCIAL LINKS
      ======================================================== */

      const currentStudentId =
        savedProfile.student_id ||
        studentId;

      await saveSocialLinks(
        currentStudentId,
        editDraft.onlinePresence
      );

      /* ========================================================
         LOAD BRANCH MASTER DATA AGAIN
      ======================================================== */

      const branchesResponse =
        await getBranches();

      const branches =
        branchesResponse as BackendBranch[];

      /* ========================================================
         MAP BACKEND PROFILE → FRONTEND PROFILE
      ======================================================== */

      const mappedProfile =
        mapBackendProfileToStudentProfile(
          savedProfile,
          {
            email:
              savedProfile.email ||
              user?.email,

            phone:
              savedProfile.phone ||
              user?.phone,
          },
          profile,
          branches
        );

      setProfile(mappedProfile);

      setEditDraft(
        structuredClone(mappedProfile)
      );

      console.log(
        "Student profile saved successfully"
      );
    } catch (err) {
      console.error(
        "Failed to save student profile:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save student profile"
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

      return new Promise(
        (resolve) => {
          setTimeout(() => {
            setIsLoading(false);
            resolve();
          }, ms);
        }
      );
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
      isLoading || authLoading,

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