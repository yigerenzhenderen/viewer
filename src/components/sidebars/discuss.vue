<template>

    <div class="discussion-container">
        <div v-if="discussList.length" style="font-size: 16px; color: #8F8F8F;">评论 {{ this.discussList.length }}</div>
        <div v-else style="font-size: 16px; color: #8F8F8F; ">暂无评论</div>
        <div class="discuss-content">
            <div v-for="root in discussList" class="root-discuss">
                <div class="root" :id="`c${root.commentId}`">
                    <Avatar :size="40" style="margin-top: 5px;"/>
                    <div class="root-reply">
                        <div style="display: flex; align-items: center;">
                            <span class="name-font">{{ root.wechatNickname }}</span>&emsp;
                            <span class="time-font">{{ root.place }} {{ root.actionTime }}</span>
                            <!-- <span class="gray-font">回复了&thinsp;你的评论&thinsp;</span> -->
                        </div>
                        <div style="display: flex; margin-top: 5px;">
                            <span class="comment-font">{{ root.commentText }}</span>&emsp;
                            <span class="reply-font" @click="replyComment(root)">回复</span>
                        </div>
                    </div>
                </div>
                <div v-for="child in root.replies" class="reply" :id="`c${child.commentId}`">
                    <Avatar :size="40" style="margin-left: 10px;"/>
                    <div class="reply-content">
                        <div style="display: flex; align-items: center;">
                            <span class="name-font">{{ child.wechatNickname }}</span>&thinsp;
                            <span class="gray-font">回复了</span>&thinsp;
                            <span class="name-font">{{ child.parentWechatNickName }}</span>
                            &emsp;
                            <span class="time-font">{{ child.place }} {{ child.actionTime }}</span>
                        </div>
                        <div style="display: flex; margin-top: 5px;">
                            <span class="comment-font">{{ child.commentText }}</span>&emsp;
                            <span class="reply-font" @click="replyComment(child)">回复</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  

</template>


<script>
import { useDiscussStore } from '../../store/discuss';
import { useDetailStore } from '../../store/detail';
import { mapState, mapStores } from 'pinia';
import Avatar from '../utils/avatar.vue';

export default{
    computed:{
        ...mapStores(useDiscussStore),
        ...mapState(useDetailStore, ['discussList'])
        
    },
    components:{
        Avatar,
    },
    methods:{
        focusComment(commentId){
            d3.select(".discuss-content").select(`#c${commentId}`).classed("focused", true).style("background-color", "#E2E2E2");
        },
        replyComment(receiver){
            this.focusComment(receiver.commentId);
            this.discussStore.inputIng = true;
            // console.log(receiver.commentId)
            this.discussStore.replyCommentId = receiver.commentId;
            setTimeout(()=>{
                d3.select(".discuss-content").select(".focused").classed("focused", null).transition(1000).style("background-color", "transparent");
            }, 2000)
        }
    }
}
</script>


<style scoped lang="scss">

// .focused{
//     background-color: #515151 !important;
//     transition: 0.5s linear;
// }

.discussion-container{
    /* width: 100%; */
    flex: 1;
    border-top: 1px solid #A9A7A7;
    padding: 10px;
    height: fit-content;
    --root-interval: 10px;
    --top-bottom-padding: 15px;
    --reply-padding: 5px;
    .discuss-content{
        // padding: 10px;

        .root-discuss{
            display: flex;
            flex-direction: column;
            width: 100%;
            height: fit-content;
            padding-top:10px;
            padding-bottom:10px;
            align-items: end;

            .root{
                display: flex;
                width: 100%;
                height: fit-content;
                padding-top: var(--top-bottom-padding) / 2;
                padding-bottom: calc(var(--top-bottom-padding) / 2);

                .root-reply{
                    display: flex; 
                    flex-direction: column; 
                    margin-left: 20px; 
                    width: 100%;
                }
            }

            .reply{
                display: flex;
                width: calc(100% - 60px);
                height: fit-content;
                padding-top: calc(var(--top-bottom-padding) / 2);
                padding-bottom: calc(var(--top-bottom-padding) / 2);

                .reply-content{
                    display: flex; 
                    flex-direction: column; 
                    margin-left: 20px; 
                    width: 100%;
                }
            }
        }
    }
}

.name-font{
    font-size: 14px; 
    font-weight: bold;
    color: #6D6D6D;
}

.gray-font{
    font-size: 10px;
    color: #515151;
}

.time-font{
    font-size: 10px;
    color: #6D6D6D;
}

.comment-font{
    font-size: 14px;
    color: #000;
}

.reply-font{
    font-size: 10px;
    color: #6D6D6D;
    margin-top: auto;
    min-width: fit-content;
    cursor: pointer;
}
</style>