import axios from 'axios';

let baseurl = "https://vaip.arts-press.com/rasterInterface"

const api = axios.create({
    baseURL: baseurl
});

export default {
    async addUserInfo(info) {
        const str_info = JSON.stringify(info);
        const response = await api.post("/interface/member/addMember", str_info);
        return response.data;
    },
    async editUserInfo(info) {
        const str_info = JSON.stringify({
            "pageSize": pageSize,
            "pageIndex": pageIndex,
            "selector": selector,
            "time": time
        })
        const response = await api.post("/interface/member/editMember", str_info);
        return response.data;
    },
    async getUserInfo(userId) {
        const response = await api.get("/interface/member/getMemberInfo", {
            params: {
                memberId: userId,
            }
          });
        return response.data;
    },
    async getUserBrowseLogs(userId) {
        const response = await api.get("/interface/memberBrowseLogs/selectMemberBrowseLogsByMemberId", {
            params: {
                memberId: userId,
            }
          });
        return response.data;
    },
    async getUserForwardLogs(userId) {
        const response = await api.get("/interface/memberForwardLogs/selectMemberForwardLogsByMemberId", {
            params: {
                memberId: userId,
            }
          });
        return response.data;
    },
    async getUserLikeLogs(userId) {
        const response = await api.get("/interface/memberBrowseLogs/selectMemberBrowseLogsByMemberId", {
            params: {
                memberId: userId,
            }
          });
        return response.data;
    },
    async getUserCommentLogs(userId) {
        const response = await api.get("/interface/memberCommentLogs/selectMemberCommentLogsByMemberId", {
            params: {
                memberId: userId,
            }
          });
        return response.data;
    },
    async getUserUploadLogs(userId) {
        const response = await api.get("/interface/imageEntrySubmit/selectImageEntrySubmitByMemberId", {
            params: {
                memberId: userId,
            }
          });
        return response.data;
    },
    async getUserUploadRevision(userId) {
        const response = await api.get("/interface/imageEntryRevision/selectImageEntryRevisionByMemberId", {
            params: {
                memberId: userId,
            }
          });
        return response.data;
    },
    // async getUserUploadRevision(userId) {
    //     const response = await api.get("/interface/imageEntryRevision/selectImageEntryRevisionByMemberId", {
    //         params: {
    //             memberId: userId,
    //         }
    //       });
    //     return response.data;
    // },
    async getTagList() {
        const response = await api.get("/interface/tagsList/selectTagsListEasy");
        return response.data;
    },
    async getLocationLabel() {
        const response = await api.get("/interface/locationtagsList/selectLocationTagsListEasy");
        return response.data;
    },
    async getTimeLabel() {
        const response = await api.get("/interface/tagstimeList/selectTagstimeListEasy");
        return response.data;
    },
    async searchImage(tagsId, tagslocationId, tagstimeId) {
        const str_info = JSON.stringify({
            "tagsId": pageSize,
            "tagslocationId": tagslocationId,
            "tagstimeId": tagstimeId
        })
        const response = await api.post("/interface/member/editMember", str_info);
        return response.data;
    },
    async getImageById(imageId) {
        const response = await api.get("/interface/imageEntry/selectImageEntryDetails", {
            params: {
                imgentryId: imageId,
            }
          });
        return response.data;
    },

    async userLike(imageId, memberId="", actionFlag) {
        const str_info = JSON.stringify({
            "imgentryId": imageId,
            "memberId": userId, // 空即为游客
            "actionFlag": action // 1: like  0: remove like
        })
        const response = await api.post("/interface/memberLikeLogs/addMemberLikeLog", str_info);
        return response.data;
    },
    async userForward(imageId, userId="") {
        const str_info = JSON.stringify({
            "imgentryId": imageId,
            "memberId": userId, // 空即为游客
        })
        const response = await api.post("/interface/memberForwardLogs/addMemberForwardLogs", str_info);
        return response.data;
    },
    async userBrower(imageId, userId="") {
        const str_info = JSON.stringify({
            "imgentryId": imageId,
            "memberId": userId, // 空即为游客
        })
        const response = await api.post("/interface/memberBrowseLogs/addMemberBrowseLogs", str_info);
        return response.data;
    },
    async userComment(imageId, userId="", text, parentCommentId) {
        const str_info = JSON.stringify({
            "imgentryId": imageId,
            "memberId": userId, // 空即为游客
            "commentText": text,
            "parentCommentId": parentCommentId // 父评论ID（如果是评论则传0，回复则传回复的那一条评论id）
        })
        const response = await api.post("/interface/memberCommentLogs/addMemberCommentLogs", str_info);
        return response.data;
    },

    async uploadFile(file) {
        // const str_info = JSON.stringify({
        //     "file": file
        // })
        const formData = new FormData();
        formData.append('file', file);
        return api.post("/common/common/webAliyunUpload", formData);
        // const response = await api.post("/common/common/webAliyunUpload", formData);
        // return response.data;
    },
    async addUserUploadLog(userId, imgName, time="", position="", intro="", holder="", type="", url="") {
        let inputData = {
            "memberId": userId,
            "submitimgName": imgName
        }
        if(time.length){Object.assign(inputData, {"submitimgTime": time})}
        if(position.length){Object.assign(inputData, {"submitimgPosition": position})}
        if(intro.length){Object.assign(inputData, {"submitimgIntro": intro})}
        if(holder.length){Object.assign(inputData, {"submitimgHolder": holder})}
        if(type.length){Object.assign(inputData, {"submitimgType": type})}
        if(url.length){Object.assign(inputData, {"submitimgUrl": url})}
        // const str_info = JSON.stringify({
        //     "memberId": userId,
        //     "submitimgName": imgName,
        //     "submitimgTime": time,
        //     "submitimgPosition": position,
        //     "submitimgIntro": intro,
        //     "submitimgHolder": holder,
        //     "submitimgType": type,
        //     "submitimgUrl": url,
        // })
        const response = await api.post("/interface/imageEntrySubmit/addImageEntrySubmit", JSON.stringify(inputData));
        return response.data;
    },
    async addRevisionLog(userId, imgId) {
        const str_info = JSON.stringify({
            "memberId": userId,
            "imgentryId": imgId,
        })
        const response = await api.post("/interface/imageEntryRevision/addImageEntryRevision", str_info);
        return response.data;
    },
    async addRevisionLog(userId, tagsId, remark="") {
        let inputData = {
            "tagsIds": tagsId,
            "memberId": userId,
        }
        if(remark){Object.assign(inputData, {"remark": remark})}
        const response = await api.post("/interface/imageEntryTagsRevision/addImageEntryTagsRevision", JSON.stringify(inputData));
        return response.data;
    },

}