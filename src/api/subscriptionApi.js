import api from './axiosConfig';

export const subscriptionApi = {
  // Business owner: view all available plans
  getPlans: async () => {
    const res = await api.get('/subscriptions/');
    return res.data;
  },
  // Business owner: subscribe to a plan
  selectPlan: async (planId) => {
    const res = await api.post('/subscriptions/select', { planId });
    return res.data;
  },
};
