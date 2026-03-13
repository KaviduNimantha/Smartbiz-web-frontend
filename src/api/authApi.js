import api from './axiosConfig';

export const authApi = {
  // Register a new user (OWNER role only from register page)
  registerUser: async (userData) => {
    // userData: { businessName, ownerName, email, password }
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login a user (admin or owner)
  loginUser: async (credentials) => {
    // credentials: { email, password }
    try {
      const response = await api.post('/auth/login', credentials);
      // Backend returns: { success, message, data: { user, token } }
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logoutUser: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
