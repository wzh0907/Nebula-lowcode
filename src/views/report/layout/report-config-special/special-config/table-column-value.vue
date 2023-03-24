<template>
  <div>
    <el-form label-width="70px" label-position="top" size="small">
      <el-form-item label="表列设置">
        <el-radio-group size="mini" v-model="specialColumnsConfigItem.valueType" @change="onChangeColValueType">
          <el-radio-button label="value">数值</el-radio-button>
          <el-radio-button label="pic">图片</el-radio-button>
          <el-radio-button label="icon">图标</el-radio-button>
          <el-radio-button label="text">文本</el-radio-button>
          <div style="padding-top: 10px;" key="value" v-if="specialColumnsConfigItem.valueType === 'value'">
            <el-input v-model="specialColumnsConfigItem.colValue"></el-input>
          </div>
          <div style="padding-top: 10px;" key="pic" v-if="specialColumnsConfigItem.valueType === 'pic'">
            <el-input v-model="specialColumnsConfigItem.colValue"></el-input>
          </div>
          <div style="padding-top: 10px;" key="icon" v-if="specialColumnsConfigItem.valueType === 'icon'">
            <i :class="iconSrc.fontClass" @click="iconDialogVisible = true" style="font-size: 28px;" />
          </div>
          <div style="padding-top: 10px;" key="text" v-if="specialColumnsConfigItem.valueType === 'text'">
            <el-input v-model="specialColumnsConfigItem.colValue"></el-input>
          </div>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form label-width="70px" label-position="left" size="small">
      <el-form-item label="上下排列">
        <el-switch
          v-model="specialColumnsConfigItem.position"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-color-picker v-model="specialColumnsConfigItem.color" />
      </el-form-item>
    </el-form>
    <!-- 状态渲染 -->
    <!-- <p style="padding-top: 20px;">状态渲染</p>
    <el-collapse v-model="activeNames">
      <draggable
        tag="ul"
        v-bind="{group:{ name:'table-column-value-config'}, ghostClass: 'ghost', handle: '.drag-item'}"
        :list="tableColumnValueConfig.statusConfigList"
        handle=".drag-item"
        @end="onDragMoveEnd"
      >
        <el-collapse-item
          :name="index"
          v-for="(item, index) in tableColumnValueConfig.statusConfigList"
          :key="index"
        >
          <template slot="title">
            {{ item.displayValue }}
            <el-button
              class="panel-del-btn"
              circle
              plain
              type="danger"
              size="mini"
              icon="el-icon-minus"
              @click="handleRemoveColumn(tableColumnValueConfig.statusConfigList, index)"
            />
            <i class="drag-item drag-item-handle" style="font-size: 16px;margin: 0 5px;cursor: move;">
              <i class="iconfont iconbar" />
            </i>
          </template>
          <el-form
            size="small"
            style="padding-left: 20px"
            label-width="60px"
          >
            <el-form-item label="当">
              <el-input
                v-model="item.rowKey"
                placeholder="不填默认列值"
                size="mini"
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="等于">
              <el-input
                v-model="item.statusValue"
                placeholder="请输入状态值"
                size="mini"
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="显示值">
              <el-input
                v-model="item.displayValue"
                placeholder="请输入显示值"
                size="mini"
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="颜色">
              <el-color-picker v-model="item.color" />
            </el-form-item>
            <el-form-item label="显示">
              <el-switch
                v-model="item.isShow"
              >
              </el-switch>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </draggable>
    </el-collapse>
    <div style="margin-left: 20px">
      <el-button type="text" @click="handleAddColumn(tableColumnValueConfig.statusConfigList)">添加</el-button>
    </div> -->
    <!-- 数据绑定 -->
    <!-- <el-form label-position="top" size="small">
      <el-form-item label="数据绑定">
        <div v-for="(item, key) in tableColumnValueConfig.tableBindDataRowKeyList" :key="key">
          <el-select v-model="item.value" placeholder="请选择" style="margin-bottom: 10px;"  @change="handleTableBind">
          <el-option
            v-for="item in tableColumnValueConfig.tableDataRowKeyList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        
        </el-select>
          <el-button
              circle
              plain
              type="danger"
              size="mini"
              icon="el-icon-minus"
              style="padding: 4px;margin-left: 5px;"
              @click="handleOptionsRemove(key)"
            />
        </div>
        
         
      </el-form-item>
      <el-form-item label="">
        <el-button type="text" @click="handleAddRowKeyColumn(tableColumnValueConfig.tableBindDataRowKeyList)" style="margin-left: 20px">添加</el-button>
      </el-form-item>
    </el-form> -->
    <!-- pop -->
    <icon-dialog
      :isShowLineEntityIcon="false"
      :dialog-visible.sync="iconDialogVisible"
      title="图标"
      :list-data="iconListData"
      @changeImg="onChangeIcon"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Draggable from 'vuedraggable'

import { saveAndUpdateLocalData,saveAndUpdatePageLocalData } from '@/views/report/utils/deal-data-cache/index'
export default {
  name: "table-column-value-config",
  components: {
    Draggable,
    "icon-dialog": () => import("@/views/report/modules/icon-select-dialog"),
  },
  computed: {
    ...mapGetters(['merchantList']),
  },
  props: [
    'tableColumnValueConfig'
  ],
  data() {
    return {
      iconDialogVisible: false,
      iconListData: [],
      iconSrc: {
        fontClass: 'iconfont iconlunbotu'
      },
      activeNames: ["1"],
      // colValueType: 'value',
      specialColumnsConfigItem: {}
    };
  },
  created(){
    console.log("create table-column-value",this.tableColumnValueConfig)
    // this.getDefaultIcon()
    if (this.tableColumnValueConfig.colValueType === 'single-row') {
      this.specialColumnsConfigItem = this.tableColumnValueConfig.specialColumnsConfigs[this.tableColumnValueConfig.colIndex][0] || {}
    } else if (this.tableColumnValueConfig.colValueType === 'multi-row') {
      this.specialColumnsConfigItem = this.tableColumnValueConfig.specialColumnsConfigs[this.tableColumnValueConfig.colIndex][this.tableColumnValueConfig.multiRowIndex] || {}
    }
    // console.log('xxxxxxx', this.specialColumnsConfigItem)
  },
  methods: {
    getDefaultIcon() {
    
    },
    onChangeColValueType(type){
      if (type === 'icon') {
        this.onChangeDataIndex(this.iconSrc, type)
      } else {
        this.onChangeDataIndex(this.specialColumnsConfigItem && this.specialColumnsConfigItem.colValue, type)
      }
    },
     handleOptionsRemove(index){
      this.tableColumnValueConfig.tableBindDataRowKeyList.splice(index, 1);
    },
    onChangeIcon(src){
      this.iconSrc = src
      this.onChangeDataIndex(src, 'icon')
    },
    onChangeDataIndex(val, type){
      let tableColumnValueConfigItem = {
        valueType: type,
        colValue: val,
        statusConfigList: [],
        tableBindDataRowKeyList: [],
        tableDataRowKeyList: [],
        eventConfig: {eventList: []},
        position: false,
        color: ''
      }
      if (this.tableColumnValueConfig.colValueType === 'single-row') {
        this.$set(this.tableColumnValueConfig.specialColumnsConfigs, this.tableColumnValueConfig.colIndex, [
          tableColumnValueConfigItem
        ])
      } else if (this.tableColumnValueConfig.colValueType === 'multi-row') {
        this.$set(this.tableColumnValueConfig.specialColumnsConfigs[this.tableColumnValueConfig.colIndex], this.tableColumnValueConfig.multiRowIndex, tableColumnValueConfigItem)
      }
      this.specialColumnsConfigItem = tableColumnValueConfigItem
      // console.log('yyyyyyyyyyyyyy', this.specialColumnsConfigItem)
    },
    onDragMoveEnd(){},
    handleAddColumn(columnsConfigs) {
      let obj = {
        rowKey: '',
        statusValue: '',
        displayValue: '',
        color: '',
        isShow: true
      }
      columnsConfigs.push(obj);
    },
    handleAddRowKeyColumn(columnsConfigs){
      let obj = {
        value: ''
      }
      columnsConfigs.push(obj);
    },
    handleRemoveColumn(columnsConfigs, index) {
      columnsConfigs.splice(index, 1);
    },
    isEmptyObject(obj) {
      for (let key in obj) {
        return false;
      }
      return true;
    },

    handleTableBind(){
      this.tableColumnValueConfig.tableBindDataRowKeyList.forEach(element => {
        // TODO::： 需要废弃，通过新的数据引擎实现
        saveAndUpdateLocalData(element.value,"");
        saveAndUpdatePageLocalData(element.value,"","table")
        this.$pageDataModelEngine.saveCustomData(element.value,"","table")
      });
    }
  }
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
  left: 10px;
}
// 覆写el-label
// .label-left /deep/.el-form-item__label {
//   float: left;
// }
</style>
