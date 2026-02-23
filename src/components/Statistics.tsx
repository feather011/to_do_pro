import React from 'react';
import { useTodoStore } from '../store/todoStore';

const Statistics: React.FC = () => {
  const getStatistics = useTodoStore(state => state.getStatistics);
  const { total, completed, pending, dueSoon } = getStatistics();

  const stats = [
    { label: '总数', value: total, color: 'bg-blue-500', icon: '📊' },
    { label: '已完成', value: completed, color: 'bg-green-500', icon: '✅' },
    { label: '未完成', value: pending, color: 'bg-yellow-500', icon: '⏳' },
    { label: '即将到期', value: dueSoon, color: 'bg-red-500', icon: '⏰' },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center text-white`}>
              <span className="text-lg">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
