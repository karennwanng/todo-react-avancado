import { useTodos } from '../context/TodoContext';
import { useMemo } from 'react';
import TodoItem from './TodoItem';

function TodoList() {
    const { todos, filter } = useTodos();

    // Memoriza o resultado do filtro: só recalcula quando 'todos' ou 'filter'
    // mudam de fato. Sem isso, qualquer render do TodoList (por outro motivo)
    // recriaria o array filtrado do zero, mesmo sem necessidade.
    const todosFiltrados = useMemo(() => {
        return todos.filter(todo => {
            if (filter === 'completed') {
                return todo.completed;
            }
            if (filter === 'pending') {
                return !todo.completed;
            }
            return true;
        });
    }, [todos, filter]);

    return (
        <ul className='todo-list'>
            {todosFiltrados.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
        </ul>
    );
}

export default TodoList;