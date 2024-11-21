<template>
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
            <el-form-item label="拍摄时间（选填）">
                <el-date-picker
                    v-model="form.shotTime"
                    type="date"
                    placeholder="请选择拍摄时间"
                    style="width: 100%"
                />                                
            </el-form-item>
        </el-col>
        <el-col :span="12"></el-col>
        <el-col :span="12">
            <el-form-item label="拍摄者（选填）">
                <el-input v-model="form.shoter"/>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="拍摄点（选填）">
                <el-cascader
                    style="width: 100%;"
                    v-model="form.place"
                    :options="hunan_district"
                    :props="{
                        value: 'name',
                        label: 'name',
                        children: 'children',
                    }"
                />
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
                            @change="checkTag($event, tag)"
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
                            :style="{'display': tag.choose ? 'none' : ''}"
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
</template>


<script>
// import Checkbox from "./upload/checkbox.vue"
// import Avatar  from "./utils/avatar.vue";
// import Remove  from "./utils/remove.vue";
// import Checkbox3  from "./utils/checkbox3.vue";
import fetch from "/src/js/fetch";
// import { ElMessage } from 'element-plus';
import hunan_district from '/src/assets/hunan.json';

export default{
    data(){
        return {
            hunan_district: hunan_district,
            defaultForm: {
                id: "",
                name: '',
                desc: '',
                shotTime: '',
                shoter: '',
                place: '',
                kws: [],
            },
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
    emits: ['update:formData'],
    props:{
        formData: {
            type: Object,
            required: true,
            default: {
                name: '',
                desc: '',
                shotTime: '',
                shoter: '',
                place: '',
                kws: []
            },
        }
    },
    computed:{
        form: {
            deep: true,
            get() {
                return this.formData;
            },
            set(newValue) {
                this.$emit('update:formData', newValue);
            }
        }
    },
    methods: {
        checkTag(event, tag){
            tag.choose = !tag.choose;
            if(tag.choose){
                this.form.kws.push(tag);
            }else{
                this.form.kws = this.form.kws.filter(t=>t.label !== tag.label);
            }
            this.often_tags.forEach(t => {
                if(t.label === tag.label){
                    t.choose = tag.choose;
                }
            });
        },
        refreshFocusImg(newForm){
            // tag被display: none的要还原
            const newKwsSet = new Set(newForm.kws.map(d=>d.label));
            this.often_tags.forEach( tag => {
                tag.choose = newKwsSet.has(tag.label);
            });
        }
    },
    watch:{
        form:{
            deep: true,
            handler(newForm, oldForm){
                if(newForm.id !== oldForm.id) {
                    this.refreshFocusImg(newForm);
                }
            }
        }
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

:deep(.el-textarea__inner){
    border-radius: 0px;
}

:deep(.el-input__wrapper){
    border-radius: 0px;
}

:deep(.el-textarea){
    --el-input-focus-border-color : #000;
}

:deep(.el-input){
    --el-input-focus-border-color : #000;
}
:deep(.el-select__wrapper.is-focused){
    box-shadow: 0 0 0 1px #000;
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