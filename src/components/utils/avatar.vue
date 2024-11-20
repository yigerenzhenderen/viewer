<template>
    <div class="avatar" :style="{width: size + 'px', height : size + 'px'}">
        <img :src="url" alt="" style="width: 100%; height: 100%;">
    </div>
</template>


<script>
export default{
    props:{
        url:{
            type:String,
            required:true
        },
        size:{
            type: Number,
            default: 53
        }
    }
}
</script>


<style scoped>
.avatar{
    /* width: 53px;
    height: 53px; */
    border-radius: 50%; /* 将边框半径设置为 50% */
    overflow: hidden; /* 隐藏溢出的部分 */
}
</style>