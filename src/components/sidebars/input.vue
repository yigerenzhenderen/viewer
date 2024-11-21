<template>
    <div v-if="globalStore.logged" class="comment-container">
        <!-- <div v-if="discussStore.discussList.length" style="font-size: 16px; color: #8F8F8F;">评论 {{ this.discussStore.numDiscuss }}</div>
        <div v-else style="font-size: 16px; color: #8F8F8F;">暂无评论</div> -->
        <Avatar :size="avatarSize" style="margin-bottom: auto"/>
        <div class="input-comment">
            <textarea 
                type="text" 
                class="input" 
                :rows="rows"
                placeholder="写评论"
                @click="startInput" 
                @blur="endInput"/>
            <el-button @mousedown="(e)=>e.preventDefault()" v-if="inputIng" type="primary" class="submit">发送</el-button>
        </div>
    </div>  
    <div v-else class="comment-container" style="justify-content: center;">
        <div style="width: 30%; height: 1px; background-color: #A9A7A7; margin-right: 5%"></div>
        <span class="logIn" @click="logIn">登录</span>
        <span style="color: #8F8F8F; cursor: default;">写评论</span>
        <div style="width: 30%; height: 1px; background-color: #A9A7A7; margin-left: 5%"></div>
    </div>
</template>


<script>
import { useDiscussStore } from '../../store/discuss';
import { useGlobalStore } from '../../store/global';
import { mapState, mapStores } from 'pinia';
import Avatar from '../utils/avatar.vue';

export default{
    computed:{
        ...mapStores(useDiscussStore, useGlobalStore),
        inputMarginTop(){
            
            return this.avatarSize / 2 + 5;
        }
    },
    components:{
        Avatar,
    },
    data(){
        return {
            inputIng : false,
            rows: 1,
            avatarSize : 40,
        }
    },
    methods:{
        startInput(){
            this.inputIng = true;
            this.rows = 6;
            this.$nextTick(() => {
                const outer_div = d3.select(".outer").node();
                outer_div.scrollTop = outer_div.scrollHeight;
            })

        },
        endInput(e){
            this.inputIng = false;
            this.rows = 1;
        },
        logIn(){
            this.globalStore.logged = true;
        }
        // submitComment(){

        // fetchDiscuss(){
        //     this.$store.dispatch('fetchDiscuss');
        // }
    },
    mounted(){
        console.log(this.discussStore.discussList)
    }
}
</script>

<style scoped lang="scss">
.comment-container{
    height: fit-content;
    max-height: 100px;
    padding: 10px;
    display: flex;
    align-items: center;

    .input-comment{
        width: 80%;
        height: fit-content;
        margin-left: 20px;
        position: relative;
        
        .input{
            height: 100%;
            width: 100%;
            resize:none;
            font-size: 14px;
            background-color: #E2E2E2;
            border: 1px solid #CBCBCB;
        }
        .submit{
            border-radius: 3px;
            position: absolute;
            bottom: 10px;
            right: 3px;
            width: 50px;
            height: 20px;
            font-size: 12px;
        }
    }
}

.logIn{
    cursor: pointer;
    text-decoration: underline;
    color: #6F6F6F;
}
</style>