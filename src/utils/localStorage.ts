import type { Todo } from '../types/todo';

/** LocalStorage 存储键名 */
const TODO_STORAGE_KEY = 'todos';

/**
 * 将待办事项数组保存到 LocalStorage
 * @param todos - 待办事项数组
 */
export const saveTodosToLocalStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

/**
 * 从 LocalStorage 加载待办事项数组
 * @returns 待办事项数组，如果没有数据则返回空数组
 */
export const loadTodosFromLocalStorage = (): Todo[] => {
  try {
    const todosJson = localStorage.getItem(TODO_STORAGE_KEY);
    if (todosJson) {
      return JSON.parse(todosJson);
    }
    return [];
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
    return [];
  }
};
