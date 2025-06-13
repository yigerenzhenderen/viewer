import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Upload from "../components/upload.vue"
import User from "../components/user.vue"
import Viewer from "../components/viewer.vue"
import receiveComment from "../components/user/comment.vue"
import editHis from "../components/user/editHis.vue"
import likeHis from "../components/user/likeHis.vue"
import naviHis from "../components/user/naviHis.vue"
import receiveLike from "../components/user/receiveLike.vue"
import uploadHis from "../components/user/uploadHis.vue"
import userInfo from "../components/user/userInfo.vue"
import { useGlobalStore } from '../store/global'
import cookie from '../js/cookie'

const routes = [
    { 
        path: '/', 
        name:"Viewer",
        component: Viewer
    },
    { 
        path: '/upload', 
        name:"Upload",
        component: Upload
    },
    { 
        path: '/user', 
        name:"User",
        component: User,
        children: [
            {
                path: 'info', 
                component: userInfo,
            },
            {
                path: 'comment', 
                component: receiveComment,
            },
            { 
                path: 'like', 
                component: receiveLike
            },
            { 
                path: 'likeListory', 
                component: likeHis
            },
            { 
                path: 'editHistory', 
                component: editHis
            },
            { 
                path: 'naviHistory', 
                component: naviHis
            },
            { 
                path: 'uploadHistory', 
                component: uploadHis
            },
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})

// const whiteList = ["/login", "/loginpassword"];


router.beforeEach(async (to, from, next) => {

    // 若只访问gallery，则直接允许
    const global = useGlobalStore();
    // cookie.removeCookie();
    if(to.path === "/") {
        next();
        global.showLogInWindow = false;
    };
    // 其他页面需要看是否登录
    const userInfoCookie = cookie.getUserInfo();

    if(userInfoCookie){
        await global.loginUpdate(userInfoCookie);
    }
    if(global.logged){
        next();
    }
    else if(to.path.startsWith('/user') || to.path.startsWith('/upload')){
        global.previousUrl = to.path;
        next({path: '/'})
        global.showLogInWindow = true;
    }
    // global.showLogInWindow = true;
    // return false;
    
})

export default router;