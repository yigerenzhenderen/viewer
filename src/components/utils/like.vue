<template>
    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.81024 2.81476L9.28234 3.55662L9.75443 2.81476C10.5325 1.59204 11.9068 0.807624 13.4792 0.807624C15.94 0.807624 17.9558 2.82338 17.9558 5.28424C17.9558 6.37492 17.4529 7.518 16.6214 8.65178C15.7943 9.77975 14.6792 10.8475 13.5445 11.7759C12.4126 12.702 11.2779 13.4759 10.4246 14.0189C9.99848 14.2901 9.64392 14.5028 9.39672 14.6473C9.35596 14.6711 9.31813 14.693 9.28339 14.7131C9.24849 14.6928 9.21046 14.6706 9.16946 14.6464C8.9222 14.5009 8.56755 14.2867 8.14137 14.0138C7.28792 13.4675 6.15295 12.6896 5.02076 11.7607C3.8858 10.8295 2.77038 9.76013 1.94296 8.63371C1.11095 7.50105 0.608893 6.36351 0.608893 5.28424C0.608893 2.82338 2.62465 0.807624 5.08551 0.807624C6.65784 0.807624 8.03215 1.59204 8.81024 2.81476Z" 
            :stroke="clicked ? activeColor : '#808080'" 
            :fill="clicked ? activeColor : 'none'"
            stroke-width="1.11915"/>
    </svg>
</template>

<script>
import { mapStores } from 'pinia';
import { useGlobalStore } from '../../store/global.js';
import fetch from "/src/js/fetch.js";
export default {
    props: {
        activeColor: {
            type: String,
            default: '#808080',
            required: false
        },
        clicked: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    computed:{
        ...mapStores(useGlobalStore)
    },
    watch:{
        async clicked(newState){
            await this.globalStore.like(1,newState)
        }
    }
}

</script>