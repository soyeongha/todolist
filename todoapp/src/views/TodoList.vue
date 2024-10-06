<template>
  <div>
    <!-- TodoHeader 컴포넌트 포함 -->
    <TodoHeader />
    <div class="todo-app">
      <h1>Todo List</h1>
      <div ref="tabulator"></div>
      <div class="new-todo">
        <!-- 할 일 추가 입력란과 버튼 -->
        <select v-model="selectedCategory" class="category-select">
          <option disabled value="">카테고리 선택</option>
          <option value="가사">가사</option>
          <option value="공부">공부</option>
          <option value="쇼핑">쇼핑</option>
          <option value="일상">일상</option>
          <option value="약속 및 일정">약속 및 일정</option>
        </select>
        <input v-model="newTodo" placeholder="새로운 할 일 추가" />
        <MyButton buttonClass="add" @click="addTodo">Add Todo</MyButton>
      </div>
      <EditModal
        v-if="showModal"
        :editTodoTitle="editTodoTitle"
        @save="updateTodo"
        @close="closeModal"
      />
    </div>
  </div>
</template>

<script>
import TodoHeader from "@/components/TodoHeader.vue";
import MyButton from "@/components/MyButton.vue";
import EditModal from "@/components/EditModal.vue";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

export default {
  name: "TodoList",
  components: {
    TodoHeader,
    MyButton,
    EditModal,
  },
  data() {
    return {
      todos: [
        { id: 1, displayId: 1, title: "영어 공부하기", category: "공부", completed: false },
        { id: 2, displayId: 2, title: "도시락통 설거지하기", category: "집안일", completed: false },
        { id: 3, displayId: 3, title: "토요일에 친구랑 약속", category: "약속 및 일정", completed: false },
        { id: 4, displayId: 4, title: "물 4잔 마시기", category: "일상", completed: false },
      ],
      newTodo: "",
      selectedCategory: "", // 사용자가 선택한 카테고리 저장
      table: null,
      showModal: false,
      editTodoId: null,
      editTodoTitle: "",
      nextId: 3,
    };
  },
  mounted() {
    this.initializeTable();
  },
  updated() {
    if (this.table) {
      this.table.replaceData(this.todos);
    }
  },
  methods: {
    initializeTable() {
      this.table = new Tabulator(this.$refs.tabulator, {
        data: this.todos,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 10,
        autoHeight: true,
        columns: [
          {
            title: "No",
            field: "displayId", // 사용자에게 보여질 순서 번호
            sorter: "number",
            width: 80,
            hozAlign: "center",
          },
          {
            title: "Title",
            field: "title",
            sorter: "string",
            widthGrow: 3,
            headerHozAlign:'center',
          },
          {
            title: "Category",
            field: "category", // 카테고리 칼럼
            sorter: "string",
            width: 50,
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
        ],
      });
    },
    handleIconClick(e, cell) {
      const row = cell.getRow().getData();
      if (e.target.classList.contains("edit-icon")) {
        this.openEditModal(row.id, row.title);
      } else if (e.target.classList.contains("delete-icon")) {
        this.deleteTodo(row.id);
      }
    },
    addTodo() {
      if (this.newTodo.trim() !== "" && this.selectedCategory) {
        const newTodoItem = {
          id: this.nextId,
          displayId: this.todos.length + 1,
          title: this.newTodo,
          category: this.selectedCategory, // 선택한 카테고리 추가
          completed: false,
        };
        this.todos.push(newTodoItem); // Vue 데이터 업데이트
        this.table.addRow(newTodoItem); // Tabulator 테이블에 항목 추가
        this.newTodo = ""; // 입력란 초기화
        this.selectedCategory = ""; // 선택된 카테고리 초기화
        this.nextId += 1; // 다음 ID 증가
      }
    },
    deleteTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.updateDisplayIds();
      this.table.setData(this.todos);
    },
    toggleCompleted(id) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        this.table.updateData([{ id, completed: todo.completed }]);
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
    updateDisplayIds() {
      this.todos.forEach((todo, index) => {
        todo.displayId = index + 1;
      });
    },
  },
};
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
.todo-app {
  max-width: 1000px;
  margin: 50px auto;
  font-family: "Noto Sans KR", sans-serif;
  text-align: center;
  background-color: #ffe6f0;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.new-todo {
  margin-top: 50px;
}

.new-todo input, .category-select {
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #f8b6c8;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
