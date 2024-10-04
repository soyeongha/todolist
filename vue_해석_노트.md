<template>
  <div class="todo-app">
    <h1>Todo List</h1>
    <div ref="tabulator"></div>
    <!-- 이 div에 Tabulator를 사용하여 테이블을 렌더링할 공간 -->

    <div class="new-todo">
      <input v-model="newTodo" placeholder="Add new todo" />
      <!-- 새로운 할 일을 입력하는 input 필드 -->
      <!-- Add Todo 버튼 (MyButton 컴포넌트를 사용) -->
      <MyButton buttonClass="add" @click="addTodo">Add Todo</MyButton>
    </div>

    <!-- 모달 창 (할 일 수정용) -->
    <EditModal
      v-if="showModal"
      :editTodoTitle="editTodoTitle"
      <!--앞의 editTodotle은 자식(EditModal의 속성)이고 뒤의 editTodoTitle은 부모(app의 속성)이다
      @save="updateTodo"
      @close="closeModal"
    />
    <!-- 모달 창은 showModal이 true일 때만 표시됨 -->
    <!-- editTodoTitle 속성을 전달하고, 저장과 닫기 이벤트를 처리함 -->
  </div>
</template>

<script>
// Tabulator 라이브러리 및 스타일시트 임포트
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

// 버튼 및 모달 컴포넌트 임포트
import MyButton from "./components/MyButton.vue";
import EditModal from "./components/EditModal.vue"; // 할 일 수정용 모달 컴포넌트

export default {
  components: {
    EditModal, // EditModal 컴포넌트를 등록
  },
  data() {
    return {
      todos: [
        { id: 1, title: "vue.js 공부하기", completed: false },
        { id: 2, title: "도시락통 설거지", completed: false },
      ],
      // 할 일 리스트 배열
      newTodo: "", // 새로운 할 일 제목을 저장하는 변수
      table: null, // Tabulator 테이블 객체
      showModal: false, // 모달 표시 여부
      editTodoId: null, // 현재 수정 중인 할 일의 ID
      editTodoTitle: "", // 현재 수정 중인 할 일의 제목
    };
  },
  mounted() {
    // 컴포넌트가 DOM에 마운트되면 Tabulator 테이블 초기화
    this.table = new Tabulator(this.$refs.tabulator, {
      data: this.todos, // 초기 데이터는 todos 배열
      layout: "fitColumns", // 열 크기를 자동으로 조절
      autoHeight: true, // 테이블 높이를 데이터에 맞춤
      columns: this.getColumns(), // 테이블의 컬럼 설정
    });
  },
  methods: {
    getColumns() {
      // Tabulator 테이블 컬럼 정의
      return [
        {
          title: "ID",
          field: "id",
          sorter: "number",
          width: 50,
          hozAlign: "center",
          // ID 컬럼: 숫자 정렬, 너비 50, 가운데 정렬
        },
        {
          title: "Title",
          field: "title",
          sorter: "string",
          widthGrow: 3,
          tooltip: true,
          // 할 일 제목 컬럼: 문자열 정렬, 너비 증가
        },
        {
          title: "Completed",
          field: "completed",
          formatter: "tickCross",
          sorter: "boolean",
          width: 100,
          hozAlign: "center",
          // 완료 여부 컬럼: 체크/크로스 표시, 불리언 정렬
        },
        {
          title: "Complete",
          formatter: () => `<button class="complete-btn">Complete</button>`,
          width: 100,
          align: "center",
          cellClick: (e, cell) => {
            const row = cell.getRow().getData();
            if (e.target.classList.contains("complete-btn")) this.toggleCompleted(row.id);
            // 'Complete' 버튼 클릭 시 완료 상태 변경
          },
        },
        {
          title: "",
          formatter: () => `
            <span class="edit-icon material-icons" style="cursor: pointer; margin-right: 10px;">edit</span>
            <span class="delete-icon material-icons" style="cursor: pointer;">delete</span>
          `,
          width: 80,
          align: "center",
          cellClick: (e, cell) => this.handleIconClick(e, cell),
          // 수정 및 삭제 아이콘 클릭 시 해당 기능 실행
        },
      ];
    },
    handleIconClick(e, cell) {
      const row = cell.getRow().getData();
      if (e.target.classList.contains("edit-icon")) {
        this.openEditModal(row.id, row.title);
        // 'edit' 아이콘 클릭 시 모달 열기
      } else if (e.target.classList.contains("delete-icon")) {
        this.deleteTodo(row.id);
        // 'delete' 아이콘 클릭 시 할 일 삭제
      }
    },
    openEditModal(id, title) {
      this.editTodoId = id;
      this.editTodoTitle = title;
      this.showModal = true;
      // 모달을 열고 편집할 할 일의 ID와 제목 설정
    },
    closeModal() {
      this.showModal = false;
      this.editTodoId = null;
      this.editTodoTitle = "";
      // 모달 닫기 및 편집 상태 초기화
    },
    updateTodo(newTitle) {
      const todoIndex = this.todos.findIndex((todo) => todo.id === this.editTodoId);
      if (todoIndex !== -1) {
        this.todos[todoIndex].title = newTitle;
        this.table.updateData([{ id: this.editTodoId, title: newTitle }]);
        // 할 일의 제목을 업데이트하고 Tabulator 데이터 갱신
      }
      this.closeModal(); // 수정 후 모달 닫기
    },
    addTodo() {
      if (this.newTodo.trim() !== "") {
        const newTodoItem = {
          id: Date.now(), // 현재 시간으로 유니크 ID 생성
          title: this.newTodo,
          completed: false,
        };
        this.todos.push(newTodoItem); // 새로운 할 일을 배열에 추가
        this.table.addRow(newTodoItem); // Tabulator 테이블에 새로운 행 추가
        this.newTodo = ""; // 입력 필드 초기화
      }
    },
    deleteTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.table.deleteRow(id);
      // 할 일을 배열에서 삭제하고 테이블에서도 제거
    },
    toggleCompleted(id) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        this.table.updateData([{ id, completed: todo.completed }]);
        // 할 일의 완료 상태를 반대로 변경하고 Tabulator에 갱신
      }
    },
  },
};
</script>

<style scoped>
.todo-app {
  max-width: 700px; /* 최대 너비 설정 */
  margin: 50px auto; /* 중앙 정렬 */
  font-family: 'Noto Sans KR', sans-serif; /* 폰트 설정 */
  text-align: center; /* 텍스트 가운데 정렬 */
  background-color: #ffe6f0; /* 배경색 설정 */
  padding: 20px; /* 패딩 설정 */
  border-radius: 16px; /* 둥근 테두리 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.new-todo {
  margin-top: 20px; /* 상단 여백 */
}

.new-todo input {
  padding: 10px; /* 입력 필드 패딩 */
  width: 70%; /* 너비 설정 */
  border: 1px solid #f8b6c8; /* 테두리 색상 설정 */
  border-radius: 16px; /* 둥근 모서리 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.new-todo button {
  padding: 10px 20px; /* 버튼 패딩 */
  margin-left: 10px; /* 좌측 여백 */
  background: #ff85a1; /* 버튼 배경색 */
  color: white; /* 버튼 텍스트 색상 */
  border: none; /* 테두리 제거 */
  border-radius: 16px; /* 둥근 테두리 */
  cursor: pointer; /* 커서 모양 변경 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
  transition: background-color 0.3s ease, transform 0.2s ease; /* 배경색과 크기 변환 효과 */
}

.new-todo button:hover {
  background: #ff6783; /* 호버 시 색상 변경 */
  transform: scale(1.05); /* 호버 시 약간 확대 */
}

/* Tabulator 테이블 스타일 */
.todo-app .tabulator {
  width: 100%; /* 테이블 너비 설정 */
  border: 1px solid #f8b6c8; /* 테두리 색상 설정 */
  border-radius: 16px; /* 테두리 둥글게 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.todo-app .tabulator .tabulator-header {
  background-color: #ffccde; /* 헤더 배경색 */
  font-weight: bold; /* 헤더 텍스트 굵게 설정 */
  border-bottom: 2px solid #f8b6c8; /* 헤더 하단 테두리 */
}

.todo-app .tabulator .tabulator-row {
  background-color: #ffe6f0; /* 행 배경색 설정 */
  transition: background-color 0.3s ease; /* 배경색 변환 효과 */
}

.todo-app .tabulator .tabulator-row:hover {
  background-color: #ffdae8; /* 마우스 오버 시 배경색 변경 */
}

.todo-app .tabulator .tabulator-cell {
  padding: 12px 8px; /* 셀 패딩 설정 */
  border-right: 1px solid #f8b6c8; /* 셀 간의 구분 테두리 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

.todo-app .tabulator .tabulator-cell:last-child {
  border-right: none; /* 마지막 셀의 테두리 제거 */
}

/* Complete 버튼 스타일 */
.todo-app .tabulator .complete-btn {
  background-color: #ff85a1 !important; /* 버튼 배경색 */
  color: white !important; /* 버튼 텍스트 색상 */
  border: none !important; /* 테두리 제거 */
  padding: 5px 10px; /* 버튼 패딩 설정 */
  cursor: pointer; /* 커서 모양 변경 */
  border-radius: 12px; /* 둥근 테두리 설정 */
  transition: background-color 0.3s ease; /* 배경색 변환 효과 */
}

.todo-app .tabulator .complete-btn:hover {
  background-color: #ff6783 !important; /* 호버 시 배경색 변경 */
}
</style>
