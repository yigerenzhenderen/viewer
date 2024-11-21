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
        <el-button :disabled="!globalStore.logged" @click="detailStore.editing = true" type="primary" class="editButtion">
          <template #default>
            <span>修订信息</span>
            <img :src="editUrl" alt="" style="height: 100%; width: 100%; margin-top: -1px; margin-left: 10px;">
          </template>
        </el-button>
        <span style="margin-left: auto; margin-top: 10px; font-size: 10px; color: #6D6D6D;">登录后可使用此功能</span>
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
        <editInfo :form-data="detailStore.form" style="max-width: 100%; padding: 20px;"></editInfo>
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

export default {
  data() {
    return {
      editUrl: edit,
    }
  },
  components: { Discussion, Input, editInfo },
  computed: {
    ...mapStores(useDetailStore, useGlobalStore)
  },
  methods: {
    displayPage(page) {
      canvas.changePage(detailStore.id, page)
    },
    hasData(_entry) {
      return this.getContent(_entry) !== ''
    },
    getContent(_entry) {
      if (_entry.type === 'text') {
        return detailStore.item[_entry.source]
      }
      if (_entry.type === 'array') {
        return detailStore.item[_entry.source].join(', ')
      }
      if (_entry.type === 'keywords') {
        return detailStore.item[_entry.source].join(', ')
      }
      if (_entry.type === 'markdown') {
        return marked(detailStore.item[_entry.source], { breaks: true })
      }
      if (_entry.type === 'function') {
        const column = detailStore.item;
        const func = _entry.source
        try {
          return eval(func)
        } catch (e) {
          return 'Error'
        }
      }
    },
    submit(){

    }
  },
  mounted() {
    // console.log(this.item, this.detailStore.detail_test, 'hahahahhah')
  },
  watch:{
    // detailStore: {
    //   deep: true,
    //   handler(newVal, oldVal) {
    //     console.log('detailStore changed', newVal.form)
    //   }
    // }
  }
}

</script>



<style scoped>
#detail{
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

:deep(.el-button--primary){
  --el-button-disabled-bg-color: #DCDCDC;
  --el-button-disabled-text-color: #272727
}
</style>