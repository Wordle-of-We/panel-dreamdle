import api from './api';
import type { User } from '../interfaces';

export const authService = {
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: User }> {
    const response = await api.post<{ token: string; user: User }>(
      '/auth/login',
      { email, password }
    );
    const { token, user } = response.data;
    localStorage.setItem('adminToken', token);
    return { token, user };
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  },
};
