'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { DataTable } from '../../../components/DataTable'
import { CharacterModal, CharacterModalData } from '../../../components/CharacterModal'
import { useToast } from '../../../hooks/useToast'
import { characterService } from '../../../services/characters'
import { franchiseService } from '../../../services/franchises'
import type { Character, Franchise } from '../../../interfaces'
import Image from 'next/image'

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<
    (Character & { franchiseIds: string[] }) | null
  >(null)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    loadCharacters()
    loadFranchises()
  }, [])

  const loadCharacters = async () => {
    setLoading(true)
    try {
      const data = await characterService.getAll()
      setCharacters(data)
    } catch {
      showToast('error', 'Erro ao carregar personagens')
    } finally {
      setLoading(false)
    }
  }

  const loadFranchises = async () => {
    try {
      const data = await franchiseService.getAll()
      setFranchises(data)
    } catch {
      showToast('error', 'Erro ao carregar franquias')
    }
  }

  const handleSave = async (data: CharacterModalData) => {
    if (!data.name.trim() || data.franchiseIds.length === 0) {
      showToast('error', 'Nome e pelo menos uma franquia são obrigatórios')
      return
    }
    setSaving(true)
    try {
      const { file1, file2, ...payload } = data
      let char: Character
      if (editingCharacter) {
        char = await characterService.update(Number(editingCharacter.id), payload as any)
        if (file1) {
          await characterService.updateImage(Number(editingCharacter.id), file1)
        }
      } else {
        char = await characterService.create(payload as any, file1)
      }
      if (file2) {
        await characterService.updateImage(Number(char.id), file2)
      }
      showToast('success', editingCharacter ? 'Atualizado!' : 'Criado!')
      setIsModalOpen(false)
      setEditingCharacter(null)
      loadCharacters()
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (character: Character) => {
    if (!confirm(`Tem certeza que deseja excluir "${character.name}"?`)) return
    try {
      await characterService.remove(Number(character.id))
      showToast('success', 'Personagem excluído com sucesso')
      loadCharacters()
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Erro ao excluir personagem')
    }
  }

  const openEditModal = (character: Character) => {
    setEditingCharacter({
      ...character,
      franchiseIds: character.franchises.map((f) => f.id.toString()),
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingCharacter(null)
    setIsModalOpen(true)
  }

  const columns = [
    {
      key: 'image',
      label: 'Imagem',
      render: (c: Character) => (
        <div className="w-12 h-12 overflow-hidden rounded-lg">
          <Image
            src={c.imageUrl1 ?? '/placeholder.jpg'}
            alt={c.name}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
      ),
    },
    { key: 'name', label: 'Nome', sortable: true },
    {
      key: 'franchises',
      label: 'Franquias',
      render: (c: Character) => (
        <div className="flex flex-wrap gap-1">
          {c.franchiseNames.map(name => (
            <span
              key={name}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
            >
              {name}
            </span>
          ))}
        </div>
      ),
    },
    { key: 'gender', label: 'Gênero', sortable: true },
    { key: 'aliveStatus', label: 'Status', sortable: true },
    {
      key: 'actions',
      label: 'Ações',
      render: (c: Character) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openEditModal(c)}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(c)}
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Personagens</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Novo Personagem
        </button>
      </div>

      <DataTable
        data={characters}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar personagens..."
      />

      <CharacterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        franchises={franchises}
        initialData={editingCharacter ?? undefined}
        loading={saving}
        onSave={handleSave}
      />
    </div>
  )
}
