import {
  ApplicationRecord,
  EligibilityResult,
  PlacementDrive,
  StudentProfile
} from "@/types/placement";

export const studentProfile: StudentProfile = {
  id: "student_001",
  name: "Aafreen Khan",
  degree: "B.Tech",
  branch: "Artificial Intelligence & Data Science",
  year: "Final Year",
  cgpa: 8.3,
  backlogs: 0,
  skills: ["Python", "SQL", "React", "Git", "REST API", "Docker"],
  certifications: ["NPTEL Data Structures", "AWS Cloud Practitioner"],
  resumeName: "Aafreen_Khan_Resume.pdf"
};

export const placementDrives: PlacementDrive[] = [
  {
    id: "drive_google_sde",
    companyId: "company_google",
    companyName: "Google",
    companyLogo: "G",
    companyIndustry: "Technology",
    companyDescription:
      "Build products used by billions of people and contribute to the infrastructure that powers modern digital experiences.",
    companyWebsite: "https://www.google.com",
    title: "Software Engineer",
    description:
      "Join the product engineering team to design scalable services, build polished user experiences, and collaborate across product, design, and infrastructure teams.",
    responsibilities: [
      "Design and build front-end and back-end product experiences.",
      "Collaborate with cross-functional teams to ship high-impact features.",
      "Write reliable, well-tested, and maintainable production code."
    ],
    requiredSkills: ["Python", "SQL", "React", "Git", "REST API"],
    preferredSkills: ["Docker", "System Design", "Testing"],
    location: "Bengaluru, Karnataka",
    city: "Bengaluru",
    jobType: "FULL_TIME",
    workMode: "HYBRID",
    ctc: "₹18 LPA",
    openings: 12,
    driveDate: "2026-08-30T09:00:00.000Z",
    applicationDeadline: "2026-08-28T23:59:59.000Z",
    status: "PUBLISHED",
    selectionProcess: [
      { name: "Application", description: "Submit your application and resume.", status: "COMPLETED" },
      { name: "Eligibility Verification", description: "Backend validates profile and eligibility.", status: "COMPLETED" },
      { name: "Online Assessment", description: "Timed coding and problem-solving assessment.", status: "CURRENT", expectedDate: "2026-08-31T10:00:00.000Z" },
      { name: "Technical Interview", description: "Problem solving and project discussion.", status: "UPCOMING", expectedDate: "2026-09-03T11:00:00.000Z" },
      { name: "HR Interview", description: "Culture and compensation discussion.", status: "UPCOMING" },
      { name: "Final Selection", description: "Final hiring outcome from the company.", status: "UPCOMING" }
    ],
    requirements: [
      { id: "google_cgpa", requirementType: "CGPA", requirementName: "CGPA", operator: ">=", requiredValue: "7.5", isMandatory: true },
      { id: "google_backlog", requirementType: "BACKLOG", requirementName: "Backlogs", operator: "=", requiredValue: "0", isMandatory: true },
      { id: "google_degree", requirementType: "DEGREE", requirementName: "Degree", operator: "=", requiredValue: "B.Tech", isMandatory: true },
      { id: "google_branch", requirementType: "BRANCH", requirementName: "Branch", operator: "contains", requiredValue: "AI & DS / CSE / IT", isMandatory: true },
      { id: "google_python", requirementType: "SKILL", requirementName: "Python", operator: "required", requiredValue: "Intermediate", isMandatory: true },
      { id: "google_react", requirementType: "SKILL", requirementName: "React", operator: "required", requiredValue: "Intermediate", isMandatory: true },
      { id: "google_sql", requirementType: "SKILL", requirementName: "SQL", operator: "required", requiredValue: "Intermediate", isMandatory: true },
      { id: "google_docker", requirementType: "SKILL", requirementName: "Docker", operator: "preferred", requiredValue: "Basic", isMandatory: false }
    ]
  },
  {
    id: "drive_datascope_analyst",
    companyId: "company_datascope",
    companyName: "DataScope",
    companyLogo: "D",
    companyIndustry: "Analytics",
    companyDescription:
      "A fast-growing analytics company helping enterprises make data-driven decisions with modern dashboards and data products.",
    companyWebsite: "https://example.com",
    title: "Data Analyst",
    description:
      "Work on dashboards, reporting pipelines, and business intelligence products that power daily decisions for clients.",
    responsibilities: [
      "Analyze business datasets and create actionable dashboards.",
      "Collaborate with stakeholders to define metrics and reporting needs.",
      "Maintain reporting accuracy and data quality."
    ],
    requiredSkills: ["SQL", "Excel", "Python"],
    preferredSkills: ["React", "Power BI", "Statistics"],
    location: "Remote",
    city: "Remote",
    jobType: "FULL_TIME",
    workMode: "REMOTE",
    ctc: "₹10 LPA",
    openings: 8,
    driveDate: "2026-09-01T10:30:00.000Z",
    applicationDeadline: "2026-09-01T23:59:59.000Z",
    status: "PUBLISHED",
    selectionProcess: [
      { name: "Application", description: "Initial application screening.", status: "COMPLETED" },
      { name: "Assessment", description: "Data and SQL assessment.", status: "CURRENT", expectedDate: "2026-09-02T10:00:00.000Z" },
      { name: "Interview", description: "Business and technical interview.", status: "UPCOMING" },
      { name: "Offer", description: "Final result shared through the portal.", status: "UPCOMING" }
    ],
    requirements: [
      { id: "datascope_cgpa", requirementType: "CGPA", requirementName: "CGPA", operator: ">=", requiredValue: "7.0", isMandatory: true },
      { id: "datascope_backlog", requirementType: "BACKLOG", requirementName: "Backlogs", operator: "=", requiredValue: "0", isMandatory: true },
      { id: "datascope_degree", requirementType: "DEGREE", requirementName: "Degree", operator: "=", requiredValue: "B.Tech / B.E.", isMandatory: true },
      { id: "datascope_sql", requirementType: "SKILL", requirementName: "SQL", operator: "required", requiredValue: "Advanced", isMandatory: true },
      { id: "datascope_python", requirementType: "SKILL", requirementName: "Python", operator: "required", requiredValue: "Intermediate", isMandatory: true },
      { id: "datascope_react", requirementType: "SKILL", requirementName: "React", operator: "preferred", requiredValue: "Basic", isMandatory: false },
      { id: "datascope_docker", requirementType: "SKILL", requirementName: "Docker", operator: "preferred", requiredValue: "Basic", isMandatory: false }
    ]
  },
  {
    id: "drive_tcs_fullstack",
    companyId: "company_tcs",
    companyName: "TCS",
    companyLogo: "T",
    companyIndustry: "IT Services",
    companyDescription:
      "A large-scale services organization with broad technology projects spanning product engineering, data, and infrastructure.",
    companyWebsite: "https://www.tcs.com",
    title: "Full Stack Developer",
    description:
      "Create and maintain enterprise applications across modern web stacks and help deliver software at scale.",
    responsibilities: [
      "Build internal and customer-facing web applications.",
      "Support sprint planning, code reviews, and production issue resolution.",
      "Work with analysts and backend teams to ship features."
    ],
    requiredSkills: ["JavaScript", "React", "Node.js", "SQL"],
    preferredSkills: ["Docker", "Testing", "CI/CD"],
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    jobType: "FULL_TIME",
    workMode: "ON_SITE",
    ctc: "₹7.2 LPA",
    openings: 20,
    driveDate: "2026-08-20T10:00:00.000Z",
    applicationDeadline: "2026-08-20T23:59:59.000Z",
    status: "REGISTRATION_CLOSED",
    selectionProcess: [
      { name: "Application", description: "Application is now closed.", status: "COMPLETED" },
      { name: "Assessment", description: "Entrance test and coding round.", status: "UPCOMING" },
      { name: "Technical Interview", description: "Role and project discussion.", status: "UPCOMING" },
      { name: "HR Interview", description: "Final conversation with the panel.", status: "UPCOMING" }
    ],
    requirements: [
      { id: "tcs_cgpa", requirementType: "CGPA", requirementName: "CGPA", operator: ">=", requiredValue: "8.5", isMandatory: true },
      { id: "tcs_backlog", requirementType: "BACKLOG", requirementName: "Backlogs", operator: "=", requiredValue: "0", isMandatory: true },
      { id: "tcs_branch", requirementType: "BRANCH", requirementName: "Branch", operator: "contains", requiredValue: "CSE / IT / AI & DS", isMandatory: true },
      { id: "tcs_react", requirementType: "SKILL", requirementName: "React", operator: "required", requiredValue: "Intermediate", isMandatory: true },
      { id: "tcs_node", requirementType: "SKILL", requirementName: "Node.js", operator: "required", requiredValue: "Intermediate", isMandatory: true }
    ]
  },
  {
    id: "drive_strideai_ml",
    companyId: "company_strideai",
    companyName: "StrideAI",
    companyLogo: "S",
    companyIndustry: "AI Platform",
    companyDescription:
      "An AI product company building workflow automation and machine learning tooling for global teams.",
    companyWebsite: "https://example.org",
    title: "ML Engineer",
    description:
      "Work on applied machine learning systems, evaluation tooling, and production deployments for customer workflows.",
    responsibilities: [
      "Build model training and inference workflows.",
      "Collaborate on evaluation, experiments, and quality analysis.",
      "Deploy models safely into production environments."
    ],
    requiredSkills: ["Python", "SQL", "Machine Learning", "Git"],
    preferredSkills: ["Docker", "React", "Experiment Tracking"],
    location: "Hybrid - Hyderabad, Telangana",
    city: "Hyderabad",
    jobType: "FULL_TIME",
    workMode: "HYBRID",
    ctc: "₹16 LPA",
    openings: 6,
    driveDate: "2026-09-03T09:30:00.000Z",
    applicationDeadline: "2026-09-03T23:59:59.000Z",
    status: "PUBLISHED",
    selectionProcess: [
      { name: "Application", description: "Submit application and resume.", status: "COMPLETED" },
      { name: "Eligibility Verification", description: "Eligibility checked by backend.", status: "COMPLETED" },
      { name: "Take-home Challenge", description: "Applied ML task and review.", status: "CURRENT", expectedDate: "2026-09-04T10:00:00.000Z" },
      { name: "Technical Interview", description: "Modeling and deployment discussion.", status: "UPCOMING" },
      { name: "Final Decision", description: "Offer decision is shared here.", status: "UPCOMING" }
    ],
    requirements: [
      { id: "strideai_cgpa", requirementType: "CGPA", requirementName: "CGPA", operator: ">=", requiredValue: "7.5", isMandatory: true },
      { id: "strideai_backlog", requirementType: "BACKLOG", requirementName: "Backlogs", operator: "=", requiredValue: "0", isMandatory: true },
      { id: "strideai_branch", requirementType: "BRANCH", requirementName: "Branch", operator: "contains", requiredValue: "AI & DS / CSE / IT", isMandatory: true },
      { id: "strideai_python", requirementType: "SKILL", requirementName: "Python", operator: "required", requiredValue: "Advanced", isMandatory: true },
      { id: "strideai_ml", requirementType: "SKILL", requirementName: "Machine Learning", operator: "required", requiredValue: "Intermediate", isMandatory: true },
      { id: "strideai_docker", requirementType: "SKILL", requirementName: "Docker", operator: "preferred", requiredValue: "Basic", isMandatory: false }
    ]
  }
];

export const eligibilityByDrive: Record<string, EligibilityResult> = {
  drive_google_sde: {
    driveId: "drive_google_sde",
    status: "ELIGIBLE",
    score: 82,
    summary: "You meet the mandatory academic requirements and most core skills for this drive.",
    missingRequirements: ["Docker"],
    guidance: ["Add Docker to your resume if you have worked with containerized projects.", "Keep your profile and resume updated before the deadline."],
    requirements: [
      { name: "CGPA", required: ">= 7.5", actual: 8.3, status: "PASSED" },
      { name: "Backlogs", required: "= 0", actual: 0, status: "PASSED" },
      { name: "Degree", required: "B.Tech", actual: "B.Tech", status: "PASSED" },
      { name: "Branch", required: "AI & DS / CSE / IT", actual: "Artificial Intelligence & Data Science", status: "PASSED" },
      { name: "Python", required: "Intermediate", actual: "Advanced", status: "PASSED" },
      { name: "React", required: "Intermediate", actual: "Intermediate", status: "PASSED" },
      { name: "SQL", required: "Intermediate", actual: "Advanced", status: "PASSED" },
      { name: "Docker", required: "Basic", actual: "Not detected", status: "PARTIAL", note: "Helpful but not mandatory for this drive." }
    ]
  },
  drive_datascope_analyst: {
    driveId: "drive_datascope_analyst",
    status: "PARTIALLY_ELIGIBLE",
    score: 68,
    summary: "You are close to the requirement set, but one required skill is not fully satisfied.",
    missingRequirements: ["React"],
    guidance: ["Refresh React fundamentals if you want to broaden your frontend readiness.", "Consider highlighting SQL dashboards and Python analytics work."],
    requirements: [
      { name: "CGPA", required: ">= 7.0", actual: 8.3, status: "PASSED" },
      { name: "Backlogs", required: "= 0", actual: 0, status: "PASSED" },
      { name: "Degree", required: "B.Tech / B.E.", actual: "B.Tech", status: "PASSED" },
      { name: "SQL", required: "Advanced", actual: "Advanced", status: "PASSED" },
      { name: "Python", required: "Intermediate", actual: "Advanced", status: "PASSED" },
      { name: "React", required: "Basic", actual: "Not detected", status: "FAILED", note: "Optional for the role but used to improve your match score." },
      { name: "Docker", required: "Basic", actual: "Not detected", status: "OPTIONAL", note: "Optional." }
    ]
  },
  drive_tcs_fullstack: {
    driveId: "drive_tcs_fullstack",
    status: "NOT_ELIGIBLE",
    score: 42,
    summary: "This drive is currently closed, and the academic threshold is above your present CGPA.",
    missingRequirements: ["CGPA", "React", "Node.js"],
    guidance: ["Improve your CGPA target for the next recruitment cycle.", "Strengthen React and Node.js skills before applying to similar roles."],
    requirements: [
      { name: "CGPA", required: ">= 8.5", actual: 8.3, status: "FAILED", note: "The minimum CGPA for this drive is not satisfied." },
      { name: "Backlogs", required: "= 0", actual: 0, status: "PASSED" },
      { name: "Branch", required: "CSE / IT / AI & DS", actual: "Artificial Intelligence & Data Science", status: "PASSED" },
      { name: "React", required: "Intermediate", actual: "Intermediate", status: "PASSED" },
      { name: "Node.js", required: "Intermediate", actual: "Basic", status: "PARTIAL", note: "Needs more practice." }
    ]
  },
  drive_strideai_ml: {
    driveId: "drive_strideai_ml",
    status: "ELIGIBLE",
    score: 88,
    summary: "Your profile is a strong fit for this ML-focused role.",
    missingRequirements: [],
    guidance: ["Highlight your machine learning projects and deployments.", "Prepare for model evaluation and applied system design questions."],
    requirements: [
      { name: "CGPA", required: ">= 7.5", actual: 8.3, status: "PASSED" },
      { name: "Backlogs", required: "= 0", actual: 0, status: "PASSED" },
      { name: "Branch", required: "AI & DS / CSE / IT", actual: "Artificial Intelligence & Data Science", status: "PASSED" },
      { name: "Python", required: "Advanced", actual: "Advanced", status: "PASSED" },
      { name: "Machine Learning", required: "Intermediate", actual: "Intermediate", status: "PASSED" },
      { name: "Docker", required: "Basic", actual: "Basic", status: "PASSED" }
    ]
  }
};

export const applications: ApplicationRecord[] = [
  {
    id: "app_google_00142",
    applicationId: "APP-2026-00142",
    driveId: "drive_google_sde",
    companyName: "Google",
    companyLogo: "G",
    role: "Software Engineer",
    appliedAt: "2026-08-26T08:15:00.000Z",
    status: "SHORTLISTED",
    nextStep: "Online Assessment",
    nextStepDate: "2026-08-31T10:00:00.000Z",
    resumeName: "Aafreen_Khan_Resume.pdf",
    timeline: [
      { stage: "APPLIED", label: "Applied", status: "COMPLETED", description: "Your application was submitted successfully.", date: "2026-08-26T08:15:00.000Z" },
      { stage: "ELIGIBILITY_VERIFIED", label: "Eligibility Verified", status: "COMPLETED", description: "Your profile met the mandatory requirements.", date: "2026-08-26T12:10:00.000Z" },
      { stage: "SHORTLISTED", label: "Shortlisted", status: "COMPLETED", description: "The recruiter shortlisted your profile for the assessment.", date: "2026-08-27T09:30:00.000Z" },
      { stage: "ASSESSMENT", label: "Assessment", status: "CURRENT", description: "The next step is an online assessment.", date: "2026-08-31T10:00:00.000Z", actionLabel: "View Details", actionHref: "/student/placement-drives/drive_google_sde" },
      { stage: "TECHNICAL_INTERVIEW", label: "Technical Interview", status: "UPCOMING", description: "This stage will unlock after assessment." },
      { stage: "HR_INTERVIEW", label: "HR Interview", status: "UPCOMING", description: "This stage will unlock after the technical round." },
      { stage: "SELECTED", label: "Selected", status: "UPCOMING", description: "Final hiring decision." }
    ]
  },
  {
    id: "app_datascope_00096",
    applicationId: "APP-2026-00096",
    driveId: "drive_datascope_analyst",
    companyName: "DataScope",
    companyLogo: "D",
    role: "Data Analyst",
    appliedAt: "2026-08-24T10:20:00.000Z",
    status: "ELIGIBILITY_VERIFIED",
    nextStep: "Assessment",
    nextStepDate: "2026-09-02T10:00:00.000Z",
    resumeName: "Aafreen_Khan_Resume.pdf",
    timeline: [
      { stage: "APPLIED", label: "Applied", status: "COMPLETED", description: "Application submitted.", date: "2026-08-24T10:20:00.000Z" },
      { stage: "ELIGIBILITY_VERIFIED", label: "Eligibility Verified", status: "CURRENT", description: "Profile and documents are under review.", date: "2026-08-24T15:40:00.000Z", actionLabel: "View Drive", actionHref: "/student/placement-drives/drive_datascope_analyst" },
      { stage: "SHORTLISTED", label: "Shortlisted", status: "UPCOMING", description: "The recruiter will shortlist profiles next." },
      { stage: "ASSESSMENT", label: "Assessment", status: "UPCOMING", description: "Assessment link appears here when scheduled." },
      { stage: "TECHNICAL_INTERVIEW", label: "Technical Interview", status: "UPCOMING", description: "Technical interview stage." },
      { stage: "HR_INTERVIEW", label: "HR Interview", status: "UPCOMING", description: "HR interview stage." },
      { stage: "SELECTED", label: "Selected", status: "UPCOMING", description: "Final hiring outcome." }
    ]
  },
  {
    id: "app_strideai_00117",
    applicationId: "APP-2026-00117",
    driveId: "drive_strideai_ml",
    companyName: "StrideAI",
    companyLogo: "S",
    role: "ML Engineer",
    appliedAt: "2026-08-22T11:45:00.000Z",
    status: "ASSESSMENT",
    nextStep: "Take-home Challenge",
    nextStepDate: "2026-09-04T10:00:00.000Z",
    resumeName: "Aafreen_Khan_Resume.pdf",
    timeline: [
      { stage: "APPLIED", label: "Applied", status: "COMPLETED", description: "Your application has been received.", date: "2026-08-22T11:45:00.000Z" },
      { stage: "ELIGIBILITY_VERIFIED", label: "Eligibility Verified", status: "COMPLETED", description: "The backend marked you as eligible.", date: "2026-08-22T13:00:00.000Z" },
      { stage: "SHORTLISTED", label: "Shortlisted", status: "COMPLETED", description: "You were shortlisted for the next round.", date: "2026-08-23T08:30:00.000Z" },
      { stage: "ASSESSMENT", label: "Assessment", status: "CURRENT", description: "Take-home challenge is active now.", date: "2026-09-04T10:00:00.000Z", actionLabel: "View Challenge", actionHref: "/student/placement-drives/drive_strideai_ml" },
      { stage: "TECHNICAL_INTERVIEW", label: "Technical Interview", status: "UPCOMING", description: "Interview will be scheduled after the challenge." },
      { stage: "HR_INTERVIEW", label: "HR Interview", status: "UPCOMING", description: "HR interview will unlock later." },
      { stage: "SELECTED", label: "Selected", status: "UPCOMING", description: "Final decision." }
    ]
  }
];
