import { useTodoStore } from '../store/todoStore';
import type { Priority, Category } from '../types/todo';

const Filter: React.FC = () => {
  const filter = useTodoStore(state => state.filter);
  const setFilter = useTodoStore(state => state.setFilter);
  const searchTerm = useTodoStore(state => state.searchTerm);
  const setSearchTerm = useTodoStore(state => state.setSearchTerm);

  const hasActiveFilters = filter.category !== 'all' || filter.priority !== 'all' || filter.status !== 'all' || searchTerm !== '';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* 搜索框 */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="搜索任务标题或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* 筛选器组 */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 分类筛选 */}
          <div className="relative">
            <select
              value={filter.category}
              onChange={(e) => setFilter({ category: e.target.value as Category | 'all' })}
              className="appearance-none pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer min-w-[100px]"
            >
              <option value="all">全部分类</option>
              <option value="work">💼 工作</option>
              <option value="study">📚 学习</option>
              <option value="life">🏠 生活</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* 优先级筛选 */}
          <div className="relative">
            <select
              value={filter.priority}
              onChange={(e) => setFilter({ priority: e.target.value as Priority | 'all' })}
              className="appearance-none pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer min-w-[100px]"
            >
              <option value="all">全部优先级</option>
              <option value="high">🔴 高</option>
              <option value="medium">🟠 中</option>
              <option value="low">🟢 低</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* 状态筛选 */}
          <div className="relative">
            <select
              value={filter.status}
              onChange={(e) => setFilter({ status: e.target.value as 'all' | 'completed' | 'pending' })}
              className="appearance-none pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer min-w-[100px]"
            >
              <option value="all">全部状态</option>
              <option value="pending">⏳ 进行中</option>
              <option value="completed">✅ 已完成</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* 重置按钮 */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setFilter({ category: 'all', priority: 'all', status: 'all' });
                setSearchTerm('');
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重置
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
