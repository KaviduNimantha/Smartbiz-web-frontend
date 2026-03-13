import api from './axiosConfig';

export const expenseApi = {
  getAll: async () => {
    const res = await api.get('/sales/expenses');
    return res.data;
  },
  add: async (data) => {
    const res = await api.post('/sales/expenses', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/sales/expenses/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/sales/expenses/${id}`);
    return res.data;
  },
};
