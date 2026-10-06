import { useTodos } from '../context/TodoContext'
import { memo } from 'react';

function TodoItem({ todo }) {
    // console.log('TodoItem renderizou:', todo.text); // debug: usado para validar o React.memo + useMemo no Context (ver Readme)
    // toggleTodo/removeTodo vêm do Context (useTodos), não são props.
    // Por isso o React.memo abaixo não tem como "ver" essas funções:
    // ele só compara props recebidas do pai (nesse caso, só 'todo').
    const { toggleTodo, removeTodo } = useTodos(); 

    return (
        <li className='todo-item'>
            <input className='todo-checkbox' type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
            <span className='todo-text'>{todo.text}</span>
            <button className='btn-remove' onClick={() => removeTodo(todo.id)}>Remover</button>
        </li>
    );
}

// Memoiza o componente: só re-renderiza se a prop 'todo' mudar de referência.
// Funciona porque toggleTodo/removeTodo (no TodoContext) retornam a mesma
// referência de objeto pros itens não alterados - ver comentário no
// TodoContext.jsx, função toggleTodo.
export default memo(TodoItem);