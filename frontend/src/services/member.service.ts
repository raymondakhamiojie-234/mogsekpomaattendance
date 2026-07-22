import api from './api';

export const getHierarchy = async () => {
  const response = await api.get('/members/hierarchy');
  return response.data;
};

export const markAttendance = async (data: { serviceName: string; date: string; memberId: string; status: string }) => {
  const response = await api.post('/attendance/mark', data);
  return response.data;
};

export const getAttendanceForService = async (serviceName: string, date: string) => {
  const response = await api.get(`/attendance?serviceName=${encodeURIComponent(serviceName)}&date=${encodeURIComponent(date)}`);
  return response.data;
};

export const getMembers = async () => {
  const response = await api.get('/members');
  return response.data;
};

export const createMember = async (memberData: any) => {
  const response = await api.post('/members', memberData);
  return response.data;
};

export const updateMember = async (id: string, memberData: any) => {
  const response = await api.put(`/members/${id}`, memberData);
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
