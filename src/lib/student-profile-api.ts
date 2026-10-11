import { getStoredToken } from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  /*
   * IMPORTANT:
   * Use the same authentication storage helper
   * used by AuthContext.
   *
   * This correctly supports both:
   * - localStorage  → Remember Me = true
   * - sessionStorage → Remember Me = false
   */
  const token =
  localStorage.getItem("accessToken") ||
  sessionStorage.getItem("accessToken");

  console.log("API URL:", `${API_URL}${endpoint}`);
console.log("Request options:", options);

const response = await fetch(`${API_URL}${endpoint}`, {
  ...options,
  headers: {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  },
});

console.log("Response status:", response.status);

  if (!response.ok) {
  const error = await response.json().catch(() => ({}));

  const detail = error?.detail;

  let message = `Request failed: ${response.status}`;

  if (typeof detail === "string") {
    message = detail;
  } else if (Array.isArray(detail)) {
    message = detail
      .map((item) => item?.msg || JSON.stringify(item))
      .join(", ");
  } else if (detail && typeof detail === "object") {
    message = JSON.stringify(detail);
  }

  throw new Error(message);
}

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/* ============================================================
   PROFILE
============================================================ */


export function createStudentProfile(
  data: unknown
) {
  return apiRequest(
    "/students/profile",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
export function getStudentProfile(
  studentId: string
) {
  return apiRequest(
    `/students/profile/${studentId}`
  );
}

export function getStudentProfileByUserId(
  userId: string
) {
  return apiRequest(
    `/students/profile/user/${userId}`
  );
}

export function updateStudentProfile(
  studentId: string,
  data: unknown
) {
  return apiRequest(
    `/students/profile/${studentId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

/* ============================================================
   MASTER DATA
============================================================ */

export function getMasterBranches() {
  return apiRequest("/master-data/branches");
}

/* ============================================================
   SKILLS
============================================================ */

export function getStudentSkills(
  studentId: string
) {
  return apiRequest(
    `/students/${studentId}/skills`
  );
}

export function addStudentSkill(
  studentId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/skills`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function updateStudentSkill(
  studentId: string,
  skillId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/skills/${skillId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export function deleteStudentSkill(
  studentId: string,
  skillId: string
) {
  return apiRequest(
    `/students/${studentId}/skills/${skillId}`,
    {
      method: "DELETE",
    }
  );
}

/* ============================================================
   PROJECTS
============================================================ */

export function getStudentProjects(
  studentId: string
) {
  return apiRequest(
    `/students/${studentId}/projects`
  );
}

export function addStudentProject(
  studentId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/projects`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function updateStudentProject(
  studentId: string,
  projectId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/projects/${projectId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export function deleteStudentProject(
  studentId: string,
  projectId: string
) {
  return apiRequest(
    `/students/${studentId}/projects/${projectId}`,
    {
      method: "DELETE",
    }
  );
}

/* ============================================================
   CERTIFICATIONS
============================================================ */

export function getStudentCertifications(
  studentId: string
) {
  return apiRequest(
    `/students/${studentId}/certifications`
  );
}

export function addStudentCertification(
  studentId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/certifications`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function updateStudentCertification(
  studentId: string,
  certificateId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/certifications/${certificateId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export function deleteStudentCertification(
  studentId: string,
  certificateId: string
) {
  return apiRequest(
    `/students/${studentId}/certifications/${certificateId}`,
    {
      method: "DELETE",
    }
  );
}

/* ============================================================
   INTERNSHIPS
============================================================ */

export function getStudentInternships(
  studentId: string
) {
  return apiRequest(
    `/students/${studentId}/internships`
  );
}
export function addStudentInternship(
  studentId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/internships`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function updateStudentInternship(
  studentId: string,
  internshipId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/internships/${internshipId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export function deleteStudentInternship(
  studentId: string,
  internshipId: string
) {
  return apiRequest(
    `/students/${studentId}/internships/${internshipId}`,
    {
      method: "DELETE",
    }
  );
}

/* ============================================================
   ACHIEVEMENTS
============================================================ */

export function getStudentAchievements(
  studentId: string
) {
  return apiRequest(
    `/students/${studentId}/achievements`
  );
}

export function addStudentAchievement(
  studentId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/achievements`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function updateStudentAchievement(
  studentId: string,
  achievementId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/achievements/${achievementId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export function deleteStudentAchievement(
  studentId: string,
  achievementId: string
) {
  return apiRequest(
    `/students/${studentId}/achievements/${achievementId}`,
    {
      method: "DELETE",
    }
  );
}

/* ============================================================
   SOCIAL LINKS
============================================================ */

/* SOCIAL LINKS */

export function getStudentSocialLinks(studentId: string) {
  return apiRequest(`/students/${studentId}/social-links`);
}

export function addStudentSocialLink(
  studentId: string,
  data: {
    platform: string;
    profile_url: string;
  }
) {
  return apiRequest(`/students/${studentId}/social-links`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateStudentSocialLink(
  studentId: string,
  socialLinkId: string,
  data: {
    platform?: string;
    profile_url?: string;
  }
) {
  return apiRequest(
    `/students/${studentId}/social-links/${socialLinkId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export function deleteStudentSocialLink(
  studentId: string,
  socialLinkId: string
) {
  return apiRequest(
    `/students/${studentId}/social-links/${socialLinkId}`,
    {
      method: "DELETE",
    }
  );
}

/* ============================================================
   RESUMES
============================================================ */

export function getStudentResumes(
  studentId: string
) {
  return apiRequest(
    `/students/${studentId}/resumes`
  );
}

export function uploadStudentResume(
  studentId: string,
  file: File
) {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest(
    `/students/${studentId}/resumes`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export function getBranches() {
  return apiRequest("/master-data/branches");
}

export async function getStudentResumeFile(
  studentId: string,
  resumeId: string
): Promise<Blob> {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  const response = await fetch(
    `${API_URL}/students/${studentId}/resumes/${resumeId}/file`,
    {
      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load resume file"
    );
  }

  return response.blob();
}