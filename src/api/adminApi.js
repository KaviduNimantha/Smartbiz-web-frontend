import api from './axiosConfig';

export const adminApi = {
  // Businesses
  getBusinesses: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  toggleBusinessStatus: async (id) => {
    const res = await api.put(`/admin/users/${id}/status`);
    return res.data;
  },

  // System statistics
  getStatistics: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  // AI usage logs
  getLogs: async () => {
    const res = await api.get('/admin/ai-logs');
    return res.data;
  },

  // Subscription plans
  getPlans: async () => {
    const res = await api.get('/subscriptions/');
    return res.data;
  },
  createPlan: async (data) => {
    const res = await api.post('/subscriptions/', data);
    return res.data;
  },
  updatePlan: async (id, data) => {
    const res = await api.put(`/subscriptions/${id}`, data);
    return res.data;
  },
  deletePlan: async (id) => {
    const res = await api.delete(`/subscriptions/${id}`);
    return res.data;
  },
};
