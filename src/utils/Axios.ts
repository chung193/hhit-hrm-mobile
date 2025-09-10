import { API_URL } from "../config/app";
import axios from 'axios';
import { getToken } from "./Storage";

export const authInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const instance = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
})

authInstance.interceptors.request.use(
    async (config) => {
        try {
            const token: string | null = await getToken();
            if (token && typeof token === 'string') {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        } catch (error) {
            console.error('Error getting token:', error);
            return config; // vẫn return config nếu token fail
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

