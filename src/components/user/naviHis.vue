<template>
    <div class="receive-like-container" v-loading="loading">
        <div style="font-size: 24px; font-weight: bold; margin-top: 28px; margin-bottom: 10px;">历史记录</div>
        <div class="div-container">
            <div class="wrapper">
                <div v-for="data in dataList" class="like-item">
                    <div class="left">
                        {{ data.time }}
                    </div>
                    <div class="right">
                        <!-- <div class="img-container"> -->
                        <div v-for="img in data.imgs" class="img-container" 
                            @mouseenter="img.hoverImg=true"
                            @mouseleave="img.hoverImg=false">
                            <el-image :src="img.url" style="width: 100%; height: 200px; object-fit: cover;">
                                <template #placeholder>
                                    <div>
                                        <img src="/src/assets/cat.jpeg" alt="" style="width: 100%; height: 200px; object-fit: cover;">
                                    </div>
                                </template>
                                <template #error>
                                    <div>
                                        <!-- <img src="/src/assets/cat.jpeg" alt="" style="width: 100%; height: 200px; object-fit: cover;"> -->
                                    </div>
                                </template>
                            </el-image>
                            <!-- <img class="thumb" :src="img.url" alt="" style="width: 100%; height: 200px; object-fit: cover;"> -->
                            <div style="margin-top: 5px; margin-left: 5px;">{{ img.name }}</div>
                            <div v-if="img.hoverImg" class="delete" 
                                @mouseover="img.hoverRemove=true"
                                @mouseout="img.hoverRemove=false"
                                @click="remove(data.time, img)">
                                <span :style="{color: img.hoverRemove ? '#F93232' : null}">删除</span>
                                <div style="display:flex; width: 20px; height: 20px; position: relative; margin-left: 0px;">
                                    <Remove :selected="img.hoverRemove" :activeColor="'#F93232'"></Remove>
                                </div>
                            </div>
                        </div>
                        <!-- </div> -->
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="bottom">
            <el-pagination 
                style="margin-right: 20px;" 
                background layout="prev, pager, next" 
                :page-size="10"
                :total="dataList.length" 
                @change="changPage"/>
        </div> -->
    </div>
</template>


<script>
import Checkbox from "../upload/checkbox.vue";
import Remove from "../utils/remove.vue";
import Checkbox3  from "../utils/checkbox3.vue";
import cat from "/src/assets/temp.jpg";
import fetch from '../../js/fetch.js';
import { mapStores } from 'pinia';
import { useGlobalStore } from '../../store/global.js';
import { groupBy } from "lodash";
import { formatDate } from "../../js/utils.js";

export default{
    data(){
        return {
            cat: cat,
            selectAll: false,
            totalNum: 0,
            loading: false,
            dataList: [
                // {hoverRemove: false, time: "2020年10月15日12:00", imgs: [{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""}]},
                // {hoverRemove: false, time: "2020年10月15日12:00", imgs: [{name:"图片名称", url: ""},{name:"图片名称", url: ""}]},
                // {hoverRemove: false, time: "2020年10月15日12:00", imgs: [{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""}]},
                // {hoverRemove: false, time: "2020年10月15日12:00", imgs: [{name:"图片名称", url: ""}]},
                // {hoverRemove: false, time: "2020年10月15日12:00", imgs: [{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""}]},
                // {hoverRemove: false, time: "2020年10月15日12:00", imgs: [{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""}]},
                // {hoverRemove: false, time: "2020年10月15日12:00", imgs: [{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""}]},
            ]
        }
    },
    components: {
        Checkbox, Remove, Checkbox3
    },
    computed:{
        ...mapStores(useGlobalStore)
    },
    methods: {
        remove(time, img){
            this.dataList = this.dataList.filter(item =>!item.choose);
            this.selectAll = false;
        },
    },
    async mounted() {
        this.loading = true;
        const data = await fetch.getUserBrowseLogs(this.globalStore.userInfo.memberId);
        this.totalNum = data.total;
        // console.log(data)
        const rows = data.rows.map(d=>{return {name: d.entryimgName, url: d.entryimgThumurl, time: d.actionTime.split(" ")[0]}});
        this.dataList = Object.entries(groupBy(rows, item => item.time)).map( (item) => {
            return {
                hoverRemove: false,
                time: formatDate(item[0]),
                imgs: item[1]
            }
        })
        this.$nextTick(()=>{
            this.loading = false;
        })

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
    height: fit-content;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    align-items: flex-start;
    padding: 10px;

    .left{
        display: flex;
        align-items: start;
        width: 100px;
        min-width: fit-content;
        margin-right: 20px;
        margin-top: 2px;
    }
    .right{
        width: 100%;
        flex: 1;
        display: flex;
        flex-wrap: wrap;
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