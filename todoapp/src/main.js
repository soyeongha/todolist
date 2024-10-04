import { createApp } from 'vue'
import App from './App.vue'
// 생성한 뷰 라우터 받아오기
import { router } from './router/index.js'


const app = createApp(App); //app변수에 Vue애플리케이션 인스턴스를 저장
app.use(router); // use 메서드를 통해 Vue 애플리케이션에 플러그인이나 라우터를 추가할 수 있음
app.mount('#app'); // #app 요소에 애플리케이션을 렌더링합니다.
