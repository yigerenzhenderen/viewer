import { defineStore } from 'pinia'
import { getImgUrl } from "../js/utils";

export const useGlobalStore = defineStore('global', {
    state: () => {
        return { 
            userInfo: {
                realName: 'aaa',
                phone: '12344',
                danwei: 'bbbb',
                email: 'aadsafa',
                userName: 'asdf',
                wx: '1234',
                avatar: getImgUrl("https://ww3.sinaimg.cn/mw690/d315af46ly1hnn5btbjr5j20j60j7mzv.jpg"),
            },

        }
    },
    actions: {
    }
})