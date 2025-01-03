import { defineStore } from 'pinia'
import fetch from '../js/fetch';

export const useDetailStore = defineStore('detail', {
    state: () => {
        return { 
            editing: false,
            imageId: 0,
            currentImg: {
                "createBy": null,
                "createTime": null,
                "updateBy": null,
                "updateTime": null,
                "remark": null,
                "imgentryId": 0,
                "entryimgName": "test",
                "originalFileName": null,
                "archiveimgId": null,
                "entryimgTime": null,
                "tagstimeTitle": null,
                "tagstimeCategory": null,
                "entryimgPosition": null,
                "locationName": null,
                "archiveTitle": null,
                "locationOldNameList": null,
                "locationIntro": null,
                "locationIdx": null,
                "entryimgIntro": null,
                "entryimgHolder": "未知",
                "entryimgType": null,
                "entryimgThumurl": null,
                "entryimgCommonurl": null,
                "entryimgPrimalurl": null,
                "entryimgIdx": null,
                "archiveFlag": null,
                "archiveId": null,
                "status": null,
                "delFlag": null,
                "browseCount": 0,
                "likeCount": 1,
                "forwardCount": 0,
                "commentCount": null,
                "tagsTitle": null,
                "tagsCategory": null,
                "tagsBrief": null,
                "imgentryIdList": null,
                "tagsTitleList": [],
                memberCommentLogsList: [],
                "entryimgName": null,
                "entryimgIntro": null,
                "entryimgHolder": null,
                "entryimgType": null,
                "entryimgThumurl": null,
                "parentWechatNickName": null,
                "parentMemberImgUrl": null,
                imageEntryFileInfos: [],

            },
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
    getters: {
        discussList(state){
            return state.currentImg.memberCommentLogsList;
        },
        storeForm(state){
            const keywordsIdList = state.currentImg.tagsIds ? state.currentImg.tagsIds.split(","): [];
            return {
                id: state.currentImg.imgentryId,
                name: state.currentImg.entryimgName,
                desc: state.currentImg.entryimgIntro,
                shotTime: state.currentImg.entryimgTime,
                shoter: state.currentImg.entryimgHolder,
                place: state.currentImg.locationName,
                kws: state.currentImg.tagsTitleList.map( (label, i) => {
                    return {
                        id: keywordsIdList[i],
                        label: label,
                        value: label,
                        choose: true,
                        show: true,
                    }
                })
            };
        }
    },
    actions: {
        finishEdit() {
            this.editing = false;
            // 复原form到原始的storeForm
            this.form = _.cloneDeep(this.storeForm);
        }
    }
})