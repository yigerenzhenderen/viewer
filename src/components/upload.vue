<template>
    <div class="u-div">
        <div class="u-header">
            <div class="title">
                <span>湖南影像档案馆</span>
                <router-link to="/" class="link" style="position: absolute;"></router-link>
            </div>
            <Avatar style="margin-right: 10px;"></Avatar>
        </div>
        <div class="u-container">
            <div class="u-controll">
                <div class="uploader">
                    <div class="wrapper">
                        <div class="upload-icon" @click="buttonUpload">添加图片</div>
                    </div>
                    <div class="upload-text"><span>每次最多上传5张照片</span></div>
                </div>
                <div style="overflow-y: scroll; overflow-x: hidden; flex: 1;">
                    <div class="border" v-for="img in imgs" 
                        :key="img.id"
                        :class="{ showborder : img.id === focusImg.id}"
                        @click="refreshFocusImg(img)">
                        <div class="u-checkbox-container">
                            <Checkbox :id="img.id" v-model:choose="img.choose" :name="img.name"/>
                            <div class="u-img-container">
                                <img :src="img.file.url" alt="" style="width: 100%; height: 100%;">
                            </div>  
                        </div>
                    </div>
                </div>
                <div class="submit-container">   
                    <div v-if="numChoose" class="submit" style="margin-left: 0; margin-right: 0; margin-bottom: 10px;" @click="submit">提交</div>
                </div>
                <div v-if="imgs.length" class="bottom">
                    <Checkbox3 :total="imgs.length" :selected="numChoose" @selectAllChange="selectAllChange"></Checkbox3>
                    <div style="margin: 8px;"><span>{{(imgs.length == numChoose) || (!numChoose) ? "全选" : `${numChoose} / ${imgs.length}`}}</span></div>
                    <div style="width: 24px; height: 24px; margin-right: 40px; margin-left: auto; margin-top: 7px; position: relative; cursor: pointer; margin-bottom: 8px;"
                        @click="askRemove">
                        <Remove :selected="!!numChoose" active-color="#000"></Remove>
                    </div>
                </div>
            </div>
            <div class="u-content" style="flex-direction: column; margin-top: 10px;">
                <div class="content-h">
                    <div>上传图片及信息</div>
                    <div class="submit" @click="submit" style="margin-right: 100px;">提交</div>
                </div>
                <div class="content-b">
                    <div class="content-img">
                        <el-upload
                            ref="uploader"
                            drag
                            action="https://vaip.arts-press.com/rasterInterface/common/common/webAliyunUpload"
                            multiple
                            list-type="picture"
                            v-model:file-list="fileList"
                            :limit="capacity"
                            :on-success="handleSuccess"
                            :on-exceed="handleExceed"
                            :on-change="handleChange"
                            :auto-upload="false"
                            :show-file-list="false"
                            style="width: 100%; height: 100%;"
                            :class="{'uploaded': isFocusImg}"
                        >
                            <div class="upload-default">
                                <div style="width: 50px; height: 50px;">
                                    <svg width="100%" height="100%" style="width: 100%; height: 100%; position: relative;" viewBox="0 0 55 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect y="0.5" width="55" height="55" rx="27.5" fill="black"/>
                                        <path d="M24.9 42V22.9833L18.14 29.05L14.5 25.6667L27.5 14L40.5 25.6667L36.86 29.05L30.1 22.9833V42H24.9Z" fill="white"/>
                                    </svg>
                                </div>
                                <div class="upload-info">选择一个文件，并拖放到此处</div>
                                <div class="upload-info2">上传文件最大不超过5MB，格式为.png或.jpg</div>
                            </div>   
                        </el-upload>
                        <img v-if="isFocusImg" :src="focusImg.file.url" alt="" style="width: 100%; height: auto;">
                    </div>
                    <div class="content-info">
                        <editInfo ref="form" v-model:form-data="focusImg.form" />
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            v-model="askRemoveData.dialogVisible"
            title=""
            width="400"
            :align-center="true"
            :show-close="false"
            style="padding: 30px"
        >
            <span style="font-size: 28px; margin-left: auto;">
                确认删除
                <span style="color: #F93232;">{{ this.askRemoveData.numRemove }}</span>
                张图片?
            </span>
            <div style="height: 30px;"></div>
            <template #header>
                <div></div> 
            </template>
            <template #footer>
                <div class="dialog-footer" style="display: flex; justify-content: center;">
                    <el-button class="dialog-button" style="background-color: #F3F3F3; border-color: #F3F3F3; color: #000;" @click="askRemoveData.dialogVisible = false">继续编辑</el-button>
                    <el-button class="dialog-button" type="primary" style="background-color: #F93232; border-color: #F93232;" @click="remove">删除</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  
  
<script>
import Checkbox from "./upload/checkbox.vue"
import Avatar  from "./utils/avatar.vue";
import Remove  from "./utils/remove.vue";
import Checkbox3  from "./utils/checkbox3.vue";
import editInfo  from "./utils/editInfo.vue";
import fetch from "../js/fetch";
import { ElMessage } from 'element-plus';

export default{
    data(){
        return {
            fileList: [],
            selectAll:false,
            defaultFocusImg: {
                file:{
                    url: ""
                },
                form:{
                    id: 0,
                    name: '',
                    desc: '',
                    shotTime: '',
                    shoter: '',
                    place: '',
                    kws: [],
                }
            },
            focusImg:{
                file:{
                    url: ""
                },
                form:{
                    id: 0,
                    name: '',
                    desc: '',
                    shotTime: '',
                    shoter: '',
                    place: '',
                    kws: [],
                }
            },
            capacity: 5,
            imgs: [],
            askRemoveData: {
                dialogVisible: false,
                numRemove: 0,
            },
        }
    },
    computed: {
        numChoose(){
            return this.imgs.filter(i=>i.choose).length;
        },
        isFocusImg(){
            return Object.keys(this.focusImg).length !== 2;
        },
        imgsLength(){
            return this.imgs.length;
        }
    },
    components: {
        Checkbox, Avatar, Checkbox3, Remove, editInfo
    },
    methods: {
        checkTag(event, tag){
            tag.choose = !tag.choose;
            if(tag.choose){
                this.focusImg.form.kws.push(tag);
            }else{
                this.focusImg.form.kws = this.focusImg.form.kws.filter(t=>t.label !== tag.label);
            }
            this.often_tags.forEach(t => {
                if(t.label === tag.label){
                    t.choose = tag.choose;
                }
            });
        },
        selectAllChange(){
            this.selectAll = !this.selectAll;
            this.imgs.forEach(i => {
                i.choose = this.selectAll;
            });
        },
        askRemove(){
            const toRemove = this.imgs.filter(i=>i.choose);
            if(!toRemove.length) return;
            this.askRemoveData.dialogVisible = true;
            this.askRemoveData.numRemove = toRemove.length;
        },
        remove(){
            this.askRemoveData.dialogVisible = false;
            const toRemove = this.imgs.filter(i=>i.choose);
            toRemove.forEach(i =>{
                this.$refs.uploader.handleRemove(i.file.raw);
            })
            this.imgs = this.imgs.filter(i=>!i.choose);
        },
        submit(){
            const toSubmit = this.imgs.filter(i=>i.choose);
            console.log(toSubmit);
            toSubmit.forEach(img => {
                this.$refs.uploader.submit(img);
            })
        },
        handleChange(currentFile, uploadFiles){
            if(currentFile.status == "ready"){
                this.imgs.push({
                    id: currentFile.uid,
                    name: currentFile.name,
                    choose: false,
                    isFocus: false,
                    form:{
                        id: crypto.randomUUID(),
                        name: '',
                        desc: '',
                        shotTime: '',
                        shoter: '',
                        place: '',
                        kws: []
                    },
                    file: currentFile
                })
            }
        },
        handleExceed(files, uploadedFiles){
            const currentFilesNumber = uploadedFiles.length;
            const toupload = Math.max(0,(this.capacity - currentFilesNumber));
            ElMessage({
                // plain: true,
                message: toupload ? `超出数量限制，只有${toupload}个图片被上传` : "超出数量限制",
            })
            files.slice(0, toupload).forEach(f => {
                this.$refs.uploader.handleStart(f);
            })
        },
        handleSuccess(response, uploadedFile, uploadedFiles){
            const successImg = this.imgs.find(img => img.id == uploadedFile.uid);
            console.log('success',response, uploadedFile, uploadedFiles)
            const extras = {
                "submitimgTime": successImg.form.showTime,
                "submitimgPosition": successImg.form.place,
                "submitimgIntro": successImg.form.desc,
                "submitimgHolder": successImg.form.shoter,
                "submitimgUrl": response.data.submitimgUrl,
                "memberId": "1",
                "fileSize": uploadedFile.size,
                "tagsIds": successImg.form.kws.join(',')
            }
            console.log(extras)
            // fetch.addUserUploadLog(1, uploadedFile.uid, uploadedFile.name, extras)
        },
        buttonUpload(){
            d3.select(".el-upload__input").node().click();
        },
        refreshFocusImg(newFocus){
            this.focusImg = newFocus;
            // this.$refs.form.refreshFocusImg(newFocus); //告诉子组件需要更新tag 直接调用子组件方法
        }
    },
    watch:{
        imgsLength(newLength){
            if(!newLength){
                this.refreshFocusImg(this.defaultFocusImg);
            }
            if(newLength){
                this.refreshFocusImg(this.imgs[0]);
            }
        }
        // imgs:{
        //     deep: true,
        //     handler(v){
        //         console.log(v)
        //     }
        // }
    },
    mounted(){ 
        
    }
}
</script>


<style scoped lang="scss">


// :deep(.el-form-item__label){
//     color: #000;
// }

// :deep(.el-check-tag){
//     border-radius: 0px;
//     padding: 4px 8px;
//     /* width: 48px;
//     height: 32px; */
//     color: #555555;
//     background-color: #F2F2F2;
//     text-align: center;
//     font-weight: normal;
//     line-height: normal;
// }

// :deep(.el-check-tag.el-check-tag--primary.is-checked){
//     background-color: black;
//     color: #FFFFFF;
// }
// :deep(.el-check-tag.el-check-tag--primary.is-checked:hover) {
//     background-color: black;
//     color: #FFFFFF;
// }

// :deep(.el-form-item){
//     margin-bottom: 40px;
// }

:deep(.el-upload){
  width: 100%;
  height: 100%;
}

:deep(.el-upload .el-upload-dragger){
  width: 100%;
  height: 100%;
  border-radius: 0;
  background-color:#EFEFEF;
  border-color: #CBCBCB;
  border-style: dashed;
  border-width: 2px;
}

.upload-default{
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    height: 100%;

}

:deep(.el-dialog__body){
    text-align: center;
}

.dialog-button{
    width: 160px; 
    height: 44px;
}


.border{
    /* box-sizing: border-box; */
    border-width: 1px 0px 1px 0px;
    border-style: solid;
    border-color: transparent;
    /* position: relative; */
    background-color: white;
    /* overflow: visible; */
}
.upload-info{
    font-size: 20px;
    color: #000;

}
.upload-info2{
    margin-top: 50px;
    width: 250px;
    font-size: 20px;
    color: #A1A1A1;
}
.showborder{
    overflow: visible;
    border-color: #757575;
    margin-right: -2px;
    border-right-width: 2px;
    border-right-style: solid;
    border-right-color: white;
}

// .tag-container1{
//     width: 90%;
//     height: fit-content;
//     margin-left: -5px;
// }

// .tag-container2{
//     width: 90%;
//     height: 100px;
//     overflow-y: scroll;
//     margin-left: -5px;
// }

// .tags{
//     margin: 5px;
// }

.u-checkbox-container{
    box-sizing: border-box;
    width: calc(100% - 1px);
    height: 194px;
    display: flex;
    padding: 20px;

    .u-img-container{
        width: 80%;
        height: 100%;
        // background-color: lightgreen;
    }
  
}

.uploaded{
    display: none;
    // pointer-events: none;
    // opacity: 0;
    // position: absolute;
}


</style>
  