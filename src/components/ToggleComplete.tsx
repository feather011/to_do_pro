import { useTodoStore } from '../store/todoStore';
import type { Todo } from '../types/todo';

/**
 * ToggleComplete 组件属性
 */
interface ToggleCompleteProps {
  /** 要切换状态的待办事项 */
  todo: Todo;
}

/**
 * ToggleComplete 组件
 * 用于切换待办事项的完成/未完成状态
 * 完成后标记为"已完成"（划掉标题、变更样式）
 */
const ToggleComplete: React.FC<ToggleCompleteProps> = ({ todo }) => {
  // 从 store 获取切换方法
  const toggleComplete = useTodoStore(state => state.toggleComplete);

  /**
   * 处理切换完成状态
   */
  const handleToggle = () => {
    toggleComplete(todo.id);
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 w-full text-left ${
        todo.completed
          ? 'bg-green-50 border-green-300 hover:bg-green-100'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}
    >
      {/* 复选框 */}
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 bg-white'
        }`}
      >
        {todo.completed && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 min-w-0">
        {/* 标题 */}
        <h3
          className={`font-medium transition-all duration-300 truncate ${
            todo.completed
              ? 'text-gray-500 line-through'
              : 'text-gray-800'
          }`}
        >
          {todo.title}
        </h3>

        {/* 描述 */}
        {todo.description && (
          <p
            className={`text-sm mt-0.5 transition-all duration-300 line-clamp-1 ${
              todo.completed ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {todo.description}
          </p>
        )}
      </div>

      {/* 完成状态标签 */}
      <div
        className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium transition-all duration-300 ${
          todo.completed
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {todo.completed ? '已完成' : '未完成'}
      </div>
    </button>
  );
};

export default ToggleComplete;
