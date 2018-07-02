import { fromNullable, None, Some } from "fp-ts/lib/Option";
import { curry } from "fp-ts/lib/function";

const $ = (selector: string, element: Element | Document = document) => fromNullable(element.querySelector(selector));
const addEventListener = (type: string, fn: any) => (element: EventTarget) => element.addEventListener(type, fn) || element;
const verifyKeyboardEvent = (e: KeyboardEvent) =>
    e.keyCode != 13 && (e.currentTarget as HTMLInputElement).value.length > 0;
const eventToOption = (e: KeyboardEvent) =>
    (verifyKeyboardEvent(e) ? None.value : new Some(e));
const keyboardEventToValue = (e: KeyboardEvent) => (e.currentTarget as HTMLInputElement).value;

(function () {
    const todoList =
        $('.todoapp')
            .chain(curry($)('ul.todo-list')).toNullable();
    (todoList as Node).appendChild(document.createElement('button'));
    const addTodo = (e: KeyboardEvent) =>
        fromNullable(e)
            .chain(eventToOption)
            .map(keyboardEventToValue)
            .map(console.log);

    $('.todoapp')
        .chain(curry($)('input.new-todo'))
        .map(addEventListener('keyup', addTodo))

})();