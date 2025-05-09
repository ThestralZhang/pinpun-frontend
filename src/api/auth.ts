import { api } from './client.tsx';
import type { AxiosResponse } from 'axios';
import type { User } from '@/types';

export async function login({ email, password }: { email: string; password: string }) {
  const loginRes: AxiosResponse<{ userId: number }> = await api.post('/login', { email, password });
  const userInfoRes: AxiosResponse<User> = await api.get('/users/' + loginRes.data.userId);
  return userInfoRes.data;
}

export async function signup(payload: {
  username: string;
  email: string;
  password: string;
  about?: string;
  avatarUrl?: string;
}) {
  return await api.post('/register', payload);
}
