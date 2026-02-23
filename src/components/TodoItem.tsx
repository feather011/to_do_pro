import { useState, useMemo } from 'react';
import type { Todo } from '../types/todo';
import { formatDate, parseISO, isPast, isToday, differenceInDays } from 'date-fns';
import EditTodo from './EditTodo';
import DeleteTodo from './DeleteTodo';
import { useTodoStore } from '../store/todoStore';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const toggleComplete = useTodoStore(state => state.toggleComplete);
  const [isEditing, setIsEditing] = useState(false);

  // 计算任务状态
  const taskStatus = useMemo(() => {
    if (todo.completed) return 'completed';
    
    const dueDate = parseISO(todo.dueDate);
    const now = new Date();
    
    if (isPast(dueDate) && !isToday(dueDate)) return 'overdue';
    if (isToday(dueDate)) return 'dueToday';
    if (differenceInDays(dueDate, now) <= 2) return 'dueSoon';
    return 'normal';
  }, [todo.completed, todo.dueDate]);

  // 优先级配置
  const priorityConfig = {
    high: { 
      label: '高', 
      color: 'bg-red-100 text-red-700 border-red-200',
      dot: 'bg-red-500'
    },
    medium: { 
      label: '中', 
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      dot: 'bg-orange-500'
    },
    low: { 
      label: '低', 
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500'
    },
  };

  // 分类配置
  const categoryConfig = {
    work: { label: '工作', icon: '💼' },
    study: { label: '学习', icon: '📚' },
    life: { label: '生活', icon: '🏠' },
  };

  // 状态样式配置
  const statusConfig = {
    completed: {
      cardBorder: 'border-emerald-200',
      cardBg: 'bg-emerald-50/30',
      titleClass: 'text-gray-400 line-through',
      statusBadge: { label: '已完成', class: 'bg-emerald-100 text-emerald-700' }
    },
    overdue: {
      cardBorder: 'border-red-300',
      cardBg: 'bg-red-50/30',
      titleClass: 'text-gray-800',
      statusBadge: { label: '已逾期', class: 'bg-red-100 text-red-700' }
    },
    dueToday: {
      cardBorder: 'border-amber-300',
      cardBg: 'bg-amber-50/30',
      titleClass: 'text-gray-800',
      statusBadge: { label: '今天', class: 'bg-amber-100 text-amber-700' }
    },
    dueSoon: {
      cardBorder: 'border-orange-300',
      cardBg: 'bg-orange-50/30',
      titleClass: 'text-gray-800',
      statusBadge: { label: '即将到期', class: 'bg-orange-100 text-orange-700' }
    },
    normal: {
      cardBorder: 'border-gray-200',
      cardBg: 'bg-white',
      titleClass: 'text-gray-800',
      statusBadge: null
    }
  };

  const status = statusConfig[taskStatus];
  const priority = priorityConfig[todo.priority];
  const category = categoryConfig[todo.category];

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl border-2 border-blue-300 p-4 sm:p-6 shadow-sm">
        <EditTodo 
          todo={todo} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className={`group rounded-lg sm:rounded-xl border-2 ${status.cardBorder} ${status.cardBg} p-3 sm:p-5 transition-all hover:shadow-md`}>
      {/* 顶部：复选框 + 标题 + 操作按钮 */}
      <div className="flex items-start gap-2 sm:gap-4">
        {/* 完成状态复选框 */}
        <button
          onClick={() => toggleComplete(todo.id)}
          className={`mt-0.5 sm:mt-1 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all flex items-center justify-center ${
            todo.completed 
              ? 'bg-emerald-500 border-emerald-500' 
              : 'border-gray-300 hover:border-emerald-400'
          }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          {/* 标题行 */}
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-sm sm:text-lg font-semibold leading-tight ${status.titleClass} truncate pr-2`}>
              {todo.title}
            </h3>
            
            {/* 操作按钮 - 移动端始终显示，桌面端悬停显示 */}
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="编辑"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <DeleteTodo todo={todo} />
            </div>
          </div>

          {/* 描述 */}
          {todo.description && (
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
              {todo.description}
            </p>
          )}

          {/* 底部：标签区域 */}
          <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* 优先级标签 */}
            <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${priority.color}`}>
              <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${priority.dot}`} />
              <span className="hidden sm:inline">{priority.label}</span>
              <span className="sm:hidden">{priority.label.charAt(0)}</span>
            </span>

            {/* 分类标签 */}
            <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </span>

            {/* 状态标签 */}
            {status.statusBadge && (
              <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${status.statusBadge.class}`}>
                {status.statusBadge.label}
              </span>
            )}

            {/* 截止日期 */}
            <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
              taskStatus === 'overdue' ? 'bg-red-100 text-red-700' :
              taskStatus === 'dueToday' ? 'bg-amber-100 text-amber-700' :
              taskStatus === 'dueSoon' ? 'bg-orange-100 text-orange-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(todo.dueDate, 'MM/dd')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
