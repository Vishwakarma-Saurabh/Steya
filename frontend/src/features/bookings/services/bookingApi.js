import api from '../../../services/apiClient';

export const bookingApi = {
  create: (data) => api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  cancel: (id) => api.post(`/bookings/${id}/cancel`)
};

export default bookingApi;