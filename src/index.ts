import { fromNullable, None, Option, Some } from 'fp-ts/lib/Option';
import { curry } from "fp-ts/lib/function";

const c = curry;
const $ = (selector: string, element: Element | Document = document) => fromNullable(element.querySelector(selector));
const addEventListener = (type: string, fn: any) => (element: EventTarget) => element.addEventListener(type, fn) || element;
const isEnter = (e: KeyboardEvent) => e.keyCode == 13;
const verifyKeyboardEvent = (e: KeyboardEvent) =>
    isEnter(e) && (e.target as HTMLInputElement).value.length > 0;
const eventToOption = (e: KeyboardEvent) => {
  e.preventDefault();
  return (verifyKeyboardEvent(e) ? new Some(e) : None.value);
};
const keyboardEventToValue = (e: KeyboardEvent) => (e.target as HTMLInputElement).value;
const createElem = (tagName: string, template: string) => {
  const elem = document.createElement(tagName);
  elem.innerHTML = template;
  return elem
};

const tap = <T, U>(fn: (x: U) => T) => (x: U): U => {
  fn(x);
  return x;
};

// side effect
const appendLi = (elem: Element, ul: Element) => {
  ul.appendChild(elem);
  return elem;
};

const getTarget = (e: Event) => (e.target as Element);
const isEventTarget = (e: KeyboardEvent, tagName: string, className: string ) =>
  getTarget(e).tagName.toLowerCase() == tagName && getTarget(e).classList.contains(className);

const toggleClassIntoElem = (className: string) => (elem: Element) => {
  elem.classList.contains(className) ? elem.classList.remove(className) : elem.classList.add(className);
  return elem
};

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

      // side effect
      const clearTextInput = (x: any) => todoApp.chain(c($)('input.new-todo')).map(input => {
        input["value"] = '';
        return x
      });

      // side effect
      const appendIntoTodoList = (todoElem: Element) =>
        todoList
          .map( c(appendLi)(todoElem) )
          .map( tap(clearTextInput) );
      const createTodoElem = (todo: string) =>
        createElem("li", todoTemplate(todo));

      const addTodo = (e: KeyboardEvent) =>
        fromNullable(e)
          .chain(eventToOption)
          .map(keyboardEventToValue)
          .map(createTodoElem)
          .map(tap(appendIntoTodoList));

      todoApp
        .map(addEventListener('keyup', addTodo));

    })(todoApp.chain(c($)('ul.todo-list')));


    (function deleteTodo(todoList: Option<Element>){
      const deleteTodo = (e: KeyboardEvent) =>
        fromNullable(e)
          .filter(e => (isEventTarget(e, "button", "destroy")))
          .map(getTarget)
          .map(target => target.closest("li"))
          .filter(elem => confirm(`Delete?`))
          .map(elem => elem.remove())
      ;

      todoList
        .map(addEventListener('click', deleteTodo));
    })(todoApp.chain(c($)('ul.todo-list')));

    (function checkTodo(todoList: Option<Element>){
      const checkTodo = (e: KeyboardEvent) =>
        fromNullable(e)
          .filter(e => (isEventTarget(e, "input", "toggle")))
          .map(getTarget)
          .map(target => target.closest("li"))
          .map(toggleClassIntoElem("completed"))
      ;

      todoList
        .map(addEventListener('click', checkTodo));
    })(todoApp.chain(c($)('ul.todo-list')));

  })($('.todoapp'))
})();