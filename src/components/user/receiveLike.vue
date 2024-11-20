<template>
    <div>
        receivLike
    </div>
</template>


<script>
import { useInfoStore } from '../../store/info.js';
import { mapState, mapStores } from 'pinia';

export default{
    computed:{
        ...mapStores(useInfoStore)
    },
    methods: {
        marked: function (input) {
        return marked(input);
        }
    },
    mounted() {
    }
}
</script>


<style>

</style>