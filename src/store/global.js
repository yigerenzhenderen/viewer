import { defineStore } from 'pinia'
import { getImgUrl } from "../js/utils";
import fetch from '../js/fetch.js'
import cookie from '../js/cookie.js';

export const useGlobalStore = defineStore('global', {
    state: () => {
        return { 
            logged: false,
            showLogInWindow : false, // 控制登录页面的显示和隐藏
            previousUrl: '', // 未登录时试图访问的链接，登录后自动跳转该链接
            urlSearchParams: {},
            userInfo: {
                wechatNickname: '',
                memberName: "",
                memberPhone: '',
                danwei: '',
                memberEmail: '',
                memberId: '',
                wx: '',
                avatar: "",
            },
            tagList: [],
            tagScrollToLeft: true,
            tagScrollToRight: false,
            reminder: {
                show: false,
                content: "test"
            },
            likedImageIdList: new Set(),
        }
    },
    actions: {
        async loginUpdate(userInfo){

            this.userInfo.wechatNickname = userInfo.wechatNickname;
            this.userInfo.memberId = userInfo.memberId;
            this.userInfo.avatar = userInfo.memberImgurl ? userInfo.memberImgurl : userInfo.avatar;
            this.userInfo.memberName = userInfo.memberName;
            this.userInfo.memberPhone = userInfo.memberPhone;
            this.userInfo.memberEmail = userInfo.memberEmail;
            const likeList = await fetch.getUserLikeLogs(this.userInfo.memberId);
            this.likedImageIdList = new Set(likeList.rows.map(img => img.imgentryId));
            this.logged = true;
            let cookieInfo = cookie.getUserInfo();
            if(!cookieInfo){
                cookie.storeUserCookie(this.userInfo);
            };
            // console.log(this.userInfo)
            this.showLogInWindow = false;
            
            // this.naviList = await fetch.getUserBrowseLogs(this.userInfo.memberId);
            // console.log(this.likeList, this.naviList)
        },
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

