<template>
    <div v-show="maniShow" class="option" :style="{left: detailStore.x +'px', top: detailStore.y + 15 + 'px'}">
        <div class="item" @mouseenter="active.view = true" @mouseleave="active.view = false">
            <!-- <img class="i" :src="view" alt="" /> -->
            <viewIcon :active-color="'#2A2A2A'" :active="active.view"></viewIcon>
            <span class="t">{{ this.detailStore.currentImg.browseCount }}</span>
        </div>
        <div class="item" @click="forwardClick" @mouseenter="active.forward = true" @mouseleave="active.forward = false">
            <!-- <img class="i" :src="forward" alt=""/> -->
            <forwardIcon :active-color="'#2A2A2A'" :active="active.forward"></forwardIcon>
            <span class="t">{{ this.detailStore.currentImg.forwardCount }}</span>
        </div>
        <div class="item" @click="likeClick" @mouseenter="active.like = true" @mouseleave="active.like = false">
            <!-- <img class="i" :src="like" alt="like"/> -->
            <likeIcon :active-color="'#F34C4F'" :active="active.like" :clicked="clicked.like"></likeIcon>
            <span class="t" :style="{color : clicked.like ? '#F34C4F' : '#808080'}">{{ clicked.like ? this.detailStore.currentImg.likeCount : "点赞"}}</span>
        </div>
    </div>
</template>


<script>
import { useDetailStore } from '/src/store/detail';
import { useGlobalStore } from '/src/store/global';
import { useDiscussStore } from '/src/store/discuss';
import { mapStores } from 'pinia';
import fetch from "/src/js/fetch";
import forwardIcon from "./forward.vue";
import likeIcon from "./like.vue";
import viewIcon from "./view.vue";


export default{
    components:{
        forwardIcon,
        likeIcon,
        viewIcon,
    },
    data(){
        return {
            forwarded: false,
            active:{
                forward: false,
                like: false,
                view: false
            },
            clicked:{
                forward: false,
                like: false,
                view: false
            },
            // img: {
            //     browseCount: 0,
            //     forwardCount: 0,
            //     likeCount: 0,
            //     imageEntryFileInfos: []
            // },
        }
    },
    methods:{
        async likeClick(e){
            e.preventDefault();
            this.clicked.like = !this.clicked.like;
            this.detailStore.currentImg.likeCount += (this.clicked.like ? 1 : -1)
            this.globalStore.like(this.detailStore.imageId, this.clicked.like);
            // const likeHistory = await this.globalStore.getLikeHistory();
            // console.log(likeHistory)
        },
        async forwardClick(e){
            e.preventDefault();
            if(this.forwarded) {
                await navigator.clipboard.writeText("[湖南影像档案] 向你分享了一张图片 " + this.detailStore.currentImg.imageEntryFileInfos[0].filePath);
                this.globalStore.showReminder("链接复制成功！");
                return
            };
            this.forwarded = true;
            this.detailStore.currentImg.forwardCount += 1;
            this.globalStore.forward(this.detailStore.imageId);
            await navigator.clipboard.writeText("[湖南影像档案] 向你分享了一张图片 " + this.detailStore.currentImg.imageEntryFileInfos[0].filePath);
            this.globalStore.showReminder("链接复制成功！");
        }
    },
    computed:{
        ...mapStores(useDetailStore, useGlobalStore, useDiscussStore),
        maniShow(){return !this.detailStore.hide;}
    },
    watch:{
        async maniShow(show){
            if(show){
                // const result = await fetch.getImg(this.detailStore.imageId);
                // this.img = (!!result) ? result : this.$options.data().img;
                this.globalStore.view(this.detailStore.imageId);
                // this.discussStore.discussList = this.img.memberCommentLogsList;
                
            }else{
                this.forwarded = false;
            }
        }
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