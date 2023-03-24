<template>
  <nav class="header-menu__nav" >
    <div class="header-menu__content" ref="content">
      <span class="header-titile">我的工作台</span>
    </div>
    <!-- <div v-if="isScroll" class="header-menu__prev" @click="scroll('left')">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div v-if="isScroll" class="header-menu__next" @click="scroll('right')">
      <i class="el-icon-arrow-right"></i>
    </div> -->
    <HeaderUser />
  </nav>
</template>

<script>
import HeaderUser from "../header-user";
export default {
  name: "header-menu",
    components: { HeaderUser },
  data() {
    return {
    };
  },
  computed: {
  },
  created(){
  },
  methods: {
    
  },
};
</script>

<style scoped lang="scss">
/deep/.el-menu {
  background-color: inherit;
}
/deep/.el-menu-item {
  // padding: 0px 40px;
  margin: 0px 20px;
}
/deep/.el-menu--horizontal > .el-menu-item {
  display: inline-block;
  // float: initial;
  height: 50px;
  line-height: 50px;
  // color: #fff;
  font-size: 16px;
  padding: 0 5px;
  &:hover {
    background-color: inherit;
    // color: #fff;
  }
  // &:focus {
  //   background-color: inherit;
  // }
}
/deep/.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 2px solid rgba(9, 98, 234, 1);
  color:rgba(9, 98, 234, 1);
  
}
.header-menu__nav {
  margin: 0px 40px;
  height: 50px;
  line-height: 50px;
}
.header-menu__more {
  position: absolute;
  top: 0;
  right: 0;
  .el-dropdown-link {
    color: #fff;
    cursor: pointer;
  }
}
.header-titile{
  font-size: 16px;
  font-weight: bold;
}
</style>
