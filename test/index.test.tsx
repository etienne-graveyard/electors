import Electors, { useMemo, useChildren } from '../src';

/**
 * TYPES
 */

interface Todo {
  title: string;
  done: boolean;
  id: number;
}

interface State {
  todos: Array<Todo>;
  hideDone: boolean;
  someOtherState: boolean;
}

test('electors is working', () => {
  /**
   * SELECTORS
   */

  const useVisibleTodos = (state: State): Todo[] => {
    return useMemo(() => {
      if (state.hideDone) {
        return state.todos.filter(t => t.done === false);
      }
      return state.todos;
    }, [state.todos, state.hideDone]);
  };

  // you use other selectors
  const useVisibleTodosSorted = (state: State, order: 'asc' | 'desc'): Todo[] => {
    const visibleTodos = useChildren(useVisibleTodos, state);
    return useMemo(() => {
      return order === 'asc'
        ? visibleTodos.slice().sort((l, r) => l.title.localeCompare(r.title))
        : visibleTodos.slice().sort((l, r) => r.title.localeCompare(l.title));
    }, [visibleTodos, order]);
  };

  /**
   * Create a context
   * A context is a bit like a component
   */
  const ctx = Electors.createContext();

  const state1: State = {
    todos: [
      { id: 0, title: 'Foo', done: false },
      { id: 1, title: 'Bar', done: true },
      { id: 2, title: 'Baz', done: false },
    ],
    hideDone: false,
    someOtherState: false,
  };

  // ctx.execute is like ReactDom.render()
  const todosSorted1 = ctx.execute(useVisibleTodosSorted, state1, 'asc');
  const todosSorted2 = ctx.execute(useVisibleTodosSorted, state1, 'asc');

  // we get the same reference here !
  expect(todosSorted1 === todosSorted2).toBe(true);

  // We update the state: adding a todo
  const state2: State = {
    ...state1,
    todos: [...state1.todos, { id: 3, title: 'Boo', done: false }],
  };

  const todosSorted3 = ctx.execute(useVisibleTodosSorted, state2, 'asc');
  // false because the todos list has changed
  expect(todosSorted3 === todosSorted2).toBe(false);
  // 4, the new todo is counted !
  expect(todosSorted3.length).toBe(4);

  // we update the state again but someOtherState is not used
  // by useVisibleTodosSorted or useVisibleTodos
  const state3: State = {
    ...state2,
    someOtherState: true,
  };

  const todosSorted4 = ctx.execute(useVisibleTodosSorted, state3, 'asc');

  // true because the dependecies for useVisibleTodosSorted have not change
  expect(todosSorted3 === todosSorted4).toBe(true);
});
