<template>
  <div style="padding-left: 20px">
    <div style="padding: 10px 0 0">{{ title }}</div>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-refresh'"
    >
      <el-select
        multiple
        filterable
        v-model="singleActionItem.operateRefresh"
        placeholder="请选择"
        :key="1"
      >
        <el-option
          v-for="(item, key) in refreshComponentList"
          :key="key"
          :label="item.options.commonConfigAssignName"
          :value="item.uuid"
        >
        </el-option>
      </el-select>
    </div>
    <!------------------- 组件隐藏 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-display'"
    >
      <el-select
        multiple
        filterable
        v-model="singleActionItem.operateDisplay"
        placeholder="请选择"
        :key="11"
      >
        <el-option
          v-for="(item, key) in linearComponentList"
          :key="key"
          :label="item.options.commonConfigAssignName"
          :value="item.uuid"
        >
        </el-option>
      </el-select>
    </div>
    <!------------------- 组件打印 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-print'"
    >
      <el-select
        filterable
        v-model="singleActionItem.operatePrintComponentId"
        placeholder="请选择需要打印的组件"
        :key="111"
      >
        <el-option
          v-for="(item, key) in linearComponentList"
          :key="key"
          :label="item.options.commonConfigAssignName"
          :value="item.uuid"
        >
        </el-option>
      </el-select>
    </div>
    <!------------------- 表单提交 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-form-submit'"
    >
      <el-select
        multiple
        filterable
        v-model="singleActionItem.operateDisplay"
        placeholder="请选择"
        :key="11"
      >
        <el-option
          v-for="(item, key) in linearComponentList"
          :key="key"
          :label="item.options.commonConfigAssignName"
          :value="item.uuid"
        >
        </el-option>
      </el-select>
    </div>
    <div
      style="margin-top: 8px"
      v-if="singleActionItem.actionType === 'event-operate-display'"
    >
      <el-radio v-model="singleActionItem.displayAction" label="display"
        >显示</el-radio
      >
      <el-radio v-model="singleActionItem.displayAction" label="hide"
        >隐藏</el-radio
      >
      <el-radio v-model="singleActionItem.displayAction" label="switch"
        >切换</el-radio
      >
    </div>
    <!------------------- 接口调用 TODO::: 接口调用需要与eventItem互相循环引用，不太好分成两个组件 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-interface'"
    >
      <!-- <el-select
        v-model="singleActionItem.operateApiId"
        placeholder="请选择"
        clearable
        :key="2"
        @change="changeInterface"
      >
        <el-option
          v-for="item in interfaceApiAll"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select> -->
      <el-cascader
        v-model="singleActionItem.operateApiId"
        :show-all-levels="false"
        :options="interfaceApiNewAll"
        :props="{ value: 'queryId', label: 'name', emitPath: false }"
        @change="changeInterface"
      >
      </el-cascader>
      <!--      <el-select-->
      <!--        v-model="singleActionItem.operateApiId"-->
      <!--        filterable-->
      <!--        clearable-->
      <!--        placeholder="请选择"-->
      <!--        @change="changeInterface"-->
      <!--      >-->
      <!--        <div v-for="group in interfaceApiAll" :key="group.label">-->
      <!--          <el-option-group-->
      <!--            v-if="group.dataType == 'directory'"-->
      <!--            :key="group.treeId"-->
      <!--            :label="group.name"-->
      <!--          >-->
      <!--            <el-option-->
      <!--              v-for="item in group.children"-->
      <!--              :key="item.treeId"-->
      <!--              :label="item.name"-->
      <!--              :value="item.queryId"-->
      <!--            >-->
      <!--            </el-option>-->
      <!--          </el-option-group>-->
      <!--          <el-option-->
      <!--            v-else-->
      <!--            :key="group.treeId"-->
      <!--            :label="group.name"-->
      <!--            :value="group.queryId"-->
      <!--          >-->
      <!--          </el-option>-->
      <!--        </div>-->
      <!--      </el-select>-->
      <!-- 参数配置 -->
      <el-form size="small" label-width="70px" class="label-left">
        <div style="padding: 10px 0 0">参数配置</div>
        <el-form-item
          :label="item.param_name"
          v-for="(item, index) in singleActionItem.interfaceDataConfig
            .paramsConfigs"
          :key="index"
        >
          <valueSelect
            :paramItem="item"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
      </el-form>
    </div>
    <!------------------- 对话框 ------------------>
    <actionDialogBoxView
      :key="diagramId"
      :actionItem="singleActionItem"
      :hrefPageList="hrefPageList"
      :varDataObj="varDataObj"
      @handleHrefPage="handleHrefPage"
    />
    <!------------------- 页面跳转  页面打印 ------------------>
    <div
      style="padding-top: 10px"
      v-if="
        singleActionItem.actionType === 'event-operate-href' ||
        singleActionItem.actionType === 'event-operate-href-reload' ||
        singleActionItem.actionType === 'event-operate-close-page'
        //||singleActionItem.actionType === 'event-operate-print'
      "
    >
      <!-- <el-select
        v-model="singleActionItem.operateHrefPageId"
        placeholder="请选择"
        :key="3"
        @change="handleHrefPage"
      >
        <el-option
          v-for="(item, key) in hrefPageList"
          :key="key"
          :label="item.reportName"
          :value="item.id"
        >
        </el-option>
      </el-select> -->
      <el-cascader
        v-model="singleActionItem.operateHrefPageId"
        :show-all-levels="false"
        :options="hrefPageList"
        :props="{ value: 'queryId', label: 'name', emitPath: false }"
        @change="handleHrefPage"
      >
      </el-cascader>
      <div style="padding-top: 10px">
        参数配置
        <actionHrefView
          :actionItem="singleActionItem"
          :varDataObj="varDataObj"
        />
      </div>
    </div>

    <!------------------- 逻辑判断配置 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-logic-judgment'"
    >
      <valueSelect
        :key="diagramId"
        :paramItem="singleActionItem"
        :isBind="true"
        @handleChange="handleChange"
        style="padding: 10px 0px"
      />
      <!-- 判断 -->
      <el-input
        size="small"
        placeholder="请输入内容"
        v-model="singleActionItem.logicValue"
        style="width: 215px; padding-bottom: 10px"
      >
        <el-select
          placeholder=" "
          v-model="singleActionItem.logicOperator"
          slot="prepend"
          style="width: 100px"
        >
          <el-option
            v-for="(value, key) in {
              '=': '=',
              '>': '>',
              '>=': '>=',
              '<': '<',
              '<=': '<=',
              '!=': '!=',
              isNull: 'isNull',
              isNotNull: 'isNotNull',
            }"
            :key="key"
            :label="value"
            :value="key"
          ></el-option>
        </el-select>
      </el-input>
      <!-- 判断之后的处理：： 因为在面板模式下不支持条件判断，只能文本显示 -->
      <!-- <div>
        {{ actionItem.logicChildren }}
      </div> -->
    </div>
    <!------------------- 流程图线节点配置 ------------------>
    <div
      style="padding-top: 10px; text-align: center"
      v-if="singleActionItem.actionType === 'flow-chart-line-config'"
    >
      <div style="padding-bottom: 10px">
        <el-switch
          v-model="singleActionItem.value"
          active-text="真"
          inactive-text="假"
        >
        </el-switch>
      </div>
      <el-button
        type="primary"
        size="small"
        @click="$emit('onSaveLineConfig', singleActionItem)"
        >保存</el-button
      >
    </div>
    <!-------------------------- 页面返回  ------------------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-back'"
    >
      返回到前一个页面
    </div>
    <!-------------------------- 组件设值  ------------------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-set'"
    >
      <eventActionSet
        :key="diagramId"
        :actionSet="singleActionItem.actionSet"
        @saveActionSet="saveActionSet"
      ></eventActionSet>
    </div>
    <!--  -->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-dialog-box-msg'"
    >
      <eventDialogBox
        :key="diagramId"
        :actionSet="singleActionItem.actionSet"
        :popupBody="singleActionItem.popupBody"
        @saveActionSet="saveActionSet"
        @savePopupValue="savePopupValue"
      ></eventDialogBox>
<!--      <div>-->
<!--        <el-input-->
<!--          type="textarea"-->
<!--          placeholder="请输入提示信息"-->
<!--          v-model="singleActionItem.popupBody"-->
<!--        ></el-input>-->
<!--      </div>-->
    </div>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-dialog-box-confirm'"
    >
      <div>
        <el-input
          type="textarea"
          placeholder="请输入确认信息"
          v-model="singleActionItem.popupBody"
        ></el-input>
      </div>
    </div>
    <!----------------------- 拨打电话 --------------------------->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-make-phone-call'"
    >
      <el-form size="small" label-width="70px" class="label-left">
        <el-form-item label="手机号">
          <valueSelect
            :paramItem="singleActionItem"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
      </el-form>
    </div>
    <!----------------------- 主页跳转 --------------------------->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-main-menu-href'"
    >
      主页跳转
      <el-form size="small" label-width="70px" class="label-left">
        <el-form-item label="用户名称">
          <valueSelect
            :key="diagramId"
            :paramItem="singleActionItem.paramUser"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
        <el-form-item label="Token">
          <valueSelect
            :key="diagramId"
            :paramItem="singleActionItem.paramToken"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
        <el-form-item label="用户权限">
          <valueSelect
            :key="diagramId"
            :paramItem="singleActionItem.paramAuth"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
      </el-form>
    </div>
    <!----------------------- Javascript --------------------------->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-javascript'"
    >
      <!-- <div style="background-color: #f8f8f8; width: 80%; padding: 10px">
        <div class="codeSnippetTitle">
          代码片段：
        </div>
        <ul>
          <li class="codeSnippet" @click="$emit('snippetHandler', 'getComponents')">
            获取组件
            <el-tooltip class="item" effect="dark" content="通过组件名获取匹配的组件列表" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="$emit('snippetHandler', 'setComponentsValue')">
            设置组件值
            <el-tooltip class="item" effect="dark" content="通过获取到的组件设置组件值" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="$emit('snippetHandler', 'toggleComponentDisplay')">
            显示隐藏组件
            <el-tooltip class="item" effect="dark" content="控制组件的显示隐藏" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="$emit('snippetHandler', 'showComponentDisplay')">
            显示组件
            <el-tooltip class="item" effect="dark" content="显示组件" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="$emit('snippetHandler', 'hideComponentDisplay')">
            隐藏组件
            <el-tooltip class="item" effect="dark" content="隐藏组件" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="$emit('snippetHandler', 'refreshComponentData')">
            组件刷新
            <el-tooltip class="item" effect="dark" content="传入获取到的组件引用刷新该组件的数据" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
        </ul>
      </div> -->
    </div>
    <!----------------------- 函数脚本 --------------------------->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-function'"
    >
      <actionFunction
        :actionItem="singleActionItem"
      ></actionFunction>
    </div>
    <!----------------------- 数据导出 --------------------------->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-export'"
    >
      <el-cascader
        v-model="singleActionItem.operateApiId"
        :show-all-levels="false"
        :options="interfaceApiNewAll"
        :props="{ value: 'queryId', label: 'name', emitPath: false }"
        @change="changeInterface"
      >
      </el-cascader>
<!--      <el-select-->
<!--        v-model="singleActionItem.operateApiId"-->
<!--        filterable-->
<!--        clearable-->
<!--        placeholder="请选择"-->
<!--        @change="changeInterface"-->
<!--      >-->
<!--        <div v-for="group in interfaceApiAll" :key="group.label">-->
<!--          <el-option-group-->
<!--            v-if="group.dataType == 'directory'"-->
<!--            :key="group.treeId"-->
<!--            :label="group.name"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in group.children"-->
<!--              :key="item.treeId"-->
<!--              :label="item.name"-->
<!--              :value="item.queryId"-->
<!--            >-->
<!--            </el-option>-->
<!--          </el-option-group>-->
<!--          <el-option-->
<!--            v-else-->
<!--            :key="group.treeId"-->
<!--            :label="group.name"-->
<!--            :value="group.queryId"-->
<!--          >-->
<!--          </el-option>-->
<!--        </div>-->
<!--      </el-select>-->
      <!-- 参数配置 -->
      <el-form size="small" label-width="70px" class="label-left">
        <div style="padding: 10px 0 0">参数配置</div>
        <el-form-item
          :label="item.param_name"
          v-for="(item, index) in singleActionItem.interfaceDataConfig
            .paramsConfigs"
          :key="index"
        >
          <valueSelect
            :paramItem="item"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
      </el-form>
      <div style="padding: 10px 0 0">导出数据项</div>
      <valueSelect
        :paramItem="singleActionItem.exportDataConfig"
        :isBind="false"
        @handleChange="handleChange"
        style="padding: 10px 0px"
      />
      <div>
        导出名称:<el-input
          v-model="singleActionItem.exportName"
          style="padding: 10px 20px 10px 0px"
        />
      </div>
    </div>
    <!----------------------- 数据导入 --------------------------->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-import'"
    >
      <el-cascader
        v-model="singleActionItem.operateApiId"
        :show-all-levels="false"
        :options="interfaceApiNewAll"
        :props="{ value: 'queryId', label: 'name', emitPath: false }"
        @change="changeImportInterface"
      >
      </el-cascader>
<!--      <el-select-->
<!--        v-model="singleActionItem.operateApiId"-->
<!--        filterable-->
<!--        clearable-->
<!--        placeholder="请选择"-->
<!--        @change="changeImportInterface"-->
<!--      >-->
<!--        <div v-for="group in interfaceApiAll" :key="group.label">-->
<!--          <el-option-group-->
<!--            v-if="group.dataType == 'directory'"-->
<!--            :key="group.treeId"-->
<!--            :label="group.name"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in group.children"-->
<!--              :key="item.treeId"-->
<!--              :label="item.name"-->
<!--              :value="item.queryId"-->
<!--            >-->
<!--            </el-option>-->
<!--          </el-option-group>-->
<!--          <el-option-->
<!--            v-else-->
<!--            :key="group.treeId"-->
<!--            :label="group.name"-->
<!--            :value="group.queryId"-->
<!--          >-->
<!--          </el-option>-->
<!--        </div>-->
<!--      </el-select>-->
      <!-- 参数配置 -->
      <el-form size="small" label-width="70px" class="label-left">
        <div style="padding: 10px 0 0">参数配置</div>
        <el-form-item
          :label="item.param_name"
          v-for="(item, index) in singleActionItem.interfaceDataConfig
            .paramsConfigs"
          :key="index"
        >
          <!-- <el-switch  v-model="item.custom"
          active-text="自定义"
          inactive-text=""></el-switch> -->
          <el-radio-group v-model="item.custom">
            <el-radio :label="false">自动匹配</el-radio>
            <el-radio :label="true">自定义</el-radio>
          </el-radio-group>
          <valueSelect
            v-if="item.custom"
            :paramItem="item"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
      </el-form>
    </div>
    <!-- 审批节点 -->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'work-flow-approval'"
    >
      <div>
        审批人
        <el-tooltip
          effect="dark"
          content="通过后端服务指定本节点的审批人，返回参数“审批人”"
          placement="top"
        >
          <i class="el-icon-info" style="cursor: pointer"></i>
        </el-tooltip>
      </div>

      <el-select
        v-model="singleActionItem.operateApiId"
        filterable
        clearable
        placeholder="请选择"
        @change="changeInterface"
        style="width: 120px; margin-right: 10px"
      >
        <div v-for="group in interfaceApiAll" :key="group.label">
          <el-option-group
            v-if="group.dataType == 'directory'"
            :key="group.treeId"
            :label="group.name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.treeId"
              :label="item.name"
              :value="item.queryId"
            >
            </el-option>
          </el-option-group>
          <el-option
            v-else
            :key="group.treeId"
            :label="group.name"
            :value="group.queryId"
          >
          </el-option>
        </div>
      </el-select>
      <el-checkbox v-model="singleActionItem.zhuji">逐级审批</el-checkbox>
      <div class="review-div">参数配置</div>
      <el-select v-model="singleActionItem.param">
        <el-option
          v-for="(workItem, key) in workFlowParams"
          :key="key"
          :value="workItem.name"
          >{{ workItem.name }}</el-option
        >
      </el-select>
      <div class="review-div">审批方式</div>
      <el-select v-model="singleActionItem.methods">
        <el-option
          v-for="(workItem, key) in approvalMethods"
          :key="key"
          :value="workItem.value"
          :label="workItem.name"
        ></el-option>
      </el-select>
      <div class="review-div">审批界面</div>
      <el-select
        v-model="singleActionItem.page"
        filterable
        clearable
        placeholder="请选择"
        @change="handleHrefPage"
      >
        <div v-for="group in hrefPageList" :key="group.label">
          <el-option-group
            v-if="group.dataType == 'directory'"
            :key="group.treeId"
            :label="group.name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.treeId"
              :label="item.name"
              :value="item.queryId"
            >
            </el-option>
          </el-option-group>
          <el-option
            v-else
            :key="group.treeId"
            :label="group.name"
            :value="group.queryId"
          >
          </el-option>
        </div>
      </el-select>
      <div class="review-div">审批意见</div>
      <el-checkbox v-model="workFlow.adoptRequired">通过时必填</el-checkbox>
      <el-checkbox v-model="workFlow.rejectRequired">否定时必填</el-checkbox>
    </div>
    <!-- 审批业务处理节点 -->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'work-flow-business-handler'"
    >
      <el-select
        v-model="singleActionItem.operateApiId"
        filterable
        clearable
        placeholder="请选择"
        @change="changeInterface"
      >
        <div v-for="group in interfaceApiAll" :key="group.label">
          <el-option-group
            v-if="group.dataType == 'directory'"
            :key="group.treeId"
            :label="group.name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.treeId"
              :label="item.name"
              :value="item.queryId"
            >
            </el-option>
          </el-option-group>
          <el-option
            v-else
            :key="group.treeId"
            :label="group.name"
            :value="group.queryId"
          >
          </el-option>
        </div>
      </el-select>
      <!-- 参数配置 -->
      <el-form size="small" label-width="70px" class="label-left">
        <div style="padding: 10px 0 0">输入参数</div>
        <el-form-item
          :label="item.param_name"
          v-for="(item, index) in singleActionItem.interfaceDataConfig
            .paramsConfigs"
          :key="index"
        >
          <!-- TODO -->
          <el-select v-model="item.param_value" style="line-height: 52px">
            <el-option
              v-for="(workItem, key) in workFlowParams"
              :key="key"
              :value="workItem.name"
              >{{ workItem.name }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 审批条件节点 -->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'work-flow-if'"
    >
      <!-- <div>
        条件服务<el-tooltip
          effect="dark"
          content="返回参数“条件”（是/否）"
          placement="top"
        >
          <i class="el-icon-info" style="cursor: pointer"></i>
        </el-tooltip>
      </div> -->
      <el-select
        v-model="singleActionItem.operateApiId"
        filterable
        clearable
        placeholder="请选择"
        @change="changeInterface"
      >
        <div v-for="group in interfaceApiAll" :key="group.label">
          <el-option-group
            v-if="group.dataType == 'directory'"
            :key="group.treeId"
            :label="group.name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.treeId"
              :label="item.name"
              :value="item.queryId"
            >
            </el-option>
          </el-option-group>
          <el-option
            v-else
            :key="group.treeId"
            :label="group.name"
            :value="group.queryId"
          >
          </el-option>
        </div>
      </el-select>
      <!-- 参数配置 -->
      <el-form size="small" label-width="70px" class="label-left">
        <div style="padding: 10px 0 0">输入参数</div>
        <el-form-item
          :label="item.param_name"
          v-for="(item, index) in singleActionItem.interfaceDataConfig
            .paramsConfigs"
          :key="index"
        >
          <!-- TODO -->
          <el-select v-model="item.param_value" style="line-height: 52px">
            <el-option
              v-for="(workItem, key) in workFlowParams"
              :key="key"
              :value="workItem.name"
              >{{ workItem.name }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 外链跳转 -->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-link'"
    >
<!--      <valueSelect-->
<!--        v-if="singleActionItem.dynamic"-->
<!--        :paramItem="singleActionItem.linkDynamic"-->
<!--        @handleChange="handleChange"-->
<!--        :isBind="true"-->
<!--        style="padding: 10px 0px"-->
<!--      />-->
<!--      <el-input-->
<!--        v-else-->
<!--        v-model="singleActionItem.linkUrl"-->
<!--        placeholder="请输入外链地址"-->
<!--        style="width: 90%; padding: 10px 0px"-->
<!--      />-->

<!--      <el-switch-->
<!--        v-model="singleActionItem.dynamic"-->
<!--        @change="changeLink"-->
<!--        active-text="动态"-->
<!--      />-->
      <el-tabs style="margin-right: 20px;"
               v-model="linkActiveName"
               stretch
               @tab-click="changeLink"
      >
        <el-tab-pane label="静态地址" name="first">
          <el-input
            v-model="singleActionItem.linkUrl"
            placeholder="请输入外链地址"
            style="width: 90%; padding: 10px 0px"
          />
        </el-tab-pane>
        <el-tab-pane label="动态地址" name="second">
          <valueSelect
            :paramItem="singleActionItem.linkDynamic"
            @handleChange="handleChange"
            :isBind="true"
            style="padding: 10px 0px"
          />
        </el-tab-pane>
      </el-tabs>
      <br />
      参数配置
      <div
        v-for="(pItem, pIndex) in singleActionItem.params"
        :key="pIndex"
        class="link-div"
      >
        <el-input
          size="small"
          placeholder="参数名称"
          v-model="pItem.param_name"
          @change="change"
          style="width: 100px; margin-right: 10px"
        />
        <valueSelect
          :paramItem="pItem"
          @handleChange="handleChange"
          style="padding: 10px 0px"
        />
        <i
          class="el-icon-delete link-operator"
          style="cursor: pointer"
          @click="deleteParam(pIndex)"
        ></i>
      </div>
      <div @click="addLinkParam" class="opt-add-btn">
        <icon class="iconfont iconjiahao1"></icon>
        添加参数
      </div>
      返回页面地址
      <el-cascader
        v-model="singleActionItem.redirectPageId"
        :show-all-levels="false"
        :options="hrefPageList"
        :props="{ value: 'queryId', label: 'name', emitPath: false }"
        @change="handleHrefPage"
      >
      </el-cascader>
<!--      <el-select-->
<!--        v-model="singleActionItem.redirectPageId"-->
<!--        filterable-->
<!--        clearable-->
<!--        placeholder="请选择"-->
<!--        style="padding: 10px 0px"-->
<!--        @change="handleHrefPage"-->
<!--      >-->
<!--        <div v-for="group in hrefPageList" :key="group.label">-->
<!--          <el-option-group-->
<!--            v-if="group.dataType == 'directory'"-->
<!--            :key="group.treeId"-->
<!--            :label="group.name"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in group.children"-->
<!--              :key="item.treeId"-->
<!--              :label="item.name"-->
<!--              :value="item.queryId"-->
<!--            >-->
<!--            </el-option>-->
<!--          </el-option-group>-->
<!--          <el-option-->
<!--            v-else-->
<!--            :key="group.treeId"-->
<!--            :label="group.name"-->
<!--            :value="group.queryId"-->
<!--          >-->
<!--          </el-option>-->
<!--        </div>-->
<!--      </el-select>-->
      <div style="padding-top: 10px">
        参数配置
        <actionHrefView
          :actionItem="singleActionItem"
          :varDataObj="varDataObj"
        />
      </div>
    </div>
    <!-- 超链接 -->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-hlink'"
    >
      <el-radio v-model="singleActionItem.openType" label="current">当前页面</el-radio>
      <el-radio v-model="singleActionItem.openType" label="blank">新页面</el-radio>
<!--      <el-switch-->
<!--        v-model="singleActionItem.dynamic"-->
<!--        @change="changeLink"-->
<!--        active-text="动态"-->
<!--      />-->
      <el-tabs style="margin-right: 20px; margin-top: 20px"
               v-model="linkActiveName"
               stretch
               @tab-click="changeLink"
      >
        <el-tab-pane label="静态地址" name="first">
          <el-input
            v-model="singleActionItem.linkUrl"
            placeholder="请输入外链地址"
            style="width: 90%; padding: 10px 0px"
          />
        </el-tab-pane>
        <el-tab-pane label="动态地址" name="second">
          <valueSelect
            :paramItem="singleActionItem.linkDynamic"
            @handleChange="handleChange"
            :isBind="true"
            style="padding: 10px 0px"
          />
        </el-tab-pane>
      </el-tabs>
      <br />
      参数配置
      <div
        v-for="(pItem, pIndex) in singleActionItem.params"
        :key="pIndex"
        class="link-div"
      >
        <el-input
          size="small"
          placeholder="参数名称"
          v-model="pItem.param_name"
          @change="change"
          style="width: 100px; margin-right: 10px"
        />
        <valueSelect
          :paramItem="pItem"
          @handleChange="handleChange"
          style="padding: 10px 0px"
        />
        <i
          class="el-icon-delete link-operator"
          style="cursor: pointer"
          @click="deleteParam(pIndex)"
        ></i>
      </div>
      <div @click="addLinkParam" class="opt-add-btn">
        <icon class="iconfont iconjiahao1"></icon>
        添加参数
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 事件行为配置
 */
import {
  getLocalData,
  saveAndUpdateLocalData,
  saveAndUpdatePageLocalData,
} from "@/views/report/utils/deal-data-cache/index";
import {
  getProcessApiParamsService,
  getProcesseDataList,
  getReportInterfaceList,
  getReportDetail,
} from "@/api/chartsData";

import { getProcessParamService } from "@/api/process";

import { getListAllV4 } from "@/api/report";
import eventActionView from "@/views/report/layout/report-config-event/action-modules/event-item.vue"; // TODO::: 引入自身组件，循环引入
import actionHrefView from "@/views/report/layout/report-config-event/action-modules/action-href.vue";
import actionDialogBoxView from "@/views/report/layout/report-config-event/action-modules/action-dialog-box.vue";
import actionFunction from "@/views/report/layout/report-config-event/action-modules/action-function.vue";
import eventActionSet from "@/views/report/layout/report-config-event/action-modules/event-action-set.vue";
import eventDialogBox from "@/views/report/layout/report-config-event/action-modules/event-dialog-box.vue"
import { lastDay, currentUnitDay, lastUnitDay } from "@/utils/dateUtils.js";
import Vue from "vue";
import valueSelect from "@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue";
export default {
  name: "eventActionView",
  components: {
    eventActionView,
    actionHrefView,
    actionDialogBoxView,
    eventActionSet,
    eventDialogBox,
    valueSelect,
    actionFunction
  },
  props: {
    actionItem: {
      type: Object,
      default: () => {},
    },
    refreshComponentList: {
      type: Array,
      default: () => [],
    },
    dialogBoxComponentList: {
      type: Array,
      default: () => [],
    },
    linearComponentList: {
      type: Array,
      default: () => [],
    },

    subpageList: {
      type: Array,
      default: () => [],
    },
    deviceDesignType: {
      type: String,
      default: "MOBILE",
    },
    interfaceApiAll: {
      type: Array,
      default: () => [],
    },  //不包含第三方接口的接口列表
    interfaceApiNewAll: {
      type: Array,
      default: () => [],
    },  //包含了第三方接口的接口列表
    hrefPageList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      diagramId:null,
      radio: "",
      radio1: "",
      title: "",
      singleActionItem: {},
      varDataObj: {},
      interfaceKeyList: {},
      // hrefPageList: [],
      paramsActiveNames: "",
      statusActiveNames: "",
      // interfaceApiAll: [],
      processApiParamsList: [], // 接口参数列表
      workFlowParams: [
        {
          name: "记录ID",
        },
        {
          name: "待审核人",
        },
        {
          name: "审核人(上个节点)",
        },
        {
          name: "审核意见(上个节点)",
        },
        {
          name: "发起人ID",
        },
      ],
      approvalMethods: [
        {
          name: "或签（一名审批人通过或否决即可）",
          value: "或签",
        },
        {
          name: "会签（需所有审批人通过）",
          value: "会签1",
        },
        {
          name: "会签（只需一名审批人通过，否决需全员否决）",
          value: "会签2",
        },
      ],
      workFlow: {
        operateApiId: null,
        zhuji: false,
        param: "",
        methods: "",
        page: "",
        adoptRequired: false,
        rejectRequired: false,
      },
    };
  },
  computed: {
    linkActiveName: {
      get() {
        if (this.singleActionItem.dynamic) {
          return 'second'
        } else {
          return 'first'
        }
      },
      set(val) {
        if (val === 'second') {
          this.singleActionItem.dynamic = true
        } else {
          this.singleActionItem.dynamic = false
        }
      }
    }
  },
  watch: {
    actionItem(val) {
      console.log('singleActionItem=====', val);
      this.singleActionItem = val; //新增result的watch，监听变更并同步到myResult上
    },
  },
  created() {
    // console.log(lastDay(2));
    this.varDataObj = this.$pageDataModelEngine.getCustomData();
    // // TODO 每次打开流程或者拖动一个新的组件都会调用一次，找时间优化了 ，可以放到vuex 里面去取
    // this.queryInterfaceDataList();
    // this.queryReportList();
  },
  mounted() {},
  methods: {
    init(diagram) {
      this.diagramId=diagram.id
      this.singleActionItem ={};
      this.title=null;
      console.log("right menu init", diagram);
      this.singleActionItem = diagram.properties;
      this.title = diagram.title;
      // this.varDataObj = this.$pageDataModelEngine.getCustomData();
      // // TODO 每次打开流程或者拖动一个新的组件都会调用一次，找时间优化了 ，可以放到vuex 里面去取
      // this.queryInterfaceDataList();
      // this.queryReportList();
    },
    queryReportList() {
      const data = {
        parentId: 0,
        queryType: this.deviceDesignType,
      };
      getListAllV4(data).then((res) => {
        this.hrefPageList = res.dataList || [];
      });
    },
    addLinkParam() {
      let param = {
        param_name: "",
        params_value: "",
      };
      if (!this.singleActionItem.params) {
        this.singleActionItem.params = [];
      }

      this.singleActionItem.params.push(param);
      this.$forceUpdate();
    },
    deleteParam(index) {
      this.singleActionItem.params.splice(index, 1);
    },
    // 获取接口数据列表
    queryInterfaceDataList() {
      getReportInterfaceList().then((res) => {
        this.interfaceApiAll = res.dataList;
      });
    },
    handleAddColumnInterfaceConfig(interfaceDataConfig) {
      if (!interfaceDataConfig) return false;
      interfaceDataConfig.paramsConfigs.push({
        param_name: "",
        param_value: "",
      });
      this.$forceUpdate();
    },
    handleAddColumnAction(interfaceDataConfig) {
      if (!interfaceDataConfig) return false;
      if (!interfaceDataConfig.statusActionList) {
        interfaceDataConfig.statusActionList = [];
      }
      interfaceDataConfig.statusActionList.push({
        actionType: "",
        interfaceDataConfig: {
          statusName: "",
          statusValue: "",
          hrefPageParams: [],
        },
      });
      this.$forceUpdate();
    },
    handleOptionsRemoveActionList(index, interfaceDataConfig) {
      interfaceDataConfig.splice(index, 1);
    },
    handleOptionsRemoveInterfaceConfig(index, interfaceDataConfig) {
      interfaceDataConfig.paramsConfigs.splice(index, 1);
    },
    handleChange(data, paramItem) {
      if (paramItem.param_value_type == "T") {
        paramItem.relevanceComponentUuid = data[1].id;
        // console.log('12341234', paramItem, data)
        if (data.length === 3) {
          // TODO:: 待优化 目前组件有三层的是Table和树形组件（特殊处理）
          paramItem.param_v_key = data[2].data.value;
        }
      } else if (paramItem.param_value_type == "V") {
        paramItem.type = data[0].type;
        paramItem.param_v_key = data[1].id;
        if (data[0].type == "customInterface") {
          paramItem.param_value = data[1].data.value;
          paramItem.operateApiId = data[0].id;
        } else {
          paramItem.param_value = data[1].data.value.operateHrefPageParamValue;
        }
      } else if (paramItem.param_value_type == "B") {
        paramItem.type = data[0].type;
        if (data[0].type == "radio-button-tables") {
          paramItem.param_v_table = data[0].data.name;
          paramItem.param_v_key = data[1].id;
          paramItem.param_value = ""; // 接口值取不到的
        } else if (
          data[0].type == "radio-button-interface" ||
          data[0].type == "radio-button-connect"
        ) {
          paramItem.param_v_name = data[0].data.name;
          paramItem.middle = data[1].id;
          if (data.length > 2) {
            // 2022-02-25
            paramItem.param_v_key = data[2].id;
            paramItem.param_value = data[2].data.value; // 接口值取不到的
          } else {
            paramItem.operateApiId = data[0].id;
          }
        }
      }
      this.$forceUpdate();
    },
    changeImportInterface(id) {
      this.singleActionItem.interfaceDataConfig.paramsConfigs = [];
      if (id) {
        this.singleActionItem.interfaceDataConfig.operateApiId = id;
        this.queryProcessApiParamAndRes(id, "import");
      }
    },
    changeInterface(id) {
      this.singleActionItem.interfaceDataConfig.paramsConfigs = [];
      if (id) {
        this.singleActionItem.interfaceDataConfig.operateApiId = id;
        // this.queryProcessApiParamsService(id);

        // this.queryProcessApiResService(id);

        this.queryProcessApiParamAndRes(id);
      }
    },
    queryProcessApiParamAndRes(id, type) {
      const data = {
        processId: id,
      };
      getProcessParamService(data).then((res) => {
        let paramsList = res.data.params;
        paramsList &&
          paramsList.forEach((item) => {
            let param = {
              param_name: item.name,
            };
            if (type == "import") {
              param.custom = item.custom || false;
            }
            this.singleActionItem.interfaceDataConfig.paramsConfigs.push(param);
          });
        this.$forceUpdate();
        let interfaceName = res.data.processName;
        let obj = {
          label: interfaceName, // 依次判断数据接口、数据表、数据集
          value: {
            type: "customInterface",
            id: id,
            // data: res.data
          },
          children: [],
        };
        res.data.res &&
          res.data.res.forEach((rItem) => {
            let children = {
              label: rItem.name,
              value: {
                type: "customInterface",
                id: rItem.name,
                data: {
                  value: "",
                },
              },
            };
            obj.children.push(children);
          });
        this.$pageDataModelEngine.saveCustomInterfaceData(id, obj);
      });
    },

    // 获取接口数据入参
    queryProcessApiParamsService(id) {
      getProcessApiParamsService({ id }).then((res) => {
        let paramsList = res.data.params;
        paramsList &&
          paramsList.forEach((item) => {
            let param = {
              param_name: item.name,
            };
            this.singleActionItem.interfaceDataConfig.paramsConfigs.push(param);
          });
        this.$forceUpdate();
      });
    },
    queryProcessApiResService(id) {
      const data = {
        dataApiId: id,
        params: {},
      };
      getProcesseDataList(data).then((res) => {
        if (res.code === 0) {
          this.interfaceKeyList = [];

          // 2021-12-18 按照新逻辑 存取
          let interfaceName;
          this.interfaceApiAll.forEach((iItem) => {
            if (iItem.id == id) {
              interfaceName = iItem.name;
            }
          });
          let obj = {
            label: interfaceName, // 依次判断数据接口、数据表、数据集
            value: {
              type: "customInterface",
              id: id,
              // data: res.data
            },
            children: [],
          };
          for (const i in res.data) {
            this.interfaceKeyList.push(i);
            let paramValue = {
              type: "interface",
              operateApiId:
                this.singleActionItem.interfaceDataConfig.operateApiId,
            };
            let children = {
              label: i,
              value: {
                type: "customInterface",
                id: i,
                data: {
                  value: res.data[i],
                },
              },
            };
            obj.children.push(children);
          }
          this.$pageDataModelEngine.saveCustomInterfaceData(id, obj);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleHrefPage(reportId) {
      if (reportId) {
        const data = {
          reportId: reportId,
        };
        getReportDetail(data)
          .then((res) => {
            let data = res.data || {};
            // 上传组件存类型
            let configJson = JSON.parse(data.configJson || "{}");

            let paramList = configJson.config.pageParamsList;
            this.singleActionItem.interfaceDataConfig.hrefPageParams = [];
            paramList &&
              paramList.forEach((param) => {
                let data = {
                  operateHrefPageParamName: param.operateHrefPageParamName,
                };
                this.singleActionItem.interfaceDataConfig.hrefPageParams.push(
                  data
                );
              });
            this.$forceUpdate();
          })
          .catch(() => {
            // 上传组件失败存类型
            setStorage("subType", "");
          });
      } else {
        this.singleActionItem.interfaceDataConfig.hrefPageParams = [];
      }
    },

    chosenParam(item, radioItem) {
      item.param_value_type = radioItem.value;
      this.$forceUpdate();
    },
    saveActionSet(val) {
      this.singleActionItem.actionSet = val;
    },
    savePopupValue(val) {
      this.singleActionItem.popupBody = val;
    },
    change() {
      this.$forceUpdate(); // 偶尔输入不了
    },
    changeLink(tab, event) {
      if (this.singleActionItem.dynamic) {
        this.singleActionItem.linkDynamic = {};
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-del-btn {
  position: absolute;
  right: 5px;
  padding: 4px;
}
/deep/.el-collapse-item__header {
  padding-left: 20px;
}
/deep/.el-collapse-item__arrow {
  position: absolute;
  margin: 0;
  left: 0;
}

// 覆写el-label
.label-left /deep/.el-form-item__label {
  float: left;
  line-height: 52px;
}
.review-div {
  margin-top: 10px;
}
.link-div {
  display: flex;
  align-items: center;
}
.link-operator {
  font-size: 18px;
  margin-left: 10px;
}
/deep/.el-form-item--small .el-radio {
  margin-right: 10px;
  line-height: 52px !important;
}

// .codeSnippetTitle {
//   height: 30px;
//   line-height: 30px;
//   margin-bottom: 5px;
//   font-size: 14px;
//   font-weight: 500;
// }

// .codeSnippet {
//   cursor: pointer;
//   padding-left: 10px;
//   height: 30px;
//   line-height: 30px;
//   color: #1890ff;
// }

// .codeSnippet:hover {
//   background-color: #ede9f9;
// }
</style>
