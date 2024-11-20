<template>
    <div class="receive-like-container">
        <div style="font-size: 24px; font-weight: bold; margin-top: 28px; margin-bottom: 10px;">收到的赞</div>
        <div class="div-container">
            <div class="wrapper">
                <div v-for="like in receiveLikeList" class="like-item">
                    <div class="left">
                        <Checkbox v-model:choose="like.choose" style="margin-right: 20px;"/>
                        <Avatar :size="80" />
                        <div style="display: flex; flex-direction: column; margin-left: 20px;">
                            <div style="display: flex; align-items: center;">
                                <span class="name-font">{{ like.name }}</span>&emsp;
                                <span class="gray-font">点赞了&thinsp;你上传的图片&thinsp;</span>
                                <span class="gray-font" style="text-decoration: underline;;">{{ like.imgName }}</span>
                            </div>
                            <div style="margin-top: 10px;">
                                <span class="time-font">{{ like.time }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="right"></div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div style="width: 200px; display: flex; align-items: center">
                <Checkbox3 :total="receiveLikeList.length" :selected="numChoose" @selectAllChange="selectAllChange"></Checkbox3>
                <div style="margin: 8px;"><span>{{!numChoose ? "全选" : `${numChoose} / ${receiveLikeList.length}`}}</span></div>
                <div style="width: 24px; height: 24px; margin-right: 40px; margin-left: auto; margin-top: 7px; position: relative; cursor: pointer; margin-bottom: 8px;"
                    @click="remove">
                    <Remove :selected="!!numChoose" active-color="#000"></Remove>
                </div>
            </div>
            <el-pagination 
                style="margin-right: 20px;" 
                background layout="prev, pager, next" 
                :page-size="10"
                :total="receiveLikeList.length" 
                @change="changPage"/>
        </div>
    </div>
</template>


<script>
// import { useInfoStore } from '../../store/info.js';
// import { mapState, mapStores } from 'pinia';
import Checkbox from "../upload/checkbox.vue";
import Avatar from "../utils/avatar.vue";
import Remove from "../utils/remove.vue";
import Checkbox3  from "../utils/checkbox3.vue";

export default{
    data(){
        return {
            selectAll: false,
            receiveLikeList: [
                {choose:false, id: 0, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                {choose:false, id: 1, name: "李晓红", imgName: "杂货铺.jpg",time: "2020年10月15日12:00"},
                {choose:false, id: 2, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                {choose:false, id: 3, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                {choose:false, id: 4, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                {choose:false, id: 5, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                {choose:false, id: 6, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                {choose:false, id: 7, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                {choose:false, id: 7, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                {choose:false, id: 7, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                {choose:false, id: 7, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
                {choose:false, id: 7, name: "李晓红", imgName: "杂货铺.jpg", time: "2020年10月15日12:00"},
            ]
        }
    },
    components: {
        Checkbox, Avatar, Remove, Checkbox3
    },
    computed:{
        // ...mapStores(useInfoStore),
        numChoose(){
            return this.receiveLikeList.filter(item => item.choose).length;
        }
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
        changPage(currentPage, pageSize){
            console.log(currentPage, pageSize)
        }
    },
    mounted() {
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