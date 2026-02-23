import { useState } from 'react';
import { useTodoStore } from '../store/todoStore';
import type { Priority, Category } from '../types/todo';
import { getTodayString } from '../utils/dateUtils';
import { isBefore, startOfDay } from 'date-fns';

/**
 * 表单数据类型
 */
interface FormData {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  completed: boolean;
}

/**
 * 表单错误类型
 */
interface FormErrors {
  title?: string;
  dueDate?: string;
}

/**
 * AddTodo 组件
 * 用于添加新的待办事项，包含表单输入和验证
 */
const AddTodo: React.FC = () => {
  // 从 store 获取添加方法
  const addTodo = useTodoStore(state => state.addTodo);

  // 表单展开状态
  const [isExpanded, setIsExpanded] = useState(false);

  // 表单数据状态
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'life',
    priority: 'medium',
    dueDate: getTodayString(),
    completed: false,
  });

  // 表单错误状态
  const [errors, setErrors] = useState<FormErrors>({});

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
    } else {
      const selectedDate = new Date(formData.dueDate);
      if (isBefore(selectedDate, startOfDay(new Date()))) {
        newErrors.dueDate = '截止日期不能早于今天';
      }
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

    // 添加待办事项
    addTodo(formData);

    // 重置表单
    setFormData({
      title: '',
      description: '',
      category: 'life',
      priority: 'medium',
      dueDate: getTodayString(),
      completed: false,
    });

    // 清除错误
    setErrors({});

    // 收起表单
    setIsExpanded(false);
  };

  /**
   * 取消添加
   */
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      category: 'life',
      priority: 'medium',
      dueDate: getTodayString(),
      completed: false,
    });
    setErrors({});
    setIsExpanded(false);
  };

  return (
    <div className="mb-6">
      {/* 展开/收起按钮 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md"
      >
        <span className="font-medium">{isExpanded ? '取消添加' : '添加待办事项'}</span>
        <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* 表单区域 */}
      {isExpanded && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-6 bg-white rounded-lg shadow-md border border-gray-100"
        >
          <div className="grid grid-cols-1 gap-5">
            {/* 标题输入 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                placeholder="输入待办事项描述（可选）"
                rows={3}
              />
            </div>

            {/* 分类和优先级 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 分类选择 */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  分类
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white"
                >
                  <option value="work">工作</option>
                  <option value="study">学习</option>
                  <option value="life">生活</option>
                </select>
              </div>

              {/* 优先级选择 */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  优先级
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
            </div>

            {/* 截止日期 */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                截止日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-sm"
              >
                添加待办事项
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
      )}
    </div>
  );
};

export default AddTodo;
