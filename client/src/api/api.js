import axios from "axios";

const resolveApiBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL?.trim();

  if (!rawUrl) {
    console.warn("⚠️ VITE_API_URL not set, using default production URL");
    return "https://smart-timetable-1-smts.onrender.com/api";
  }

  return rawUrl.replace(/\/+$/, "").replace(/\/api$/, "") + "/api";
};

const API = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
});

// Request interceptor - Add token to Authorization header
API.interceptors.request.use((config) => {
  console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);

  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Token attached to request");
  }

  return config;
});

// Response interceptor - Handle responses and errors
API.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);

    // Save token if returned in response (from login/register)
    if (response.data?.token) {
      localStorage.setItem("auth_token", response.data.token);
      console.log("💾 Token saved to localStorage");
    }

    return response;
  },
  (error) => {
    console.error(
      `❌ ${error.response?.status || "Network"} Error:`,
      error.message,
    );
    if (error.response?.status === 401) {
      console.warn("🔐 Unauthorized - Clearing stored token");
      localStorage.removeItem("auth_token");
    }
    return Promise.reject(error);
  },
);

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const logout = async () => {
  localStorage.removeItem("auth_token");
  return API.post("/auth/logout");
};

// Courses
export const getCourses = () => API.get("/courses");
export const createCourse = (data) => API.post("/courses", data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// Constraints
export const getConstraints = () => API.get("/constraints");
export const updateConstraints = (data) => API.put("/constraints", data);

// Timetable
export const generateTimetable = () => API.post("/timetable/generate");
export const getTimetable = () => API.get("/timetable");
export const getConflicts = () => API.get("/timetable/conflicts");

// Rooms
export const getRooms = () => API.get("/rooms");
export const createRoom = (data) => API.post("/rooms", data);
export const updateRoom = (id, data) => API.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);

export default API;
