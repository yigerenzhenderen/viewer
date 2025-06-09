<template>
    <div class="receive-like-container">
        <div style="font-size: 24px; font-weight: bold; margin-top: 28px; margin-bottom: 10px;">收到的赞</div>
        <div class="div-container">
            <div class="wrapper">
                <div v-for="like in receiveLikeList" class="like-item">
                    <div class="left">
                        <!-- <Checkbox v-model:choose="like.choose" style="margin-right: 20px;"/> -->
                        <Avatar :size="80" />
                        <div style="display: flex; flex-direction: column; margin-left: 20px;">
                            <div style="display: flex; align-items: center;">
                                <span class="name-font">{{ like.memberName }}</span>&emsp;
                                <span class="gray-font">点赞了&thinsp;你上传的图片&thinsp;</span>
                                <span class="gray-font" style="text-decoration: underline;;">{{ like.originalFileName }}</span>
                            </div>
                            <div style="margin-top: 10px;">
                                <span class="time-font">{{ like.actionTime }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <img :src="like.submitimgUrl" alt="" style="width: 100%; height: 100%; object-fit: fill; cursor: pointer;" @click="jump(like)">
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div style="width: 200px; display: flex; align-items: center">
                <!-- <Checkbox3 :total="receiveLikeList.length" :selected="numChoose" @selectAllChange="selectAllChange"></Checkbox3> -->
                <!-- <div style="margin: 8px;"><span>{{!numChoose ? "全选" : `${numChoose} / ${receiveLikeList.length}`}}</span></div> -->
                <!-- <div style="width: 24px; height: 24px; margin-right: 40px; margin-left: auto; margin-top: 7px; position: relative; cursor: pointer; margin-bottom: 8px;"
                    @click="remove">
                    <Remove :selected="!!numChoose" active-color="#000"></Remove>
                </div> -->
            </div>
            <el-pagination 
                v-model:current-page="currentPage"
                style="margin-right: 20px;" 
                background layout="prev, pager, next" 
                :page-size="pageSize"
                :total="totalSize" 
                @change="changPage"/>
        </div>
    </div>
</template>


<script>
import { mapState, mapStores } from 'pinia';
import fetch from "../../js/fetch";
import Checkbox from "../upload/checkbox.vue";
import Avatar from "../utils/avatar.vue";
import Remove from "../utils/remove.vue";
import Checkbox3  from "../utils/checkbox3.vue";
import { useGlobalStore } from '../../store/global.js';

export default{
    data(){
        return {
            selectAll: false,
            currentPage: 1,
            pageSize: 8,
            totalSize: 0,
            receiveLikeList: [                
                // {choose:false, id: 0, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                // {choose:false, id: 1, name: "李晓红", imgName: "杂货铺.jpg",time: "2020年10月15日12:00"},
                // {choose:false, id: 2, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                // {choose:false, id: 3, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
            ]
        }
    },
    components: {
        Checkbox, Avatar, Remove, Checkbox3
    },
    computed:{
        ...mapStores(useGlobalStore),
        numChoose(){
            return this.receiveLikeList.filter(item => item.choose).length;
        },
    },
    methods: {
        selectAllChange(){
            this.selectAll = !this.selectAll;
            this.receiveLikeList.forEach(i => {
                i.choose = this.selectAll;
            });
        },
        remove(){
            this.receiveLikeList = this.receiveLikeList.filter(item =>!item.choose);
            this.selectAll = false;
        },
        async changPage(currentPage, pageSize){
            const data = await fetch.getOthersLiksLogs( this.globalStore.userInfo.memberId, this.currentPage, this.pageSize);
            this.receiveLikeList = data.rows;
        },
        jump(img){
            this.$router.push({path: '/', query: { id: img.imgentryId } })
        }
    },
    async mounted() {
        const data = await fetch.getOthersLiksLogs(this.globalStore.userInfo.memberId, this.currentPage, this.pageSize);
        this.totalSize = data.total;
        this.receiveLikeList = data.rows;
    }
}
</script>


<style scoped lang="scss">
.receive-like-container{
    display: flex;
    flex-direction: column;
    padding: 10px;
    flex: 1;

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

.like-item{
    height: 120px;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    align-items: center;
    cursor: normal;
    border-bottom: 1px solid #DFDCDC;
    .left{
        display: flex;
        align-items: center;
    }
    .right{
        width: 80px;
        height: 80px;
        background-color: black;
        
    }
}

.like-item:hover{
    background-color: #F2F2F2;
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



:deep(.el-pagination.is-background .el-pager li){
    background-color: white;
}

:deep(.el-pagination.is-background .el-pager li.is-active){
    background-color: #EAEAEA;
    color: #000;
    font-weight: normal;
}

:deep(.el-pagination.is-background .el-pager li:hover){
    background-color: #EAEAEA;
    color: #000;
    font-weight: normal;
}

:deep(.number){
    color: #000;
}

:deep(.el-pagination.is-background .btn-prev){
    color: #000;
    background-color: white;
}

:deep(.el-pagination.is-background .btn-prev:disabled){
    color: #000;
    background-color: white;
}

:deep(.el-pagination.is-background .btn-next){
    color: #000;
    background-color: white;
}

:deep(.el-pagination.is-background .btn-next:disabled){
    color: #000;
    background-color: white;
}

</style>