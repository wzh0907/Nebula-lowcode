<template>
  <div class="custom_total_form_component" style="height:32px">
    <label
      :style="{
        display:options.labelShow?'':'none',
        width:options.labelAlign=='top'?'100%':options.width+ 'px',textAlign:options.labelAlign=='top'?'left':options.labelAlign,
        lineHeight:options.size=='large'?'40px':options.size=='small'?'24px':'32px'
      }"
    >
      {{ label }}
    </label>
    <div :style="{marginLeft:(options.labelAlign=='top' || !options.labelShow)?'':options.width+ 'px'}">
      <a-slider
        :step="options.step"
        :vertical="options.vertical"
        :min="options.min"
        :max="options.max"
        :default-value="options.value"
        :style="{height: options.vertical ? '200px' : '',width: options.vertical ? '' : '-webkit-fill-available', display: 'inline-block'}"
        :disabled="options.disabled"
      />
    </div>
  </div>
</template>

<script>
  import optionsConfig from './options-config'
  export default {
    name: 'AntdSliderTemplate',
    components: {

    },
    data() {
      return {
        options: optionsConfig
      }
    },
    computed: {
      label() {
        let language = navigator.language.substr(0, 2)
        if (language == 'zh') {
          return this.options.label || this.options.enLabel
        } else {
          return this.options.enLabel || this.options.label
        }
      }
    }
  }
</script>

<style  scoped lang="scss">
.ant-slider{
  margin: 10px 6px 12px;
}
</style>
