<template>
  <div class="todo-header">
    <TodoHeader @go-home="goHome" />
  </div>
  <div class="todo-app">
    
    <h1>Todo List</h1>
    <div ref="tabulator"></div>
    <!-- 이 div에 테이블을 렌더링 -->
    <div class="new-todo">
      <input v-model="newTodo" placeholder="Add new todo" />
      <!-- Add Todo 버튼 -->
      <MyButton buttonClass="add" @click="addTodo">Add Todo</MyButton>
    </div>

    <!-- 모달 창 -->
    <EditModal
      v-if="showModal"
      :editTodoTitle="editTodoTitle"
      @save="updateTodo"
      @close="closeModal"
    />
  </div>
</template>

<script>
import TodoHeader from './components/TodoHeader.vue'; // 헤더 컴포넌트 임포트
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

import MyButton from "./components/MyButton.vue";
import EditModal from "./components/EditModal.vue"; // EditModal 컴포넌트 임포트

export default {
  components: {
    MyButton,
    EditModal, // 모달 컴포넌트 등록
    TodoHeader, // TodoHeader 컴포넌트 등록
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
    // displayId를 추가하기 위해 먼저 호출
    this.updateDisplayIds();
    // Tabulator 객체 생성
    this.table = new Tabulator(this.$refs.tabulator, {
      data: this.todos,
      layout: "fitColumns",
      pagination: "local", // 페이지네이션 활성화
      paginationSize: 10,  // 페이지당 표시할 행 수 (10개씩 표시)
      autoHeight: true,
      columns: this.getColumns(),
      nextId: 3, // 다음 할 일에 사용할 ID 값 (현재 할 일들이 2개이므로 3부터 시작)
    });
  },
  methods: {
    getColumns() {
      return [
        {
          title: "No", // 사용자에게 표시될 번호
          field: "displayId",
          sorter: "number",
          headerHozAlign: "center", // 헤더 텍스트 중앙 정렬
          width: 80,
          hozAlign: "center", //컬럼의 내용 중앙정렬
        },
        {
          title: "Title",
          field: "title",
          sorter: "string",
          headerHozAlign: "center", // 헤더 텍스트를 중앙 정렬
          widthGrow: 3,
          tooltip: true,
        },
        {
          title: "Status",
          field: "completed",
          headerHozAlign: "center", // 헤더 텍스트를 중앙 정렬
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
          id: this.nextId, // 데이터베이스와 연결해서 사용하는 고유식별자
          title: this.newTodo,
          completed: false,
        };
        this.todos.push(newTodoItem);
        this.table.addRow(newTodoItem);
        this.updateDisplayIds(); // 할 일이 추가될 때마다 표시될 사용자에게 보이는ID 재정렬
        this.table.setData(this.todos); // 테이블 데이터 업데이트
        this.newTodo = "";
        this.nextId += 1; // 할일이 추가될 때마다 기존의 값에+1을 한 새로운 id를 부여함.
      }
    },
    deleteTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.updateDisplayIds(); // 할 일이 삭제되면 표시될 ID 재정렬
      this.table.setData(this.todos); // 테이블 데이터 업데이트
      
    },
    updateDisplayIds() {
      // 사용자에게 보여주는 ID(displayId)를 다시 순차적으로 부여합니다.
      this.todos.forEach((todo, index) => {
        todo.displayId = index + 1; // displayId를 1부터 시작하도록 설정
      });
    },
    toggleCompleted(id) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed; // 상태 반전
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
