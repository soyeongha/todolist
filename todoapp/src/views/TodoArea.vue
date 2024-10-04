<template>
    <div>
      <h1>Todo List</h1>
      <div ref="tabulator" id="example-table"></div>
    </div>
  </template>
  
  <script>
  import Tabulator from 'tabulator-tables'; // Tabulator 모듈 가져오기
  import 'tabulator-tables/dist/css/tabulator.min.css'; // Tabulator CSS 가져오기
  
  export default {
    name: 'TodoArea',
    data() {
      return {
        todos: [
          { id: 'A001', category: '가사항목' },
          { id: 'B001', category: '공부항목' },
          { id: 'C001', category: '약속 및 일정 항목' },
        ],
        table: null, // Tabulator 인스턴스를 저장할 변수
      };
    },
    mounted() {
      this.initializeTable(); // Tabulator 객체 생성
    },
    beforeUnmount() {
      if (this.table) {
        this.table.destroy(); // Tabulator 인스턴스 해제
      }
    },
    methods: {
      initializeTable() {
        // Tabulator 테이블 생성
        this.table = new Tabulator(this.$refs.tabulator, {
          layout: "fitColumns",
          data: this.todos, // 동적 데이터 사용
          columns: [
            { title: 'ID', field: 'id', width: 100 },
            { title: '카테고리', field: 'category', width: 150 },
          ],
          pagination: "local", // 페이지네이션 활성화
          paginationSize: 5, // 페이지당 표시할 행 수
        });
      },
      addTodo(newTodo) {
        this.todos.push(newTodo); // 새로운 할 일을 todos 배열에 추가
        this.table.setData(this.todos); // 테이블 데이터 업데이트
      },
    },
  };
  </script>
  
  <style scoped>
  #example-table {
    margin-top: 20px;
  }
  </style>
  