<template>
    <div class="u-div">
        <div class="u-header">
            <!-- <div class="title-container"><span class="title">湖南影像档案馆</span></div> -->
            <div class="title">
                <span>湖南影像档案馆</span>
                <router-link to="/" class="link" style="position: absolute;"></router-link>
            </div>
            <Avatar :size="53" style="margin-right: 10px;" :url="globalStore.userInfo.memberImgurl"/>
        </div>
        <div class="u-container" style="">
            <div class="u-controll" style="border-right: 10px; margin-top: 50px;">

                <div class="item" style="margin-top: 20px;">
                    <span class="h-item">个人资料</span>
                    <div class="interval"></div>
                    <span class="enter" id="info">
                        修改个人资料
                        <router-link to="/user/info" class="link"></router-link>
                    </span>
                </div>

                <div class="item" style="margin-top: 20px;">
                    <span class="h-item">互动记录</span>
                    <div class="interval"></div>
                    <span class="enter" id="like">
                        收到的赞
                        <router-link to="/user/like" class="link"></router-link>
                    </span>
                    <span class="enter" id="comment">
                        评论和回复
                        <router-link to="/user/comment" class="link"></router-link>
                    </span>
                </div>

                <div class="item" style="margin-top: 20px;">
                    <span class="h-item">浏览记录</span>
                    <div class="interval"></div>
                    <span class="enter" id="naviHistory">
                        历史记录
                        <router-link to="/user/naviHistory" class="link"></router-link>
                    </span>
                    <span class="enter" id="likeListory">
                        赞过的图片
                        <router-link to="/user/likeListory" class="link"></router-link>
                    </span>
                </div>

                <div class="item" style="margin-top: 20px;">
                    <span class="h-item">我的上传</span>
                    <div class="interval"></div>
                    <span class="enter" id="upload">
                        上传图片
                        <router-link to="/upload" class="link"></router-link>
                    </span>
                    <span class="enter" id="uploadHistory">
                        上传记录
                        <router-link to="/user/uploadHistory" class="link"></router-link>
                    </span>
                    <span class="enter" id="editHistory">
                        修订记录
                        <router-link to="/user/editHistory" class="link"></router-link>
                    </span>
                   
                </div>
            </div>
            <div class="u-content" style="border: 0px;">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
  
  
<script>
import Avatar from "./utils/avatar.vue";
import { useGlobalStore } from '../store/global.js';
import { mapState, mapStores } from 'pinia';

export default{
    data(){
        return {
        }
    },
    computed:{
        ...mapStores(useGlobalStore)
    },
    components:{
        Avatar
    },
    mounted(){
        d3.select("body").style("background-color", "white")
        const currentPage = this.$route.fullPath.split('/').at(-1);
        d3.select(".u-controll").select(`#${currentPage}`).classed("selected", true);
        d3.selectAll(".enter").on("click", function(e){
            d3.selectAll(".enter").classed("selected", null);
            d3.select(this).classed("selected", true);
        })
    }
}
</script>

<style scoped>

.item{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    margin-left: 70px;

    .h-item{
        cursor: default;
        font-size: 18px;
        font-weight: bold;
        padding-left: 10px;
    }

    .h-content{
        font-size: 15px;
        font-weight: bold;
    }

    .enter{
        cursor: pointer;
        height: 40px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        position: relative;
    }

    .enter:hover{
        background-color: #F6F6F6;
    }

    .selected{
        background-color: #F6F6F6;
    }

    .interval{
        height: 20px;
    }
}

.link{
    position: absolute; 
    opacity: 0;
    width: 100%;
    height: 100%;
}

</style>
  