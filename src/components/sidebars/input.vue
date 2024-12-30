<template>
    <div v-if="globalStore.logged" class="comment-container">
        <!-- <div v-if="discussStore.discussList.length" style="font-size: 16px; color: #8F8F8F;">评论 {{ this.discussStore.numDiscuss }}</div>
        <div v-else style="font-size: 16px; color: #8F8F8F;">暂无评论</div> -->
        <Avatar :size="avatarSize" style="margin-bottom: auto"/>
        <div class="input-comment">
            <textarea 
                v-model="comment"
                type="text" 
                class="input" 
                :rows="rows"
                placeholder="写评论"
                @click="startInput" 
                @blur="endInput"
            />
            <el-button @mousedown="submitComment" v-if="discussStore.inputIng" type="primary" class="submit" >发送</el-button>
        </div>
    </div>  
    <div v-else class="comment-container" style="justify-content: center;">
        <div style="width: 100%; height: 1px; background-color: #A9A7A7; margin-right: 5%"></div>
        <span class="logIn" @click="logIn">登录</span>
        <span style="color: #8F8F8F; cursor: default; white-space: nowrap;">写评论</span>
        <div style="width: 100%; height: 1px; background-color: #A9A7A7; margin-left: 5%"></div>
    </div>
</template>


<script>
import { useDiscussStore } from '../../store/discuss';
import { useGlobalStore } from '../../store/global';
import { useDetailStore } from '../../store/detail';
import { mapStores, mapState } from 'pinia';
import fetch from '../../js/fetch';
import Avatar from '../utils/avatar.vue';

export default{
    computed:{
        ...mapStores(useDiscussStore, useGlobalStore, useDetailStore),
        ...mapState(useDiscussStore, ['inputIng']),
        ...mapState(useDetailStore, ['imageId']),
        inputMarginTop(){
            return this.avatarSize / 2 + 5;
        }
    },
    components:{
        Avatar,
    },
    data(){
        return {
            // inputIng : false,
            rows: 1,
            avatarSize : 40,
            comment : '',
        }
    },
    methods:{
        startInput(){
            this.discussStore.inputIng = true;
        },
        endInput(){
            this.discussStore.inputIng = false;
        },
        logIn(){
            this.globalStore.logged = true;
        },
        async refreshComment(){
            const newImg = await fetch.getImg(this.imageId);
            this.detailStore.currentImg.memberCommentLogsList = newImg.memberCommentLogsList;
        },
        async submitComment(e){
            e.preventDefault();
            await fetch.userComment(this.imageId, this.globalStore.userInfo.memberId, this.comment, this.discussStore.replyCommentId);
            this.comment = '';
            this.endInput();
            await this.refreshComment();
            // const newImg = await fetch.getImg(this.imageId);
            // this.detailStore.memberCommentLogsList = newImg.memberCommentLogsList;
        }
    },
    watch: {
        inputIng(v){
            if(v){
                this.rows = 6;
                this.$nextTick(() => {
                    const outer_div = d3.select(".outer").node();
                    outer_div.scrollTop = outer_div.scrollHeight;
                })
            }else{
                this.rows = 1;
                this.discussStore.replyCommentId = 0;
            }
        },
        // discussStore:{
        //     deep: true,
        //     handler(newVal, oldVal){
        //         console.log(newVal.replyCommentId)
        //         // const result = await fetch.getImg(267);
        //         // this.discussStore.discussList = result.memberCommentLogsList;
        //     }
        // }
    }
}
</script>

<style scoped lang="scss">
.comment-container{
    height: fit-content;
    max-height: 100px;
    padding: 10px 0px;
    display: flex;
    align-items: center;

    .input-comment{
        width: 100%;
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
    color: #6F6F6F;
    white-space: nowrap;
}

.logIn::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #6F6F6F;
}

</style>