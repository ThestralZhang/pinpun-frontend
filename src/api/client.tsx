import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { toaster, Message } from 'rsuite';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('XSRF-TOKEN');
  if (token && config.headers) {
    config.headers['X-XSRF-TOKEN'] = token;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      if (err.response.status === 401 || err.response.status === 403) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
      // else if (err.response.status === 403) {
      //   toaster.push(
      //     <Message showIcon type="error" header="Access Denied">
      //       You don’t have permission to do that.
      //     </Message>,
      //     { placement: 'bottomEnd', duration: 3000 },
      //   );
      // }
    } else {
      // fallback for network errors
      toaster.push(
        <Message showIcon type="error" header="Network Error">
          {err.message || 'Failed to reach the server.'}
        </Message>,
        { placement: 'bottomEnd', duration: 3000 },
      );
    }
    return Promise.reject(err);
  },
);
