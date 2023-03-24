<template>
  <div :class="options.elUUID" style="word-break: break-all">
    <a-table
      :columns="(options.columnsData.length ? options.columnsData : options.defaultColumnsData)"
      :data-source="(options.columnsData.length ? options.interfaceDataConfig.tableData : options.defaultTableData)"
      :pagination="(options.columnsData.length ? options.pagination : options.defaultPagination)"
      :row-selection="options.rowSelectKey ? { selectedRowKeys: options.selectedRowKeys, onChange: onSelectChange } : null"
      :rowKey="record => record[options.rowSelectKey]"
      bordered
      size="middle"
      :customRow="renderTrBackground"
      :scroll="{ x: options.tableWidth, y: tableHeight }"
      @change="handleTableChange"
    >
      <div slot="customTitle">
        <!-- 序号 -->
        <!-- <a-button icon="setting" size="small" title="列展示" /> -->
        <CustomColumns
          type="original"
          :columnsReference="options.columnsReference"
          :columnByKeyMap="options.columnByKeyMap"
          @onLoadLocalColumns="onLoadLocalColumns"
          @onReloadColumns="onReloadColumns"
          @onResetColumns="onResetColumns"
        />
      </div>
      <!-- 实现思路：使用slot实现，注意：如果没有展示这个节点，可能是slot:key有问题 -->
      <div
        class="table-cell"
        :slot="item[0].dataIndex"
        slot-scope="text, record"
        v-for="(item, key) in options.specialColumnsConfigs"
        :key="key"
      >
        <span v-for="(actionItem, actionKey) in item" :key="actionKey">
          <span
            v-if="actionItem.valueType === 'value'"
            :style="{
              display: actionItem.position ? 'block' : 'inline-block',
              color: actionItem.color || '',
            }"
          >
            <a-input
              v-if="record.editable && actionItem.colValue === record.editCol"
              style="margin: -5px 0; width: 80%"
              v-model="record[actionItem.colValue]"
            />
            <span
              v-else-if="record"
              v-html="onHandleStatusConfigRender(record, actionItem)"
              @click="triggerEvent(actionItem)"
            ></span>
          </span>
          <span
            v-if="actionItem.valueType === 'file'"
            :style="{
              display: actionItem.position ? 'block' : 'inline-block',
              color: actionItem.color || '',
            }"
          >
            <!-- 文件特殊处理 ，图片，word pdf等 -->

            <span v-if="record[actionItem.colValue]">
              <span
                v-for="(fileItem, fileIndex) in JSON.parse(
                  record[actionItem.colValue]
                )"
                :key="'file' + fileIndex"
                @click="downloadFile(fileItem)"
              >
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">
                    名称：{{ fileItem.fileName }}<br />{{
                      filterType(fileItem.size)
                    }}
                    <span class="download-span" @click="downloadFile(fileItem)"
                      >下载</span
                    >
                  </div>
                  <img
                    v-if="fileItem.type.indexOf('image') != -1"
                    class="file-img"
                    :src="fileItem.url"
                  />
                  <!-- text -->
                  <img
                    v-else-if="fileItem.type.indexOf('text') != -1"
                    class="file-img"
                    src="https://localhost:40518/platform/api/images/I3310QY0Fww91YrT.svg"
                  />
                  <!-- pdf -->
                  <img
                    v-else-if="fileItem.type.indexOf('pdf') != -1"
                    class="file-img"
                    src="https://localhost:40518/platform/api/images/kGjwtYaW9p3SyIYc.svg"
                  />
                  <!-- ppt -->
                  <img
                    v-else-if="
                      fileItem.type.indexOf('presentation') != -1 ||
                      fileItem.type.indexOf('powerpoint') != -1
                    "
                    class="file-img"
                    src="https://localhost:40518/platform/api/images/bh0VY2Ttq2yljC2O.svg"
                  />
                  <!-- rar -->
                  <img
                    v-else-if="fileItem.type.indexOf('rar') != -1"
                    class="file-img"
                    src="https://localhost:40518/platform/api/images/uWxu7ENDK9LCpLAn.svg"
                  />
                  <!-- word -->
                  <img
                    v-else-if="
                      fileItem.type.indexOf('document') != -1 ||
                      fileItem.type.indexOf('word') != -1
                    "
                    class="file-img"
                    src="https://localhost:40518/platform/api/images/AWWjNl5yV5snYC8u.svg"
                  />
                  <!-- excel -->
                  <img
                    v-else-if="
                      fileItem.type.indexOf('excel') != -1 ||
                      fileItem.type.indexOf('sheet') != -1
                    "
                    class="file-img"
                    src="https://localhost:40518/platform/api/images/hTMRguXwCvc4zGph.svg"
                  />
                  <!-- else 文件doc -->
                  <img
                    v-else
                    class="file-img"
                    src="https://localhost:40518/platform/api/images/uWbIcd30SUCYBR5d.svg"
                  />
                </el-tooltip>
              </span>
            </span>
            <span v-else></span>
          </span>
          <span
            v-if="actionItem.valueType === 'pic'"
            :style="{
              display: actionItem.position ? 'block' : 'inline-block',
              color: actionItem.color || '',
            }"
          >
            <img
              :src="record && record[actionItem.colValue]"
              alt=""
              style="width: 50px"
              @click="triggerEvent(actionItem)"
            />
          </span>
          <span
            v-if="actionItem.valueType === 'workFlow'"
            :style="{
              display: actionItem.position ? 'block' : 'inline-block',
              color: actionItem.color || '',
            }"
          >
            <a
              v-if="record"
              v-html="
                onHandleStatusConfigRender(
                  record,
                  actionItem,
                  actionItem.colValue
                )
              "
              @click.stop="triggerWorkFlow(actionItem, record)"
            ></a>
          </span>
          <span
            v-if="actionItem.valueType === 'icon'"
            :style="{
              display: actionItem.position ? 'block' : 'inline-block',
              color: actionItem.color || '',
            }"
          >
            <i
              :class="actionItem.colValue && actionItem.colValue.fontClass"
              style="font-size: 28px"
              @click="triggerEvent(actionItem)"
            />
          </span>
          <span
            v-if="actionItem.valueType === 'text'"
            :style="{
              display: actionItem.position ? 'block' : 'inline-block',
              color: actionItem.color || '',
            }"
          >
            <a
              v-if="record"
              v-html="
                onHandleStatusConfigRender(
                  record,
                  actionItem,
                  actionItem.colValue,
                  key
                )
              "
              @click.stop="onBindCellEvent(actionItem, record)"
            ></a>
            <a-divider type="vertical" v-if="
              actionKey < item.length - 1
              &&
              onHandleStatusConfigRender(
                record,
                actionItem,
                actionItem.colValue,
                key
              ) !== '<span></span>'
              "
            />
          </span>
          <span class="table-cell-operation" v-if="actionItem.isEditField">
            <i
              class="save-icon el-icon-check"
              @click="
                onSaveIcon(
                  record,
                  actionItem.colValue,
                  record[actionItem.colValue]
                )
              "
              v-if="record.editable && actionItem.colValue === record.editCol"
            ></i>
            <i
              class="edit-icon iconfont iconbianji"
              @click="onEditIcon(record, actionItem)"
              v-else
            ></i>
          </span>
        </span>
      </div>
    </a-table>
    <workFlowDialog
      :dialog-visible.sync="dialogVisible"
      :workFlowParams="workFlowParams"
      @onCloseDialog="onCloseDialog"
    />
    <workFlowDrawer
      :visible.sync="drawerVisible"
      :detailParams="detailParams"
    />
  </div>
</template>
<script>
// 显示设置
import CustomColumns from './custom-columns/index.vue'
import { deepClone } from './custom-columns/deep-clone.js'
// import { generateColumnsMap, generateLocalColumns, generateReloadColumns } from './custom-columns/main.js'

import { EventBus } from "@/util/event-bus.js";
import { generateUUID } from "@/views/report/utils/index.js";
import workFlowDialog from "./work-flow/index.vue";
import workFlowDrawer from "./work-flow/detail.vue";
import WatchPageEventV1_0_0 from "@/views/report/utils/deal-component-event/watch-page-event-v1.0.0";
import componentsConfigs from "@/views/report/pc/components/configs/index";
import {
  getProcesseDataList,
  updateFieldDataList,
  getFieldDataList,
  saveReportV3,
  getReportDefinitionV2,
} from "@/api/chartsData";
import optionsConfig from "./options-config";

import WatchStatus from "@/views/report/utils/deal-component-status/watch-status";

export default {
  name: "pc-table-template",
  components: {
    workFlowDialog,
    workFlowDrawer,
    CustomColumns
  },
  data() {
    return {
      options: optionsConfig,
      dialogVisible: false,
      drawerVisible: false,
      workFlow: {},
      detailParams: {
        dbConfigId: 0,
        recordId: "",
        tableName: "",
      },
      workFlowParams: {},
      componentsConfigs,
      // elUUID: generateUUID()
    };
  },
  watch: {
    "options.columnsConfigList": {
      deep: true,
      handler(vals) {
        this.handleColumnsConfigList(vals);
        EventBus.$emit("onReloadAsideMenu");
      },
    },
    "options.configPageSize": {
      deep: true,
      handler(val) {
        this.options.pagination.pageSize = val;
      },
    },
    "options": {
      deep: true,
      handler(val) {
        // 渲染器不知道为啥没法渲染真分页，这边临时处理一下
        this.$set(this.options.pagination, 'total', val.pagination.total)
      },
    },
    "options.rowIndexSwitch": {
      immediate: true,
      handler(val) {
        this.handleRowIndexSwitch(val)
      }
    },
    "options.columnsData": {
      // immediate: true,
      handler(val) {
        // console.log('--xx-----xx-----xx--->', JSON.stringify(this.options.columnsData))
        // 序号
        this.handleRowIndexSwitch(this.options.rowIndexSwitch)
        // 自定义值
        this.options.columnsData.forEach(columnItem => {
          // columnItem._isChecked = (columnItem._isChecked === undefined ? true : columnItem._isChecked)
          if (columnItem._isChecked === false) {
            // 显示设置
            columnItem.customHeaderCell = () => {
              return {
                style: {
                  width: '0px',
                  visibility: 'hidden'
                }
              }
            }
            columnItem.customCell = () => {
              return {
                style: {
                  width: '0px',
                  visibility: 'hidden'
                }
              }
            }
          }
          // console.log('--xx-----xx-----xx--->', columnItem)
          const statusEventList = columnItem.statusEventList || []
          statusEventList.forEach(statusEventItem => {
            if (statusEventItem.type === 'status-operate-set') {
              columnItem.customRender = (value, row, index) => {
                if (columnItem._statusOperateSetValueOfType === 'static') {
                  return columnItem._statusOperateSetValueOfStaticValue
                } else if (columnItem._statusOperateSetValueOfType === 'relation' && columnItem?._statusOperateSetValueOfRelationToKeyArr?.length) {
                  let currentInterfaceData = {}
                  let targetData = {}
                  // const interfacePath = []
                  const interfaceDataList = this.$pageDataModelEngine.getInterfaceData()
                  // console.log('--xx-----xx-----xx--->', row)
                  interfaceDataList.forEach(dataItem => {
                    if (dataItem.id === columnItem._statusOperateSetValueOfRelationToKeyArr[0]) {                      
                      currentInterfaceData = dataItem.data.responseData
                      targetData = currentInterfaceData
                      
                      columnItem._statusOperateSetValueOfRelationToKeyArr.forEach((dataPath, dataPathIndex) => {
                        // 下标为0的是接口id，>=1的为字段path
                        if (dataPathIndex >= 1) {
                          targetData = currentInterfaceData[dataPath]
                        }
                      })
                    }
                  })

                  // console.log('--xx-----xx-----xx--->', targetData, columnItem._statusOperateSetValueOfRelationKey, columnItem._statusOperateSetValueOfRelationKeyToValue)
                  /****** 需求修改 targetData为Array 这里需要转换格式 *******/
                  const _objTemp = {}
                  targetData.forEach(v => {
                    _objTemp[v[columnItem._statusOperateSetValueOfRelationKey]] = v[columnItem._statusOperateSetValueOfRelationKeyToValue]
                  })
                  targetData = _objTemp
                  // return targetData[row[columnItem._statusOperateSetValueOfRelationKey]] || ''
                  return targetData[value]
                }
                return value
              }
            }
          })
        })
        // 显示设置
        this.options.columnsReference = deepClone({ obj: this.options.columnsData }).obj
        // console.log('--xx-----xx-----xx--->', this.options.columnsReference)
        // this.options.columnsBackups = deepClone({ obj: this.options.columnsData }).obj
        // this.options.columnByKeyMap = generateColumnsMap(this.options.columnsBackups)
      }
    }
  },
  mounted() {
    setTimeout(() => {
      // console.log(this.options.elUUID)
      // console.log('--xx-----xx-----xx--->')
      // console.log('xxxxxxxx', document.querySelector(`.${this.options.elUUID}`), document.querySelector(`.${this.options.elUUID}`).offsetWidth)
      // this.options.tableWidth = document.querySelector(`.${this.options.elUUID}`).offsetWidth
      this.$set(this.options, 'tableWidth', document.querySelector(`.${this.options.elUUID}`).offsetWidth)
    }, 0)
  },
  computed: {
    tableHeight() {
      if (this.options.commonConfigCompHeightUnit === "auto") {
        return 240;
      } else if (this.options.commonConfigCompHeightUnit === "%") {
        return this.options.commonConfigCompHeight + "vh";
      } else {
        return this.options.commonConfigCompHeight;
      }
    },
    // tableWidth() {
    //   setTimeout(() => {
    //     console.log('xxxxxxxx', document.querySelector('.xxxxxxxx'), document.querySelector('.xxxxxxxx').offsetWidth)
    //   })
    //   return 0
    // }
  },
  created() {
    !this.options.elUUID && (this.options.elUUID = generateUUID())
    // console.log('--xx-----xx-----xx--->', this.$pageDataModelEngine.getInterfaceData())
    // console.log(
    //   "options.commonConfigCompHeightUnit === 'auto' ? 240 : options.commonConfigCompHeight + options.commonConfigCompHeightUnit",
    //   this.options.commonConfigCompHeightUnit === "auto"
    //     ? 240
    //     : this.options.commonConfigCompHeight +
    //         this.options.commonConfigCompHeightUnit
    // );
    this.handleColumnsConfigList(this.options.columnsConfigList);
    if (this.options.columnsData && this.options.columnsData.length > 0) {
      // 添加排序方法
      this.options.columnsData.forEach((item) => {
        this.addSortFunc(item.sortable, item);
      });
    }
    // 表创建的时候触发 状态渲染器
    // console.log("table-create", this.options);
    // 回显行选择  20230206
    setTimeout(() => {
      // console.log("table-create", this.options.echoRowKey_id, this.$pageDataModelEngine.getInterfaceData());
      if (this.options.echoRowDataType === 'inside') {
        const _rowKeys = []
        this.options.interfaceDataConfig.tableData.forEach(item => {
          const _boole = [1, '1', true, 'true'].includes(item[this.options.echoRowKeyByInside])
          _boole && _rowKeys.push(item[this.options.rowSelectKey])
        })
        // console.log('xxxxxxxxxxxxx', _rowKeys)
        this.options.selectedRowKeys = _rowKeys // [65211, 65215, 65216]
      } else {
        const echoRowKeyInterfaceId = this.options.echoRowKey_id[0]
        let echoRowKeyInterfaceData = {}

        let allInterface = this.$pageDataModelEngine.getInterfaceData();
        allInterface&&allInterface.forEach(iItem=>{
          if(iItem.id === echoRowKeyInterfaceId){
            echoRowKeyInterfaceData = iItem.data;
          }
        })

        const selectedList = echoRowKeyInterfaceData.responseData[this.options.echoRowKey].split(',').map(v => Number(v)) // 转换数字类型
        this.options.selectedRowKeys = selectedList // [65211, 65215, 65216]
      }
    }, 2000)
    

    if (
      this.options.contentDataSource === "radio-button-interface" ||
      this.options.contentDataSource == "radio-button-connect"
    ) {
      // this.handleTableChange(this.options.pagination)
    }

    // // 显示设置
    // this.options.columnsReference = deepClone({ obj: this.options.columnsData }).obj
    // this.options.columnsBackups = deepClone({ obj: this.options.columnsData }).obj
    // this.options.columnByKeyMap = generateColumnsMap(this.options.columnsBackups)

    // this.onReloadColumns(JSON.stringify(this.options.columnsData))
    // setTimeout(() => {
    //   console.log(this.options.columnsData)
    // }, 3000)
  },
  methods: {
    // 显示设置 不改变columnsData整个数组，只对某个字段进行修改
    onLoadLocalColumns(columnsLocal) { },
    onReloadColumns(columnsNewStr) {
      if (!columnsNewStr) return false;

      const columnsList = JSON.parse(columnsNewStr)
      const columnsMap = {}
      columnsList.forEach(columnItem => {
        columnItem.key && (columnsMap[columnItem.key] = columnItem)
      })
      this.options.columnsData.forEach((columnItem, columnIndex) => {
        if (columnsMap[columnItem.key] && columnsMap[columnItem.key]._isChecked === false) {
          columnItem._isChecked = false
          this.options.columns[columnIndex - 1] && (this.options.columns[columnIndex - 1]._specialConfig._isChecked = false)
          columnItem.customHeaderCell = () => {
            return {
              style: {
                width: '0px',
                visibility: 'hidden'
              }
            }
          }
          columnItem.customCell = () => {
            return {
              style: {
                width: '0px',
                visibility: 'hidden'
              }
            }
          }
        } else {
          columnItem._isChecked = true
          this.options.columns[columnIndex - 1] && (this.options.columns[columnIndex - 1]._specialConfig._isChecked = true)
          columnItem.customHeaderCell = () => {
            return {
              style: { }
            }
          }
          columnItem.customCell = () => {
            return {
              style: { }
            }
          }
        }
      })
    },
    onResetColumns() {
      this.options.columns.forEach(columnItem => {
        columnItem._specialConfig._isChecked = true
      })
      this.options.columnsData.forEach(columnItem => {
        this.$set(columnItem, 'customHeaderCell', () => {
          return {
            style: { }
          }
        })
        this.$set(columnItem, 'customCell', () => {
          return {
            style: { }
          }
        })
      })
    },
    // 显示设置 直接改变整个columnsData数组
    // onLoadLocalColumns(columnsLocal) {
    //   let columns = generateLocalColumns(columnsLocal)
    //   this.options.columnsData = columns
    // },
    // onReloadColumns(columnsNewStr) {
    //   if (!columnsNewStr) return false;

    //   let columns = generateReloadColumns(columnsNewStr, this.options.columnByKeyMap)
    //   this.options.columnsData = columns
    // },
    // onResetColumns() {
    //   this.options.columnsData = deepClone({ obj: this.options.columnsBackups }).obj
    // },
    // 序号
    handleRowIndexSwitch(val) {
      if (val) {
          if (this.options.columnsData[0].dataIndex === '_980355088_') return false;

          this.options.columnsData.unshift({
            // title: '序号',
            slots: { title: 'customTitle' },
            dataIndex: '_980355088_',
            width: 80,
            align: 'center',
            customRender: (value, row, index) => {
              const startIndex = ((Math.max(this.options.pagination.current || 1, 1) - 1) * this.options.pagination.pageSize)
              return (index + 1) + startIndex
            }
          })
        } else {
          if (this.options.columnsData[0].dataIndex === '_980355088_') {
            this.options.columnsData.shift()
          }
        }
    },
    // 行选择
    onSelectChange(selectedRowKeys, selectedRowData) {
      // console.log('selectedRowKeys changed-------->: ', selectedRowKeys, selectedRowData, this.options.rowSelectValuesByKeyStr);
      this.options.selectedRowKeys = selectedRowKeys;
      this.options.rowSelectValuesByKeyStr = selectedRowKeys.join(',')
      this.options.value = this.options.rowSelectValuesByKeyStr
    },
    // 行级渲染
    renderTrBackground(record, index) {
      let backItem = {
        tableRowData: record,
      };
      let eventList = this.options.statusEventList;
      // eventList &&
      //   eventList.forEach((aItem) => {
      //     if (aItem.type === "status-operate-if") {
      //       this.handlerParamBind([aItem.properties], record);
      //     }
      //   });

      let watchStatus = new WatchStatus(this, backItem);
      watchStatus.init(eventList);
      return {
        style: {
          "background-color": backItem.textBgColor,
          color: backItem.textColor,
        },
      };
    },
    renderTdBackground(record, index) {
      let backItem = {
        tableRowData: record,
      };

      this.options.columns.forEach((cItem) => {
        if (cItem._specialConfig.dataIndex == index) {
          let eventList = cItem._specialConfig.statusEventList;
          let watchStatus = new WatchStatus(this, backItem);
          watchStatus.init(eventList);
        }
      });
      return {
        style: {
          "background-color": backItem.textBgColor,
          color: backItem.textColor,
        },
      };
    },

    filterType(val) {
      if (val === 0) return "0 B";
      var k = 1024;
      var sizes = ["B", "KB", "MB", "GB", "PB", "TB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + "" + sizes[i];
    },
    downloadFile(fileItem) {
      this.download(fileItem.url, fileItem.fileName);
    },

    download(src, fileName) {
      let x = new XMLHttpRequest();
      x.open("GET", src, true);
      x.responseType = "blob";
      x.onload = function (e) {
        let url = window.URL.createObjectURL(x.response);
        let a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
      };
      x.send();
    },
    onHandleStatusConfigRender(rowData, actionItem, defaultValue, specialColIndex) {
      // console.log('--xx-----xx-----xx--->', actionItem, this.options)
      let operateItemComponentList = this.options.columnsConfigList[specialColIndex]?.componentList || []
      // let operateItem = this.options.columnsConfigList[specialColIndex]?.componentList[actionItem.multiRowIndex - 1] // 正常操作
      // 正常来说使用multiRowIndex下标就能从componentList里取到operateItem，但是！老数据multiRowIndex有问题，所以。。。下面骚操作
      let operateItem = null
      operateItemComponentList.forEach(item => {
        if (item.name === actionItem.colValue) {
          operateItem = item
        }
      })
      let returnElement = `<span></span>`;
      // console.log('--xx-----xx-----xx--->', this.options.columnsConfigList, specialColIndex, actionItem.multiRowIndex, actionItem)
      // console.log('--xx-----xx-----xx--->', operateItem)

      const defaultRenderFn = (renderText, isNotRender) => {
        if (isNotRender) return '<span></span>'

        let obj = {
          displayValue: "",
          color: "",
          isShow: true,
        };
        let statusConfigList = actionItem.statusConfigList;
        let colValue = rowData[actionItem.colValue]
          ? rowData[actionItem.colValue]
          : rowData[actionItem.colValue]===0?0:"";
        // 暂时注释了状态渲染 现在由状态渲染器处理
        // statusConfigList &&
        //   statusConfigList.forEach((item) => {
        //     colValue = rowData[actionItem.colValue];
        //     if (item.rowKey) {
        //       colValue = rowData[item.rowKey];
        //     }
        //     if (item.statusValue == colValue) {
        //       obj.displayValue = item.displayValue;
        //       obj.color = item.color;
        //       obj.isShow = item.isShow;
        //     }
        //   });

        let backItem = {
          tableRowData: rowData,
        };

        this.options.columns.forEach((cItem) => {
          if (cItem._specialConfig.dataIndex == actionItem.dataIndex) {
            let eventList = cItem._specialConfig.statusEventList;
            let watchStatus = new WatchStatus(this, backItem);
            watchStatus.init(eventList);
          }
        });

        if (backItem.textColor) {
          obj.color = backItem.textColor;
        }
        if (obj.isShow) {
          returnElement = `<span style="color: ${obj.color}">${
            renderText || obj.displayValue || defaultValue || colValue
          }</span>`;
        }
        if (!statusConfigList || !statusConfigList.length) {
          if (actionItem.valueType == "workFlow") {
            if (rowData["status"] == "") {
              defaultValue = "发起审核";
            } else if (rowData["status"] == "待审核") {
              defaultValue = "审核";
            } else if (rowData["status"] == "审核通过") {
              // TODO 区分通过还是审核否决
              defaultValue = "审核通过";
            } else if (rowData["status"] == "审核否决") {
              // TODO 区分通过还是审核否决
              defaultValue = "重新发起审核";
            } else {
              defaultValue = "发起审核";
            }
          }
          returnElement = `<span style="color: ${obj.color}">${
            renderText || defaultValue || colValue
          }</span>`;
        }
      }

      if (actionItem.colValue.indexOf("currentRow") > -1) {
        // 进入表达式处理
        // 先按照最简单的处理一下
        // let actionList = actionItem.colValue.split(".");
        // let aitem = rowData;
        // for(var i=1;i<actionList.length;i++){
        //   aitem = aitem[actionList[i]];
        // }

        // 创建script标签，执行script内容  每行渲染有点卡，后期可以优化
        let script = document.createElement("script");
        let tempJs = actionItem.colValue.replace("currentRow", "rowData");

        script.type = "text/javascript";
        script.text = `
          function showtest(rowData){
            // console.log('showtest',rowData,${tempJs});
            return ${tempJs};
          }
        `;
        document.getElementsByTagName("head")[0].appendChild(script);
        //rowData.xxx.xxx
        let tempx = showtest(rowData);
        returnElement = `<span>${tempx}</span>`;
      } else if (operateItem && operateItem._statusOperateSetTextOfType) {
        /************** 修改20230108 start ***************/
        // console.log('--xx-----xx-----xx--->', operateItem)
        // this.options.
        if (operateItem._statusOperateSetTextOfType === 'static') {
          defaultRenderFn(operateItem._statusOperateSetTextOfStaticValue)
        } else if (operateItem._statusOperateSetTextOfType === 'dynamic') {
          let a = rowData[operateItem._statusOperateSetTextOfLogicKey]
          let b = operateItem._statusOperateSetTextOfLogicValue
          let operator = operateItem._statusOperateSetTextOfLogicOperator
          if (operator === '=' && a == b) {
            defaultRenderFn(operateItem._statusOperateSetTextOfDynamicValue)
          } else if (operator === '>' && a > b) {
            defaultRenderFn(operateItem._statusOperateSetTextOfDynamicValue)
          } else if (operator === '>=' && a >= b) {
            defaultRenderFn(operateItem._statusOperateSetTextOfDynamicValue)
          } else if (operator === '<' && a < b) {
            defaultRenderFn(operateItem._statusOperateSetTextOfDynamicValue)
          } else if (operator === '<=' && a <= b) {
            defaultRenderFn(operateItem._statusOperateSetTextOfDynamicValue)
          } else if (operator === '!=' && a != b) {
            defaultRenderFn(operateItem._statusOperateSetTextOfDynamicValue)
          } else {
            defaultRenderFn('', true)
          }
        } else {
          defaultRenderFn()
        }
        /************** 修改20230108 end ***************/
      } else {
        defaultRenderFn()
      }
      // console.log('xxxxxxxxx', returnElement)
      return returnElement;
    },
    verification(val) {
      let valString = val + ""
      let verificationType = ["", "null", "undefined"]
      return verificationType.includes(valString)
    },
    onBindCellEvent(actionItem, rowData) {
      // 2022-02-09 这里修改了绑定值的逻辑
      // let tableBindDataRowKeyList = actionItem.tableBindDataRowKeyList || [];
      // tableBindDataRowKeyList.forEach((item) => {
      //   let key = item.value || "";
      //   if (key && rowData[key]) {
      //     this.$pageDataModelEngine.saveCustomData(key, rowData[key]);
      //   }
      // });

      /**
       * 2022-02-09 点击事件把绑定的时间遍历一遍，然后找到为B 绑定的参数，把值塞进去，
       * 这个逻辑不是很好理论上应该放在watch-page-event 里面处理,但是我暂时找不到方法吧rowData 传过去
       * 所以暂时这么处理
       * 接口
       * 页面跳转
       * 弹窗
       * 确认框
       *  */
      let eventList = actionItem.eventConfig.eventList;
      //
      eventList &&
        eventList.forEach((eventItem) => {
          if (eventItem.version == "1.0.0") {
            eventItem.actionList.forEach((aItem) => {
              if (aItem.type === "event-operate-interface") {
                this.handlerParamBind(
                  aItem.properties.interfaceDataConfig.paramsConfigs,
                  rowData
                );
              } else if (
                aItem.type === "event-operate-href" ||
                aItem.type === "event-operate-dialog-box"
              ) {
                this.handlerParamBind(
                  aItem.properties.interfaceDataConfig.hrefPageParams,
                  rowData
                );
              }else if( aItem.type === "event-operate-link"){
                this.handlerParamBind(
                  [aItem.properties.linkDynamic],
                  rowData
                );
              } else if (aItem.type === "event-operate-logic-judgment") {
                this.handlerParamBind([aItem.properties], rowData);
              } else if (aItem.type === "event-operate-set") {
                this.handlerParamBind(
                  [aItem.properties.actionSet.getInfo],
                  rowData
                );
              } else if(aItem.type === "event-operate-dialog-box-msg"){
                if (aItem.properties.actionSet != undefined && aItem.properties.actionSet != null && aItem.properties.actionSet.valueType == 'custom') {
                  this.handlerParamBind(
                    [aItem.properties.actionSet.getInfo],
                    rowData
                  );
                }
                
              }
            });
          } else {
            eventItem.actionList.forEach((aItem) => {
              if (aItem.actionType === "event-operate-interface") {
                this.handlerParamBind(
                  aItem.interfaceDataConfig.paramsConfigs,
                  rowData
                );
              } else if (
                aItem.actionType === "event-operate-href" ||
                aItem.actionType === "event-operate-dialog-box"
              ) {
                this.handlerParamBind(
                  aItem.interfaceDataConfig.hrefPageParams,
                  rowData
                );
              }
            });
          }
        });
      this.triggerEvent(actionItem);
    },
    handlerParamBind(paramsConfigs, rowData) {
      paramsConfigs.forEach((paramItem) => {
        if (paramItem.param_value_type == "B") {
          paramItem.param_value = rowData[paramItem.param_v_key];
        }
      });
    },
    onEditIcon(record, actionItem) {
      this.$set(record, "editable", true);
      this.$set(record, "editCol", actionItem.colValue);
    },
    onSaveIcon(record, columnName, columnValue) {
      this.$set(record, "editable", false);
      // console.log(record, columnValue, columnName)
      this.updateFieldService(record, columnName, columnValue);
    },
    handleColumnsConfigList(vals) {
      this.options.columnsData = [];
      this.options.columns = [];
      let language = navigator.language.substr(0, 2)
      vals.forEach((item, index) => {
        // console.log('xxxxxx 这里需要处理 xxxxxxxx', JSON.stringify(item))
        let columnItem = item || {};
        columnItem._isSpecialConfig = true;
        columnItem.type = "special-component-table-column";

        let titleValue = ''
        if (language == 'zh') {
          titleValue = item.value || item.enValue
        } else {
          titleValue = item.enValue || item.value
        }
        columnItem.title = titleValue;
        columnItem.dataIndex = item.dataIndex || "";
        columnItem.key = item.key || item.value;
        columnItem.align = item.align || "center";
        columnItem.colValueType = item.colValueType || "single-row";
        columnItem.colIndex = index;
        columnItem.specialColumnsConfigs = this.options.specialColumnsConfigs;
        columnItem.interfaceDataConfig = this.options.interfaceDataConfig;
        /************** 修改20230108 start ***************/
        const _componentListTemp = columnItem.componentList
        columnItem.componentList && delete columnItem.componentList;
        let componentList = this.handlerValueColumn(columnItem, _componentListTemp);
        columnItem.componentList = componentList;
        let columnsDataItem = JSON.parse(JSON.stringify(columnItem));
        delete columnsDataItem.componentList;
        /************** 修改20230108 end ***************/
        delete columnsDataItem.specialColumnsConfigs;
        delete columnsDataItem.interfaceDataConfig;
        columnsDataItem.customCell = (v) =>
          this.renderTdBackground(v, columnsDataItem.dataIndex);
        this.options.columnsData.push(columnsDataItem);
        this.options.columns.push({
          specialUUID: "table-column-" + generateUUID(),
          value: item.value,
          _specialConfig: columnItem, // 暂时不能删
          // componentList,
        });
      });
      this.options.reloadAsideMenu = Date.now(); // TODO::: 特殊处理，待优化，解决侧边栏页面结构不实时的问题

      //2022-06-08 工作流特殊处理
      let workFlowFlag = false;
      this.options.specialColumnsConfigs.forEach((specicalItem) => {
        if (specicalItem[0].valueType == "workFlow") {
          workFlowFlag = true;
        }
      });
      if (!workFlowFlag && this.options.workFlow.primaryKey) {
        // 处理 columnsConfigList 因为colData 会清空，所以根据configList push 一个
        let workFlowConfig = {
          value: "流程",
          title: "流程",
          colValue: "",
          dataIndex: "流程",
          key: "workflow",
          align: "center",
          type: "special-component-table-column",
          colValueType: "multi-row",
          valueType: "multi-row",
          colIndex: this.options.specialColumnsConfigs.length - 1,
          _isSpecialConfig: true,
          scopedSlots: {
            customRender: "流程",
          },
          specialColumnsConfigs: this.options.specialColumnsConfigs,
          interfaceDataConfig: this.options.interfaceDataConfig,
          componentList: [],
        };
        this.options.columnsConfigList.push(workFlowConfig);
        this.handlerWorkFlowCol();
      }
    },
    handlerWorkFlowCol() {
      let specialItem = {
        colValue: "提交审核",
        name: "",
        dataIndex: "流程",
        multiRowIndex: 0,
        valueType: "workFlow",
        statusConfigList: [],
        tableBindDataRowKeyList: [],
        tableDataRowKeyList: [],
        eventConfig: {},
        position: false,
        color: "#1890ff",
      };
      this.options.specialColumnsConfigs.push([specialItem]);

      let columnItem = {};
      columnItem._isSpecialConfig = true;
      columnItem.type = "special-component-table-column";
      columnItem.title = "提交审核";
      columnItem.dataIndex = "提交审核";
      columnItem.key = "提交审核";
      columnItem.align = "center";
      // single-row 或者多列
      columnItem.colValueType = "multi-row";
      columnItem.colIndex = this.options.specialColumnsConfigs.length - 1;
      columnItem.specialColumnsConfigs = this.options.specialColumnsConfigs;
      columnItem.interfaceDataConfig = this.options.interfaceDataConfig;
      /************** 修改20230108 start ***************/
      const _componentListTemp = columnItem.componentList
      columnItem.componentList && delete columnItem.componentList;
      let componentList = this.handlerValueColumn(columnItem, _componentListTemp);
      columnItem.componentList = componentList;
      let columnsDataItem = JSON.parse(JSON.stringify(columnItem));
      delete columnsDataItem.componentList;
      /************** 修改20230108 end ***************/
      delete columnsDataItem.specialColumnsConfigs;
      delete columnsDataItem.interfaceDataConfig;

      this.options.columnsData.push(columnsDataItem);
      this.options.columns.push({
        specialUUID: "table-column-" + generateUUID(),
        value: "提交审核",
        _specialConfig: columnItem, // 暂时不能删
        // componentList,
      });
    },
    handlerValueColumn(columnItem, _componentListTemp) {
      // console.log('--xx-----xx-----xx--->', _componentListTemp)
      // 页面结构树-值
      let specialConfigs =
        columnItem.specialColumnsConfigs[columnItem.colIndex];
      let childrenConfigs = columnItem.children || [];
      let componentList = [];
      let tableDataRowKeyList = [];
      let interfaceDataConfig = columnItem.interfaceDataConfig || {};
      // 从数据model 中获取 列名
      let interfaceListData = this.$pageDataModelEngine.getInterfaceData();
      interfaceListData &&
        interfaceListData.forEach((item) => {
          if (item.id == this.options.interfaceDataConfig.uuid) {
            // 2021-10-29 直接处理列  如果是表直接去 列，如果是别的，则解析response 返回的列表
            if (item.data.dataType == "table") {
              item.data.tableFieldList.forEach((tableFiled) => {
                tableDataRowKeyList.push(tableFiled.columnName);
              });
            } else if (
              item.type == "radio-button-interface" ||
              item.type == "radio-button-connect"
            ) {
              if (item.data.responseData) {
                let tableData =
                  item.data.responseData[columnItem.interfaceDataConfig.key];
                // 2021-11-30 这里我发现处理的的tablerowKey 用不到 这里处理的方式为直接塞到数据源 config 里面
                let tableFieldList = [];
                for (let key in tableData[0]) {
                  let colItem = {
                    columnName: key,
                  };
                  tableFieldList.push(colItem);
                  // 2022-1-5 tablerowKey 在行绑定李用到了。。
                  tableDataRowKeyList.push(key);
                }
                item.data.tableFieldList = tableFieldList;
              }
            }
          }
        });
      // 列值配置
      specialConfigs &&
        specialConfigs.forEach((item, index) => {
          /************** 修改20230108 start ***************/
          let _componentItemTemp = {}
          if (_componentListTemp && _componentListTemp.length) {
            _componentItemTemp = _componentListTemp[index]
          }
          let obj = {
            _isSpecialConfig: true,
            type: "special-component-table-column-value",
            uuid: generateUUID(),
            tableBindDataRowKeyList: item && item.tableBindDataRowKeyList,
            statusConfigList: item && item.statusConfigList,
            interfaceDataConfig: columnItem.interfaceDataConfig,
            tableDataRowKeyList,
            colValueType: columnItem.colValueType || "single-row",
            colIndex: columnItem.colIndex,
            specialColumnsConfigs: this.options.specialColumnsConfigs,
            options: {
              eventConfig: item.eventConfig,
            }, // JSON.parse(JSON.stringify(item.options || {})),
            _specialConfig: {
              _isSpecialConfig: true,
            },

            _statusEventList: _componentItemTemp._statusEventList || [],
            _statusOperateSetTextOfType: _componentItemTemp._statusOperateSetTextOfType,
            _statusOperateSetTextOfStaticValue: _componentItemTemp._statusOperateSetTextOfStaticValue,
            _statusOperateSetTextOfLogicKey: _componentItemTemp._statusOperateSetTextOfLogicKey,
            _statusOperateSetTextOfLogicValue: _componentItemTemp._statusOperateSetTextOfLogicValue,
            _statusOperateSetTextOfLogicOperator: _componentItemTemp._statusOperateSetTextOfLogicOperator,
            _statusOperateSetTextOfDynamicValue: _componentItemTemp._statusOperateSetTextOfDynamicValue
          };
          /************** 修改20230108 end ***************/
          // if (item.valueType === 'specialValue') {
          //   obj.name = item.name
          //   obj.value = item.name
          //   obj.multiRowIndex = item.multiRowIndex
          // } else {
          //   obj.name = item.colValue
          //   obj.value = item.colValue
          //   obj.multiRowIndex = item.multiRowIndex
          // }
          obj.name = item.colValue;
          obj.value = item.colValue;
          obj.multiRowIndex = item.multiRowIndex;
          // Object.assign(item, obj) // 会无限更新循环
          componentList.push(obj);
        });
      // 子列
      childrenConfigs &&
        childrenConfigs.length &&
        childrenConfigs.forEach((item) => {
          let obj = {
            _isSpecialConfig: true,
            type: "special-component-table-column",
            uuid: generateUUID(),
            // tableBindDataRowKeyList: item && item.tableBindDataRowKeyList,
            // statusConfigList: item && item.statusConfigList,
            // interfaceDataConfig: columnItem.interfaceDataConfig,
            // tableDataRowKeyList,
            // colValueType: columnItem.colValueType || 'single-row',
            // colIndex: columnItem.colIndex,
            // specialColumnsConfigs: this.options.specialColumnsConfigs,
            options: {}, // JSON.parse(JSON.stringify(item.options || {})),
            _specialConfig: {
              _isSpecialConfig: true,
            },
          };
          obj.name = item.title;
          obj.value = item.title;
          componentList.push(obj);
        });
      return componentList;
    },
    onCloseDialog() {
      let tableComponent = this.$parent.$parent.componentConfig;
      let uuidComponentList = [tableComponent];
      let watchPageEventV1_0_0 = new WatchPageEventV1_0_0(
        this,
        this.componentsConfigs,
        [],
        uuidComponentList,
        {},
        "PC"
      );
      watchPageEventV1_0_0.refreshComponent(tableComponent);
      this.dialogVisible = false;
    },
    triggerWorkFlow(actionItem, row) {
      let workFlow = this.options.workFlow;
      workFlow.recordId = row[workFlow.primaryKey];
      workFlow.status = row["status"];
      this.handlerWorkFlow(workFlow);
    },
    handlerWorkFlow(workFlow) {
      let actionList = workFlow.eventList || [];
      actionList &&
        actionList.every((node, index) => {
          // 找到开始节点
          if (node.type === "start") {
            // 执行方法 并找到next 节点执行
            this.nextEvent(node, actionList);
          }
        });
    },
    execWorkFlow(node, actionList) {
      let actionItem = node.properties;
      let operateApiId = actionItem.operateApiId;
      let isPause = false;
      let operateEventType = actionItem.actionType;
      if (operateEventType === "work-flow-approval") {
        let params = {
          currentUserBusinessId: this.options.workFlow.currentUserProcessId,
          dbConfigId: this.options.workFlow.dbconfigId,
          primaryKey: this.options.workFlow.primaryKey,
          recordId: this.options.workFlow.recordId,
          reviewAdvice: "",
          reviewBusinessId: actionItem.operateApiId,
          reviewResult: "",
          reviewMethod: actionItem.methods,
          tableName: this.options.workFlow.tableName,
          status: this.options.workFlow.status,
          title: "",
        };
        if (this.options.workFlow.status == "待审核") {
          params.title = "审核";
        } else if (!this.options.workFlow.status) {
          params.title = "发起确认";
        } else if (this.options.workFlow.status == "审核否决") {
          params.title = "重新发起确认";
        } else if (this.options.workFlow.status == "审核通过") {
          // 查看
          this.drawerVisible = true;
          this.detailParams = {
            dbConfigId: this.options.workFlow.dbconfigId,
            recordId: this.options.workFlow.recordId,
            tableName: this.options.workFlow.tableName,
          };
          this.$forceUpdate();
          return true;
        }
        this.drawerVisible = false;

        this.dialogVisible = true;
        this.workFlowParams = params;
        this.$forceUpdate();
      } else if (operateEventType === "work-flow-business-handler") {
        isPause = true;
        setTimeout(() => {
          // 解决本地存储异步问题
          // let varDataObj = getLocalData()
          // @ts-ignore
          let params = {};
          let paramsConfigs =
            actionItem.interfaceDataConfig.paramsConfigs || [];
          paramsConfigs.forEach((paramsConfig) => {
            params[paramsConfig.param_name] = this.getParamValue(
              paramsConfig.param_value
            ); // TODO::: 获取的记录id 审批人id 等需要换算成对应的值
          });
          const data = {
            dataApiId: operateApiId,
            params,
          };
          getProcesseDataList(data).then((res) => {
            this.nextEvent(node, actionList);
          });
        }, 0);
      } else if (operateEventType === "work-flow-if") {
        isPause = true;
        setTimeout(() => {
          // 解决本地存储异步问题
          // let varDataObj = getLocalData()
          // @ts-ignore
          let params = {};
          let paramsConfigs =
            actionItem.interfaceDataConfig.paramsConfigs || [];
          paramsConfigs.forEach((paramsConfig) => {
            params[paramsConfig.param_name] = this.getParamValue(
              paramsConfig.param_value
            ); // TODO::: 获取的记录id 审批人id 等需要换算成对应的值
          });
          const data = {
            dataApiId: operateApiId,
            params,
          };
          getProcesseDataList(data)
            .then((res) => {
              if (res.data["条件"] == "是") {
                this.nextEvent(node, actionList, true);
              } else {
                this.nextEvent(node, actionList, false);
              }
              // if (res.code === 0) {
              //   // 2021-12-18 按照新逻辑 存取
              //   let interfaceName;

              //   let obj = {
              //     label: interfaceName, // 依次判断数据接口、数据表、数据集
              //     value: {
              //       type: "customInterface",
              //       id: operateApiId,
              //       data: res.data
              //     },
              //   };
              //   this.vm.$pageDataModelEngine.saveCustomInterfaceData(operateApiId, obj);
              // }
              // this.nextEvent(node, actionList)
            })
            .catch(() => {});
        }, 0);
      }

      if (!isPause) {
        this.nextEvent(node, actionList);
      }
    },
    nextEvent(currenNode, actionList, judgment) {
      //遍历出下一个事件执行节点
      actionList &&
        actionList.forEach((node) => {
          if (typeof judgment == "undefined") {
            if (currenNode.outputs[0].next == node.id) {
              this.execWorkFlow(node, actionList);
            }
          } else if (judgment) {
            currenNode.outputs.forEach((oItem) => {
              if (oItem.title == "True" && oItem.next == node.id) {
                this.execWorkFlow(node, actionList);
              }
            });
          } else {
            currenNode.outputs.forEach((oItem) => {
              if (oItem.title == "False" && oItem.next == node.id) {
                this.execWorkFlow(node, actionList);
              }
            });
          }
        });
    },
    // 获取工作流 参数 TODO 剩下审批人什么的怎么取
    getParamValue(paramName) {
      if (paramName === "记录ID") {
        return this.options.workFlow.recordId;
      }
    },
    // table
    triggerEvent(actionItem) {
      if (
        !actionItem ||
        !actionItem.eventConfig ||
        !actionItem.eventConfig.eventList
      )
        return false;
      actionItem.eventConfig.eventList.forEach((eventItem) => {
        let eventDataPackage = {
          actionList: eventItem.actionList,
        };
        if (eventItem.eventType !== "change") {
          let eventHandle = new CustomEvent(
            `${this.options.generateComponentsUUID}-on-preload-handle-btn-confirm`,
            {
              detail: {
                eventType: eventItem.eventType,
                data: eventDataPackage,
                version: eventItem.version,
              },
            }
          );
          window.dispatchEvent(eventHandle);
        }
      });
    },
    handleTableChange(pagination, filters, sorter) {
      // console.log("handleTableChange", pagination, filters, sorter);
      if (!this.options.columnsData.length) {
        // options内columnsData属性为空数组，代表没有配置数据，故使用Mock数据渲染表格
        this.options.defaultPagination.current = pagination.current;
      } else if (
        this.options.contentDataSource === "radio-button-interface" ||
        this.options.contentDataSource == "radio-button-connect"
      ) {
        if (!this.options.pagingTotalKey) {
          this.options.pagination.current = pagination.current;
          this.options.pagination.pageSize = pagination.pageSize;
          return false;
        }
        // 为什么这么写？看一下chartsTypeData的值就知道了

        // 2022-05-06 直接页面级分页 完事  以后有需要再进行真分页
        /********************************** Table分页 Start ************************************/
        this.options.pagination.current = pagination.current;
        this.options.pagination.pageSize = pagination.pageSize;
        // console.log('j-------------------->', this.options.interfaceDataConfig)
        this.$set(this.options.interfaceDataConfig, 'tableData', [])

        let interfaceItemData = this.options.interfaceDataConfig;
        let allInterface = this.$pageDataModelEngine.getInterfaceData();
        allInterface&&allInterface.forEach(iItem=>{
          if(iItem.id==interfaceItemData.uuid){
            interfaceItemData=iItem.data;
          }
        })

        let id = interfaceItemData.id;
        // 组装请求参数
        let paramsConfigs = interfaceItemData.paramsConfigs || [];
        // console.log('xxxxxx', paramsConfigs)

        let params = {};
        paramsConfigs.forEach((paramsConfig) => {
          params[paramsConfig.param_name] = paramsConfig.param_value;
          if (paramsConfig.param_value_type === 'T') {
            if (paramsConfig.param_v_key === 'rownum') {
              params[paramsConfig.param_name] = this.options.pagination.pageSize;
            }
            if (paramsConfig.param_v_key === 'pagenum') {
              params[paramsConfig.param_name] = this.options.pagination.current;
            }
          }
        });
        // params["__sys__pageIndex"] = pagination.current;
        // params["__sys__pageSize"] = pagination.pageSize;
        // 发起请求
        const data = {
          dataApiId: id,
          params,
        };
        getProcesseDataList(data)
          .then((res) => {
            if (res.code === 0) {
              // console.log('xxxxxxxxxx-------------->', this.options.interfaceDataConfig, this.options.interfaceDataConfig.key, this.options.pagingTotalKey)
              // interfaceItemData.responseData.tableData = res.data.list;

              /******************* Ok Start *****************/
              // this.$set(this.options.interfaceDataConfig, 'tableData', res.data.list)
              // this.$set(this.options.pagination, 'total', res.data.total)

              /******************* Not Start *****************/
              this.$set(this.options.interfaceDataConfig, 'tableData', res.data[this.options.interfaceDataConfig.key])
              this.$set(this.options.pagination, 'total', res.data[this.options.pagingTotalKey])
              // this.options.pagination.current = pagination.current;

              // 回显行选择  20230209
              if (this.options.echoRowDataType === 'inside') {
                const _rowKeys = []
                this.options.interfaceDataConfig.tableData.forEach(item => {
                  const _boole = [1, '1', true, 'true'].includes(item[this.options.echoRowKeyByInside])
                  _boole && _rowKeys.push(item[this.options.rowSelectKey])
                })
                // console.log('xxxxxxxxxxxxx', _rowKeys)
                this.options.selectedRowKeys.push(..._rowKeys)
                this.options.selectedRowKeys = [...new Set(this.options.selectedRowKeys)]; // [65211, 65215, 65216]
              }
            } else {
              // this.$message.error(res.message)
            }
            interfaceItemData.queryIsReady = true;
            setTimeout(() => {
              // TODO::: 有问题，第一次加载时columns的行号会没有，应该是在其他地方给弄没了，坑！
              // console.log('----------------------------->', this.options.columnsData)
              this.handleRowIndexSwitch(this.options.rowIndexSwitch)
            }, 0)
          })
          .catch(() => {
            interfaceItemData.queryIsReady = true;
          });
          /********************************** Table分页 End ************************************/
      } else {
        this.options.pagination.current = pagination.current;
        let orderMap = {
          ascend: "asc",
          descend: "desc",
        };
        let orderByObj = {};
        if (sorter.field && orderMap[sorter.order])
          orderByObj[sorter.field] = orderMap[sorter.order];
        if (this.options.contentDataSource === "radio-button-tables") {
          this.getTableList(
            this.options.interfaceDataConfig.dbConfigId,
            this.options.interfaceDataConfig.tableName,
            orderByObj
          );
        } else if (this.options.contentDataSource === "radio-button-dataset") {
          this.getDefinition(
            this.options.interfaceDataConfig.dataSetId,
            orderByObj
          );
        }
      }
    },
    addSortFunc(sortable, item) {
      if (!sortable) {
        item.sorter = false;
      } else {
        item.sorter = this.compareSortFunction(item.dataIndex);
      }
    },
    compareSortFunction(propeties) {
      var compareSort = (rowa, rowb) =>
        this.sortFunction(rowa[propeties], rowb[propeties]);
      return compareSort;
    },
    sortFunction(a, b) {
      if (!a) {
        a = "";
      }
      if (!b) {
        b = "";
      }
      if (typeof a !== "number") {
        return a.localeCompare(b);
      } else {
        return a - b;
      }
    },
    // 请求数据表列表展示数据
    updateFieldService(rowData, columnName, columnValue) {
      // this.element.options.fieldParamesList.forEach(item => {
      //   if (item.fieldIsPrimary) {
      //      obj = {
      //         columnAlias: item.name,
      //         columnName: item.name,
      //         columnType: '',
      //         conditionType: '',
      //         conditionVal: items[item.name],
      //         operator: '='

      //       }
      //       tempData.push(obj)
      //   }
      // })
      let conditionList = [];
      let editData = [];
      conditionList.push({
        columnAlias: this.options.interfaceDataConfig.key,
        columnName: this.options.interfaceDataConfig.key,
        columnType: "",
        conditionType: "",
        conditionVal: rowData[this.options.interfaceDataConfig.key],
        operator: "=",
      });
      editData.push({
        conditionVal: columnValue,
        columnAlias: columnName,
        columnName: columnName,
        columnType: "char",
        conditionType: "",
        operator: "=",
      });
      const data = {
        conditionList,
        id: this.options.interfaceDataConfig.dbConfigId,
        name: this.options.interfaceDataConfig.tableName,
        setValueList: editData,
      };
      updateFieldDataList(data).then((res) => {
        if (res.code === 0) {
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getTableList(id, tableName, orderByObj) {
      let queryConfigs = this.options.interfaceDataConfig.queryConfigs || [];
      let conditionList = [];
      queryConfigs.forEach((queryConfig) => {
        if (
          !queryConfig.param_name ||
          !queryConfig.operator ||
          !queryConfig.param_value
        )
          return false;
        let obj = {
          columnName: queryConfig.param_name,
          columnAlias: queryConfig.param_name,
          columnType: queryConfig.fieldType,
          operator: queryConfig.operator,
          conditionVal: queryConfig.param_value,
          conditionType: queryConfig.param_value_type,
        };
        conditionList.push(obj);
      });
      const data = {
        conditionList,
        id,
        name: tableName,
        orderBy: [orderByObj],
        page: {
          pageIndex: this.options.pagination.current,
          pageSize: this.options.pagination.pageSize,
        },
        thirdMerchantNumber: "",
      };
      getFieldDataList(data).then((res) => {
        if (res.code === 0) {
          this.options.interfaceDataConfig.tableData = res.dataList; // 列表数据
          this.options.pagination.total = res.totalNumber;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 数据集
    getDefinition(id, orderByObj) {
      let queryConfigs = this.options.interfaceDataConfig.queryConfigs || [];
      let conditionList = [];
      queryConfigs.forEach((queryConfig) => {
        if (
          !queryConfig.param_name ||
          !queryConfig.operator ||
          !queryConfig.param_value
        )
          return false;
        let obj = {
          columnName: queryConfig.param_name,
          columnAlias: queryConfig.param_name,
          columnType: queryConfig.fieldType,
          operator: queryConfig.operator,
          conditionVal: queryConfig.param_value,
          conditionType: queryConfig.param_value_type,
        };
        conditionList.push(obj);
      });
      const data = {
        conditionList: conditionList,
        id,
        params: {},
        orderBy: [orderByObj],
        page: {
          pageIndex: this.options.pagination.current,
          pageSize: this.options.pagination.pageSize,
        },
        thirdMerchantNumber: "",
      };
      getReportDefinitionV2(data).then((res) => {
        if (res.code === 0) {
          this.options.interfaceDataConfig.tableData = res.dataList; // 列表数据
          this.options.pagination.total = res.totalNumber;
        } else {
          this.$message.error(res.message);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// 表头颜色透明（显示容器背景色）
/deep/.ant-table-thead > tr > th {
  background-color: transparent;
}
// 鼠标hover颜色透明（显示容器背景色）
/deep/.ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
  background-color: transparent;
}
/deep/.ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
  background-color: transparent;
}

.table-cell {
  .table-cell-operation {
    float: right;
    margin-right: 10px;
    i {
      cursor: pointer;
      font-size: 18px;
    }
    .edit-icon {
      visibility: hidden;
    }
  }
  &:hover .table-cell-operation .edit-icon {
    visibility: initial;
  }
}
.download-span {
  margin-left: 20px;
  color: #004ea2;
  cursor: pointer;
}
.file-img {
  height: 24px;
  width: auto;
}
</style>
