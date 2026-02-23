import { useState } from 'react';
import { useTodoStore } from '../store/todoStore';
import type { Priority, Category } from '../types/todo';
import { getTodayString } from '../utils/dateUtils';
import { isBefore, startOfDay } from 'date-fns';

interface FormData {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  completed: boolean;
}

interface FormErrors {
  title?: string;
  dueDate?: string;
}

const AddTodo: React.FC = () => {
  const addTodo = useTodoStore(state => state.addTodo);
  const [isExpanded, setIsExpanded] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'life',
    priority: 'medium',
    dueDate: getTodayString(),
    completed: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入任务标题';
    } else if (formData.title.length > 100) {
      newErrors.title = '标题长度不能超过100个字符';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = '请选择截止日期';
    } else if (isBefore(new Date(formData.dueDate), startOfDay(new Date()))) {
      newErrors.dueDate = '截止日期不能早于今天';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    addTodo({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate,
      completed: formData.completed,
    });

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

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 bg-white border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all group"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="font-medium text-sm sm:text-base">添加新任务...</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">新建任务</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* 标题输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            任务标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="输入任务标题..."
            className={`w-full px-3 sm:px-4 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
              errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
            autoFocus
          />
          {errors.title && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* 描述输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            任务描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="添加任务描述（可选）..."
            rows={2}
            className="w-full px-3 sm:px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        {/* 三列布局：分类、优先级、截止日期 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* 分类选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full appearance-none px-3 sm:px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="work">💼 工作</option>
                <option value="study">📚 学习</option>
                <option value="life">🏠 生活</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 优先级选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
            <div className="relative">
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full appearance-none px-3 sm:px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="high">🔴 高优先级</option>
                <option value="medium">🟠 中优先级</option>
                <option value="low">🟢 低优先级</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 截止日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              截止日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.dueDate ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.dueDate && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.dueDate}</p>}
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 pt-1 sm:pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-5 sm:px-6 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:shadow-blue-500/30"
          >
            创建任务
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTodo;
