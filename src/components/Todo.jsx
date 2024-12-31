import React, { useState, useRef, useEffect } from 'react';
import todo_icon from '../assets/todo_icon.png';
import TodoItems from './TodoItems';

const Todo = () => {
  const [todoList, setTodoList] = useState(() => {
    try {
      return localStorage.getItem('todos')
        ? JSON.parse(localStorage.getItem('todos'))
        : [];
    } catch (error) {
      console.error('Failed to fetch todos from localStorage', error);
      return [];
    }
  });
  const inputRef = useRef();

  const add = () => {
    const inputText = inputRef.current.value.trim();
    if (!inputText) {
      alert('Task cannot be empty');
      return;
    }

    if (todoList.some((todo) => todo.text === inputText)) {
      alert('Task already exists');
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: inputText,
      isComplete: false,
    };

    setTodoList((prev) => [...prev, newTodo]);
    inputRef.current.value = ''; // Clear input field
  };

  const deleteTodo = (id) => {
    setTodoList((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggle = (id) => {
    setTodoList((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
      )
    );
  };

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todoList));
    } catch (error) {
      console.error('Failed to save todos to localStorage', error);
    }
  }, [todoList]);

  return (
    <div className="bg-green-100 place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[600px] rounded-xl">
      {/* Header */}
      <div className="flex items-center mt-7 gap-2">
        <img className="w-8" src={todo_icon} alt="Todo icon" />
        <h1 className="text-xl font-bold text-green-800">To-Do List</h1>
      </div>

      {/* Input Box */}
      <div className="flex items-center my-7 bg-green-200 rounded-full">
        <input
          ref={inputRef}
          className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-green-600"
          type="text"
          placeholder="Enter your task here"
          aria-label="Enter your task"
        />
        <button
          onClick={add}
          className="border-none rounded-full bg-green-600 w-32 h-14 text-white text-lg font-medium cursor-pointer hover:bg-green-700 active:bg-green-800"
        >
          ADD +
        </button>
      </div>

      {/* Todo List */}
      <div>
        {todoList.length === 0 ? (
          <p className="text-center text-green-500">No tasks yet. Start adding some!</p>
        ) : (
          todoList.map((item) => (
            <TodoItems
              key={item.id}
              id={item.id}
              text={item.text}
              isComplete={item.isComplete}
              deleteTodo={deleteTodo}
              toggle={toggle}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Todo;
