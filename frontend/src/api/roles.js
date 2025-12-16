import api from './axios';

export const rolesAPI = {
  getAll: async () => {
    const response = await api.get('/roles');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  create: async (roleData) => {
    const response = await api.post('/roles', roleData);
    return response.data;
  },

  getPermissions: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },
};

export default rolesAPI;
