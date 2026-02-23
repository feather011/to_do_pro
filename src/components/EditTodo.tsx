import { useState, useEffect } from 'react';
import { useTodoStore } from '../store/todoStore';
import type { Todo } from '../types/todo';

/**
 * 表单错误类型
 */
interface FormErrors {
  title?: string;
  dueDate?: string;
}

/**
 * EditTodo 组件属性
 */
interface EditTodoProps {
  /** 要编辑的待办事项 */
  todo: Todo;
  /** 取消编辑回调 */
  onCancel: () => void;
}

/**
 * EditTodo 组件
 * 用于编辑已创建的待办事项，支持修改所有字段
 */
const EditTodo: React.FC<EditTodoProps> = ({ todo, onCancel }) => {
  // 从 store 获取更新方法
  const updateTodo = useTodoStore(state => state.updateTodo);

  // 表单数据状态
  const [formData, setFormData] = useState<Todo>({ ...todo });

  // 表单错误状态
  const [errors, setErrors] = useState<FormErrors>({});

  // 同步外部 todo 变化
  useEffect(() => {
    setFormData({ ...todo });
  }, [todo]);

  /**
   * 处理表单字段变化
   * @param e - 表单元素变化事件
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // 清除对应字段的错误
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /**
   * 验证表单数据
   * @returns 是否验证通过
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 验证标题
    if (!formData.title.trim()) {
      newErrors.title = '请输入标题';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = '标题不能超过100个字符';
    }

    // 验证截止日期
    if (!formData.dueDate) {
      newErrors.dueDate = '请选择截止日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 处理表单提交
   * @param e - 表单提交事件
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证表单
    if (!validateForm()) {
      return;
    }

    // 更新待办事项（自动同步到 LocalStorage）
    updateTodo(todo.id, formData);

    // 关闭编辑模式
    onCancel();
  };

  /**
   * 处理取消编辑
   */
  const handleCancel = () => {
    // 重置为原始数据
    setFormData({ ...todo });
    setErrors({});
    onCancel();
  };

  return (
    <div className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200 shadow-inner">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">✏️</span>
        编辑待办事项
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          {/* 标题输入 */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="输入待办事项标题"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* 描述输入 */}
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors resize-none"
              placeholder="输入待办事项描述（可选）"
              rows={3}
            />
          </div>

          {/* 分类和优先级 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 分类选择 */}
            <div>
              <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                分类
              </label>
              <select
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors bg-white"
              >
                <option value="work">工作</option>
                <option value="study">学习</option>
                <option value="life">生活</option>
              </select>
            </div>

            {/* 优先级选择 */}
            <div>
              <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700 mb-1">
                优先级
              </label>
              <select
                id="edit-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors bg-white"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
          </div>

          {/* 截止日期和完成状态 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 截止日期 */}
            <div>
              <label htmlFor="edit-dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                截止日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="edit-dueDate"
                name="dueDate"
                value={formData.dueDate.split('T')[0]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
              )}
            </div>

            {/* 完成状态 */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.completed}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, completed: e.target.checked }))
                  }
                  className="h-5 w-5 text-yellow-500 rounded focus:ring-yellow-500 border-gray-300"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  标记为已完成
                </span>
              </label>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-md hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-sm"
            >
              保存修改
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              取消
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTodo;
