
export const API_URL = ''; // Relative path for the server

export const api = {
  getToken: () => localStorage.getItem('tesla_token'),
  setToken: (token: string) => localStorage.setItem('tesla_token', token),
  removeToken: () => localStorage.removeItem('tesla_token'),

  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check if there's content to parse
    const contentType = response.headers.get("content-type");
    let data = null;
    
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse JSON response", e);
      }
    } else {
      // Handle non-JSON response (like plain text error messages)
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      throw new Error(data?.message || `Server error: ${response.status}`);
    }
    
    return data;
  },

  async login(credentials: any) {
    const data = await this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) this.setToken(data.token);
    return data;
  },

  async register(userData: any) {
    return this.request('/api/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getMe() {
    return this.request('/api/me');
  },

  async updateProfile(profileData: any) {
    return this.request('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  async resetPassword(email: string) {
    return this.request('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyEmail(email: string) {
    return this.request(`/api/verify-email?email=${encodeURIComponent(email)}`);
  }
};
