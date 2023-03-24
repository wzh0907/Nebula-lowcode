<template>
  <div
    style="padding-top: 10px"
    v-if="actionItem.actionType === 'event-operate-dialog-box'"
  >
    <el-select v-model="actionItem.popupPosition" placeholder="请选择">
      <el-option
        v-for="(item, key) in [
          { label: '对话框', value: 'center' },
          { label: '右侧弹框', value: 'right' },
          { label: '左侧弹框', value: 'left' },
          { label: '底部弹框', value: 'bottom' },
          { label: '顶部弹框', value: 'top' },
        ]"
        :key="key"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <div style="padding-top: 10px">
      <el-cascader
        v-model="actionItem.operateHrefPageId"
        :show-all-levels="false"
        :options="hrefPageList"
        :props="{ value: 'queryId', label: 'name', emitPath: false }"
        @change="handleHrefPage"
      >
      </el-cascader>
      <div style="padding-top: 10px">
        参数配置
        <actionHrefView :actionItem="actionItem" :varDataObj="varDataObj" />
      </div>
    </div>
    <div style="padding-top: 10px" v-if="actionItem.popupPosition === 'center'">
      <span style="margin-right: 10px">标题</span>
      <el-input v-model="actionItem.popupTitle" style="width: 79%"></el-input>
    </div>
    <div style="padding-top: 10px" v-if="actionItem.popupPosition === 'center'">
      <span style="margin-right: 10px">宽/高</span>
      <el-input v-model="actionItem.popupWidth" size="small" style="width: 25%"></el-input>
      <span style="margin-right: 10px; margin-left: 5px">%</span>
<!--      <span style="margin: 0px 10px">高度</span>-->
      <el-input v-model="actionItem.popupHeight" size="small" style="width: 25%"></el-input>
      <span style="margin-right: 10px; margin-left: 5px">%</span>
    </div>
    <div
      style="padding-top: 10px"
      v-if="['left', 'right'].indexOf(actionItem.popupPosition) !== -1"
    >
      <span style="margin-right: 10px">宽度</span>
      <el-input v-model="actionItem.popupWidth" style="width: 55%"></el-input>
      <span style="margin-right: 10px; margin-left: 5px">%</span>
    </div>
    <div
      style="padding-top: 10px"
      v-if="['top', 'bottom'].indexOf(actionItem.popupPosition) !== -1"
    >
      <span style="margin-right: 10px">高度</span>
      <el-input v-model="actionItem.popupHeight" style="width: 55%"></el-input>
      <span style="margin-right: 10px; margin-left: 5px">%</span>
    </div>
  </div>
</template>

<script>
// operateHrefPageParamType
import actionHrefView from "./action-href.vue";
export default {
  name: "action-href",
  components: {
    actionHrefView,
  },
  data() {
    return {
      paramsActiveNames: "",
    };
  },
  props: {
    actionItem: {
      type: Object,
      default: () => {},
    },
    hrefPageList: {
      type: Array,
      default: () => [],
    },
    varDataObj: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    handleHrefPage(reportId) {
      this.$emit("handleHrefPage", reportId);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
