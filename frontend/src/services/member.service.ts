import api from './api';

export const getMembers = async () => {
  const response = await api.get('/members');
  return response.data;
};

export const createMember = async (memberData: any) => {
  const response = await api.post('/members', memberData);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getMemberById = async (id: string) => {
  const response = await api.get(`/members/${id}`);
  return response.data;
};

export const transferMember = async (memberId: string, newParentId: string | null) => {
  const response = await api.post(`/members/${memberId}/transfer`, { newParentId });
  return response.data;
};
