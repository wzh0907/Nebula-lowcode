<template>
  <div>
    <iconUpload
      isShowLineEntityIcon
      :iconSrc="componentConfig.options.icon"
      :configOptions="componentConfig.options"
      configKey="icon"
      @changeConfigValue="changeConfigValue"
      style="display: inline-block"
    >
      <div slot="content" style="font-size: 30px">
        <span
          class=""
          v-if="
            componentConfig.options.icon &&
            componentConfig.options.icon.fontClass
          "
        >
          <i
            :class="componentConfig.options.icon.fontClass"
            style="font-size: 28px"
          />
        </span>
        <van-icon v-else :name="componentConfig.options.icon" class="" />
      </div>
    </iconUpload>
    <span
      @click.stop="showColorPicker = true"
      @mouseleave="showColorPicker = false"
      style="width: 26px"
    >
      <div
        class="iconStyle"
        :style="{
          background: componentConfig.options.color,
        }"
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
import iconUpload from "@/views/report/layout/report-config-basics/basics-config/icon-upload.vue";
export default {
  components: {
    iconUpload,
  },
  watch: {},
  props: {
    componentConfig: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showColorPicker: false
    };
  },
  created() {},
  methods: {
    changeConfigValue(configOptions, configKey, value) {
      configOptions[configKey] = value;
    },
  },
};
</script>

<style lang="scss" scoped>
.iconStyle {
  display: inline-block;
  border-radius: 4px;
  width: 26px;
  height: 26px;
}
</style>
