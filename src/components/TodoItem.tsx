import { useState } from 'react';
import type { Todo } from '../types/todo';
import { formatDate, isOverdue, getRelativeTime } from '../utils/dateUtils';
import EditTodo from './EditTodo';
import DeleteTodo from './DeleteTodo';
import { useTodoStore } from '../store/todoStore';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const toggleComplete = useTodoStore(state => state.toggleComplete);
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category: Todo['category']) => {
    switch (category) {
      case 'work': return '工作';
      case 'study': return '学习';
      case 'life': return '生活';
      default: return category;
    }
  };

  const getPriorityLabel = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return priority;
    }
  };

  const overdue = isOverdue(todo.dueDate) && !todo.completed;

  if (isEditing) {
    return (
      <div className="mb-4">
        <EditTodo todo={todo} onCancel={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className={`mb-4 p-4 bg-white rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow ${
      todo.completed ? 'border-green-200 bg-green-50' : overdue ? 'border-red-300' : 'border-gray-200'
    }`}>
      <div className="flex items-start gap-3">
        {/* 完成状态切换 */}
        <button
          onClick={() => toggleComplete(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            todo.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {todo.completed && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          {/* 标题 */}
          <h3 className={`font-semibold text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.title}
          </h3>

          {/* 描述 */}
          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {getCategoryLabel(todo.category)}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(todo.priority)}`}>
              {getPriorityLabel(todo.priority)}优先级
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              overdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
            }`}>
              {overdue ? '已过期' : getRelativeTime(todo.dueDate)}
            </span>
          </div>

          {/* 日期信息 */}
          <p className="mt-2 text-xs text-gray-400">
            截止: {formatDate(todo.dueDate)}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-md transition-colors"
            title="编辑"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <DeleteTodo todo={todo} />
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
