<script>
/**
 * 使用说明：支持单列的值配置（输入框形式）
 * 对应的有多列的值配置（columns-values-config）
 */
import imgUpload from './img-upload'
export default {
  name: "columns-config",
  components: {
    imgUpload
  },
  props: {
    // 可以通过这个属性来定义要插入item的细节
    addColumnConfig: {
      type: Object,
      default: () => {
        return {
          value: '',
          description:''
        }
      }
    },
    addBtnText: {
      type: String,
      default: ''
    },
    columnsConfigs: {
      type: Array,
      default: () => {
        return []
      }
    },
    isCustomHandleAddColumn: {
      type: Boolean,
      default: false
    },
    columnsConfigType: {
      type: String,
      default: 'input'
    },
    placeholderText: {
      type: String,
      default: '值'
    },
    inputValueKey: {
      type: String,
      default: 'value'
    }
  },
  data() {
    return {};
  },
  methods: {
    handleAddColumn() {
      if (this.isCustomHandleAddColumn) {
        this.$emit('onHandleAddColumn', (this.columnsConfigs && this.columnsConfigs.length) || 0)
        return false
      }
      let obj = JSON.parse(JSON.stringify(this.addColumnConfig))
      if (this.columnsConfigs[0] && this.columnsConfigs[0].componentList) obj.componentList = [] // TODO: 临时解决方法，待优化
      this.columnsConfigs.push(obj)
    },
    handleOptionsRemove(index) {
      if (this.columnsConfigs.length <= 1) return false;
      this.columnsConfigs.splice(index, 1)
    },
    changeConfigValue(configOptions, configKey, value){
      configOptions[configKey].value = value
    }
  },
};
</script>

<template>
  <div>
    <ul>
      <li v-for="(item, index) in columnsConfigs" :key="index">
        <el-input
          v-model="item[inputValueKey]"
          :placeholder="placeholderText || '值'"
          size="mini"
          style="width: 100px;"
          v-if="['input', 'steps-columns-config'].indexOf(columnsConfigType) !== -1"
        />
        <el-input
          v-model="item.description"
          :placeholder="'描述'"
          size="mini"
          style="width: 100px;"
          v-if="columnsConfigType === 'steps-columns-config'"
        />
        <!-- 图片选择 -->
        <div v-if="columnsConfigType === 'img'" style="display: inline-block; margin: 0 20px 20px 0;">
          <imgUpload :imgSrc="item[inputValueKey]" @changeConfigValue="changeConfigValue" :configOptions="columnsConfigs" :configKey="index" />
        </div>
        <el-button
          circle
          plain
          type="danger"
          size="mini"
          icon="el-icon-minus"
          style="padding: 4px;margin-left: 5px;"
          @click="handleOptionsRemove(index)"
        />
        <slot name="setting-icon" :$index="index" />
      </li>
    </ul>
    <div style="margin-left: 22px;">
      <el-button type="text" @click="handleAddColumn">{{ addBtnText || '添加列' }}</el-button>
    </div>
  </div>
</template>

<style lang="scss">
</style>
