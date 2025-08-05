import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { BaseModal, ModalSize } from './BaseModal'
import type { Franchise, Character, CreateCharacterDto } from '../interfaces'

export interface CharacterModalData
  extends Omit<CreateCharacterDto, 'isProtagonist' | 'isAntagonist'> {
  franchiseIds: string[]
  emojis: string[]
  race: string[]
  ethnicity: string[]
  paper?: string[]
  file1?: File
  file2?: File
}

interface CharacterModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CharacterModalData) => void
  initialData?: Character & { franchiseIds: string[] }
  franchises: Franchise[]
  loading?: boolean
  size?: ModalSize
}

const defaultForm = (): CharacterModalData => ({
  name: '',
  description: '',
  emojis: ['', '', '', '', ''],
  race: [''],
  ethnicity: [''],
  gender: 'MALE',
  hair: '',
  aliveStatus: 'ALIVE',
  paper: [''],
  franchiseIds: [],
  imageUrl1: '',
  imageUrl2: '',
})

export const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  franchises,
  loading = false,
  size = 'xl',
}) => {
  const [form, setForm] = useState<CharacterModalData>(defaultForm())
  const [preview1, setPreview1] = useState<string>()
  const [preview2, setPreview2] = useState<string>()

  useEffect(() => {
    if (initialData) {
      const paddedEmojis = Array.from(
        { length: 5 },
        (_, i) => initialData.emojis[i] ?? ''
      )

      setForm({
        name: initialData.name,
        description: initialData.description,
        emojis: paddedEmojis,
        race: initialData.race.length ? initialData.race : [''],
        ethnicity: initialData.ethnicity.length ? initialData.ethnicity : [''],
        gender: initialData.gender,
        hair: initialData.hair,
        aliveStatus: initialData.aliveStatus,
        paper: Array.isArray(initialData.paper) ? initialData.paper : [''],
        franchiseIds: initialData.franchiseIds,
        imageUrl1: initialData.imageUrl1 ?? '',
        imageUrl2: initialData.imageUrl2 ?? '',
      })
      setPreview1(initialData.imageUrl1 ?? undefined)
      setPreview2(initialData.imageUrl2 ?? undefined)
    } else {
      setForm(defaultForm())
      setPreview1(undefined)
      setPreview2(undefined)
    }
  }, [initialData, isOpen])

  const handleChange = <K extends keyof CharacterModalData>(key: K, value: CharacterModalData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleArrayChange = (key: 'emojis' | 'race' | 'ethnicity' | 'paper', idx: number, value: string) => {
    const arr = [...(form[key] ?? [])]; arr[idx] = value
    handleChange(key, arr as any)
  }

  const handleAddField = (key: 'race' | 'ethnicity' | 'paper') =>
    handleChange(key, [...(form[key] ?? []), ''] as any)

  const handleRemoveField = (key: 'race' | 'ethnicity' | 'paper', idx: number) => {
    const arr = (form[key] ?? []).filter((_, i) => i !== idx)
    handleChange(key, (arr.length ? arr : ['']) as any)
  }

  const handleFileChange = (key: 'file1' | 'file2', file?: File) => {
    handleChange(key, file as any)
    const url = file ? URL.createObjectURL(file) : undefined
    if (key === 'file1') setPreview1(url)
    else setPreview2(url)
  }

  useEffect(() => () => {
    preview1 && URL.revokeObjectURL(preview1)
    preview2 && URL.revokeObjectURL(preview2)
  }, [preview1, preview2])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Personagem' : 'Novo Personagem'}
      footer={
        <button
          type="submit"
          form="character-form"
          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition"
          disabled={loading || !form.name.trim() || form.franchiseIds.length === 0}
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      }
      size={size}
    >
      <form
        id="character-form"
        onSubmit={handleSubmit}
        className="space-y-6 text-gray-800 placeholder-gray-500"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">Nome *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Franquias *</label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-700 rounded p-2">
            {franchises.map(f => {
              const id = f.id.toString()
              const checked = form.franchiseIds.includes(id)
              return (
                <label key={id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={e => {
                      const next = e.target.checked
                        ? [...form.franchiseIds, id]
                        : form.franchiseIds.filter(x => x !== id)
                      handleChange('franchiseIds', next as any)
                    }}
                    className="h-4 w-4 text-gray-900 border-gray-700 rounded focus:ring-gray-600"
                  />
                  <span className="text-gray-800">{f.name}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Paper</label>
          {form.paper?.map((val, idx) => (
            <div key={idx} className="flex items-center space-x-2 mb-2">
              <input
          type="text"
          value={val}
          onChange={e => handleArrayChange('paper', idx, e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
          placeholder="Ex: Paper 1"
              />
              <button
          type="button"
          onClick={() => handleRemoveField('paper', idx)}
          className="px-2 py-1 text-red-700 hover:bg-red-100 rounded"
              >
          ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('paper')}
            className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            + Adicionar Paper
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Gênero</label>
            <select
              value={form.gender}
              onChange={e => handleChange('gender', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Feminino</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Status de Vida</label>
            <select
              value={form.aliveStatus}
              onChange={e => handleChange('aliveStatus', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <option value="ALIVE">Vivo</option>
              <option value="DEAD">Morto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Cabelo</label>
            <input
              type="text"
              value={form.hair}
              onChange={e => handleChange('hair', e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Descrição</label>
          <textarea
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(['file1', 'file2'] as const).map(key => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-1">
                Upload Imagem {key === 'file1' ? '1' : '2'} (opcional)
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-2 bg-gray-900 text-white rounded cursor-pointer hover:bg-gray-800">
                  <Plus className="w-5 h-5 mr-2" />
                  Selecionar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange(key, e.target.files?.[0])}
                    className="hidden"
                  />
                </label>
                {(key === 'file1' ? preview1 : preview2) && (
                  <img
                    src={key === 'file1' ? preview1 : preview2}
                    alt="Pré-visualização"
                    className="w-16 h-16 object-cover rounded border border-gray-700"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Emojis (até 5)</label>
          <div className="grid grid-cols-5 gap-2">
            {form.emojis.map((emoji, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={2}
                value={emoji}
                onChange={e => handleArrayChange('emojis', idx, e.target.value)}
                className="px-2 py-2 border border-gray-700 rounded text-center focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
                placeholder="😊"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Raça ou tipo</label>
          {form.race.map((val, idx) => (
            <div key={idx} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={val}
                onChange={e => handleArrayChange('race', idx, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
                placeholder="Ex: Humano"
              />
              <button
                type="button"
                onClick={() => handleRemoveField('race', idx)}
                className="px-2 py-1 text-red-700 hover:bg-red-100 rounded"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('race')}
            className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            + Adicionar Raça
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Etnia ou cor</label>
          {form.ethnicity.map((val, idx) => (
            <div key={idx} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={val}
                onChange={e => handleArrayChange('ethnicity', idx, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
                placeholder="Ex: Latina"
              />
              <button
                type="button"
                onClick={() => handleRemoveField('ethnicity', idx)}
                className="px-2 py-1 text-red-700 hover:bg-red-100 rounded"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('ethnicity')}
            className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            + Adicionar Etnia
          </button>
        </div>
      </form>
    </BaseModal>
  )
}
