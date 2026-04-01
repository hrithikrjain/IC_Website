const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

function redirectToAdminLogin() {
  window.localStorage.removeItem("token");
  window.location.href = "/admin/login";
}

function getTokenOrRedirect() {
  const token = window.localStorage.getItem("token");
  if (!token) {
    redirectToAdminLogin();
    throw new Error("Authentication required");
  }
  return token;
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function adminRequest(path, options = {}) {
  const token = getTokenOrRedirect();
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 422) {
    redirectToAdminLogin();
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function requestAny(paths, options = {}) {
  let lastError;

  for (const path of paths) {
    try {
      return await request(path, options);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Request failed");
}

export const api = {
  listJobs: (params = {}) => {
    const search = new URLSearchParams(params);
    const suffix = search.toString() ? `?${search.toString()}` : "";
    return request(`/jobs${suffix}`);
  },
  getJob: (jobId) => request(`/jobs/${jobId}`),
  createJob: (payload) => adminRequest("/jobs", { method: "POST", body: JSON.stringify(payload) }),
  updateJob: (jobId, payload) => adminRequest(`/jobs/${jobId}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteJob: (jobId) => adminRequest(`/jobs/${jobId}`, { method: "DELETE" }),

  createApplication: (formData) => request("/applications", { method: "POST", body: formData }),
  listApplications: (params = {}) => {
    const search = new URLSearchParams(params);
    const suffix = search.toString() ? `?${search.toString()}` : "";
    return adminRequest(`/applications${suffix}`);
  },
  updateApplication: (applicationId, payload) =>
    adminRequest(`/applications/${applicationId}`, { method: "PUT", body: JSON.stringify(payload) }),

  listTeamMembers: () => requestAny(["/team", "/team-members"]),
  createTeamMember: (payload) =>
    adminRequest("/team-members", { method: "POST", body: JSON.stringify(payload) }),
  updateTeamMember: (memberId, payload) =>
    adminRequest(`/team-members/${memberId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteTeamMember: (memberId) => adminRequest(`/team-members/${memberId}`, { method: "DELETE" }),

  listFaqs: () => request("/faqs"),
  createFaq: (payload) => adminRequest("/faqs", { method: "POST", body: JSON.stringify(payload) }),
  updateFaq: (faqId, payload) => adminRequest(`/faqs/${faqId}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteFaq: (faqId) => adminRequest(`/faqs/${faqId}`, { method: "DELETE" }),

  getSiteContent: () => requestAny(["/content", "/site-content"]),
  upsertSiteContent: (payload) =>
    adminRequest("/site-content", { method: "POST", body: JSON.stringify(payload) }),
  deleteSiteContent: (key) => adminRequest(`/site-content/${key}`, { method: "DELETE" }),

  login: (payload) => request("/admin/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => adminRequest("/auth/me"),
};
