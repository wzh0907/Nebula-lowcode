<template>
  <el-container v-loading="listLoading" style="flex-direction: column;">
    <!-- 头部操作 -->
    <custom-header router-back-path="/">
      <!-- <span slot="title">
        <el-input class="header_title" v-model="reductionName" size="small" placeholder="未命名" />
      </span> -->
      <div slot="opertBtn">
        <span class="el-button-opert-text">
          <el-button
            type="text"
            size="medium"
            icon="el-icon-tickets"
            @click="onSaveData()"
          >保 存</el-button>
          <el-button
            v-show="isScriptModel && scriptModelType !== 'procedure'"
            type="text"
            size="medium"
            icon="el-icon-view"
            @click="onPreviewData"
          >查询</el-button>
          <el-button
            type="text"
            size="medium"
            icon="el-icon-tickets"
            @click="uploadComment()"
          >上传市场</el-button>
          <!-- <el-button
            type="text"
            size="medium"
            icon="el-icon-tickets"
            @click="onExecuteData"
            v-if="['insert', 'edit', 'delete'].indexOf(modelType) !== -1"
          >保 存</el-button> -->
          <el-button
            type="text"
            size="medium"
            icon="el-icon-delete"
            @click="deleComment"
          >删除
          </el-button>
          <!-- <el-button
            type="text"
            size="medium"
            icon="el-icon-tickets"
            @click="isScriptModel = !isScriptModel"
          >{{ isScriptModel ? 'SQL模式' : '设计模式' }}</el-button> -->
          <!-- <span class="mode-type-toggle" style="margin-left: 10px;">
            <el-dropdown @command="onHandleModeTypeCommand" trigger="click">
              <span class="el-dropdown-link">
                {{ modeTypesMap[modelType] }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="isScriptModel"
                  :command="key"
                  v-for="(value, key) in modeTypesMap"
                  :key="key"
                >{{ value }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span> -->
        </span>
      </div>
    </custom-header>
    <!-- 主要内容 -->
    <el-main>
      <div class="tableau-page">

        <div class="tableau-content noMargnLeft" :style="{height: contentViewHeight}">
          <!-- 内容区 操作区域 -->
          <div class="database-block" style="padding: 10px;">
            <!-- <h2 style="font-size: 14px; font-weight: bold;">
              数据源
              <span style="font-size: 14px; color: #409eff; float: right; margin-right: 15px;" @click="onAddDatabase">添加</span>
            </h2> -->
            <span style="font-size: 14px; font-weight: bold;">数据源：</span>
            <el-select
              v-model="selectedDatabaseId"
              placeholder="请选择"
              size="mini"
              @change="queryDataTableList"
            >
              <el-option
                v-for="item in databaseList"
                :key="item.id"
                :label="item.dataSourceName"
                :value="item.id"
              />
            </el-select>
            <span style="font-size: 14px; color: #409eff; margin-left: 15px;" @click="onAddDatabase">添加</span>
          </div>
          <el-tabs v-model="tabView" stretch>
            <el-tab-pane label="数据表" name="dataTable" class="table_pane_content">
              <div class="table-search">
                <div class="search-input-wrap">
                  <el-input
                    v-model="tableSearchKey"
                    placeholder="输入搜索文本"
                    width="30"
                    size="mini"
                    @input="onSearchField"
                  />
                </div>
              </div>
              <div class="table-list" :style="{height: contentTableListHeight}">
                <el-menu @open="onSiderMenuOpen($event, false)">
                  <el-submenu
                    v-for="(item, key) in dataTableList"
                    :key="key"
                    :index="String(key)"
                    v-show="!item.isHide"
                  >
                    <template slot="title">
                      <div
                        class="table-list-title"
                        draggable
                        :key="key"
                        :title="item.tableName"
                        :data-id="item.id"
                      >
                        <i class="iconfont iconbiaoge"></i>
                        {{ item.tableName }}
                      </div>
                    </template>
                    <el-menu-item
                      v-for="(item, index) in dataTableInfoMap[item.id]"
                      :key="index"
                      :index="String(key) + '-' + String(index)"
                      v-show="!item.hide"
                    >
                      <div class="sider-item-info">
                        <p class="item-info-field">
                          <span class="field-data-type">
                            {{
                            isDatetimeDict.indexOf(item.type) !== -1 ? 'D' :
                            (isNumberDict.indexOf(item.type) !== -1 ? '#' : 'T')
                            }}
                          </span>
                          &nbsp;
                          {{ item.name }}
                        </p>
                        <p class="item-info-remark">{{ item.remarks }}</p>
                      </div>
                    </el-menu-item>
                  </el-submenu>
                </el-menu>
              </div>
            </el-tab-pane>
            <el-tab-pane label="数据集" name="dataSet">
              <div class="table-search">
                <div class="search-input-wrap">
                  <el-input
                    v-model="dataSetSearchKey"
                    placeholder="输入搜索文本"
                    width="30"
                    size="mini"
                    @input="onSearchFieldDataset"
                  />
                </div>
              </div>
              <div class="table-list" :style="{height: contentTableListHeight}">
                <el-menu @open="onSiderMenuOpen($event, true)">
                  <el-submenu
                    v-for="(item, key) in datasetsList"
                    :key="key"
                    :index="key + ''"
                    v-show="!item.isHide"
                  >
                    <template slot="title">
                      <div
                        class="table-list-title"
                        :key="key"
                        draggable
                        :title="item.dataSetName"
                        :data-ds="item.dataSetName"
                        :data-id="item.id"
                      >
                        <i class="iconfont iconjilianxuanze-cdcdcd" />
                        {{ item.dataSetName }}
                      </div>
                    </template>
                    <el-menu-item
                      :index="String(index)"
                      v-for="(item, index) in dataTableInfoMap[item.id]"
                      :key="index"
                      v-show="!item.hide"
                    >
                      <div class="sider-item-info">
                        <p class="item-info-field">
                          <span class="field-data-type">
                            {{
                            isDatetimeDict.indexOf(item.type) !== -1 ? 'D' :
                            (isNumberDict.indexOf(item.type) !== -1 ? '#' : 'T')
                            }}
                          </span>
                          &nbsp;
                          <!-- <i class="iconfont icon_T"></i> -->
                          <!-- <i class="iconfont icondate"></i> -->
                          {{ item.displayName || item.fieldName || item.name }}
                        </p>
                        <p class="item-info-remark">{{ item.description }}</p>
                      </div>
                    </el-menu-item>
                  </el-submenu>
                </el-menu>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- content 右侧内容区 -->
        <div class="tableau-content" :style="{height: contentViewHeight}">
          <!-- 内容区 操作区域 -->
          <div class="content-header" :style="{height: !isShowTable ? '100%' : ''}">
            <div v-show="!isScriptModel" class="header-operation-btn">
              <el-button size="mini" @click="onPreviewData">预览数据</el-button>
            </div>
            <el-tabs v-show="!isScriptModel" v-model="tabHeaderView" @tab-click="testHandleDialog">
              <el-tab-pane label="模型配置" name="first">
                <div
                  class="content-target-wrap content-header-wrap"
                  :style="{height: !isShowTable ? contentHeaderHeight : ''}"
                >
                  <div
                    v-if="isRenderTargetZone"
                    v-show="isShowTargetZone"
                    key="1"
                    class="content-target-zone"
                  />
                  <div v-show="!isShowTargetZone" key="2" class="edit-model-zone">
                    <ul>
                      <li>{{ d3RootJson.name }}</li>
                    </ul>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane
                label="过滤条件"
                name="filter"
                :disabled="['insert'].indexOf(modelType) !== -1"
              >
                <div
                  class="content-header-wrap"
                  :style="{height: !isShowTable ? contentHeaderHeight : ''}"
                >
                  <filterView
                    v-if="!id || serviceReadyStatusMap.queryReductionItemServiceStatus"
                    :data-table-info-map-pick="dataTableInfoMapPick"
                    :filter-config="filterConfig"
                    :tab-header-view="tabHeaderView"
                    @onFilterData="onFilterData"
                    @onSaveData="onSaveData"
                    @deleComment="deleComment"
                  />
                </div>
              </el-tab-pane>
              <el-tab-pane
                label="字段设置"
                name="third"
                :disabled="['insert', 'edit', 'delete'].indexOf(modelType) !== -1"
              >
                <div
                  class="content-header-wrap"
                  :style="{height: !isShowTable ? contentHeaderHeight : ''}"
                >
                  <fieldSetView
                    v-if="tabHeaderView === 'third'"
                    :data-table-info-map-pick="dataTableInfoMapPick"
                    :selected-d3tree-table-ids="selectedD3TreeTableIdsMap"
                    :data-set-field-list="dataSetFieldList"
                    @onChangeDataSetFieldList="onChangeDataSetFieldList"
                  />
                </div>
              </el-tab-pane>
              <el-tab-pane
                :label="`数据统计 ( ${ statisticsConfig.statistics && statisticsConfig.statistics.length || 0 } )`"
                name="fourth"
                :disabled="['insert', 'edit', 'delete'].indexOf(modelType) !== -1"
              >
                <div
                  class="content-header-wrap"
                  :style="{height: !isShowTable ? contentHeaderHeight : ''}"
                >
                  <statView
                    v-if="tabHeaderView === 'fourth'"
                    :data-table-info-map-pick="dataTableInfoMapPick"
                    :statistics-config="statisticsConfig"
                    @onCollectData="onCollectData"
                  />
                </div>
              </el-tab-pane>
              <!-- <el-tab-pane
                :label="`数据加工 ( ${ processListData.length || 0 } )`"
                name="fifth"
                :disabled="['insert', 'edit', 'delete'].indexOf(modelType) !== -1"
              >
                <div
                  class="content-header-wrap"
                  :style="{height: !isShowTable ? contentHeaderHeight : ''}"
                >
                  <processView
                    :processListData="processListData"
                    @onProcessData="onProcessData"
                    v-if="tabHeaderView === 'fifth'"
                  />
                </div>
              </el-tab-pane> -->
              <!-- <el-tab-pane :label="`筛选条件 ( ${ filterConfig.length || 0 } )`" name="filter" :disabled="['insert'].indexOf(modelType) !== -1">
                <div class="content-header-wrap" :style="{height: !isShowTable ? contentHeaderHeight : ''}"></div>
              </el-tab-pane>-->
            </el-tabs>
            <!-- SQL模式展示 -->
            <!-- <el-select
              v-model="selectedDatabaseId"
              placeholder="请选择"
              size="mini"
              @change="queryDataTableList"
            >
              <el-option
                v-for="item in databaseList"
                :key="item.id"
                :label="item.dataSourceName"
                :value="item.id"
              />
            </el-select> -->
            <p v-if="['view', 'procedure'].indexOf(scriptModelType) !== -1" style="padding: 5px 0px;">
              <!-- <el-select
                v-model="selectedDatabaseId"
                placeholder="请选择"
                size="mini"
                @change="queryDataTableList"
              >
                <el-option
                  v-for="item in databaseList"
                  :key="item.id"
                  :label="item.dataSourceName"
                  :value="item.id"
                />
              </el-select> -->
              <span v-if="scriptModelType === 'view'" style="font-size: 12px;"> CREATE OR REPLACE VIEW {{ reductionName }}</span>
              <span v-if="scriptModelType === 'procedure'" style="font-size: 12px;"> CREATE OR REPLACE PROCEDURE {{ reductionName }}</span>
            </p>
            <div v-show="isScriptModel" class="content-header-wrap script-panel-wrap">
              <div class="script-edit-wrap">
                <code-editor
                  v-if="!id || selectedDatabaseId"
                  v-model="execSqlText"
                  height="280px"
                  :mode="codeEditorMode"
                  :editor-options="editorOptions"
                />
              </div>
              <!-- <div class="script-operate-wrap" v-if="scriptModelType === 'procedure'">
                <sql-params-module
                  :sqlParamList="sqlParamList"
                  @onSetSqlParams="onGetSqlParams"
                  v-if="!id || selectedDatabaseId"
                />
              </div> -->
            </div>
          </div>
          <!-- table 数据表操作区域 -->
          <div v-if="scriptModelType !== 'procedure'" class="content-table">
            <div class="header-operation-btn">
              <el-form :inline="true" size="mini">
                <el-form-item>
                  <span>显示条数</span>
                </el-form-item>
                <el-form-item>
                  <el-input
                    key="execute-reduction-limit"
                    v-model="executeReductionLimit"
                    :disabled="isEditMode"
                    placeholder="行号"
                    width="50"
                    size="mini"
                    suffix-icon="el-icon-position"
                    @keyup.enter.native="onChangeLimit"
                  />
                </el-form-item>
                <el-form-item>
                  <i
                    v-show="isShowTable"
                    class="el-icon-download"
                    style="font-size: 20px; cursor: pointer;"
                    title="隐藏表格"
                    @click="isShowTable = false"
                  />
                  <i
                    v-show="!isShowTable"
                    class="el-icon-upload2"
                    style="font-size: 20px; cursor: pointer;"
                    title="显示表格"
                    @click="isShowTable = true"
                  />
                </el-form-item>
              </el-form>
            </div>
            <el-tabs v-model="tabContentView">
              <el-tab-pane :label="isEditMode ? '数据操作' : '数据预览'" name="preview">
                <div v-if="!isEditMode && isShowTable" class="content-table-wrap">
                  <el-table
                    v-show="!isEditMode"
                    v-loading="listLoading"
                    height="100%"
                    :data="executeResultValueList"
                    element-loading-text="Loading"
                    highlight-current-row
                    stripe
                    style="width: 100%;"
                  >
                    <el-table-column
                      v-for="(item, key) in executeResultColumnList"
                      v-show="item.isShow"
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
                <!-- 编辑模式 -->
                <div v-show="isEditMode && isShowTable" class="content-table-wrap">
                  <el-table
                    v-loading="listLoading"
                    height="100%"
                    :data="singleTableInfoList"
                    element-loading-text="Loading"
                    highlight-current-row
                    stripe
                    style="width: 100%;"
                  >
                    <el-table-column align="left" label="字段名称" width="400">
                      <template slot-scope="scope">
                        <div class="table-field">
                          <span>{{ dataTypeIconDict[scope.row.type] || '#' }}</span>
                          {{ scope.row.aliasName || scope.row.name }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-if="modelType === 'insert'"
                      label="值"
                      align="left"
                      width="300"
                    >
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.newValue" size="mini">
                          <!-- <el-button
                            slot="prepend"
                            @click="scope.row.isInputVar = !scope.row.isInputVar"
                          >{{ scope.row.isInputVar ? '变量值' : '静态值' }}</el-button> -->
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="modelType === 'edit'" label="值" align="left" width="300">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.newValue" size="mini">
                          <!-- <el-button
                            slot="prepend"
                            @click="scope.row.isInputVar = !scope.row.isInputVar"
                          >{{ scope.row.isInputVar ? '变量值' : '静态值' }}</el-button> -->
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column />
                  </el-table>
                </div>
              </el-tab-pane>
              <el-tab-pane label="异常报告" name="report" disabled>
                <div v-show="isShowTable" class="content-table-wrap">异常报告</div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-main>
    <!-- dialog 弹窗功能组件 -->
    <connection-dialog
      :dialog-visible.sync="connectionDialogVisible"
      :parent-id="connectLineLeftId"
      :right-id="connectLineRightId"
      :connect-field-list-props="connectFieldListProps"
      :join-type-props="joinTypeProps"
      :selected-left-table-list="selectedLeftTableList"
      :selected-right-table-list="selectedRightTableList"
      title="表关联"
      @getConnectData="onGetConnectData"
    />
    <!-- 组件上传 -->
    <uploadCommentDialog
      ref="uploadCommentForm"
      :dialog-visible.sync="uploadCommentVisible"
      :title="uploadCommentTitle"
      @uploadComment="uploadComment"
    />

  </el-container>
</template>

<script lang="ts">
import controller from './controllers/index'
export default controller
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
