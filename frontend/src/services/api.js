import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// ===== Student Controller (Custom) =====
export const getAllStudents     = () => api.get('/students/all');
export const saveStudent       = (student) => api.post('/students/save', student);
export const deleteStudentById = (id) => api.delete(`/students/delete/${id}`);
export const getStudentCount   = () => api.get('/students/count');
export const getStudentsByYear = () => api.get('/students/byYear');

// ===== Student Entity Controller (Spring Data REST) =====
export const getStudentsPaged = (page = 0, size = 20, sort) => {
  const params = { page, size };
  if (sort) params.sort = sort;
  return api.get('/students', { params });
};
export const createStudent   = (student) => api.post('/students', student);
export const getStudentById  = (id) => api.get(`/students/${id}`);
export const updateStudent   = (id, student) => api.put(`/students/${id}`, student);
export const patchStudent    = (id, fields) => api.patch(`/students/${id}`, fields);
export const deleteStudent   = (id) => api.delete(`/students/${id}`);

// ===== Student Search Controller =====
export const searchStudentsByYear = () => api.get('/students/search/findNbrStudentByYear');

export default api;
