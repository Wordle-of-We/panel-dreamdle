import api from './api';
import type { User } from '../interfaces';

export const userService = {
  async getAll(): Promise<User[]> {
    const res = await api.get<User[]>('/users');
    return res.data;
  },
};