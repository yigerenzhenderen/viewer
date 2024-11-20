<template>
    <div v-show="detailStore.maniShow" class="option" :style="{left: detailStore.x - 100 +'px', top: detailStore.y + 20 + 'px'}">
        <div class="item">
            <img class="i" :src="view" alt="" />
            <span class="t">{{ 1125 }}</span>
        </div>
        <div class="item">
            <img class="i" :src="forward" alt=""/>
            <span class="t">{{ 22 }}</span>
        </div>
        <div class="item">
            <img class="i" :src="like" alt="like"/>
            <span class="t">点赞</span>
        </div>
    </div>
</template>


<script>
import view from "/src/assets/view.svg"
import forward from "/src/assets/forward.svg"
import like from "/src/assets/like.svg";
import { useDetailStore } from '/src/store/detail';
import { mapStores } from 'pinia';

export default{
    props:{
        // show : {
        //     type: Boolean,
        //     required: false,
        //     default: true
        // },
        // x:{
        //     type: Number,
        //     required: false,
        //     default: 500
        // },
        // y:{
        //     type: Number,
        //     required: false,
        //     default: 500
        // }
    },
    data(){
        return {
            view: view,
            forward: forward,
            like: like,

        }
    },
    computed:{
        ...mapStores(useDetailStore)
    }
}
</script>


<style scoped>
.option{
    display: flex;
    justify-content: space-between;
    position: absolute;
    width: 100px;
    height: 20px;
    transform-origin: 100% 0%;

    .item{
        width: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .i{
        width: 100%;
        height: 100%;
    }

    .t{
        font-size: 8px;
        color: #808080;
    }
}
</style>