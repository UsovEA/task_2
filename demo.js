"use strict";

const todoList = document.getElementById("list");
const doneList = document.getElementById("donelist");

const todoDone = [];
const todo = [];

const saveList = () => {
  const localTodo = JSON.stringify(todo);
  const localTodoDone = JSON.stringify(todoDone);

  localStorage.setItem("todo", localTodo);
  localStorage.setItem("todoDone", localTodoDone);
};

const getList = () => {
  const localTodo = localStorage.getItem("todo");
  const localTodoDone = localStorage.getItem("todoDone");

  localTodo && todo.push(...JSON.parse(localTodo));
  localTodoDone && todoDone.push(...JSON.parse(localTodoDone));
};

const displayTitle = () => {
  document.getElementById("noitem").style.display =
    todo.length > 0 ? "none" : "block";
  document.getElementById("doneitem").style.display =
    todoDone.length > 0 ? "none" : "block";
};

const onChangeHandler = (e) => {
  // С индексами не уверен, по условиям задачи говорится что полностью не переписывать, по хорошему наверно стоило бы сделать обьект с уникальными id и уже по ним фильровать
  const parent = e.target.parentElement;
  const value = parent.childNodes[2].innerHTML;
  const listId = parent.parentElement.id;
  const itemIndex = [...parent.parentNode.children].indexOf(parent);
  const isTodoList = todoList.id === listId;
  const currentList = isTodoList ? todoList : doneList;
  const secondaryList = !isTodoList ? todoList : doneList;
  const currentArray = isTodoList ? todo : todoDone;
  const secondaryArray = !isTodoList ? todo : todoDone;

  currentList.removeChild(parent);
  secondaryList.appendChild(parent);

  currentArray.splice(itemIndex, 1);
  secondaryArray.push(value);

  saveList();
  displayTitle();
};

const onClickHandler = (e) => {
  // С индексами не уверен, по условиям задачи говорится что полностью не переписывать, по хорошему наверно стоило бы сделать обьект с уникальными id и уже по ним фильровать
  const parent = e.target.parentElement;
  const listId = parent.parentElement.id;
  const itemIndex = [...parent.parentNode.children].indexOf(parent);
  const isTodoList = todoList.id === listId;
  const currentList = isTodoList ? todoList : doneList;
  const currentArray = isTodoList ? todo : todoDone;

  currentList.removeChild(parent);
  currentArray.splice(itemIndex, 1);

  saveList();
  displayTitle();
};

const onOkButtonClickHandler = (e) => {
  // С индексами не уверен, по условиям задачи говорится что полностью не переписывать, по хорошему наверно стоило бы сделать обьект с уникальными id и уже по ним фильровать
  const form = e.target.parentElement;
  const todoItem = form.parentElement;
  const parent = todoItem.parentElement;
  const value = form.childNodes[0].value;
  const listId = parent.parentElement.id;
  const itemIndex = [...parent.parentNode.children].indexOf(parent);
  const isTodoList = todoList.id === listId;
  const currentArray = isTodoList ? todo : todoDone;

  todoItem.removeChild(form);
  currentArray[itemIndex] = value;

  todoItem.innerHTML = value;

  saveList();
};

const onCancelButtonClickHandler = (e, value) => {
  const form = e.target.parentElement;
  const todoItem = form.parentElement;

  todoItem.innerHTML = value;
};

const onDblClickHandler = (e) => {
  const todoItem = e.target;
  const value = e.target.innerHTML;

  todoItem.innerHTML = "";

  const form = document.createElement("span");
  const text = document.createElement("input");
  const ok = document.createElement("button");
  const cancel = document.createElement("button");

  text.value = value;
  ok.innerHTML = "OK";
  cancel.innerHTML = "Cancel";

  form.appendChild(text);
  form.appendChild(ok);
  form.appendChild(cancel);
  todoItem.appendChild(form);

  ok.addEventListener("click", onOkButtonClickHandler);
  cancel.addEventListener("click", (e) => onCancelButtonClickHandler(e, value));
};

const addTodoItem = (flag = "new", todoItem = null) => {
  const item = document.createElement("li");
  const span = document.createElement("span");
  const check = document.createElement("input");
  const removeIco = document.createElement("span");

  item.appendChild(check);
  item.appendChild(removeIco);
  item.appendChild(span);

  check.setAttribute("type", "checkbox");
  check.classList.add("check-item");
  span.classList.add("list-item");
  removeIco.classList.add("glyphicon");
  removeIco.classList.add("glyphicon-remove");

  if (todoItem) span.innerHTML = todoItem;

  if (flag === "todo") {
    todoList.appendChild(item);
  } else if (flag === "todoDone") {
    check.checked = true;

    doneList.appendChild(item);
  } else {
    const itemContent = document.getElementById("itemname");
    const value = itemContent.value;

    span.innerHTML = value;

    todoList.appendChild(item);
    todo.push(value);

    itemContent.value = "";
  }

  check.addEventListener("change", onChangeHandler);
  removeIco.addEventListener("click", onClickHandler);
  span.addEventListener("dblclick", onDblClickHandler);

  saveList();
  displayTitle();
};

const onEnterClickHandler = ({ keyCode }) =>
  keyCode === 13 && addTodoItem("new");

const removeList = (id) => {
  const root = document.getElementById(id);
  const isTodoList = todoList.id === id;
  const currentArray = isTodoList ? todo : todoDone;

  while (root.lastChild) {
    root.removeChild(document.getElementById(id).lastChild);
  }

  currentArray.length = 0;

  saveList();
  displayTitle();
};

getList();

todo.forEach((item) => {
  addTodoItem("todo", item);
});

todoDone.forEach((item) => {
  addTodoItem("todoDone", item);
});
