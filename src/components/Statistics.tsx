import { useMemo } from 'react';
import { useTodoStore } from '../store/todoStore';
import { parseISO, differenceInDays, isPast, isToday } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Statistics: React.FC = () => {
  const todos = useTodoStore(state => state.todos);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;

    const now = new Date();
    const overdue = todos.filter(todo => {
      if (todo.completed) return false;
      const dueDate = parseISO(todo.dueDate);
      return isPast(dueDate) && !isToday(dueDate);
    }).length;

    const dueSoon = todos.filter(todo => {
      if (todo.completed) return false;
      const dueDate = parseISO(todo.dueDate);
      const diffDays = differenceInDays(dueDate, now);
      return diffDays >= 0 && diffDays <= 2 && !isToday(dueDate);
    }).length;

    const dueToday = todos.filter(todo => {
      if (todo.completed) return false;
      return isToday(parseISO(todo.dueDate));
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, dueSoon, dueToday, completionRate };
  }, [todos]);

  const pieData = [
    { name: '已完成', value: stats.completed, color: '#10b981' },
    { name: '未完成', value: stats.pending, color: '#6b7280' },
  ].filter(item => item.value > 0);

  const statCards = [
    { 
      label: '总任务', 
      value: stats.total, 
      icon: '📊',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    { 
      label: '已完成', 
      value: stats.completed, 
      icon: '✅',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    { 
      label: '进行中', 
      value: stats.pending, 
      icon: '⏳',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200'
    },
    { 
      label: '今日到期', 
      value: stats.dueToday, 
      icon: '📅',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200'
    },
    { 
      label: '即将到期', 
      value: stats.dueSoon, 
      icon: '⏰',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    { 
      label: '已逾期', 
      value: stats.overdue, 
      icon: '⚠️',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* 统计卡片网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div 
            key={card.label}
            className={`${card.bgColor} ${card.borderColor} border rounded-xl p-4 transition-all hover:shadow-md`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{card.icon}</span>
              <div>
                <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                <p className="text-xs text-gray-500 font-medium">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 完成率展示 */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 进度条卡片 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">任务完成率</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${stats.completionRate * 2.51} 251`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-800">{stats.completionRate}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">已完成</span>
                    <span className="font-medium text-emerald-600">{stats.completed}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">进行中</span>
                    <span className="font-medium text-gray-600">{stats.pending}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-400 rounded-full transition-all duration-500"
                      style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 饼图卡片 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">任务分布</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
