<script>
/**
 * 使用说明：折叠框形式的配置面板
 * 1、支持输入框、下拉框、图标选择、列名、列值配置项
 * 
 * Props说明：（在组件的configList里面加上对应的字段即可）
 * 1、addBtnText： 项的添加按钮（非必传）
 * 2、columnsConfigs：这个是配置在组件的字段（必传）
 */
import iconUpload from './icon-upload'
import columnsValuesConfig from './columns-values-config'
import radioButtonGroup from './radio-button-group'
export default {
  name: "columns-config",
  components: {
    iconUpload,
    columnsValuesConfig,
    radioButtonGroup
  },
  props: [
    'addBtnText',
    'columnsConfigs',
    'collapsePanelColumnsConfigs',
    'addColumnConfig',
    'panelLabelPosition',
    'panelLabelPositionWidth'
  ],
  data() {
    return {
      activeNames: ['1']
    };
  },
  methods: {
    changeConfigValue(configOptions, configKey, value){
      configOptions[configKey] = value
    },
    handleAddColumn() {
      let obj = (this.addColumnConfig && !this.isEmptyObject(this.addColumnConfig) && JSON.parse(JSON.stringify(this.addColumnConfig))) || {
        title: ''
      }
      this.columnsConfigs.push(obj)
    },
    handleOptionsRemove(index) {
      this.columnsConfigs.splice(index, 1)
    },
    isEmptyObject(obj) {
      for (let key in obj) {
        return false;
      }
      return true;
    }
  },
};
</script>

<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item :name="index" v-for="(item, index) in columnsConfigs" :key="index">
        <template slot="title">
          {{ item.text || item.title || item.value || item.label }}
          <el-button
            class="panel-del-btn"
            circle
            plain
            type="danger"
            size="mini"
            icon="el-icon-minus"
            @click="handleOptionsRemove(index)"
          />
        </template>
        <el-form :class="{'label-left': panelLabelPosition === 'left' ? true : false}" :label-width="panelLabelPosition === 'left' ? panelLabelPositionWidth : ''" size="small" style="padding-left: 20px;">
          <el-form-item :label="config.labelName" v-for="(config, index) in collapsePanelColumnsConfigs" :key="index">
            <el-input
              v-model="item[config.key]"
              :placeholder="config.placeholder"
              size="mini"
              style="width: 100px;"
              v-if="config.formType === 'input'"
            />
            <el-input
              type="textarea"
              autosize
              :placeholder="config.placeholder"
              v-model="item[config.key]"
              v-if="config.formType === 'textarea'"
              >
            </el-input>
            <!-- 下拉框 -->
            <el-select v-model="item[config.key]" placeholder="请选择" v-if="config.formType === 'select'">
              <el-option
                v-for="item in config.typeConfigs"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- 滑块开关 -->
            <el-switch
              v-if="config.formType === 'switch'"
              v-model="item[config.key]"
            >
            </el-switch>
            <!-- 列名、列值配置项 -->
            <columnsValuesConfig v-if="config.formType === 'columns-values-config'" :columnsConfigs="item[config.key]" :addBtnText="config.addBtnText" :itemKey="config.itemKey || 'label'" :addColumnConfig="config.addColumnConfig" />
            <!-- 图标选择 -->
            <iconUpload :iconSrc="item[config.key]" @changeConfigValue="changeConfigValue" :configOptions="item" :configKey="config.key" v-if="config.formType === 'icon-upload'" />
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div style="margin-left: 20px;">
      <el-button type="text" @click="handleAddColumn">{{ addBtnText || '添加列' }}</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel-del-btn {
  position: absolute;
  right: 5px;
  padding: 4px;
}
/deep/.el-collapse-item__header {
  padding-left: 20px;
}
/deep/.el-collapse-item__arrow {
  position: absolute;
  margin: 0;
  left: 0;
}
// 覆写el-label
.label-left /deep/.el-form-item__label {
  float: left;
}
</style>
