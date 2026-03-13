import api from './axiosConfig';

export const salesApi = {
  getAll: async () => {
    const res = await api.get('/sales/');
    return res.data;
  },
};
