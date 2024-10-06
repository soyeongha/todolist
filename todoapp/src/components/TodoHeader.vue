<template>
  <header class="header">
    <div class="logo" @click="goHome">todolist</div>
    <nav class="nav">
      <!-- "할일목록" 버튼 클릭 시 TodoArea로 이동 -->
      <MyButton buttonClass="nav-btn" @click="goToTodoArea">할일목록</MyButton>
      <MyButton buttonClass="nav-btn">미정</MyButton>
      <MyButton buttonClass="nav-btn">미정</MyButton>
    </nav>
  </header>
</template>

<script>
import MyButton from './MyButton.vue';

export default {
  name: "TodoHeader",  // 이름을 다중 단어로 변경
  components: {
    MyButton,
  },
  methods: {
    goHome() {
      this.$router.push('/'); // 홈으로 이동
    },
    goToTodoArea() {
      this.$router.push('/todo-area'); // TodoArea로 이동
    }
  },
};
</script>

<style scoped>
.header {
  background-color: #ff85a1;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  color: white;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
}
.nav {
  display: flex;
  gap: 10px;
}
.nav-btn {
  background-color: white;
  color: #ff85a1;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: bold;
}
</style>
