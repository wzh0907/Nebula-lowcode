<template>
  <div class="custom-button-content">
    <a-button @click="primaryHandler" class="pattern-button" type="primary"
      >主按钮</a-button
    >
    <a-button @click="defaultHandler" class="pattern-button">辅按钮</a-button>
    <a-button @click="linkHandler" class="pattern-button" type="link"
      >链接按钮</a-button
    >
  </div>
</template>

<script>
export default {
  name: "custom-button-content",
  props: {
    componentConfig: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    primaryHandler() {
      this.componentConfig.options.backgroundColor = "#1890ff";
      this.componentConfig.options.fontColor = '#fff'
      this.componentConfig.options.commonConfig.borderStyle = {}
    },
    defaultHandler() {
      this.componentConfig.options.backgroundColor = "#fff";
      this.componentConfig.options.fontColor = '#666'

      this.componentConfig.options.commonConfig.borderStyle.topDirveColor = '#d9d9d9'
      this.componentConfig.options.commonConfig.borderStyle.topSize = '1'
      this.componentConfig.options.commonConfig.borderStyle.topDirveType = 'solid'

      this.componentConfig.options.commonConfig.borderStyle.rightDirveColor = '#d9d9d9'
      this.componentConfig.options.commonConfig.borderStyle.rightSize = '1'
      this.componentConfig.options.commonConfig.borderStyle.rightDirveType = 'solid'

      this.componentConfig.options.commonConfig.borderStyle.bottomDirveColor = '#d9d9d9'
      this.componentConfig.options.commonConfig.borderStyle.bottomSize = '1'
      this.componentConfig.options.commonConfig.borderStyle.bottomDirveType = 'solid'

      this.componentConfig.options.commonConfig.borderStyle.leftDirveColor = '#d9d9d9'
      this.componentConfig.options.commonConfig.borderStyle.leftSize = '1'
      this.componentConfig.options.commonConfig.borderStyle.leftDirveType = 'solid'
    },
    linkHandler() {
      this.componentConfig.options.backgroundColor = "transparent";
      this.componentConfig.options.fontColor = '#1890ff'
      this.componentConfig.options.commonConfig.borderStyle = {}
    },
  },
};
</script>

<style>
.pattern-button {
  margin: 0 8px;
}
</style>
