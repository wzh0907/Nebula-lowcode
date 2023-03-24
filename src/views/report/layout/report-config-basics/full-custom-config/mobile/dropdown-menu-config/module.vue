<template>
  <el-form-item label="菜单项配置">
    <el-collapse v-model="activeNames">
      <draggable
        tag="ul"
        v-bind="{group:{ name:'options'}, ghostClass: 'ghost', handle: '.drag-item'}"
        :list="columnsConfigs"
        handle=".drag-item"
        @end="onDragMoveEnd"
      >
        <el-collapse-item
          :name="index"
          v-for="(item, index) in columnsConfigs"
          :key="index"
        >
          <template slot="title">
            <!-- {{ item['databaseField'] }} -->
            <el-button
              class="panel-del-btn"
              circle
              plain
              type="danger"
              size="mini"
              icon="el-icon-minus"
              @click="handleOptionsRemove(index)"
            />
            <i class="drag-item drag-item-handle" style="font-size: 16px; margin: 0 5px; cursor: move;">
              <i class="iconfont iconbar" />
            </i>
          </template>
          <!-- 接口配置 -->
          <el-form-item label="默认项">
            <el-input
              v-model="item.defaultValue"
              placeholder="默认项"
              size="mini"
              style="width: 100px;"
            />
          </el-form-item>
          <el-form-item label="标签索引">
            <el-input
              v-model="item.labelKey"
              placeholder="标签索引"
              size="mini"
              style="width: 100px;"
            />
          </el-form-item>
          <el-form-item label="列值索引">
            <el-input
              v-model="item.valueKey"
              placeholder="列值索引"
              size="mini"
              style="width: 100px;"
            />
          </el-form-item>
          <dataSourceApiConfig
            :componentList="componentList"
            :componentConfig="componentConfig"
            :config="config"
            :interfaceDataConfig="item.interfaceDataConfig || {}"
            v-if="config.formType === 'data-source-api-config' && reloadDataSourceApiConfig"
          />
        </el-collapse-item>
      </draggable>
    </el-collapse>
    <div style="margin-left: 20px">
      <el-button type="text" @click="handleAddColumn">{{
        '添加输入项'
      }}</el-button>
    </div>
  </el-form-item>
</template>

<script>
import dataSourceApiConfig from '../../../basics-config/data-source-api-config'
import Draggable from 'vuedraggable'
export default {
  name: "columns-config",
  components: {
    Draggable,
    dataSourceApiConfig
  },
  props: [
    "componentList",
    "columnsConfigs",
    'componentConfig',
    'reloadDataSourceApiConfig'
  ],
  data() {
    return {
      activeNames: ["1"],
      config: {
        labelName: '数据配置',
        isSetConfigName:true, // 不启用labelWidth
        formType: 'data-source-api-config',
        key: 'contentDataSource',
        typeConfigs: [
          {
            label: '数据表',
            value: 'radio-button-tables',
            formType: 'interface-chart-table'
          }, {
            label: '数据集',
            value: 'radio-button-dataset',
            formType: 'interface-chart-table'
          }, {
            label: '后端服务',
            value: 'radio-button-interface',
            formType: 'interface-chart-table'
          }
        ]
      }
    };
  },
  created(){
    // console.log('testaaa', this.columnsConfigs)
  },
  methods: {
    onDragMoveEnd(){
      this.componentConfig.options.reloadView = false
      this.$nextTick(() => {
        this.componentConfig.options.reloadView = true
      })
    },
    changeConfigValue(configOptions, configKey, value) {
      configOptions[configKey] = value;
    },
    handleAddColumn() {
      let obj = {
        defaultValue: 1,
        labelKey: '',
        valueKey: '',
        interfaceDataOptions: [],
        interfaceDataConfig: {
          id: '',
          key: '',
          tableData: [{}]
        }
      }
      this.columnsConfigs.push(obj);
    },
    handleOptionsRemove(index) {
      this.columnsConfigs.splice(index, 1);
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
.drag-item-handle {
  position: absolute;
  right: 30px;
  padding: 4px;
  padding-top: 8px;
}
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
// .label-left /deep/.el-form-item__label {
//   float: left;
// }
</style>
