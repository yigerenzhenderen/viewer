<template>
    <div class="u-div">
        <div class="u-header">
            <div class="title-container"><span class="title">湖南影像档案馆</span></div>
            <div class="avatar">
                <img src="https://ww3.sinaimg.cn/mw690/d315af46ly1hnn5btbjr5j20j60j7mzv.jpg" alt="" style="width: 100%; height: 100%;">
            </div>
        </div>
        <div class="u-container">
            <div class="u-controll">
                <div class="uploader">
                    <div class="wrapper">
                        <div class="upload-icon" @click="upload">添加图片</div>
                        <input accept="image/bmp,image/gif,image/jpeg,image/png,image/tiff,image/webp,video/mp4,video/x-m4v,video/quicktime" 
                                aria-label="上传文件" 
                                data-test-id="storyboard-upload-input" 
                                id="storyboard-upload-input" 
                                multiple="" 
                                tabindex="0" 
                                type="file" 
                                style="cursor: pointer; height: 100%; opacity: 0; position: absolute; width: 100%; left: 0px; top: 0px; font-size: 0px;">
                    </div>
                    <div class="upload-text"><span>每次最多上传5张照片</span></div>
                </div>
                <div style="overflow-y: scroll; overflow-x: hidden;">
                    <div class="border" v-for="img in imgs" 
                        :key="img.id"
                        :class="{ showborder : img.id === focusId,}"
                        @click="focusId=img.id">
                        <Checkbox :id="img.id" :choose="img.choose" :name="img.name" @chooseChange="changeHandler"/>
                    </div>
                </div>
                <div class="submit-container">   
                    <div v-if="numChoose" class="submit" style="margin-left: 0; margin-right: 0; margin-bottom: 10px;" @click="submit">提交</div>
                </div>
                <div v-if="imgs.length" class="bottom">
                    <div class="u-check-wrapper" style="margin: 10px; margin-left: 30px;">
                        <div class="u-check" style="box-sizing: border-box; width: 20px; height: 20px; position: relative;cursor: pointer;">
                            <svg style="pointer-events: none;" v-if="numChoose === imgs.length" width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="black"/>
                                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="white"/>
                                <path d="M12 5L6.5 10.5L4 8" stroke="white" stroke-width="1.6666" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <img :src="selectSome_url" style="pointer-events: none; width: 20px; height: 20px;" v-else-if="numChoose" ></img>
                            <svg style="pointer-events: none;" v-else width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="white"/>
                                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#757575"/>
                            </svg>
                        </div>
                        <input type="checkbox" class="i-ch" @change="selectAllChange">
                    </div>
                    <div style="margin: 8px;"><span>全选</span></div>
                    <div style="width: 24px; height: 24px; margin-right: 40px; margin-left: auto; margin-top: 7px; position: relative; cursor: pointer; margin-bottom: 8px;"
                        @click="remove">
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.7245 5.27519H16.0345V4.38519C16.0307 3.75501 15.7793 3.15157 15.3345 2.70519C15.1128 2.48282 14.8494 2.30648 14.5594 2.18634C14.2693 2.06621 13.9584 2.00464 13.6445 2.00519H10.3845C10.0705 2.00464 9.75956 2.06621 9.46952 2.18634C9.17947 2.30648 8.91606 2.48282 8.69445 2.70519C8.25326 3.15319 8.0055 3.75643 8.00445 4.38519V5.27519H3.31445C3.11554 5.27519 2.92478 5.35421 2.78412 5.49486C2.64347 5.63551 2.56445 5.82628 2.56445 6.02519C2.56445 6.2241 2.64347 6.41487 2.78412 6.55552C2.92478 6.69617 3.11554 6.77519 3.31445 6.77519H4.73445V18.5352C4.73037 18.991 4.81665 19.443 4.98829 19.8653C5.15993 20.2875 5.41353 20.6715 5.73445 20.9952C6.38878 21.6363 7.26839 21.9953 8.18445 21.9952H15.8045C16.7205 21.9953 17.6001 21.6363 18.2544 20.9952C18.5754 20.6715 18.829 20.2875 19.0006 19.8653C19.1723 19.443 19.2585 18.991 19.2544 18.5352V6.77519H20.6845C20.8834 6.77519 21.0741 6.69617 21.2148 6.55552C21.3554 6.41487 21.4345 6.2241 21.4345 6.02519C21.4345 5.82628 21.3554 5.63551 21.2148 5.49486C21.0741 5.35421 20.8834 5.27519 20.6845 5.27519H20.7245ZM9.52445 4.38519C9.52449 4.26977 9.5475 4.15551 9.59214 4.04906C9.63678 3.94262 9.70215 3.84612 9.78445 3.76519C9.94977 3.60169 10.172 3.50852 10.4045 3.50519H13.6645C13.7815 3.50446 13.8975 3.52708 14.0056 3.57173C14.1138 3.61637 14.212 3.68214 14.2945 3.76519C14.458 3.93051 14.5511 4.1527 14.5545 4.38519V5.27519H9.55445L9.52445 4.38519ZM10.8545 16.9952C10.8545 17.2604 10.7491 17.5148 10.5616 17.7023C10.374 17.8898 10.1197 17.9952 9.85445 17.9952C9.58924 17.9952 9.33488 17.8898 9.14735 17.7023C8.95981 17.5148 8.85445 17.2604 8.85445 16.9952V11.5652C8.85445 11.3 8.95981 11.0456 9.14735 10.8581C9.33488 10.6705 9.58924 10.5652 9.85445 10.5652C10.1197 10.5652 10.374 10.6705 10.5616 10.8581C10.7491 11.0456 10.8545 11.3 10.8545 11.5652V16.9952ZM15.2145 16.9952C15.2145 17.2604 15.1091 17.5148 14.9216 17.7023C14.734 17.8898 14.4797 17.9952 14.2145 17.9952C13.9492 17.9952 13.6949 17.8898 13.5073 17.7023C13.3198 17.5148 13.2145 17.2604 13.2145 16.9952V11.5652C13.2145 11.3 13.3198 11.0456 13.5073 10.8581C13.6949 10.6705 13.9492 10.5652 14.2145 10.5652C14.4797 10.5652 14.734 10.6705 14.9216 10.8581C15.1091 11.0456 15.2145 11.3 15.2145 11.5652V16.9952Z" 
                            :fill="numChoose ? '#000000' : '#A6A6A6'"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="u-content">
                <div class="content-h">
                    <div>上传图片及信息</div>
                    <div class="submit" @click="submit">提交</div>
                </div>
                <div class="content-b">
                    <div class="content-img">
                        <el-upload
                            drag
                            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                            multiple
                            :limit="4"
                            style="width: 100%; height: 100%;"
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
                    </div>
                    <div class="content-info">
                        <el-form
                            :inline="true" 
                            :model="form" 
                            label-width="auto" 
                            label-position="top" 
                            style="max-width: 80%"
                        >
                            <el-form-item label="照片名称（必填）" style="width: 100%;" :required="true">
                                <el-input v-model="form.name" />
                            </el-form-item>
                            <el-form-item label="照片说明（必填）" style="width: 100%;" :required="true">
                                <el-input v-model="form.desc" type="textarea" :rows="4" resize="none"/>
                            </el-form-item>
                            <el-col :span="12">
                                <el-form-item label="拍摄时间（选填）" style="width: 100%;">
                                    <el-date-picker
                                        v-model="form.shotTime"
                                        type="date"
                                        placeholder="请选择拍摄时间"
                                        style="width: 90%"
                                    />                                
                                </el-form-item>
                            </el-col>
                            <el-col :span="12"></el-col>
                            <el-col :span="12">
                                <el-form-item label="拍摄者（选填）" style="width: 90%;">
                                    <el-input v-model="form.shoter"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="拍摄者（选填）" style="width: 90%;">
                                    <el-input v-model="form.shoter" />
                                </el-form-item>
                            </el-col>
                            <el-form-item label="关键词（选填）" style="width: 100%;">
                                <div style="display: flex; flex-direction: column; width: 100%;">
                                    <el-select
                                    v-model="form.kws"
                                    filterable
                                    placeholder="Select"
                                    style="width: 100%; margin-bottom: 10px;"
                                    >
                                    </el-select>
                                    <div class="tag-container1">
                                        <el-check-tag 
                                            v-for="tag in form.kws" 
                                            :key="tag.label"
                                            :checked="tag.choose" 
                                            type="primary" 
                                            @change="checkTag(event, tag)"
                                            class="tags"
                                            closable
                                            :disable-transitions="true"
                                            >
                                            <template #>
                                                <div style="display: flex; display: flex; align-items: center; justify-content: center;">
                                                    <span>{{ tag.label}}</span>
                                                    <div style="width: 10px;"></div>
                                                    <div style="height: 10px; width: 10px; position: relative;">
                                                        <svg style="left: 0; top: 0.5;" width="100%" height="100%" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M0.5 8.9989L8.5 1.00116M0.5 1.00116L8.5 8.9989" stroke="white" stroke-linecap="round"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </template>
                                        </el-check-tag>
                                    </div>
                                    <div v-if="form.kws.length" style="width: 100%; height: 0.5px; background-color: #949494; margin-top: 16px; margin-bottom: 16px;"></div>
                                    <div class="tag-container2">
                                        <el-check-tag 
                                            v-for="tag in often_tags" 
                                            :checked="tag.choose" 
                                            type="primary" 
                                            @change="checkTag($event, tag)"
                                            class="tags"
                                            :key="tag.label"
                                            >
                                            {{ tag.label}}
                                        </el-check-tag>
                                        <div style="font-size: 14px; color: #767676; text-decoration: underline; cursor: default; margin-left: 5px;">每张照片最多三个关键词</div>
                                    </div>
                                </div>
                            </el-form-item>
                    </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
  
<script>
import Checkbox from "./upload/checkbox.vue"
import selectSome from "/src/assets/selectSome.svg"
// import UploadDetail from "./upload/uploadDetail.vue"

export default{
    data(){
        return {
            selectSome_url: selectSome,
            selectAll:false,
            focusId: 0,
            form:{
                name: '',
                desc: '',
                shotTime: '',
                shoter: '',
                place: '',
                kws: [],
            },
            imgs: [{
                name: "img1",
                id: 0,
                choose: false,
                isFocus: true,
                form:{}
            },{
                name: "img2",
                id: 1,
                choose: false,
                isFocus: false,
                form:{}
            },{
                name: "img2",
                id: 2,
                choose: false,
                isFocus: false,
                form:{}
            },
            {
                name: "img3",
                id: 3,
                choose: false,
                isFocus: false,
                form:{}
            },{
                name: "img4",
                id: 4,
                choose: false,
                isFocus: false,
                form:{}
            },{
                name: "img5",
                id: 5,
                choose: false,
                isFocus: false,
                form:{}
            },
            {
                name: "img6",
                id: 6,
                choose: false,
                isFocus: false,
                form:{}
            }
            ],
            often_tags:[
                {
                    label: 'Tag 1',
                    value: 'tag1',
                    choose: false,
                },
                {
                    label: 'Tag 2',
                    value: 'tag2',
                    choose: false,
                },
                {
                    label: 'Tag 3',
                    value: 'tag1',
                    choose: false,
                }
            ],
        }
    },
    computed: {
        numChoose(){
            return this.imgs.filter(i=>i.choose).length;
        }
    },
    components: {
        Checkbox
    },
    methods: {
        changeHandler(id, newState){
            this.imgs.forEach(d=>{
                if(d.id == id){
                    d.choose = newState;
                }
            })
        },
        checkTag(event, tag){
            tag.choose = !tag.choose;
            if(tag.choose){
                this.form.kws.push(tag);
                this.often_tags = this.often_tags.filter(t=>t.label !== tag.label);
            }else{
                this.often_tags.push(tag);
                this.form.kws = this.form.kws.filter(t=>t.label !== tag.label);
            }
        },
        selectAllChange(){
            this.selectAll = !this.selectAll;
            this.imgs.forEach(i => {
                i.choose = this.selectAll;
            });
        },
        remove(){
            this.imgs = this.imgs.filter(i=>!i.choose);
        },
        submit(){
            console.log(this.form);
        }
    },
    mounted(){ 
        
    }
}
</script>


<style scoped>


:deep(.el-form-item__label){
    color: #000;
}

:deep(.el-check-tag){
    border-radius: 0px;
    padding: 4px 8px;
    /* width: 48px;
    height: 32px; */
    color: #555555;
    background-color: #F2F2F2;
    text-align: center;
    font-weight: normal;
    line-height: normal;
}

:deep(.el-check-tag.el-check-tag--primary.is-checked){
    background-color: black;
    color: #FFFFFF;
}
:deep(.el-check-tag.el-check-tag--primary.is-checked:hover) {
    background-color: black;
    color: #FFFFFF;
}

:deep(.el-form-item){
    margin-bottom: 40px;
}

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

.submit{
    width: 200px;
    height: 50px;
    background-color: #F34C4F;
    color: #FFF;
    border: 3px solid #FBBBBC;
    margin-top: 20px;
    margin-left: auto;
    margin-right: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: underline;
    cursor: pointer;
}
:deep(.el-textarea__inner){
    border-radius: 0px;
}

:deep(.el-input__wrapper){
    border-radius: 0px;
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

.tag-container1{
    width: 90%;
    height: fit-content;
    margin-left: -5px;
}

.tag-container2{
    width: 90%;
    height: 100px;
    overflow-y: scroll;
    margin-left: -5px;
}

.tags{
    margin: 5px;
}
</style>
  