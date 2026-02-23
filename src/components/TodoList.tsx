import { useMemo } from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const todos = useTodoStore(state => state.todos);
  const filter = useTodoStore(state => state.filter);
  const searchTerm = useTodoStore(state => state.searchTerm);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter.category !== 'all' && todo.category !== filter.category) {
        return false;
      }

      if (filter.priority !== 'all' && todo.priority !== filter.priority) {
        return false;
      }

      if (filter.status === 'completed' && !todo.completed) {
        return false;
      }
      if (filter.status === 'pending' && todo.completed) {
        return false;
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [todos, filter, searchTerm]);

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchTerm ? '未找到匹配的任务' : '暂无待办事项'}
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          {searchTerm 
            ? '尝试调整搜索关键词或筛选条件' 
            : '点击上方的"添加任务"按钮创建你的第一个待办事项'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;
