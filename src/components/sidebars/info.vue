<template>
  <div class="infobar" :class="{sneak: infoStore.sneak}">
      <div class="infobutton" @click="infoStore.sneak = !infoStore.sneak;">
        <svg width="16px" height="24px" viewBox="0 0 16 24">
          <path d="M13.6824546,2 L3.7109392,11.9715154 L13.7394238,22" sseartroke="#FFF" stroke-width="5"></path>
        </svg>
      </div>

      <div class="outer">
        <div class="inner">
            <div id="infobar" class="infosidebar">
            <span v-html="marked(infoStore.info)" style="word-break: normal; white-space: pre-wrap;"></span>
            <!-- <div class="credit">
                Powered by
                <a href="https://vikusviewer.fh-potsdam.de/" target="_blank">VIKUS Viewer</a>
            </div> -->
        </div>
        </div>
      </div>
  </div>
</template>


<script>
import { useInfoStore } from '../../store/info.js';
import { mapState, mapStores } from 'pinia';

export default{
  computed:{
    ...mapStores(useInfoStore)
  },
  methods: {
    marked: function (input) {
      return marked(input);
    }
  },
  mounted() {
  }
}
</script>


<style>

</style>