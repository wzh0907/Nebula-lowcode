<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link key="collapse" class="sidebar-logo-link" to="/">
        <img :src="logo" class="sidebar-logo">
        <h1 v-if="!simple" class="sidebar-title">{{ title }} </h1>
      </router-link>
      <!-- <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link> -->
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    simple: {
      type: Boolean,
      required: false
    }
    // collapse: {
    //   type: Boolean,
    //   required: true
    // }
  },
  data() {
    return {
      title: '星云座工作台',
      logo: require('@/assets/images/logo_d.png')
    }
  },
  mounted() {
    var integrityurl = window.location.href
    if (integrityurl.indexOf('sigmadata.cn') > -1) {
      this.logo = require('@/assets/images/logo_s.png')
      this.title = 'Sigma'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  // width: 100%;
  height: 50px;
  margin-left: 10px;
  line-height: 50px;
  // background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      // width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 10px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      // color: #0a1220a3;
      font-weight: 600;
      line-height: 50px;
      font-size: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      // color: #fff;
    }
  }

  // &.collapse {
  //   .sidebar-logo {
  //     margin-right: 0px;
  //   }
  // }
}
</style>
