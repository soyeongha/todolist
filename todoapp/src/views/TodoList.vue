<template>
    <div class="todo-app">
      <h1>Todo List</h1>
      <div ref="tabulator"></div>
      <div class="new-todo">
        <input v-model="newTodo" placeholder="Add new todo" />
        <MyButton buttonClass="add" @click="addTodo">Add Todo</MyButton>
      </div>
      <EditModal
        v-if="showModal"
        :editTodoTitle="editTodoTitle"
        @save="updateTodo"
        @close="closeModal"
      />
    </div>
  </template>
  
  <script>
  import { TabulatorFull as Tabulator } from "tabulator-tables";
  import "tabulator-tables/dist/css/tabulator.min.css";
  import MyButton from "@/components/MyButton.vue"; // 수정된 경로
  import EditModal from "@/components/EditModal.vue"; // 수정된 경로
  
  export default {
    components: {
      MyButton,
      EditModal,
    },
    data() {
      return {
        todos: [
          { id: 1, title: "vue.js 공부하기", completed: false },
          { id: 2, title: "다이소에서 전선클립 구매하기", completed: false },
        ],
        newTodo: "",
        table: null,
        showModal: false,
        editTodoId: null,
        editTodoTitle: "",
        nextId: 3, // 내부적으로 관리할 고유 ID 값
      };
    },
    mounted() {
      this.updateDisplayIds();
      this.table = new Tabulator(this.$refs.tabulator, {
        data: this.todos,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 10,
        autoHeight: true,
        columns: this.getColumns(),
      });
    },
    methods: {
      getColumns() {
        return [
          {
            title: "No",
            field: "displayId",
            sorter: "number",
            width: 80,
            hozAlign: "center",
          },
          {
            title: "Title",
            field: "title",
            sorter: "string",
            widthGrow: 3,
          },
          {
            title: "Status",
            field: "completed",
            formatter: (cell) => {
              const isCompleted = cell.getValue();
              return `<div style="text-align: center;">
                <span class="material-icons status-icon"
                style="color: ${isCompleted ? "#ff85a1" : "#000000"}; user-select: none;">
                ${isCompleted ? "check_circle" : "cancel"}
                </span>
                </div>`;
            },
            width: 100,
            align: "center",
            cellClick: (e, cell) => {
              const row = cell.getRow().getData();
              if (e.target.classList.contains("status-icon")) {
                this.toggleCompleted(row.id);
              }
            },
          },
          {
            title: "",
            formatter: () => `
              <span class="edit-icon material-icons" style="cursor: pointer; margin-right: 10px;">edit</span>
              <span class="delete-icon material-icons" style="cursor: pointer;">delete</span>
            `,
            width: 90,
            align: "center",
            cellClick: (e, cell) => this.handleIconClick(e, cell),
          },
        ];
      },
      handleIconClick(e, cell) {
        const row = cell.getRow().getData();
        if (e.target.classList.contains("edit-icon")) {
          this.openEditModal(row.id, row.title);
        } else if (e.target.classList.contains("delete-icon")) {
          this.deleteTodo(row.id);
        }
      },
      openEditModal(id, title) {
        this.editTodoId = id;
        this.editTodoTitle = title;
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
        this.editTodoId = null;
        this.editTodoTitle = "";
      },
      updateTodo(newTitle) {
        const todoIndex = this.todos.findIndex(
          (todo) => todo.id === this.editTodoId
        );
        if (todoIndex !== -1) {
          this.todos[todoIndex].title = newTitle;
          this.table.updateData([{ id: this.editTodoId, title: newTitle }]);
        }
        this.closeModal();
      },
      addTodo() {
        if (this.newTodo.trim() !== "") {
          const newTodoItem = {
            id: this.nextId,
            title: this.newTodo,
            completed: false,
          };
          this.todos.push(newTodoItem);
          this.table.addRow(newTodoItem);
          this.updateDisplayIds();
          this.table.setData(this.todos);
          this.newTodo = "";
          this.nextId += 1;
        }
      },
      deleteTodo(id) {
        this.todos = this.todos.filter((todo) => todo.id !== id);
        this.updateDisplayIds();
        this.table.setData(this.todos);
      },
      updateDisplayIds() {
        this.todos.forEach((todo, index) => {
          todo.displayId = index + 1;
        });
      },
      toggleCompleted(id) {
        const todo = this.todos.find((todo) => todo.id === id);
        if (todo) {
          todo.completed = !todo.completed;
          this.table.updateData([{ id, completed: todo.completed }]);
        }
      },
    },
  };
  </script>
  
  <style scoped>

.todo-app {
  max-width: 1000px;
  margin: 50px auto;
  font-family: "Noto Sans KR", sans-serif; /* 모던하고 깔끔한 느낌의 폰트로 변경 */
  text-align: center;
  background-color: #ffe6f0; /* 연한 파스텔 핑크 배경 */
  padding: 20px;
  border-radius: 16px; /* 전체 컨테이너에 둥글게 테두리 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.new-todo {
  margin-top: 50px;
}

.new-todo input {
  padding: 10px;
  width: 70%;
  border: 1px solid #f8b6c8; /* 연한 핑크 테두리 */
  border-radius: 16px; /* 입력 필드를 둥글게 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.new-todo button {
  padding: 10px 20px;
  margin-left: 10px;
  background: #ff85a1; /* 버튼 배경을 파스텔 핑크로 */
  color: white;
  border: none;
  border-radius: 16px; /* 버튼을 둥글게 */
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

/* Tabulator 테이블 커스터마이징 - 파스텔 핑크와 둥글게 */
.todo-app .tabulator {
  width: 100%; /* 테이블 너비를 페이지 전체 너비로 설정 */
  border: 1px solid #f8b6c8; /* 테두리 색상을 연한 핑크로 변경 */
  border-radius: 16px; /* 테두리를 둥글게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.todo-app .tabulator .tabulator-cell {
  padding: 12px 8px; /* 셀 패딩 설정 */
  border-right: 1px solid #f8b6c8; /* 셀 간의 구분 테두리 */
  text-align: center;
}

.todo-app .tabulator .tabulator-cell:last-child {
  border-right: none; /* 마지막 셀 테두리 제거 */
}

.todo-app .tabulator .status-icon:hover {
  color: #ff6783 !important; /* 호버 시 색상 약간 어둡게 */
}
</style>

  