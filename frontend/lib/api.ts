'use client';

import axios from 'axios';
import { useAuth } from '../contexts/auth-context';

let authStore: ReturnType<typeof useAuth> | null = null;

export function injectAuthContext(context: ReturnType<typeof useAuth>) {
  authStore = context;
}

const api = axios.create({
  baseURL: '/api/',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  console.log(`Intercepted request: ${config.url} (baseURL: ${config.baseURL})`);
  if (authStore?.accessToken) {
    console.log(`Injecting access token: ${authStore.accessToken}`);
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  console.log(`Headers: ${JSON.stringify(config.headers)}`);
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.log(`Intercepted error: ${error}`);

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && authStore) {
      originalRequest._retry = true;
      await authStore.refreshAccessToken();

      if (authStore.accessToken) {
        originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
