<template>
  <el-dialog
    :title="title"
    width="900px"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <div v-loading="listLoading">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="数据表" name="tables">
          <el-transfer
            id="tables-transfer"
            v-model="tablesChosenDataList"
            filterable
            :filter-method="tablesFilterMethod"
            :titles="['所有数据表', '同步数据表']"
            :data="tablesAllDataListTemp"
            :props="{ key: 'name', label: 'name' }"
          ></el-transfer>
        </el-tab-pane>
        <el-tab-pane label="视图" name="views">
          <el-transfer
            id="views-transfer"
            v-model="viewsChosenDataList"
            filterable
            :filter-method="viewsFilterMethod"
            :titles="['所有视图', '同步视图']"
            :data="viewsAllDataListTemp"
            :props="{ key: 'name', label: 'name' }"
          ></el-transfer>
          <!-- <el-transfer v-model="value" :data="dataList"></el-transfer> -->
        </el-tab-pane>
        <el-tab-pane label="存储过程" name="procedures">
          <el-transfer
            id="procedures-transfer"
            v-model="proceduresChosenDataList"
            filterable
            :filter-method="proceduresFilterMethod"
            :titles="['所有存储过程', '同步存储过程']"
            :data="proceduresAllDataListTemp"
            :props="{ key: 'name', label: 'name' }"
          ></el-transfer>
          <!-- <el-transfer v-model="value" :data="dataList"></el-transfer> -->
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="doSyncConfig">保 存</el-button>
      <el-button @click="isShowDialog = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { databaseSyncConfigService, databaseSyncService } from "@/api/database";
// const generateData = _ => {
//   const data = [];
//   for (let i = 1; i <= 15; i++) {
//     data.push({
//       key: i,
//       label: `备选项 ${ i }`,
//       // disabled: i % 4 === 0
//     });
//   }
//   return data;
// };
export default {
  name: "Add",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: "tables",
      title: "同步配置",
      listLoading: false,
      // dataList: generateData(),
      // value: [1, 4],
      // syncConfigTables: {},
      tablesAllDataList: [],
      tablesChosenDataList: [],
      tablesChosenDataObjList: [],
      tablesAllDataListTemp: [],
      tablesAllDataListTempKeep: [],
      viewsAllDataList: [],
      viewsChosenDataList: [],
      viewsChosenDataObjList: [],
      viewsAllDataListTemp: [],
      viewsAllDataListTempKeep: [],
      proceduresAllDataList: [],
      proceduresChosenDataList: [],
      proceduresChosenDataObjList: [],
      proceduresAllDataListTemp: [],
      proceduresAllDataListTempKeep: []
    };
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  created() {},
  mounted() {},
  methods: {
    registerSearchEvent(){
      let proceduresTransferInputLeftEl = document.querySelectorAll('#procedures-transfer .el-transfer-panel__filter input')[0]
      let proceduresTransferInputRightEl = document.querySelectorAll('#procedures-transfer .el-transfer-panel__filter input')[1]
      let tablesTransferInputLeftEl = document.querySelectorAll('#tables-transfer .el-transfer-panel__filter input')[0]
      let tablesTransferInputRightEl = document.querySelectorAll('#tables-transfer .el-transfer-panel__filter input')[1]
      let viewsTransferInputLeftEl = document.querySelectorAll('#views-transfer .el-transfer-panel__filter input')[0]
      let viewsTransferInputRightEl = document.querySelectorAll('#views-transfer .el-transfer-panel__filter input')[1]

      proceduresTransferInputLeftEl.addEventListener('keyup', e => {
        this.keyupEventHandler(e, this.proceduresAllDataList, 'proceduresAllDataListTemp', this.proceduresAllDataListTempKeep, this.proceduresChosenDataList)
      })
      tablesTransferInputLeftEl.addEventListener('keyup', e => {
        this.keyupEventHandler(e, this.tablesAllDataList, 'tablesAllDataListTemp', this.tablesAllDataListTempKeep, this.tablesChosenDataList)
      })
      viewsTransferInputLeftEl.addEventListener('keyup', e => {
        this.keyupEventHandler(e, this.viewsAllDataList, 'viewsAllDataListTemp', this.viewsAllDataListTempKeep, this.viewsChosenDataList)
      })
    },
    keyupEventHandler(e, allDataList, allDataListTemp, allDataListTempKeep, chosenDataList){
      if (e.keyCode === 13) {
        let queryValue = e.target.value
        if (queryValue) {
          this[allDataListTemp] = this.searchData(queryValue, allDataList, chosenDataList)
        } else {
          this[allDataListTemp] = allDataListTempKeep
        }
      }
    },
    searchData(queryStr, allDataList, chosenDataList){
      let arrTemp = []
      allDataList.forEach(item => {
        if (item.name.indexOf(queryStr) !== -1) {
          arrTemp.push(item)
        } else if (chosenDataList.indexOf(item.name) !== -1) {
          arrTemp.push(item)
        }
      })
      return arrTemp
    },
    tablesFilterMethod(query, item) {
      // console.log(query, this.tablesAllDataListTemp, item)
      if (this.tablesChosenDataList.indexOf(item.name) !== -1) { // 右侧搜索框
        return item.name.indexOf(query) !== -1
      } else {
        return true
      }
    },
    viewsFilterMethod(query, item) {
      if (this.viewsChosenDataList.indexOf(item.name) !== -1) { // 右侧搜索框
        return item.name.indexOf(query) !== -1
      } else {
        return true
      }
    },
    proceduresFilterMethod(query, item) {
      if (this.proceduresChosenDataList.indexOf(item.name) !== -1) { // 右侧搜索框
        return item.name.indexOf(query) !== -1
      } else {
        return true
      }
    },
    handleClick(tab, event) {},
    dialogOpen() {
      this.getSyncConfig();
    },
    getSyncConfig() {
      if (!this.id) return;
      this.listLoading = true;
      databaseSyncConfigService({
        configId: this.id,
      })
        .then((res) => {
          this.listLoading = false;
          // this.dataList = res.dataList
          this.tablesAllDataList = [];
          this.viewsAllDataList = [];
          this.proceduresAllDataList = [];
          this.tablesChosenDataList = [];
          this.viewsChosenDataList = [];
          this.proceduresChosenDataList = [];
          this.tablesChosenDataObjList = [];
          this.viewsChosenDataObjList = [];
          this.proceduresChosenDataObjList = [];
          let syncConfigTables = res.data.tables || {};
          let syncConfigViews = res.data.views || {};
          let syncConfigProcedures = res.data.procedures || {};
          this.handleGetSyncConfig(
            "tablesAllDataList",
            this.tablesChosenDataList,
            this.tablesChosenDataObjList,
            syncConfigTables
          );
          this.handleGetSyncConfig(
            "viewsAllDataList",
            this.viewsChosenDataList,
            this.viewsChosenDataObjList,
            syncConfigViews
          );
          this.handleGetSyncConfig(
            "proceduresAllDataList",
            this.proceduresChosenDataList,
            this.proceduresChosenDataObjList,
            syncConfigProcedures
          );
          this.handleTreeListTemp()
          this.$nextTick(() => {
            this.registerSearchEvent()
          })
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleGetSyncConfig(allDataListStr, chosenDataList, chosenDataObjList, syncConfigDatas) {
      let allList = syncConfigDatas.allList;
      let chosenList = syncConfigDatas.chosenList;
      this[allDataListStr] = allList.concat(chosenList);
      chosenList.forEach((item) => {
        chosenDataList.push(item.name);
        chosenDataObjList.push(item)
      });
    },
    handleTreeListTemp(){
      this.tablesAllDataListTemp = []
      this.viewsAllDataListTemp = []
      this.proceduresAllDataListTemp = []
      let tablesTemp = this.tablesAllDataList.slice(0, 200)
      let viewsTemp = this.viewsAllDataList.slice(0, 200)
      let proceduresTemp = this.proceduresAllDataList.slice(0, 200)
      tablesTemp.forEach(item => {
        if (this.tablesChosenDataList.indexOf(item.name) === -1) {
          this.tablesAllDataListTemp.push(item)          
        }
      })
      viewsTemp.forEach(item => {
        if (this.viewsChosenDataList.indexOf(item.name) === -1) {
          this.viewsAllDataListTemp.push(item)          
        }
      })
      proceduresTemp.forEach(item => {
        if (this.proceduresChosenDataList.indexOf(item.name) === -1) {
          this.proceduresAllDataListTemp.push(item)          
        }
      })

      this.tablesAllDataListTemp = this.tablesAllDataListTemp.concat(this.tablesChosenDataObjList)
      this.viewsAllDataListTemp = this.viewsAllDataListTemp.concat(this.viewsChosenDataObjList)
      this.proceduresAllDataListTemp = this.proceduresAllDataListTemp.concat(this.proceduresChosenDataObjList)

      this.tablesAllDataListTempKeep = JSON.parse(JSON.stringify(this.tablesAllDataListTemp))
      this.viewsAllDataListTempKeep = JSON.parse(JSON.stringify(this.viewsAllDataListTemp))
      this.proceduresAllDataListTempKeep = JSON.parse(JSON.stringify(this.proceduresAllDataListTemp))
    },
    doSyncConfig() {
      if (!this.id) return;
      this.listLoading = true;
      // get tables config
      let tables = {
        allList: [],
        chosenList: [],
      };
      let views = {
        allList: [],
        chosenList: [],
      };
      let procedures = {
        allList: [],
        chosenList: [],
      };
      this.handleDoSyncConfig(
        this.tablesAllDataList,
        this.tablesChosenDataList,
        tables
      );
      this.handleDoSyncConfig(
        this.viewsAllDataList,
        this.viewsChosenDataList,
        views
      );
      this.handleDoSyncConfig(
        this.proceduresAllDataList,
        this.proceduresChosenDataList,
        procedures
      );
      databaseSyncService({
        dbConfigId: this.id,
        tables,
        views,
        procedures,
      })
        .then((res) => {
          this.listLoading = false;
          this.isShowDialog = false;
          this.$emit("reload");
        })
        .catch(() => {
          this.listLoading = false;
          this.isShowDialog = false;
        });
    },
    handleDoSyncConfig(allDataList, chosenDataList, datas) {
      allDataList.forEach((item) => {
        if (chosenDataList.indexOf(item.name) !== -1) {
          datas.chosenList.push(item);
        } else {
          datas.allList.push(item);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
ul,
li,
p {
  margin: 0;
  padding: 0;
}
.table-info {
  li {
    display: flex;
    line-height: 50px;
    text-align: left;
    border-bottom: 1px solid #ccc;
    p {
      flex: 1;
    }
  }
}
/deep/.el-transfer-panel__header .el-checkbox__label span {
  display: none;
}
/deep/.el-transfer-panel {
  width: 320px;
}
</style>
