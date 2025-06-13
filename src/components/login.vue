<template>
    <div id="login">
        <div class="logside wechat">
            <div>
                <span style="font-size: 21px;">
                    <strong>使用微信扫一扫登录</strong>
                </span>
                <div style="height: 20px;"></div>
                <span style="font-size: 15px;">
                    「湖南影像档案馆」
                </span>
            </div>
            <div class="qrcode">
                <div style="background-color: black; width: 150px; height: 150px; "></div>
                <!-- <img src="" alt=""> -->
            </div>
        </div>
        <div style="width: 1.5px; background-color: black; border-radius: 1px;"></div>
        <div class="logside phone">
            <div>
                <span style="font-size: 21px;">
                    <strong>手机号登录</strong>
                </span>
            </div>
            <div class="input_phone">
                
                <el-input v-model="phoneNumber" style="max-width: 600px" placeholder="">
                    <template #prepend>
                        <span style="width: 2rem;">+86</span>
                    </template>
                </el-input>

                <el-input
                    v-model="verifyCode"
                    style="max-width: 600px"
                    placeholder=""
                    class="input-with-select"
                >
                <!-- <template #prepend>
                    <span style="width: 2rem;">验证码</span>
                </template> -->
                <template #append>
                    <el-select v-model="select" placeholder="Select" style="width: 115px">
                        <el-option label="Restaurant" value="1" />

                    </el-select>
                </template>
                </el-input>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, watchEffect } from 'vue';

const phoneNumber = ref("")
const verifyCode = ref("")

// watchEffect

</script>

<style lang="scss" scoped>
#login {
    width: 50vw;
    height: 50vh;
    min-height: 400px;
    background-color: white;
    border: 2px black solid;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 0;
    z-index: 100;
    display: flex;
    padding: 20px;

    .logside {
        flex: 1;
        background-color: antiquewhite;
        // margin: 5%;
        box-sizing: border-box;
        width: 0px;
        // height: 95%;
    }

    .wechat {
        text-align: center;
        display: flex;
        flex-direction: column;

        .qrcode {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        }
    }

    .phone {
        display: flex;
        flex-direction: column;
        
        .input_phone{
            width: 80%;
        }
    }
}

:deep(.el-input-group__prepend){
    background-color: white  !important;
    color: black;
}

:deep(.el-input) {
    --el-input-focus-border-color: #000;
}
</style>
