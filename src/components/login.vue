<template>
    <div id="login" v-if="global.showLogInWindow">
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
            <div style="margin-bottom: 40%;">
                <span style="font-size: 21px;">
                    <strong>手机号登录</strong>
                </span>
            </div>
            <div class="input_phone">

                <div style="display: flex;">
                    <div class="code-button" style="margin-right: 5px;">
                        +86
                    </div>
                    <el-input v-model="phoneNumber" style="max-width: 600px" placeholder="" :maxlength="11">
                    </el-input>
                </div>



                <div style="display: flex; margin-top: 5px;">
                    <el-input v-model="verifyCode" style="max-width: 600px; margin-right: 5px;" :maxlength="6"
                        placeholder="填入验证码">
                    </el-input>

                    <div :class="{ 'code-button': true, 'is_sending': isCounting }"
                        style="cursor: pointer; text-wrap: none;" @click="send_verify_code">
                        {{ buttonText }}
                    </div>
                </div>
            </div>
        </div>
        <div class="close" @click="global.showLogInWindow = false"></div>
        <div v-if="send_fail" class="fail">发送验证码失败</div>
        <div v-if="verify_code_is_incorrect" class="fail">验证码错误</div>
        <div v-if="show_success" class="fail" style="background-color: green;">登录成功 正在跳转</div>
    </div>

</template>

<script setup>
import { ref, computed, onUnmounted, watch, getCurrentInstance } from 'vue';
import { useGlobalStore } from '../store/global';
import fetch from '../js/fetch';

const instance = getCurrentInstance();

const global = useGlobalStore();

const phoneNumber = ref("")
const verifyCode = ref("")

const initialCountdown = 60; // 初始倒计时秒数
const countdown = ref(initialCountdown);
const isCounting = ref(false);
const send_fail = ref(false);
let timer = null;

// 计算属性，用于动态显示按钮文本
const buttonText = computed(() => {
    if (isCounting.value) {
        return `已发送 (${countdown.value}s)`;
    }
    return '发送';
});

const startCountdown = () => {
    isCounting.value = true;
    countdown.value = initialCountdown; // 重置倒计时

    timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            stopCountdown();
        }
    }, 1000);
};

const stopCountdown = () => {
    clearInterval(timer);
    timer = null;
    isCounting.value = false;
    countdown.value = initialCountdown; // 可选：如果希望下次点击时从初始值开始
};

const send_verify_code = async () => {
    if (isCounting.value) return;
    // const res = { code: 200 }
    const res = await fetch.getPhoneVerifyCode(phoneNumber.value);
    if (res.code == 200) {
        startCountdown();
    } else {
        send_fail.value = true;
    }

}

watch(send_fail, (newState) => {
    if (newState) {
        setTimeout(() => {
            send_fail.value = false;
        }, 1000)
    }
})


const verify_code_is_incorrect = ref(false);
const show_success = ref(false);
watch(verifyCode, async (newValue) => {
    if (newValue.length === 6) {
        const res = await fetch.loginByPhoneNumber(phoneNumber.value, newValue);
        if (res.code == 200) {
            show_success.value = true;
            setTimeout(async ()=>{
                await global.loginUpdate(res.data);
                instance.appContext.app.config.globalProperties.$router.push(global.previousUrl); // 跳转到试图访问的页面（上传/用户信息）
                show_success.value = false;
            }, 1500)  
        } else {
            verify_code_is_incorrect.value = true;
            setTimeout(() => {
                verify_code_is_incorrect.value = false
            }, 1500)
        }
    }
})

// 组件卸载时清除定时器，防止内存泄漏
onUnmounted(() => {
    if (timer) {
        clearInterval(timer);
    }
});

</script>

<style lang="scss" scoped>
#login {
    width: 50vw;
    height: 40vh;
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
    z-index: 9999;
    display: flex;
    padding: 20px;

    .close {
        position: absolute;
        right: 0px;
        top: 5px;
        width: 30px;
        height: 30px;
    }

    .close::before {
        background-color: #000;
    }

    ;

    .close::after {
        background-color: #000;
    }

    ;

    .logside {
        flex: 1;
        background-color: white;
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
        justify-content: center;
        position: relative;

        .input_phone {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 80%;
            height: fit-content;

            .code-button {
                width: 5em;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: black;
                color: white;
                border: 1px solid var(--el-border-color);
                // margin-right: 5px;
            }

            .is_sending {
                background-color: gray !important;
                width: 10em !important;
            }

        }
    }
}

.fail {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-color: #000;
    border-radius: 999px;
    color: white;
    width: fit-content;
    height: fit-content;
    padding: 10px;
}

:deep(.el-input-group__prepend) {
    background-color: white !important;
    color: black;
}

:deep(.el-input) {
    --el-input-focus-border-color: #000;
}
</style>
