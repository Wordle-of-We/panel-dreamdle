// src/components/StatsDailyTable.tsx
import React from 'react';
import type { DailyOverview } from '../interfaces';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StatsDailyTableProps {
  overview: DailyOverview;
}

export const StatsDailyTable: React.FC<StatsDailyTableProps> = ({ overview }) => {
  const {
    date = '',
    totalUsersEver,
    totalNewUsers,
    totalInitiatedPlays,
    totalCompletedPlays,
    totalUncompletedPlays,
    playsByMode,
  } = overview;

  let parsedDate = new Date();
  if (typeof date === 'string' && date.trim() !== '') {
    const iso = parseISO(date);
    if (!isNaN(iso.getTime())) {
      parsedDate = iso;
    } else {
      const jsDate = new Date(date);
      if (!isNaN(jsDate.getTime())) {
        parsedDate = jsDate;
      }
    }
  }

  const formattedDate = format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Estatísticas — {formattedDate}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Usuários (totais)</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalUsersEver}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Novos Usuários</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalNewUsers}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Jogos Iniciados</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalInitiatedPlays}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Jogos Completos</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalCompletedPlays}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Não Completos</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalUncompletedPlays}</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Modo
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Iniciados
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Completos
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Não Completos
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Object.entries(playsByMode).map(([modeName, stats]) => (
              <tr key={modeName}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {modeName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                  {stats.initiated}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                  {stats.completed}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                  {stats.uncompleted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
