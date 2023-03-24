<template>
    <div class="custom_total_form_component">
      <a-tree
        style="width: 100%"
        :multiple="options.multiple"
        :selected-keys="treeValue"
        :default-expand-all="options.expandAll"
        :tree-data="options.treeData"
        :placeholder="placeholder"
        :size="options.size"
        :disabled="options.disabled"
        :replace-fields="{key: 'value'}"
        @select="onSelect"
      />
    </div>
</template>

<script>
import optionsConfig from './options-config'
export default {
  name: "antdTreeTemplate",
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
        // console.log('treeValue=', val);
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
    treeValue() {
      let value = this.options.value
      if(this.options.interfaceDataEchoConfig.uuid&&this.options.interfaceDataEchoConfig.uuid!=''){
        this.options.value=this.options.interfaceDataEchoConfig.value
        value = this.options.interfaceDataEchoConfig.value;
      }
      if (typeof value == "string" && value != undefined && value.length > 0) {
        return value.split('/')
      } else {
        return []
      }
    },
  },
  methods: {
    onSelect(selectedKeys, info) {
      console.log('on select=', selectedKeys)
      this.options.interfaceDataEchoConfig.uuid=""
      this.options.value = selectedKeys.join('/')
      // this.options.outputValue = selectedKeys.join('/')
      let selectedLabel = []
      info.selectedNodes.forEach(node => {
        selectedLabel.push(node.data.props.label)
      })
      this.options.outputLabel = selectedLabel.join('/')

      //如果需要路径信息,需要递归查找父节点

      let pathValues = []
      selectedKeys.forEach(key => {
        let parents = this.getParentValue(this.options.treeData, key)
        let values = []
        if (parents != undefined && parents.length > 0) {
          for (let i = parents.length - 1; i >=0; i--) {
            values.push(parents[i].value)
          }
        }
        pathValues.push(values.join('-'))
      })
      this.options.pathValue = pathValues.join('/')

      let pathLabels = []
      selectedLabel.forEach(label => {
        let parents = this.getParentLabel(this.options.treeData, label)
        let labels = []
        if (parents != undefined && parents.length > 0) {
          for (let i = parents.length - 1; i >=0; i--) {
            labels.push(parents[i].label)
          }
        }
        pathLabels.push(labels.join('-'))
      })
      this.options.pathLabel = pathLabels.join('/')
    },

    //递归查找父节点
    getParentValue(list , value) {
      for (let i in list) {
        if(list[i].value==value){
          return [list[i]]
        }
        if(list[i].children){
          let node = this.getParentValue(list[i].children, value);
          if(node!==undefined){
            return node.concat(list[i])
          }
        }
      }
    },
    getParentLabel(list , label) {
      for (let i in list) {
        if(list[i].label==label){
          return [list[i]]
        }
        if(list[i].children){
          let node = this.getParentLabel(list[i].children, label);
          if(node!==undefined){
            return node.concat(list[i])
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
