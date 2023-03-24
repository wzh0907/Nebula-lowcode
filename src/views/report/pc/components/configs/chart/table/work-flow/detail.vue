<template>
  <div>
    <a-drawer
      title="详情"
      placement="right"
      :closable="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
    >
      <a-steps progress-dot :current="nodeList.length" direction="vertical">
        <a-step
          v-for="(node, key) in nodeList"
          :key="key"
          :title="node.title"
          :description="node.content"
        />
      </a-steps>
    </a-drawer>
  </div>
</template>
<script>
import axios from "axios";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detailParams: {
      type: Object,
    },
  },
  data() {
    return {
      //   visible: false,
      nodeList: [],
    };
  },
  methods: {
    afterVisibleChange(val) {
      console.log("visible", val);
      if (val) {
        // 调用detail接口
        this.getDetail();
      }
    },
    getDetail() {
      axios
        .post(
          "https://localhost:40518/platform/api/work/flow/detail",
          // "http://localhost:40518/platform/api/work/flow/detail",
          this.detailParams,
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
          if (res.data.code == 0) {
            this.nodeList = res.data.dataList;
          }
        });
    },
    showDrawer() {
      // this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
  },
};
</script>
