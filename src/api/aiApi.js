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
    // Correct endpoint is /ai/marketing (not /ai/post)
    const res = await api.post('/ai/marketing', { prompt });
    return res.data;
  },
  summarizeInvoice: async (invoiceData) => {
    // Correct endpoint is /ai/invoice-summary (not /ai/invoice)
    const res = await api.post('/ai/invoice-summary', { invoiceData });
    return res.data;
  },
};
