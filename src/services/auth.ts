import api from './api';
import { User } from '../interfaces';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile', { withCredentials: true });
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      window.location.href = '/';
    }
  }

};
