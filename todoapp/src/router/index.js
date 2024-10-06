import { createRouter, createWebHistory } from "vue-router";

//연결할 각 컴포넌트 import
import TodoArea from "@/views/TodoArea.vue";
import TodoList from "@/views/TodoList.vue"; // TodoList.vue 임포트

//라우터 설계
const routes = [
    {path: '/', component: TodoList},
    {path: '/todo-area', component:TodoArea},
    { path: '/todos', component: TodoList }, // TodoList 경로 추가
]

//라우터 생성
const router = createRouter({
    history:createWebHistory(),
    routes
});

// 라우터 추출 (main.js에서 import)
export {router}
//뷰라우터의 사용은 main.js에서 use를 통해 할 수 있다. 
//메인 뷰파일에 템플릿에는 <router-view>태그를 통해 경로에 따라 다른 컴포넌트들이 올 수 있게 한다.
//사용법 <template>
//   <div id="app">
//   <!-- uri에 따라 해당 컴포넌트가 router-view를 대신함 -->
//   <router-view></router-view>
// </div>
// </template>