import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { BaseModal, ModalSize } from './BaseModal';
import type { Franchise } from '../interfaces';

interface FranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; file?: File; imageUrl?: string }) => void;
  initialData?: Pick<Franchise, 'name' | 'imageUrl'>;
  loading?: boolean;
  size?: ModalSize;
}

export const FranchiseModal: React.FC<FranchiseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  loading = false,
  size = 'md',
}) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setImageUrl(initialData.imageUrl || '');
      setFile(undefined);
      setPreviewUrl(initialData.imageUrl);
    } else {
      setName('');
      setImageUrl('');
      setFile(undefined);
      setPreviewUrl(undefined);
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    if (!file && imageUrl) {
      setPreviewUrl(imageUrl);
    }
  }, [file, imageUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name: name.trim(), file, imageUrl: imageUrl.trim() || undefined });
  };

  const footer = (
    <>
      <button
        type="submit"
        form="franchise-form"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading || !name.trim()}
      >
        {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
      </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Franquia' : 'Nova Franquia'}
      footer={footer}
      size={size}
    >
      <form id="franchise-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Franquia *
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded placeholder:text-gray-700 text-black"
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
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded placeholder:text-gray-700 text-black"
            placeholder="https://"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload de Imagem (opcional)
          </label>
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0])}
              className="hidden"
            />
            <div
              className="
                flex items-center justify-center
                px-4 py-2
                bg-gray-800 text-white
                rounded-md
                cursor-pointer
                hover:bg-gray-700
                focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-600
                transition
              "
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>Selecionar Imagem</span>
            </div>
          </label>

          {initialData && previewUrl && (
            <img
              src={previewUrl}
              alt="Preview da franquia"
              className="mt-2 w-full max-h-60 object-contain rounded border border-gray-300"
            />
          )}
        </div>
      </form>
    </BaseModal>
  );
};
