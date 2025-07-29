import React from 'react';
import { X } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
}

const sizeMap: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        className={`relative bg-white rounded-lg shadow-xl w-full ${sizeMap[size]} flex flex-col max-h-full animate-in zoom-in duration-200`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end space-x-2 px-6 py-4 border-t flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
