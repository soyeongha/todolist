<template>
    <button :class="buttonClass" @click="$emit('click')">
      <slot></slot>
    </button>
  </template>
  
  <script>
  export default {
    props: {
      buttonClass: {
        type: String,
        default: ''
      }
    }
  };
  </script>
  
  <style scoped>
  button {
    padding: 10px 20px;/* 버튼 내부의 텍스트와 테두리 사이의 여백을 설정. 상하 5px, 좌우 10px의 패딩을 추가하여 버튼을 더 크고 보기 좋게 만듦 */
  margin-left: 10px;
  background: #ff85a1; /* 버튼 배경을 파스텔 핑크로 */
  color: white;
  border: none;
  border-radius: 16px; /* 버튼을 둥글게 */
  cursor: pointer; /* 버튼 위에 마우스를 올렸을 때 포인터 커서가 보이도록 설정 (클릭 가능하다는 시각적 신호) */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease; /* 배경색 변화가 부드럽게 일어나도록 설정. 배경색 변경 시 0.3초 동안 점진적으로 변화하도록 함 */
}
  
  .complete {
    background: #28a745;
    color: white;
  }
  
  .delete {
    background: #dc3545;
    color: white;
    
  }

  button:hover {
    opacity: 0.8;  /* 마우스를 버튼 위에 올렸을 때 버튼의 투명도를 80%로 설정하여 시각적으로 강조 효과를 줌 */
  }
  </style>
  