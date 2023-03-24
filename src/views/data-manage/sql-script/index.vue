<template>
  <el-container v-loading="listLoading" style="flex-direction: column">
    <!-- 头部操作 -->
    <custom-header router-back-path="/">
      <div style="margin-left: 8px" slot="title">
        <span v-if="!isEditingName">
          {{ reductionName }}
        </span>
        <el-input
          v-if="isEditingName"
          v-model="reductionNewName"
          style="display: inline-block; width: 150px; margin-right: 10px"
          size="mini"
        />

        <el-button v-show="isEditingName" icon="el-icon-check" type="text" size="mini" @click="onEditScriptName" />
        <el-button v-show="isEditingName" icon="el-icon-close" type="text" size="mini" @click="isEditingName = false" />
        <el-button v-show="!isEditingName" icon="el-icon-edit" type="text" size="mini" @click="isEditingName = true" />
        <!-- {{reductionName}} -->
      </div>
      <div slot="opertBtn" style="margin-right: -142px">
        <span class="el-button-opert-text">
          <el-button
            type="text"
            size="medium"
            icon="el-icon-tickets"
            @click="onSaveData()"
            >保 存</el-button
          >
          <el-button
            v-show="isScriptModel && scriptModelType !== 'procedure'"
            type="text"
            size="medium"
            icon="el-icon-view"
            @click="onPreviewData"
            >查询</el-button
          >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-tickets"
            @click="uploadComment()"
            >上传市场</el-button
          >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-delete"
            @click="onDeleComment"
            >删除
          </el-button>
        </span>
      </div>
    </custom-header>
    <!-- 主要内容 -->
    <el-main>
      <div class="tableau-page">
        <div
          class="tableau-content noMargnLeft"
          :style="{ height: contentViewHeight }"
        >
          <!-- 内容区 操作区域 -->
          <div
            class="content-header"
            :style="{ height: !isShowTable ? '100%' : '' }"
          >
            <!-- <div v-show="!isScriptModel" class="header-operation-btn">
              <el-button size="mini" @click="onPreviewData">预览数据</el-button>
            </div> -->
            <div
              v-show="isScriptModel"
              class="content-header-wrap script-panel-wrap"
            >
              <div class="script-edit-wrap">
                <code-editor
                  v-if="!id || selectedDatabaseId"
                  v-model="execSqlText"
                  height="280px"
                  :mode="codeEditorMode"
                  :editor-options="editorOptions"
                />
              </div>
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
                    style="font-size: 20px; cursor: pointer"
                    title="隐藏表格"
                    @click="isShowTable = false"
                  />
                  <i
                    v-show="!isShowTable"
                    class="el-icon-upload2"
                    style="font-size: 20px; cursor: pointer"
                    title="显示表格"
                    @click="isShowTable = true"
                  />
                </el-form-item>
              </el-form>
            </div>
            <el-tabs v-model="tabContentView">
              <el-tab-pane label="数据预览" name="preview">
                <div
                  v-if="!isEditMode && isShowTable"
                  class="content-table-wrap"
                >
                  <el-table
                    v-show="!isEditMode"
                    v-loading="listLoading"
                    height="100%"
                    :data="executeResultValueList"
                    element-loading-text="Loading"
                    highlight-current-row
                    stripe
                    style="width: 100%"
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
              <el-tab-pane label="异常报告" name="report" disabled>
                <div v-show="isShowTable" class="content-table-wrap">
                  异常报告
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-main>
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
import controller from "./controllers/index";
export default controller;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
