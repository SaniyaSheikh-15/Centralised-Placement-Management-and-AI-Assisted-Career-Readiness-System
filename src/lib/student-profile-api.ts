const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.detail || `Request failed: ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Profile
export function getStudentProfile(studentId: string) {
  return apiRequest(`/students/profile/${studentId}`);
}

export function getStudentProfileByUserId(userId: string) {
  return apiRequest(`/students/profile/user/${userId}`);
}

export function updateStudentProfile(
  studentId: string,
  data: unknown
) {
  return apiRequest(`/students/profile/${studentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Skills
export function getStudentSkills(studentId: string) {
  return apiRequest(`/students/${studentId}/skills`);
}

export function addStudentSkill(
  studentId: string,
  data: unknown
) {
  return apiRequest(`/students/${studentId}/skills`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateStudentSkill(
  studentId: string,
  skillId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/skills/${skillId}`,
    {
      method: 'PUT',
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
      method: 'DELETE',
    }
  );
}

// Projects
export function getStudentProjects(studentId: string) {
  return apiRequest(`/students/${studentId}/projects`);
}

export function addStudentProject(
  studentId: string,
  data: unknown
) {
  return apiRequest(`/students/${studentId}/projects`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateStudentProject(
  studentId: string,
  projectId: string,
  data: unknown
) {
  return apiRequest(
    `/students/${studentId}/projects/${projectId}`,
    {
      method: 'PUT',
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
      method: 'DELETE',
    }
  );
}

// Certifications
export function getStudentCertifications(studentId: string) {
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
      method: 'POST',
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
      method: 'PUT',
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
      method: 'DELETE',
    }
  );
}

// Internships
export function getStudentInternships(studentId: string) {
  return apiRequest(`/students/${studentId}/internships`);
}

// Achievements
export function getStudentAchievements(studentId: string) {
  return apiRequest(`/students/${studentId}/achievements`);
}

// Social Links
export function getStudentSocialLinks(studentId: string) {
  return apiRequest(`/students/${studentId}/social-links`);
}

// Resumes
export function getStudentResumes(studentId: string) {
  return apiRequest(`/students/${studentId}/resumes`);
}