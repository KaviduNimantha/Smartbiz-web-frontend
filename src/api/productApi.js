import api from './axiosConfig';

export const productApi = {
  getAll: async () => {
    const res = await api.get('/inventory/products');
    return res.data;
  },
};
