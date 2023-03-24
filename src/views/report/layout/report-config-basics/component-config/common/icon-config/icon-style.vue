<template>
  <div>
    <iconUpload
      :iconSrc="componentConfig.options.icon"
      :configOptions="componentConfig.options"
      configKey="icon"
      @changeConfigValue="changeConfigValue"
      style="display: inline-block"
    >
      <div slot="content" style="font-size: 30px">
        <!-- <van-icon :name="componentConfig.options.icon" /> -->
        <span class="" v-if="componentConfig.options.icon && componentConfig.options.icon.fontClass">
          <i :class="componentConfig.options.icon.fontClass" style="font-size: 28px;" />
        </span>
        <van-icon v-else :name="componentConfig.options.icon" class="" />
      </div>
    </iconUpload>
    <!-- <i
      :class="
        componentConfig.options.iconShow
          ? 'iconfont iconkejian'
          : 'iconfont iconbukejian'
      "
      @click="changeIsShowLabel"
      style="font-size: 30px; vertical-align: top; margin-left: 5px;"
    ></i> -->
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
    return {};
  },
  created() {},
  methods: {
    changeConfigValue(configOptions, configKey, value) {
      configOptions[configKey] = value;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
