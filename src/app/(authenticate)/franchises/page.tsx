'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { DataTable } from '../../../components/DataTable'
import { FranchiseModal } from '../../../components/FranchiseModal'
import { useToast } from '../../../hooks/useToast'
import { franchiseService } from '../../../services/franchises'
import type { Franchise, UpdateFranchiseDto } from '../../../interfaces'

export default function Franchises() {
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null)
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

  const handleSaveFranchise = async (data: { name: string; file?: File; imageUrl?: string }) => {
    if (!data.name.trim()) {
      showToast('error', 'Nome da franquia é obrigatório')
      return
    }

    setSaving(true)
    try {
      if (editingFranchise) {
        const dto: UpdateFranchiseDto = { name: data.name }
        await franchiseService.update(editingFranchise.id.toString(), dto)

        if (data.file || data.imageUrl) {
          await franchiseService.updateImage(
            editingFranchise.id.toString(),
            data.file,
            data.imageUrl
          )
        }

        showToast('success', 'Franquia atualizada com sucesso')
      } else {
        await franchiseService.createWithImage(
          data.name,
          data.file,
          data.imageUrl
        )
        showToast('success', 'Franquia criada com sucesso')
      }

      setIsModalOpen(false)
      setEditingFranchise(null)
      loadFranchises()
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Erro ao salvar franquia')
    } finally {
      setSaving(false)
    }
  }

  const openEditModal = (fr: Franchise) => {
    setEditingFranchise(fr)
    setIsModalOpen(true)
  }
  const openCreateModal = () => {
    setEditingFranchise(null)
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
      render: (fr: Franchise) => new Date(fr.createdAt).toLocaleDateString('pt-BR'),
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

      <FranchiseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingFranchise ? { name: editingFranchise.name, imageUrl: editingFranchise.imageUrl } : undefined}
        loading={saving}
        onSave={handleSaveFranchise}
      />
    </div>
  )
}
