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

export default router;