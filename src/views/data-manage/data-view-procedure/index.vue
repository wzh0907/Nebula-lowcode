<template>
  <div>
    <div class="content-header">
      <!-- <div class="header-operation-btn" v-show="!isScriptModel">
              <el-button size="mini" @click="onPreviewData">预览数据</el-button>
            </div> -->
      <!-- 视图或存储过程 -->
      <div v-if="selectedDataType === 'procedure'" style="float: left; padding-top: 5px;">
        <!-- 存储过程不支持修改名称 -->
        存储过程名：{{ reductionName }}
      </div>
      <div v-if="selectedDataType === 'view'" style="float: left;">
        <span v-if="!isEditViewName">
          {{ reductionName }}
        </span>
        <el-input
          v-if="isEditViewName"
          v-model="quoteReductionName"
          style="display: inline-block; width: 150px;"
          size="mini"
        />
        <span style="margin-right: 20px;" />

        <el-button v-show="isEditViewName" icon="el-icon-check" type="text" size="mini" @click="onEditViewName" />
        <el-button v-show="isEditViewName" icon="el-icon-close" type="text" size="mini" @click="isEditViewName = false" />
        <el-button v-show="!isEditViewName" icon="el-icon-edit" type="text" size="mini" @click="isEditViewName = true" />
      </div>

      <div style="text-align: right;">
        <el-button
          v-if="selectedDataType === 'view' || selectedDataType === 'table-query'"
          size="small"
          icon="el-icon-view"
          @click="onPreviewData"
        >预览数据</el-button>
        <el-button
          v-if="['view', 'procedure'].indexOf(selectedDataType) !== -1"
          type="primary"
          size="small"
          icon="el-icon-tickets"
          @click="onSaveData()"
        >保 存</el-button>
      </div>
      <p style="margin: 0; padding: 5px 0px;">
        <span v-if="selectedDataType === 'view'" style="font-size: 12px">
          CREATE OR REPLACE VIEW {{ reductionName }}</span>
        <span v-if="selectedDataType === 'procedure'" style="font-size: 12px">
          CREATE OR REPLACE PROCEDURE {{ reductionName }}</span>
      </p>
      <div class="content-header-wrap script-panel-wrap">
        <div class="script-edit-wrap">
          <code-editor
            v-if="isReloadCodeEditor"
            v-model="execSqlText"
            height="280px"
            mode="sql"
            :editor-options="editorOptions"
          />
        </div>
      </div>
    </div>
    <!-- 视图执行结果 -->
    <div v-if="selectedDataType === 'view' || selectedDataType === 'table-query'" class="content-table">
      <div class="header-operation-btn">
        <el-form :inline="true" size="mini">
          <!-- <el-form-item>
            <span>显示条数</span>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="executeReductionLimit"
              @keyup.enter.native="onChangeLimit"
              key="execute-reduction-limit"
              placeholder="行号"
              width="50"
              size="mini"
              suffix-icon="el-icon-position"
            />
          </el-form-item> -->
          <!-- <el-form-item>
            <i
              v-show="isShowResultTable"
              class="el-icon-download"
              style="font-size: 20px; cursor: pointer"
              title="隐藏表格"
              @click="isShowResultTable = false"
            />
            <i
              v-show="!isShowResultTable"
              class="el-icon-upload2"
              style="font-size: 20px; cursor: pointer"
              title="显示表格"
              @click="isShowResultTable = true"
            />
          </el-form-item> -->
        </el-form>
      </div>
      <el-tabs v-model="previewTableView">
        <el-tab-pane label="数据预览" name="preview">
          <div class="content-table-wrap">
            <el-table
              v-loading="previewTableLoading"
              height="100%"
              :data="executeResultValueList"
              element-loading-text="Loading"
              highlight-current-row
              stripe
              style="width: 100%"
            >
              <el-table-column
                v-for="(item, key) in executeResultColumnList"
                :key="key"
                width="200"
                align="left"
              >
                <template slot="header">
                  <div class="table-custom-header">
                    <p class="data-table">{{ item.tableName }}</p>
                    <p class="data-field">
                      <span>{{ item.aliasName || item.name }}</span>
                    </p>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div>{{ scope.row[key] }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="异常报告" name="report" disabled>
          <div v-show="isShowResultTable" class="content-table-wrap">
            异常报告
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import codeEditor from '@/components/CodeEditor/index.vue'
// import { addReductionItemV4Service, editReductionItemV4Service } from '@/api/data-trim.js'
import { getProcedureDetailData, addDataView, addDataProcedure, editDataView, editDataProcedure, previewDataService, renameViewService } from '@/api/database-command/index.js'
export default {
  name: 'DataViewProcedure',
  components: {
    codeEditor
  },
  props: ['selectedDataType', 'dataDetail', 'isCreateTable', 'databaseId', 'name','selectId'],
  data() {
    return {
      quoteReductionName: '',
      isEditViewName: '',
      isReloadCodeEditor: true,
      id: '',
      selectedDatabaseId: '',
      reductionName: '',
      execSqlText: '',
      editorOptions: {
        showGutter: false
      },
      isShowResultTable: false,
      previewTableLoading: false,
      previewTableView: 'preview',
      executeReductionLimit: 10,
      executeResultValueList: [],
      executeResultColumnList: []
    }
  },
  computed: {},
  created() {
    if (this.isCreateTable) {
      this.reductionName = this.name
      this.quoteReductionName = this.reductionName
      this.selectedDatabaseId = this.databaseId
    } else {
      // this.id = this.dataDetail.id
      this.selectedDatabaseId = this.dataDetail.dbConfigId
      this.reductionName = this.dataDetail.name
      this.quoteReductionName = this.reductionName
      this.execSqlText = this.dataDetail.execSqlText
      if (this.dataDetail.dataType === 'procedure') {
        this.queryProcedureDetailData(this.selectedDatabaseId, this.reductionName)
      }
    }
  },
  mounted() {},
  methods: {
    onEditViewName() {
      this.isEditViewName = false
      renameViewService({
        dbConfigId: this.databaseId,
        newName: this.quoteReductionName,
        oldName: this.reductionName
      }).then(res => {
        this.$emit('reload')
      })
    },
    queryProcedureDetailData(dbConfigId, procedureName) {
      getProcedureDetailData({
        dbConfigId,
        procedureName
      }).then(res => {
        this.execSqlText = res.data.remarks
        this.isReloadCodeEditor = false
        this.$nextTick(() => {
          this.isReloadCodeEditor = true
        })
      })
    },
    onPreviewData() {
      previewDataService({
        dbConfigId: this.selectedDatabaseId,
        name: this.reductionName,
        sql: this.execSqlText
      }).then(res => {
        const data = res.data || []
        this.executeResultColumnList = data.columnList || []
        this.executeResultValueList = data.valueList || []
      })
    },
    onSaveData() {
      if (this.isCreateTable) {
        this.add()
      } else {
        this.edit()
      }
    },
    add() {
      let service = {}
      if (this.selectedDataType === 'view') {
        service = addDataView
      } else if (this.selectedDataType === 'procedure') {
        service = addDataProcedure
      }
      service({
        dbConfigId: this.selectedDatabaseId,
        name: this.reductionName,
        sql: this.execSqlText
      }).then(res => {
        this.$message.success('保存成功')
        this.$emit('reload')
      })
    },
    edit() {
      let service = {}
      if (this.selectedDataType === 'view') {
        service = editDataView
      } else if (this.selectedDataType === 'procedure') {
        service = editDataProcedure
      }
      service({
        id:this.selectId,
        dbConfigId: this.selectedDatabaseId,
        name: this.reductionName,
        sql: this.execSqlText
      }).then(res => {
        this.$message.success('保存成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content-header {
  position: relative;
  // overflow: hidden;
  padding: 5px;
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
.content-header-wrap {
  overflow: auto;
  height: 240px;
  border: 2px solid transparent;
  &.target-zone-active {
    border: 2px solid #409eff;
  }
}
.script-panel-wrap {
  display: flex;
  // padding-top: 40px;
  height: 280px;
  flex-direction: row;
  border: 0px;
  .script-edit-wrap {
    flex: 2;
    height: 100%;
  }
  .script-operate-wrap {
    flex: 1;
    padding-left: 20px;
    padding-right: 5px;
    overflow: hidden;
  }
}
.table-popover-menu {
  li {
    margin-bottom: 10px;
    padding: 5px 0px;
    padding-left: 20px;
    cursor: pointer;
    &:hover {
      background-color: #409eff;
      color: #fff;
    }
  }
}
.content-table {
  position: relative;
  // min-height: 300px;
  // flex: 1;
  // overflow-y: auto;
  margin: 0px 5px;
  // border-top: 1px solid #ccc;
  // border-bottom: 1px solid #EBEEF5;
  .header-operation-btn {
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 10;
  }
  .content-table-wrap {
    overflow-y: auto;
    height: 500px;
  }
  .table-custom-header {
    .data-type {
      color: #409eff;
      cursor: pointer;
    }
    .data-table {
      color: #ccc;
      font-size: 12px;
    }
    .data-field {
      color: #333;
    }
    .table-data-control {
      float: right;
      margin-right: 20px;
      cursor: pointer;
      .iconfont {
        font-size: 12px;
      }
    }
    & .table-data-control {
      visibility: hidden;
    }
    &:hover .table-data-control {
      visibility: visible;
    }
  }

  .table-field {
    span {
      display: inline-block;
      padding: 0 10px;
      width: 50px;
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
