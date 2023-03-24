<template>
  <div class="input-template-page">
    <label v-if="options.labelAlign=='top'"
      :style="{
      fontSize: '14px',
      fontWeight: 'normal',
            display:options.labelShow?'':'none',
            width:options.labelAlign=='top'?'100%':options.width+ 'px',
          }"
    >
      {{label}}
    </label>
    <van-field
          v-model="options.value"
          :style="{display: options.labelAlign === 'top' ? 'block' : ''}"
          :class="[options.labelShow ? '' : 'make_custom_label_title']"
          :label="options.labelAlign=='top' ? '' : label"
          :label-width="options.labelWidth"
          :input-align="options.valueAlign"
          :name="options.databaseField"
          :type="options.inputType"
          :placeholder="placeholder"
          :maxlength="options.maxlength"
          :required="options.required"
          :labelAlign="options.labelAlign"
          :clearable="options.clearable"
          :right-icon="options.qrscan ? 'scan' : ''"
          @input="getFieldValue"
          :rules="[{
            required: options.required,
            message:
              (
                (options.validatorTypeFunc && options.funcMsg) ||
                (options.validatorTypeReg && options.regMsg)
              ) || (options.requiredMsg || '请输入' + label)
            ,
            validator: (options.validatorTypeFunc || options.validatorTypeReg) ? options.validator : ''
          }]"
        />
  </div>
</template>

<script>
import optionsConfig from './options-config'

export default {
  name: "tabsTemplate",
  components: {
  },
  data() {
    return {
      options: optionsConfig
    };
  },
  watch: {
    "options.interfaceDataConfig": {
      deep: true,
      handler(vals) {
        if(vals.value){
          this.options.value = vals.value;
        }
      },
    },
  },
  created() {},
  mounted() {

  },
  computed: {
    placeholder() {
      let language = navigator.language.substr(0, 2)
      if (language == 'zh') {
        return this.options.placeholder || this.options.enPlaceHolder
      } else {
        return this.options.enPlaceHolder || this.options.placeholder
      }
    },
    label() {
      let language = navigator.language.substr(0, 2)
      if (language == 'zh') {
        return this.options.label || this.options.enLabel
      } else {
        return this.options.enLabel || this.options.label
      }
    }
  },
  beforeDestroy(){
    window.removeEventListener(`${this.options.generateComponentsUUID}-on-preload-handle-btn-search`, this.getFieldValue)
  },
  methods: {
    getFieldValue(){
      if (this.options.searchData) {
        if (!this.options.generateComponentsUUID) return false
          let eventHandle = new CustomEvent(`${this.options.generateComponentsUUID}-on-preload-handle-btn-search`, {
            detail: {
              // eventType: eventItem.eventType,
              data: this.options
            }
          })
          window.dispatchEvent(eventHandle)
      }
    }

  },
};
</script>

<style lang="scss" scoped>
/deep/.van-cell {
  background-color: transparent;
  padding: 0;
  height: 32px;
  line-height: 32px;
}
</style>
