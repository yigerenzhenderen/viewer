<template>
  <div class="sidebar detail" :class="{ hide: detailStore.hide, sneak: detailStore.sneak }">
    <div class="slidebutton" @click="detailStore.hide = !detailStore.hide"></div>

    <div v-if="!detailStore.editing" class="outer">
      <div id="detail" class="inner">
        <div class="entries" v-if="detailStore.item">
          <div v-if="detailStore.item._imagenum > 1" class="entry wide pages">
            <div class="label">Seite</div>
            <div class="content">
              <span v-for="i in parseInt(detailStore.item._imagenum)" v-bind:key="i" v-on:click="displayPage(i - 1)"
                v-bind:class="{ active: i === page + 1, keyword: true }">
                {{ i }}
              </span>
            </div>
          </div>
          <div v-for="entry in detailStore.structure" v-bind:key="entry.name" v-bind:class="entry.display"
            class="entry">
            <div v-if="entry.name" class="label">{{ entry.name }}</div>
            <div class="content">
              <span v-if="entry.type === 'keywords'">
                <span v-for="keyword in item[entry.source]" v-bind:key="keyword" class="keyword">
                  {{ keyword }}
                </span>
              </span>
              <span v-else-if="entry.type === 'link'">
                <a :href="item[entry.source]" target="_blank">Link</a>
              </span>
              <span v-else-if="entry.type === 'markdown'">
                <span v-html="getContent(entry)"></span>
              </span>
              <span v-else-if="entry.type === 'function'">
                <span v-html="getContent(entry)"></span>
              </span>
              <span v-else>
                {{ getContent(entry) }}
              </span>
            </div>
          </div>
        </div>
        <el-button :disabled="!globalStore.logged" @click="detailStore.editing = true" type="primary"
          class="editButtion">
          <template #default>
            <span>修订信息</span>
            <img :src="editUrl" alt="" style="height: 100%; width: 100%; margin-top: -1px; margin-left: 10px;">
          </template>
        </el-button>
        <span v-if="!globalStore.logged"
          style="margin-left: auto; margin-top: 10px; font-size: 10px; color: #6D6D6D;">登录后可使用此功能</span>
      </div>
      <div class="inner">
        <Discussion />
        <Input />
      </div>
    </div>
    <div v-else class="outer" style="background-color: white;">
      <div class="inner">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 24px; color: #000000; cursor: default;">
            修订信息
          </div>
          <div class="submit" style="margin: 0; width: 146px;" @click="submit">提交</div>
        </div>
        <editInfo v-model:form-data="detailStore.form" style="max-width: 100%; padding: 20px;"></editInfo>
      </div>
    </div>
  </div>

</template>


<script>
import { useDetailStore } from '../../store/detail';
import { useGlobalStore } from '../../store/global';
import { mapState, mapStores } from 'pinia';
import Discussion from "./discuss.vue";
import Input from "./input.vue";
import edit from "/src/assets/edit.svg";
import editInfo from '../utils/editInfo.vue';
import fetch from '../../js/fetch';
import { toRaw } from 'vue';

export default {
  data() {
    return {
      editUrl: edit
    }
  },
  components: { Discussion, Input, editInfo },
  computed: {
    ...mapStores(useDetailStore, useGlobalStore),
    ...mapState(useDetailStore, ['form']),
    hide() {
      return this.detailStore.hide;
    }
  },
  methods: {
    displayPage(page) {
      canvas.changePage(this.detailStore.id, page)
    },
    hasData(_entry) {
      return this.getContent(_entry) !== ''
    },
    getContent(_entry) {
      if (_entry.type === 'text') {
        return this.detailStore.item[_entry.source]
      }
      if (_entry.type === 'array') {
        return this.detailStore.item[_entry.source].join(', ')
      }
      if (_entry.type === 'keywords') {
        return this.detailStore.item[_entry.source].join(', ')
      }
      if (_entry.type === 'markdown') {
        return marked(this.detailStore.item[_entry.source], { breaks: true })
      }
      if (_entry.type === 'function') {
        const column = this.detailStore.item;
        const func = _entry.source
        try {
          return eval(func)
        } catch (e) {
          return 'Error'
        }
      }
    },
    getModifiedFields(currentData, initialData) {
      const modifiedFields = {};
      for (const key in currentData) {
        // 比较当前数据与初始数据
        if (currentData[key] !== initialData[key]) {
          modifiedFields[key] = currentData[key];
        }
      }
      return modifiedFields;
    },
    async submit() {
      const newData = {
        newEntryimgName: this.detailStore.form.name,
        newEntryimgTime: this.detailStore.form.shotTime,
        newSubmitimgPosition: this.detailStore.form.place,
        newSubmitimgNewintro: this.detailStore.form.desc,
        newSubmitimgNewholder: this.detailStore.form.shoter,
      }
      const oldData = {
        newEntryimgName: this.detailStore.storeForm.name,
        newEntryimgTime: this.detailStore.storeForm.shotTime,
        newSubmitimgPosition: this.detailStore.storeForm.place,
        newSubmitimgNewintro: this.detailStore.storeForm.desc,
        newSubmitimgNewholder: this.detailStore.storeForm.shoter,
      }
      const oldKws = this.detailStore.storeForm.kws.map(d=>d.id).join(',');
      const newKws = this.detailStore.form.kws.map(d=>d.id).join(',');
      // console.log(oldKws, newKws)
      const diff = this.getModifiedFields(newData, oldData);
      const flagDict = {
        newEntryimgName: "entryimgNameFlag",
        newEntryimgTime: "entryimgTimeFlag",
        newSubmitimgPosition: "entryimgPositionFlag",
        newSubmitimgNewintro: "submitimgNewintroFlag",
        newSubmitimgNewholder: "submitimgNewholderFlag",
      }
      for (let i in diff) {
        diff[flagDict[i]] = 1;
      }
      if ((Object.keys(diff).length == 0) && (oldKws === newKws)) {
        this.detailStore.editing = false;
        return;
      }
      diff.memberId = this.globalStore.userInfo.memberId;
      diff.imgentryId = this.detailStore.storeForm.id;
      const res1 = await fetch.addRevisionLog(diff);
      if(oldKws !== newKws){
        // console.log(newKws)
        var res2 = await fetch.addTagRevision(this.globalStore.userInfo.memberId, this.detailStore.imageId, newKws)
      }
      console.log(res1, res2)
      this.popup();
    },
    popup() {
      this.detailStore.editing = false;
    }
  },
  mounted() {
    // console.log(this.item, this.detailStore.detail_test, 'hahahahhah')
  },
  watch: {
    async hide(bool) {
      if (bool) return;
      const newImg = await fetch.getImg(this.detailStore.imageId);
      console.log("newImg", newImg)
      this.detailStore.currentImg = newImg;
      this.detailStore.form = Object.assign({}, this.detailStore.storeForm);
    },

  }
}

</script>



<style scoped>
#detail {
  display: flex;
  flex-direction: column;
}

.editButtion {
  background-color: #DCDCDC;
  color: #272727;
  font-size: 16px;
  border: none !important;
  padding: 5px 10px !important;
  margin-left: auto;
  width: 114px;
  height: 34px;
}

.editButtion:hover {
  background-color: #DCDCDC;
  color: #272727;
  border: none !important;
}

:deep(.el-button--primary) {
  --el-button-disabled-bg-color: #DCDCDC;
  --el-button-disabled-text-color: #272727
}
</style>