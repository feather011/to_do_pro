import { useTodoStore } from '../store/todoStore';
import type { Priority, Category } from '../types/todo';

const Filter: React.FC = () => {
  const filter = useTodoStore(state => state.filter);
  const setFilter = useTodoStore(state => state.setFilter);
  const searchTerm = useTodoStore(state => state.searchTerm);
  const setSearchTerm = useTodoStore(state => state.setSearchTerm);

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">筛选选项</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 搜索 */}
        <div className="md:col-span-4">
          <input
            type="text"
            placeholder="搜索待办事项..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 分类筛选 */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">分类</label>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ category: e.target.value as Category | 'all' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部</option>
            <option value="work">工作</option>
            <option value="study">学习</option>
            <option value="life">生活</option>
          </select>
        </div>

        {/* 优先级筛选 */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">优先级</label>
          <select
            value={filter.priority}
            onChange={(e) => setFilter({ priority: e.target.value as Priority | 'all' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>

        {/* 状态筛选 */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">状态</label>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ status: e.target.value as 'all' | 'completed' | 'pending' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部</option>
            <option value="pending">未完成</option>
            <option value="completed">已完成</option>
          </select>
        </div>

        {/* 重置按钮 */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setFilter({ category: 'all', priority: 'all', status: 'all' });
              setSearchTerm('');
            }}
            className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            重置筛选
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
