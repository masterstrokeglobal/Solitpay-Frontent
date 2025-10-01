import axios, { AxiosInstance } from 'axios';

declare global {
    interface Window {
        Clerk?: {
            session?: {
                getToken: () => Promise<string>;
            };
        };
    }
}

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL??"http://localhost:7003/api",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});


export default api;