import { useTodos } from '../context/TodoContext';

function TodoFilters() {
    // filter/setFilter vêm do Context: qualquer componente que precisar
    // saber ou mudar o filtro atual usa mesmo estado global, sem precisar
    // passar como prop por vários níveis (TodoFilters e TodoList são "irmãos",
    // nehum é pai do outro).
    const { filter, setFilter } = useTodos();

    return (
        <div className='todo-filters'>
            <h2 className='filters-title'>Filtrar</h2>
            <div className='filters-buttons'>
                <button className='btn-filter' onClick={() => setFilter('all')}>Todas</button>
                <button className='btn-filter' onClick={() => setFilter('completed')}>Concluídas</button>
                <button className='btn-filter' onClick={() => setFilter('pending')}>Pendentes</button>
            </div>
        </div>
    );
}

export default TodoFilters;