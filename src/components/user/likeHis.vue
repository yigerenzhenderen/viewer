<template>
    <div class="receive-like-container">
        <div style="font-size: 24px; font-weight: bold; margin-top: 28px; margin-bottom: 10px;">赞过的图片</div>
        <div class="div-container">
            <div class="wrapper">
                <div v-for="img in imgs" class="img-container" 
                    @mouseenter="img.hoverImg=true"
                    @mouseleave="img.hoverImg=false">
                    <el-image :src="img.entryimgThumurl" alt="" style="width: 100%; height: 200px; object-fit: cover; cursor: pointer;" @click="jump(img)" />
                    <div style="margin-top: 5px; margin-left: 5px;">{{ img.entryimgName ? img.entryimgName : "Null" }}</div>
                    <div v-if="img.hoverImg" class="delete" 
                        @mouseover="img.hoverRemove=true"
                        @mouseout="img.hoverRemove=false"
                        @click="remove(img)">
                        <span :style="{color: img.hoverRemove ? '#F93232' : null}">删除</span>
                        <div style="display:flex; width: 20px; height: 20px; position: relative; margin-left: 0px;">
                            <Remove :selected="img.hoverRemove" :activeColor="'#F93232'"></Remove>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="bottom">
            <el-pagination 
                v-model:current-page="currentPage"
                style="margin-right: 20px;" 
                background layout="prev, pager, next" 
                :page-size="pageSize"
                :total="totalSize" 
                @change="changPage"/>
        </div> -->
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
import Checkbox from "../upload/checkbox.vue";
import Avatar from "../utils/avatar.vue";
import Remove from "../utils/remove.vue";
import Checkbox3  from "../utils/checkbox3.vue";
import tempSrc from "/src/assets/temp.jpg";
import fetch from "../../js/fetch";
import { useGlobalStore } from '/src/store/global';
import { mapStores } from 'pinia';

export default{
    data(){
        return {
            tempSrc: tempSrc,
            selectAll: false,
            imgs: [],
            currentPage: 1,
            pageSize: 50,
            totalSize: 0,
        }
    },
    components: {
        Checkbox, Avatar, Remove, Checkbox3
    },
    computed:{
        ...mapStores(useGlobalStore),
    },
    methods: {
        remove(img){
            fetch.userLike(img.imgentryId, this.globalStore.userInfo.memberId, 0).then(
                (res) =>{
                    this.imgs = this.imgs.filter(item => img.imgentryId !== item.imgentryId);
                    this.globalStore.showReminder("删除成功！")
                }
            )
        },
        jump(img){
            this.$router.push({path: '/', query: { id: img.imgentryId } })
        },
        async changPage(){
            const likeHistory = await fetch.getUserLikeLogs(this.globalStore.userInfo.memberId, this.currentPage, this.pageSize);
            this.imgs = likeHistory.rows;
        }
    },
    async mounted() {
        const likeHistory = await fetch.getUserLikeLogs(this.globalStore.userInfo.memberId, this.currentPage, this.pageSize)
        this.totalSize = likeHistory.total;
        this.imgs = likeHistory.rows;
        console.log(likeHistory)

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
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
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

.img-container{
    width: 200px;
    margin: 5px;
    height: 260px;
    
}
.img-container:hover{
    background-color: #F1F1F1;
}
.delete{
    display: flex; 
    align-items: center; 
    justify-content:end; 
    margin-right: 5px;
    cursor: pointer;
    color: #545454;
    font-size: 12px;
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