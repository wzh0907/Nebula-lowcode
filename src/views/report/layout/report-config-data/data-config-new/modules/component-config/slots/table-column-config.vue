<template>
  <div class="selectTypesOpert">
    <el-checkbox-group style="position: relative">
      <el-tooltip effect="dark" content="刷新列值" placement="top">
        <i
          class="refresh-icon iconfont iconshuaxin"
          alt="刷新"
          @click="refreshTableField"
        ></i>
      </el-tooltip>
      <draggable
        v-model="componentConfig.options.columnsConfigList"
        tag="ul"
        v-bind="{
          group: { name: 'options' },
          ghostClass: 'ghost',
          handle: '.drag-item',
        }"
        handle=".drag-item"
        @end="onDragMoveEnd"
      >
        <li
          class="table-column-item"
          v-for="(item, index) in componentConfig.options.columnsConfigList"
          :key="index"
          v-show="item.key!=='workflow'&&item.dataIndex!=='操作'"
        >
          <div>
            <el-input v-model="item.value" size="mini" placeholder="输入列名" style="width: 95px">
              <el-popover
                v-model="item.popoverVisible"
                slot="suffix"
                placement="bottom"
                width="200"
                trigger="click">
                <i :style="globalStyle(item)" style="cursor: pointer" slot="reference" class="iconfont iconglobal global"></i>
                <div>
                  <div class="row">
                    <div class="title">中文</div>
                    <el-input v-model="item.value" placeholder="请输入中文"></el-input>
                  </div>
                  <div class="row" style="margin-top: 16px">
                    <div class="title">英文</div>
                    <el-input v-model="item.enValue" placeholder="请输入英文"></el-input>
                  </div>
                  <el-button @click="item.popoverVisible = false" type="primary" class="confirm-button">确定</el-button>
                </div>
              </el-popover>
            </el-input>
            <el-select
              v-model="item.dataIndex"
              @change="onChangeDataIndex($event, index)"
              placeholder="选择列值"
              style="width: 95px"
              size="mini"
            >
              <el-option
                v-for="(value, key) in tableFieldList"
                :key="key"
                :label="value.columnName"
                :value="value.columnName"
              >
              </el-option>
            </el-select>
            <i
              class="drag-item"
              style="font-size: 16px; margin: 0 5px; cursor: move"
            >
              <i class="iconfont iconbar" />
            </i>
            <i
              class="iconfont icontrash"
              style="font-size: 16px"
              @click="handleOptionsRemove(index)"
            >
            </i>
            <i
              class="iconfont iconset"
              style="font-size: 16px; margin-left: 5px; cursor: pointer"
              @click="onSetColmuns(index)"
            />
          </div>
        </li>
      </draggable>
    </el-checkbox-group>
    <div style="margin-left: 22px">
      <el-button type="text" @click="handleAddColumn">添加列</el-button>
    </div>
    <div>
      数据操作项
      <draggable
        v-if="existOperateFlag"
        v-model="operateCol.specialColumnsConfigs[operateCol.colIndex]"
        tag="ul"
        v-bind="{
          group: { name: 'options' },
          ghostClass: 'ghost',
          handle: '.drag-item',
        }"
        handle=".drag-item"
      >
        <div
          class="table-column-item"
          v-for="(specialCol, specialKey) in operateCol.specialColumnsConfigs[
            operateCol.colIndex
          ]"
          :key="specialKey"
        >
          <el-input
            size="mini"
            style="width: 168px"
            v-model="specialCol.colValue"
          ></el-input>
          <i
            class="drag-item"
            style="font-size: 16px; margin: 0 5px; cursor: move"
          >
            <i class="iconfont iconbar" />
          </i>
          <i
            class="iconfont icontrash"
            style="font-size: 16px"
            @click="handleOperateRemove(specialKey)"
          >
          </i>
          <i
            class="iconfont iconfabu1"
            style="font-size: 16px; margin-left: 5px; cursor: pointer"
            @click="onSetMultiRowColmuns(operateCol, specialKey)"
          />
          <i
            class="iconfont iconbiangengguanli"
            style="font-size: 16px; margin-left: 5px; cursor: pointer"
            @click="statusClick(operateCol, specialKey)"
          />
        </div>
      </draggable>
      <div style="margin-left: 22px">
        <el-button type="text" @click="handleAddOperate">添加操作</el-button>
      </div>
    </div>
      <div
      v-has="'report:showConfig'"
        class="event-div"
        @click="statusClick()"
      >
        <i class="event-icon iconfont iconbiangengguanli" />
        状态渲染器
      </div>
    
     <eventConfigNew
      ref="eventConfigNew"
      :dialog-visible.sync="dialogFlowVisible"
      :deviceDesignType="deviceDesignType"
      :eventList="workFlow.eventList"
      title="工作流配置"
      @eventSave="eventSave"
    />
    <statusConfigDialog
      ref="statusConfigDialog"
      :dialog-visible.sync="dialogStatusVisible"
      :eventList="currentOperateItem._statusEventList"
      :currentOperateItem="currentOperateItem"
      title="渲染器配置"
      @eventSave="statusSasve" />

  </div>
</template>

<script>
import Draggable from "vuedraggable";
import { EventBus } from "@/util/event-bus.js";
import store from "@/store";
import { getProjectFileTreeListV5Service } from "@/api/v5";
import { getDbSrclist, getDbTableList } from "@/api/database-command/index.js";
import eventConfigNew from "@/views/report/layout/report-config-event/event-config-new/index.vue";

import statusConfigDialog from "@/views/report/layout/report-config-status/index.vue";
export default {
  name: "columns-config",
  components: {
    Draggable,
    eventConfigNew,
    statusConfigDialog,
  },
  props: {
    componentConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      currentOperateItem: {},
      tableFieldList: [],
      operateCol: {},
      existOperateFlag: false,
      workFlow: {},
      interfaceApiAll: [],
      dbList: [],
      tableList: [],
      dialogFlowVisible: false,
      dialogStatusVisible:false,
      deviceDesignType:'workFlow',
      newEventList:[],
      // valueTemp: ''
    };
  },
  created() {
    this.initTableField();
    this.componentConfig.options.columnsConfigList.forEach((col) => {
      if (col.title == "操作") {
        this.existOperateFlag = true;
        this.operateCol = col;
      }
    });
    this.queryInterfaceDataList();
    this.queryDbSrclist();
    this.workFlow = this.componentConfig.options.workFlow;


  },
  methods: {
    refreshTableField() {
      let temp = this.$pageDataModelEngine.updateInterfaceData(
        this.componentConfig.options.interfaceDataConfig.uuid
      );
      let rData =
        temp.data.responseData[
          this.componentConfig.options.interfaceDataConfig.key
        ];
      this.tableFieldList = [];
      if (rData instanceof Array && rData.length > 0) {
        for (let rkey in rData[0]) {
          this.tableFieldList.push({ columnName: rkey });
        }
      }
    },
    initTableField() {
      this.interfaceData = this.$pageDataModelEngine.getInterfaceData();
      this.interfaceData &&
        this.interfaceData.forEach((item) => {
          if (
            item.id == this.componentConfig.options.interfaceDataConfig.uuid
          ) {
            if (item.type == "radio-button-interface" || item.type === 'radio-button-connect') {
              this.tableFieldList = item.data.tableFieldList;
              console.log("-------init tableFieldList",this.tableFieldList);
              if (item.data.tableFieldList) {
                this.tableFieldList = item.data.tableFieldList;
              } else {
                // 如果接口里没有 tableFieldList 就从responseData里面解析
                let rData =
                  item.data.responseData[
                    this.componentConfig.options.interfaceDataConfig.key
                  ];
                this.tableFieldList = [];
                if (rData instanceof Array && rData.length > 0) {
                  for (let rkey in rData[0]) {
                    let tData = rData[0];

                    let temp = null;
                    try {
                      temp = JSON.parse(tData[rkey]);
                    } catch (e) {
                      // 错误处理代码片段
                      temp = rkey;
                    }
                    if (temp instanceof Array) {
                      this.tableFieldList.push({
                        columnName: rkey,
                        valueType: "file",
                      });
                    } else {
                      this.tableFieldList.push({
                        columnName: rkey,
                        valueType: "value",
                      });
                    }
                  }
                }
              }
            } else if (item.type == "radio-button-tables") {
              this.tableFieldList = item.data.tableFieldList;
            }
          }
        });
    },
    onDragMoveEnd(e) {
      this.changeArrIndex(
        this.componentConfig.options.specialColumnsConfigs,
        e.oldIndex,
        e.newIndex
      );
      console.log(
        "onDragMoveEnd",
        this.componentConfig.options.specialColumnsConfigs,
        e.oldIndex,
        e.newIndex
      );

      //
    },
    changeArrIndex(arr, startIndex, endIndex) {
      arr[startIndex] = arr.splice(endIndex, 1, arr[startIndex])[0];
      return arr;
    },
    onChangeDataIndex(val, index) {
      // change 这边的字段 会导致 操作栏的改变
      let _specialConfig =
        this.componentConfig.options.columns[index]._specialConfig;
      // 2021-07-31 这里做一个临时处理删除 _specialConfig.interfaceDataConfig.tableData  和 tableField
      // 注意 tableData 不能把字段删除 ，会导致值塞不进去
      // _specialConfig.interfaceDataConfig.tableData.splice(
      //   0,
      //   _specialConfig.interfaceDataConfig.tableData.length
      // );
      delete _specialConfig.interfaceDataConfig.tableFieldList;
      let switchFlag = false;
      if (
        this.existOperateFlag &&
        this.componentConfig.options.specialColumnsConfigs.length <
          this.componentConfig.options.columns.length
      ) {
        switchFlag = true;
        _specialConfig =
          this.componentConfig.options.columns[index + 1]._specialConfig;
      }
      let configArr =
        _specialConfig.specialColumnsConfigs[_specialConfig.colIndex];
      // 2022-02-08
      this.$set(_specialConfig, "scopedSlots", {
        customRender: _specialConfig.dataIndex,
      });
      if (!configArr) {
        configArr = [];
        this.$set(
          _specialConfig.specialColumnsConfigs,
          _specialConfig.colIndex,
          configArr
        );
      }
      let valueType = "value";
      this.tableFieldList.forEach((tableItem) => {
        if (tableItem.columnName == val) {
          valueType = tableItem.valueType || "value";
        }
      });
      configArr[0] = {
        colValue: val,
        valueType: valueType,
        dataIndex: val,
        statusConfigList: [],
        tableBindDataRowKeyList: [],
        tableDataRowKeyList: [],
      };
      if (switchFlag) {
        let index1 = index;
        let index2 = index + 1;

        _specialConfig.specialColumnsConfigs[index1] =
          _specialConfig.specialColumnsConfigs.splice(
            index2,
            1,
            _specialConfig.specialColumnsConfigs[index1]
          )[0];
      }
    },
    onSetColmuns(index) {
      let nodeItem = this.componentConfig.options.columns[index];
      store.dispatch(
        "app/changeMobileDesignComponentUUID",
        nodeItem.specialUUID
      );
      EventBus.$emit(
        "onChangeCurrentWidgetComponentConfig",
        nodeItem._specialConfig,
        "widget"
      );
    },
    handleAddColumn() {
      console.log(
        "handleAddColumn",
        this.componentConfig.options.columnsConfigList
      );
      let columnItem={
        width: 200,
        value: "",
        enValue: "",
        title: "",
        colValue: "",
        dataIndex: "",
        key: "",
        align: "center",
        colIndex: 0,
        specialColumnsConfigs: {},
        interfaceDataConfig: {},
        popoverVisible: false //用于输入多语言的弹框
      }
      if (this.existOperateFlag) {
        let index1 = this.componentConfig.options.columnsConfigList.length - 1;
        this.componentConfig.options.columnsConfigList.splice(index1,0,columnItem)
      }else{
        this.componentConfig.options.columnsConfigList.push(columnItem);
      }

      // if (this.existOperateFlag) {
      //   let index1 = this.componentConfig.options.columnsConfigList.length - 1;
      //   let index2 = this.componentConfig.options.columnsConfigList.length - 2;
      //   this.componentConfig.options.columnsConfigList[index1] =
      //     this.componentConfig.options.columnsConfigList.splice(
      //       index2,
      //       1,
      //       this.componentConfig.options.columnsConfigList[index1]
      //     )[0];
      // }
      // 2022-04-09 尝试修复直接静态数据问题，但是有bug 暂时不动
      // let that = this;
      // setTimeout(()=>{
      //   that.onChangeDataIndex("",that.componentConfig.options.columnsConfigList.length-1)
      // },50)
    },
    handleAddOperate() {
      let initFlag = false;
      if (!this.existOperateFlag) {
        this.componentConfig.options.columnsConfigList.push({
          // fixed: 'right',
          width: 100,
          value: "操作",
          enValue: "",
          title: "操作",
          colValue: "",
          dataIndex: "操作",
          key: "c",
          align: "center",
          type: "special-component-table-column",
          colValueType: "multi-row",
          valueType: "multi-row",
          colIndex: 0,
          specialColumnsConfigs: {},
          interfaceDataConfig: {},
          popoverVisible: false //用于输入多语言的弹框
        });
        this.existOperateFlag = true;
      }

      this.operateCol =
        this.componentConfig.options.columnsConfigList[
          this.componentConfig.options.columnsConfigList.length - 1
        ];
      setTimeout(() => {
        let tableColumnConfig = this.operateCol;
        let configArr =
          tableColumnConfig.specialColumnsConfigs[tableColumnConfig.colIndex];
        initFlag = !configArr;
        if (initFlag) {
          configArr = [];
        }
        configArr.push({
          // valueType: "multi-row",
          colValue: "",
          name: "",
          dataIndex: "操作", // 由于操作是多列，colValue 是单个值
          multiRowIndex: tableColumnConfig.specialColumnsConfigs.length - 1,
          valueType: "text",
          statusConfigList: [],
          tableBindDataRowKeyList: [],
          tableDataRowKeyList: [],
          eventConfig: {
            eventList: [
              {
                actionList: [],
                version: "1.0.0",
                eventType: "click",
              },
              {
                actionList: [],
                version: "1.0.0",
                eventType: "change",
              },
            ],
          },
          position: false,
          color: "#1890ff",
        });
        if (initFlag) {
          this.$set(tableColumnConfig, "scopedSlots", {
            customRender: "操作",
          });
          this.$set(
            tableColumnConfig.specialColumnsConfigs,
            tableColumnConfig.colIndex,
            configArr
          );
        }
      }, 50);
    },

    onSetMultiRowColmuns(tableColumnConfig, index) {
      let nodeItem = tableColumnConfig.componentList[index] || {};
      store.dispatch("app/changeMobileDesignComponentUUID", nodeItem.uuid);
      // EventBus.$emit("onChangeCurrentWidgetComponentConfig", nodeItem, "widget");

      // 操作栏直接打开事件弹窗
      EventBus.$emit("onChangeTableOperateConfig", nodeItem);
      // EventBus.$emit("onChangeTableColEvent");
    },
    handleOptionsRemove(index) {
      this.componentConfig.options.specialColumnsConfigs.splice(index, 1);
      this.componentConfig.options.columnsConfigList.splice(index, 1);
    },
    handleOperateRemove(index) {
      let tableColumnConfig = this.operateCol;
      let configArr =
        tableColumnConfig.specialColumnsConfigs[tableColumnConfig.colIndex];
      if (configArr.length > 1) {
        configArr.splice(index, 1);
      } else {
        let colIndex = tableColumnConfig.colIndex;
        this.componentConfig.options.specialColumnsConfigs.splice(colIndex, 1);
        this.componentConfig.options.columnsConfigList.splice(colIndex, 1);
        this.existOperateFlag = false;
      }
    },
    onAddSortFunc(item) {
      this.$set(item, "sortable", !item.sortable);
      let sortable = item.sortable;
      if (!sortable) {
        item.sortDirections = [];
      } else {
        item.sortDirections = ["ascend", "descend"];
      }
    },
    queryInterfaceDataList() {
      getProjectFileTreeListV5Service().then((res) => {
        this.interfaceApiAll = res.dataList;
      });
    },
    queryDbSrclist() {
      this.dbList = [];
      getDbSrclist().then((res) => {
        this.dbList = res.dataList || [];
      });
    },
    changeInterface() {},
    changeDB(dbConfigId) {
      this.tableList = [];
      this.queryDbTableList(dbConfigId);
    },
    queryDbTableList(dbConfigId) {
      getDbTableList({
        dbConfigId,
      }).then((res) => {
        this.tableList = res.dataList || [];

        // this.handleNodeClick(children[0]);
      });
    },
    eventClick(){
      this.dialogFlowVisible=true
    },
    statusClick(tableColumnConfig, index) {
      if (tableColumnConfig) {
        const nodeItem = tableColumnConfig.componentList[index] || {};
        this.currentOperateItem = nodeItem
      }

      this.dialogStatusVisible = true;
      if(this.currentOperateItem._statusEventList){

      }else{
        this.currentOperateItem._statusEventList=[];
      }
    },
    eventSave(event){
      console.log("-----",event)
      this.workFlow.eventList=event;
    },
    statusSasve(event){
      this.currentOperateItem._statusEventList=event;
    },
    globalStyle(item) {
      if (item.value != null && item.enValue != null && item.value.length > 0 && item.enValue.length > 0) {
        return {
          backgroundColor: '#409EFF',
          color: 'white'
        }
      } else {
        return {}
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.table-column-item {
  padding: 5px;
  .iconfont {
    &.active {
      color: #197aff;
    }
  }
}
.refresh-icon {
  position: absolute;
  top: -34px;
  left: 70px;
  cursor: pointer;
}
.event-div {
  display: flex;
  flex-direction: row;
  cursor: pointer;
  width: 205px;
  margin: 20px auto 20px 5px;
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

.global {
  font-size: 18px;
  padding: 5px;
  margin-right: -4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px
}

.confirm-button {
  width: 100%;
  margin-top: 16px;
}
</style>
