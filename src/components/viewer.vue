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
          <!-- <span>湖南影像档案馆</span> -->
          <img :src="title" alt="湖南影像档案馆">
        </div>
        <div class="tagcloud">
          <div class="line-right" :style="{opacity: globalStore.tagScrollToRight ? 0 : 1}"></div>
          <div class="line-left" :style="{opacity: globalStore.tagScrollToLeft ? 0 : 1}"></div>
        </div>
        <div class="icons">
          <div class="openbutton" @mouseover="searchHover = true"  @mouseout="searchHover = false">
            <searchIcon :active="searchHover"></searchIcon>
            <span class="text" :style="{color: searchHover ? 'rgb(171, 57, 59)' : 'black', 'opacity': searchHover ? 1 : 0}">搜索</span>
          </div>
          <div class="upload" style="position: relative;" @mouseenter="uploadHover = true"  @mouseout="uploadHover = false">
            <router-link to="/upload" class="link"></router-link>
            <uploadIcon :active="uploadHover" style="pointer-events: none;"></uploadIcon>
            <span class="text" :style="{color: uploadHover ? 'rgb(171, 57, 59)' : 'black', 'opacity': uploadHover ? 1 : 0}">上传</span>
          </div>
          <div class="user" style="position: relative;" @mouseenter="userHover = true"  @mouseout="userHover = false">
            <router-link to="/user/likeListory" class="link"></router-link>
            <userIcon :active="userHover" style="pointer-events: none;"></userIcon>
            <span class="text" style="left: -.5em; text-wrap-mode: nowrap;" :style="{color: userHover ? 'rgb(171, 57, 59)' : 'black', 'opacity': userHover ? 1 : 0}">用户中心</span>
          </div>
        </div>
      </div>

      <div class="viz">
        <div class="overlay">
          <ManiIcon/>
        </div>
      </div>
    </div>
    
    <Reminder />
</div>
</template>



<script>
import { useGlobalStore } from "../store/global.js";
import { useDetailStore } from "../store/detail.js";
import { mapStores } from "pinia";
import InfoView from "./sidebars/info.vue";
import DetailView from "./sidebars/detail.vue";
import ManiIcon from "./utils/mani.vue";
import { init, canvas } from "../js/viz.js";
import fetch from "../js/fetch.js";
import searchIcon from "./icons/searchIcon.vue";
import uploadIcon from "./icons/uploadIcon.vue";
import userIcon from "./icons/userIcon.vue";
import UserIcon from "./icons/userIcon.vue";
import Reminder from "./utils/reminder.vue";
import Title from "../assets/title.svg";

export default{
  data(){
    return {
      uploadHover: false,
      searchHover: false,
      userHover: false,
      title: Title
    }
  },
  computed: {
    ...mapStores(useGlobalStore, useDetailStore)
  },
  components: {
      InfoView,
      DetailView,
      ManiIcon,
      searchIcon,
      uploadIcon,
      userIcon,
      Reminder
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
  },
  watch: {
    '$route.query': {
      handler(newQuery, oldQuery) {
        if(Object.keys(newQuery).length > 0) {
          canvas.emitClickImage(newQuery.id, newQuery.title)
        }else{
          canvas.resetZoom();
          this.detailStore.hide = true;
        }
      },
      deep: true // 如果需要监听深层对象的变化，可以设置为 true
    }
  }
}
</script>


<style scope>

.link{
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
}

.overlay{
  width: 100vw;
  height: 100vh;
  position: absolute;
}

.text{
  position: absolute; 
  top: 2.5em; 
  font-size: 12px;
  opacity: 1;
}

</style>