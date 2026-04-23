import api from '../../../services/apiClient';

export const matchApi = {
  findMatches: (data) => api.post('/matches/routes', data),
  createRoute: (data) => api.post('/matches/routes/create', data),
  getMyRoutes: () => api.get('/matches/routes/my')
};

export default matchApi;