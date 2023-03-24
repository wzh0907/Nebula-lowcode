<template>
  <div class="antd_upload_img">
    <template>
      <a-timeline>
        <a-timeline-item
          v-for="(logItem, logIndex) in options.logList"
          :key="logIndex"
          :color="logItem.status == '0' ? 'gray' : 'blue'"
        >
          <p>{{ logItem.approvedDay }}</p>
          <div>
            <span class="workflow-title">{{ logItem.title }}</span>
            <a-row class="workflow-content">
              <!-- <a-avatar
                src="https://localhost:40518/platform/api/images/wII0Za2qY6ie1XGw.png"
                :size="44"
              /> -->
              <div>
                <span class="workflow-content-name">{{
                  logItem.approvedUser || logItem.pendingUser
                }}</span>
                <span class="workflow-content-log">{{ logItem.advice }}</span>
              </div>
            </a-row>
          </div>
        </a-timeline-item>
        <!-- <a-timeline-item>
          <p>2022-12-04</p>
          <div>
            <span class="workflow-title">工作表事件触发</span>
            <a-row class="workflow-content">
              <a-avatar
                src="https://localhost:40518/platform/api/images/wII0Za2qY6ie1XGw.png"
                :size="44"
              />
              <div>
                <span class="workflow-content-name">陆宇清</span>
                <span class="workflow-content-log">新增或更新记录</span>
              </div>
            </a-row>
          </div>
        </a-timeline-item>
        <a-timeline-item
          >Solve initial network problems 2015-09-01</a-timeline-item
        >
        <a-timeline-item>Technical testing 2015-09-01</a-timeline-item>
        <a-timeline-item
          >Network problems being solved 2015-09-01</a-timeline-item
        >-->
      </a-timeline>
      <a-row><span style="font-weight: blod">审核意见</span></a-row>
      <a-row>
        <a-textarea
          v-model="options.value"
          placeholder="审批意见"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-row>
      <a-row>
        <a-button type="primary" style="margin: 10px" @click="flowApprove">
          同意
        </a-button>
        <a-button type="primary" style="margin: 10px" @click="flowReject">
          拒绝
        </a-button>
        <a-button style="margin: 10px"> 回退 </a-button>
      </a-row>
    </template>
  </div>
</template>

<script>
import optionsConfig from "./options-config";
import { getWorkFlowLogList, workFlowApprove } from "@/api/workflow/index";
import { getProcesseDataList } from "@/api/chartsData";
import {
  saveVariable,
  getVariable,
} from "@/views/report/utils/deal-global-variable/globalUtils";
export default {
  name: "timelineTemplate",
  data() {
    return {
      options: optionsConfig,
      logList: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getLogList();
  },
  mounted() {},
  methods: {
    getLogList() {
      let varDataObj = this.$pageDataModelEngine.getCustomData();

      let paramValue = this.getActionValue(
        this.options.logIdConfig,
        varDataObj,
        this
      );
      let workflowIdValue = this.getActionValue(
        this.options.workflowIdConfig,
        varDataObj,
        this
      );
      this.options.logId = paramValue;
      this.options.workflowId = workflowIdValue;
      let param = {
        logId: paramValue,
        workflowId: workflowIdValue,
      };
      getWorkFlowLogList(param).then((res) => {
        this.options.logList = res.dataList;
      });
    },
    flowApprove() {
      this.callFlow("同意");
    },
    flowReject() {
      this.callFlow("拒绝");
    },
    callFlow(result) {
      let param = {
        logId: this.options.logId,
        workflowId: this.options.workflowId,
        approvedResult: result,
        advice: this.options.value,
      };
      workFlowApprove(param).then((res) => {
        this.$antdMessage.success(res.data.msg);
        if (res.data.isEnd) {
          if (res.data.approveResult == "同意") {
            this.callInterface(this.options.approveConfig);
          } else if (res.data.approveResult == "拒绝") {
            this.callInterface(this.options.rejectConfig);
          }
        }
        // 刷新loglist
        this.getLogList();
      });
    },
    callInterface(config) {
      let varDataObj = this.$pageDataModelEngine.getCustomData();
      let operateApiId = config.operateApiId;
      let paramsConfigs = config.paramsConfigs;
      let params = {};
      paramsConfigs.forEach((paramItem) => {
        let paramValue = this.getActionValue(paramItem, varDataObj, this);
        params[paramItem.param_name] = paramValue; // TODO::: 待优化，要通过uuid遍历实时获取
      });
      const data = {
        dataApiId: operateApiId,
        params,
      };
      getProcesseDataList(data)
        .then((res) => {
          if (res.code === 0) {
            // 2021-12-18 按照新逻辑 存取
          }
        })
        .catch(() => {});
    },
    getActionValue(paramsConfig, varDataObj, vm) {
      let paramValue = "";
      let relevanceComponentUuid = paramsConfig.relevanceComponentUuid;
      let param_value_type = paramsConfig.param_value_type;
      if (param_value_type === "V") {
        if (paramsConfig.type == "customInterface") {
          // let customInterfaceData =
          //   vm.vm.$pageDataModelEngine.getCustomInterfaceData(
          //     paramsConfig.operateApiId
          //   );
          // if (customInterfaceData) {
          //   paramValue =
          //     customInterfaceData.value.data[paramsConfig.param_v_key];
          // } else {
          //   paramValue = paramsConfig.param_value;
          // }
        } else if (paramsConfig.param_v_key) {
          // 默认使用param_value
          paramValue = varDataObj[paramsConfig.param_v_key];
        }
      } else if (param_value_type === "B") {
        // 绑定值
        paramValue = paramsConfig.param_value;
      } else if (param_value_type === "G") {
        paramValue = getVariable(paramsConfig.middle, paramsConfig.param_v_key);
      } else {
        //T  todo
      }
      return paramValue;
    },
  },
};
</script>

<style lang="scss">
.workflow-title {
  font-weight: bold;
}
.workflow-content {
  display: flex;
  margin-top: 10px;
}
.workflow-content-name {
  display: block;
}
</style>
