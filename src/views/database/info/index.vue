<template>
  <el-container v-loading="listLoading" style="flex-direction: column;">
    <!-- 头部操作 -->
    <custom-header :routerBackPath="`/database/list?databaseId=${$route.query.databaseId}`" isCustomBackHandle @onHeaderBackEvent="onHeaderBackEvent">
      <!-- <span slot="title">
        <el-input class="header_title" v-model="reductionName" size="small" placeholder="未命名" />
      </span> -->
      <div slot="opertBtn">
        <span class="el-button-opert-text">
          <el-button type="text" size="medium" icon="el-icon-tickets" @click="onSaveData">保 存</el-button>
        </span>
      </div>
    </custom-header>
    <!-- 主要内容 -->
    <el-main>
      <div class="tableau-page">
        <!-- sider 左侧边栏 数据表、数据集 -->
        <div class="tableau-sider" :style="{height: contentViewHeight}">
          <div class="database-block">
            <h2>
              数据源
              <span @click="onAddDatabase">添加</span>
            </h2>
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
          </div>
          <div class="table-search">
            <span>表</span>
            <span class="fr">
              <i class="el-icon-search" @click="isShowSiderTableSearch = !isShowSiderTableSearch" />
            </span>
            <div v-show="isShowSiderTableSearch" class="fr search-input-wrap">
              <el-input v-model="tableSearchKey" placeholder="输入搜索文本" width="30" size="mini" @input="onSearchField" />
            </div>
          </div>
          <ul class="table-list flex-3">
            <li
              v-for="(item, key) in dataTableList"
              :key="key"
              v-show="item.enable"
              :title="item.tableName"
              :class="{'active': selectedTableId === item.tableId}"
              @click="onSelectionTable(item.tableId, item.tableName)"
            >
              <i class="iconfont iconbiaoge"></i>
              {{ item.tableName }}
            </li>
          </ul>
        </div>
        <!-- content 右侧内容区 -->
        <div class="tableau-content" :style="{height: contentViewHeight}">
          <!-- 内容区 操作区域 -->
          <div class="content-header" :style="{height: !isShowTable ? '100%' : ''}">
            <!-- <div class="header-operation-btn">
              <el-button size="mini" @click="onPreviewData">预览数据</el-button>
            </div> -->
            <el-tabs v-model="tabHeaderView" v-show="!isScriptModel">
              <el-tab-pane label="数据预览" name="first">
                <div class="table-operation">
                  <el-form size="mini" :inline="true" class="form-gap">
                    <el-form-item>
                      <span class="operat-dropdown-link mini-font" @click="isShowDataFilter = !isShowDataFilter">
                        数据筛选
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                    </el-form-item>
                    <!-- <el-form-item>
                      <span class="operat-dropdown-link mini-font">
                        设置字段跳转
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                    </el-form-item> -->
                    <el-form-item>
                      <el-button>插入</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button>修改</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button>删除</el-button>
                    </el-form-item>
                    <!-- <el-form-item style="float: right;">
                      <div class="mini-font">
                        显示<span style="color: #E45151;"> 33 </span>条数据，共<span style="color: #E45151;"> 66 </span>条数据
                      </div>
                    </el-form-item> -->
                  </el-form>
                </div>
                <div class="content-header-wrap" v-show="isShowDataFilter">
                  <filterView :dataTableInfoMap="dataTableInfoMap" @onFilterData="onFilterData" />
                </div>
                <div v-if="isShowTable">
                  <!-- <el-table
                    :data="dataTableList"
                    element-loading-text="Loading"
                    highlight-current-row
                    stripe
                    border
                    style="width: 100%;"
                  >
                    <el-table-column
                      v-for="(item, key) in dataTableInfo"
                      :key="key"
                      width="200"
                      align="left"
                    >
                      <template slot="header">
                        <span>{{ item.name }}</span>
                      </template>
                    </el-table-column>
                  </el-table> -->
                  <el-table
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
              </el-tab-pane>
              <el-tab-pane label="字段设置" name="third">
                <div class="content-header-wrap">
                  <fieldSetView :dataTableList="dataTableInfo" @onChangeDataSetFieldList="onChangeDataSetFieldList" :dataSetFieldList="dataSetFieldList" v-if="tabHeaderView === 'third'" />
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import controller from "./controller.js";
export default controller;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
