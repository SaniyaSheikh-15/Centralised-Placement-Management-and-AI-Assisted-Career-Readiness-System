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

/* ============================================================
   SOCIAL LINKS
============================================================ */

export function getStudentSocialLinks(
  studentId: string
) {
  return apiRequest(
    `/students/${studentId}/social-links`
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
