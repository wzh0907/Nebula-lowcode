<template>
  <div class="selectTypesOpert">
    <el-checkbox-group>
      <draggable
        v-model="componentConfig.options.columnsConfigList"
        tag="ul"
        v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
        handle=".drag-item"
      >
        <li class="table-column-item" v-for="(item, index) in componentConfig.options.columnsConfigList" :key="index">
          <div>
            <span style="font-size: 14px;">列名：</span>
            <el-input v-model="item.value" style="width: 150px;" size="mini" />
            <i class="drag-item" style="font-size: 16px; margin: 0 5px;cursor: move;">
              <i class="iconfont iconbar" />
            </i>
            <el-button
              circle
              plain
              type="danger"
              size="mini"
              icon="el-icon-minus"
              style="padding: 4px;margin-left: 5px;"
              @click="handleOptionsRemove(index)"
            />
          </div>
          <div>
            <span style="font-size: 14px;">列值：</span>
            <!-- <el-input v-model="valueTemp" @change="onChangeDataIndex($event, index)" :style="{'width': '150px' }" size="mini" /> -->
            <el-select v-model="item.dataIndex" @change="onChangeDataIndex($event, index)" placeholder="请选择" style="width: 150px;" size="mini">
              <el-option
                v-for="(value, key) in componentConfig.options.interfaceDataConfig.tableData[0]"
                :key="key"
                :label="key"
                :value="key">
              </el-option>
            </el-select>
            <i style="font-size: 16px; margin: 0 5px; cursor: pointer;">
              <i class="iconfont iconsorting"
                :class="{active: componentConfig.options.columns[index]._specialConfig.sortable}"
                style="font-size: 28px;"
                @click="onAddSortFunc(componentConfig.options.columns[index]._specialConfig)"
              />
            </i>
            <i style="font-size: 16px; margin: 0 5px; cursor: pointer;">
              <i class="iconfont iconset" style="font-size: 28px;" @click="onSetColmuns(index)" />
            </i>
          </div>
        </li>
      </draggable>
    </el-checkbox-group>
    <div style="margin-left: 22px;">
      <el-button type="text" @click="handleAddColumn">添加列</el-button>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { EventBus } from "@/util/event-bus.js";
import store from '@/store'
export default {
  name: "columns-config",
  components: {
    Draggable
  },
  props: {
    componentConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // valueTemp: ''
    };
  },
  methods: {
    onChangeDataIndex(val, index){
      let _specialConfig = this.componentConfig.options.columns[index]._specialConfig
      // console.log(this.componentConfig)
      let configArr = _specialConfig.specialColumnsConfigs[_specialConfig.colIndex]
      if (!configArr) {
        configArr = []
        this.$set(_specialConfig, 'scopedSlots', { customRender: _specialConfig.colIndex })
        this.$set(_specialConfig.specialColumnsConfigs, _specialConfig.colIndex, configArr)
      }
      configArr[0] = {
        colValue: val,
        valueType: 'value',
        statusConfigList: [],
        tableBindDataRowKeyList: [],
        tableDataRowKeyList: []
      }
    },
    onSetColmuns(index){
      // console.log('xxxxxxxxxxxxxxx', this.componentConfig.options.columns[index])
      let nodeItem = this.componentConfig.options.columns[index]
      store.dispatch('app/changeMobileDesignComponentUUID', nodeItem.specialUUID)
      EventBus.$emit('onChangeCurrentWidgetComponentConfig', nodeItem._specialConfig)
    },
    handleAddColumn() {
      this.componentConfig.options.columnsConfigList.push({
        value: '',
        title: '',
        colValue: '',
        dataIndex: '',
        key: '',
        align: 'center',
        colIndex: 0,
        specialColumnsConfigs: {},
        interfaceDataConfig: {}
      });
    },
    handleOptionsRemove(index) {
      this.componentConfig.options.columnsConfigList.splice(index, 1);
    },
    onAddSortFunc(item){
      this.$set(item, 'sortable', !item.sortable)
      let sortable = item.sortable
      if (!sortable) {
        item.sortDirections = []
      } else {
        item.sortDirections = ['ascend', 'descend']
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.table-column-item {
  border: 1px solid #999;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  .iconfont {
    &.active {
      color: #197aff;
    }
  }
}
</style>
