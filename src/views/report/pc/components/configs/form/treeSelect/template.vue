<template>
    <div class="custom_total_form_component">
      <label :style="{width:options.labelAlign=='top'?'100%':options.width+ 'px',
      display:options.labelShow?'':'none',
      textAlign:options.labelAlign=='top'?'left':options.labelAlign,lineHeight:options.size=='large'?'40px':options.size=='small'?'24px':'32px'}"
      >
      {{label}}
      </label>
      <div :style="{marginLeft:(options.labelAlign=='top' || !options.labelShow)?'':options.width+ 'px'}">
        <a-tree-select
          v-model="treeValue"
          style="width: 100%"
          :multiple="options.multiple"
          :tree-data="options.treeData"
          :placeholder="placeholder"
          :size="options.size"
          :allowClear="options.clearable"
          :dropdownStyle="dropdownStyle"
          :disabled="options.disabled"/>
      </div>
    </div>
</template>

<script>
import optionsConfig from './options-config'
export default {
  name: "antdTreeSelectTemplate",
  components: {

  },
  watch: {
    "options.interfaceDataConfig": {
      deep: true,
      handler(val) {
        // console.log('cascade options.interfaceDataConfig', vals)
        if(val.value){
          this.options.value = val.value;
        }
      },
    },
    "options.interfaceDataEchoConfig": {
      deep: true,
      handler(val) {
        // console.log('cascade options.interfaceDataEchoConfig', vals)
        if(val.value){
          this.options.value = val.value;
        }
      },
    },
    treeValue: {
      deep: true,
      handler(val) {
        console.log('treeValue=', val);
      },
    },
  },
  data() {
    return {
      options:optionsConfig,
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
    treeValue: {
      get() {
        let value = this.options.value
        if(this.options.interfaceDataEchoConfig.uuid&&this.options.interfaceDataEchoConfig.uuid!=''){
          this.options.value=this.options.interfaceDataEchoConfig.value
          value = this.options.interfaceDataEchoConfig.value;
        }
        if (this.options.multiple) {
          if (typeof value == "string" && value != undefined && value.length > 0) {
            return value.split('/')
          } else {
            return []
          }
        } else {
          return value
        }
      },
      set(val) {
        this.options.interfaceDataEchoConfig.uuid=""
        console.log('treeValue111=', val);
        this.$nextTick(() => {
          if (this.options.multiple) {
            this.options.value = val.join('/')
          } else {
            this.options.value = val
          }
        })
      }
    },
    dropdownStyle() {
      return {
        "maxHeight" : "300px"
      }
    }
  },
  methods: {
    // onChange(value) {
    //   console.log('cascade onChange');
    //   this.options.value = value.join('/')
    // },
  }
}
</script>

<style lang="scss" scoped>

</style>
