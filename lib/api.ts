export async function apiRequest(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem("authToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    // ✅ Vite environment variable
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const fullUrl = endpoint.startsWith("http")
      ? endpoint
      : `${baseUrl}${endpoint}`;

    console.log("[api] Request:", fullUrl);

    const response = await fetch(fullUrl, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const data = await response.json();
        errorMessage = data?.error || errorMessage;
      } catch {
        // ignore JSON parse errors
      }

      console.error("[api] Error Response:", errorMessage);
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("[api] Request Failed:", message);

    if (error instanceof TypeError && message.toLowerCase().includes("fetch")) {
      throw new Error(
        "Failed to connect to server. Make sure the backend is running."
      );
    }

    throw error;
  }
}

/* ===================== AUTH API ===================== */

export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    country: string;
  }) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  verifyEmail: (userId: string, token: string) =>
    apiRequest("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ userId, token }),
    }),

  getCurrentUser: () => apiRequest("/api/auth/me"),
};

/* ===================== DOCUMENTS API ===================== */

export const documentsAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("authToken");
    const headers: HeadersInit = {};

    if (token) headers.Authorization = `Bearer ${token}`;

    return fetch(`${import.meta.env.VITE_API_URL}/api/documents/upload`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    }).then((res) => (res.ok ? res.json() : Promise.reject(res)));
  },

  getDocuments: () => apiRequest("/api/documents"),

  deleteDocument: (id: string) =>
    apiRequest(`/api/documents/${id}`, { method: "DELETE" }),
};

/* ===================== PROFILE API ===================== */

export const profileAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("authToken");
    const headers: HeadersInit = {};

    if (token) headers.Authorization = `Bearer ${token}`;

    return fetch(`${import.meta.env.VITE_API_URL}/api/profile/image`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    }).then((res) => (res.ok ? res.json() : Promise.reject(res)));
  },

  getImage: () => apiRequest("/api/profile/image"),

  updateProfile: (data: {
    firstName: string;
    lastName: string;
    country: string;
  }) =>
    apiRequest("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

/* ===================== ADMIN API ===================== */

export const adminAPI = {
  getAllUploads: () => apiRequest("/api/admin/uploads"),
  getAllUsers: () => apiRequest("/api/admin/users"),
};

/* ===================== UPDATES API ===================== */

export const updatesAPI = {
  getUpdates: () => apiRequest("/api/updates"),
};
