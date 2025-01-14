<template>
    <svg width="100%" height="100%" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.2087 22.6435V7.26478L8.30261 12.1709L5.66087 9.43478L15.0957 0L24.5304 9.43478L21.8887 12.1709L16.9826 7.26478V22.6435H13.2087ZM3.77391 30.1913C2.73609 30.1913 1.84796 29.8221 1.10953 29.0837C0.371101 28.3452 0.00125797 27.4565 0 26.4174V20.7565H3.77391V26.4174H26.4174V20.7565H30.1913V26.4174C30.1913 27.4552 29.8221 28.344 29.0837 29.0837C28.3452 29.8233 27.4565 30.1926 26.4174 30.1913H3.77391Z" :fill="color"/>
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