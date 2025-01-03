<template>

<div id="viewer">
    <div id="hiddenreload"></div>

    <div class="browserInfo">
      <p>
        This visualization is not optimized for mobile phones and needs WebGL
        enabled.
      </p>
      <p>Please come back on a Computer.</p>
      <span>💡</span>
    </div>

    <div class="search"></div>
    
    <div class="page">
      <div class="detailLoader"></div>
      <div class="sideLoader"></div>


      <DetailView />

      <div class="navi">
      </div>


      <InfoView />
      
      <div class="searchbar">
        <input type="input" name="suche" />
        <!-- <div class="close"></div> -->
      </div>

      <div class="header">
        <div class="title">
          <span>湖南影像档案馆</span>
        </div>
        <div class="tagcloud">
          <div class="line-right" :style="{opacity: globalStore.tagScrollToRight ? 0 : 1}"></div>
          <div class="line-left" :style="{opacity: globalStore.tagScrollToLeft ? 0 : 1}"></div>
        </div>
        <div class="icons">
          <div class="openbutton"></div>
          <div class="upload">
            <router-link to="/upload" class="link"></router-link>
          </div>
          <div class="user">
            <router-link to="/user/info" class="link"></router-link>
          </div>
        </div>
      </div>

      <div class="viz">
        <div class="overlay">
          <ManiIcon/>
        </div>
      </div>
    </div>
  
</div>
</template>



<script>
import { useGlobalStore } from "../store/global.js";
import { mapStores } from "pinia";
import InfoView from "./sidebars/info.vue";
import DetailView from "./sidebars/detail.vue";
import ManiIcon from "./utils/mani.vue";
import { init } from "../js/viz.js";
import fetch from "../js/fetch.js";

export default{
    computed: {
      ...mapStores(useGlobalStore)
    },
    components: {
        InfoView,
        DetailView,
        ManiIcon
    },
    async mounted(){
      d3.select("body").style("background-color", "var(--bg-color)");
      this.globalStore.urlSearchParams = this.$route.query;
      if (Modernizr.webgl && !utils.isMobile()) {
        const tags = await fetch.getTagList();
        this.globalStore.tagList = tags.data.map(d=>{return {
          id: d.tagsId,
          label: d.tagsTitle,
          value: d.tagsTitle,
          choose: false,
          show: true,
        }})
        init(); 
      }

    }
}
</script>


<style scope>
.link{
  width: 100%;
  height: 100%;
  opacity: 0;
  display: block;
}

.overlay{
  width: 100vw;
  height: 100vh;
  position: absolute;
}
</style>