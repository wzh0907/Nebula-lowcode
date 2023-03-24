<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item :name="index" v-for="(item, index) in columnsConfigs" :key="index" style="position: relative;">
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
        <el-form class="label-left" label-width="left" size="small" style="padding-left: 20px;">
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
            <!-- 列名、列值配置项 -->
            <!-- <columnsValuesConfig v-if="config.formType === 'columns-values-config'" :columnsConfigs="item[config.key]" :addBtnText="config.addBtnText" :itemKey="config.itemKey || 'label'" :addColumnConfig="config.addColumnConfig" /> -->
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div style="margin-left: 20px;">
      <el-button type="text" @click="handleAddColumn">添加列</el-button>
    </div>
  </div>
</template>

<script>
// import iconUpload from './icon-upload'
// import columnsValuesConfig from './columns-values-config'
// import radioButtonGroup from './radio-button-group'
export default {
  name: "columns-config",
  components: {
    // iconUpload,
    // columnsValuesConfig,
    // radioButtonGroup
  },
  props: [
    'columnsConfigs',
    // 'collapsePanelColumnsConfigs',
    // 'addColumnConfig',
  ],
  data() {
    return {
      activeNames: ['1'],
      collapsePanelColumnsConfigs: [
        {
          labelName: '列名：',
          formType: 'input',
          placeholder: '值',
          key: 'label'
        },
        {
          labelName: '列值：',
          formType: 'input',
          placeholder: '值',
          key: 'prop'
        }
      ],
      addColumnConfig: {
        label: '',
        prop: ''
      }
    };
  },
  methods: {
    // changeConfigValue(configOptions, configKey, value){
    //   configOptions[configKey] = value
    // },
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
