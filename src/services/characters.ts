import api from './api'
import type { Character, CreateCharacterDto, UpdateCharacterDto } from '../interfaces'

export const characterService = {
  async getAll(): Promise<Character[]> {
    const response = await api.get<Character[]>('/characters', { withCredentials: true })
    return response.data
  },

  async getById(id: number): Promise<Character> {
    const response = await api.get<Character>(`/characters/${id}`, { withCredentials: true })
    return response.data
  },

  async create(
    data: Omit<CreateCharacterDto, 'file'>,
    file?: File
  ): Promise<Character> {
    const formData = new FormData()
    if (file) {
      formData.append('file', file)
    }
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('gender', data.gender)
    formData.append('aliveStatus', data.aliveStatus.toString())
    if (data.emojis) {
      formData.append('emojis', JSON.stringify(data.emojis))
    }
    if (data.race) {
      formData.append('race', JSON.stringify(data.race))
    }
    if (data.ethnicity) {
      formData.append('ethnicity', JSON.stringify(data.ethnicity))
    }
    if (data.paper) {
      formData.append('paper', JSON.stringify(data.paper))
    }
    if (data.hair) {
      formData.append('hair', data.hair)
    }
    if (data.imageUrl1) {
      formData.append('imageUrl1', data.imageUrl1)
    }
    if (data.imageUrl2) {
      formData.append('imageUrl2', data.imageUrl2)
    }
    if (data.franchiseIds) {
      formData.append('franchiseIds', JSON.stringify(data.franchiseIds))
    }

    const response = await api.post<Character>(
      '/characters',
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return response.data
  },

  async update(
    id: number,
    data: UpdateCharacterDto
  ): Promise<Character> {
    const response = await api.patch<Character>(
      `/characters/${id}`,
      data,
      { withCredentials: true }
    )
    return response.data
  },

  async updateImage(
    id: number,
    file?: File,
    imageUrl1?: string
  ): Promise<Character> {
    const formData = new FormData()
    if (file) {
      formData.append('file', file)
    }
    if (imageUrl1) {
      formData.append('imageUrl1', imageUrl1)
    }

    const response = await api.patch<Character>(
      `/characters/${id}/image`,
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return response.data
  },

  async deleteImage(id: number): Promise<Character> {
    const response = await api.delete<Character>(
      `/characters/${id}/image`,
      { withCredentials: true }
    )
    return response.data
  },

  async remove(id: number): Promise<Character> {
    const response = await api.delete<Character>(
      `/characters/${id}`,
      { withCredentials: true }
    )
    return response.data
  },
}
