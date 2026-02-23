import { useState } from 'react';
import { useTodoStore } from '../store/todoStore';
import type { Todo } from '../types/todo';

/**
 * DeleteTodo 组件属性
 */
interface DeleteTodoProps {
  /** 要删除的待办事项 */
  todo: Todo;
  /** 删除成功后的回调 */
  onDelete?: () => void;
}

/**
 * DeleteTodo 组件
 * 用于删除待办事项，操作前显示确认对话框防止误删
 */
const DeleteTodo: React.FC<DeleteTodoProps> = ({ todo, onDelete }) => {
  // 从 store 获取删除方法
  const deleteTodo = useTodoStore(state => state.deleteTodo);

  // 确认对话框显示状态
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * 处理删除按钮点击
   * 显示确认对话框
   */
  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  /**
   * 确认删除
   */
  const handleConfirmDelete = () => {
    deleteTodo(todo.id);
    setShowConfirm(false);
    // 调用外部回调
    onDelete?.();
  };

  /**
   * 取消删除
   */
  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {/* 删除按钮 */}
      <button
        onClick={handleDeleteClick}
        className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200"
        title="删除待办事项"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {/* 确认对话框 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            {/* 警告图标 */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* 标题 */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              确认删除
            </h3>

            {/* 提示信息 */}
            <p className="text-gray-600 text-center mb-4">
              您确定要删除以下待办事项吗？
            </p>

            {/* 待办事项信息 */}
            <div className="bg-gray-50 rounded-md p-3 mb-6">
              <p className="font-medium text-gray-800 truncate">{todo.title}</p>
              {todo.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {todo.description}
                </p>
              )}
            </div>

            {/* 警告提示 */}
            <p className="text-sm text-red-500 text-center mb-6">
              ⚠️ 此操作不可撤销
            </p>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-sm"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteTodo;
