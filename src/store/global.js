import { defineStore } from 'pinia'
import { getImgUrl } from "../js/utils";
import fetch from '../js/fetch.js'

export const useGlobalStore = defineStore('global', {
    state: () => {
        return { 
            logged: false,
            urlSearchParams: {},
            userInfo: {
                wechatNickname: 'kegemo',
                // memberImgurl: 'https://ww3.sinaimg.cn/mw690/d315af46ly1hnn5btbjr5j20j60j7mzv.jpg',
                memberName: "xxx",
                // realName: 'aaa',
                memberPhone: '12344',
                danwei: 'bbbb',
                memberEmail: 'aadsafa',
                memberId: '1',
                wx: '1234',
                avatar: "https://ww3.sinaimg.cn/mw690/d315af46ly1hnn5btbjr5j20j60j7mzv.jpg",
            },
            tagList: [],
            tagScrollToLeft: true,
            tagScrollToRight: false,
            reminder: {
                show: false,
                content: "test"
            }
        }
    },
    actions: {
        // async logIn(){
        //     this.logged = true;
        //     this.likeList = await fetch.getUserLikeLogs(this.userInfo.memberId);
        //     this.naviList = await fetch.getUserBrowseLogs(this.userInfo.memberId);
        //     console.log(this.likeList, this.naviList)
        // },
        showReminder(content){
            this.reminder.show = true;
            this.reminder.content = content;
        },
        async updateInfo(){
            const res = await fetch.editUserInfo(this.userInfo);
            return res;
        },
        async getLikeHistory(){
            const res = await fetch.getUserLikeLogs(this.userInfo.memberId);
            return res;
        },
        async getNaviHistory(){
            const res = await fetch.getUserBrowseLogs(this.userInfo.memberId);
            return res.data;
        },
        async getCommentHistory(){
            const res = await fetch.getUserBrowseLogs(this.userInfo.memberId);
            return res.data;
        },
        async like(imgId, likeBool){
            const res = await fetch.userLike(imgId, this.userInfo.memberId, likeBool);
            return res;
        },
        async view(imgId){
            const res = await fetch.userView(imgId, this.userInfo.memberId);
            return res;
        },
        async forward(imgId){
            const res = await fetch.userForward(imgId, this.userInfo.memberId);
            return res;
        }
    },
})

