<template>
    <div class="receive-like-container">
        <div style="font-size: 24px; font-weight: bold; margin-top: 28px; margin-bottom: 20px;">修订记录</div>
        <div style="margin-bottom: 20px; display: flex; width: 260px; justify-content: space-between;">
            <span :class="{'type': true, 'type2': type == 8 ? true : false}" @click="type = 8">已发布</span>
            <span :class="{'type': true, 'type2': type == 1 ? true : false}" @click="type = 1">审核中</span>
            <span :class="{'type': true, 'type2': type == 2 ? true : false}" @click="type = 2">未通过</span>
        </div>
        <div class="div-container">
            <div class="wrapper">
                <div v-for="img in dataList" class="img-container"
                    @mouseenter="img.hoverImg=true"
                    @mouseleave="img.hoverImg=false"
                >
                    <img :src="tempSrc" alt="" style="width: 100%; height: 200px;">
                    <div style="margin-top: 5px; margin-left: 5px;">{{ img.name }}</div>
                    <!-- <div v-if="type===0" class="icon-group">
                        <div class="icon">
                            <img :src="view_url" alt="">
                            <span>{{ img.view }}</span>
                        </div>
                        <div class="icon">
                            <img :src="like_url" alt="">
                            <span>{{ img.like }}</span>
                        </div>
                        <div class="icon">
                            <img :src="forward_url" alt="">
                            <span>{{ img.forward }}</span>
                        </div>
                        <div class="icon">
                            <img :src="comment_url" alt="">
                            <span>{{ img.comment }}</span>
                        </div>
                    </div> -->
                    <div style="font-size: 12px; text-align: left; color: #A3A3A3; margin: 8px 5px;">
                        修订时间 &thinsp;{{ img.time }}
                    </div>
                    <!-- <div v-if="type===0" style="display: flex; justify-content: end; height: 15px; font-size: 12px; color:#545454; cursor: pointer; margin-right: 5px;"
                        @mouseover="img.hoverRemove=true"
                        @mouseout="img.hoverRemove=false"
                        @click="remove(img)">
                        <span :style="{color: img.hoverRemove ? '#F93232' : null}">删除</span>
                        <div style="display:flex; width: 15px; height: 15px; position: relative; margin-left: 0px;">
                            <Remove :selected="img.hoverRemove" :activeColor="'#F93232'"></Remove>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import Checkbox from "../upload/checkbox.vue";
import Avatar from "../utils/avatar.vue";
import Remove from "../utils/remove.vue";
import Checkbox3  from "../utils/checkbox3.vue";
import viewSvg from "/src/assets/view.svg"
import forwardSvg from "/src/assets/forward.svg"
import likeSvg from "/src/assets/like.svg"
import commentSvg from "/src/assets/comment.svg"
import tempSrc from "/src/assets/temp.jpg"
import fetch from "../../js/fetch";
import { useGlobalStore } from '../../store/global.js';
import { mapStores } from 'pinia';

export default{
    data(){
        return {
            tempSrc: tempSrc,
            view_url: viewSvg,
            forward_url: forwardSvg,
            like_url: likeSvg,
            comment_url: commentSvg,
            type: 8,
            selectAll: false,
            allImgs: [],
            dataList: [
                // {view: 10, like: 10, forward: 10, comment: 1, name:"图像名称1", time:"2024年12月2日12:00", hoverRemove: false, hoverImg:false},
                // {view: 10, like: 10, forward: 10, comment: 1, name:"图像名称2", time:"2024年12月2日12:00", hoverRemove: false, hoverImg:false},
                // {view: 10, like: 10, forward: 10, comment: 1, name:"图像名称3", time:"2024年12月2日12:00", hoverRemove: false, hoverImg:false},
                // {view: 10, like: 10, forward: 10, comment: 1, name:"图像名称4", time:"2024年12月2日12:00", hoverRemove: false, hoverImg:false},
                // {view: 10, like: 10, forward: 10, comment: 1, name:"图像名称5", time:"2024年12月2日12:00", hoverRemove: false, hoverImg:false},
                // {view: 10, like: 10, forward: 10, comment: 1, name:"图像名称6", time:"2024年12月2日12:00", hoverRemove: false, hoverImg:false},
                // {view: 10, like: 10, forward: 10, comment: 1, name:"图像名称7", time:"2024年12月2日12:00", hoverRemove: false, hoverImg:false},
                // {view: 10, like: 10, forward: 10, comment: 1, name:"图像名称8", time:"2024年12月2日12:00", hoverRemove: false, hoverImg:false},
                // {view: 10, like: 10, forward: 10, comment: 1, name:"图像名称9", time:"2024年12月2日12:00", hoverRemove: false, hoverImg:false}
            ]
        }
    },
    components: {
        Checkbox, Avatar, Remove, Checkbox3
    },
    computed:{
        ...mapStores(useGlobalStore),
    },
    methods: {
        // remove(img){
        //     this.dataList = this.dataList.filter(item =>item.name !== img.name);
        // },
    },
    watch:{
        type(newVal){
            if(newVal===8){
                this.dataList = this.allImg.filter(item => item.status === "8")
            }else if(newVal===1){
                this.dataList = this.allImg.filter(item => item.status === "1")
            }else if(newVal===2){
                this.dataList = this.allImg.filter(item => item.status === "2")
            }
        }
    },
   async mounted() {
        const data = await fetch.getUserUploadRevision(this.globalStore.userInfo.memberId, 1, 50)
        this.allImg = data.rows;
        // console.log(this.allImg)
        this.dataList = this.allImg.filter(item => item.status === "8");
        // console.log(this.dataList)
    }
}
</script>


<style scoped lang="scss">
.receive-like-container{
    display: flex;
    flex-direction: column;
    padding: 10px;
    flex: 1;

    .type{
        font-size: 15px;
        cursor: pointer;
        // font-weight: bold;
    }
    .type2::after {
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: black;
    }
    .div-container{
        height: 0;
        flex-grow: 1;
        display: flex;
        align-items: center;
        flex-direction: column;

        .wrapper{
            overflow: scroll;
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;

            .img-container{
                width: 200px;
                margin: 5px;
                height: fit-content;
                padding-bottom: 5px;
            }
            .img-container:hover{
                background-color: #F1F1F1;
            }
        }
    }
    .bottom{
        padding-left: 10px;
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: space-between;
    }
}

.icon-group{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;

    .icon{
        display: flex;
        align-items: center;
        color: #A3A3A3;
    }
}


.name-font{
    font-size: 18px; 
    font-weight: bold;
}

.gray-font{
    font-size: 15px;
    color: #515151;
}

.time-font{
    font-size: 15px;
    color: #A1A1A1;
}


</style>