<template>
    <div class="u-check-wrapper">
        <div class="u-check" :style="{'box-sizing': 'border-box', 'width': size + 'px', 'height': size + 'px', 'position': 'relative', 'cursor': 'pointer'}">
            <svg v-if="total===selected && total != 0" style="pointer-events: none;" width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="black"/>
                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="white"/>
                <path d="M12 5L6.5 10.5L4 8" stroke="white" stroke-width="1.6666" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="selected" style="pointer-events: none;" width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="black"/>
                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="white"/>
                <path d="M4.5 8H11.5" stroke="white" stroke-width="1.66666" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else style="pointer-events: none;" width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="white"/>
                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#757575"/>
            </svg>
        </div>
        <input type="checkbox" class="i-ch" @change="selectAllChange">
    </div>
</template>


<script>
//         style="margin: 10px; margin-left: 30px;"
export default{
    data(){
        return {
            selectAll: false,
        }
    },
    props:{
        size:{
            type: Number,
            default: 20
        },
        total: {
            type: Number,
            default: 10
        },
        selected: {
            type: Number,
            default: 0
        }
    },
    methods: {
        selectAllChange(){
            this.selectAll =!this.selectAll;
            this.$emit('selectAllChange', !this.selectAll);
        }
    },
}
</script>


<style scoped>

</style>