<template>
  <div style="width: 100%; height: 100%; position: relative;">
    <div style="font-size: 24px; font-weight: bold; margin-top:30px;">
      修改个人资料
    </div>

    <div class="info-container">
      <div class="icon">
        <Avatar :size="300" :url="globalStore.userInfo.avatar"</Avatar>
      </div>
      <div class="info">
        <el-form :disabled="!editing" :model="globalStore.userInfo" label-width="auto" style="max-width: 600px">
          <el-form-item label="真实姓名">
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
          <el-form-item label="用户名">
            <el-input v-model="globalStore.userInfo.wechatNickname" />
          </el-form-item>
          <el-form-item label="微信号">
            <el-input v-model="globalStore.userInfo.wx" />
          </el-form-item>
        </el-form>
        
        <div style="width: 600px; display: flex; margin-top: 30px;">
          <button class="button" style="margin-left: auto;" @click="editingChange">{{ this.editing ? "保存" : "修改个人资料" }}</button>
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

export default{
  data(){
    return {
      editing: false,
    }
  },
  computed:{
    ...mapStores(useGlobalStore)
  },
  components: {
    Avatar
  },
  methods: {
    async editingChange(){
      this.editing =!this.editing;
      if (!this.editing) {
        const res = await this.globalStore.updateInfo()
        // console.log(res)
      }
    }
  },
  mounted() {
  }
}
</script>


<style scoped>
.info-container{
  display: flex;
  margin-top: 100px;
  height: fit-content;
  padding: 50px 100px;

  .icon{
    width: 100%;
    flex: 2;
    display: flex;
    justify-content: center;
  }

  .info{
    flex: 3;
    display: flex;
    flex-direction: column;
  }
}

.button{
  width: 100px;
  height: 40px;
  background-color: #3398FF;
  border: none;
  cursor: pointer;
  color: white;
  font-weight: bolder;
}

</style>