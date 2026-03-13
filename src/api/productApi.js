import api from './axiosConfig';

export const productApi = {
  getAll: async () => {
    const res = await api.get('/business/products');
    return res.data;
  },
};
