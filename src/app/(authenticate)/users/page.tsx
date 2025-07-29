'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '../../../components/DataTable';
import { useToast } from '../../../hooks/useToast';
import { userService } from '../../../services/users';
import type { User } from '../../../interfaces';
import { format } from 'date-fns';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    userService.getAll()
      .then(setUsers)
      .catch(err => {
        showToast('error', err.response?.data?.message || 'Erro ao carregar usuários');
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'email', label: 'E-mail', sortable: true },
    {
      key: 'role',
      label: 'Permissão',
      sortable: true,
      render: (u: User) => (u.role === 'ADMIN' ? 'Admin' : 'Usuário'),
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      sortable: true,
      render: (u: User) =>
        format(new Date(u.createdAt), 'dd/MM/yyyy HH:mm'),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Usuários Cadastrados</h1>

      <DataTable
        data={users}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar usuários..."
      />
    </div>
  );
}
