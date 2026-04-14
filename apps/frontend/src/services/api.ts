import axios from "axios";
import { useAuthStore } from "../features/auth/slices/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor to handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && window.location.pathname !== "/login") {
            useAuthStore.getState().logout();
            window.location.href = "/login"; // Force redirect if unauthorized
        }
        return Promise.reject(error);
    }
);

export default api;
