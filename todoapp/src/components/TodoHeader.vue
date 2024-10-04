<template>
  <header class="header">
    <div class="logo" @click="goHome">todolist</div>
    <nav class="nav">
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
      this.$emit('go-home');
    },
    goToTodoArea() {
      this.$router.push('/1'); //TodoArea로 이동
    }
  },
};
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
.header {
  background-color: #ff85a1;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  color: white;
  font-size: 24px;
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
