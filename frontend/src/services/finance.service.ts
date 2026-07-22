import api from './api';

export const getFinances = async () => {
  const response = await api.get('/finance');
  return response.data;
};

export const createFinance = async (data: any) => {
  const response = await api.post('/finance', data);
  return response.data;
};
