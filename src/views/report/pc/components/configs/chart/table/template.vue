<template>
  <div style="word-break: break-all">
    <a-table
      :columns="options.columnsData"
      :data-source="options.interfaceDataConfig.tableData"
      :pagination="options.pagination"
      bordered
      size="middle"
      :scroll="{ x: '100%', y: 240 }"
      @change="handleTableChange"
    >
      <!-- 实现思路：使用slot实现，注意：如果没有展示这个节点，可能是slot:key有问题 -->
      <div
        class="table-cell"
        :slot="key"
        slot-scope="text, record"
        v-for="(item, key) in options.specialColumnsConfigs"
        :key="key"
      >
        <span
          v-for="(actionItem, actionKey) in item"
          :key="actionKey"
          @click="onBindCellEvent(actionItem, record)"
        >
          <!-- <span v-if="actionItem.valueType === 'specialValue'" style="color: #1890ff;">
            <a @click="triggerEvent(actionItem)">{{ actionItem.name }}</a>
            <a-divider type="vertical" v-if="actionKey < item.length - 1" />
          </span> -->
          <span
            v-if="actionItem.valueType === 'value'"
            :style="{
              display: actionItem.position ? 'block' : 'inline-block',
              color: actionItem.color || '',
            }"
          >
            <!-- 2020-02-07 修改 -->
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
                  actionItem.colValue
                )
              "
              @click="triggerEvent(actionItem)"
            ></a>
            <a-divider type="vertical" v-if="actionKey < item.length - 1" />
          </span>
          <!-- 修改 -->
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
  </div>
</template>
<script>
import { EventBus } from "@/util/event-bus.js";
import { generateUUID } from "@/views/report/utils/index.js";
import { saveAndUpdateLocalData } from "@/views/report/utils/deal-data-cache/index";
import {
  updateFieldDataList,
  getFieldDataList,
  saveReportV3,
  getReportDefinitionV2,
} from "@/api/chartsData";
import optionsConfig from "./options-config";
export default {
  name: "pc-table-template",
  components: {},
  data() {
    return {
      options: optionsConfig,
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
  },
  created() {
    this.handleColumnsConfigList(this.options.columnsConfigList);
    if (this.options.columnsData && this.options.columnsData.length > 0) {
      // 添加排序方法
      this.options.columnsData.forEach((item) => {
        this.addSortFunc(item.sortable, item);
      });
    }
  },
  methods: {
    onHandleStatusConfigRender(rowData, actionItem, defaultValue) {
      // console.log("onHandleStatusConfigRender",rowData, actionItem, defaultValue)
      let returnElement = `<span></span>`;

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

        console.log("tempx", tempx);
        returnElement = `<span>${tempx}</span>`;
      } else {
        let obj = {
          displayValue: "",
          color: "",
          isShow: true,
        };
        let statusConfigList = actionItem.statusConfigList;
        let colValue = rowData[actionItem.colValue];
        statusConfigList &&
          statusConfigList.forEach((item) => {
            colValue = rowData[actionItem.colValue];
            if (item.rowKey) {
              colValue = rowData[item.rowKey];
            }
            if (item.statusValue == colValue) {
              obj.displayValue = item.displayValue;
              obj.color = item.color;
              obj.isShow = item.isShow;
            }
          });
        if (obj.isShow) {
          returnElement = `<span style="color: ${obj.color}">${
            obj.displayValue || defaultValue || colValue
          }</span>`;
        }
        if (!statusConfigList || !statusConfigList.length) {
          returnElement = `<span>${defaultValue || colValue}</span>`;
        }
      }

      return returnElement;
    },
    onBindCellEvent(actionItem, rowData) {
      let tableBindDataRowKeyList = actionItem.tableBindDataRowKeyList || [];
      tableBindDataRowKeyList.forEach((item) => {
        let key = item.value || "";
        if (key && rowData[key]) {
          // saveAndUpdateLocalData(key, rowData[key])
          this.$pageDataModelEngine.saveCustomData(key, rowData[key]);
          // let str = getStorage('_var_data_list_') || '{}'
          // let obj = JSON.parse(str)
          // obj[key] = rowData[key]
          // setStorage('_var_data_list_', JSON.stringify(obj))
        }
      });
    },
    onEditIcon(record, actionItem) {
      console.log("onEditIcon", record, actionItem);
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
      vals.forEach((item, index) => {
        let columnItem = item || {};
        columnItem._isSpecialConfig = true;
        columnItem.type = "special-component-table-column";
        columnItem.title = item.value;
        columnItem.dataIndex = item.dataIndex || "";
        columnItem.key = item.key || item.value;
        columnItem.align = item.align || "center";
        columnItem.colValueType = item.colValueType || "single-row";
        columnItem.colIndex = index;
        columnItem.specialColumnsConfigs = this.options.specialColumnsConfigs;
        columnItem.interfaceDataConfig = this.options.interfaceDataConfig;
        columnItem.componentList && delete columnItem.componentList;
        let componentList = this.handlerValueColumn(columnItem);
        columnItem.componentList = componentList;
        this.options.columnsData.push(columnItem);
        this.options.columns.push({
          specialUUID: "table-column-" + generateUUID(),
          value: item.value,
          _specialConfig: columnItem,
          componentList,
        });
      });
      this.options.reloadAsideMenu = Date.now(); // TODO::: 特殊处理，待优化，解决侧边栏页面结构不实时的问题
    },
    handlerValueColumn(columnItem) {
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
            } else if (item.type == "radio-button-interface") {
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
        specialConfigs.forEach((item) => {
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
          };
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
      // console.log(pagination, filters, sorter)
      if (this.options.contentDataSource === "radio-button-interface") {
        // 为什么这么写？看一下chartsTypeData的值就知道了
        return false;
      }
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
    },
    addSortFunc(sortable, item) {
      if (!sortable) {
        item.sorter = false;
      } else {
        item.sorter = true;
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
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
