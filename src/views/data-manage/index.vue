<template>
  <el-container v-loading="listLoading" style="flex-direction: column">
    <el-main>
      <div class="tableau-page" style="background-color: #F5F5F5">
        <div class="tableau-sider" :style="{ height: contentViewHeight }">
          <div class="database-block">
            <h2>
              数据源
              <span @click="onAddDatabase()">添加</span>
            </h2>
          </div>
          <div>
            <div class="table-list" :style="{ height: contentTableListHeight }">
              <el-tree
                ref="tree"
                class="file-tree-nodes"
                node-key="code"
                highlight-current
                :default-expanded-keys="expandedList"
                :default-expand-all="defaultExpandAll"
                :expand-on-click-node="false"
                :data="treeDataList"
                :props="defaultProps"
                :load="loadNode"
                lazy
                @node-expand="nodeExpand"
	              @node-collapse="nodeCollapse"
                @node-click="handleNodeClick"
              >
                <span slot-scope="{ data }" class="tree-item-text-wrap">
                  <span>
                    {{ data.name || "无效数据源" }}
                  </span>
                  <el-popover
                    v-show="data.dataType && data.dataType !== 'class-table' && data.dataType !== 'table'"
                    :visible-arrow="false"
                    placement="right"
                    width="150"
                    trigger="hover"
                  >
                    <ul class="file-popover-menu">
                      <!-- 数据库的菜单 -->
<!--                      <li-->
<!--                        v-if="data.dataType === 'database'"-->
<!--                        @click="onCreateTable('table', data)"-->
<!--                      >-->
<!--                        创建表-->
<!--                      </li>-->
<!--                      <li-->
<!--                        v-if="data.dataType === 'database'"-->
<!--                        @click="onCreateTable('sql', data)"-->
<!--                      >-->
<!--                        创建SQL脚本-->
<!--                      </li>-->
<!--                      <li-->
<!--                        v-if="data.dataType === 'database'"-->
<!--                        @click="onCreateTable('view', data)"-->
<!--                      >-->
<!--                        创建视图-->
<!--                      </li>-->
<!--                      <li-->
<!--                        v-if="data.dataType === 'database'"-->
<!--                        @click="onCreateTable('procedure', data)"-->
<!--                      >-->
<!--                        创建存储过程-->
<!--                      </li>-->
                      <!-- 新建 -->
                      <li
                        v-if="data.dataType === 'class-table'"
                        @click="onCreateTable('table', data)"
                      >
                        新建
                      </li>
                       <li
                        v-if="data.dataType === 'class-sql'"
                        @click="onCreateTable('sql', data)"
                      >
                        新建
                      </li>

                      <li
                        v-if="data.dataType === 'class-view'"
                        @click="onCreateTable('view', data)"
                      >
                        新建
                      </li>
                      <li
                        v-if="data.dataType === 'class-procedure'"
                        @click="onCreateTable('procedure', data)"
                      >
                        新建
                      </li>
                      <!-- 操作 -->
                      <li
                        v-if="data.dataType === 'table'"
                        @click="onSqlQueryTable(data)"
                      >
                        查询
                      </li>
                      <li
                        v-if="data.dataType === 'database'"
                        @click="onAddDatabase(data.businessId)"
                      >
                        配置
                      </li>
                      <li
                        v-if="data.dataType === 'database'"
                        @click="onDelDatabase(data.businessId)"
                      >
                        删除
                      </li>
                      <li
                        v-else-if="['class-table', 'class-sql', 'class-view', 'class-procedure'].indexOf(data.dataType) === -1"
                        @click="
                          onDelData(data.dataType, data.dbConfigId, data.name, data.id)
                        "
                      >
                        删除
                      </li>
                    </ul>
                    <i slot="reference" class="el-icon-more" />
                  </el-popover>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
        <div class="tableau-content" :style="{ height: contentViewHeight }">
          <div class="content-header" v-if="isUpdateTableData && selectedDataType === 'table'">
            <tableInfo
              :is-create-table="isCreateTable"
              :table-name="selectedTableName"
              :table-id="selectedTableId"
              :database-id="selectedDbId"
              :dataSourceName="selectedDataSourceName"
              @reload="queryDbSrclist"
            />
            <!-- 视图或存储过程 -->
          </div>
          <dataViewProcedure
            v-if="isUpdateTableData && ['view', 'procedure', 'table-query'].indexOf(selectedDataType) !== -1"
            :is-create-table="isCreateTable"
            :selectId="selectId"
            :name="selectedTableName"
            :database-id="selectedDbId"
            :selected-data-type="selectedDataType"
            :data-detail="selectedDataDetail"
            @reload="queryDbSrclist"
          />
          <sqlScriptIndex
            v-else-if="isUpdateTableData && selectedDataType === 'sql'"
            :id="selectedDataDetail.id"
            current-data-type="dataset"
            :current-file-data="{}"
            script-model="scriptModel"
            @reload='queryDbSrclist'
          />
        </div>
      </div>
      <!-- dialog -->
      <addViewProcedure
        :dialog-visible.sync="dataAddDialogVisible"
        :add-data-type="addDataType"
        title="添加数据"
        @addFile="onAddFile"
      />
      <!-- addDatabase -->
      <addDatabase
        :id="selectedDatabaseId"
        :dialog-visible.sync="databaseDialogVisible"
        title="数据源库"
        @reload="queryDbSrclist"
      />
    </el-main>
  </el-container>
</template>

<script>
import customHeader from "@/components/customHeader/index";
import addDatabase from "./add-database.vue";
import tableInfo from "./table-info/index.vue";
import dataViewProcedure from "./data-view-procedure/index.vue";
import addViewProcedure from "./data-view-procedure/add.vue";
import sqlScriptIndex from '@/views/data-manage/sql-script/index.vue'
import {
  getDbSrclist,
  getDbTableList,
  getDbSqlList,
  getDbViewList,
  getDbProcedureList,
  deleteDataTable,
  deleteDataView,
  deleteDataProcedure,
} from "@/api/database-command/index.js";
import { delDatabaseV4, saveDatasetV4, delDatasetV4 } from "@/api/v4/index.js";
export default {
  name: "DataManage",
  components: {
    customHeader,
    addDatabase,
    tableInfo,
    dataViewProcedure,
    addViewProcedure,
    sqlScriptIndex
  },
  props: ["id", "currentDataType"],
  data() {
    return {
      addDataType: "table",
      isCreateTable: false,
      dataAddDialogVisible: false,
      selectedDatabaseId: 0,
      databaseDialogVisible: false,
      listLoading: false,
      contentViewHeight: "0px",
      contentHeaderHeight: "",
      contentTableListHeight: "",
      defaultExpandAll: false,
      tabHeaderView: "data",
      isUpdateTableData: true,
      selectedDataType: "table",
      selectedDbId: 0,
      selectedBusinessId: 0,
      selectedTableId: 0,
      selectedTableName: "",
      selectedDataDetail: {},
      selectedDataSourceName:"",
      treeDataList: [],
      selectId:0,
      expandedList: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: 'leaf'
      },
    };
  },
  computed: {},
  created() {
    this.queryDbSrclist();
  },
  mounted() {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    //  - 55;
    this.contentViewHeight = height + "px";
    this.contentHeaderHeight = height - 55 * 2 - 10 + "px"; // (55 * 2) = 两个nav高度、10 = padding-top-bottom
    this.contentTableListHeight = height - 185 + "px";
  },
  methods: {
     nodeExpand(data) {
       console.log('nodeExpand',data,data.code)
	      this.expandedList.push(data.code); // 在节点展开是添加到默认展开数组
	    },
	    nodeCollapse(data) {
	      this.expandedList.splice(this.expandedList.indexOf(data.code), 1); // 收起时删除数组里对应选项
	    },
    onSqlQueryTable(data) {
      this.selectedDataType = "table-query";
      this.selectedDataDetail = data;
      this.selectedDbId = data.dbConfigId;
      this.selectedTableName = data.tableName;
      this.isCreateTable = false;
      this.isUpdateTableData = false;
      this.$nextTick(() => {
        this.isUpdateTableData = true;
      });
    },
    onAddFile(type, name) {
      if (type === 'sql') {
        let saveFileService = saveDatasetV4
        const params = {
          parentId: 0
        }
        params.name = name
        params.limit = 10
        params.dbConfigId = this.selectedBusinessId
        params.filterConfig = '{}'
        params.statisticsConfig = '{}'
        params.dataSetFieldList = []
        params.processList = []
        params.sqlParamList = []
        params.type = 'query'
        params.modeType = 'sql'
        params.graphConfig = '{"nodeId":0,"parentConnectData":{},"rightNodes":[]}'
        saveFileService(params).then(res => {
          this.queryDbSrclist();
        }).catch(() => {})
      } else {
        this.selectedDataType = type;
        this.selectedTableName = name;
        this.selectedTableId = "";
        this.selectId=0;
        this.isCreateTable = true;
        this.isUpdateTableData = false;
        this.$nextTick(() => {
          this.isUpdateTableData = true;
        });
      }
    },
    onDelDatabase(dbConfigId) {
      this.$confirm("确认删除此数据库？")
        .then((_) => {
          delDatabaseV4({
            configId: dbConfigId,
          }).then((res) => {
            this.$message.success("删除成功");
            this.queryDbSrclist();
          });
        })
        .catch((_) => {});
    },
    onDelData(dataType, dbConfigId, dataName, sqlId) {
      let service = {};
      let params = {};
      if (dataType === "table") {
        service = deleteDataTable;
        params = {
          dbConfigId,
          tableName: dataName,
        };
      } else if (dataType === "view") {
        service = deleteDataView;
        params = {
          dbConfigId,
          name: dataName,
        };
      } else if (dataType === "procedure") {
        service = deleteDataProcedure;
        params = {
          dbConfigId,
          name: dataName,
        };
      } else if (dataType === "sql") {
        service = delDatasetV4;
        params = {
          dsConfigId: sqlId,
        };
      }
      this.$confirm("确认删除本条数据？")
        .then((_) => {
          service(params).then((res) => {
            this.$message.success("删除成功");
            this.queryDbSrclist();
          });
        })
        .catch((_) => {});
    },
    onCreateTable(type, data) {
      this.addDataType = type;
      this.selectedDbId = data.dbConfigId;
      this.selectedBusinessId = data.businessId;
      this.dataAddDialogVisible = true;
    },
    handleNodeClick(data) {
      console.log('sql', data, this.selectedDbId)
      if (!data) return false;
      this.selectedDataDetail = data;
      this.selectedDataType = data.dataType;
      this.selectedDbId = data.dbConfigId;
      this.selectedTableId = data.id;
      this.selectedTableName = data.tableName;
      this.selectedDataSourceName = data.dataSourceName;
      if(data.dataType=='view'||data.dataType=="procedure"){
        this.selectId = data.id;
      }
      // console.log("handleNodeClick", this.selectedTableId);

      this.isCreateTable = false;
      this.isUpdateTableData = false;
      this.$nextTick(() => {
        this.isUpdateTableData = true;
      });
    },
    onAddDatabase(id) {
      if (id) {
        this.selectedDatabaseId = id;
      } else {
        this.selectedDatabaseId = "";
      }
      this.databaseDialogVisible = true;
    },
    queryDbSrclist() {
      this.treeDataList = [];
      this.selectedDataType="";
      getDbSrclist().then((res) => {
        const dataList = res.dataList || [];
        dataList.forEach((item) => {
          // if (item.dbType === 'SQLSERVER' || item.type === 'connect') return false
          if (item.type === "connect") return false;
          const tableChildren = [];
          const sqlChildren = [];
          const viewChildren = [];
          const procedureChildren = [];
          // this.queryDbTableList(tableChildren, item.id)
          // this.queryDbViewList(viewChildren, item.id)
          // this.queryDbProcedureList(procedureChildren, item.id)
          this.treeDataList.push({
            name: item.dataSourceName,
            code:item.businessId+item.dataSourceName,
            businessId: item.businessId,
            dbConfigId: item.id,
            dataType: "database",
            children: [
              {
                name: "数据表",
                code:item.businessId+"数据表",
                businessId: item.businessId,
                dbConfigId: item.id,                
                dataType: "class-table",
                children: tableChildren,
              },
              {
                name: "SQL脚本",
                code:item.businessId+"SQL脚本",
                businessId: item.businessId,
                dbConfigId: item.id,
                dataType: "class-sql",
                children: sqlChildren,
              },
              // {
              //   name: "视图",
              //   code:item.businessId+"视图",
              //   businessId: item.businessId,
              //   dbConfigId: item.id,
              //   dataType: "class-view",
              //   children: viewChildren,
              // },
              // {
              //   name: "存储过程",
              //   code:item.businessId+"存储过程",
              //   businessId: item.businessId,
              //   dbConfigId: item.id,
              //   dataType: "class-procedure",
              //   children: procedureChildren,
              // },
            ],
          });
        });
      });
    },
    loadNode(node, resolve) {
      // console.log("loadNode", node, resolve);
      // if (node.level === 0) {
      //   return resolve([{ name: 'region' }]);
      // }
      if (node.level === 1) {
        let item = node.data;
        let children = [
          {
            name: "数据表",
            code:item.businessId+"数据表",
            businessId: item.businessId,
            dbConfigId: item.businessId,
            dataType: "class-table",
            children: []
          },
          {
            name: "SQL脚本",
            code:item.businessId+"SQL脚本",
            businessId: item.businessId,
            dbConfigId: item.id,
            dataType: "class-sql",
            children: []
          },
          // {
          //   name: "视图",
          //   code:item.businessId+"视图",
          //   businessId: item.businessId,
          //   dbConfigId: item.businessId,
          //   dataType: "class-view",
          //   children: []
          // },
          // {
          //   name: "存储过程",
          //   code:item.businessId+"存储过程",
          //   businessId: item.businessId,
          //   dbConfigId: item.businessId,
          //   dataType: "class-procedure",
          //   children: []
          // },
        ];
        return resolve(children);
      }
      if (node.level === 2) {
        let item = node.data;
        let dbConfigId = parseInt(item.businessId);
        // console.log("item", item);
        if (item.dataType === "class-table") {
          let tableChildren = [];
          getDbTableList({
            dbConfigId: dbConfigId,
          }).then((res) => {
            const dataList = res.dataList || [];
            dataList.forEach((item) => {
              tableChildren.push({
                dbConfigId,
                dataType: "table",
                name: item.name,
                tableName: item.name,
                dataSourceName:item.dbConfigName,
                leaf: true
              });
            });
            return resolve(tableChildren);
          });
        } else if (item.dataType === "class-sql") {
          let sqlChildren = [];
          getDbSqlList({
            dbConfigId,
          }).then((res) => {
            const dataList = res.dataList || [];
            dataList.forEach((item) => {
              sqlChildren.push({
                id: item.businessId,
                dbConfigId,
                dataType: "sql",
                name: item.dataSetName,
                execSqlText: item.execSqlText,
                leaf: true
              });
            });
            return resolve(sqlChildren);
          });

          // getDbTableList({
          //   dbConfigId: dbConfigId,
          // }).then((res) => {
          //   const dataList = res.dataList || [];
          //   dataList.forEach((item) => {
          //     sqlChildren.push({
          //       dbConfigId,
          //       dataType: "table",
          //       name: item.name,
          //       tableName: item.name,
          //       leaf: true
          //     });
          //   });
          //   return resolve(sqlChildren);
          // });
        } else if (item.dataType === "class-view") {
          const viewChildren = [];
          getDbViewList({
            dbConfigId,
          }).then((res) => {
            const dataList = res.dataList || [];
            dataList.forEach((item) => {
              viewChildren.push({
                name: item.name,
                dbConfigId,
                dataType: "view",
                execSqlText: item.sql,
                id:item.id,
                leaf: true
              });
            });
            return resolve(viewChildren);
          });
        } else if (item.dataType === "class-procedure") {
          const procedureChildren = [];
          getDbProcedureList({
            dbConfigId,
          }).then((res) => {
            const dataList = res.dataList || [];
            dataList.forEach((item) => {
              procedureChildren.push({
                name: item.name,
                dbConfigId: item.dbConfigId,
                dataType: "procedure",
                id:item.id,
                // children: [],
                leaf: true
              });
            });
            return resolve(procedureChildren);
          });
        }
      }
    },
    queryDbTableList(children, dbConfigId) {
      getDbTableList({
        dbConfigId,
      }).then((res) => {
        const dataList = res.dataList || [];
        dataList.forEach((item) => {
          children.push({
            id: 10924,
            dbConfigId,
            dataType: "table",
            name: item.name,
            tableName: item.name,
            execSqlText: "select * from demo_data",
          });
        });
        this.handleNodeClick(children[0]);
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
    queryDbProcedureList(children, dbConfigId) {
      getDbProcedureList({
        dbConfigId,
      }).then((res) => {
        const dataList = res.dataList || [];
        dataList.forEach((item) => {
          children.push({
            name: item.name,
            dbConfigId: item.dbConfigId,
            dataType: "procedure",
            children: [],
          });
        });
      });
    }
  },
};
</script>

<style lang="scss" scoped>
ul,
p {
  margin: 0;
  padding: 0;
}
/deep/.node {
  font: 12px sans-serif;
}

/deep/.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 1.5px;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.el-main {
  padding: 0;
  overflow: initial;
}
.file-tree-nodes {
  padding-left: 4px;
}
.tree-item-text-wrap {
  width: 100%;
  .tree-text-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    display: inline-block;
    width: 90%;
    vertical-align: middle;
  }
  .rename-input {
    border: 0;
    border-bottom: 1px solid;
    width: 95%;
  }
  .el-icon-more {
    visibility: hidden;
    position: absolute;
    right: 2px;
    margin-top: 5px;
  }
  &:hover {
    .el-icon-more {
      visibility: inherit;
    }
  }
  .el-icon-more:hover {
    color: red;
  }
}
.file-popover-menu {
  margin: 0;
  padding: 0;
  font-size: 13px;
  li {
    padding: 5px;
    padding-left: 10px;
    // height: 20px;
    // line-height: 20px;
    cursor: pointer;
  }
  li:hover {
    color: red;
    background-color: #f5f5f5;
  }
}
.mode-type-toggle {
  .el-dropdown-link {
    cursor: pointer;
    color: #0a1220a3;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
.cursor-pointer {
  cursor: pointer;
}
.font-highlight {
  cursor: pointer;
  color: #409eff;
}
.tableau-page {
  position: relative;
  background-color: #fff;
  // user-select: none;
}
.tableau-sider {
  position: absolute;
  // display: flex;
  flex-direction: column;
  padding: 15px 0px 0px 15px;
  margin-left: 16px;

  width: 260px;
  // height: 887px;
  overflow-y: auto;
  border-right: 1px solid #ccc;
  background-color: #fff;
  .database-block {
    padding-bottom: 10px;
    h2 {
      font-size: 14px;
      font-weight: bold;
      span {
        float: right;
        margin-right: 15px;
        font-weight: 500;
        color: #409eff;
        cursor: pointer;
      }
    }
  }
  .table-list {
    overflow-y: auto;
    .sider-item-info {
      p {
        height: 26px;
        line-height: 26px;
      }
      .field-data-type {
        color: #409eff;
      }
      .item-info-remark {
        color: #ccc;
        text-indent: 12px;
      }
    }
    .table-list-title {
      padding-left: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /deep/.el-submenu__title {
      padding-left: 0px !important;
      height: 32px;
      line-height: 32px;
    }
    /deep/.el-submenu__icon-arrow {
      left: 0px;
      right: initial;
    }
    /deep/.el-submenu .el-menu-item {
      height: auto;
      // height: 32px;
      // line-height: 32px;
    }
  }
  .table-search {
    margin-bottom: 10px;
    height: 28px;
    line-height: 28px;
    .search-input-wrap {
      // width: 130px;
      margin-right: 10px;
    }
    .el-icon-search {
      margin-right: 15px;
      cursor: pointer;
    }
  }
}
// content
.tableau-content {
  display: flex;
  flex-direction: column;
  // margin-left: 280px;
  margin-left: 260px;
  &.noMargnLeft {
    margin-left: 0;
  }
}
.content-header {
  position: relative;
  // overflow: hidden;
  //padding: 5px;
  .header-operation-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
  }
  /deep/.el-tabs__item {
    width: 115px;
    text-align: center;
  }
}
</style>
