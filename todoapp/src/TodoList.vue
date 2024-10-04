<template>
    <div>
      <h1>Todo List</h1>
      <ul>
        <li v-for="todo in todos" :key="todo.id">
          {{ todo.title }} - <span v-if="todo.completed">Completed</span>
          <button @click="deleteTodo(todo.id)">Delete</button>
        </li>
      </ul>
      <input v-model="newTodo" placeholder="Add new todo" />
      <button @click="addTodo">Add Todo</button>
    </div>
  </template>
  
  <script>
  //axios를 사용하여 백엔드의 API를 호출해 데이터를 가져
  import axios from 'axios'; 
  
  export default {
    data() {
      return {
        todos: [],
        newTodo: ''
      };
    },
    mounted() {
      this.fetchTodos();
    },
    methods: {
      fetchTodos() {
        axios.get('/api/todos')
          .then(response => {
            this.todos = response.data;
          });
      },
      addTodo() {
        axios.post('/api/todos', { title: this.newTodo, completed: false })
          .then(() => {
            this.newTodo = '';
            this.fetchTodos();
          });
      },
      deleteTodo(id) {
        axios.delete(`/api/todos/${id}`)
          .then(() => {
            this.fetchTodos();
          });
      }
    }
  };
  </script>
  