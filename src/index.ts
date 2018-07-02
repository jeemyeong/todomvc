import { fromNullable, None, Option, Some } from 'fp-ts/lib/Option';
import { curry } from "fp-ts/lib/function";

const c = curry;
const $ = (selector: string, element: Element | Document = document) => fromNullable(element.querySelector(selector));
const addEventListener = (type: string, fn: any) => (element: EventTarget) => element.addEventListener(type, fn) || element;
const isEnter = (e: KeyboardEvent) => e.keyCode == 13;
const verifyKeyboardEvent = (e: KeyboardEvent) =>
    isEnter(e) && (e.target as HTMLInputElement).value.length > 0;
const eventToOption = (e: KeyboardEvent) =>
    (verifyKeyboardEvent(e) ? new Some(e) : None.value);
const keyboardEventToValue = (e: KeyboardEvent) => (e.target as HTMLInputElement).value;

(function () {
  (function todoApp(todoApp: Option<Element>) {
    (function addTodo(todoList: Option<Element>) {
      const todoTemplate = (todo: string) => (`
        <div class="view">
          <input class="toggle" type="checkbox">
          <label>${todo}</label>
          <button class="destroy"></button>
        </div>
      `);

      const createTodoElem = (todo: string) => {
        const elem = document.createElement('li');
        elem.innerHTML = todoTemplate(todo);
        return elem
      };

      // side effect
      const appendLi = (todoElem: Element, ul: Element) => {
        ul.appendChild(todoElem);
        return todoElem;
      };

      // side effect
      const appendIntoTodoList = (todoElem: Element) =>
        todoList.map( c(appendLi)(todoElem) )

      const addTodo = (e: KeyboardEvent) =>
        fromNullable(e)
          .chain(eventToOption)
          .map(keyboardEventToValue)
          .map(createTodoElem)
          .chain(appendIntoTodoList)
          .map(console.log);

      todoApp
        .map(addEventListener('keyup', addTodo));
    })(todoApp.chain(c($)('ul.todo-list')))
  })($('.todoapp'))
})();