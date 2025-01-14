<template>
    <svg width="100%" height="100%" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.6667 0C16.6116 0 18.4769 0.772617 19.8521 2.14788C21.2274 3.52315 22 5.38841 22 7.33333C22 9.27825 21.2274 11.1435 19.8521 12.5188C18.4769 13.8941 16.6116 14.6667 14.6667 14.6667C12.7217 14.6667 10.8565 13.8941 9.48122 12.5188C8.10595 11.1435 7.33333 9.27825 7.33333 7.33333C7.33333 5.38841 8.10595 3.52315 9.48122 2.14788C10.8565 0.772617 12.7217 0 14.6667 0ZM14.6667 18.3333C22.77 18.3333 29.3333 21.615 29.3333 25.6667V29.3333H0V25.6667C0 21.615 6.56333 18.3333 14.6667 18.3333Z" :fill="color"/>
    </svg>
</template>

<script>
import { mapStores } from 'pinia';
import { useGlobalStore } from '../../store/global.js';
import fetch from "/src/js/fetch.js";
export default {
    props: {
        active: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    computed:{
        color(){
            if(this.active){
                return "rgb(171, 57, 59)"
            }else{
                return "black"
            }
        }
    },
}

</script>