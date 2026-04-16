import axios, { AxiosError } from 'axios';

//baseURL  main server URL (like your website backend)
//Content-Type sending data in JSON format
//timeout: 15000  wait max 15 seconds, then stop ⏱️
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

//interceptors → automatic helpers that run before every request
//Check if we are in browser (window)
//Get saved login token from localStorage
//If token exists → attach it to request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//If request is successful:just return response
//If error happens:create a clean error message
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as any)?.error ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);