/**
 * student-profile.ts
 * TypeScript interfaces for all data models in the Student Profile Builder.
 * Maps 1:1 with the frozen v1.0 database schema (Section 6 of PRD).
 */

// ─── 6.1 Personal Information ─────────────────────────────────────────────
export interface PersonalInfo {
  // 6.1.1 Core Identity
  fullName: string;
  profilePhoto: File | null;
  dateOfBirth: string;
  gender: string;
  phone: string;
  altPhone: string;
  email: string;
  altEmail: string;
  permanentAddress: string;
  presentAddress: string;

  // 6.1.2 Family & Identity Details
  fatherName: string;
  motherName: string;
  fatherOccupation: string;
  annualFamilyIncome: string;
  religion: string;
  category: string;

  // 6.1.3 Government / Institutional IDs
  panNumber: string;
  aadhaarNumber: string;
  abcId: string;

  // 6.1.4 Academic Placement (Branch)
  branch: string;
}

// ─── 6.2 Academic Information ─────────────────────────────────────────────
export interface AcademicInfo {
  // 6.2.1 Enrollment
  universityEnrollmentNo: string;
  college: string;
  department: string;
  degree: string;
  academicYear: string;

  // 6.2.2 Schooling & Aggregate
  sscPercentage: number | string;
  sscPassingYear: number | string;
  hscDiplomaPercentage: number | string;
  hscDiplomaPassingYear: number | string;
  btechAggregate: number | string;
  cgpaCurrent: number | string;

  // 6.2.3 Backlogs
  hasLiveBacklogs: string;
  backlogDetails: string;
}

// ─── 6.3 Placement Readiness ──────────────────────────────────────────────
export interface PlacementReadiness {
  interestedInTpActivities: string;
  interestedInCollegePlacement: string;
  areaOfInterestAfterGraduation: string;
  preparedForAptitude: string;
  aptitudeTrainingDetails: string;
  softwareLanguagesKnown: string;
  englishCommunicationRating: number;
  readyToRelocate: string;
}

// ─── 6.4 Professional Information ─────────────────────────────────────────
export interface TechnicalSkill {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  date: string;
  link: string;
}

export interface Internship {
  id: string;
  organization: string;
  role: string;
  duration: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

// ─── 6.5 Online Presence ──────────────────────────────────────────────────
export interface OnlinePresence {
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  codingProfileUrl: string;
}

// ─── 6.6 Resume ───────────────────────────────────────────────────────────
export interface Resume {
  uploadedResume: File | null;
  fileName: string;
  fileSize: number;
  uploadDate: string;
}

// ─── Complete Student Profile ─────────────────────────────────────────────
export interface StudentProfile {
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo;
  placementReadiness: PlacementReadiness;
  technicalSkills: TechnicalSkill[];
  softSkills: string[];
  certifications: Certification[];
  internships: Internship[];
  projects: Project[];
  achievements: Achievement[];
  onlinePresence: OnlinePresence;
  resume: Resume;
}
