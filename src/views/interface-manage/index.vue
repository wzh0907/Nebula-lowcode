<template>
  <div class="interface-page">
    <div class="app-container">
      <div class="system-list-wrap">
        <el-dropdown @command="handleCommand" trigger="click" style="max-width: 160px">
            <span class="el-dropdown-link" style="cursor: pointer">
              {{ connectName || '选择项目' }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="item"
              v-for="(item, key) in connectList">
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <span style="float: right;">


          <el-popover
            :visible-arrow="false"
            placement="right"
            width="150"
            trigger="hover"
          >
            <ul class="file-popover-menu">
              <li @click="systemConnectDialogVisible = true">新建系统</li>
              <li @click="dirAddDialogVisible = true">新建分组</li>
              <li @click="onAddProcess(0)">新建接口</li>
              <li @click="showProjectSetting = true">项目设置</li>
            </ul>
            <i class="icon-font el-icon-plus"
               slot="reference"
               style="cursor: pointer"
            ></i>
          </el-popover>

        </span>


        <div style="display: flex; margin: 10px 0">
          <el-input
            clearable
            size="mini"
            style="margin-right: 10px"
            v-model="searchName"
            @change="searchProcess"
            @clear="isSearch = false"
          >
            <i
              class="el-icon-search el-input__icon"
              slot="prefix">
            </i>
          </el-input>

        </div>
        <el-tree
          ref="tree"
          class="file-tree-nodes"
          node-key="treeId"
          highlight-current
          :default-expand-all="true"
          :draggable="false"
          :expand-on-click-node="false"
          :data="isSearch ? searchResult : connectProcessList"
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
        <span
          slot-scope="{data, node}"
          class="tree-item-text-wrap"
        >
          <!-- <i class="iconfont" :class="fileTypeIconMap[data.dataType]"/> -->
          <span
            class="tree-text-item"
            :title="data.name"
          >
<!--            <i v-if="data.subType" class="iconfont" :class="fileTypeIconMap[data.subType]" />-->
            <!--            <i v-else class="iconfont" :class="fileTypeIconMap[data.dataType]" />-->
            <span>
              {{ data.ext1 }}  {{ data.name }}   
            </span>
          </span>
          <el-popover
            :visible-arrow="false"
            placement="right"
            width="150"
            trigger="hover"
          >
            <ul v-if="data.dataType === 'directory'" class="file-popover-menu">
              <li @click="onAddProcess(data.queryId)">
                添加接口
              </li>
              <li @click="onDeleteProcess(data)">
                删除
              </li>
            </ul>
            <ul v-else class="file-popover-menu">
              <li @click="onDeleteProcess(data)">
                删除
              </li>
            </ul>
            <i slot="reference" class="el-icon-more"/>
          </el-popover>
        </span>
        </el-tree>
      </div>
      <!-- content -->
      <div v-if="showProjectSetting && selectedConnectId" style="flex: 1; height: 100%">
        <projectSetting
          :id="selectedConnectId"
          @saveProject="saveProject"
          @deleteProject="deleteProject">
        </projectSetting>
      </div>
      <interfaceSetting
        ref="interfaceSetting"
        v-show="!showProjectSetting && selectedConnectId"
        :connect-id="selectedConnectId"
        :process-list="connectProcessList"
        :process-groups="processGroups"
        :is-search-process="isSearch"
        @initData="onSelectedConnect(selectedConnectId)"
        @onDeleteProcess="onDeleteProcessComplete"
      >
      </interfaceSetting>
    </div>
    <!-- pop -->
    <!-- 组件上传 -->
    <uploadCommentDialog
      ref="uploadCommentForm"
      :dialog-visible.sync="uploadCommentVisible"
      :title="uploadCommentTitle"
    />
    <addSystemConnect
      :id="editConnectId"
      :dialog-visible.sync="systemConnectDialogVisible"
      title="数据源库"
      @reload="getConnectList"
    />
    <dirAddDialog
      :dialog-visible.sync="dirAddDialogVisible"
      :id="selectedConnectId"
      title="添加分组"
      @initData="onSelectedConnect(selectedConnectId)"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import CodeEditor from "@/components/CodeEditor";
import customHeader from "@/components/customHeader/index";
import uploadCommentDialog from "@/views/report/modules/uploadComment/index.vue";
import connectPreDialog from "./module/connectPre.vue";
import addSystemConnect from "./add-system-connect.vue";
import dataParseDialog from "./data-parse.vue";
import projectSetting from "./project-setting.vue";
import interfaceSetting from "./interface-setting.vue";
import dirAddDialog from "./module/add-dir.vue";
import {
  getConnectListService,
  getConnectProcessListService,
  saveConnectGroup
} from "@/api/database.js";
import {delDatabaseV4, delDirectoryV4, delProcessV4} from "@/api/v4";
import {searchProcessV5} from "@/api/v5";

export default {
  components: {
    customHeader,
    dataParseDialog,
    uploadCommentDialog,
    addSystemConnect,
    CodeEditor,
    connectPreDialog,
    projectSetting,
    interfaceSetting,
    dirAddDialog
  },
  props: {
    id: {
      type: String | Number,
      default: 0,
    },
  },
  data() {
    return {
      connectName: '',
      searchName: '',
      searchResult: [],
      isSearch: false,
      showProjectSetting: true,
      dirAddDialogVisible: false,
      processType: "interface",
      processGroups: [],
      editConnectId: "",
      selectedConnectId: "",
      isReloadCodeEditor: true,
      showBeforeCalling: false,
      showAfterCalling: false,
      systemConnectDialogVisible: false,
      uploadCommentVisible: false,
      uploadCommentTitle: "组件上传",
      editorOptions: {
        showGutter: false,
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // projectName: "",
      processName: "",
      tabActive: "params",
      interfaceConfig: {
        method: "GET",
        url: "",
        params: {},
        headers: {},
        body: {},
      },
      interfaceDataList: {},
      interfaceParseData: [],
      connectList: [],
      connectProcessList: [],
      beforeCallingText: "444",
      beforeCallingList: [],
      fileTypeIconMap: {
        directory: 'icontabs',
        process: 'iconscript-language',
      }
    };
  },
  computed: {
    // ...mapGetters([
    //   'projectList'
    // ]),
  },
  created() {
    // this.projectName = this.$route.query.name;
    // this.getDetail()
  },
  mounted() {
    this.getDefaultConnect()
  },
  beforeDestroy() {
    // this.onSaveData()
  },
  methods: {
    initData() {
      this.onSelectedConnect(this.selectedConnectId)
    },
    handleNodeClick(data, parentData) {
      if (data.dataType == "directory") {
        return
      }
      console.log('data = ', data);
      console.log('parent data = ', parentData);
      this.onSelectedConnectProcess(data.queryId, parentData.parent.data.queryId)
    },
    handleCommand(connect) {
      this.connectName = connect.name
      this.onSelectedConnect(connect.id)
      this.showProjectSetting = true
    },
    onDeleteProcessComplete() {
      this.showProjectSetting = true
      this.initData()
    },
    deleteProject() {
      this.getDefaultConnect()
    },
    saveProject(connectName) {
      this.connectName = connectName
      this.getConnectList()
    },
    onDeleteProcess(data) {
      this.$confirm("确认删除本条数据？")
        .then((_) => {
          this.delFileDir(data)
        })
        .catch((_) => {
        });
    },
    delFileDir(fileData) {
      const dataType = fileData.dataType
      if (dataType === 'directory') {
        delDirectoryV4({
          directoryId: fileData.queryId
        }).then(() => {
          this.initData()
        })
      } else if (dataType === 'process') {
        delProcessV4({
          processId: fileData.queryId
        }).then(() => {
          this.initData()
        })
      }
      this.$emit('delFile', fileData, dataType);
    },
    onEditSystemConnect(id) {
      this.editConnectId = id;
      this.systemConnectDialogVisible = true;
    },
    onAddSystemConnect() {
      this.editConnectId = "";
      this.systemConnectDialogVisible = true;
    },
    onAddProcess(parentId) {
      this.showProjectSetting = false
      this.$refs.interfaceSetting.onAddProcess(parentId)
    },
    onSelectedConnectProcess(id, parentId) {
      this.showProjectSetting = false
      this.id = id
      this.$nextTick(function () {
        this.$refs.interfaceSetting.getDetail(id, parentId || 0)
      })
    },
    onSelectedConnect(id) {
      this.selectedConnectId = id;
      this.interfaceConfig.connectId = id;
      getConnectProcessListService({
        connectId: id,
      }).then((res) => {
        this.connectProcessList = res.dataList || []
        this.getProcessGroup()
      });
    },
    getProcessGroup() {
      this.processGroups = []
      this.processGroups.push({
        name: '根目录',
        queryId: 0
      })
      for (const process of this.connectProcessList) {
        if (process.dataType == 'directory') {
          this.processGroups.push(process)
        }
      }
    },
    getConnectList() {
      getConnectListService().then((res) => {
        if (res.code == 0) {
          this.connectList = res.dataList;
        }
      });
    },
    getDefaultConnect() {
      getConnectListService().then((res) => {
        if (res.code == 0) {
          this.connectList = res.dataList;
          if (this.connectList.length > 0) {
            this.handleCommand(this.connectList[0])
          }
        }
      });
    },
    searchProcess() {
      this.isSearch = true
      searchProcessV5({
        dbConfigId: this.selectedConnectId,
        processName: this.searchName
      }).then((res) => {
        if (res.code == 0) {
          this.searchResult = res.dataList
        }
      });
    },
    arrayToObject(list) {
      if (!list) return false;
      const obj = {};
      list.forEach((item) => {
        if (item.key) {
          obj[item.key] = item.value;
        }
      });
      return obj;
    },
    objectToArray(obj, list) {
      if (!obj || typeof obj !== "object") return false;
      for (const key in obj) {
        list.push({
          key,
          value: obj[key],
        });
      }
      list.push({
        key: "",
        value: "",
      });
    },
    // uploadComment组件上传
    uploadComment() {
      this.uploadCommentVisible = true;
      this.uploadCommentTitle = "组件上传";
    },
    handleClick() {
    },
    handleParamsAdd(dataList, index) {
      if (dataList.length !== index + 1) return false;
      dataList.push({
        key: "",
        value: "",
      });
    },
    handleParamsRemove(dataList, index) {
      if (dataList.length <= 1) return false;
      dataList.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}

.interface-page {
  height: 94%;
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
    margin-top: 7px;
  }

  &:hover {
    .el-icon-more {
      visibility: inherit;
    }
  }

  .el-icon-more:hover {
    color: #409eff;
  }
}

.app-container {
  display: flex;
  // margin: 20px;
  // min-height: 500px;
  height: 100vh;
  background-color: white;
  border-radius: 0;
}

.system-list-wrap {
  float: left;
  font-size: 18px;
  width: 240px;
  padding: 10px;
  background-color: white;
  border-right: 1px solid #e4e5e6;
  overflow-y: auto;
  height: 100%;
}

.list-title {
  height: 70px;
  padding-top: 20px;
  padding-left: 20px;
  border-bottom: 1px solid #e4e5e6;
}

.pre-div {
  padding: 0 20px;
}

.file-popover-menu {
  margin: 0;
  padding: 0;
  font-size: 13px;

  li {
    padding: 5px 5px 5px 10px;
    cursor: pointer;
  }

  li:hover {
    color: #409eff;
    background-color: #f5f5f5;
  }
}
</style>
