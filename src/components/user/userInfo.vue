<template>
  <div style="width: 100%; height: 100%; position: relative;">
    <div style="font-size: 24px; font-weight: bold; margin-top:30px;">
      修改个人资料
    </div>

    <div class="info-container">
      <div class="icon">
        <Avatar :url="globalStore.userInfo.avatar" :size="300"></Avatar>
      </div>
      <div class="info">
        <el-form :model="globalStore.userInfo" label-width="auto" style="max-width: 600px">
          <el-form-item label="真实姓名">
            <el-input v-model="globalStore.userInfo.realName" />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="globalStore.userInfo.phone" />
          </el-form-item>
          <el-form-item label="单位名称">
            <el-input v-model="globalStore.userInfo.danwei" />
          </el-form-item>
          <el-form-item label="电子邮件">
            <el-input v-model="globalStore.userInfo.email" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="globalStore.userInfo.userName" />
          </el-form-item>
          <el-form-item label="微信号">
            <el-input v-model="globalStore.userInfo.wx" />
          </el-form-item>
        </el-form>
        
        <div style="width: 600px; display: flex; margin-top: 30px;">
          <button class="button" style="margin-left: auto;">修改个人资料</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { useGlobalStore } from '../../store/global.js';
import { mapState, mapStores } from 'pinia';
import Avatar from '../utils/avatar.vue';

export default{
  computed:{
    ...mapStores(useGlobalStore)
  },
  components: {
    Avatar
  },
  methods: {
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