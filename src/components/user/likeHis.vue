<template>
    <div class="receive-like-container">
        <div style="font-size: 24px; font-weight: bold; margin-top: 28px; margin-bottom: 10px;">赞过的图片</div>
        <div class="div-container">
            <div class="wrapper">
                <div v-for="img in imgs" class="img-container" 
                    @mouseenter="img.hoverImg=true"
                    @mouseleave="img.hoverImg=false">
                    <el-image :src="img.entryimgThumurl" alt="" style="width: 100%; height: 200px; object-fit: cover; cursor: pointer;" @click="jump(img)" />
                    <div style="margin-top: 5px; margin-left: 5px;">{{ img.entryimgName }}</div>
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
import Avatar from "../utils/avatar.vue";
import Remove from "../utils/remove.vue";
import Checkbox3  from "../utils/checkbox3.vue";
import tempSrc from "/src/assets/temp.jpg"
import { useGlobalStore } from '/src/store/global';
import { mapStores } from 'pinia';

export default{
    data(){
        return {
            tempSrc: tempSrc,
            selectAll: false,
            imgs: [{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""},{name:"图片名称", url: ""}]
        }
    },
    components: {
        Checkbox, Avatar, Remove, Checkbox3
    },
    computed:{
        ...mapStores(useGlobalStore),
    },
    methods: {
        remove(time, img){
            this.dataList = this.dataList.filter(item =>!item.choose);
            this.selectAll = false;
        },
        jump(img){
            this.$router.push({path: '/', query: { id: img.imgentryId } })
        }
    },
    async mounted() {
        const likeHistory = await this.globalStore.getLikeHistory();
        console.log(likeHistory)
        this.imgs = likeHistory.rows;

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


</style>