'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { BaseModal } from '../../../components/BaseModal'
import { gameModeService } from '../../../services/gameMode'
import type { GameMode } from '../../../interfaces'
import { useToast } from '../../../hooks/useToast'

export default function GameModesPage() {
  const [modes, setModes] = useState<GameMode[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [current, setCurrent] = useState<GameMode | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    isActive: true,
  })
  const { showToast } = useToast()

  const loadModes = async () => {
    setLoading(true)
    try {
      const data = await gameModeService.getAll()
      setModes(data)
    } catch {
      showToast('error', 'Erro ao carregar modos de jogo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadModes()
  }, [])

  const openCreate = () => {
    setIsEditing(false)
    setCurrent(null)
    setForm({ name: '', description: '', isActive: true })
    setShowModal(true)
  }

  const openEdit = (mode: GameMode) => {
    setIsEditing(true)
    setCurrent(mode)
    setForm({
      name: mode.name,
      description: mode.description,
      isActive: mode.isActive,
    })
    setShowModal(true)
  }

  const handleDelete = async (mode: GameMode) => {
    if (!confirm(`Deletar modo "${mode.name}"?`)) return
    try {
      await gameModeService.remove(Number(mode.id))
      showToast('success', 'Modo deletado')
      loadModes()
    } catch {
      showToast('error', 'Erro ao deletar')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && current) {
        await gameModeService.update(Number(current.id), form)
        showToast('success', 'Modo atualizado')
      } else {
        await gameModeService.create(form)
        showToast('success', 'Modo criado')
      }
      setShowModal(false)
      loadModes()
    } catch {
      showToast('error', 'Erro ao salvar')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Modos de Jogo</h1>
        <button
          onClick={openCreate}
          className="flex items-center px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Modo
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-700">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-2"
            >
              <h2 className="text-lg font-semibold text-gray-800">{mode.name}</h2>
              <p className="text-sm text-gray-700">{mode.description}</p>
              <p className="text-sm text-gray-700">
                Status:{' '}
                <span className="font-medium">
                  {mode.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEdit(mode)}
                  className="flex items-center px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  <Edit className="w-4 h-4 mr-1" /> Editar
                </button>
                <button
                  onClick={() => handleDelete(mode)}
                  className="flex items-center px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <BaseModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={isEditing ? 'Editar Modo' : 'Novo Modo'}
          footer={
            <button
              type="submit"
              form="mode-form"
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
            >
              {isEditing ? 'Atualizar' : 'Criar'}
            </button>
          }
        >
          <form id="mode-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
                className="h-5 w-5 text-blue-800 border-gray-400 rounded focus:ring-blue-700"
              />
              <label className="text-sm font-medium text-gray-800">Ativo?</label>
            </div>
          </form>
        </BaseModal>
      )}
    </div>
  )
}
