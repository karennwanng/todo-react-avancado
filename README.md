# Todo React Avançado

Uma aplicação de lista de tarefas (Todo List) construída em React, aplicando gerenciamento de estado local e global, hook customizado e otimização de renderizações com memoization.

## Funcionalidades

- Adicionar tarefas (com bloqueio de tarefas duplicadas e mensagem de erro visual)
- Marcar tarefas como concluídas
- Remover tarefas
- Filtrar tarefas por status: Todas, Concluídas, Pendentes
- Persistência automática das tarefas no `localStorage` do navegador
- Layout responsivo (Mobile First)

## Tecnologias utilizadas

- [React](https://react.dev/) 19
- [Vite](https://vitejs.dev/) — ambiente de desenvolvimento e build
- **Context API** (`useContext`) — gerenciamento de estado global da lista de tarefas
- **Hook customizado** (`useLocalStorage`) — encapsula a lógica de persistência em `localStorage`
- **Memoization** (`useMemo` e `React.memo`) — otimização de renderizações
- CSS puro, com abordagem Mobile First e variáveis (`:root`) para cores e espaçamentos reutilizados

## Estrutura do projeto

```
src/
├── context/
│   └── TodoContext.jsx    # Context, Provider e lógica de estado (add, toggle, remove, filter)
├── hooks/
│   └── useLocalStorage.js # Hook customizado de persistência em localStorage
├── components/
│   ├── TodoForm.jsx       # Formulário para adicionar tarefas
│   ├── TodoItem.jsx       # Item individual da lista (memoizado com React.memo)
│   ├── TodoList.jsx       # Lista de tarefas filtrada (useMemo)
│   └── TodoFilters.jsx    # Botões de filtro (Todas / Concluídas / Pendentes)
├── App.jsx
├── App.css
└── main.jsx
```

## Como rodar localmente

Pré-requisito: [Node.js](https://nodejs.org/) instalado.

```bash
# Clone o repositório
git clone https://github.com/karennwanng/todo-react-avancado.git

# Entre na pasta do projeto
cd todo-react-avancado

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

Depois, abra `http://localhost:5173` no navegador.

## Otimização de performance: React.memo + useMemo no Context

Durante o desenvolvimento, foi feito um teste prático pra validar se a memoization estava realmente evitando re-renderizações desnecessárias dos itens da lista.

**Problema identificado:** mesmo com cada `TodoItem` envolvido em `React.memo`, ao marcar uma única tarefa como concluída, *todos* os itens da lista re-renderizavam — não só o que foi alterado.

**Causa raiz:** o `value` passado pro `TodoContext.Provider` era um objeto literal recriado a cada render do `TodoProvider`:

```jsx
const value = { todos, filter, addTodo, toggleTodo, removeTodo, setFilter };
```

Como cada `TodoItem` consome o Context diretamente (`useContext`, via o hook `useTodos`), e não recebe `toggleTodo`/`removeTodo` como prop, o `React.memo` não tem como impedir esse re-render: ele só bloqueia renders causados pelo componente pai passando as mesmas props, não renders causados por mudança no valor de um Context. Como o objeto `value` tinha uma referência nova a cada render do Provider, **todo componente inscrito naquele Context era obrigado a re-renderizar**, independente do `memo`.

**Correção:** envolver o `value` em `useMemo`, com `[todos, filter]` como dependências — e não as funções (`addTodo`, `toggleTodo`, `removeTodo`, `setFilter`), já que elas são recriadas a cada render (por serem `function` declaradas no corpo do componente) e incluí-las no array anularia o próprio `useMemo`:

```jsx
const value = useMemo(() => ({
    todos,
    filter,
    addTodo,
    toggleTodo,
    removeTodo,
    setFilter,
}), [todos, filter]);
```

Com isso, o objeto `value` só é recriado quando `todos` ou `filter` mudam de fato. E como `toggleTodo`/`removeTodo` usam `.map()`/`.filter()` retornando a mesma referência para os itens não afetados, apenas o objeto `todo` da tarefa alterada muda — permitindo que o `React.memo` finalmente bloqueie o re-render dos demais `TodoItem`.

**Validação:** com `console.log` em cada `TodoItem`, confirmou-se que, após a correção, marcar uma tarefa como concluída loga renderização **apenas daquele item**, não da lista inteira.

## Feedback visual de tarefa duplicada

O `addTodo` (em `TodoContext.jsx`) já bloqueava a criação de tarefas com texto repetido, mas o bloqueio era silencioso — a usuária não recebia nenhum retorno sobre por que nada acontecia ao tentar adicionar.

A correção: `addTodo` agora **retorna um booleano** (`true` se a tarefa foi criada, `false` se era duplicada), e o `TodoForm` usa esse retorno para exibir uma mensagem de erro (`"Essa tarefa já existe na lista."`) abaixo do input. A mensagem desaparece automaticamente assim que a pessoa volta a digitar, para não ficar "presa" na tela depois que o texto já foi corrigido.

## Organização do CSS com variáveis (`:root`)

Cores e valores repetidos (azul de destaque, vermelho de ação destrutiva, `border-radius`, espaçamentos) foram extraídos para variáveis CSS declaradas em `:root`, no topo do `App.css`. Isso evita repetição e centraliza qualquer ajuste futuro de tema em um único lugar, em vez de precisar caçar cada ocorrência da cor pelo arquivo.

## Autora

Desenvolvido por [Karen Wang](https://github.com/karennwanng) como projeto de portfólio durante os estudos de frontend na EBAC.