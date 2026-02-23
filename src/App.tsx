import AddTodo from './components/AddTodo';
import Filter from './components/Filter';
import Statistics from './components/Statistics';
import TodoList from './components/TodoList';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 标题 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 待办事项</h1>
          <p className="text-gray-600">高效管理你的日常任务</p>
        </header>

        {/* 统计 */}
        <Statistics />

        {/* 添加待办 */}
        <AddTodo />

        {/* 筛选 */}
        <Filter />

        {/* 待办列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">待办列表</h2>
          <TodoList />
        </div>

        {/* 页脚 */}
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>使用 React + TypeScript + Vite 构建</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
