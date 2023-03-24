<template>
  <div class="file-tree">
    <div class="file-tree-search">
      <span v-if="projectType!='FROM'">
          <span>后端服务</span>
        <span style="float: right;">
          <i class="icon-font el-icon-folder-opened" style="margin-left: 6px;" title="页面文件夹" @click="addDir()"></i>
          <i class="icon-font el-icon-plus" title="添加流程" @click="addProcess()"></i>
        </span>
      </span>
    </div>
    <div class="tree-wrap">
      <el-tree
        v-if="isShowTree"
        ref="tree"
        class="file-tree-nodes"
        node-key="treeId"
        highlight-current
        :default-expand-all="defaultExpandAll"
        :draggable="!isInputFocus"
        :expand-on-click-node="false"
        :data="treeDataList"
        :props="defaultProps"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        :filter-node-method="filterNode"
        @node-drop="handleDrop"
        @node-click="handleNodeClick"
      >
        <span
          slot-scope="{data, node}"
          class="tree-item-text-wrap"
        >
          <span
            class="tree-text-item"
            :title="data.name"
          >
            <i v-if="data.subType" class="iconfont" :class="fileTypeIconMap[data.subType]"/>
            <i v-else class="iconfont" :class="fileTypeIconMap[data.dataType]"/>
            <span>
              {{ data.name }}
            </span>
          </span>
          <el-popover
            v-show="!data.isEditMode"
            v-if="projectType!='FROM'"
            :visible-arrow="false"
            placement="right"
            width="150"
            trigger="hover"
          >
            <ul class="file-popover-menu">
              <li v-if="data.dataType === 'project' || data.dataType === 'directory'"
                  @click="serveAddDialogVisible=true;entryDirId=data.queryId;processItem={}">添加服务</li>
              <li @click="updateDir(data, node)" v-if="data.dataType == 'directory'">修改</li>
              <li @click="updateProcess(data, node)" v-if="data.dataType == 'process'">修改</li>
              <li @click="copyFile(data, node)"
                  v-if="data.dataType !== 'project' && data.dataType !== 'directory' && data.dataType !== 'database'">创建副本</li>
              <li @click="delFileDirTips(data)">删除</li>
            </ul>
            <i slot="reference" class="el-icon-more"/>
          </el-popover>
        </span>
      </el-tree>
      <div class="function-view" @click="handleFunction">
        <i class="iconfont iconfunction" />
        <div style="margin-left: 8px">函数脚本</div>
      </div>
    </div>
    <!-- pop -->
    <reportAddDialog
      :dialog-visible.sync="reportAddDialogVisible"
      :entry-dir-id="entryDirId"
      title="添加页面"
      @addFile="addFile"
      @uploadDirTree="initData"
    />
    <dirAddDialog
      :dialog-visible.sync="dirAddDialogVisible"
      :dirId="entryDirId"
      :dirItem="dirItem"
      title="添加目录"
      :queryType="queryType"
      :type="type"
      @addFile="addFile"
      @initData="initData"
    />
    <serveAddDialog
      :dialog-visible.sync="serveAddDialogVisible"
      :entry-dir-id="entryDirId"
      :processItem="processItem"
      title="添加服务"
      @addFile="addFile"
      @initData="initData"
    />
    <databaseAddDialog
      :dialog-visible.sync="databaseAdddialogVisible"
      title="添加连接"
      :parent-id="currentDirId"
      @saveDatabase="saveDatabase"
    />
    <downCommentDialog
      :dialog-visible.sync="downCommentdialogVisible"
      @uploadDataTree="uploadDataTree"
      title="组件下载"
    />
  </div>
</template>

<script>
import {
  saveProjectFileTreeListSortService,
  saveFileNameService,
  saveDirectoryV4,
  saveReportV4,
  saveDatasetV4,
  saveDatabaseV4,
  saveProcessV4,
  delDirectoryV4,
  delReportV4,
  delDatasetV4,
  delDatabaseV4,
  delProcessV4,
  copyReportV4,
  copyDatasetV4,
  copyProcessV4
} from '@/api/v4'
import {getProjectFileTreeListV5Service} from '@/api/v5'
import databaseAddDialog from "@/views/database/add.vue";
import dataAddDialog from "./dialog-module/add-data.vue";
import serveAddDialog from "./dialog-module/add-serve.vue";
import dirAddDialog from "./dialog-module/add-dir.vue";
import reportAddDialog from "./dialog-module/add-report.vue";
import downCommentDialog from "./dialog-module/downComment/index.vue";

export default {
  name: 'FileTree',
  components: {
    databaseAddDialog,
    dataAddDialog,
    serveAddDialog,
    reportAddDialog,
    downCommentDialog,
    dirAddDialog
  },
  props: ['projectType', 'projectName', 'currentDirId'],
  data() {
    return {
      entryDirId: '0',
      currentDirLevel: 1,
      loaderObj: {},
      processItem: {},
      dirItem: {},
      defaultExpandAll: true,
      isInputFocus: false,
      isShowTree: true,
      filterText: '',
      serveAddDialogVisible: false,
      dirAddDialogVisible: false,
      dataAddDialogVisible: false,
      reportAddDialogVisible: false,
      databaseAdddialogVisible: false,
      downCommentdialogVisible: false,
      queryType: "",
      type: "process",
      // currentTreeChildren: [],
      treeDataList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      fileTypeTextMap: {
        project: '项目',
        directory: '文件夹',
        report: '页面',
        process: '服务',
        dataset: '数据',
        datasetScript: '脚本',
        database: '连接'
      },
      fileTypeIconMap: {
        directory: 'icontabs',
        report: 'iconzhanshi',
        process: 'iconscript-language',
        interface: 'iconshujulianjie',
        dataset: 'iconshujuji',
        database: 'icondataBase',
        design: 'iconshujuji',
        sql: 'iconsql',
        view: 'iconglassesyanjing',
        procedure: 'iconicon-sql',
        connect: 'iconxitong',
        group: 'iconmokuai'
      }
      // fileSubTypeIconMap: {
      //   design: 'iconshujuji',
      //   sql: 'iconsql',
      //   view: 'iconglassesyanjing',
      //   procedure: 'iconicon-sql',
      //   connect:'iconxitong',
      // }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {

    window.addEventListener('dele-creat-group', this.getDeleGreatGroup)
  },
  mounted() {
    this.initData()
  },
  beforeDestroy() {
    window.removeEventListener(`dele-creat-group`, this.getDeleGreatGroup)
  },
  methods: {
    uploadDataTree() {
      this.initData()
    },
    /*    expandAllTree() {
          this.isShowTree = false
          this.$nextTick(() => {
            this.isShowTree = true
            this.defaultExpandAll = !this.defaultExpandAll
          })
        },*/
    renameFileInputFocus(data, elId) {
      if (data.dataType === 'project') return false
      this.isInputFocus = true
      this.isShowTree = false
      data.isEditMode = true
      this.$nextTick(() => {
        this.isShowTree = true
        setTimeout(() => {
          const el = document.getElementById(elId)
          el && el.focus()
          el && el.select()
        })
      })
    },
    renameFileInputBlur(data) {
      if (data.dataType === 'directory') {
        this.renameDir(data.queryId, data.name)
      } else {
        this.renameFile(data.treeId, data.name)
      }
      this.isInputFocus = false
      this.isShowTree = false
      data.isEditMode = false
      this.$nextTick(() => {
        this.isShowTree = true
      })
    },
    // searchTree(){
    // },
    addDir(dirId) {
      this.entryDirId = dirId;
      this.dirAddDialogVisible = true;
      this.dirItem = {}

    },
    triggerLoading() {
      this.loaderObj = this.$loading({
        lock: true,
        text: '处理中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    renameFile(treeId, name) {
      saveFileNameService({
        treeId,
        name
      }).then(() => {
        this.initData();
        this.$emit('renameFile', treeId, name)
      })
    },
    renameDir(id, name) {
      saveDirectoryV4({
        // parentId: dirId || this.currentDirId,
        id,
        name
      }).then(() => {
        this.initData()
      })
    },
    // 组件下载
    downComment() {
      this.downCommentdialogVisible = true
    },
    addProcess() {
      this.entryDirId = 0
      this.processItem = {}
      this.serveAddDialogVisible = true
    },
    updateProcess(data, node) {
      this.processItem = {
        processName: data.name,
        processId: data.queryId,
      }
      this.serveAddDialogVisible = true
    },
    updateDir(data, node) {
      console.log("updateDir", data);
      this.dirItem = {
        name: data.name,
        id: data.queryId,
      }
      this.dirAddDialogVisible = true
    },
    dropdownCommand(dataType, dirId, inputFileName) {
      this.entryDirId = dirId || this.currentDirId
      if (dataType === 'dataset') {
        // this.dataAddDialogVisible = true
        // this.addFile('dataset', this.entryDirId,"新建流程")
        return false
      } else if (dataType === 'process') {
        // this.serveAddDialogVisible = true
        this.addFile('processFlow', this.entryDirId, "新建流程")
        return false
      } else if (dataType === 'report') {
        //  this.$emit('addFile', 'report', this.entryDirId, this.dataForm.fileName)
        // this.reportAddDialogVisible = true
        this.addFile('report', this.entryDirId, "新建页面")
        return false
      }
      this.addFile(dataType, dirId, inputFileName)
    },
    addFile(dataType, dirId, inputFileName, inputDatabaseId) {
      if (!dataType) return false
      const fileName = inputFileName || `新建${this.fileTypeTextMap[dataType]}`
      let saveFileService = saveReportV4
      if (typeof dirId == 'undefined') {
        dirId = this.currentDirId
      }

      const params = {
        parentId: dirId
      }
      if (dataType === 'report') {
        saveFileService = saveReportV4
        params.subType = 'report'
        params.reportName = fileName
        params.businessId = inputDatabaseId
        params.queryType = this.projectType
      } else if (dataType === 'groupComponent') {
        saveFileService = saveReportV4
        params.subType = 'group'
        params.reportName = fileName
        params.queryType = this.projectType
      } else if (dataType === 'process') {
        // this.serveAddDialogVisible = true
        // return false
        saveFileService = saveProcessV4
        params.processName = fileName
        params.languageType = 'js'
        params.processScript = ''
      } else if (dataType === 'processFlow') {
        saveFileService = saveProcessV4
        params.processName = fileName
        params.processType = "process"
        params.scheme = '{"nodes":[{"version":1,"id":0,"x":128,"y":81,"title":"开始","type":"startV4","outputs":[{"id":311,"x":240.5,"y":97,"title":null}],"properties":{}}],"variables":[{"name":"系统变量","checked":false,"editable":true,"type":4,"ctype":"system","variables":[{"name":"会话token","type":0,"value":"","row":"page"},{"name":"页面Body","type":0,"value":"","row":"page"},{"name":"分页页号","type":1,"value":"","row":"page"},{"name":"分页行数","type":1,"value":"","row":"page"}]},{"name":"输入参数","checked":false,"editable":true,"type":4,"variables":[]},{"name":"输出参数","checked":false,"editable":true,"type":4,"variables":[]},{"name":"变量","checked":false,"editable":true,"type":4,"variables":[]},{"name":"数值","checked":false,"editable":true,"type":4,"variables":[]}],"devSwitch":true,"subProcessId":[]}'
      } else if (dataType === 'processFlowNew') {
        saveFileService = saveProcessV4
        params.processName = fileName
        params.processType = "process"
        params.scheme = '{"nodes":[{"version":1,"id":0,"x":128,"y":81,"title":"开始","type":"startV5","outputs":[{"id":311,"x":353,"y":115,"title":null}],"properties":{}}],"variables":[{"name":"系统变量","checked":false,"editable":true,"type":4,"ctype":"system","variables":[{"name":"会话token","type":0,"value":"","row":"page"},{"name":"页面Body","type":0,"value":"","row":"page"}]},{"name":"输入参数","checked":false,"editable":true,"type":4,"variables":[]},{"name":"输出参数","checked":false,"editable":true,"type":4,"variables":[]},{"name":"变量","checked":false,"editable":true,"type":4,"variables":[]},{"name":"数值","checked":false,"editable":true,"type":4,"variables":[]}],"devSwitch":true,"subProcessId":[]}'
      } else if (dataType === 'interface') {
        saveFileService = saveProcessV4
        params.processName = fileName
        params.processType = 'interface'
      } else if (dataType === 'dataset' || dataType === 'datasetScript') {

      } else if (dataType === 'view') {

      } else if (dataType === 'procedure') {

      } else if (dataType === 'database') {
        // saveFileService = saveDatabaseV4
        // params.dataSourceName = fileName
        // this.databaseAdddialogVisible = true
        // this.$emit('addDatabase')
        this.databaseAdddialogVisible = true
        return false
      }
      this.triggerLoading()
      saveFileService(params).then(res => {
        this.initData(res.data.treeId)
      }).catch(() => {
        if (this.loaderObj.close && typeof this.loaderObj.close === 'function') this.loaderObj.close()
      })
      // dataType = (dataType === 'datasetScript' ? 'dataset' : dataType)
      // this.currentTreeChildren.push({
      //   dataType,
      //   name: fileName
      // })
    },
    saveDatabase(res) {
      this.triggerLoading()
      this.$emit('reloadDatabase')
      this.initData(res.data.treeId)
    },
    copyFile(fileData, nodeData) {
      let dataType = fileData.dataType
      let parentId = nodeData.parent.data.queryId
      let newFileName = fileData.name + ' Copy'
      let copyFileService = copyReportV4
      if (dataType === 'report') {
        copyFileService = copyReportV4
      } else if (dataType === 'process') {
        copyFileService = copyProcessV4
      } else if (dataType === 'dataset' || dataType === 'datasetScript') {
        copyFileService = copyDatasetV4
      } else {
        return false
      }
      this.triggerLoading()
      copyFileService({
        name: newFileName,
        parentId,
        queryId: fileData.queryId
      }).then(res => {
        this.initData(res.data.treeId)
      }).catch(() => {
        if (this.loaderObj.close && typeof this.loaderObj.close === 'function') this.loaderObj.close()
      })
    },
    // 创建复合函数 头部的删除
    getDeleGreatGroup(res) {
      this.delFileDirTips(res.detail.data)
    },

    delFileDirTips(fileData) {
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delFileDir(fileData)
        })
        .catch(() => {
        })
    },
    delFileDir(fileData) {
      const dataType = fileData.dataType
      if (dataType === 'directory') {
        delDirectoryV4({
          directoryId: fileData.queryId
        }).then(() => {
          this.initData()
        })
      } else if (dataType === 'report') {
        delReportV4({
          reportId: fileData.queryId
        }).then(() => {
          this.initData()
          // this.$emit('changeDataType', 'project')
        })
      } else if (dataType === 'process') {
        delProcessV4({
          processId: fileData.queryId
        }).then(() => {
          this.initData()
          // this.$emit('changeDataType', 'project')
        })
      } else if (dataType === 'dataset' || dataType === 'datasetScript') {
        delDatasetV4({
          dsConfigId: fileData.queryId
        }).then(() => {
          this.initData()
          // this.$emit('changeDataType', 'project')
        })
      } else if (dataType === 'database') {
        delDatabaseV4({
          configId: fileData.queryId
        }).then(() => {
          this.initData()
          // this.$emit('changeDataType', 'project')
        })
      }
      this.$emit('delFile', fileData, dataType);
    },
    editFile(fileData) {
      const dataType = fileData.dataType
      if (dataType === 'database') {

      }
    },
    handleDrop() {
      let treeList = this.treeDataList
      this.handleTreeSort(treeList)
      saveProjectFileTreeListSortService(treeList)
    },
    handleTreeSort(treeList) {
      if (!treeList || !treeList.length) return false
      treeList.forEach((treeData, index) => {
        treeData.rank = index + 1
        if (treeData.children && treeData.children.length) {
          this.handleTreeSort(treeData.children)
        }
      })
    },
    allowDrag() {
      return true
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.dataType === 'project') return false
      if (type === 'inner' && dropNode.data.dataType !== 'directory') {
        return false
      } else {
        return true
      }
    },
    initData(treeId) {
      getProjectFileTreeListV5Service().then(res => {
        this.treeDataList = res.dataList
        // this.currentTreeChildren = this.treeDataList[0].children
        treeId && this.$nextTick(() => {
          let data = this.findFileTree(treeId, this.treeDataList)
          if (data) {
            this.$emit('changeDataType', data.dataType, data)
          }
        })
        if (this.loaderObj.close && typeof this.loaderObj.close === 'function') this.loaderObj.close()
      }).catch(() => {
        if (this.loaderObj.close && typeof this.loaderObj.close === 'function') this.loaderObj.close()
      })
    },
    findFileTree(treeId, treeList) {
      let data = ''
      treeList.forEach(item => {
        if (item.treeId === treeId) {
          data = item
          return
        }
        if (item && item.children && item.children.length) {
          const res = this.findFileTree(treeId, item.children)
          res && (data = res)
        }
      })
      return data
    },
    handleNodeClick(data, parentData) {
      const dataType = data.dataType
      if (dataType === 'directory') {
        this.$emit('changeDirId', data.queryId)
        const children = data.children || []
        // if (!children || typeof children.push === 'function') this.currentTreeChildren = children
      } else {
        this.$emit('changeDataType', dataType, data)
        if (dataType === 'project' || dataType === 'dataManage') return false
        const children = parentData.parent.data.children // 根目录是写死的，所以不用担心没有parent的情况
        const dirId = parentData.parent.data.queryId
        if (!children || typeof children.push === 'function') {
          this.$emit('changeDirId', dirId || '0')
        }
        this.$emit('nodeClick');

      }
      // 获取当前文件夹的层级
      if (dataType === 'directory') {
        this.currentDirLevel = parentData.level
      } else {
        this.currentDirLevel = parentData.level - 1
      }
    },
    filterNode(value, data) {
      if (!value || !data.name) return true
      return data.name.indexOf(value) !== -1
    },
    handleFunction() {
      this.$emit("nodeClick");
      this.$emit("changeDataType", 'processFunctionManage');
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: #f0f2f3;
  color: #409eff;
}

.file-tree {
  height: 100%;
  display: flex;
  flex-direction: column;

  /deep/ .el-dialog__wrapper .el-dialog {
    margin-top: 6vh !important;
  }
}

.tree-wrap {
  flex: 1;
  overflow-y: scroll;
  padding-bottom: 50px;
  // 滚动条
  &::-webkit-scrollbar { /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }

  &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
  }

  &::-webkit-scrollbar-track { /*滚动条里面轨道*/
    border-radius: 0;
    background: #fff;
  }
}

.file-tree-search {
  height: 40px;
  line-height: 40px;
  padding: 0px 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #DBDBDB;

  .icon-font {
    font-size: 18px;
    cursor: pointer;
  }

  .iconcollapse {
    cursor: pointer;
  }

  .iconfangda {
    text-align: right;
  }

  .search-input {
    width: 85%;
    margin-left: 6px;
  }
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

.file-popover-menu {
  margin: 0;
  padding: 0;
  font-size: 13px;

  li {
    padding: 5px 5px 5px 10px;
    // height: 20px;
    // line-height: 20px;
    cursor: pointer;
  }

  li:hover {
    color: #409eff;
    background-color: #f5f5f5;
  }
}

.function-view {
  background: white;
  cursor: pointer;
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #dddddd;
}
</style>
