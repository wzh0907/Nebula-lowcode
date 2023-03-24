<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :width="width"
    @open="dialogOpen"
  >
    <div class="add-data-wrap">
      <div class="silder-menu">
        <p
          v-if="showInterface"
          @click="onChangeType('radio-button-interface')"
          :class="{ active: selectedType === 'radio-button-interface' }"
        >
          后端服务
        </p>
        <p
          @click="onChangeType('radio-button-connect', null, item)"
          v-for="item in connectList"
          :key="item.id"
          :class="{
            active:
              selectedType === 'radio-button-connect' &&
              selectedConnectId === item.id,
          }"
        >
          {{ "接口：" + item.name }}
        </p>
        <p
          @click="onChangeType('radio-button-database', item.dbConfigId, item)"
          :class="{
            active:
              selectedType === 'radio-button-database' &&
              selectedDbId === item.dbConfigId,
          }"
          v-for="(item, index) in dataDbList"
          :key="index"
        >
          {{ "数据库：" + item.name }}
        </p>
        <!-- <p>组件市场</p> -->
      </div>
      <div class="data-content">
        <p style="padding: 20px 10px; font-weight: bold">
          {{ typeDict[selectedType] }}
        </p>
        <!-- 后端服务 -->
        <ul
          style="
            margin-left: 20px;
            margin-bottom: 50px;
            max-height: 500px;
            overflow-y: auto;
          "
          v-if="selectedType === 'radio-button-interface'"
        >
          <span v-for="item in interfaceApiList" :key="'tree' + item.treeId">
            <div v-if="item.dataType == 'directory'" :label="item.name">
              <div class="directory-div">{{ item.name }}</div>
              <li
                :class="{ active: selectedId === child.queryId }"
                style="display: inline-block; width: 33%; padding-bottom: 10px"
                v-for="child in item.children"
                :key="child.treeId"
                @click="onSelectedItem(child.queryId, child)"
              >
                {{ child.name }}
              </li>
            </div>
            <li
              v-else
              :class="{ active: selectedId === item.queryId }"
              style="display: inline-block; width: 33%; padding-bottom: 10px"
              @click="onSelectedItem(item.queryId, item)"
            >
              {{ item.name }}
            </li>
          </span>
          <!-- <li
            :class="{ active: selectedId === item.id }"
            style="display: inline-block; width: 33%; padding-bottom: 10px"
            v-for="(item, key) in interfaceApiList"
            :key="key"
            @click="onSelectedItem(item.id, item)"
          >
            {{ item.name }}
          </li> -->
        </ul>
        <!-- 系统连接 -->
        <ul
          style="margin-left: 20px; margin-bottom: 50px"
          v-if="selectedType === 'radio-button-connect'"
        >
          <span v-for="item in connectProcessList" :key="'tree' + item.treeId">
            <div v-if="item.dataType == 'directory'" :label="item.name">
              <div class="directory-div">{{ item.name }}</div>
              <li
                :class="{ active: selectedId === child.queryId }"
                style="display: inline-block; width: 33%; padding-bottom: 10px"
                v-for="child in item.children"
                :key="child.treeId"
                @click="onSelectedConnectItem(child.queryId, child)"
              >
                {{ child.name }}
              </li>
            </div>
            <li
              v-else
              :class="{ active: selectedId === item.queryId }"
              style="display: inline-block; width: 33%; padding-bottom: 10px"
              @click="onSelectedConnectItem(item.queryId, item)"
            >
              {{ item.name }}
            </li>
          </span>

<!--          <li-->
<!--            :class="{ active: selectedId === item.queryId }"-->
<!--            style="display: inline-block; width: 33%; padding-bottom: 10px"-->
<!--            v-for="item in connectProcessList"-->
<!--            :key="item.queryId"-->
<!--            @click="onSelectedConnectItem(item.queryId, item)"-->
<!--          >-->
<!--            {{ item.name }}-->
<!--          </li>-->
        </ul>
        <!-- 数据库 -->
        <div
          style="padding-left: 28px"
          v-if="selectedType === 'radio-button-database'"
        >
          <el-radio v-model="filterDatabaseChildrenType" label="class-all"
            >所有</el-radio
          >
          <el-radio v-model="filterDatabaseChildrenType" label="class-table"
            >数据表</el-radio
          >
          <el-radio v-model="filterDatabaseChildrenType" label="class-sql"
            >SQL脚本</el-radio
          >
          <el-radio v-model="filterDatabaseChildrenType" label="class-view"
            >视图</el-radio
          >
          <el-input
            placeholder="搜索"
            suffix-icon="el-icon-search"
            style="width: 150px"
            size="mini"
            clearable
            v-model="filterDatabaseChildrenKey"
            @input="changeDataKey"
          >
          </el-input>
        </div>
        <div class="table-content">
          <ul
            style="margin-left: 20px; padding-left: 10px"
            v-for="(dbDataChildrenItem, key) in tempFilter.children"
            :key="key"
            v-if="
              selectedType === 'radio-button-database' &&
              tempFilter.children &&
              (filterDatabaseChildrenType === 'class-all' ||
                filterDatabaseChildrenType === dbDataChildrenItem.dataType)
            "
          >
            <p
              style="padding: 10px 0px; padding-bottom: 20px; font-weight: bold"
              v-if="dbDataChildrenItem.children.length"
            >
              {{ typeDict[dbDataChildrenItem.dataType] }}
            </p>
            <li
              :class="{ active: selectedId === item.name }"
              style="display: inline-block; width: 33%; padding-bottom: 10px"
              v-for="(item, key) in dbDataChildrenItem.children"
              :key="key"
              @click="onSelectedItem(item.name, item)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>

        <div style="position: absolute; right: 15px; bottom: 15px">
          <el-button @click="onClose" size="small">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="small"
            >确 定</el-button
          >
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import DragDialog from '@/directive/drag-dialog'
import { generateUUID } from "@/views/report/utils/index.js";
import { getReportInterfaceList } from "@/api/chartsData";
import {
  getDbSrclist,
  getDbTableList,
  getDbViewList,
  getDbSqlList,
} from "@/api/database-command/index.js";
import {
  getConnectListService,
  getConnectProcessListService,
} from "@/api/database.js";
import { getProjectFileTreeListV5Service } from "@/api/v5";
export default {
  props: {
    visible: Boolean,
    loadingText: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "900px",
    },
    form: {
      type: Boolean,
      default: true,
    },
    action: {
      type: Boolean,
      default: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    showInterface: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogVisible: this.visible,
      dataDbList: [],
      selectedDbId: "",
      selectedConnectId: "",
      selectedDbData: {},
      filterDatabaseChildrenType: "class-all",
      filterDatabaseChildrenKey: "",

      tablesList: [],
      datasetList: [],
      interfaceApiList: [],
      connectList: [],
      connectProcessList: [],
      selectedType: "radio-button-interface",
      selectedSubType: "",
      selectedId: "",
      selectedData: {},
      tempFilter: {},
      typeDict: {
        "radio-button-interface": "后端服务",
        "radio-button-connect": "系统连接",
        "radio-button-database": "选择数据库数据",
        // 'radio-button-dataset': '数据集',

        "class-table": "数据表",
        "class-view": "视图",
        "class-sql": "SQL脚本",
      },
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
  },
  created() {
    // this.queryTablesListApiService()
  },
  mounted() {},
  methods: {
    dialogOpen() {
      if (this.showInterface) {
        this.selectedType = "radio-button-interface";
        this.queryInterfaceDataList();
      } else {
        this.selectedType = "radio-button-database";
      }
      // this.queryReportDaSetList()
      // this.queryDbSrclist();
      this.queryConnectList();
    },
    onClose() {
      this.$emit("onClose");
    },
    onSubmit() {
      // let dataObj = JSON.parse(JSON.stringify(this.selectedData))
      let dataObj = {
        id: this.selectedData.queryId,
        name: this.selectedData.name,
      };
      console.log('----dataObj----',dataObj)
      if (this.selectedType === "radio-button-database") {
        if (this.selectedSubType === "table") {
          dataObj.type = "radio-button-tables";
        } else if (this.selectedSubType === "view") {
          dataObj.type = "radio-button-view";
        } else if (this.selectedSubType === "sql") {
          dataObj.type = "radio-button-dataset";
        }
      } else if (this.selectedType === "radio-button-connect") {
        dataObj.type = "radio-button-connect";
        dataObj.id=this.selectedData.queryId;
        dataObj.name=this.selectedData.name
      } else {
        dataObj.type = "radio-button-interface";
      }
      dataObj.mockFlag = false;
      this.$emit("onSubmit", {
        type: dataObj.type,
        id: generateUUID("data-interface-"), // this.selectedId,
        data: dataObj,
      });
    },
    // on
    onChangeType(type, id, item) {
      this.selectedType = type;
      this.selectedDbId = id || "";
      console.log("onChangeType", type, id, item);
      if (id) {
        item.children[0].children = [];
        item.children[1].children = [];
        item.children[2].children = [];
        // console.log(item)
        this.queryDbTableList(item.children[0].children, id, item.businessId);
        this.queryDbViewList(item.children[1].children, id);
        this.queryDbSqlList(item.children[2].children, id, item.businessId);
        this.selectedDbData = item;
        this.tempFilter = this.selectedDbData;
      } else {
        if (type === "radio-button-connect") {
          this.selectedConnectId = item.id || "";
          getConnectProcessListService({
            connectId: item.id,
          }).then((res) => {
            this.connectProcessList = res.dataList || [];
          });
        }
        this.selectedDbData = {};
        this.tempFilter = this.selectedDbData;
      }
    },

    onSelectedItem(id, data) {
      this.selectedId = id;
      this.selectedData = data;
      this.selectedSubType = data.dataType;
    },
    onSelectedConnectItem(id, data) {
      this.selectedId = id;
      this.selectedData = data;
      this.selectedSubType = data.processType;
    },
    changeDataKey(value) {
      this.tempFilter = {};
      if (!value) {
        this.tempFilter = this.selectedDbData;
      } else {
        let tempchildren = [];
        this.selectedDbData.children.forEach((item) => {
          let children = [];
          item.children.forEach((subItem) => {
            if (subItem.name.indexOf(value) > -1) {
              children.push(subItem);
            }
          });
          let param = {
            businessId: item.businessId,
            dataType: item.dataType,
            dbConfigId: item.dbConfigId,
            name: item.name,
            children: children,
          };
          tempchildren.push(param);
        });
        this.tempFilter = {
          businessId: this.selectedDbData.businessId,
          dataType: this.selectedDbData.dataType,
          dbConfigId: this.selectedDbData.dbConfigId,
          name: this.selectedDbData.name,
          children: tempchildren,
        };
      }

      console.log("changeDataKey", this.tempFilter);
    },
    // 数据库
    queryDbSrclist() {
      this.dataDbList = [];
      getDbSrclist().then((res) => {
        const dataList = res.dataList || [];
        dataList.forEach((item) => {
          // if (item.dbType === 'SQLSERVER' || item.type === 'connect') return false
          if (item.type === "connect") return false;
          const tableChildren = [];
          const viewChildren = [];
          const sqlChildren = [];
          this.dataDbList.push({
            name: item.dbName,
            businessId: item.businessId,
            dbConfigId: item.id,
            dataType: "database",
            children: [
              {
                name: "数据表",
                businessId: item.businessId,
                dbConfigId: item.id,
                dataType: "class-table",
                children: tableChildren,
              },
              {
                name: "视图",
                businessId: item.businessId,
                dbConfigId: item.id,
                dataType: "class-view",
                children: viewChildren,
              },
              {
                name: "SQL脚本",
                businessId: item.businessId,
                dbConfigId: item.id,
                dataType: "class-sql",
                children: sqlChildren,
              },
            ],
          });
        });
      });
    },
    queryDbTableList(children, dbConfigId, businessId) {
      getDbTableList({
        dbConfigId,
      }).then((res) => {
        const dataList = res.dataList || [];
        dataList.forEach((item) => {
          children.push({
            // id: 10924,
            businessId,
            dbConfigId,
            dataType: "table",
            name: item.name,
            tableName: item.name,
            // execSqlText: "select * from demo_data",
          });
        });
        // this.handleNodeClick(children[0]);
      });
    },
    queryDbViewList(children, dbConfigId) {
      getDbViewList({
        dbConfigId,
      }).then((res) => {
        const dataList = res.dataList || [];
        dataList.forEach((item) => {
          children.push({
            name: item.name,
            dbConfigId,
            dataType: "view",
            execSqlText: item.remarks,
          });
        });
      });
    },
    queryDbSqlList(children, dbConfigId, businessId) {
      getDbSqlList({
        dbConfigId,
      }).then((res) => {
        const dataList = res.dataList || [];
        dataList.forEach((item) => {
          children.push({
            businessId,
            id: item.businessId,
            dbConfigId,
            dataType: "sql",
            name: item.dataSetName,
            execSqlText: item.execSqlText,
          });
        });
      });
    },
    // 后端服务
    queryInterfaceDataList() {
      getProjectFileTreeListV5Service().then((res) => {
        this.interfaceApiList = res.dataList;
        // console.log(this.interfaceApiList)
      });
    },
    queryConnectList() {
      getConnectListService().then((res) => {
        if (res.code == 0) {
          this.connectList = res.dataList;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
p {
  margin: 0;
  padding: 0;
}
.add-data-wrap {
  display: flex;
  min-height: 500px;
  .silder-menu {
    width: 180px;
    border-right: 1px solid #ccc;
    text-align: left;
    p {
      padding: 20px 0px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
    .active {
      color: #409eff;
    }
  }
  .data-content {
    flex: 1;
    padding-bottom: 50px;
    ul {
      li {
        cursor: pointer;
      }
    }
    .active {
      color: #409eff;
    }
  }
  .table-content {
    max-height: 60vh;
    overflow-y: auto;
  }
}
/deep/.el-dialog__header {
  display: none;
}
/deep/.el-dialog__body {
  padding-top: 0px;
  padding-bottom: 0px;
}
.directory-div {
  background-color: #ccc;
  padding: 5px 10px;
}
</style>
