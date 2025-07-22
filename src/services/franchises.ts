import api from './api'
import type { Franchise, UpdateFranchiseDto } from '../interfaces'

interface CreateFranchisePayload {
  name: string
  file?: File
  imageUrl?: string
}

export const franchiseService = {
  async getAll(): Promise<Franchise[]> {
    const response = await api.get('/franchises', { withCredentials: true });
    return response.data.map((fr: any) => ({
      ...fr,
      charactersCount: fr._count?.characters ?? 0,
    }));
  },


  async getById(id: string): Promise<Franchise> {
    const response = await api.get(`/franchises/${id}`, { withCredentials: true })
    return response.data
  },

  async create(payload: CreateFranchisePayload): Promise<Franchise> {
    const { name, file, imageUrl } = payload

    if (file || imageUrl) {
      const formData = new FormData()
      formData.append('name', name)
      if (file) formData.append('file', file)
      if (imageUrl) formData.append('imageUrl', imageUrl)

      const response = await api.post(
        '/franchises',
        formData,
        { withCredentials: true }
      )
      return response.data
    }

    const response = await api.post(
      '/franchises',
      { name },
      { withCredentials: true },
    )
    return response.data
  },

  async createWithImage(name: string, file?: File, imageUrl?: string): Promise<Franchise> {
    const formData = new FormData()
    formData.append('name', name)
    if (file) formData.append('file', file)
    if (imageUrl) formData.append('imageUrl', imageUrl)

    const response = await api.post('/franchises', formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async update(
    id: string,
    data: UpdateFranchiseDto,
  ): Promise<Franchise> {
    const response = await api.patch(
      `/franchises/${id}`,
      data,
      { withCredentials: true },
    )
    return response.data
  },

  async updateImage(
    id: string,
    file?: File,
    imageUrl?: string,
  ): Promise<Franchise> {
    const formData = new FormData()
    if (file) formData.append('file', file)
    if (imageUrl) formData.append('imageUrl', imageUrl)

    const response = await api.patch(
      `/franchises/${id}/image`,
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return response.data
  },

  async deleteImage(id: string): Promise<Franchise> {
    const response = await api.delete(
      `/franchises/${id}/image`,
      { withCredentials: true },
    )
    return response.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/franchises/${id}`, { withCredentials: true })
  },
}
