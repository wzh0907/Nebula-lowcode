<template>
    <div class="custom_total_form_component">
      <label :style="{width:options.labelAlign=='top'?'100%':options.width+ 'px',
      display:options.labelShow?'':'none',
      textAlign:options.labelAlign=='top'?'left':options.labelAlign,lineHeight:options.size=='large'?'40px':options.size=='small'?'24px':'32px'}"
      >
      {{label}}
      </label>
      <div :style="{marginLeft:(options.labelAlign=='top' || !options.labelShow)?'':options.width+ 'px'}">
        <a-cascader
          v-model="cascadeValue"
          :options="options.optionsData"
          :show-search="{ filter }"
          :placeholder="placeholder"
          :size="options.size"
          :allowClear="options.clearable"
          :disabled="options.disabled"/>
      </div>
    </div>
</template>

<script>
import optionsConfig from './options-config'
export default {
  name: "antdCascadeTemplate",
  components: {

  },
  watch: {
    "options.interfaceDataConfig": {
      deep: true,
      handler(vals) {
        // console.log('cascade options.interfaceDataConfig', vals)
        if(vals.value){
          this.options.value = vals.value;
        }
      },
    },
    "options.interfaceDataEchoConfig": {
      deep: true,
      handler(vals) {
        // console.log('cascade options.interfaceDataEchoConfig', vals)
        if(vals.value){
          this.options.value = vals.value;
        }
      },
    },
    cascadeValue: {
      deep: true,
      handler(val, oldVal) {
        // console.log('cascade cascadeValue', val)
        this.options.value= val.join('/')
      },
    }
  },
  data() {
    return {
      options:optionsConfig
    };
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
    },
    cascadeValue: {
      get() {
        let value = this.options.value
        if(this.options.interfaceDataEchoConfig.uuid&&this.options.interfaceDataEchoConfig.uuid!=''){
          this.options.value=this.options.interfaceDataEchoConfig.value
          value = this.options.interfaceDataEchoConfig.value;
        }
        if (typeof value == "string" && value != undefined && value.length > 0) {
          return value.split('/') || []
        } else {
          return []
        }
      },
      set(val) {
        this.options.interfaceDataEchoConfig.uuid=""
        this.$nextTick(() => {
          this.options.value = val.join('/')
        })
      }
    },
  },
  methods: {
     filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    // onChange(value) {
    //   console.log('cascade onChange');
    //   this.options.value = value.join('/')
    // },
  }
}
</script>

<style lang="scss" scoped>

</style>
