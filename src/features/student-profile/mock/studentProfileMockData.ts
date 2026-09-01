/**
 * studentProfileMockData.ts
 * Complete mock data object populated with realistic sample data
 * for every single field specified in Section 6 of the PRD.
 */

import type { StudentProfile } from '@/types/student-profile';

// ─── 6.1 Personal Information ─────────────────────────────────────────────
const personalInfo: StudentProfile['personalInfo'] = {
  fullName: 'Arjun Rajesh Patil',
  profilePhoto: null,
  dateOfBirth: '2003-07-15',
  gender: 'Male',
  phone: '9876543210',
  altPhone: '9123456780',
  email: 'arjun.patil@acet.edu.in',
  altEmail: 'arjunpatil2003@gmail.com',
  permanentAddress: '42, Shivaji Nagar, Near City Bus Stand,\nAurangabad, Maharashtra — 431001',
  presentAddress: 'Room 12, Boys Hostel-B,\nAnjuman College Campus, Aurangabad — 431001',
  fatherName: 'Rajesh Baburao Patil',
  motherName: 'Sunita Rajesh Patil',
  fatherOccupation: 'Government School Teacher',
  annualFamilyIncome: '3-5 Lakhs',
  religion: 'Hindu',
  category: 'OBC',
  panNumber: 'ABCDE1234F',
  aadhaarNumber: '234567891012',
  abcId: 'ABC-2023-00456',
  branch: 'Computer Science Engineering',
};

// ─── 6.2 Academic Information ─────────────────────────────────────────────
const academicInfo: StudentProfile['academicInfo'] = {
  universityEnrollmentNo: 'BATU2022CSE0451',
  college: 'Anjuman College of Engineering & Technology',
  department: 'Computer Science Engineering',
  degree: 'B.Tech',
  academicYear: '3rd Year',
  sscPercentage: 92.4,
  sscPassingYear: 2019,
  hscDiplomaPercentage: 88.6,
  hscDiplomaPassingYear: 2021,
  btechAggregate: 78.32,
  cgpaCurrent: 8.42,
  hasLiveBacklogs: 'No',
  backlogDetails: '',
};

// ─── 6.3 Placement Readiness ──────────────────────────────────────────────
const placementReadiness: StudentProfile['placementReadiness'] = {
  interestedInTpActivities: 'Yes',
  interestedInCollegePlacement: 'Yes',
  areaOfInterestAfterGraduation: 'Placement through College',
  preparedForAptitude: 'Yes',
  aptitudeTrainingDetails: 'Completed Aptitude Training via Career Launcher (6-month program)',
  softwareLanguagesKnown: 'JavaScript, Python, Java, C++, SQL, HTML/CSS, TypeScript',
  englishCommunicationRating: 4,
  readyToRelocate: 'Yes',
};

// ─── 6.4 Professional Information ─────────────────────────────────────────
const technicalSkills: StudentProfile['technicalSkills'] = [
  { id: 'sk-1', name: 'React.js', proficiency: 'Advanced' },
  { id: 'sk-2', name: 'Node.js', proficiency: 'Intermediate' },
  { id: 'sk-3', name: 'Python', proficiency: 'Advanced' },
  { id: 'sk-4', name: 'MongoDB', proficiency: 'Intermediate' },
  { id: 'sk-5', name: 'SQL', proficiency: 'Advanced' },
  { id: 'sk-6', name: 'Docker', proficiency: 'Beginner' },
  { id: 'sk-7', name: 'Git', proficiency: 'Advanced' },
  { id: 'sk-8', name: 'TypeScript', proficiency: 'Intermediate' },
];

const softSkills: string[] = ['Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Time Management'];

const certifications: StudentProfile['certifications'] = [
  {
    id: 'cert-1',
    name: 'AWS Cloud Practitioner',
    organization: 'Amazon Web Services',
    date: '2025-03',
    link: 'https://www.credly.com/badges/aws-cloud-practitioner-arjun',
  },
  {
    id: 'cert-2',
    name: 'Google Data Analytics Professional Certificate',
    organization: 'Google / Coursera',
    date: '2025-06',
    link: 'https://coursera.org/verify/professional-cert/GDATA123',
  },
  {
    id: 'cert-3',
    name: 'Meta Front-End Developer',
    organization: 'Meta / Coursera',
    date: '2024-12',
    link: 'https://coursera.org/verify/professional-cert/METAFE456',
  },
];

const internships: StudentProfile['internships'] = [
  {
    id: 'intern-1',
    organization: 'TCS Digital',
    role: 'Full Stack Intern',
    duration: 'Jun 2025 – Aug 2025',
    description:
      'Developed a real-time inventory management dashboard using React and Node.js. Integrated REST APIs with PostgreSQL backend and deployed on AWS EC2.',
  },
  {
    id: 'intern-2',
    organization: 'CDAC Pune',
    role: 'Machine Learning Intern',
    duration: 'Jan 2025 – Mar 2025',
    description:
      'Built a sentiment analysis pipeline for customer feedback data using Python, NLTK, and scikit-learn. Achieved 89% accuracy on validation set.',
  },
];

const projects: StudentProfile['projects'] = [
  {
    id: 'proj-1',
    name: 'CampusConnect Platform',
    description:
      'An integrated college placement management platform with AI-driven resume analysis, eligibility engine, and mock interview simulator.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'TailwindCSS'],
    githubUrl: 'https://github.com/arjunpatil/campusconnect',
    liveUrl: 'https://campusconnect-demo.vercel.app',
  },
  {
    id: 'proj-2',
    name: 'Smart Attendance System',
    description:
      'Face recognition-based attendance system using OpenCV and deep learning. Captures attendance via webcam and generates automated reports.',
    techStack: ['Python', 'OpenCV', 'TensorFlow', 'Flask', 'SQLite'],
    githubUrl: 'https://github.com/arjunpatil/smart-attendance',
    liveUrl: '',
  },
  {
    id: 'proj-3',
    name: 'Budget Tracker PWA',
    description:
      'Progressive web app for personal finance tracking with offline support, visual charts, and monthly budget goals.',
    techStack: ['React', 'Chart.js', 'IndexedDB', 'Service Workers'],
    githubUrl: 'https://github.com/arjunpatil/budget-tracker',
    liveUrl: 'https://budget-tracker-pwa.netlify.app',
  },
];

const achievements: StudentProfile['achievements'] = [
  {
    id: 'ach-1',
    title: 'Smart India Hackathon 2025 — National Finalist',
    description: 'Led a 6-member team to the national finals of SIH 2025 for the problem statement on AI-driven placement analytics.',
    date: '2025-08',
  },
  {
    id: 'ach-2',
    title: 'LeetCode 300+ Problems Solved',
    description: 'Solved 300+ problems on LeetCode with a contest rating of 1750+.',
    date: '2025-07',
  },
  {
    id: 'ach-3',
    title: 'University Topper — 4th Semester',
    description: 'Secured 1st rank in Computer Science Engineering department with 9.2 SGPA in the 4th semester.',
    date: '2024-06',
  },
];

// ─── 6.5 Online Presence ──────────────────────────────────────────────────
const onlinePresence: StudentProfile['onlinePresence'] = {
  githubUrl: 'https://github.com/arjunpatil',
  linkedinUrl: 'https://linkedin.com/in/arjunpatil',
  portfolioUrl: 'https://arjunpatil.dev',
  codingProfileUrl: 'https://leetcode.com/arjunpatil',
};

// ─── 6.6 Resume ───────────────────────────────────────────────────────────
const resume: StudentProfile['resume'] = {
  uploadedResume: null,
  fileName: '',
  fileSize: 0,
  uploadDate: '',
};

// ─── Complete Default Profile ─────────────────────────────────────────────
export const defaultMockProfile: StudentProfile = {
  personalInfo,
  academicInfo,
  placementReadiness,
  technicalSkills,
  softSkills,
  certifications,
  internships,
  projects,
  achievements,
  onlinePresence,
  resume,
};

// ─── Empty Profile (for testing empty states) ─────────────────────────────
export const emptyMockProfile: StudentProfile = {
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
    degree: 'B.Tech',
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

export default defaultMockProfile;
