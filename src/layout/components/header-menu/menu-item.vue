<template>
  <el-menu-item :index="menu.path || uniqueId" class="side-menu-item">
    <i v-if="menu.icon" :class="menu.icon"></i>
    <span class="title" slot="title">{{ menu.title || "未命名菜单" }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: "menu-item",
  props: {
    menu: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      uniqueId: _.uniqueId("menu-empty-"),
    };
  },
};
</script>

<style scoped lang="scss">
.side-menu-item {
  padding-left: 16px;
  font-size: 16px;
}
</style>
