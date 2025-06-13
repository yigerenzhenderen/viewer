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
        <el-form-item label="关键词（选填）" style="width: 100%;" class="kw-c">
            <div style="display: flex; flex-direction: column; width: 100%;">
                <el-input
                    class="input"
                    v-model="select"
                    style="width: 100%"
                    placeholder="筛选标签"
                >
                    <template #prefix>
                        <el-icon class="el-input__icon"><Search /></el-icon>
                    </template>
                </el-input>
                <div class="tag-container1">
                    <el-check-tag 
                        v-for="tag in tags.yes" 
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
                <div v-if="form.kws.length" class="segmentLine"></div>
                <div class="tag-container2">
                    <el-check-tag 
                        v-for="tag in tags.no" 
                            :checked="tag.choose"
                            :style="{'display': (tag.choose || !tag.show) ? 'none' : ''}"
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
import fetch from "/src/js/fetch";
import hunan_district from '/src/assets/hunan.json';
import { mapStores } from "pinia";
import { useGlobalStore } from "../../store/global";
import { Search } from '@element-plus/icons-vue'

export default{
    data(){
        return {
            hunan_district: hunan_district,
            select: "",
        }
    },
    emits: ['update:formData'],
    components: {
        Search
    },
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
        ...mapStores(useGlobalStore),
        tags(){
            const currentTagLabelsSet = new Set(this.form.kws.map(d=>d.label));
            this.globalStore.tagList.forEach(tag => {
                tag.choose = currentTagLabelsSet.has(tag.label)
            })
            return _.groupBy(this.globalStore.tagList, tag => tag.choose ? 'yes': 'no');
        },
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
            if(!tag.choose){
                this.form.kws.push(tag);
            }else{
                this.form.kws = this.form.kws.filter(t=>t.label !== tag.label);
            }
        },
    },
    watch:{
        select(query){
            this.globalStore.tagList.forEach(tag => {
                if(tag.choose) return;
                tag.show = tag.label.includes(query);
            })
        },
        // form:{
        //     deep: true,
        //     handler(newForm, oldForm){
        //         console.log(1, newForm)
        //     }
        // }
    }
}
</script>


<style scoped lang="scss">

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
    height: 150px;
    overflow-y: scroll;
    margin-left: -5px;
}


.kw-c{
    --line-interval: 10px;
    --tag-margin: 5px;

    .tags{
        margin: var(--tag-margin);
    }

    .segmentLine{
        width: 100%; 
        height: 0.5px; 
        background-color: #949494; 
        margin-top: calc(var(--line-interval) - var(--tag-margin)); 
        margin-bottom: calc(var(--line-interval) - var(--tag-margin));
    }

    .input{
        margin-bottom: calc(var(--line-interval) - var(--tag-margin));;
    }
}

// .segentLine{
//     width: 100%; 
//     height: 0.5px; 
//     background-color: #949494; 
//     margin-top: 16px; 
//     margin-bottom: 16px;
// }
</style>