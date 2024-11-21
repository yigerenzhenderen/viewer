<template>
  <div class="sidebar detail" :class="{ hide: detailStore.hide, sneak: detailStore.sneak  }">
    <div class="slidebutton" @click="detailStore.hide = !detailStore.hide"></div>

    <div class="outer">
      <div id="detail" class="inner" >
          <div class="entries" v-if="detailStore.item">
              <div v-if="detailStore.item._imagenum > 1" class="entry wide pages">
                  <div class="label">Seite</div>
                  <div class="content">
                  <span v-for="i in parseInt(detailStore.item._imagenum)" v-bind:key="i" v-on:click="displayPage(i-1)"
                      v-bind:class="{ active: i === page+1, keyword: true }">
                      {{ i }}
                  </span>
                  </div>
              </div>
              <div v-for="entry in detailStore.structure" v-bind:key="entry.name" v-bind:class="entry.display" class="entry">
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
      </div>
      <!-- <div class="inner">
        <div></div>
      </div> -->
      <div class="inner">
        <Discussion />
        <Input />
      </div>
    </div>
  </div>

</template>


<script>
import { useDetailStore } from '../../store/detail';
import { mapState, mapStores } from 'pinia';
import Discussion from "./discuss.vue";
import Input from "./input.vue";

export default {
  components: {Discussion, Input},
  computed:{
    ...mapStores(useDetailStore)
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
    }
  },
  mounted() {
    // console.log(this.item, this.detailStore.detail_test, 'hahahahhah')
  }
}

</script>



<style>

</style>