'use client';

import React, { useState, useEffect } from 'react';
import { DatePicker } from '@/components/DatePicker';
import { StatsDailyTable } from '@/components/StatsDailyTable';
import { statsService } from '@/services/stats';
import type { DailyOverview } from '@/interfaces';

export default function DailyStatsPage() {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState<string>(todayStr);
  const [overview, setOverview] = useState<DailyOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    statsService
      .getDailyOverview(date)
      .then(data => {
        setOverview(data);
      })
      .catch(err => {
        setError(
          err.response?.data?.message ||
            'Erro ao carregar estatísticas. Tente outra data.'
        );
        setOverview(null);
      })
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">
          Estatísticas Diárias
        </h1>
        <DatePicker value={date} onChange={setDate} />
      </div>

      {loading && (
        <p className="text-gray-700">Carregando estatísticas...</p>
      )}

      {error && (
        <p className="text-red-600">{error}</p>
      )}

      {overview && !loading && !error && (
        <StatsDailyTable overview={overview} />
      )}
    </div>
  );
}
