'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { DataTable } from '../../../components/DataTable'
import { Modal } from '../../../components/Modal'
import { useToast } from '../../../hooks/useToast'
import { characterService } from '../../../services/characters'
import { franchiseService } from '../../../services/franchises'
import type {
  Character,
  CreateCharacterDto,
  UpdateCharacterDto,
  Franchise
} from '../../../interfaces'
import Image from 'next/image'

interface LocalFormData extends CreateCharacterDto {
  franchiseId: string;
  emojis: string[];
  race: string[];
  ethnicity: string[];
  file1?: File;
  file2?: File;
}

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [formData, setFormData] = useState<LocalFormData>({
    name: '',
    description: '',
    emojis: [''],
    gender: 'MALE',
    race: [''],
    ethnicity: [''],
    hair: '',
    aliveStatus: 'ALIVE',
    isProtagonist: false,
    isAntagonist: false,
    imageUrl1: '',
    imageUrl2: '',
    franchiseIds: [],
    franchiseId: '',
    file1: undefined,
    file2: undefined,
  });
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.franchiseId) {
      showToast('error', 'Nome e franquia são obrigatórios');
      return;
    }

    const dto: CreateCharacterDto | UpdateCharacterDto = {
      name: formData.name,
      description: formData.description,
      emojis: formData.emojis.filter(v => v.trim()),
      gender: formData.gender,
      race: formData.race.filter(v => v.trim()),
      ethnicity: formData.ethnicity.filter(v => v.trim()),
      hair: formData.hair,
      aliveStatus: formData.aliveStatus,
      isProtagonist: formData.isProtagonist,
      isAntagonist: formData.isAntagonist,
      franchiseIds: [formData.franchiseId],
    };

    try {
      let char: Character;
      if (editingCharacter) {
        char = await characterService.update(Number(editingCharacter.id), dto);
        if (formData.file1) {
          char = await characterService.updateImage(Number(editingCharacter.id), formData.file1);
        }
      } else {
        char = await characterService.create(dto, formData.file1);
      }
      if (formData.file2) {
        char = await characterService.updateImage(Number(char.id), formData.file2);
      }

      showToast('success', editingCharacter ? 'Atualizado!' : 'Criado!');
      setIsModalOpen(false);
      setEditingCharacter(null);
      loadCharacters();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Erro ao salvar');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      emojis: [''],
      gender: 'MALE',
      race: [''],
      ethnicity: [''],
      hair: '',
      aliveStatus: 'ALIVE',
      isProtagonist: false,
      isAntagonist: false,
      imageUrl1: '',
      imageUrl2: '',
      franchiseIds: [],
      franchiseId: '',
    })
  }

  const handleDelete = async (character: Character) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${character.name}"?`)) return
    try {
      await characterService.remove(Number(character.id))
      showToast('success', 'Personagem excluído com sucesso')
      loadCharacters()
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Erro ao excluir personagem')
    }
  }

  const openEditModal = (character: Character) => {
    setEditingCharacter(character)
    setFormData({
      name: character.name,
      description: character.description,
      emojis: character.emojis.length ? character.emojis : [''],
      gender: character.gender,
      race: character.race.length ? character.race : [''],
      ethnicity: character.ethnicity.length ? character.ethnicity : [''],
      hair: character.hair,
      aliveStatus: character.aliveStatus,
      isProtagonist: character.isProtagonist,
      isAntagonist: character.isAntagonist,
      imageUrl1: character.imageUrl1 || '',
      imageUrl2: character.imageUrl2 || '',
      franchiseIds: [character.franchiseId],
      franchiseId: character.franchiseId,
    })
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    setEditingCharacter(null)
    resetForm()
    setIsModalOpen(true)
  }

  const addArrayField = (field: 'emojis' | 'race' | 'ethnicity') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }
  const updateArrayField = (field: 'emojis' | 'race' | 'ethnicity', idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((v, i) => (i === idx ? value : v))
    }))
  }
  const removeArrayField = (field: 'emojis' | 'race' | 'ethnicity', idx: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].length > 1
        ? prev[field].filter((_, i) => i !== idx)
        : ['']
    }))
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
          {c.franchiseNames.map((name) => (
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
    {
      key: 'isProtagonist',
      label: 'Tipo',
      render: (c: Character) =>
        c.isProtagonist
          ? 'Protagonista'
          : c.isAntagonist
            ? 'Antagonista'
            : 'Secundário',
    },
    { key: 'aliveStatus', label: 'Status', sortable: true },
    {
      key: 'actions',
      label: 'Ações',
      render: (c: Character) => (
        <div className="flex space-x-2">
          <button onClick={() => openEditModal(c)}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(c)}
            className="p-1 text-red-600 hover:bg-red-100 rounded">
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCharacter ? 'Editar Personagem' : 'Novo Personagem'}
        size="xl"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-900 mb-1">Nome *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-900 mb-1">Franquia *</label>
              <select
                value={formData.franchiseId}
                onChange={e =>
                  setFormData({
                    ...formData,
                    franchiseId: e.target.value,
                    franchiseIds: [e.target.value],
                  })
                }
                required
                className="w-full px-3 py-2 border rounded text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione uma franquia</option>
                {franchises.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-900 mb-1">Gênero</label>
              <select
                value={formData.gender}
                onChange={e =>
                  setFormData({ ...formData, gender: e.target.value as any })
                }
                className="w-full px-3 py-2 border rounded text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-900 mb-1">Status de Vida</label>
              <select
                value={formData.aliveStatus}
                onChange={e =>
                  setFormData({ ...formData, aliveStatus: e.target.value as any })
                }
                className="w-full px-3 py-2 border rounded text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALIVE">Vivo</option>
                <option value="DEAD">Morto</option>
                <option value="UNKNOWN">Desconhecido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-900 mb-1">Cabelo</label>
              <input
                type="text"
                value={formData.hair}
                onChange={e => setFormData({ ...formData, hair: e.target.value })}
                placeholder="Ex: Loiro"
                className="w-full px-3 py-2 border rounded text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center text-gray-900">
                <input
                  type="checkbox"
                  checked={formData.isProtagonist}
                  onChange={e =>
                    setFormData({ ...formData, isProtagonist: e.target.checked })
                  }
                  className="mr-2"
                />
                Protagonista
              </label>
              <label className="flex items-center text-gray-900">
                <input
                  type="checkbox"
                  checked={formData.isAntagonist}
                  onChange={e =>
                    setFormData({ ...formData, isAntagonist: e.target.checked })
                  }
                  className="mr-2"
                />
                Antagonista
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-900 mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border rounded text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-900 mb-1">Upload de Imagem 1</label>
              <input
                type="file"
                accept="image/*"
                onChange={e =>
                  setFormData({ ...formData, file1: e.target.files?.[0] })
                }
                className="w-full text-gray-900 px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-900 mb-1">Upload de Imagem 2</label>
              <input
                type="file"
                accept="image/*"
                onChange={e =>
                  setFormData({ ...formData, file2: e.target.files?.[0] })
                }
                className="w-full text-gray-900 px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {(['emojis', 'race', 'ethnicity'] as const).map(field => (
            <div key={field}>
              <label className="block text-sm text-gray-900 mb-1">
                {field === 'emojis'
                  ? 'Emojis'
                  : field === 'race'
                    ? 'Raças'
                    : 'Etnias'}
              </label>
              {formData[field].map((value, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={value}
                    onChange={e =>
                      updateArrayField(field, idx, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border rounded text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={field === 'emojis' ? '🎭' : 'Digite aqui'}
                  />
                  {formData[field].length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(field, idx)}
                      className="px-2 py-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField(field)}
                className="px-3 py-1 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 text-sm"
              >
                + Adicionar
              </button>
            </div>
          ))}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingCharacter ? 'Atualizar' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
