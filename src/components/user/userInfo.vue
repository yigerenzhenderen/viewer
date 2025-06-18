<template>
  <div style="width: 100%; height: 100%; position: relative;">
    <div style="font-size: 24px; font-weight: bold; margin-top:30px;">
      修改个人资料
    </div>

    <div class="info-container">
      <div class="icon" @mouseenter="show_avatar_overlay = true" @mouseleave="show_avatar_overlay = false;">
        <Avatar :size="300" :url="globalStore.userInfo.memberImgurl"></Avatar>
        <div v-if="show_avatar_overlay" class="avatar_overlay" @click="change_avatar">
          点击修改头像
        </div>
        <input ref="uploader" type="file" id="fileInput" style="display:none" accept="image/*">
      </div>
      <div class="info">
        <el-form :disabled="!editing" :model="globalStore.userInfo" label-width="auto" style="max-width: 600px">
          <el-form-item label="用户名">
            <el-input v-model="globalStore.userInfo.memberName" />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="globalStore.userInfo.memberPhone" />
          </el-form-item>
          <el-form-item label="单位名称">
            <el-input v-model="globalStore.userInfo.danwei" />
          </el-form-item>
          <el-form-item label="电子邮件">
            <el-input v-model="globalStore.userInfo.memberEmail" />
          </el-form-item>
          <el-form-item label="微信名">
            <el-input v-model="globalStore.userInfo.wechatNickname" />
          </el-form-item>
          <!-- <el-form-item label="微信号">
            <el-input v-model="globalStore.userInfo.wx" />
          </el-form-item> -->
        </el-form>

        <div style="width: 600px; display: flex; margin-top: 30px;">
          <button class="button" style="margin-left: auto;" @click="editingChange">{{ this.editing ? "保存" : "修改个人资料"
          }}</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { useGlobalStore } from '../../store/global.js';
import { mapState, mapStores } from 'pinia';
import Avatar from '../utils/avatar.vue';
import fetch from '../../js/fetch.js'

export default {
  data() {
    return {
      editing: false,
      show_avatar_overlay: false,
    }
  },
  computed: {
    ...mapStores(useGlobalStore)
  },
  components: {
    Avatar
  },
  methods: {
    async editingChange() {
      this.editing = !this.editing;
      if (!this.editing) {
        const res = await fetch.editUserInfo(this.globalStore.userInfo);
      }
    },
    change_avatar() {
      this.$refs['uploader'].click();
    }
  },
  mounted() {
    this.$refs['uploader'].addEventListener('change', () => {
      const file = this.$refs['uploader'].files[0];
      if (!file) return;

      // 只允许图片类型
      if(!file.type.startsWith('image/')) {
        result.textContent = "请选择图片文件！";
        return;
      }

      // 构建formdata上传给后端
      console.log("上传给后端了")
      // const formData = new FormData();
      // formData.append('image', file);

      // result.textContent = "正在上传并检测，请稍候...";

      // fetch('/uploadImage', {
      //   method: 'POST',
      //   body: formData
      // })
      // .then(resp => resp.json())
      // .then(data => {
      //   // 根据后端返回自行调整
      //   result.textContent = "检测结果: " + JSON.stringify(data);
      // })
      // .catch(err => {
      //   result.textContent = "上传或检测失败：" + err;
      // });
    });
  }
}
</script>


<style scoped lang="scss">
.info-container {
  display: flex;
  margin-top: 100px;
  height: fit-content;
  padding: 50px 100px;

  .icon {
    width: 100%;
    flex: 2;
    display: flex;
    justify-content: center;
    position: relative;
    border-radius: 999px;
    cursor: pointer;
  }

  .info {
    flex: 3;
    display: flex;
    flex-direction: column;
  }
}


.avatar_overlay {
  width: 300px;
  height: 300px;
  background-color: black;
  opacity: 0.5;
  position: absolute;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.button {
  width: 100px;
  height: 40px;
  background-color: #3398FF;
  border: none;
  cursor: pointer;
  color: white;
  font-weight: bolder;
}
</style>