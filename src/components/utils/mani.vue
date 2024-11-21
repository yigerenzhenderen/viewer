<template>
    <div v-show="detailStore.maniShow" class="option" :style="{left: detailStore.x +'px', top: detailStore.y + 15 + 'px'}">
        <div class="item" @mouseenter="active.view = true" @mouseleave="active.view = false">
            <!-- <img class="i" :src="view" alt="" /> -->
            <viewIcon :active-color="'#2A2A2A'" :active="active.view"></viewIcon>
            <span class="t">{{ 1125 }}</span>
        </div>
        <div class="item" @mouseenter="active.forward = true" @mouseleave="active.forward = false">
            <!-- <img class="i" :src="forward" alt=""/> -->
            <forwardIcon :active-color="'#2A2A2A'" :active="active.forward"></forwardIcon>
            <span class="t">{{ 22 }}</span>
        </div>
        <div class="item" @mouseenter="active.like = true" @mouseleave="active.like = false" @click="likeClick">
            <!-- <img class="i" :src="like" alt="like"/> -->
            <likeIcon :active-color="'#F34C4F'" :active="active.like" :clicked="clicked.like"></likeIcon>
            <span class="t" :style="{color : clicked.like ? '#F34C4F' : '#808080'}">点赞</span>
        </div>
    </div>
</template>


<script>
import { useDetailStore } from '/src/store/detail';
import { mapStores } from 'pinia';
import forwardIcon from "./forward.vue";
import likeIcon from "./like.vue";
import viewIcon from "./view.vue";


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
    components:{
        forwardIcon,
        likeIcon,
        viewIcon,
    },
    data(){
        return {
            active:{
                forward: false,
                like: false,
                view: false
            },
            clicked:{
                forward: false,
                like: false,
                view: false
            }
        }
    },
    methods:{
        likeClick(e){
            e.preventDefault();
            this.clicked.like = !this.clicked.like;
            // setTimeout(() => {
            //     this.clicked.like = false;
            // }, 500);
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
    width: 120px;
    height: 25px;
    transform-origin: 100% 0%;
    z-index: 100;

    .item{
        width: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .item svg{
        position: relative;
        height: 100%;
        flex-shrink: 0;
    }

    .i{
        width: 100%;
        height: 100%;
    }

    .t{
        font-size: 10px;
        color: #808080;
    }
}
</style>