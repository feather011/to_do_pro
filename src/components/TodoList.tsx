import React from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const getFilteredTodos = useTodoStore(state => state.getFilteredTodos);
  const todos = getFilteredTodos();

  if (todos.length === 0) {
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
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;
