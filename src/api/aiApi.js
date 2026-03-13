import api from './axiosConfig';

export const aiApi = {
  generateReport: async (prompt) => {
    const res = await api.post('/ai/report', { prompt });
    return res.data;
  },
  generateEmail: async (prompt) => {
    const res = await api.post('/ai/email', { prompt });
    return res.data;
  },
  generatePost: async (prompt) => {
    const res = await api.post('/ai/post', { prompt });
    return res.data;
  },
  summarizeInvoice: async (invoiceData) => {
    const res = await api.post('/ai/invoice', { invoiceData });
    return res.data;
  },
};
