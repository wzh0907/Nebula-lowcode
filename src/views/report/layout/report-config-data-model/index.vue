<template>
  <div>
    <!-- <span style="font-size:13px;color:#303133;font-weight:500">事件行为</span> -->
    <div style="text-align: center">
      <!-- <el-button size="small" @click="isShowNewEventFlowChart = !isShowNewEventFlowChart" style="margin-bottom: 10px;" v-if="!isShowNewEventFlowChart">显示事件流程图</el-button> -->
      <div
        class="event-div"
        @click="dataModelClick()"
        v-if="componentConfig.uuid == 1"
      >
        <i class="event-icon iconfont iconbiangengguanli" />
        创建数据模型
      </div>
    </div>
    <DataModelDialog
      :id="id"
      :dialog-visible.sync="dialogDataVisible"
      :componentUUIDList="componentUUIDList"
      :componentList="componentList"
      :title="'数据模型'"
      @onReloadView="onReloadView"
    />
  </div>
</template>

<script>
import { pickInputComponentList } from "@/views/report/utils/deal-component-data/transform-component-list";
import {
  coverBigComponent,
  dataRefreshComponents,
} from "@/views/report/utils/common-const";

import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";

import { EventBus } from "@/util/event-bus.js";
import DataModelDialog from "./dialog-module/data-model-dialog.vue";
export default {
  components: {
    DataModelDialog,
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    componentList: {
      type: Array,
      default: [],
    },
    componentConfig: {
      type: Object,
      default: {},
    },
    pageEventConfig: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogDataVisible: false,
      componentUUIDList: [],
      standComponentMap: {
        "van-design-field": "输入框",
      },
    };
  },
  /**
   * TODO::: 待优化  注释watch可能会有问题
   */
  watch: {},
  created() {},
  computed: {},
  methods: {
    onReloadView() {
      this.$emit("onReloadView");
    },
    dataModelClick() {
      this.filterInputComment();
      this.dialogDataVisible = true;
    },
    // 拿到过滤后的 input 组件
    filterInputComment() {
      let tempArr = [];
      this.pickInputComponentList(this.componentList, tempArr);
      this.componentUUIDList = tempArr;
      // 这边如果是默认的组件名称入输入框，则给他置空
      this.componentUUIDList &&
        this.componentUUIDList.forEach((cItem, cIndex) => {
          if (cItem.options.commonConfigAssignName == this.standComponentMap[cItem.type]) {
            cItem.options.commonConfigAssignName = "";
            this.$set(this.componentUUIDList, cIndex, cItem);
            this.$forceUpdate();
          }
        });
    },
    pickInputComponentList,
    // 接口查询

    componentDeepClone,
  },
};
</script>
<style scoped lang="scss">
/deep/.el-tabs__content {
  padding: 0 !important;
  margin: 0 !important;
}
.panel-del-btn {
  position: absolute;
  right: 5px;
  padding: 4px;
}

// 覆写el-label
.label-left /deep/.el-form-item__label {
  float: left;
}

.new-event-demo-wrap {
  position: fixed;
  top: 0px;
  right: 315px;
  z-index: 201;
  width: 100%;
  height: 100%;
  background-color: rgba(#000, 0.5);
}
.new-event-demo {
  // width: 100%;
  // height: 100%;
  width: 800px;
  height: 800px;
  position: absolute;
  right: 0;
  top: 138px;
  // position: fixed;
  // top: 0;
  // right: 0;
  // z-index: 201;
  // width: 550px;
  // height: 500px;
  // position: fixed;
  // top: 130px;
  // right: 315px;
  border-right: 1px solid #e0e0e0;
  background-color: #fff;
}
.event-div {
  display: flex;
  flex-direction: row;
  cursor: pointer;
  width: 88%;
  margin: 20px auto;
  align-items: center;
  color: #666;
  cursor: pointer;
  border: 1px solid #e5e6e8;
  border-radius: 6px;
  padding: 0 8px;
  height: 36px;
  &:hover {
    color: #409eff;
    border: 1px dashed #409eff;
  }
}
.event-icon {
  font-size: 12px;
  margin: 0 10px;
}
</style>
