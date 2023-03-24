/* eslint-disable */
<template>
  <div class="process-wrap">
    <!--<Row>-->
    <custom-header>
      <span slot="title">
        <!-- <Icon
          type="ios-arrow-back"
          class="header-icon"
          style="cursor: pointer; font-weight: 700"
          @click="backHandle"
        /> -->
        <!-- <img src="@/assets/icon/process.png" class="header-icon" /> -->
        <i class="iconfont iconliuchengshuoming"></i>
        <!-- <span style="font-size: 18px; padding:10px 10px 0 0;">流程</span> -->
        <el-input
          size="small"
          v-model="processName"
          placeholder="请输入流程名称"
          class="header_title"
          style="background-color: transparent"
        />
        <!-- <span class="process-id" v-if="processId>0">ID: {{processId}}</span> -->
      </span>
      <div slot="opertBtn">
        <span class="el-button-opert-text">
          开发模式：<el-switch v-model="devSwitch" @on-change="changeDevSwitch">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </el-switch>
          <!-- <Button shape="circle" ghost class="switch_btn" @click="switchPage">切换</Button> -->
          <el-button type="text" class="save_btn" @click="saveData"
            >保存</el-button
          >
          <el-button type="text" class="save_btn" @click="openVarModel"
            >变量</el-button
          >
          <!-- <Button shape="circle" ghost class="save_btn" @click="setting">设置</Button> -->
          <!-- <Button shape="circle" ghost class="save_btn" @click="doCopy">复制脚本</Button> -->
          <el-button
            type="text"
            class="save_btn"
            v-if="processId > 0"
            @click="testData"
            >测试</el-button
          >

          <el-button type="text" class="save_btn" @click="debugData"
            >调试</el-button
          >
          <!-- <Button shape="circle" ghost class="save_btn" v-if="processId>0" @click="copyData">复制</Button> -->
          <el-button type="text" class="save_btn" @click="verManage"
            >版本</el-button
          >
          <!-- <Button
            shape="circle"
            ghost
            class="save_btn"
            v-if="processId !== 0"
            v-on:click="deleteConfirm"
            type="error"
          >删除</Button>-->
        </span>
      </div>
    </custom-header>
    <div class="split-pane-page-wrapper">
      <split-pane
        v-model="offset"
        style="height: calc(100% - 60px)"
        @on-moving="handleMoving"
      >
        <div slot="left" class="pane left-pane">
          <div id="drag-items" class="shapes">
            <div
              v-for="shape in shapes"
              v-bind:key="shape.type"
              class="dragdrop-cursor"
            >
              <div
                class="drag-shape"
                :data-shape-type="shape.type"
                draggable="true"
              >
                <div class="drag-shape-img">
                  <img
                    class="drag-shape-icon"
                    :data-shape-type="shape.type"
                    :src="shape.url"
                  />
                  {{ shape.type }}
                </div>
                <div class="drag-shape-label">{{ shape.name }}</div>
              </div>
            </div>
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
          <div class="r-menu">
            <i class="iconfont iconxuqiu" @click="showRemark" />
            <i
              class="iconfont icon42-jujiao"
              @click="zoomReal"
              style="font-size: 40px"
            />
            <i class="iconfont iconfangda" @click="zoomOut" />
            <i class="iconfont iconsuoxiao" @click="zoomIn" />
          </div>
        </div>
      </split-pane>
    </div>

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
      <div slot="title" v-show="showWindowType === 'start'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18" class="head-icon"></Icon> -->
        <img src="@/assets/icon/start.svg" class="head-icon" />
        <b>开始</b>
      </div>
      <drag-drawer-start
        ref="startDrag"
        key="start"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'start'"
      ></drag-drawer-start>

      <div slot="title" v-show="showWindowType === 'setproperties'">
        <Icon type="md-aperture" :size="18"></Icon>
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
        v-show="showWindowType === 'connector'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/connector.svg" class="head-icon" />
        <b>数据</b>
      </div>
      <drag-drawer-connector
        key="connectorKey"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        @submitVarList="saveVarEdit"
        v-if="showWindowType === 'connector'"
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

      <div slot="title" v-show="showWindowType === 'branch'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/branch.svg" class="head-icon" />
        <b>树枝形状</b>
      </div>
      <drag-drawer-branch
        key="branchKey"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'branch'"
      ></drag-drawer-branch>

      <div slot="title" v-show="showWindowType === 'stop'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/stop.svg" class="head-icon" />
        <b>结束</b>
      </div>
      <drag-drawer-stop
        key="stop"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'stop'"
      ></drag-drawer-stop>

      <div slot="title" v-show="showWindowType === 'route'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/route.svg" class="head-icon" />
        <b>路由</b>
      </div>
      <drag-drawer-route
        key="route"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'route'"
      ></drag-drawer-route>

      <div slot="title" v-show="showWindowType === 'if'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/if.svg" class="head-icon" />
        <b>条件</b>
      </div>
      <drag-drawer-if
        key="if"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        @submitVarList="saveVarEdit"
        :processId="processId"
        v-if="showWindowType === 'if'"
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
        v-show="showWindowType === 'dataprocess'"
        class="drag-head"
      >
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/dataprocess.svg" class="head-icon" />
        <b>函数</b>
      </div>
      <drag-drawer-dataprocess
        key="dataprocess"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="nextflow"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'dataprocess'"
      ></drag-drawer-dataprocess>

      <div slot="title" v-show="showWindowType === 'return'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/return.svg" class="head-icon" />
        <b>输出</b>
      </div>
      <drag-drawer-return
        key="return"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        @updatestart="updatestart"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'return'"
      ></drag-drawer-return>

      <div slot="title" v-show="showWindowType === 'loop'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/loop.svg" class="head-icon" />
        <b>循环</b>
      </div>
      <drag-drawer-loop
        key="loop"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        @submitVarList="saveVarEdit"
        :processId="processId"
        v-if="showWindowType === 'loop'"
      ></drag-drawer-loop>

      <div slot="title" v-show="showWindowType === 'processcall'">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/processcall.svg" class="head-icon" />
        <b>流程</b>
      </div>
      <drag-drawer-call
        key="call"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'processcall'"
      ></drag-drawer-call>

      <div slot="title" v-show="showWindowType === 'message'" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/message.svg" class="head-icon" />
        <b>消息</b>
      </div>
      <drag-drawer-message
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
        <Icon type="md-aperture" :size="18"></Icon>
        <b>通知组件</b>
      </div>
      <drag-drawer-notify
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
        <Icon type="md-aperture" :size="18"></Icon>
        <b>异常组件</b>
      </div>
      <drag-drawer-exception
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
        key="interface"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'interface'"
      ></drag-drawer-interface>
    </drag-drawer>

    <el-dialog :visible.sync="confirmModal" width="360">
      <p slot="header" style="color: #f60; text-align: center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align: center">
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <el-button
          type="error"
          size="large"
          long
          :loading="confirm_modal_loading"
          @click="deleteItem"
          >删除</el-button
        >
      </div>
    </el-dialog>
    <el-dialog :visible.sync="testModal" title="流程测试" width="700">
      <el-form
        :model="testParams"
        ref="testForm"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          :prop="'testArgs.' + index + '.value'"
          :label="item.title"
          v-for="(item, index) in testParams.testArgs"
          :rules="{
            required: true,
            message: item.title + '不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model="item.value"></el-input>
        </el-form-item>
        <el-input
          v-model="testProperties"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 10 }"
        ></el-input>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="medium"
          long
          @click="TestPro('testForm')"
          >提交测试</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="testResult"
      title="流程测试结果"
      width="100%"
      class-name="test-result-modal"
    >
      <el-table
        :content="self"
        :data="testResultData"
        v-if="testResultData.length > 0"
      >
        <el-table-column
          v-for="testResultItem in testResultColumns"
          :label="testResultItem.key"
          :prop="testResultItem.title"
          align="center"
        >
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
      v-model="setVariateModal"
      title="变量"
      width="700"
      :mask-closable="false"
    >
      <el-tag
        v-for="item in variateTagList"
        checkable
        :checked="!item.checked"
        :name="item.name"
        @on-change="tagCheck"
        :closable="item.editable"
        @on-close="handleClose"
        class="variate-tag"
        >{{ item.name }}</el-tag
      >
      <el-button icon="ios-add" type="dashed" size="large" @click="handleAdd"
        >新建变量</el-button
      >
      <el-row style="margin-top: 10px">
        <Icon class="iconfont iconjiahao mr5" :size="22" @click="addNewParam" />
        <Icon class="iconfont iconchahao mr5" :size="22" @click="delParam" />
        <Icon class="iconfont iconxiangshang mr5" :size="22" @click="up" />
        <Icon class="iconfont iconxiangxia mr5" :size="22" @click="down" />
      </el-row>
      <!-- 这里的判断是防止空指针报错 -->
      <el-row :gutter="30" v-if="variateTagList[tagChooseIdx]">
        <i-col span="10">
          <div class="var-box-list" style="min-height: 300px">
            <!--<p class="spp-title" >新路线</p>-->
            <ul class="routeByList">
              <li
                v-for="(item, index) in variateTagList[tagChooseIdx].variables"
                @click="selectVar(index)"
                v-bind:class="{ routeByChecked: index == variateIndex }"
              >
                <!--<span>{{ item.type }}</span>-->
                <span>{{ item.name }}</span>
                <!--<span style="margin-left:10px;">-->
                <!--<Icon type="ios-close-circle" :size="14" style="color:red;" @click="propertyDelete(index)" />-->
                <!--</span>-->
              </li>
            </ul>
          </div>
        </i-col>
        <i-col span="14">
          <el-form
            :label-width="100"
            class="routeBy-form"
            label-position="left"
          >
            <el-form-item label="名称">
              <el-input v-model="variateInfo.name" />
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="variateInfo.type">
                <el-radio :label="0">文本</el-radio>
                <el-radio :label="1">数值</el-radio>
                <el-radio :label="2">日期</el-radio>
                <el-radio :label="3">列表</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="赋值">
              <el-row v-if="variateInfo.type == '2'">
                <el-col span="12">
                  <el-date-picker
                    type="date"
                    format="yyyy-MM-dd"
                    v-model="variateInfo.date"
                    placeholder="Select date"
                    style="width: 120px"
                    @on-change="setOptionDate"
                  ></el-date-picker>
                  <el-checkbox
                    v-model="variateInfo.currentDate"
                    @on-change="setCheckBoxDate('currentDate')"
                    >当前日期</el-checkbox
                  >
                </el-col>
                <el-col span="12">
                  <el-time-select
                    type="time"
                    format="HH:mm:ss"
                    v-model="variateInfo.time"
                    placeholder="Select time"
                    style="width: 120px"
                    @on-change="setOptionTime"
                  ></el-time-select>
                  <el-checkbox
                    v-model="variateInfo.currentTime"
                    @on-change="setCheckBoxDate('currentTime')"
                    >当前时间</el-checkbox
                  >
                </el-col>
              </el-row>
              <el-row v-else>
                <el-input v-model="variateInfo.value" />
              </el-row>
            </el-form-item>
          </el-form>
        </i-col>
      </el-row>
      <div slot="footer">
        <el-button type="info" size="large" @click="saveVariate"
          >保存</el-button
        >
      </div>
    </el-dialog>
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
      v-model="remarkModal"
      title="流程备注"
      width="80%"
      @on-ok="confirmRemark"
    >
      <!-- <quill-editor
        style="height: 300px"
        v-model="remark"
        :disabled="false"
        ref="myQuillEditor"
        :options="editorOption"
      >
      </quill-editor> -->
      <div class="upload-div">
        <div class="demo-upload-list" v-for="item in uploadList">
          <img :src="item.url" />
          <div class="demo-upload-list-cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleView(item)"
            ></Icon>
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(item)"
            ></Icon>
          </div>
        </div>
        <Upload
          ref="upload"
          type="drag"
          :show-upload-list="false"
          :action="baseUrl + '/file/v1/upload?type=remark'"
          :on-success="uploadSuccess"
          :format="['jpg', 'jpeg', 'png']"
          :on-format-error="handleFormatError"
          style="display: inline-block; width: 58px"
        >
          <div style="width: 58px; height: 58px; line-height: 58px">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
      </div>
    </el-dialog>
    <el-dialog title="View Image" v-model="imageVisible">
      <img :src="imageUrl" v-if="imageVisible" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import SplitPane from "./split-pane";
import Konva from "konva";
import NextFlow from "./nextflow.js";
import DragDrawer from "./drag-drawer";
import DragDrawerStart from "./drag-drawer-start";
import DragDrawerSetproperties from "./drag-drawer-setproperties";
import DragDrawerConnector from "./drag-drawer-connector";
import DragDrawerConnectorV3 from "./drag-drawer-connectorV3";
import DragDrawerBranch from "./drag-drawer-branch";
import DragDrawerStop from "./drag-drawer-stop";
import DragDrawerRoute from "./drag-drawer-route";
import DragDrawerIf from "./drag-drawer-if";
import DragDrawerCommand from "./drag-drawer-command";
import DragDrawerDataprocess from "./drag-drawer-dataprocess";
import DragDrawerReturn from "./drag-drawer-return";
import DragDrawerLoop from "./drag-drawer-loop";
import DragDrawerCall from "./drag-drawer-call";
import DragDrawerMessage from "./drag-drawer-message";
import DragDrawerNotify from "./drag-drawer-notify";
import DragDrawerException from "./drag-drawer-exception";
import DragDrawerInterface from "./drag-drawer-interface";
// 调试
import DragDrawerDebug from "./drag-drawer-debug";

/* eslint-disable */
import CustomHeader from "@/components/customHeader";
import VarEdit from "./module/variable-edit";
import { getTest } from "@/api/report";
import {
  getProcess,
  createProcess,
  updateProcess,
  deleteProcess,
  getVersions,
  updateCron,
  getScript,
} from "@/api/process";
import {
  createNewProcess,
  getNewProcessDetail,
  deleteNewProcess,
} from "@/api/process";
// import {
//   getVariableList,
//   createVariable,
//   updateVariable,
//   deleteVariable,
// } from "@/api/variable";
import { mapActions, mapMutations, mapGetters } from "vuex";
import store from "@/store";
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
    DragDrawerConnectorV3,
    DragDrawerBranch,
    DragDrawerStop,
    DragDrawerRoute,
    DragDrawerIf,
    DragDrawerCommand,
    DragDrawerDataprocess,
    DragDrawerReturn,
    DragDrawerLoop,
    DragDrawerCall,
    DragDrawerMessage,
    DragDrawerNotify,
    DragDrawerException,
    DragDrawerInterface,
    DragDrawerDebug,
    VarEdit,
    // quillEditor,
  },
  props: {
    id: {
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

      showWindowBDrawer: false,
      width1: "34%",
      width2: 200,
      placement: "right",
      draggable: true,
      confirmModal: false,
      confirm_modal_loading: false,
      testModal: false,
      testResult: false,
      testParams: { testArgs: [] },
      testProperties: "",
      testLoading: false,
      testResultData: [],
      testResultColumns: [],
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
      offset: "150px",
      offsetVertical: "250px",
      flowchart: undefined,
      nextflow: undefined,
      shapes: [
        // { id: 'start', type: 'start', name: '开始', url: require('@/assets/icon/start.jpg') },
        {
          id: "connector",
          type: "connector",
          name: "数据",
          url: require("@/assets/icon/connector.svg"),
        },
        {
          id: "connectorV3",
          type: "connectorV3",
          name: "数据V3",
          url: require("@/assets/icon/connector.svg"),
        },
        {
          id: "loop",
          type: "loop",
          name: "循环",
          url: require("@/assets/icon/loop.svg"),
        },
        {
          id: "branch",
          type: "branch",
          name: "分支",
          url: require("@/assets/icon/branch.svg"),
        },
        {
          id: "if",
          type: "if",
          name: "条件",
          url: require("@/assets/icon/if.svg"),
        },
        {
          id: "route",
          type: "route",
          name: "路由",
          url: require("@/assets/icon/route.svg"),
        },
        {
          id: "dataprocess",
          type: "dataprocess",
          name: "函数",
          url: require("@/assets/icon/dataprocess.svg"),
        },
        {
          id: "return",
          type: "return",
          name: "输出",
          url: require("@/assets/icon/return.svg"),
        },
        {
          id: "stop",
          type: "stop",
          name: "结束",
          url: require("@/assets/icon/stop.svg"),
        },

        {
          id: "call",
          type: "call",
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
          id: "interface",
          type: "interface",
          name: "接口",
          url: require("@/assets/icon/interface.svg"),
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
      baseUrl: "",
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
    };
  },
  created() {
    console.log("process create");
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
    document
      .getElementById("drag-items")
      .addEventListener("dragstart", function (e) {
        console.log("drag start", e);
        var imgs = e.target.getElementsByClassName("drag-shape-icon");
        if (imgs !== undefined && imgs.length > 0) {
          e.dataTransfer.setDragImage(imgs[0], 0, 0);
        }

        _this.draggingNode = _this.getNodeData(e.target, "data-shape-type");
      });

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
      showRightMenu = false;
    });

    nextflow.stage.on("contextmenu", function (e) {
      // prevent default behavior
      e.evt.preventDefault();
      if (e.target === nextflow.stage) {
        // if we are on empty place of the stage we will do nothing
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
      "deleteNewProcess",
    ]),
    ...mapMutations(["closeTag", "addTag", "setVarTagList", "setVariableList"]),
    // 开始组件传过来的数据
    syncData(data) {
      console.log("config data");
      console.log(JSON.stringify(data));
      //设置当前Diagram的名称
      if (data.title) {
        this.curDiagram.setTitle(data, this.curDiagram.type, data.title);
        delete data.title;
      }
      this.curDiagram.properties = data;
      if (this.curDiagram.type === "branch") {
        let outPutCount = this.curDiagram.properties.branch_count;
        this.curDiagram.updateOutputPorts(outPutCount);
      } else if (this.curDiagram.type === "route") {
        let len = this.curDiagram.properties.routes.length;
        this.curDiagram.updateOutputPorts(len + 1);
      }
      this.showWindowBDrawer = false; // 显示可拖动抽屉
      this.curDiagram = {};
      this.showWindowType = " ";

      //      this.saveData()
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
      var args = this.nextflow.getArgs();
      if (args.length > 0) {
        var args_copy = [];
        args.forEach((item, index) => {
          item.value = "";
          args_copy.push(item);
        });
        this.testParams.testArgs = args_copy;
      }
      this.testProperties = JSON.stringify({
        dataApiId: this.processId,
        debug: "true",
        params: {},
      });
      this.testModal = true;
    },
    TestPro: function (name) {
      var args = this.testParams.testArgs;
      if (args.length > 0) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.getTestRequest();
          } else {
            this.$message.error("请输入参数");
          }
        });
      } else {
        this.getTestRequest();
      }

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
      ).then((res) => {
        self.testResultColumns = [];
        if (res.code == 0) {
          this.testModal = false;
          this.$message.success("测试成功");
          var testResult = res.data;
          // self.testResultTotal = res.data.total_count;
          // if (testResult.length > 0) {
          //             for(var i =0;i<testResult.length;i++){
          // //                                      var testKeys = Object.keys(testResult[i])
          //               var testValues = Object.values(testResult[i])
          //               var jtem = {
          //                 ckdm:testValues[0],
          //                 end_time:testValues[1],
          //                 spdm:testValues[2],
          //                 start_time:testValues[3],
          //                 cycle:testValues[4],
          //                 rate:testValues[5],
          //                 purchase:testValues[6],
          //                 sales_volume:testValues[7],
          //               }
          //               self.testResultData.push(jtem)
          //             }
          let data = {};
          for (var col in testResult) {
            self.testResultColumns.push({ title: col, key: col });
          }
          let dataList = [];
          dataList.push(testResult);
          self.testResultData = dataList;
          self.testResult = true;
          // }
        } else if (res.code == 1000) {
          this.testResult = true;
          this.testResultError = res.msg;
        } else {
          this.$message.error(res.msg);
        }
      });
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
        this.$Message.error("请输入新流程的名称");
        return;
      }
      console.log(this.nextflow, "next");
      var configJson = this.nextflow.export();
      console.log("args:", this.nextflow.getArgs());
      console.log("flow data:");
      console.log(JSON.stringify(configJson));
      setStorage("__flow_data", JSON.stringify(configJson));
      this.$message("正在提交...", 0);

      // 从 vuex 取出最新的vartaglist
      this.variateTagList = this.$store.getters.varTagList;
      configJson.nodes.forEach((node) => {
        if (node.type == "processcall") {
          if (this.subProcessId.indexOf(node.properties.processId) < 0) {
            this.subProcessId.push(node.properties.processId);
          }
        }
      });
      let scheme = {
        nodes: configJson.nodes,
        variables: this.variateTagList,
        devSwitch: this.devSwitch,
        subProcessId: this.subProcessId,
      };

      console.log(scheme, "scheme");
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
        if (res.data.code == 0) {
          this.$message.success("保存成功", 2);
          this.processId = res.data.businessId;
          console.log("baocunchenggong", this.processId);
          // this.$router.replace("/process/" + this.processId);
          this.$router.replace({
            path: "/process/" + this.processId,
            query: {
              projectId: this.projectId,
              merchantId: this.merchantId,
              userName: this.userName,
            },
          });
          //保存完之后直接更新vuex var
          this.setVarTagList(this.variateTagList);
          this.setVariableList(this.variateTagList);
        }
      });
      // if (!this.processId) {
      //   createProcess(this.processName, JSON.stringify(configJson))
      //     .then(res => {
      //       msg();
      //       if (res.data.code == 0) {
      //         this.$Message.success("保存成功", 2);
      //         this.processId = res.data.data.id;
      //         this.$router.replace("/process/" + this.processId);
      //       } else {
      //         this.$Message.error(res.data.message, 10);
      //       }
      //     })
      //     .catch(err => {
      //       msg();
      //       this.$Message.error(err.response.data.message, 10);
      //       reject(err);
      //     });
      // } else {
      //   updateProcess(
      //     this.processId,
      //     this.processName,
      //     JSON.stringify(configJson)
      //   )
      //     .then(res => {
      //       msg();
      //       if (res.data.code == 0) {
      //         this.$Message.success("编辑成功");
      //       } else {
      //         this.$Message.error(res.data.message, 10);
      //       }
      //     })
      //     .catch(err => {
      //       msg();
      //       this.$Message.error(err.response.data.message, 10);
      //       reject(err);
      //     });
      // }
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
      this.projectId = store.getters.projectId;
      this.merchantId = store.getters.merchantId;

      // this.userName = this.$route.query.userName;
      // this.thirdUserId = this.$route.query.thirdUserId;
      // 放vuex 里

      let processName;
      if (!id && copyId) {
        id = copyId;
        processName = title;
      }
      // if (typeof id == "undefined") {
      //   this.nextflow.destroyChildren();
      //   this.nextflow.import({
      //     nodes: [
      //       {
      //         version: 1,
      //         id: 0,
      //         x: 128,
      //         y: 81,
      //         title: "开始",
      //         type: "start",
      //         outputs: [{ id: 7, x: 240.5, y: 97, title: null }],
      //         properties: {}
      //       }
      //     ]
      //   });
      //   // 2020-06-16 为了防止新建流程无法使用绑定的pid 的变量问题，临时处理成，init 的时候进行创建操作，然后调用保存变量接口
      //   this.processName = "test";
      //   setTimeout(() => {
      //     console.log("delay 2000");
      //     this.saveData();
      //     this.saveVariate();
      //   }, 500);
      //   return;
      // }
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
              type: "start",
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
          console.log("res", res);
          this.processId = res.data.id;
          this.processName = res.data.processName;
          console.log("this.nextflow.destroyChildren()");

          this.nextflow.destroyChildren();
          let scheme = JSON.parse(res.data.scheme);
          this.variateTagList = scheme.variables;
          delete scheme.variables;
          console.log(scheme, "scheme");
          this.nextflow.import(scheme);
          // this.testProperties = res.data.data.process_schema;
          this.setVarTagList(this.variateTagList);
          this.setVariableList(this.variateTagList);
          this.remark = res.data.remark;
          this.uploadList = res.data.fileList;
          if (scheme.devSwitch !== undefined) {
            this.devSwitch = scheme.devSwitch;
          } else {
            this.devSwitch = true;
          }
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
    deleteConfirm() {
      this.confirmModal = true;
    },
    deleteItem() {
      this.confirm_modal_loading = true;

      var _this = this;

      // deleteProcess(this.$route.params.id)
      //   .then(res => {
      //     if (res.data.code == 0) {
      //       this.confirmModal = false;
      //       this.confirm_modal_loading = false;
      //       _this.$Message.success("删除成功", 2);
      //       _this.close();
      //       //                  _this.$router.push('/home')
      //     } else {
      //       _this.$Message.error(res.data.message, 10);
      //     }
      //   })
      //   .catch(err => {
      //     _this.$Message.error(err.response.data.message, 10);
      //     reject(err);
      //   });
      let processId = this.processId;
      let projectId = 1;
      deleteNewProcess(processId, projectId)
        .then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            this.confirmModal = false;
            this.confirm_modal_loading = false;
            _this.$Message.success("删除成功", 2);
            // _this.close();
            window.open("", "_self");
          } else {
            _this.$Message.error(res.data.message, 10);
          }
        })
        .catch((err) => {
          _this.$Message.error(err.response.data.message, 10);
          reject(err);
        });
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
        this.showWindowBDrawer = true; // 显示可拖动抽屉
      });
    },
    cancelDrawer: function () {
      console.log("cancelDrawer");
      this.curDiagram = "";
      this.selectedDiagram = "";
      this.showWindowType = "";
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
      this.nextflow.copyDiagram(this.selectedDiagram);
    },
    deleteDiagram: function () {
      var r = confirm("是否删除该组件?");
      if (r == true) {
        if (this.selectedDiagram !== undefined) {
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
      // getVariableList(this.processId, 1, 99)
      //   .then((res) => {
      //     if (res.data.code == 0) {
      //       this.variateTagList = res.data.data;
      //       let sysFlag = false;
      //       let inFlag = false;
      //       let staticFlag = false;
      //       let listFlag = false;
      //       for (let i = 0; i < this.variateTagList.length; i++) {
      //         this.variateTagList[i].checked = false;
      //         this.variateTagList[i].editable = true;
      //         if (this.variateTagList[i].name == "系统参数") {
      //           sysFlag = true;
      //           this.variateTagList[i].editable = false;
      //         } else if (this.variateTagList[i].name == "输入参数") {
      //           inFlag = true;
      //         } else if (this.variateTagList[i].name == "常量") {
      //           staticFlag = true;
      //         } else if (this.variateTagList[i].name == "列表") {
      //           listFlag = true;
      //         }

      //         this.variateTagList[i].variables = JSON.parse(
      //           this.variateTagList[i].variables
      //         );
      //       }
      //       // if (!sysFlag) {
      //       //   this.variateTagList.push(this.commonVar[2]);
      //       // }
      //       if (!inFlag) {
      //         this.variateTagList.push(this.commonVar[0]);
      //       }
      //       if (!staticFlag) {
      //         this.variateTagList.push(this.commonVar[1]);
      //       }
      //       if (!listFlag) {
      //         this.variateTagList.push(this.commonVar[2]);
      //       }
      //       this.tagCheck(true, this.variateTagList[0].name);
      //       console.log(this.variateTagList, "initvar");
      //     }
      //   })
      //   .catch((err) => {
      //     reject(err);
      //   });
      this.variateTagList.push(this.commonVar[0]);
      this.variateTagList.push(this.commonVar[1]);
      this.variateTagList.push(this.commonVar[2]);
      this.variateTagList.push(this.commonVar[3]);
      this.setVarTagList(this.variateTagList);
      this.setVariableList(this.variateTagList);
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
    handleRemove(file) {
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
  },
};
</script>
<style lang="scss">
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
}
.opt-btn {
  margin-top: 10px;
  display: flex;
  width: 100%;
  justify-content: space-around;
}
.opt-btn > div {
  color: #409eff;
  cursor: pointer;
}
.opt-add-btn {
  margin-top: 10px;
  color: #409eff;
  cursor: pointer;
}
</style>

<style scoped lang="less">
/*.main .main-content-con {*/
/*  height: auto;*/
/*  overflow: hidden;*/
/*}*/
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
  padding-right: 20px;
  align-items: center;
  /*display: flex;
    flex-direction: column;
    display: -webkit-flex;
    -webkit-flex-direction: column;  */

  .dragdrop-cursor {
    cursor: move !important;
  }

  .drag-shape {
    overflow: hidden;
    padding: 6px 12px;
    white-space: nowrap;

    // height: 50px;
    // line-height:50px;
    // text-align: center;
    .drag-shape-img {
      position: relative;
      overflow: hidden;
      float: left;
      width: 32px;
      height: 32px;
      border: 1px solid transparent;
    }

    span {
      line-height: 50px;
      padding-left: 10px;
      text-align: center;
    }

    .drag-shape-label {
      display: inline-block;
      font-weight: 400;
      font-size: 12px;
      padding: 8px 20px 4px 8px;
      white-space: normal;
      word-wrap: break-word;
    }

    img {
      width: 30px;
      height: 30px;
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      vertical-align: baseline;
      background: transparent;
    }
  }
}

.shapes .drag-shape:hover {
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
  height: calc(100vh - 34px);
  // height:100%
  .pane {
    width: 100%;
    height: 100%;

    &.left-pane {
      background: white;
      /*padding-top: 20px;*/
    }

    &.right-pane {
      background: white;
      padding: 10px;
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

#menu {
  display: none;
  position: absolute;
  width: 60px;
  background-color: #007db8;
  box-shadow: 0 0 5px grey;
  border-radius: 3px;
}

#menu span {
  display: inline-block;
}

#menu button {
  width: 100%;
  background-color: #007db8;
  border: none;
  margin: 0;
  padding: 10px;
  color: white;
}

#menu button:hover {
  background-color: #17678b;
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
  font-size: 14px;
  width: 100%;
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
</style>
