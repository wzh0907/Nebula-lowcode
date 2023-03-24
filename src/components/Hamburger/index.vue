<template>
  <div class="hamburger-container">
    <svg
      :class="{'is-active':isActive}"
      class="hamburger"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
       @click="toggleClick"
    >
      <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z" />
    </svg>
    <span class="project-name" :class="{'is-active': !isActive}">{{ projectName }}</span>
      <i class="iconfont iconPC- project-icon" style="font-size:22px;margin-top:-7px" title="门户" v-if="projectType=='PC'" @click="todoor"/>
      <i class="iconfont iconshouji project-icon" style="font-size:22px;margin-top:-7px" v-else-if="projectType=='MOBILE'"  @click="todoor"/>
    <i class="iconfont iconset project-icon" style="font-size:22px;margin-top:-8px" @click="handleNodeClick"/>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    projectName: {
      type: String,
      default: ''
    },
    projectType: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    },
    todoor(){
      var integrityurl = window.location.href;
      if(integrityurl.indexOf('sigmadata.cn')>-1){
          window.open('https://pc.sigmadata.cn/', '_blank');
      }else{
         window.open('https://pc.dipaas.com/', '_blank');
      }
    },
    tomdoor(){
       var integrityurl = window.location.href;
      if(integrityurl.indexOf('sigmadata.cn')>-1){
          window.open('https://m.sigmadata.cn/', '_blank');
      }else{
         window.open('https://m.dipaas.com/', '_blank');
      }
    },
    handleNodeClick() {
        this.$emit('changeDataType', "project")
    },
  }
}
</script>

<style scoped>
.hamburger-container {
  padding-left: 10px;
  cursor: pointer;
}
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
.project-name {
  /* float: right; */
  margin-left: 10px;
  text-align: center;
}
.project-icon{
  float: right;
}
.project-name.is-active {
  margin-top: 10px;
}
</style>
