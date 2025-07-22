'use client';

import React from 'react';
import {
  Home,
  Users,
  Zap,
  TowerControl as GameController2,
  Play,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'franchises', label: 'Franquias', icon: Zap },
  { id: 'characters', label: 'Personagens', icon: Users },
  { id: 'game-modes', label: 'Modos de Jogo', icon: GameController2 },
  { id: 'games', label: 'Partidas', icon: Play },
  { id: 'attempts', label: 'Tentativas', icon: Target },
  { id: 'users', label: 'Usuários', icon: Users },
  { id: 'logs', label: 'Logs de Acesso', icon: BarChart3 },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (id: string) => pathname?.includes(id);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div className={`
        fixed lg:static top-0 left-0 z-30 w-66 bg-gray-900 text-white
        transform transition-transform duration-200 ease-in-out
        h-screen overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-screen overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold text-blue-400">DreamWorks Admin</h1>
            <button
              onClick={onToggle}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-full">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm">
                {user ? (
                  <p className="font-stretch-extra-condensed text-white">{user.email}</p>
                ) : (
                  <p className="text-gray-400 italic">Carregando...</p>
                )}
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        router.push(`/${item.id}`);
                        if (window.innerWidth < 1024) onToggle();
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                        ${isActive(item.id)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
};
