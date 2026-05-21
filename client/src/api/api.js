import axios from 'axios';

const resolveApiBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL?.trim();

  if (!rawUrl) {
    return 'https://smart-timetable-1-smts.onrender.com/api';
  }

  return rawUrl.replace(/\/+$/, '').replace(/\/api$/, '') + '/api';
};

const API = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  return config;
});

// Handle 401 responses (expired/invalid token)
API.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const logout = () => API.post('/auth/logout');

// Courses
export const getCourses = () => API.get('/courses');
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// Constraints
export const getConstraints = () => API.get('/constraints');
export const updateConstraints = (data) => API.put('/constraints', data);

// Timetable
export const generateTimetable = () => API.post('/timetable/generate');
export const getTimetable = () => API.get('/timetable');
export const getConflicts = () => API.get('/timetable/conflicts');

// Rooms
export const getRooms = () => API.get('/rooms');
export const createRoom = (data) => API.post('/rooms', data);
export const updateRoom = (id, data) => API.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);

export default API;
