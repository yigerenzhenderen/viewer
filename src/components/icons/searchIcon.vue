<template>
    <svg width="100%" height="100%" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 4C7.80558 4 4 7.80558 4 12.5C4 17.1944 7.80558 21 12.5 21C17.1944 21 21 17.1944 21 12.5C21 7.80558 17.1944 4 12.5 4ZM0 12.5C0 5.59644 5.59644 0 12.5 0C19.4036 0 25 5.59644 25 12.5C25 19.4036 19.4036 25 12.5 25C5.59644 25 0 19.4036 0 12.5Z" :fill="color"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M28 31L18 21L20.8284 18.1716L30.8284 28.1716L28 31Z" :fill="color"/>
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