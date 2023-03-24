/* eslint-disable */
<template>
  <div class="process-wrap">
    <!--<Row>-->
    <custom-header>
      <div slot="opertBtn">
        <span class="el-button-opert-text">
          <el-button
            type="text"
            class="save_btn"
            icon="el-icon-tickets"
            @click="saveData"
            >保存</el-button
          >
          <el-button
            type="text"
            icon="iconfont icon003-exam"
            class="save_btn"
            v-if="processId > 0"
            @click="testData"
            >测试</el-button
          >
          <!-- <el-button
            type="text"
            class="save_btn"
            icon="iconfont icondebugging"
            @click="debugData"
            >调试</el-button
          > -->
          <el-button
            type="text"
            size="medium"
            icon="iconfont icontrash"
            @click="deleteConfirm"
            >删除</el-button
          >
          <!--          <el-button-->
          <!--            type="text"-->
          <!--            size="medium"-->
          <!--            icon="iconfont iconshangchuan"-->
          <!--            @click="uploadCommentVisible = true"-->
          <!--            >上传市场-->
          <!--          </el-button>-->
          <!--          <el-button-->
          <!--            type="text"-->
          <!--            size="medium"-->
          <!--            icon="iconfont iconcloud-download"-->
          <!--            @click="downComponentDialogVisible = true"-->
          <!--            >市场下载-->
          <!--          </el-button>-->
        </span>
      </div>
    </custom-header>
    <div class="split-pane-page-wrapper">
      <div slot="left" class="pane left-pane">
        <div id="drag-items" class="shapes">
          <el-collapse
            v-model="collapseActives"
            @change="handleChange"
            class="aside-menu drag-shape"
          >
            <el-collapse-item
              :title="aside.label"
              :name="key"
              v-for="(aside, key) in mList"
              :key="key"
            >
              <template slot="title">
                <span class="aside-collapse-title">{{ aside.label }}</span>
              </template>
              <draggable
                tag="ul"
                class="menu-item-wrap"
                handle=".handle"
                :list="aside.componentList"
                v-bind="{
                  sort: false,
                }"
                @end="onDragMoveEnd"
                @start="onDragMoveStart($event, aside.componentList)"
              >
                <li
                  v-for="(componentConfig, configKey) in aside.componentList"
                  :key="configKey"
                  class="handle"
                >
                  <div class="drag-shape-img">
                    <img
                      class="drag-shape-icon"
                      :data-shape-type="componentConfig.type"
                      :src="componentConfig.url"
                    />
                  </div>
                  <div class="icon-text">
                    <span>{{ componentConfig.name }}</span>
                  </div>
                </li>
              </draggable>

              <!-- </el-tooltip> -->
              <!-- <draggable
                  tag="ul"
                  class="menu-item-wrap"
                  :list="aside.componentList"
                >
                  <li v-for="(componentConfig, configKey) in aside.componentList" :key="configKey" @click="handleField(item)">
                    <div>
                      <i class="iconfont" :class="componentConfig.icon"></i>
                    </div>
                    <div class="icon-text">
                      <span>{{ componentConfig.name }}</span>
                    </div>
                  </li>
                </draggable> -->
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div
        slot="right"
        class="pane right-pane right-wrap"
        style="overflow: auto"
      >
        <div id="container" style="background-color: white"></div>
        <div id="menu">
          <div>
            <button id="pulse-button" @click="configDiagram">配置</button>
            <button id="pulse-button" @click="copyDiagram">复制</button>
            <button id="delete-button" @click="deleteDiagram">删除</button>
          </div>
        </div>
        <div id="stageMenu">
          <div>
            <button id="pulse-button" @click="pasteDiagram">黏贴</button>
          </div>
        </div>
        <div class="r-menu">
          <i class="iconfont iconbeizhu" @click="showRemark" />
          <i
            class="iconfont icon47_jujiao"
            @click="zoomReal"
            style="font-size: 40px"
          />
          <i class="iconfont iconfangda" @click="zoomOut" />
          <i class="iconfont iconsuoxiao" @click="zoomIn" />
        </div>
      </div>
    </div>

    <!-- 组件上传 -->
    <uploadCommentDialog
      ref="uploadCommentForm"
      :dialog-visible.sync="uploadCommentVisible"
      title="流程上传"
    />
    <downComponentDialog
      :dialog-visible.sync="downComponentDialogVisible"
      openType="0"
      dataType="process"
      title="流程下载"
      @refreshProcessDetail="dealProcessDetail"
    />

    <!--</Row>-->
    <drag-drawer-debug
      title="调试"
      ref="drawerDebug"
      :width="width1"
      :flow="nextflow"
      :value="showDebugDrawer"
      :processId="processId"
      @cancel="cancelDebug"
      @showStep="showStep"
    ></drag-drawer-debug>
    <!--  可拖动抽屉  -->
    <drag-drawer
      v-model="showWindowBDrawer"
      :width.sync="width1"
      :min-width="300"
      :placement="placement"
      :draggable="draggable"
      @cancel="cancelDrawer"
      :scrollable="true"
    >
      <!-- <div slot="header" v-show="showWindowType === 'start'">
        <Icon type="md-aperture" :size="18"></Icon>
        <b>开始</b>
      </div>-->
      <div slot="title" v-show="showWindowType === 'startV4'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18" class="head-icon"></Icon> -->
        <img src="@/assets/icon/start.svg" class="head-icon" />
        <b>开始</b>
      </div>
      <drag-drawer-start
        :processId="processId"
        :ref="curDiagram.id"
        key="startV4"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'startV4'"
      ></drag-drawer-start>

      <div slot="title" v-show="showWindowType === 'setproperties'">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <b>设置变量</b>
      </div>
      <drag-drawer-setproperties
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'setproperties'"
      ></drag-drawer-setproperties>

      <div
        slot="title"
        v-show="showWindowType === 'connectorV4' && showWindowSubType"
        class="drag-head"
      >
        <img src="@/assets/icon/connector-query.svg" class="head-icon" />
        <b>数据</b>
      </div>
      <DragDrawerConnectorV4
        :ref="curDiagram.id"
        key="connector-query"
        :type="showWindowType"
        :subType="showWindowSubType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        @submitVarList="saveVarEdit"
        v-if="showWindowType === 'connectorV4' && showWindowSubType"
      ></DragDrawerConnectorV4>

      <div
        slot="title"
        v-show="showWindowType === 'connectorV4' && !showWindowSubType"
        class="drag-head"
      >
        <img src="@/assets/icon/connector.svg" class="head-icon" />
        <b>数据</b>
      </div>
      <drag-drawer-connector
        key="connectorV4"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        @submitVarList="saveVarEdit"
        v-if="showWindowType === 'connectorV4' && !showWindowSubType"
      ></drag-drawer-connector>

      <div
        slot="title"
        v-show="showWindowType === 'connectorV3'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/connector.svg" class="head-icon" />
        <b>数据</b>
      </div>
      <drag-drawer-connectorV3
        key="connectorV3Key"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        @submitVarList="saveVarEdit"
        v-if="showWindowType === 'connectorV3'"
      ></drag-drawer-connectorV3>

      <div
        slot="title"
        v-show="showWindowType === 'branchV4'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/branch.svg" class="head-icon" />
        <b>树枝形状</b>
      </div>
      <drag-drawer-branch
        :ref="curDiagram.id"
        key="branchKey"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'branchV4'"
      ></drag-drawer-branch>

      <div slot="title" v-show="showWindowType === 'stopV4'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/stop.svg" class="head-icon" />
        <b>结束</b>
      </div>
      <drag-drawer-stop
        :ref="curDiagram.id"
        key="stopV4"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'stopV4'"
      ></drag-drawer-stop>

      <div slot="title" v-show="showWindowType === 'routeV4'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/route.svg" class="head-icon" />
        <b>路由</b>
      </div>
      <drag-drawer-route
        :ref="curDiagram.id"
        key="routeV4"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'routeV4'"
      ></drag-drawer-route>

      <div slot="title" v-show="showWindowType === 'ifV4'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/if.svg" class="head-icon" />
        <b>条件</b>
      </div>
      <drag-drawer-if
        :ref="curDiagram.id"
        key="ifV4"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        @submitVarList="saveVarEdit"
        :processId="processId"
        v-if="showWindowType === 'ifV4'"
      ></drag-drawer-if>

      <div
        slot="title"
        v-show="showWindowType === 'programcommand'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/programcommand.jpg" class="head-icon" />
        <b>命令</b>
      </div>
      <drag-drawer-command
        key="command"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'programcommand'"
      ></drag-drawer-command>

      <div
        slot="title"
        v-show="showWindowType === 'dataprocessV4' && showWindowSubType"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/dataprocess.svg" class="head-icon" />
        <b>函数</b>
      </div>
      <DragDrawerDataprocessV4
        :ref="curDiagram.id"
        key="dataprocessV4"
        :type="showWindowType"
        :subType="showWindowSubType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'dataprocessV4' && showWindowSubType"
      ></DragDrawerDataprocessV4>

      <div
        slot="title"
        v-show="showWindowType === 'dataprocess' && !showWindowSubType"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/dataprocess.svg" class="head-icon" />
        <b>函数</b>
      </div>
      <drag-drawer-dataprocess
        :ref="curDiagram.id"
        key="dataprocessV4"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'dataprocessV4' && !showWindowSubType"
      ></drag-drawer-dataprocess>

      <div
        slot="title"
        v-show="showWindowType === 'returnV4'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/return.svg" class="head-icon" />
        <b>输出</b>
      </div>
      <drag-drawer-return
        :ref="curDiagram.id"
        key="returnV4"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        @updatestart="updatestart"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'returnV4'"
      ></drag-drawer-return>

      <div slot="title" v-show="showWindowType === 'loopV4'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/loop.svg" class="head-icon" />
        <b>循环</b>
      </div>
      <drag-drawer-loop
        :ref="curDiagram.id"
        key="loopV4"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        @submitVarList="saveVarEdit"
        :processId="processId"
        v-if="showWindowType === 'loopV4'"
      ></drag-drawer-loop>

      <div slot="title" v-show="showWindowType === 'processcallV4'">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/processcall.svg" class="head-icon" />
        <b>流程</b>
      </div>
      <drag-drawer-call
        :mainProcessId="processId"
        :ref="curDiagram.id"
        key="processcallV4"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'processcallV4'"
      ></drag-drawer-call>

      <div slot="title" v-show="showWindowType === 'message'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/message.svg" class="head-icon" />
        <b>消息</b>
      </div>
      <drag-drawer-message
        :ref="curDiagram.id"
        key="message"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'message'"
      ></drag-drawer-message>

      <div slot="title" v-show="showWindowType === 'notify'">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <b>通知组件</b>
      </div>
      <drag-drawer-notify
        :ref="curDiagram.id"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'notify'"
      ></drag-drawer-notify>

      <div slot="title" v-show="showWindowType === 'exception'">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <b>异常组件</b>
      </div>
      <drag-drawer-exception
        :ref="curDiagram.id"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'exception'"
      ></drag-drawer-exception>

      <div
        slot="title"
        v-show="showWindowType === 'interface'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/interface.svg" class="head-icon" />
        <b>接口</b>
      </div>
      <drag-drawer-interface
        :ref="curDiagram.id"
        key="interface"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'interface'"
      ></drag-drawer-interface>

      <div
        slot="title"
        v-show="showWindowType === 'interfaceV4'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/interface.svg" class="head-icon" />
        <b>接口</b>
      </div>
      <drag-drawer-interfaceV4
        :mainProcessId="processId"
        :ref="curDiagram.id"
        key="interface"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'interfaceV4'"
      ></drag-drawer-interfaceV4>
      <div
        slot="title"
        v-show="showWindowType === 'scriptV4'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/interface.svg" class="head-icon" />
        <b>代码</b>
      </div>
      <DragDrawerScriptV4
        :ref="curDiagram.id"
        key="custom"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'scriptV4'"
      >
      </DragDrawerScriptV4>

      <div
        slot="title"
        v-show="showWindowType === 'dataJoinV4'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/dataprocess.svg" class="head-icon" />
        <b>数据集连接</b>
      </div>
      <DragDrawerDataJoinV4
        :ref="curDiagram.id"
        key="custom"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'dataJoinV4'"
      >
      </DragDrawerDataJoinV4>

      <div
        slot="title"
        v-show="showWindowType === 'dataUnionV4'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/dataprocess.svg" class="head-icon" />
        <b>数据集合并</b>
      </div>
      <DragDrawerDataUnionV4
        :ref="curDiagram.id"
        key="custom"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'dataUnionV4'"
      >
      </DragDrawerDataUnionV4>

      <div
        slot="title"
        v-show="showWindowType === 'dataSortV4'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/dataprocess.svg" class="head-icon" />
        <b>数据集排序</b>
      </div>
      <DragDrawerDataSortV4
        :ref="curDiagram.id"
        key="custom"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'dataSortV4'"
      >
      </DragDrawerDataSortV4>

      <div slot="title" v-show="showWindowType === 'log'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/log.svg" class="head-icon" />
        <b>日志</b>
      </div>
      <DragDrawerLog
        :processId="processId"
        :ref="curDiagram.id"
        key="log"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'log'"
      >
      </DragDrawerLog>
    </drag-drawer>

    <el-dialog
      :visible.sync="testModal"
      title="流程测试"
      width="700"
      @open="testModalDialogOpen"
    >
      <el-row>
        <el-col :span="16">
          <el-form
            :model="testParams"
            ref="testForm"
            label-width="120px"
            label-position="left"
          >
            <el-form-item label="接口地址">
              {{ testParams.interfaceUrl }}
            </el-form-item>

            <el-form-item
              :prop="'testArgs.' + index + '.value'"
              :label="item.name"
              v-for="(item, index) in testParams.testArgs"
              :key="index"
            >
              <el-date-picker
                v-if="item.type == 2"
                v-model="item.value"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
              <el-input v-else v-model="item.value"></el-input>
            </el-form-item>
            <!-- <el-input
              v-model="testProperties"
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 10 }"
            ></el-input> -->
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            size="medium"
            long
            :loading="testLoading"
            @click="TestPro('testForm')"
            >{{ testText }}</el-button
          >
        </el-col>
      </el-row>
      <el-tabs v-model="testActiveName">
        <el-tab-pane label="响应数据" name="data">
          <el-row style="max-height: 380px; overflow-y: auto">
            <el-col :span="24" v-if="!errorMessage">
              <el-tree
                :data="treeDataList"
                :render-content="renderContent"
                :default-expand-all="true"
              ></el-tree>
            </el-col>
            <el-col
              :span="24"
              v-if="errorMessage"
              style="white-space: pre-wrap"
            >
              {{ errorMessage }}
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="运行日志" name="log">
          <el-row style="max-height: 380px; overflow-y: auto">
            <el-col :span="24">
              <ul>
                <li
                  style="padding-left: 20px"
                  v-for="(logItem, key) in logList"
                  :key="key"
                >
                  {{ logItem }}
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="控制台" name="console">
          <el-row style="margin: 10px; text-align: center">
            <el-col :span="24">
              <el-date-picker
                v-model="consoleDateRange"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
              <el-button
                type="primary"
                style="margin-left: 10px"
                @click="getConsoleRequest"
                >查询</el-button
              >
            </el-col>
          </el-row>

          <el-row style="max-height: 380px; overflow-y: auto">
            <el-col :span="24">
              <ul>
                <li v-for="(conItem, ckey) in consoleList" :key="ckey">
                  <div v-for="(spanItem, skey) in conItem.spans" :key="skey">
                    <div v-for="(logItem, lKey) in spanItem.logs" :key="lKey">
                      <div class="console-info">
                        traceID:{{ spanItem.traceID }} --
                        {{ dateTimeFormatter(logItem.timestamp / 1000) }}
                      </div>
                      {{ logItem.fields[0].value }}
                    </div>
                  </div>
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer"></div>
    </el-dialog>
    <el-dialog
      :visible.sync="testResult"
      title="流程测试结果"
      width="90%"
      class-name="test-result-modal"
    >
      <el-table :data="testResultData" v-if="testResultData.length > 0">
        <el-table-column
          v-for="(testResultItem, index) in testResultColumns"
          :key="index"
          :label="testResultItem.title"
          :prop="testResultItem.key"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[scope.column.property] }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div v-else>
        {{ testResultError }}
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="copyModel"
      @on-ok="copyConfirm"
      title="流程复制"
      class-name="test-result-modal"
    >
      <el-form label-width="80px" label-position="left">
        <el-form-item prop="copyName" label="复制为">
          <i-input v-model="copyName" placeholder="请输入"></i-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="setModel"
      @on-ok="setConfirm"
      class="set-model"
      title="设置"
      class-name="test-result-modal"
    >
      <el-form
        :model="settingModel"
        label-width="80px"
        label-position="left"
        :rules="setRule"
        ref="settingForm"
      >
        <el-form-item prop="setName" label="定时执行">
          <el-input
            search
            enter-button
            v-model="settingModel.setName"
            placeholder="请输入定时执行时间，点击“?”查看帮助"
            @on-search="settingHelp"
          />
        </el-form-item>
        <!--<Icon type="help"></Icon>-->
        <el-form-item prop="setDesc" label="流程说明">
          <el-input
            v-model="settingModel.setDesc"
            type="textarea"
            :rows="6"
            placeholder="请输入流程说明"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" size="large" @click="setConfirm">确定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      title="版本管理"
      v-model="value3"
      width="720"
      :inner="true"
      :transfer="false"
      :mask-closable="true"
      :styles="styles"
    >
      <el-form :model="formData" :label-width="100">
        <el-form-item label="Component ID">
          <el-input
            v-model="formData.id || ''"
            disabled
            placeholder="请选中表格数据"
          />
        </el-form-item>
        <el-form-item label="Created By">
          <el-input
            v-model="formData.by || ' '"
            disabled
            placeholder="请选中表格数据"
          />
        </el-form-item>
        <el-form-item label="Created Date">
          <el-input
            v-model="formData.date"
            disabled
            placeholder="请选中表格数据"
          />
        </el-form-item>
        <Table
          :columns="columns1"
          :data="data1"
          stripe
          no-data-text="暂无数据"
          @on-row-click="selectVer"
        ></Table>
        <Page
          class="page-wrap"
          v-if="verCount > 0"
          :total="verCount"
          :current="curVerIdx"
          :page-size="verSize"
          @on-change="changeVerPage"
        ></Page>
      </el-form>
    </el-drawer>

    <el-dialog
      v-model="addVarModal"
      title="新增变量"
      width="300"
      @on-ok="confirmNewVarTag"
    >
      <el-form :label-width="100" class="routeBy-form" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="newVarTagName" />
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      v-model="deleteVarModal"
      title="确认删除变量"
      width="300"
      @on-ok="confirmdeleteVarTag"
    >
      <span>确认删除{{ deleteTagName }}</span>
    </el-dialog>
    <el-dialog
      v-model="quitVarModal"
      title="提示"
      width="400"
      @on-ok="confirmQuit"
    >
      <span>您要保存对页面所做的更改吗？如果不保存，你更改的内容将丢失！</span>
      <div slot="footer">
        <el-button @click="cancalQuit">取消</el-button>
        <el-button @click="confirmQuit">不保存</el-button>
        <el-button type="primary" @click="saveQuit">保存</el-button>
      </div>
    </el-dialog>
    <VarEdit
      ref="varEdit"
      :show="showVarEditModel"
      @cancalVarEdit="cancalVarEdit"
      @submitVarList="saveVarEdit"
    />
    <!-- 流程备注 -->
    <el-dialog
      :visible.sync="remarkModal"
      title="流程备注"
      width="50%"
      @on-ok="confirmRemark"
    >
      <el-input
        size="small"
        v-model="processName"
        type="textarea"
        placeholder="请输入流程名称"
        class="header_title"
        style="background-color: transparent"
      />
      <div class="upload-div">
        <div class="demo-upload-list" v-for="item in uploadList">
          <img :src="item.url" />
          <div class="demo-upload-list-cover">
            <i class="el-icon-view" @click="handleView(item)"></i>
            <i class="el-icon-delete" @click="handleFileRemove(item)"></i>
          </div>
        </div>

        <el-upload
          ref="upload"
          type="drag"
          :action="baseUrl + '/file/v1/upload?type=remark'"
          :data="{ merchantId: merchantId, projectId: projectId }"
          list-type="picture-card"
          :format="['jpg', 'jpeg', 'png']"
          :on-preview="handlePictureCardPreview"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
    </el-dialog>
    <el-dialog title="View Image" :visible.sync="imageVisible">
      <img :src="imageUrl" v-if="imageVisible" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import Draggable from "vuedraggable";
import SplitPane from "./split-pane";
import Konva from "konva";
import NextFlow from "./nextflow.js";
import DragDrawer from "./drag-drawer";
import DragDrawerStart from "./drag-drawer-startV4";
import DragDrawerSetproperties from "./drag-drawer-setproperties";
import DragDrawerConnector from "./drag-drawer-connectorV4";
import DragDrawerConnectorV4 from "./connectorV4/drag-drawer-connectorV4";

// import DragDrawerConnectorV3 from "./drag-drawer-connectorV4";
import DragDrawerBranch from "./drag-drawer-branch";
import DragDrawerStop from "./drag-drawer-stop";
import DragDrawerRoute from "./drag-drawer-routeV4";
import DragDrawerIf from "./drag-drawer-ifV4";
import DragDrawerCommand from "./drag-drawer-command";
import DragDrawerDataprocess from "./drag-drawer-dataprocessV4";
import DragDrawerDataprocessV4 from "./dataProcessV4/drag-drawer-dataprocessV4";
import DragDrawerReturn from "./drag-drawer-returnV4";
import DragDrawerLoop from "./drag-drawer-loopV4";
import DragDrawerCall from "./drag-drawer-callV4";
import DragDrawerMessage from "./drag-drawer-message";
import DragDrawerNotify from "./drag-drawer-notify";
import DragDrawerException from "./drag-drawer-exception";
import DragDrawerInterface from "./drag-drawer-interface";
import DragDrawerInterfaceV4 from "./drag-drawer-interfaceV4";

//自定义代码块
import DragDrawerScriptV4 from "./script/drag-drawer-scriptV4";
import DragDrawerDataJoinV4 from "./dataSetV4/drag-drawer-dataJoinV4";
import DragDrawerDataUnionV4 from "./dataSetV4/drag-drawer-dataUnionV4";
import DragDrawerDataSortV4 from "./dataSetV4/drag-drawer-dataSortV4";
// 调试
import DragDrawerDebug from "./drag-drawer-debug";
// 日志
import DragDrawerLog from "./dataLog/drag-drawer-log";

//上传下载
import uploadCommentDialog from "@/views/report/modules/uploadComment/index.vue";
import downComponentDialog from "@/views/project-design/dialog-module/downComment/index.vue";

/* eslint-disable */
import CustomHeader from "@/components/customHeader";
import VarEdit from "./module/variable-edit";
import { getTest, getConsole } from "@/api/report";
import {
  getProcess,
  createProcess,
  updateProcess,
  deleteProcess,
  getVersions,
  updateCron,
  getScript,
} from "@/api/process";
import { createNewProcess, getNewProcessDetail } from "@/api/process";
import { delProcessV4 } from "@/api/v4";
import { renameProcessService } from "@/api/v4/index";
// import {
//   getVariableList,
//   createVariable,
//   updateVariable,
//   deleteVariable,
// } from "@/api/variable";
import { mapActions, mapMutations, mapGetters } from "vuex";
import store from "@/store";
import menu from "./menu/menu";
// import config from "@/config";
// 富文本编辑器
import "../../../node_modules/quill/dist/quill.core.css";
import "../../../node_modules/quill/dist/quill.snow.css";
import "../../../node_modules/quill/dist/quill.bubble.css";
import {getStorage,setStorage} from "@/util/storageUtil.js";
// import { quillEditor } from "vue-quill-editor";
export default {
  name: "NewProcess",
  components: {
    SplitPane,
    CustomHeader,
    DragDrawer,
    DragDrawerStart,
    DragDrawerSetproperties,
    DragDrawerConnector,
    DragDrawerConnectorV4,
    DragDrawerBranch,
    DragDrawerStop,
    DragDrawerRoute,
    DragDrawerIf,
    DragDrawerCommand,
    DragDrawerDataprocess,
    DragDrawerDataprocessV4,
    DragDrawerReturn,
    DragDrawerLoop,
    DragDrawerCall,
    DragDrawerMessage,
    DragDrawerNotify,
    DragDrawerException,
    DragDrawerInterface,
    DragDrawerInterfaceV4,
    DragDrawerDebug,
    DragDrawerScriptV4,
    DragDrawerDataJoinV4,
    DragDrawerDataUnionV4,
    DragDrawerDataSortV4,
    DragDrawerLog,
    VarEdit,
    uploadCommentDialog,
    downComponentDialog,
    Draggable,
    // quillEditor,
  },
  props: {
    id: {
      type: String | Number,
      default: 0,
    },
    treeId: {
      type: String | Number,
      default: 0,
    },
  },
  data() {
    return {
      self: this,
      processName: "新建流程",
      processId: 0,
      thirdUserId: "",
      merchantId: 0,
      userName: "",
      selectedDiagram: undefined,
      showDeleteBtn: true,
      curDiagram: {},
      properties: {
        arguments: [],
      },
      arguments: [],
      projectId: 0,
      uploadCommentVisible: false,
      downComponentDialogVisible: false,
      showWindowBDrawer: false,
      width1: "50%",
      width2: 200,
      placement: "right",
      draggable: true,
      confirmModal: false,
      confirm_modal_loading: false,
      testModal: false,
      testResult: false,
      testParams: { testArgs: [] },
      testProperties: "",
      testLoading: true,
      testLog: true,
      testText: "正在保存...",
      testResultData: [],
      testResultColumns: [],
      treeDataList: [],
      testActiveName: "data",
      props: {
        label: "name",
        children: "children",
      },
      testResultKeys: [
        "ckdm",
        "end_time",
        "spdm",
        "start_time",
        "cycle",
        "rate",
        "purchase",
        "sales_volume",
      ],
      testResultTotal: 0,
      testResultPageIndex: 1,
      testResultPageSize: 2,
      testResultError: "",
      showWindowType: "",
      showWindowSubType: "",
      logList: [],
      consoleDateRange: [new Date(new Date() - 300000), new Date()],
      consoleList: [],
      offset: "250px",
      offsetVertical: "250px",
      flowchart: undefined,
      nextflow: undefined,
      shapes: [
        // { id: 'start', type: 'start', name: '开始', url: require('@/assets/icon/start.jpg') },
        {
          id: "connectorV4",
          type: "connectorV4",
          name: "数据",
          url: require("@/assets/icon/connector.svg"),
        },

        {
          id: "loopV4",
          type: "loopV4",
          name: "循环",
          url: require("@/assets/icon/loop.svg"),
        },
        {
          id: "branchV4",
          type: "branchV4",
          name: "分支",
          url: require("@/assets/icon/branch.svg"),
        },
        {
          id: "ifV4",
          type: "ifV4",
          name: "条件",
          url: require("@/assets/icon/if.svg"),
        },
        {
          id: "routeV4",
          type: "routeV4",
          name: "路由",
          url: require("@/assets/icon/route.svg"),
        },
        {
          id: "dataprocessV4",
          type: "dataprocessV4",
          name: "函数",
          url: require("@/assets/icon/dataprocess.svg"),
        },
        {
          id: "returnV4",
          type: "returnV4",
          name: "输出",
          url: require("@/assets/icon/return.svg"),
        },
        {
          id: "stopV4",
          type: "stopV4",
          name: "结束",
          url: require("@/assets/icon/stop.svg"),
        },

        {
          id: "processcallV4",
          type: "processcallV4",
          name: "流程",
          url: require("@/assets/icon/processcall.svg"),
        },
        {
          id: "message",
          type: "message",
          name: "消息",
          url: require("@/assets/icon/message.svg"),
        },
        {
          id: "interfaceV4",
          type: "interfaceV4",
          name: "接口",
          url: require("@/assets/icon/interface.svg"),
        },
        {
          id: "scriptV4",
          type: "scriptV4",
          name: "代码",
          url: require("@/assets/icon/processcall.svg"),
        },
        {
          id: "log",
          type: "log",
          name: "日志",
          url: require("@/assets/icon/message.svg"),
        },

        // {
        //   id: "programcommand",
        //   type: "programcommand",
        //   name: "命令",
        //   url: require("@/assets/icon/programcommand.jpg"),
        // },

        // {
        //   id: "setproperties",
        //   type: "setproperties",
        //   name: "设置变量",
        //   url: require("@/assets/icon/setproperties.jpg")
        // },
        // {
        //   id: "notify",
        //   type: "notify",
        //   name: "通知组件",
        //   url: require("@/assets/icon/notify.jpg")
        // },
        // {
        //   id: "exception",
        //   type: "exception",
        //   name: "异常组件",
        //   url: require("@/assets/icon/exception.jpg")
        // }
      ],
      copyName: "",
      copyId: "",
      copyModel: false,
      setModel: false,
      settingModel: {
        setName: "",
        setDesc: "",
      },
      setRule: {
        setName: [
          { required: true, message: "请输入定时执行时间", trigger: "blur" },
        ],
        setDesc: [
          { required: true, message: "请输入流程说明", trigger: "blur" },
        ],
      },
      value3: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static",
      },
      formData: {
        name: "",
        id: 0,
        by: "",
        date: "",
      },
      columns1: [
        {
          title: "修订",
          key: "name",
        },
        {
          title: "修改人",
          key: "updatedBy",
        },
        {
          title: "修改日期",
          key: "updatedAt",
        },
      ],
      data1: [],
      totalPage: 10,
      curVerIdx: 1,
      verCount: 0,
      verSize: 5,
      scriptText: "11",
      setVariateModal: false,
      showVarEditModel: false,
      variateTagList: [],
      commonVar: [
        {
          name: "系统变量",
          checked: false,
          editable: true,
          type: 4,
          variables: [
            {
              name: "当前用户名称",
              type: 0,
              value: "",
              color: "#328DF5",
            },
            {
              name: "当前用户编号",
              type: 0,
              value: "",
              color: "#328DF5",
            },
            {
              name: "body",
              type: 0,
              value: "",
              color: "#328DF5",
            },
          ],
        },
        {
          name: "输入参数",
          checked: false,
          editable: true,
          type: 4,
          variables: [],
        },
        {
          name: "常量",
          checked: false,
          editable: true,
          type: 4,
          variables: [
            // {
            //   name: "测试",
            //   type: 1,
            //   value: "演示值",
            //   index: 1
            // }
          ],
        },
        {
          name: "列表",
          checked: false,
          editable: true,
          variables: [],
        },
      ],
      tagChooseIdx: 0,
      variateIndex: 0,
      variateInfo: {},
      addVarModal: false,
      deleteVarModal: false,
      quitVarModal: false,
      newVarTagName: "",
      deleteTagName: "",
      showDebugDrawer: false,
      remarkModal: false,
      remark: "",
      baseUrl: "https//localhost:40518/platform/api",
      // process.env.NODE_ENV === "development"
      //   ? config.baseUrl.dev
      //   : config.baseUrl.pro,
      editorOption: {
        placeholder: "请输入正文",
      },
      uploadList: [],
      imageVisible: false,
      imageUrl: "",
      devSwitch: true,
      subProcessId: [],
      dialogImageUrl: "",
      dialogVisible: false,
      flowDataList: [
        "connectorV4",
        "interfaceV4",
        "processcallV4",
        "dataJoinV4",
      ],
      collapseActives: [0, 1, 2, 3, 4],
      mList: [],
      errorMessage: "",
    };
  },
  created() {
    console.log("process create", menu.menuList);
    this.mList = menu.menuList;
    let { id } = this.id;
    if (typeof id != "undefined") {
      this.initData();
    }
  },
  mounted: function () {
    console.log("on load");
    var a = Konva;
    var width = 1980;
    var height = 1024;

    this.nextflow = new NextFlow(width, height);
    this.draggingNode = null;
    var _this = this;
    // document
    //   .getElementById("drag-items")
    //   .addEventListener("dragstart", function (e) {
    //     console.log("drag start", e);
    //     var imgs = e.target.getElementsByClassName("drag-shape-icon");
    //     if (imgs !== undefined && imgs.length > 0) {
    //       e.dataTransfer.setDragImage(imgs[0], 0, 0);
    //     }

    //     _this.draggingNode = _this.getNodeData(e.target, "data-shape-type");
    //   });

    var con = this.nextflow.stage.container();
    con.addEventListener("dragover", function (e) {
      e.preventDefault(); // !important
    });

    con.addEventListener("drop", function (e) {
      e.preventDefault();
      // now we need to find pointer position
      // we can't use stage.getPointerPosition() here, because that event
      // is not registered by Konva.Stage
      // we can register it manually:
      _this.nextflow.stage.setPointersPositions(e);
      const pos = _this.nextflow.stage.getPointerPosition();
      // nextflow.createStart('开始', pos.x, pos.y);
      _this.nextflow.createDiagram(_this.draggingNode, pos.x, pos.y);
      // 2021-04-02 这里初始化v4 组件变量对象，不知道为啥要设置个延时，以后有时间研究TODO
      setTimeout(function () {
        _this.addVariableV4Data();
      }, 500);
    });

    var showRightMenu = true;

    let nextflow = this.nextflow;
    let currentShape;

    this.nextflow.on("click", this.onSelect);
    // this.nextflow.on('mouseenter', function(e) {
    //   console.log('mouse enter shape', e);
    //   if(showRightMenu === false) {
    //     showRightMenu = true;
    //     menuNode.style.display = 'initial';

    //     // currentShape = e.target;
    //     // var containerRect = nextflow.stage.container().getBoundingClientRect();
    //     // let pos = currentShape.absolutePosition();
    //     // menuNode.style.top = pos.y + 'px'; // currentShape. nextflow.stage.getPointerPosition().y + 10 +'px';
    //     // menuNode.style.left = pos.x + 'px'; // nextflow.stage.getPointerPosition().x + 10 + 'px';
    //   }

    // });
    // this.nextflow.on('mouseleave', function() {
    //   console.log('mouse leave shape');
    //   //
    //   if(showRightMenu) {
    //     // menuNode.style.display = 'none';
    //   }
    // });

    var menuNode = document.getElementById("menu");
    var stageMenuNode = document.getElementById("stageMenu");
    // document.getElementById('pulse-button').addEventListener('click', () => {
    //   currentShape.to({
    //     scaleX: 2,
    //     scaleY: 2,
    //     onFinish: () => {
    //       currentShape.to({ scaleX: 1, scaleY: 1})
    //     }
    //   })
    // });

    // document.getElementById('delete-button').addEventListener('click', () => {
    //   if(_this.selectedDiagram) {
    //     nextflow.destroy(currentShape.diagram);
    //   }
    //   layer.draw();
    // });

    window.addEventListener("click", () => {
      // hide menu
      menuNode.style.display = "none";
      stageMenuNode.style.display = "none";
      showRightMenu = false;
    });

    nextflow.stage.on("contextmenu", function (e) {
      // prevent default behavior
      e.evt.preventDefault();
      if (e.target === nextflow.stage) {
        // if we are on empty place of the stage we will do nothing
        stageMenuNode.style.display = "initial";
        stageMenuNode.style.top = e.evt.offsetY + 10 + "px"; // currentShape. nextflow.stage.getPointerPosition().y + 10 +'px';
        stageMenuNode.style.left = e.evt.offsetX + 10 + "px"; //

        stageMenuNode.style.x = e.evt.offsetX;
        stageMenuNode.style.y = e.evt.offsetY;
        return;
      }
      currentShape = e.target;
      _this.selectedDiagram = currentShape.diagram;
      if (
        _this.selectedDiagram !== undefined &&
        _this.selectedDiagram.type === "start"
      ) {
        _this.showDelete = false;
      } else {
        _this.showDelete = true;
      }
      // show menu
      menuNode.style.display = "initial";
      // var containerRect = nextflow.stage.container().getBoundingClientRect();
      // menuNode.style.top = nextflow.stage.getPointerPosition().y + 10 +'px';
      // menuNode.style.left = nextflow.stage.getPointerPosition().x + 20 + 'px';

      let pos = currentShape.absolutePosition();
      menuNode.style.top = pos.y + 10 + "px"; // currentShape. nextflow.stage.getPointerPosition().y + 10 +'px';
      menuNode.style.left = pos.x + 44 + "px"; // nextflow.stage.getPointerPosition().x + 10 + 'px';
    });
    let { id } = this.$route.params;
    if (typeof id == "undefined") {
      this.initData();
    }
    // this.initData();
    // this.initVariable();
  },
  watch: {
    //  this.$route.path
    // '$route.path': function (newVal, oldVal) {
    //     if(newVal != oldVal){
    //       this.initData()
    //     }
    // }
  },
  methods: {
    ...mapActions([
      "getProcess",
      "createProcess",
      "updateProcess",
      "getScript",
      "getVariableList",
      "createVariable",
      "updateVariable",
      "createNewProcess",
      "getNewProcessDetail",
      "renameProcessService",
    ]),
    ...mapMutations(["closeTag", "addTag", "setVarMap"]),
    // 开始组件传过来的数据
    syncData(data) {
      console.log("config data", JSON.stringify(data), this.curDiagram);
      // let dataList = ["connectorV4","interfaceV4","dataprocessV4"]
      // //在保存的时候 给变量里赋值一个叫做循环的对象名字就叫showname
      // if(this.curDiagram.type =='callV4'){
      //   this.syncCallVarData(data,this.curDiagram.id)
      // }else if(dataList.indexOf(this.curDiagram.type)!=-1){
      //   console.log("dataList",dataList,this.curDiagram);
      //   this.syncVarData(data,this.curDiagram)
      // }
      // 更新组件变量名称
      this.updateVarTag();
      //设置当前Diagram的名称
      if (data.title) {
        this.curDiagram.setTitle(data, this.curDiagram.type, data.title);
        delete data.title;
      }
      this.curDiagram.properties = data;
      if (this.curDiagram.type === "branchV4") {
        let outPutCount = this.curDiagram.properties.branch_count;
        this.curDiagram.updateOutputPorts(outPutCount);
      } else if (this.curDiagram.type === "routeV4") {
        let len = this.curDiagram.properties.routes.length;
        this.curDiagram.updateOutputPorts(len + 1);
      }
      this.showWindowBDrawer = false; // 显示可拖动抽屉
      this.curDiagram = {};
      this.showWindowType = " ";
      this.showWindowSubType = "";

      //      this.saveData()
    },
    syncVarData(data, curDiagram) {
      console.log("syncVarData", this.variateTagList);
      let tag = {
        id: curDiagram.id,
        ctype: curDiagram.type,
        name: data.title,
        type: 4, // 默认为变量对象
        value: "",
        variables: [],
      };
      let existFlag = false;
      this.variateTagList.forEach((varTag) => {
        if (varTag.id && varTag.id === curDiagram.id) {
          varTag.name = data.title;
          existFlag = true;
        }
      });
      if (!existFlag) {
        this.variateTagList.push(tag);
      }
      this.handlerVarMap(this.variateTagList);
    },
    handlerVarMap(variateTagList) {
      let varMap = {
        processId: this.processId,
        varTagList: variateTagList,
      };
      this.setVarMap(varMap);
    },
    // 这个方法主要的作用是定位到哪个新增的
    addVariableV4Data(configJson) {
      let varMap = this.$store.getters.varMap;
      this.variateTagList = varMap.get(this.processId);
      configJson = configJson ? configJson : this.nextflow.export();
      let nodes = configJson.nodes;
      nodes &&
        nodes.forEach((node) => {
          let existFlag = false;
          if (this.flowDataList.indexOf(node.type) != -1) {
            //
            let tag = {
              id: node.id,
              ctype: node.type,
              name: node.title,
              type: 4, // 默认为变量对象
              value: "",
              variables: [],
            };
            if (node.type == "interfaceV4") {
              tag.type = 8;
            }
            if (node.type == "callV4") {
              tag.type = 9;
            }
            this.variateTagList.forEach((nTag) => {
              if (nTag.id && nTag.id === node.id) {
                // varTag.name = node.title
                existFlag = true;
              }
            });
            if (!existFlag) {
              this.variateTagList.push(tag);
            }
          }
        });
      this.handlerVarMap(this.variateTagList);
    },
    updateVarTag() {
      let varMap = this.$store.getters.varMap;
      let variateTagList = varMap.get(this.processId);
      setTimeout(() => {
        let configJson = this.nextflow.export();
        let nodes = configJson.nodes;
        nodes &&
          nodes.forEach((node) => {
            variateTagList.forEach((vTag) => {
              if (vTag.id && vTag.id === node.id) {
                vTag.name = node.title;
              }
            });
          });
        this.handlerVarMap(variateTagList);
        this.handleNodeVar(nodes);
      }, 500);
    },
    handleNodeVar(nodes) {
      //  将node 平铺 成一个map
      let nodeMap = new Map();
      nodes &&
        nodes.forEach((node) => {
          nodeMap.set(node.id, node);
        });

      nodes &&
        nodes.forEach((node) => {
          if (node.type == "dataprocessV4") {
            node.properties.steps &&
              node.properties.steps.forEach((item) => {
                item.args &&
                  item.args.forEach((argItem) => {
                    if (argItem.id) {
                      argItem.category = nodeMap.get(argItem.id).title;
                    }
                  });
                if (item.target && item.target.id) {
                  item.target.category = nodeMap.get(item.target.id).title;
                }
              });
          } else if (node.type == "connectorV4") {
            node.properties.sourceList &&
              node.properties.sourceList.forEach((item) => {
                if (item.source.id) {
                  item.source.category = nodeMap.get(item.source.id).title;
                }
              });
            node.properties.setList &&
              node.properties.setList.forEach((item) => {
                if (item.source.id) {
                  item.source.category = nodeMap.get(item.source.id).title;
                }
              });
            node.properties.conditions &&
              node.properties.conditions.forEach((item) => {
                if (item.value.id) {
                  item.value.category = nodeMap.get(item.value.id).title;
                }
                if (item.condition.left && item.condition.left.id) {
                  item.condition.left.category = nodeMap.get(
                    item.condition.left.id
                  ).title;
                }
                if (item.condition.right && item.condition.right.id) {
                  item.condition.right.category = nodeMap.get(
                    item.condition.right.id
                  ).title;
                }
              });
          } else if (node.type == "ifV4") {
            if (node.properties.left_value.id) {
              node.properties.left_value.category = nodeMap.get(
                node.properties.left_value.id
              ).title;
            }
            if (node.properties.right_value.id) {
              node.properties.right_value.category = nodeMap.get(
                node.properties.right_value.id
              ).title;
            }
          } else if (node.type == "loopV4") {
            if (node.properties.source && node.properties.source.id) {
              node.properties.source.category = nodeMap.get(
                node.properties.source.id
              ).title;
            }
            if (node.properties.condition.left_value.id) {
              node.properties.condition.left_value.category = nodeMap.get(
                node.properties.condition.left_value.id
              ).title;
            }
            if (node.properties.condition.right_value.id) {
              node.properties.condition.right_value.category = nodeMap.get(
                node.properties.condition.right_value.id
              ).title;
            }
          } else if (node.type == "routeV4") {
            if (node.properties.property.id) {
              node.properties.property.category = nodeMap.get(
                node.properties.property.id
              ).title;
            }
            node.properties.routes.forEach((item) => {
              if (item.value.id) {
                item.value.category = nodeMap.get(item.value.id).title;
              }
            });
          } else if (node.type == "processcallV4") {
            node.properties.inputs.forEach((item) => {
              if (item.value.id) {
                item.value.category = nodeMap.get(item.value.id).title;
              }
            });
            node.properties.outputs.forEach((item) => {
              if (item.value.id) {
                item.value.category = nodeMap.get(item.value.id).title;
              }
            });
          } else if (node.type == "interfaceV4") {
            node.properties.inputs &&
              node.properties.inputs.forEach((item) => {
                if (item.value.id) {
                  item.value.category = nodeMap.get(item.value.id).title;
                }
              });
            node.properties.outputs &&
              node.properties.outputs.forEach((item) => {
                if (item.value.id) {
                  item.value.category = nodeMap.get(item.value.id).title;
                }
              });
          }
        });
    },
    // 流程组件返回值处理，输出对象都会加载到 这个流程调用组件当中
    syncCallVarData(data, id) {
      let tag = {
        id: id,
        name: data.title,
        type: 4, // 默认为变量对象
        value: "",
        variables: [],
      };
      let outputs = data.outputs;
      outputs.forEach((output) => {
        tag.variables.push(output);
      });

      let existFlag = false;
      this.variateTagList.forEach((varTag) => {
        if (varTag.id && varTag.id === id) {
          varTag.name = data.title;
          existFlag = true;
        }
      });
      if (!existFlag) {
        this.variateTagList.push(tag);
      }
      this.handlerVarMap(this.variateTagList);
    },
    backHandle() {
      // this.$router.back()
      this.quitVarModal = true;
    },
    confirmQuit() {
      window.location.href = "http://111.231.101.78:9013/#/process/list";
      this.quitVarModal = false;
    },
    cancalQuit() {
      this.quitVarModal = false;
    },
    saveQuit() {
      this.saveData();
      this.quitVarModal = false;
      window.location.href = "http://111.231.101.78:9013/#/process/list";
    },
    handleResize(event) {
      const { atMin } = event;
      /* eslint-disable */
      console.log(atMin);
    },
    getNodeData(target, attr) {
      var node = target.attributes[attr];
      if (node) {
        return node.nodeValue;
      } else {
        return "";
      }
    },
    handleMoving(e) {
      console.log(e.atMin, e.atMax);
    },
    zoomOut: function (e) {
      console.log("zoom out");
      this.nextflow.zoomOut();
    },
    zoomIn: function (e) {
      console.log("zoom in");
      this.nextflow.zoomIn();
    },
    zoomReal: function (e) {
      this.nextflow.zoomZero();
    },
    copyData() {
      this.copyModel = true;
    },
    setting() {
      this.setModel = true;
    },
    testData: function () {
      this.saveData();
      var args = this.nextflow.getInputs();
      let existArgs = this.testParams.testArgs;
      if (existArgs) {
      }
      args.forEach((item) => {
        let existFlag = false;
        existArgs.forEach((existItem) => {
          if (item.name == existItem.name) {
            existFlag = true;
          }
        });
        if (!existFlag) {
          this.testParams.testArgs.push(item);
        }
      });

      // this.testParams.testArgs = args;
      this.testParams.interfaceUrl =
        process.env.VUE_APP_BASE_API +
        "/open/v1/data/api/" +
        this.processId +
        "/" +
        this.merchantId +
        "/" +
        this.projectId;
      this.testProperties = JSON.stringify({
        dataApiId: this.processId,
        debug: "true",
        params: {},
      });
      this.testModal = true;
    },
    testModalDialogOpen() {
      // this.testLoading=true;
      // this.testText="正在保存..."
      this.errorMessage = "";
      this.treeDataList = [];
    },
    TestPro: function () {
      var args = this.testParams.testArgs;
      let interfaceParam = {};
      if (args.length > 0) {
        args.forEach((arg) => {
          if (arg.value) {
            interfaceParam[arg.name] = arg.value;
          }
        });
        console.log("interfaceParam", interfaceParam);
      }

      this.testProperties = JSON.stringify({
        dataApiId: this.processId,
        debug: "true",
        params: interfaceParam,
      });
      this.getTestRequest();

      //              return false
    },
    getTestRequest() {
      var self = this;
      getTest(
        JSON.parse(this.testProperties),
        this.merchantId,
        this.projectId,
        encodeURIComponent(this.userName),
        this.thirdUserId
      )
        .then((res) => {
          self.testResultColumns = [];
          if (res.code == 0) {
            // this.testModal = false;
            this.errorMessage = "";
            this.$message.success("测试成功");
            var testResult = res.data;
            //这里改造 需要吧返回值 改造成树形结构
            this.handleInterfaceData(testResult);
            this.logList = res.logs;
          }
          //   let data = {};
          //   for (var col in testResult) {
          //     self.testResultColumns.push({ title: col, key: col });
          //   }
          //   let dataList = [];
          //   dataList.push(testResult);
          //   self.testResultData = dataList;
          //   self.testResult = true;
          //   // }
          // } else if (res.code == 1000) {
          //   this.testResult = true;
          //   this.testResultError = res.msg;
          // } else {
          //   this.$message.error(res.msg);
          // }
        })
        .catch((error) => {
          this.errorMessage = error;
        });
    },
    getConsoleRequest() {
      let start = this.dateTimeFormatter(this.consoleDateRange[0]);
      let end = this.dateTimeFormatter(this.consoleDateRange[1]);
      let params = {
        dataApiId: this.processId,
        limit: 10,
        start: start,
        end: end,
      };

      getConsole(params).then((res) => {
        if (res.code == 0) {
          this.consoleList = res.data.data;
        }
      });
    },
    handleInterfaceData(dataList) {
      this.treeDataList = [];
      for (var key in dataList) {
        let returnData = {
          title: key,
        };
        if (dataList[key] instanceof Array) {
          let arrayList = [];
          if (dataList[key].length > 100) {
            // 进入全自动列表优化
            for (var i = 0; i < dataList[key].length; i = i + 100) {
              var retractList = [];
              for (var j = i; j < i + 100; j++) {
                let varList = [];
                for (var varKey in dataList[key][j]) {
                  let varItem = {
                    title: varKey,
                    value: dataList[key][j][varKey],
                  };
                  varList.push(varItem);
                }
                if (varList && varList.length > 0) {
                  let varItem = {
                    title: j,
                    children: varList,
                  };
                  retractList.push(varItem);
                }
              }
              let arrayItem = {
                title: "[" + i + "..." + (j - 1) + "]",
                children: retractList,
              };
              arrayList.push(arrayItem);
            }
          } else {
            for (var i = 0; i < dataList[key].length; i++) {
              let varList = [];
              for (var varKey in dataList[key][i]) {
                let varItem = {
                  title: varKey,
                  value: dataList[key][i][varKey],
                };
                varList.push(varItem);
              }
              let arrayItem = {
                title: i,
                children: varList,
              };
              arrayList.push(arrayItem);
            }
          }

          returnData.children = arrayList;
          returnData.expand = true;
        } else {
          returnData.value = dataList[key];
        }

        this.treeDataList.push(returnData);
      }
    },
    changePage(pageNum) {
      console.log(pageNum);
      this.testResultPageIndex = pageNum;
      const msg = this.$Message.loading("正在加载...", 0);
      this.$Message.config({ duration: 1000 });
      this.getTestRequest(msg);
    },
    changeVerPage(pageNum) {
      console.log(pageNum);
      this.curVerIdx = pageNum;
      const msg = this.$Message.loading("正在加载...", 0);
      this.$Message.config({ duration: 1000 });
      this.getVersions(msg);
    },
    saveData: function () {
      var processName = this.processName;
      processName = processName.replace(/\s/g, "");
      if (processName == "" || processName == "新建流程") {
        this.$message.error("请输入新流程的名称", 2);
        return;
      }
      console.log(this.nextflow, "next");
      var configJson = this.nextflow.export();
      console.log("flow data:");
      // console.log(JSON.stringify(configJson));
      setStorage("__flow_data", JSON.stringify(configJson));
      // 从 vuex 取出最新的vartaglist
      let varMap = this.$store.getters.varMap;
      this.variateTagList = varMap.get(this.processId);
      configJson.nodes.forEach((node) => {
        if (node.type == "processcallV4") {
          if (this.subProcessId.indexOf(node.properties.processId) < 0) {
            this.subProcessId.push(node.properties.processId);
          }
        }
      });
      //2021-4-2 处理变量组件的变量需要放到v4里面
      let variableV1List = [];
      let variableV4List = [];
      this.variateTagList.forEach((tag) => {
        if (tag.id || tag.id == 0) {
          variableV4List.push(tag);
        } else {
          variableV1List.push(tag);
        }
      });
      let version = variableV4List.length > 0 ? 4 : 1;

      let scheme = {
        nodes: configJson.nodes,
        variables: variableV1List,
        variablesV4: variableV4List,
        devSwitch: this.devSwitch,
        subProcessId: this.subProcessId,
        version: version,
      };

      console.log("scheme=====>", JSON.stringify(scheme));
      let params = {
        processName: this.processName,
        processType: "process",
        scheme: JSON.stringify(scheme),
        createdBy: this.userName,
        merchantId: this.merchantId,
        projectId: this.projectId,
        remark: this.remark,
        fileList: this.uploadList,
      };
      if (this.processId) {
        params.id = this.processId;
      }
      createNewProcess(params).then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.$message.success("保存成功", 2);
          this.processId = parseInt(res.data.businessId);
          this.id = this.processId;
          this.initData();
          let that = this;
          setTimeout(() => {
            that.testLoading = false;
            that.testText = "提交测试";
          }, 500);
        }
      });
    },
    doCopy() {
      let _this = this;
      getScript(this.processId).then((res) => {
        if (res.data.code == 0) {
          this.scriptText = res.data.data;
          this.$copyText(this.scriptText).then(
            function (e) {
              _this.$Message.success("复制到剪贴板", 2);
            },
            function (e) {
              _this.$Message.error("复制失败", 2);
              console.log(e);
            }
          );
        } else {
          _this.$Message.error("获取脚本失败", 2);
        }
      });
    },
    initData() {
      let id = this.id;
      // let { id, copyId, title } = this.$route.params;
      this.projectId = this.$store.getters.projectId;
      this.merchantId = this.$store.getters.merchantId;

      // this.userName = this.$route.query.userName;
      // this.thirdUserId = this.$route.query.thirdUserId;
      // 放vuex 里

      let processName;
      if (!id && copyId) {
        id = copyId;
        processName = title;
      }

      if (typeof id == "undefined") {
        this.nextflow.destroyChildren();
        this.nextflow.import({
          nodes: [
            {
              version: 1,
              id: 0,
              x: 128,
              y: 81,
              title: "开始",
              type: "startV4",
              outputs: [{ id: 7, x: 240.5, y: 97, title: null }],
              properties: {},
            },
          ],
        });
        // 2020-06-16 为了防止新建流程无法使用绑定的pid 的变量问题，临时处理成，init 的时候进行创建操作，然后调用保存变量接口
        this.processName = "test";
        setTimeout(() => {
          console.log("delay 2000");
          this.initVariable();
          this.saveData();
        }, 500);
        return;
      }
      getNewProcessDetail(id, this.projectId)
        .then((res) => {
          this.dealProcessDetail(res.data);
        })
        .catch((err) => {
          // reject(err);
        });
      // getProcess(id)
      //   .then(res => {
      //     this.processId = copyId ? "" : res.data.data.id;
      //     this.processName = processName || res.data.data.name;
      //     this.nextflow.destroyChildren();
      //     this.nextflow.import(JSON.parse(res.data.data.process_schema));
      //     this.testProperties = res.data.data.process_schema;
      //   })
      //   .catch(err => {
      //     // reject(err);
      //   });
    },
    dealProcessDetail(processDetail) {
      setStorage("subType", "process");
      setStorage("reportId", processDetail.id);
      this.processId = processDetail.id;
      this.processName = processDetail.processName;
      this.nextflow.destroyChildren();
      let scheme = JSON.parse(processDetail.scheme);
      this.remark = processDetail.remark;
      this.uploadList = processDetail.fileList;

      let varV1List = scheme.variables;
      let varV4List = scheme.variablesV4;
      if (varV4List) {
        this.variateTagList = varV1List.concat(varV4List);
      } else {
        this.variateTagList = varV1List;
      }
      this.handlerVarMap(this.variateTagList);
      // 2021-05-21 暂时注释代码 不知道是为啥这么处理
      delete scheme.variables;
      this.nextflow.import(scheme);
      // if (scheme.devSwitch!== undefined) {
      //   this.devSwitch = scheme.devSwitch;
      // } else {
      //   this.devSwitch = true;
      // }
      // this.initVariableV4Data(scheme);
    },
    deleteConfirm() {
      var _this = this;
      this.$confirm("请确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let processId = this.processId;
          delProcessV4({ processId: processId }).then((res) => {
            console.log(res);
            let tabName = "tree" + this.treeId;
            this.$emit("removeTab", tabName);
          });
        })
        .catch(() => {});
    },
    loadData: function () {
      var data = JSON.parse(getStorage("__flow_data"));
      this.nextflow.destroyChildren();
      this.nextflow.import(data);
    },
    onSelect: function (diagram) {
      console.log("click nextflow shape", diagram);

      this.$nextTick((item) => {
        this.curDiagram = diagram;
        this.selectedDiagram = diagram;
        this.showWindowType = diagram.type; // 获取节点类型
        this.showWindowSubType = diagram.subType;
        this.showWindowBDrawer = true; // 显示可拖动抽屉
      });
    },
    cancelDrawer: function () {
      let id = this.curDiagram.id;
      this.$refs[id].saveConfig();
      console.log("cancelDrawer");
      this.curDiagram = "";
      this.selectedDiagram = "";
      this.showWindowType = "";
      this.showWindowSubType = "";
      this.showWindowBDrawer = false;
    },
    cancelDebug() {
      this.showDebugDrawer = false;
      // 清除所有绿点
      this.nextflow.deleteGreenCircle();
    },
    updatestart(e) {
      this.$refs.startDrag.syncReturnData(e);
    },
    configDiagram: function () {
      this.onSelect(this.selectedDiagram);
    },
    copyDiagram() {
      let cList = [];
      if (
        this.nextflow.chosenDiagramList &&
        this.nextflow.chosenDiagramList.length > 0
      ) {
        cList = this.nextflow.chosenDiagramList;
      } else {
        cList = [this.selectedDiagram];
      }

      this.nextflow.copyNewDiagram(cList);
      // var _this = this;
      // setTimeout(function () {
      //   _this.addVariableV4Data();
      // }, 50);
    },
    pasteDiagram() {
      var stageMenuNode = document.getElementById("stageMenu");
      this.nextflow.importPasteData(
        getStorage("clipboard_process_data"),
        stageMenuNode.style.x,
        stageMenuNode.style.y
      );
      var _this = this;
      setTimeout(function () {
        _this.addVariableV4Data();
      }, 50);
    },
    deleteDiagram: function () {
      var r = confirm("是否删除该组件?");
      if (r == true) {
        if (this.selectedDiagram !== undefined) {
          //删除组件的时候，需要将对应的变量一起删除
          console.log(this.selectedDiagram);
          let id = this.selectedDiagram.id;
          this.variateTagList.forEach((varTag, i) => {
            if (varTag.id && varTag.id === id) {
              this.variateTagList.splice(i, 1);
            }
          });
          this.handlerVarMap(this.variateTagList);

          this.nextflow.deleteDiagram(this.selectedDiagram);
        }
      }
    },
    close() {
      /**
       * 如果是调用closeTag方法，普通的页面传入的对象参数只需要写name字段即可
       * 如果是动态路由和带参路由，需要传入query或params字段，用来区别关闭的是参数为多少的页面
       */
      this.closeTag({
        name: "show_process",
        params: {
          id: this.$route.params.id,
        },
      });
    },
    copyConfirm() {
      //        this.copyModel = true
      if (this.copyName) {
        //          this.processName =  this.copyName;
        const { name, params, query, meta } = this.$route;
        //          this.addTag({
        //            route: { name, params:{
        //                ...params,
        //               title: this.copyName
        //          }, query, meta }
        //          })
        //          const route = {
        //            path:'new_process',
        //            params: {
        //              title: this.copyName
        //            }
        //          }
        this.$router.push({
          name: "show_process",
          params: {
            ...params,
            id: 0,
            copyId: params.id,
            title: this.copyName,
          },
          query,
          meta,
        });
        //          name: 'show_process', params: { id: item.id, title: item.name
      } else {
        this.$Message.error("请填写复制的名称", 10);
      }
    },
    setConfirm() {
      var self = this;
      const { processId, settingModel } = self;
      this.$refs["settingForm"].validate((valid) => {
        if (valid) {
          updateCron({
            id: processId,
            cron: settingModel.setName,
            cron_desc: settingModel.setDesc,
          }).then((res) => {
            console.log(res);
          });
        } else {
        }
      });
    },
    settingHelp() {
      window.open("http://www.bejson.com/othertools/cron/");
    },
    getVersions(msg) {
      var that = this;
      const { curVerIdx, verSize } = that;
      getVersions({
        id: that.processId,
        page_index: curVerIdx,
        page_size: verSize,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 0 && res.data.length > 0) {
          msg && msg();
          that.data1 = res.data.data;
          that.totalPage = res.data.total_page || 0;
          that.verCount = res.data.total_count || 0;
        }
      });
    },
    verManage() {
      this.value3 = true;
      this.getVersions();
    },
    selectVer(item, index) {
      this.formData = {
        ...this.formData,
        id: item.id,
        by: item.updatedBy,
        date: item.updatedAt,
      };
    },
    openVarModel() {
      // this.setVariateModal = true;
      this.showVarEditModel = true;
      console.log(this.showVarEditModel, "showVarEditModel");
      // this.initVariable();
    },
    confirmNewVarTag() {
      // 判断变量名是否重复
      let exist = false;
      this.variateTagList.forEach((item) => {
        if (item.name == this.newVarTagName) {
          this.$Message.error("名称不能重复", 3);
          exist = true;
        }
      });
      if (!exist) {
        this.variateTagList.push({
          name: this.newVarTagName,
          editable: true,
          checked: false,
          variables: [],
        });
        this.addVarModal = false;
        // 默认选中
        this.tagCheck(true, this.newVarTagName);
      }
    },
    handleAdd() {
      this.addVarModal = true;
    },
    handleClose(event, name) {
      this.deleteVarModal = true;
      this.deleteTagName = name;
    },
    confirmdeleteVarTag() {
      for (let i = 0; i < this.variateTagList.length; i++) {
        let v = this.variateTagList[i];
        if (v.name == this.deleteTagName) {
          if (v.id) {
            // 删除分2种，有id 的调接口，没ID的直接删
            // deleteVariable(this.processId, v.id).then((res) => {
            //   if (res.data.code == 0) {
            //     this.$Message.success("删除成功", 10);
            //   } else {
            //     this.$Message.error(res.data.message, 10);
            //     return;
            //   }
            // });
          }
          v.checked = true;
          this.variateTagList.splice(i, 1);
        }
      }
      this.deleteVarModal = false;
    },
    confirmRemark() {
      // 保存流程备注 TODO
      console.log(this.remark, "confirmRemark");
    },
    tagCheck(checked, name) {
      // 切换
      for (let i = 0; i < this.variateTagList.length; i++) {
        let v = this.variateTagList[i];
        if (v.name == name) {
          v.checked = true;
          this.tagChooseIdx = i;
          if (this.variateTagList[this.tagChooseIdx].variables.length > 0) {
            this.selectVar(0);
          }
        } else {
          v.checked = false;
        }
      }
    },
    selectVar(index) {
      // 选中
      this.variateIndex = index;
      this.variateInfo =
        this.variateTagList[this.tagChooseIdx].variables[index];
      // 特殊处理日期
      if (this.variateInfo.type == 2) {
        if (this.variateInfo.value_type == "CurrentDate") {
          this.variateInfo.currentDate = true;
        } else if (this.variateInfo.value_type == "CurrentTime") {
          this.variateInfo.currentTime = true;
        } else if (this.variateInfo.value_type == "CurrentDateTime") {
          this.variateInfo.currentDate = true;
          this.variateInfo.currentTime = true;
        }
        if (this.variateInfo.value) {
          if (this.variateInfo.value.indexOf(" ") > 0) {
            let dateTime = this.variateInfo.value.split(" ");
            this.variateInfo.date = dateTime[0];
            this.variateInfo.time = dateTime[1];
          } else if (this.variateInfo.value.indexOf("-") > 0) {
            this.variateInfo.date = this.variateInfo.value;
          } else if (this.variateInfo.value.indexOf(":") > 0) {
            this.variateInfo.time = this.variateInfo.value;
          }
        }
      }
    },
    addNewParam() {
      if (
        this.variateTagList[this.tagChooseIdx].name == "系统参数" ||
        this.variateTagList[this.tagChooseIdx].name == "常用变量"
      ) {
        return;
      }
      let param = {
        name: "测试参数",
      };
      this.variateTagList[this.tagChooseIdx].variables.push(param);
      this.selectVar(
        this.variateTagList[this.tagChooseIdx].variables.length - 1
      );
    },
    delParam() {
      if (
        this.variateTagList[this.tagChooseIdx].name == "系统参数" ||
        this.variateTagList[this.tagChooseIdx].name == "常用变量"
      ) {
        return;
      }
      //删除参数
      this.variateTagList[this.tagChooseIdx].variables.splice(
        this.variateIndex,
        1
      );
    },
    up() {
      if (
        this.variateTagList[this.tagChooseIdx].name == "系统参数" ||
        this.variateTagList[this.tagChooseIdx].name == "常用变量"
      ) {
        return;
      }
      var list = this.variateTagList[this.tagChooseIdx].variables;
      var idx = this.variateIndex;
      if (idx > 0) {
        var item = list.splice(idx, 1);
        list.splice(idx - 1, 0, item[0]);
        this.variateTagList[this.tagChooseIdx].variables = list;
        this.variateIndex = idx - 1;
      }
    },
    down() {
      if (
        this.variateTagList[this.tagChooseIdx].name == "系统参数" ||
        this.variateTagList[this.tagChooseIdx].name == "常用变量"
      ) {
        return;
      }
      var list = this.variateTagList[this.tagChooseIdx].variables;
      var idx = this.variateIndex;
      if (idx > -1) {
        if (idx < list.length - 1) {
          var item = list.splice(idx, 1);
          list.splice(idx + 1, 0, item[0]);
          this.variateTagList[this.tagChooseIdx].variables = list;
          this.variateIndex = idx + 1;
        }
      }
    },
    saveVariate() {
      // 2020-08-24 方法以及弃用
      // let successFlag = true;
      // // 循环保存 或者修改
      // for (let i = 0; i < this.variateTagList.length; i++) {
      //   let variable = this.variateTagList[i];
      //   variable.variables.forEach((varInfo) => {
      //     if (varInfo.type == 2) {
      //       console.log(varInfo, "varInfo");
      //       if (varInfo.currentDate && varInfo.currentTime) {
      //         varInfo.value_type = "CurrentDateTime";
      //       } else if (varInfo.currentDate) {
      //         varInfo.value_type = "CurrentDate";
      //       } else if (varInfo.currentTime) {
      //         varInfo.value_type = "CurrentTime";
      //       }
      //       if (varInfo.date && varInfo.time) {
      //         varInfo.value = varInfo.date + " " + varInfo.time;
      //       } else if (varInfo.date) {
      //         varInfo.value = varInfo.date;
      //       } else if (varInfo.time) {
      //         varInfo.value = varInfo.time;
      //       }
      //     }
      //   });

      // if (variable.id) {
      //   updateVariable(
      //     this.processId,
      //     variable.id,
      //     variable.name,
      //     JSON.stringify(variable.variables)
      //   )
      //     .then(res => {
      //       if (res.data.code !== 0) {
      //         this.$Message.error(res.data.message, 10);
      //         successFlag = false;
      //       }
      //     })
      //     .catch(err => {
      //       this.$Message.error(err.response.data.message, 10);
      //       successFlag = false;
      //       reject(err);
      //     });
      // } else {
      //   createVariable(
      //     this.processId,
      //     variable.name,
      //     JSON.stringify(variable.variables)
      //   )
      //     .then(res => {
      //       if (res.data.code !== 0) {
      //         this.$Message.error(res.data.message, 10);
      //         successFlag = false;
      //       }
      //     })
      //     .catch(err => {
      //       this.$Message.error(err.response.data.message, 10);
      //       successFlag = false;
      //       reject(err);
      //     });
      // }
      // }
      this.saveData();
      if (successFlag) {
        this.$Message.success("保存成功", 2);
        this.setVariateModal = false;
      }
    },
    initVariable() {
      this.variateTagList.push(this.commonVar[0]);
      this.variateTagList.push(this.commonVar[1]);
      this.variateTagList.push(this.commonVar[2]);
      this.variateTagList.push(this.commonVar[3]);
      this.handlerVarMap(this.variateTagList);
    },
    setOptionDate(value, type) {
      this.variateTagList[this.tagChooseIdx].variables[this.variateIndex].date =
        value;
      this.variateInfo.currentDate = false;
    },
    setOptionTime(value, type) {
      this.variateTagList[this.tagChooseIdx].variables[this.variateIndex].time =
        value;
      this.variateInfo.currentTime = false;
    },
    setCheckBoxDate(type) {
      if (type == "currentDate" && this.variateInfo.currentDate) {
        this.variateInfo.date = "";
      } else if (type == "currentDate" && !this.variateInfo.currentDate) {
        this.variateInfo.value_type = "";
      } else if (type == "currentTime" && !this.variateInfo.currentTime) {
        this.variateInfo.value_type = "";
      } else if (type == "currentTime" && this.variateInfo.currentTime) {
        this.variateInfo.time = "";
      }
    },
    cancalVarEdit(newVal) {
      this.showVarEditModel = newVal;
    },
    saveVarEdit(tempVarList) {
      console.log(tempVarList, "process saveVarEdit");
      this.variateTagList = tempVarList;
      this.saveData();
    },
    debugData() {
      this.showDebugDrawer = true;
      this.$refs.drawerDebug.init();
    },
    showStep(stepid, callback) {
      let stepDiagrams = this.nextflow.getDiagramsById(stepid);
      callback(stepDiagrams);
    },
    showRemark() {
      console.log("showRemark");
      this.remarkModal = true;
    },
    uploadAction() {
      return baseUrl + `/file/v1/upload?type=remark`;
    },
    uploadSuccess(response, file, fileList) {
      console.log(response, file, fileList, "uploadSuccess");
      if (response.code == 0) {
        this.uploadList.push(response.data);
      }
    },
    handleView(item) {
      this.imageUrl = item.url;
      this.imageVisible = true;
    },
    handleFileRemove(file) {
      const fileList = this.uploadList;
      this.uploadList.splice(fileList.indexOf(file), 1);
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png.",
      });
    },
    changeDevSwitch(status) {
      this.devSwitch = status;
      var configJson = this.nextflow.export();
      configJson.devSwitch = status;
      this.nextflow.destroyChildren();
      this.nextflow.import(configJson);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      console.log("handleSuccess", response, file, fileList);
      if (response.code == 0) {
        this.uploadList.push(response.data);
      }
    },
    handleChange() {},
    change() {
      this.$forceUpdate(); // 偶尔输入不了
    },
    renameProcess() {
      var params = {
        processName: this.processName,
        processId: this.id,
      };
      renameProcessService(params).then((res) => {
        if (res.code === 0) {
          this.$emit("renameFile", res.data.treeId, this.processName);
        }
      });
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
          },
        },
        [
          h("span", [h("span", data.title)]),
          h(
            "span",
            {
              style: {
                wordBreak: "normal",
                width: "auto",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                display: "inline-block",
                float: "right",
                marginRight: "32px",
              },
            },
            data.value
          ),
        ]
      );
    },
    checkAddZone(num) {
      return num < 10 ? "0" + num.toString() : num;
    },
    dateTimeFormatter(t) {
      if (!t) return "";
      t = new Date(t).getTime();
      t = new Date(t);
      var year = t.getFullYear();
      var month = t.getMonth() + 1;
      month = this.checkAddZone(month);

      var date = t.getDate();
      date = this.checkAddZone(date);

      var hour = t.getHours();
      hour = this.checkAddZone(hour);

      var min = t.getMinutes();
      min = this.checkAddZone(min);

      var se = t.getSeconds();
      se = this.checkAddZone(se);

      return (
        year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + se
      );
    },
    onDragMoveEnd() {},
    onDragMoveStart(e) {
      console.log("onDragMoveStart", e);
      var _this = this;
      var imgs = e.item.getElementsByClassName("drag-shape-icon");
      if (imgs !== undefined && imgs.length > 0) {
        _this.draggingNode = _this.getNodeData(imgs[0], "data-shape-type");
        _this.draggingNodeName = _this.getNodeData(imgs[0], "data-shape-name");
      }
    },
  },
};
</script>
<style lang="scss">
.process-wrap {
  padding: 0 16px;
  .header_left {
    -webkit-box-flex: 0;
    -ms-flex: 0;
    flex: 0;
  }
  .header_right {
    width: 100%;
    text-align: center;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-drawer__header {
    margin-bottom: 0px;
  }
  .el-input {
    width: 220px;
  }
  .el-input--suffix {
    width: 220px;
  }
  .el-select {
    width: 220px;
  }
}

.form-input {
  display: flex;
  justify-content: space-between;
}
.var-select {
  width: 100%;
}
.routeByList li {
  /*width:100%;*/
  padding: 0 10px;
  cursor: pointer;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
.row-btns {
  margin-top: 5px;
}
.btns-delete {
  float: right;
}
.btns-save {
  float: left;
}
.group-text {
  margin-bottom: 10px;
  font-size: 14px;
}
.mr5 {
  margin-right: 5px;
}
.route-title2 {
  padding: 5px 0 5px 0;
  border-bottom: 1px solid #e1e1e1;
  margin-bottom: 10px;
  font-size: 14px;
}
.opt-btn {
  margin-top: 10px;
  display: flex;
  width: 100%;
  justify-content: space-around;
}
.opt-btn > div {
  color: #0862ea;
  cursor: pointer;
}
.opt-add-btn {
  margin-top: 10px;
  color: #0862ea;
  cursor: pointer;
}
</style>

<style scoped lang="less">
/*.main .main-content-con {*/
/*  height: auto;*/
/*  overflow: hidden;*/
/*}*/
/deep/ .el-upload--picture-card {
  width: 75px;
  height: 75px;
  line-height: 75px;
}
/deep/ .el-upload-list__item {
  width: 75px;
  height: 75px;
  line-height: 75px;
}
.main .content-wrapper {
  overflow: hidden;
}
.header-icon {
  width: 20px;
  float: left;
  margin-top: 15px;
  font-size: 20px;
  margin-right: 10px;
}
.process-wrap {
  position: relative;
  height: 100%;
  /*border:1px solid #dadada;*/
}
.process-wrap .ivu-split-horizontal {
  height: 100%;
}
.process-wrap .ivu-split-pane.left-pane {
  overflow: auto;
}
.process-wrap .pane.left-pane {
  height: 100%;
  overflow-y: auto;
}
.left-pane::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
.right-pane::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
.process-wrap .ivu-divider-horizontal {
  margin: 8px 0;
}
.l-btns {
  padding-left: 8px;
}
.l-btns button {
  margin-right: 15px;
}
.r-btns .btns-w {
  justify-content: flex-end;
}
.r-btns button {
  margin-left: 15px;
}
.btns-w {
  display: flex;
  align-items: center;
}

.drag-drawer-inner-box {
  position: relative;
  width: 500px;
  height: 400px;
  background: pink;
  border: 1px solid pink;
}

.shapes {
  align-items: center;
  /*display: flex;
    flex-direction: column;
    display: -webkit-flex;
    -webkit-flex-direction: column;  */
  -webkit-touch-callout: none;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  .dragdrop-cursor {
    cursor: move !important;
  }

  .drag-shape {
    overflow: hidden;
    padding: 0px;

    // height: 50px;
    // line-height:50px;
    // text-align: center;
    .drag-shape-img {
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    span {
      text-align: center;
    }
  }
  li {
    width: 25%;
    display: inline-block;
    padding: 5px;
    &:hover {
      color: #409eff;
      border: 1px dashed #409eff;
      margin: -1px;
      cursor: pointer;
    }
  }
  /deep/.el-collapse-item__content {
    padding-top: 1px;
    padding-left: 1px;
  }
}

.shapes .drag-shape {
  border: 1px solid #ddd;
}

.center-middle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.ivu-layout-content {
  background-color: white;
}

.split-pane-page-wrapper {
  display: flex;
  height: calc(100vh - 94px);
  border-top: 1px solid #e0e0e0;
  // height:100%
  .pane {
    width: 100%;
    height: 100%;

    &.left-pane {
      background: white;
      width: 260px;
      flex-shrink: 0;
      /*padding-top: 20px;*/
    }

    &.right-pane {
      background: white;
      padding: 10px;
      margin-left: 16px;
      box-shadow: 0 0 2px 1px #ccc;
      border-radius: 5px;
    }

    &.top-pane {
      background: sandybrown;
    }

    &.bottom-pane {
      background: palevioletred;
    }
  }

  .custom-trigger {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000000;
    position: absolute;
    .center-middle;
    box-shadow: 0 0 6px 0 rgba(28, 36, 56, 0.4);

    i.trigger-icon {
      .center-middle;
    }
  }
}

.flow-start {
  background: url("/icon/start.jpg") 0 0;
}

.drag-drawer-body-wrapper {
  padding: 0 !important;
}
.group-btns .ivu-btn-small {
  padding: 1px 15px 2px;
  margin: 5px 0;
}

.ivu-split-trigger {
  border: 1px solid #efefef;
  width: 4px;
}
.ivu-split-trigger-vertical .ivu-split-trigger-bar {
  width: 2px;
}

#menu,
#stageMenu {
  display: none;
  position: absolute;
  width: 60px;
  background-color: white;
  box-shadow: 0 0 5px grey;
  border-radius: 3px;
  span {
    display: inline-block;
  }
  button {
    width: 100%;
    background-color: white;
    border: none;
    margin: 0;
    padding: 10px;
    color: #333333;
  }
  button:hover {
    color: white;
    background-color: #558be3;
  }
}

.process-id {
  margin-left: 15px;
  padding-left: 15px;
}
.op-row {
  padding: 10px 10px 10px 5px;
  border-bottom: 1px solid #dadada;
}

.test-result-modal .ivu-modal {
  width: 100%;
}
.right-wrap {
  position: relative;
}

.right-wrap .r-menu {
  position: fixed;
  right: 40px;
  bottom: 45px;
  width: 38px;
  height: 116px;
  /*background-color:rgba(0,0,0,0.5);*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.r-menu > div {
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3px;
  background-color: white;
  border-radius: 5px;
}
.r-menu > div > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.r-menu > div > div:hover,
.r-menu > div:first-child:hover {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.r-menu > div:first-child {
  margin-bottom: 10px;
}
.r-menu > div img {
  width: 30px;
  height: 30px;
}
.r-menu > img {
  width: 30px;
  height: 30px;
}
.r-menu > i {
  cursor: pointer;
  font-size: 30px;
}
.set-model .ivu-icon-ios-search:before {
  content: "\F1F6";
}
.set-model .ivu-input-search i {
  font-size: 28px;
}
.page-wrap {
  margin-top: 10px;
}
ul li {
  list-style-type: none;
}
.routeByList {
  width: 100%;
  line-height: 28px;
  max-height: 300px;
  overflow-y: auto;
}
.routeByList li {
  /*width:100%;*/
  padding: 0 10px;
}
.routeByChecked {
  background-color: #5a6268;
  color: white;
}
.var-box-list {
  position: relative;
  border: 1px solid #d6d6d6;
  /*padding:0 10px 10px 10px;*/
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden;
  /*padding-top:28px;*/
}
.mr5 {
  cursor: pointer;
}
.variate-tag {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  padding: 0 10px;
  -webkit-user-select: none;

  -moz-user-select: none;

  -ms-user-select: none;

  user-select: none;
}
.drag-head {
  display: flex;
  align-items: center;
  font-size: 16px;
  width: 100%;
  font-weight: bold;
  img {
    margin-right: 8px;
  }
}
.head-icon {
  width: 18px;
  height: 18px;
}
.ivu-tag-primary {
  background: #fff;
}
.ivu-tag:not(.ivu-tag-border):not(.ivu-tag-dot):not(.ivu-tag-checked) {
  background: #2d8cf0;
  color: #fff !important;
  //重写tag 选中样式
  /deep/ .ivu-tag-text {
    color: #fff !important;
  }
  /deep/ .ivu-icon-ios-close {
    color: #fff !important;
  }
}
/deep/.header_title {
  background-color: transparent;
}
.upload-div {
  position: relative;
  margin-top: 70px;
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.group-wrap {
  height: calc(100vh - 100px);
}
.drag-shape-icon {
  width: 16px;
  height: 36px;
  margin: auto;
}
.icon-text {
  text-align: center;
  font-size: 13px;
  padding-top: 8px;
  padding-bottom: 8px;
}
.aside-collapse-title {
  padding-left: 20px;
  font-size: 14px;
  font-weight: bold;
}

/deep/.save_btn [class*="iconfont"] + span {
  margin-left: 5px;
}
.delete-btn {
  position: absolute;
  right: 20px;
  color: rgba(10, 18, 32, 0.64);
}
.log-title {
  width: 100%;
  background: #eee;
  padding: 5px 10px;
}
.console-info {
  background: #e4e7ed;
}

.menu-item-wrap {
  padding: 0 10px;

  li {
    display: inline-flex;
    //display: flex;
    flex-direction: row;
    width: 46%;
    margin: 0 8px 8px 0;
    //text-align: center;
    color: #666;
    cursor: pointer;
    border: 1px solid #e5e6e8;
    border-radius: 6px;
    padding: 0 8px;
    height: 36px;
    align-items: center;
    &:hover {
      color: #409eff;
      border: 1px dashed #409eff;
      margin: 0 8px 8px 0;
    }

    .iconfont {
      //font-size: 45px;
      font-size: 12px;
      line-height: 36px;
    }

    .icon-text {
      font-size: 12px;
      line-height: 36px;
      margin-left: 8px;
      white-space: nowrap;
      //margin-top: -12px;
    }
  }
}
</style>
