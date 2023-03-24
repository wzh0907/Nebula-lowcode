<template>
  <div>
    <el-select
      :multiple="config.isSelectMultiple"
      v-model="componentConfig.options[config.key]"
      @change="buttonStyleChanged"
      placeholder="请选择"
    >
      <el-option
        v-for="item in config.typeConfigs"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <span
      v-if="isCustom"
      @click.stop="showBGColorPicker = true"
      @mouseleave="showBGColorPicker = false"
      style="width: 26px;margin-right:10px;"
      title="按钮背景颜色"
    >
      <i
        class="iconfont iconzitiyanse iconStyle"
        :style="{
          color: componentConfig.options.color,
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
      v-if="isCustom"
      @click.stop="showColorPicker = true"
      @mouseleave="showColorPicker = false"
      style="margin-right:10px;"
      title="按钮文字颜色"
    >
      <i
        class="iconfont iconzitiyanse iconStyle"
        style=" vertical-align: top"
        :style="{ color: componentConfig.options.color }"
      />
      <colorPicker
        v-model="componentConfig.options.color"
        style="visibility: hidden"
        @change="showColorPicker = false"
        :openStatus="showColorPicker"
      />
    </span>
  </div>

</template>

<script>
export default {
  name: 'custom-button-style',
  props: {
    componentConfig: {
      type: Object,
      default: () => {},
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isCustom: false,
      showBGColorPicker: false,
      showColorPicker: false,
    }
  },
  methods: {
    buttonStyleChanged(value) {
      if (value == 'custom') {
        this.isCustom = true
      } else {
        this.isCustom = false
      }
    }
  }
}
</script>

<style scoped>
.iconStyle {
  font-size: 26px;
  border: 1px dashed #666666;
}
</style>
