// import as React to get eslint !
import React from '../src';

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

/**
 * SELECTORS
 */

const useVisibleTodos = (state: State): Todo[] => {
  return React.useMemo(() => {
    if (state.hideDone) {
      return state.todos.filter(t => t.done === false);
    }
    return state.todos;
  }, [state.todos, state.hideDone]);
};

// you use other selectors
const useVisibleTodosSorted = (state: State, order: 'acs' | 'desc'): Todo[] => {
  const visibleTodos = React.useChildren(useVisibleTodos, state);
  return React.useMemo(() => {
    return order === 'acs'
      ? visibleTodos.slice().sort((l, r) => l.title.localeCompare(r.title))
      : visibleTodos.slice().sort((l, r) => r.title.localeCompare(l.title));
  }, [visibleTodos, order]);
};

/**
 * Create a context
 * A context is a bit like a component
 */
const ctx = React.createContext();

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
const todosSorted1 = ctx.execute(useVisibleTodosSorted, state1, 'acs');
const todosSorted2 = ctx.execute(useVisibleTodosSorted, state1, 'acs');

// we get the same reference here !
console.log(todosSorted1 === todosSorted2);

// We update the state: adding a todo
const state2: State = {
  ...state1,
  todos: [...state1.todos, { id: 3, title: 'Boo', done: false }],
};

const todosSorted3 = ctx.execute(useVisibleTodosSorted, state2, 'acs');
// false because the todos list has changed
console.log(todosSorted3 === todosSorted2);
// 4, the new todo is counted !
console.log(todosSorted3.length);

// we update the state again but someOtherState is not used
// by useVisibleTodosSorted or useVisibleTodos
const state3: State = {
  ...state2,
  someOtherState: true,
};

const todosSorted4 = ctx.execute(useVisibleTodosSorted, state3, 'acs');

// true because the dependecies for useVisibleTodosSorted have not change
console.log(todosSorted3 === todosSorted4);
