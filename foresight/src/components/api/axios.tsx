import axios from "axios";
import { useAuthStore } from "../zustand/store";

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = window.location.origin;

export const api = axios.create({
    baseURL: API_URL ,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});