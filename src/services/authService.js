import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data) {
      const { user, token } = response.data;
      api.setToken(token);
      localStorage.setItem('nova_user', JSON.stringify(user));
      return { user, token };
    }
    throw new Error(response.message || 'Login failed');
  },

  async getMe() {
    const response = await api.get('/auth/me');
    if (response.success && response.data) {
      localStorage.setItem('nova_user', JSON.stringify(response.data));
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch user profile');
  },

  logout() {
    api.setToken(null);
    localStorage.removeItem('nova_user');
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('nova_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return api.getToken();
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return !!(user && user.role === 'admin');
  },
};

export default authService;
