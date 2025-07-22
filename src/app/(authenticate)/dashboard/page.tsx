'use client'

import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Users, TowerControl as GameController2, Target } from 'lucide-react';
import api from '../../../services/api';
import { KPI } from '../../../interfaces';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    try {
      const response = await api.get('/admin/dashboard/kpis');
      setKpis(response.data);
    } catch (error) {
      console.error('Erro ao carregar KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total de Usuários',
      value: kpis?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Usuários Ativos',
      value: kpis?.activeUsers || 0,
      icon: Users,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Partidas Diárias',
      value: kpis?.dailyGames || 0,
      icon: GameController2,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Total de Tentativas',
      value: kpis?.totalAttempts || 0,
      icon: Target,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  const accessData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Acessos',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Tentativas',
        data: [8, 15, 25, 35, 20, 15],
        borderColor: 'rgb(5, 150, 105)',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const modeUsageData = {
    labels: ['Características', 'Descrição', 'Imagem', 'Emoji'],
    datasets: [
      {
        data: [30, 25, 25, 20],
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(5, 150, 105, 0.8)',
          'rgba(234, 88, 12, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const attemptsData = {
    labels: ['Características', 'Descrição', 'Imagem', 'Emoji'],
    datasets: [
      {
        label: 'Tentativas',
        data: [120, 95, 80, 65],
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
      },
      {
        label: 'Acertos',
        data: [85, 70, 55, 45],
        backgroundColor: 'rgba(5, 150, 105, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={loadKPIs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${kpi.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value.toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Acessos vs tentativas (24h)
          </h3>
          <Line data={accessData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uso por Modo de Jogo
          </h3>
          <Pie data={modeUsageData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tentativas vs Acertos por Modo
          </h3>
          <Bar data={attemptsData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Personagens por Modo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(kpis?.topCharacters || {}).map(([mode, characters]) => (
              <div key={mode} className="space-y-2">
                <h4 className="font-medium text-gray-900">{mode}</h4>
                {characters.map((char, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{char.character}</span>
                    <span className="font-medium">{char.count}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
