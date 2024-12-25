import { defineStore } from 'pinia'
import fetch from '../js/fetch';

export const useDetailStore = defineStore('detail', {
    state: () => {
        return { 
            editing: false,
            form:{
                id: "",
                name: '',
                desc: '',
                shotTime: '',
                shoter: '',
                place: '',
                kws: [],
            },
            item: null,
            structure: null,
            page: 0,
            id: null,
            hide: true,
            sneak: false,
            x: 100,
            y: 100
        }
    },
    actions: {
        // async refreshImg(imgId){
        //     // const result = await fetch.getImg(imgId);
        //     // this.img = (!!result) ? result : {
        //     //     browseCount: 0,
        //     //     forwardCount: 0,
        //     //     likeCount: 0,
        //     //     imageEntryFileInfos: []
        //     // }
        //     // this.globalStore.view(267);
        //     // console.log('aaaa',this.img);
        //     // this.detailStore.comment = result.memberCommentLogsList;
        // },
    }
})