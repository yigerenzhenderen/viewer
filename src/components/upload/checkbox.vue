<template>
  <div class="u-check-wrapper">
      <div class="u-check">
          <svg style="pointer-events: none;" v-if="choose" width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="black"/>
              <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="white"/>
              <path d="M12 5L6.5 10.5L4 8" stroke="white" stroke-width="1.6666" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg style="pointer-events: none;" v-else width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="white"/>
              <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#757575"/>
          </svg>
      </div>
      <input type="checkbox" class="i-ch" :checked="choose" @change="$emit('update:choose', $event.target.checked)">
  </div>
</template>
  
  
  <script>
  import { useUploadStore } from '/src/store/upload';
  import { mapState, mapStores } from 'pinia';

  export default{
    props:{
        id: 0,
        choose: false,
        name: "",
    },
    emits: ['update:choose'],
  }
  </script>
  
  
  <style>

  .u-check-wrapper{
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    margin: 10px;
    position: relative;
    cursor: pointer;
  }

  .u-check{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .i-ch{
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    margin: 0;
  }
  </style>