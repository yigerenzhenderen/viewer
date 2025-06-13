<template>

  <el-dialog v-model="reminder.show" title="" class="reminder" width="400" :align-center="true" :show-close="false"
    style="padding: 30px; text-align: center; border-radius: 10px;">
    <span style="font-size: 20px; margin-left: auto; color: black;">
      {{ this.reminder.content }}
    </span>
    <template #header style="height: 0px;">
    </template>
    <template #footer>
    </template>
  </el-dialog>

</template>


<script>
import { useGlobalStore } from "../../store/global.js"
import { mapWritableState } from "pinia";

export default {
  data() {
    return {
      previousId: null,
    }
  },
  computed: {
    ...mapWritableState(useGlobalStore, ['reminder']),
  },
  watch: {
    'reminder.show': {
      handler(newState) {
        if (newState) {
          this.previousId = setTimeout(() => {
            this.reminder.show = false;
          }, 2000);
        } else {
          clearTimeout(this.previousId);
        }
      }
    }
  }
}
</script>


<style scoped>
.reminder {
  .el-dialog__header {
    padding-bottom: 0px;
  }

  .el-dialog__footer {
    padding-top: 0px;
  }
}
</style>