import api from './axiosConfig';

export const expenseApi = {
  getAll: async () => {
    const res = await api.get('/expenses/');
    return res.data;
  },
  add: async (data) => {
    const res = await api.post('/expenses/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/expenses/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
  },
};
