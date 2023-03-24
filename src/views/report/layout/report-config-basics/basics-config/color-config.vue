<template>
  <span
    @click.stop="showColorPicker = !showColorPicker"
  >
    <div
      class="iconStyle"
      :style="{
        background: currentColor,
      }"
    />
    <colorPicker
      v-model="currentColor"
      style="visibility: hidden"
      :style="offsetStyle"
      @change="chooseColor"
      :openStatus="showColorPicker"
    />
  </span>
</template>
<script>
export default {
  name: "columns-config",
  props: ["colorStyle", 'configOptions', 'configKey', 'offset'],
  data() {
    return {
      showColorPicker: false,
      currentColor:"",
    };
  },
  watch: {
    colorStyle: {
      immediate: true,
      handler(val) {
       this.currentColor=val;
      },
    },
  },
  computed: {
    offsetStyle() {
      if (this.offset) {
        return `marginLeft:${this.offset}px`
      }
      return ''
    }
  },
  created(){
    this.currentColor=this.colorStyle
  },
  methods: {
    chooseColor(){
          this.showColorPicker = false
          this.$emit("changeConfigValue",this.configOptions, this.configKey,this.currentColor);
      }
  },
};
</script>
<style lang="scss" scoped>
.iconStyle {
  display: inline-block;
  margin-top: 4px;
  border-radius: 4px;
  width: 26px;
  height: 26px;
  border: 1px solid #E2E2E2;
}
</style>
