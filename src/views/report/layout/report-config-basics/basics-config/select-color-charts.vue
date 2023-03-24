<script>
/**
 * 图表的配置组件（这个要移动到component-config文件夹下）
 */
import {colorSchemeList} from "@/views/report/utils/chartsColorScheme";
import colorConfig from "./color-config"
export default {
  name: "select-color-charts",
  components: {
    colorConfig
  },
  props: ['componentConfig','componentConfigKey', 'config',],
  data() {
    return {
      formType: '',
      formKey: '',
      value:'',
      showColorSelect: false,
      colorSchemeLists: colorSchemeList
    };
  },
  created(){
  },
  mounted(){
    if (this.componentConfig.options.isCustomChartColor) {
      this.colorSchemeLists[0].type = this.componentConfig.options[this.config.key].toString()
      this.showColorSelect = true
    } else {
      this.showColorSelect = false
    }
  },
  updated() {
    if (this.componentConfig.options.isCustomChartColor) {
      this.colorSchemeLists[0].type = this.componentConfig.options[this.config.key].toString()
      this.showColorSelect = true
    } else {
      this.showColorSelect = false
    }
  },
  methods: {
    changeConfigValue0(configOptions, configKey, color) {
      this.componentConfig.options[this.config.key].splice(0, 1, color)
    },
    changeConfigValue1(configOptions, configKey, color) {
      this.componentConfig.options[this.config.key].splice(1, 1, color)
    },
    changeConfigValue2(configOptions, configKey, color) {
      this.componentConfig.options[this.config.key].splice(2, 1, color)
    },
    changeConfigValue3(configOptions, configKey, color) {
      this.componentConfig.options[this.config.key].splice(3, 1, color)
    },
    changeConfigValue4(configOptions, configKey, color) {
      this.componentConfig.options[this.config.key].splice(4, 1, color)
    },
    changeConfigValue5(configOptions, configKey, color) {
      this.componentConfig.options[this.config.key].splice(5, 1, color)
    },
    selectChangeValue(value) {
      if (value === this.colorSchemeLists[0].type) {
        this.showColorSelect = true
        this.componentConfig.options[this.config.key] = value.split(',')
        this.componentConfig.options.isCustomChartColor = true
      } else {
        this.showColorSelect = false
        this.componentConfig.options[this.config.key] = value.split(',')
        this.componentConfig.options.isCustomChartColor = false
      }
    }
  }
};
</script>

<template>
  <div>
    <el-select @change="selectChangeValue" v-model="(componentConfig.options[config.key]).toString()" placeholder="请选择">
      <el-option
        v-for="(item, key) in colorSchemeLists"
        :key="key"
        :label="item.name"
        :value="item.type">
        <span style="float: left">{{ item.name }}</span>
        <img :src="require('@/assets/color/' + item.name + '.png')" style="float: right; width: 80px; height: 30px">
      </el-option>
    </el-select>
    <div v-show="showColorSelect">
      <colorConfig
        :colorStyle="componentConfig.options[config.key][0]"
        @changeConfigValue="changeConfigValue0"
        :configOptions="componentConfig.options"
        :configKey="config.key"
      />
      <colorConfig
        :colorStyle="componentConfig.options[config.key][1]"
        @changeConfigValue="changeConfigValue1"
        :configOptions="componentConfig.options"
        :configKey="config.key"
      />
      <colorConfig
        :colorStyle="componentConfig.options[config.key][2]"
        @changeConfigValue="changeConfigValue2"
        :configOptions="componentConfig.options"
        :configKey="config.key"
      />
      <colorConfig
        :colorStyle="componentConfig.options[config.key][3]"
        @changeConfigValue="changeConfigValue3"
        :configOptions="componentConfig.options"
        :configKey="config.key"
      />
      <colorConfig
        :colorStyle="componentConfig.options[config.key][4]"
        @changeConfigValue="changeConfigValue4"
        :configOptions="componentConfig.options"
        :configKey="config.key"
      />
      <colorConfig
        :colorStyle="componentConfig.options[config.key][5]"
        @changeConfigValue="changeConfigValue5"
        :configOptions="componentConfig.options"
        :configKey="config.key"
        :offset="-20"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
