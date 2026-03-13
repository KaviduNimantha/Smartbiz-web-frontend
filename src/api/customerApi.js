import api from './axiosConfig';

export const customerApi = {
  getAll: async () => {
    const res = await api.get('/customers/');
    return res.data;
  },
  add: async (data) => {
    const res = await api.post('/customers/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/business/customers/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/business/customers/${id}`);
    return res.data;
  },
};
