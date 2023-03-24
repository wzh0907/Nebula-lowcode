<template>
  <el-container v-loading="listLoading" style="flex-direction: column;">
    <!-- 主要内容 -->
    <el-main>
      <div class="tableau-page">
        <!-- content 右侧内容区 -->
        <div class="tableau-content" :style="{height: contentViewHeight}">
          <!-- 内容区 操作区域 -->
          <div class="content-header" :style="{height: !isShowTable ? '100%' : ''}">
            <!-- <div class="header-operation-btn">
              <el-button size="mini" @click="onPreviewData">预览数据</el-button>
            </div> -->
            <el-tabs v-model="tabHeaderView" v-show="!isScriptModel">
              <el-tab-pane label="数据" name="data" :disabled="isCreateTable">
                <div class="table-operation">
                  <el-form size="mini" :inline="true" class="form-gap">
                    <el-form-item>
                      <span class="operat-dropdown-link mini-font" @click="isShowDataFilter = !isShowDataFilter">
                        数据筛选
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                    </el-form-item>
                    <el-form-item>
                      <el-button @click="onAddTableRowData">插入</el-button>
                    </el-form-item>
                    <el-form-item style="float: right;">
                      <span  v-has="'report:showConfig'" class="create-crud" @click="addDialogVisible=true"><i class="iconfont iconbiaodanguanli1" />生成表单</span>
                  
                    </el-form-item>
                    
                    <!-- <el-form-item style="float: right;">
                      <div class="mini-font">
                        显示<span style="color: #E45151;"> 33 </span>条数据，共<span style="color: #E45151;"> 66 </span>条数据
                      </div>
                    </el-form-item> -->
                  </el-form>
                </div>
                <div class="content-header-wrap" v-show="isShowDataFilter">
                  <filterView :dataTableColumnList="executeResultColumnList" @onFilterData="onFilterData" />
                </div>
                <div v-if="isShowTable">
                  <el-table
                    :height="contentHeaderHeight"
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
                          <!-- <p class="data-table">{{ item.tableName }}</p> -->
                          <p class="data-field">
                            <span>{{ item.aliasName || item.name }}</span>
                          </p>
                        </div>
                      </template>
                      <template slot-scope="scope">
                        <div>{{ scope.row[key] }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="100">
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="onEditTableRowData(scope.row)">修改</el-button>
                        <el-button type="text" size="small" @click="onDelTableRowData(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    :page-size="pageSize"
                    :current-page="pageIndex"
                    layout="prev, pager, next"
                    :total="pageTotal"
                    @current-change="handleCurrentChange"
                  >
                  </el-pagination>
                </div>
              </el-tab-pane>
              <el-tab-pane label="结构" name="structure">
                <div class="content-header-wrap">
                  <fieldSetView
                    :isCreateTable="isCreateTable"
                    :tableName="tableName"
                    :databaseId="databaseId"
                    :tableColumns="tableColumns"
                    @onReloadData="onReloadData"
                    @onChangeDataSetFieldList="onChangeDataSetFieldList"
                    @onReloadDbSrclist="$emit('reload')"
                    v-if="tabHeaderView === 'structure'"
                  />
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-main>
    <!-- 抽屉弹窗 -->
    <el-drawer
      :visible.sync="drawerVisible"
      :modal="false"
      :show-close="false"
      direction="rtl"
      :before-close="onHandleDrawerClose"
    >
      <tableRowDataUpdate v-if="drawerVisible" @onReloadData="onReloadData" @onCancel="drawerVisible = false" :tableName="tableName" :databaseId="databaseId" :tableRowDetailData="tableRowDetailData" :tableColumns="tableColumns" />
    </el-drawer>
    <crudDialog
      :dialog-visible.sync="addDialogVisible"
      :title="'表单生成'"
      :tableColumns="tableColumns"
      :dbConfigId="databaseId"
      :dataSourceName="dataSourceName"
    />
  </el-container>
</template>

<script>
import controller from "./controller.js";
export default controller;
</script>

<style lang="scss" scoped>
@import "./index.scss";
/deep/.el-table th {
  user-select: initial;
}
</style>
