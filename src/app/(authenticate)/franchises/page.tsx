'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { DataTable } from '../../../components/DataTable'
import { Modal } from '../../../components/Modal'
import { useToast } from '../../../hooks/useToast'
import { franchiseService } from '../../../services/franchises'
import type { Franchise, UpdateFranchiseDto } from '../../../interfaces'
import Image from 'next/image'

interface FormData {
  name: string
  file?: File
  imageUrl?: string
}

export default function Franchises() {
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null)
  const [formData, setFormData] = useState<FormData>({ name: '', imageUrl: '' })
  const { showToast } = useToast()

  useEffect(() => {
    loadFranchises()
  }, [])

  const loadFranchises = async () => {
    setLoading(true)
    try {
      const data = await franchiseService.getAll()
      setFranchises(data)
    } catch {
      showToast('error', 'Erro ao carregar franquias')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fr: Franchise) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${fr.name}"?`)) return
    try {
      await franchiseService.remove(fr.id.toString())
      showToast('success', 'Franquia excluída com sucesso')
      loadFranchises()
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Erro ao excluir franquia')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      showToast('error', 'Nome da franquia é obrigatório')
      return
    }

    try {
      if (editingFranchise) {
        const dto: UpdateFranchiseDto = { name: formData.name }
        await franchiseService.update(editingFranchise.id.toString(), dto)

        if (formData.file || formData.imageUrl) {
          await franchiseService.updateImage(
            editingFranchise.id.toString(),
            formData.file,
            formData.imageUrl,
          )
        }

        showToast('success', 'Franquia atualizada com sucesso')
      } else {
        await franchiseService.createWithImage(
          formData.name,
          formData.file,
          formData.imageUrl,
        )
        showToast('success', 'Franquia criada com sucesso')
      }

      setIsModalOpen(false)
      setEditingFranchise(null)
      setFormData({ name: '', file: undefined, imageUrl: '' })
      loadFranchises()
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Erro ao salvar franquia')
    }
  }

  const openEditModal = (fr: Franchise) => {
    setEditingFranchise(fr)
    setFormData({ name: fr.name, file: undefined, imageUrl: '' })
    setIsModalOpen(true)
  }
  const openCreateModal = () => {
    setEditingFranchise(null)
    setFormData({ name: '', file: undefined, imageUrl: '' })
    setIsModalOpen(true)
  }

  const columns = [
    { key: 'name', label: 'Nome', sortable: true },
    {
      key: 'charactersCount',
      label: 'Personagens',
      render: (fr: Franchise) => fr.charactersCount ?? 0,
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      sortable: true,
      render: (fr: Franchise) =>
        new Date(fr.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (fr: Franchise) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openEditModal(fr)}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(fr)}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Franquias</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Franquia</span>
        </button>
      </div>

      <DataTable
        data={franchises}
        columns={columns}
        searchPlaceholder="Buscar franquias..."
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFranchise ? 'Editar Franquia' : 'Nova Franquia'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Franquia *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              placeholder="Ex: Shrek"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da Capa (opcional)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              placeholder="https://"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload de Imagem (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  file: e.target.files ? e.target.files[0] : undefined,
                })
              }
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingFranchise ? 'Atualizar' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
