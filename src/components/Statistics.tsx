import { useMemo } from 'react';
import { useTodoStore } from '../store/todoStore';
import { parseISO, differenceInDays } from 'date-fns';

const Statistics: React.FC = () => {
  // 订阅待办事项列表
  const todos = useTodoStore(state => state.todos);

  // 使用 useMemo 计算统计数据
  const { total, completed, pending, dueSoon } = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;

    // 计算即将到期（2天内）的待办事项数量
    const now = new Date();
    const dueSoon = todos.filter(todo => {
      if (todo.completed) return false;
      const dueDate = parseISO(todo.dueDate);
      const diffDays = differenceInDays(dueDate, now);
      return diffDays >= 0 && diffDays <= 2;
    }).length;

    return { total, completed, pending, dueSoon };
  }, [todos]);

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
