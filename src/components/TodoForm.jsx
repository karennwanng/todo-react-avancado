import { useState } from 'react';
import { useTodos } from '../context/TodoContext';

function TodoForm() {
    const [text, setText] = useState('');
    const [erro, setErro] = useState('');
    const { addTodo } = useTodos();

    function handleSubmit(event) {
        // Evita que o form recarrege a página (comportamento padrão do HTML).
        event.preventDefault();

        // .trim() ignora espaços em branco - impede adicionar uma tarefa
        // vazia ou só com espaços (ex: " ").
        if (!text.trim()) return;

        const foiAdicionada = addTodo(text);

        if (!foiAdicionada) {
            setErro('Essa tarefa já existe na lista.');
            return; // não limpa o input, para usuário poder editar o texto
        }
        setErro('');
        setText('');
    }

    return (
        <form className='todo-form' onSubmit={handleSubmit}>
            <input className='todo-input'
                type="text"
                value={text}
                onChange={(event) => {
                    setText(event.target.value);
                    if (erro) setErro(''); // some com o erro assim que a pessoa comeca a corrigir
                }}
                placeholder='Digite uma tarefa'
            />
            {erro && <p className='form-error'>{erro}</p>}
            <button className='btn-add' type='submit'>Adicionar</button>
        </form>
    );
}

export default TodoForm;