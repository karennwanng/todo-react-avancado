import { useMemo } from "react";
import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const TodoContext = createContext();

export function TodoProvider({ children }) {
    const [todos, setTodos] = useLocalStorage('todos', []);
    const [filter, setFilter] = useState('all');

    function addTodo(text) {
        // Bloqueia tarefas duplicadas pelo texto, antes de criar o objeto novo.
        // Regra de négocio: evita poluir a lista com a mesma tarefa repetida.
        const jaExiste = todos.some(todo => todo.text === text);

        if (jaExiste) {
            return false; // avisa quem chamou que a tarefa NÃO foi adicionada
        }

        const novaTarefa = {id: Date.now(), text: text, completed: false};
        setTodos([...todos, novaTarefa])
        return true; // avisa que deu certo

    }

    function toggleTodo(id) {
        // .map() sempre retorna um array NOVO (por isso o React decta a mudança em 'todos').
        // Mas cada item que NÃO é alterado retorna 'todo' (a mesma referência de antes) 
        // só o item clicado ganha um objeto novo ({...todo, completed: ...}).
        // É isso que permite o React.memo do TodoItem bloquear o re-render dos outros itens.
        const novaLista = todos.map(todo => {
            if (todo.id === id) {
                return {...todo, completed: !todo.completed};
            }
            return todo;
        });
        setTodos(novaLista);
    }

    function removeTodo(id) {
        // .filter() também retorna array novo, mas os itens restante mantêm
        // a mesma referência - mesmo raciocínio do toggleTodo acima.
        const novaLista = todos.filter(todo => todo.id !==id);
        setTodos(novaLista);
    }

    // Memoriza o objeto 'value' do Context. Sem isso, um objeto NOVO seria criado
    // a cada render do Provider, e todo componente que consome esse Context
    // (via useTodos/useContext) seria forçado a re-renderizar - mesmo estado
    // com React.memo - porque memo só bloqueia renders vindos de props do pai,
    // não renders causados por mudança no valor do Context.
    //
    // Dependências são só [todos, filter] (NÃO as funções addTodo/toggleTodo/
    // removeTodo/setFilter): essas funções são recriadas a cada render do
    // Provider (são 'function' declaradas no corpo dele), então colocá-las aqui
    // faria o useMemo realcular em todo render - anulando a própria otimização.
    const value = useMemo(() => ({
        todos,
        filter,
        addTodo,
        toggleTodo,
        removeTodo,
        setFilter,
    }), [todos,filter]);

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    );
}

export function useTodos() {
    return useContext(TodoContext);
}