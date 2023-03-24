<template>
  <div>
    <p style="padding: 20px 0px 10px;">表列设置</p>
    <el-form label-width="70px" label-position="left" size="small">
      <el-form-item label="排序：" v-show="colValueType === 'single-row'">
        <el-switch size="mini" v-model="tableColumnConfig.sortable" @change="addSortFunc($event, tableColumnConfig)"></el-switch>
      </el-form-item>
      <!-- <el-form-item label="列编辑：" v-show="colValueType === 'single-row'">
        <el-switch size="mini" v-model="tableColumnConfig.isEditField" @change="onChangeIsEdit"></el-switch>
      </el-form-item> -->
       <el-form-item label="列宽：" >
        <el-input-number size="mini" v-model="tableColumnConfig.width" :min="50"  ></el-input-number>
      </el-form-item>
      <el-form-item label="对齐：">
        <el-radio-group size="mini" v-model="tableColumnConfig.align">
          <el-radio-button label="left">向左</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">向右</el-radio-button>
        </el-radio-group>
      </el-form-item>
       <div
        class="event-div"
        @click="eventClick()"
      >
        <i class="event-icon iconfont iconbiangengguanli" />
        渲染器
      </div>
       <!-- <el-form-item label="文本格式：">
         <text-format-selector
          v-model="tableColumnConfig.textFormat"
        />
       </el-form-item> -->
       
      <el-form-item label="子列">
      </el-form-item>
       <draggable
        v-model="tableColumnConfig.children"
        tag="ul"
        v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
        handle=".drag-item"
      >
        <li class="table-column-item" v-for="(item, index) in tableColumnConfig.children" :key="index">
          <div>
            <span style="font-size: 14px;">列名：</span>
            <el-input v-model="item.title" style="width: 150px;" size="mini" />
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
          <div  style="display:flex">
            <span style="font-size: 14px;width:42px">列值：</span>
            <el-select v-model="item.dataIndex" @change="onChangeDataIndex($event, index)" placeholder="请选择" style="width: 150px;" size="mini">
                <el-option
                  v-for="(value, key) in tableFieldList"
                  :key="key"
                  :label="value.columnName"
                  :value="value.columnName">
                </el-option>
            </el-select>
            
            <!-- <i style="font-size: 16px;margin:0px 2px; cursor: pointer;">
              <i class="iconfont iconsorting"
                :class="{active: componentConfig.options.columns[index]._specialConfig.sortable}"
                style="font-size: 24px;"
                @click="onAddSortFunc(componentConfig.options.columns[index]._specialConfig)"
               />
            </i>-->
            <i style="font-size: 16px; margin-left:4px; cursor: pointer;">
              <i class="iconfont iconset" style="font-size: 24px;" @click="onSetColmuns(index)" />
            </i> 
          </div>
        </li>
        <div style="margin-left: 22px;">
          <el-button type="text" @click="onHandleAddColumn">添加列</el-button>
        </div>
          <!-- <columnsConfig addBtnText="添加子列" :columnsConfigs="tableColumnConfig.children" inputValueKey="title" @onHandleAddColumn="onHandleAddColumn" isCustomHandleAddColumn>
              <i slot="setting-icon" class="iconfont iconset" slot-scope="{ $index }" @click="onSetMultiRowColmuns(tableColumnConfig, $index)" style="font-size: 28px; vertical-align: bottom; margin-left: 5px; cursor: pointer;" />
            </columnsConfig> -->
       </draggable>
    </el-form>
    <statusConfigDialog 
      ref="statusConfigDialog"
      :tableColumnConfig="tableColumnConfig"
      :dialog-visible.sync="dialogStatusVisible"
      :eventList="tableColumnConfig.statusEventList"
      title="渲染器配置"

      @eventSave="eventSave">
      
    </statusConfigDialog>
  </div>
</template>

<script>
import { EventBus } from "@/util/event-bus.js";
import store from '@/store'
import { mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import columnsConfig from '@/views/report/layout/report-config-basics/basics-config/columns-config'
import textFormatSelector from "@/views/report/layout/report-config-basics/basics-config/text-format-selector.vue";

import statusConfigDialog from "@/views/report/layout/report-config-status/index.vue";
export default {
  components: {
    Draggable,
    columnsConfig,
    textFormatSelector,
    statusConfigDialog
  },
  props: ["tableColumnConfig"],
  data() {
    return {
      // valueTemp: '',
      iconSrc: {
        fontClass: 'iconfont iconlunbotu'
      },
      colValueType: 'single-row',
      collapseActiveNames: ['1'],
      hrefPageList: [],
      iconDialogVisible: false,
      iconListData: [],
      tableFieldList:[],
      dialogStatusVisible:false,
    };
  },
  // watch: {
  //   'tableColumnConfig.colIndex': {
  //     deep: true,
  //     handler(val) {}
  //   }
  // },
  computed: {
    ...mapGetters(['merchantList'])
  },
  created() {
    this.colValueType = this.tableColumnConfig.colValueType || 'single-row'
    console.log("tableColumnConfig",this.tableColumnConfig)
    this.interfaceData = this.$pageDataModelEngine.getInterfaceData();
    this.interfaceData&&this.interfaceData.forEach(item=>{
      if(item.id==this.tableColumnConfig.interfaceDataConfig.uuid){
        this.tableFieldList=item.data.tableFieldList;
      }
    })
  },
  methods: {
    eventClick() {
      this.dialogStatusVisible=true;
      if(this.tableColumnConfig.statusEventList){

      }else{
        this.tableColumnConfig.statusEventList=[];
      }
    },
   eventSave(nodes) {
      this.tableColumnConfig.statusEventList = nodes;
      console.log("tableColumnConfig.statusEventList", this.tableColumnConfig.statusEventList);
    },
    onSetMultiRowColmuns(tableColumnConfig, index){
      // console.log('xxxxxxxxxxxxxxx', tableColumnConfig, index)
      let nodeItem = this.tableColumnConfig.componentList[index] || {}
      store.dispatch('app/changeMobileDesignComponentUUID', nodeItem.uuid)
      EventBus.$emit('onChangeCurrentWidgetComponentConfig', nodeItem)
    },
    onChangeColValueType(type) {
      // this.valueTemp = ''
      this.tableColumnConfig.dataIndex = ''
      this.$set(this.tableColumnConfig, 'colValueType', type)
      this.$set(this.tableColumnConfig, 'children', null)
      this.$set(this.tableColumnConfig.specialColumnsConfigs, this.tableColumnConfig.colIndex, null)
    },
    onHandleAddColumn(){
      if (!this.tableColumnConfig.children) {
        this.$set(this.tableColumnConfig, 'children', [])
      }
      this.tableColumnConfig.children.push({
        title: ''
      })
    },
    onHandleAddMultiRowColumn(index){
      let configArr = this.tableColumnConfig.specialColumnsConfigs[this.tableColumnConfig.colIndex]
      if (!configArr) {
        configArr = []
        this.$set(this.tableColumnConfig, 'scopedSlots', { customRender: this.tableColumnConfig.colIndex })
        this.$set(this.tableColumnConfig.specialColumnsConfigs, this.tableColumnConfig.colIndex, configArr)
      }
      configArr.push({
        valueType: 'multi-row',
        colValue: '',
        name: '',
        multiRowIndex: index,
        valueType: 'text',
        statusConfigList: [],
        tableBindDataRowKeyList: [],
        tableDataRowKeyList: [],
        eventConfig: {eventList: []},
        position: false,
        color: '#1890ff'
      })
    },
    onChangeDataIndex(val, type){
      this.tableColumnConfig.dataIndex = val
      let configArr = this.tableColumnConfig.specialColumnsConfigs[this.tableColumnConfig.colIndex]
      if (!configArr) {
        configArr = []
        this.$set(this.tableColumnConfig, 'scopedSlots', { customRender: this.tableColumnConfig.colIndex })
        this.$set(this.tableColumnConfig.specialColumnsConfigs, this.tableColumnConfig.colIndex, configArr)
      }
      configArr[0] = {
        colValue: val,
        valueType: 'value',
        statusConfigList: [],
        tableBindDataRowKeyList: [],
        tableDataRowKeyList: [],
        eventConfig: {eventList: []}
      }
    },
    onChangeIsEdit(){
      let colIndex = this.tableColumnConfig.colIndex
      this.tableColumnConfig.specialColumnsConfigs[colIndex][0].isEditField = this.tableColumnConfig.isEditField
    },
    addSortFunc(sortable, item){
      if (!sortable) {
        item.sortDirections = []
      } else {
        item.sortDirections = ['ascend', 'descend']
      }
    },
    handleOptionsRemove(index){
      this.tableColumnConfig.children.splice(index, 1);
    },
    onSetColmuns(index){
      console.log('xxxxxxxxxxxxxxx', this.tableColumnConfig,index)
      let nodeItem = this.tableColumnConfig.componentList[index+1]
      store.dispatch('app/changeMobileDesignComponentUUID', nodeItem.uuid)
      EventBus.$emit('onChangeCurrentWidgetComponentConfig', nodeItem._specialConfig)
    },
  }
};
</script>
<style scoped lang="scss">
p {
  margin: 0;
  padding: 0;
}
/deep/.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
/deep/.el-collapse-item__header {
  padding-left: 20px;
}
/deep/.el-collapse-item__arrow {
  position: absolute;
  margin: 0;
  left: 0;
}
.panel-del-btn {
  position: absolute;
  right: 5px;
  padding: 4px;
}
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

.event-div {
  display: flex;
  flex-direction: row;
  cursor: pointer;
  width: 88%;
  margin: 20px auto;
  align-items: center;
  color: #666;
  cursor: pointer;
  border: 1px solid #e5e6e8;
  border-radius: 6px;
  padding: 0 8px;
  height: 36px;
  &:hover {
    color: #409eff;
    border: 1px dashed #409eff;
  }
}
.event-icon {
  font-size: 12px;
  margin: 0 10px;
}
</style>
