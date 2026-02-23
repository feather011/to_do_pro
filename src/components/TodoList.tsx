import { useMemo } from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  // 订阅所有需要的状态
  const todos = useTodoStore(state => state.todos);
  const filter = useTodoStore(state => state.filter);
  const searchTerm = useTodoStore(state => state.searchTerm);

  // 使用 useMemo 计算筛选后的列表
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // 按分类筛选
      if (filter.category !== 'all' && todo.category !== filter.category) {
        return false;
      }

      // 按优先级筛选
      if (filter.priority !== 'all' && todo.priority !== filter.priority) {
        return false;
      }

      // 按状态筛选
      if (filter.status === 'completed' && !todo.completed) {
        return false;
      }
      if (filter.status === 'pending' && todo.completed) {
        return false;
      }

      // 按搜索关键词筛选
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
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-500 text-lg">暂无待办事项</p>
        <p className="text-gray-400 text-sm mt-2">点击上方按钮添加新的待办事项</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;
