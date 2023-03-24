<template>
  <div class="uploadComment">
    <a-modal
      v-model="dialogVisible"
      :title="workFlowParams.title"
      :closable="false"
      :maskClosable="true"
      @ok="handleOk"
      @cancel="afterClose"
    >
      <div style="overflow-x: hidden; overflow-y: scroll">
        <div v-if="!workFlowParams.status">确认发起本申请的审批流程吗？</div>
        <div v-else-if="workFlowParams.status == '审核否决'">
          确认重新发起审批流程吗？
        </div>
        <div v-else-if="workFlowParams.status == '待审核'">
          审核意见
          <a-textarea
            v-model="workFlowParams.reviewAdvice"
            placeholder="请输入审核意见"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            @change="change"
          />
        </div>
      </div>
      <template slot="footer" v-if="!workFlowParams.status">
        <a-button type="primary" @click="handleOk"> 确认 </a-button>
        <a-button key="back" @click="handleClose"> 取消 </a-button>
      </template>
      <!-- 重新发起 -->
      <template slot="footer" v-else-if="workFlowParams.status == '审核否决'">
        <a-button type="primary" :loading="loading" @click="handleReStart">
          确认
        </a-button>
        <a-button key="back" @click="handleClose"> 取消 </a-button>
      </template>
      <template slot="footer" v-else-if="workFlowParams.status == '待审核'">
        <a-button type="primary" @click="handleReview"> 同意 </a-button>
        <a-button type="primary" @click="handleReject"> 拒绝 </a-button>
        <a-button key="back" @click="handleClose"> 回退 </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "preview",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    workFlowParams: {
      type: Object,
    },
  },
  components: {},
  data() {
    return {
      loading: false,
      componentsConfigs,
    };
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  watch: {},
  created() {},
  methods: {
    afterClose() {
      this.$emit("onCloseDialog");
    },
    dialogOpen() {},
    change() {
      this.$forceUpdate(); // 偶尔输入不了
    },
    handleReject() {
      this.workFlowParams.reviewResult = "否决";
      this.handleOk();
    },
    handleReview() {
      this.workFlowParams.reviewResult = "通过";
      this.handleOk();
    },
    handleReStart() {
      this.workFlowParams.status = "重新发起";
      this.handleOk();
    },
    handleOk() {
      let status = this.workFlowParams.status;
      axios
        .post(
          "https://localhost:40518/platform/api/work/flow/review",
          // "http://localhost:40518/platform/api/work/flow/review",
          this.workFlowParams,
          {
            headers: {
              "content-type": "application/json",
              "X-AUTH-TOKEN": getStorage("token"), //token换成从缓存获取
              "X-AUTH-KEY": getStorage("phoneNumber"),
              "X-PROJECT-ID": getStorage("projectId"),
              "X-MERCHANT-ID": getStorage("merchantId"),
              "X-AUTH-SOURCE": "PORTAL_PC",
            },
          }
        )
        .then((res) => {
          if (status == "待审核") {
            this.$antdMessage.success(this.workFlowParams.reviewResult);
          } else {
            this.$antdMessage.success("发起成功");
          }
          // TODO 刷新组件
          this.dialogVisible = false;
          this.afterClose();
        });
    },
    handleClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
