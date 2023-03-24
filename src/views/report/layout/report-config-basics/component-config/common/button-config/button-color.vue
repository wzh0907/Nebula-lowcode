<template>
  <div>
    <span
      @click.stop="showBGColorPicker = true"
      @mouseleave="showBGColorPicker = false"
      style="width: 26px;margin-right:10px;"
      title="按钮背景颜色"
    >
      <i
        class="iconfont iconzitiyanse iconStyle"
        :style="{
          color: componentConfig.options.fontColor,
          background: componentConfig.options.backgroundColor
        }"
      />
      <colorPicker
        v-model="componentConfig.options.backgroundColor"
        style="visibility: hidden"
        @change="showBGColorPicker = false"
        :openStatus="showBGColorPicker"
      />
    </span>
    <!-- <el-color-picker v-model="componentConfig.options.backgroundColor" /> -->
    <span
      @click.stop="showColorPicker = true"
      @mouseleave="showColorPicker = false"
      style="margin-right:10px;"
      title="按钮文字颜色"
    >
      <i
        class="iconfont iconzitiyanse iconStyle"
        style=" vertical-align: top"
        :style="{ color: componentConfig.options.fontColor }"
      />
      <colorPicker
        v-model="componentConfig.options.fontColor"
        style="visibility: hidden"
        @change="showColorPicker = false"
        :openStatus="showColorPicker"
      />
    </span>

    <span
      @click.stop="showActiveColorPicker = true"
      @mouseleave="showActiveColorPicker = false"
      style="margin-right:10px;"
      title="按压背景颜色"
    >
      <i
        class="iconfont iconzitiyanse iconStyle"
        style=" vertical-align: top"
        :style="{
          color: componentConfig.options.activeFontColor,
          background: componentConfig.options.activeColor
        }"
      />
      <colorPicker
        v-model="componentConfig.options.activeColor"
        style="visibility: hidden"
        @change="showActiveColorPicker = false"
        :openStatus="showActiveColorPicker"
      />
    </span>
    <span
      @click.stop="showActiveFontColorPicker = true"
      @mouseleave="showActiveFontColorPicker = false"
      title="按压文字颜色"
    >
      <i
        class="iconfont iconzitiyanse iconStyle"
        style=" vertical-align: top"
        :style="{ color: componentConfig.options.activeFontColor }"
      />
      <colorPicker
        v-model="componentConfig.options.activeFontColor"
        style="visibility: hidden"
        @change="showActiveFontColorPicker = false"
        :openStatus="showActiveFontColorPicker"
      />
    </span>
  </div>
</template>

<script>
export default {
  components: {},
  watch: {},
  props: {
    componentConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showBGColorPicker: false,
      showColorPicker: false,
      showActiveColorPicker: false,
      showActiveFontColorPicker: false
    };
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.iconStyle {
  font-size: 26px;
  border: 1px dashed #666666;
}
</style>
