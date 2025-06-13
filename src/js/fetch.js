import axios from 'axios';

// let baseurl = "https://vaip.arts-press.com/rasterInterface"
let baseurl = "https://photo-hn.cn/rasterInterface"

const api = axios.create({
    baseURL: baseurl
});

export default {
    async getAllImgData() {
        // tagsIds 关键字标签id，多个以逗号分隔
        // tagslocationId 地域标签
        // tagstimeId 时间标签
        const response = await api.post("/interface/imageEntry/selectImageEntryListByTagsIdOrTagslocationIdOrTagstimeId", {
            tagsIds: "",
            tagslocationId: "",
            tagstimeId: ""
        });
        return response.data;
    },
    async getImg(imgId) {
        // tagsIds 关键字标签id，多个以逗号分隔
        // tagslocationId 地域标签
        // tagstimeId 时间标签
        const response = await api.post("/interface/imageEntry/selectImageEntryDetails", {
            imgentryId: imgId
        });
        // /interface/imageEntry/selectImageEntryDetails?imgentryId
        return response.data.data;
    },
    async addUserInfo(info) {
        const str_info = JSON.stringify(info);
        const response = await api.post("/interface/member/addMember", str_info);
        return response.data;
    },
    async editUserInfo(info) {
        const response = await api.post("/interface/member/editMember", info);
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
        const json_data = {
            memberId: userId,
            pageNum: 1,
            pageSize: 100
        }
        const response = await api.post("/interface/memberBrowseLogs/selectMemberBrowseLogsByMemberId", json_data);
        return response.data;
    },
    async getUserForwardLogs(userId) {
        const json_data = {
            memberId: userId,
            pageNum: 1,
            pageSize: 50
        }
        const response = await api.get("/interface/memberForwardLogs/selectMemberForwardLogsByMemberId", json_data);
        return response.data;
    },
    async getUserLikeLogs(userId) {
        const json_data = {
            memberId: userId,
            pageNum: 1,
            pageSize: 50
        }
        const response = await api.post("/interface/memberLikeLogs/selectMemberLikeLogsByMemberId", json_data);
        return response.data;
    },
    async getUserCommentLogs(userId) {
        const json_data = {
            memberId: userId,
            pageNum: 1,
            pageSize: 50
        }
        const response = await api.get("/interface/memberCommentLogs/selectMemberCommentLogsByMemberId", json_data);
        return response.data;
    },
    async getUserUploadLogs(userId) {
        const json_data = {
            memberId: userId,
            pageNum: 1,
            pageSize: 50
        }
        const response = await api.post("/interface/imageEntrySubmit/selectImageEntrySubmitByMemberId", json_data);
        return response.data;
    },
    async getUserUploadRevision(userId, pageNum, pageSize) {
        const json_data = {
            memberId: userId,
            pageNum: pageNum,
            pageSize: pageSize
        }
        const response = await api.post("/interface/imageEntryRevision/selectImageEntryRevisionByMemberId", json_data);
        return response.data;
    },
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
    async userLike(imageId, memberId = "", actionFlag) {
        const str_info = {
            "imgentryId": imageId,
            "memberId": memberId, // 空即为游客
            "actionFlag": actionFlag ? "1" : "0" // 1: like  0: remove like
        }
        const response = await api.post("/interface/memberLikeLogs/addMemberLikeLog", str_info);
        return response.data;
    },
    async userForward(imageId, userId = "") {
        const str_info = {
            "imgentryId": imageId,
            "memberId": userId, // 空即为游客
        }
        const response = await api.post("/interface/memberForwardLogs/addMemberForwardLogs", str_info);
        return response.data;
    },
    async userView(imageId, userId = "") {
        const str_info = {
            "imgentryId": imageId,
            "memberId": userId, // 空即为游客
        }
        const response = await api.post("/interface/memberBrowseLogs/addMemberBrowseLogs", str_info);
        return response.data;
    },
    async userComment(imageId, userId = "", text, parentCommentId) {
        const json_data = {
            imgentryId: imageId,
            memberId: userId, // 空即为游客
            commentText: text,
            parentCommentId: parentCommentId // 父评论ID（如果是评论则传0，回复则传回复的那一条评论id）
        }
        const response = await api.post("/interface/memberCommentLogs/addMemberCommentLogs", json_data);
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
    async addUserUploadLog(json_data) {
        // let requestData = {
        //     "memberId": memberId,
        //     "submitimgName": submitimgName,
        //     "originalFileName": originalFileName,
        // }
        // if (Object.keys(rest).length){
        //     Object.assign(requestData, rest)
        // }
        // {
        //     "memberId": 用户id  
        //     "submitimgName": "照片名称",
        //     "originalFileName": "源文件名称.jpg",
        //     "submitimgTime": 1,
        //     "submitimgPosition": 1,
        //     "submitimgIntro": "背景描述",
        //     "submitimgHolder": "照片作者",
        //     "submitimgType": "照片类别",
        //     "submitimgUrl": "照片url",
        //     "fileSize": response.fileSize,
        //     "tagsIds": "1,2"
        // }
        // if(time.length){Object.assign(inputData, {"submitimgTime": time})}
        // if(position.length){Object.assign(inputData, {"submitimgPosition": position})}
        // if(intro.length){Object.assign(inputData, {"submitimgIntro": intro})}
        // if(holder.length){Object.assign(inputData, {"submitimgHolder": holder})}
        // if(type.length){Object.assign(inputData, {"submitimgType": type})}
        // if(url.length){Object.assign(inputData, {"submitimgUrl": url})}
        const response = await api.post("/interface/imageEntrySubmit/addImageEntrySubmit", json_data);
        return response.data;
    },
    async getOthersLiksLogs(userId){
        const json_data = {
            memberId: userId, // 空即为游客
            pageNum: 1,
            pageSize: 50
        }
        const response = await api.post("/interface/imageEntrySubmit/selectImageEntrySubmitLike", json_data);
        return response.data;
        
    },
    async getOthersCommentReplyLogs(userId, pageNum, pageSize){
        const json_data = {
            memberId: userId, // 空即为游客
            pageNum: pageNum,
            pageSize: pageSize
        }
        const response = await api.post("/interface/imageEntrySubmit/selectImageEntrySubmitComment", json_data);
        return response.data;
    },
    async removeComment(userId, commentId){
        const json_data = {
            memberId: userId, // 空即为游客
            commentId: commentId,
        }
        const response = await api.post("/interface/memberCommentLogs/deleteMemberCommentLogsByCommentByCommentId", json_data);
        return response.data;
        
    },
    async addRevisionLog(diff){
        const response = await api.post("/interface/imageEntryRevision/addImageEntryRevision", diff);
        return response.data;
    },
    async addTagRevision(userId, imgentryId, tagsId){
        const json_data = {
            memberId: userId,
            imgentryId: imgentryId,
            tagsIds: tagsId,
        }
        // console.log(json_data)
        const response = await api.post("/interface/imageEntryTagsRevision/addImageEntryTagsRevision",json_data);
        return response.data;
    },
    async getPhoneVerifyCode(phoneNumber){
        const json_data = {
            memberPhone: phoneNumber
        }
        const response = await api.get("/interface/sms/sendCode",json_data);
        return response.data;
    },
    async loginByPhoneNumber(phoneNumber, smsCode){
        const json_data = {
            memberPhone: phoneNumber,
            smsCode: smsCode
        }
        const response = await api.post("/interface/sms/sendCode",json_data);
        return response.data;
    }

}