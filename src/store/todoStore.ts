import { create } from 'zustand';
import type { Todo, Priority, Category } from '../types/todo';
import { saveTodosToLocalStorage, loadTodosFromLocalStorage } from '../utils/localStorage';
import { parseISO, differenceInDays } from 'date-fns';

/**
 * 筛选条件类型
 */
interface FilterState {
  /** 分类筛选 */
  category: Category | 'all';
  /** 优先级筛选 */
  priority: Priority | 'all';
  /** 状态筛选 */
  status: 'all' | 'completed' | 'pending';
}

/**
 * Todo Store 状态类型
 */
interface TodoState {
  /** 待办事项列表 */
  todos: Todo[];
  /** 筛选条件 */
  filter: FilterState;
  /** 搜索关键词 */
  searchTerm: string;
}

/**
 * Todo Store 动作类型
 */
interface TodoActions {
  /** 添加待办事项 */
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  /** 更新待办事项 */
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  /** 删除待办事项 */
  deleteTodo: (id: string) => void;
  /** 切换完成状态 */
  toggleComplete: (id: string) => void;
  /** 设置筛选条件 */
  setFilter: (filter: Partial<FilterState>) => void;
  /** 设置搜索关键词 */
  setSearchTerm: (term: string) => void;
  /** 获取筛选后的待办事项 */
  getFilteredTodos: () => Todo[];
  /** 获取统计数据 */
  getStatistics: () => {
    total: number;
    completed: number;
    pending: number;
    dueSoon: number;
  };
}

/**
 * Todo Store 类型（状态 + 动作）
 */
type TodoStore = TodoState & TodoActions;

/**
 * 创建 Todo Store
 * 使用 Zustand 进行全局状态管理
 */
export const useTodoStore = create<TodoStore>((set, get) => ({
  // ==================== 初始状态 ====================
  todos: loadTodosFromLocalStorage(),
  filter: {
    category: 'all',
    priority: 'all',
    status: 'all',
  },
  searchTerm: '',

  // ==================== 动作方法 ====================

  /**
   * 添加待办事项
   * @param todo - 待办事项数据（不包含 id 和 createdAt）
   */
  addTodo: (todo) => {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updatedTodos = [...get().todos, newTodo];
    set({ todos: updatedTodos });
    saveTodosToLocalStorage(updatedTodos);
  },

  /**
   * 更新待办事项
   * @param id - 待办事项 ID
   * @param updates - 要更新的字段
   */
  updateTodo: (id, updates) => {
    const updatedTodos = get().todos.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    set({ todos: updatedTodos });
    saveTodosToLocalStorage(updatedTodos);
  },

  /**
   * 删除待办事项
   * @param id - 待办事项 ID
   */
  deleteTodo: (id) => {
    const updatedTodos = get().todos.filter(todo => todo.id !== id);
    set({ todos: updatedTodos });
    saveTodosToLocalStorage(updatedTodos);
  },

  /**
   * 切换待办事项的完成状态
   * @param id - 待办事项 ID
   */
  toggleComplete: (id) => {
    const updatedTodos = get().todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    set({ todos: updatedTodos });
    saveTodosToLocalStorage(updatedTodos);
  },

  /**
   * 设置筛选条件
   * @param filter - 部分筛选条件
   */
  setFilter: (filter) => {
    set({ filter: { ...get().filter, ...filter } });
  },

  /**
   * 设置搜索关键词
   * @param term - 搜索关键词
   */
  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  // ==================== 派生状态 ====================

  /**
   * 获取筛选后的待办事项列表
   * 根据分类、优先级、状态和搜索关键词进行筛选
   * @returns 筛选后的待办事项数组
   */
  getFilteredTodos: () => {
    const { todos, filter, searchTerm } = get();

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
  },

  /**
   * 获取统计数据
   * @returns 统计对象，包含总数、已完成数、未完成数和即将到期数
   */
  getStatistics: () => {
    const { todos } = get();
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;

    // 计算即将到期（2天内）的待办事项数量
    const now = new Date();
    const dueSoon = todos.filter(todo => {
      if (todo.completed) return false;
      const dueDate = parseISO(todo.dueDate);
      const diffDays = differenceInDays(dueDate, now);
      return diffDays >= 0 && diffDays <= 2;
    }).length;

    return { total, completed, pending, dueSoon };
  },
}));
