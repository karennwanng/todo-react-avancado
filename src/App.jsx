import './App.css';
import { TodoProvider } from './context/TodoContext';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilters from './components/TodoFilters';


function App() {
  return (
    // TodoProvider precisa envolver todos os componentes que usam useTodos()
    // (TodoForm, TodoFilters, TodoList e, por consequência, cada TodoItem).
    // Sem esse wrapper aqui, useContext(TodoContext) retornaria undefined
    // dentro desse componentes.
    <TodoProvider>
      <div className='app'>
        <h1>Minha Lista de Tarefas</h1>
        <TodoForm />
        <TodoFilters />
        <TodoList />
      </div>
    </TodoProvider>
  );
}

export default App