import api from './axiosConfig';

export const dashboardApi = {
  getOverview: async () => {
    try {
      const response = await api.get('/dashboard/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
