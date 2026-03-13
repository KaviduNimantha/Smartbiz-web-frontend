import api from './axiosConfig';

export const supplierApi = {
  getAll: async () => {
    const res = await api.get('/suppliers/');
    return res.data;
  },
  add: async (data) => {
    const res = await api.post('/suppliers/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/business/suppliers/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/business/suppliers/${id}`);
    return res.data;
  },
};
