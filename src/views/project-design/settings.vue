<template>
  <a-layout class="settings">
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
        class="settings-menu"
        mode="inline"
        :default-selected-keys="['projectSetting']"
      >
        <a-menu-item
          v-for="setting in settingList"
          :key="setting.dataType"
          @click="menuClick(setting)"
        >
          {{ setting.label }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content class="settings-content">
      <keep-alive>
        <settingIndex v-if="currentDataType === 'projectSetting'" />
        <workFlowSettingIndex v-if="currentDataType === 'workflowSetting'" />
        <jobIndex v-if="currentDataType === 'job'" />
        <workFlowList v-if="currentDataType === 'workflowList'" />
        <branchSetting  v-has="'report:showConfig'" v-if="currentDataType === 'branch'" @toMerge="toMerge" />
        <branchMerge  v-has="'report:showConfig'" v-if="currentDataType === 'branchMerge'" />
        <systemSettingIndex v-if="currentDataType === 'systemSetting'" />
        <dataDicIndex v-if="currentDataType === 'dataDic'" />
      </keep-alive>
    </a-layout-content>
  </a-layout>
</template>
<script>
import settingIndex from "@/views/project/setting/index.vue";
import workFlowSettingIndex from "@/views/workflow/setting/index.vue";
import jobIndex from "@/views/job/index.vue";
import workFlowList from "@/views/workflow/list/index.vue";
import branchSetting from "@/views/project/branch/index.vue";
import branchMerge from "@/views/project/branch/merge-list.vue";
import systemSettingIndex from "@/views/system-setting/index.vue";
import dataDicIndex from "@/views/data-dic/index.vue";
export default {
  name: "settingTree",
  components: {
    settingIndex,
    workFlowSettingIndex,
    jobIndex,
    workFlowList,
    branchSetting,
    branchMerge,
    systemSettingIndex,
    dataDicIndex,
  },
  props: ["projectType", "currentMenuId", "drawerVisible"],
  data() {
    return {
      settingList: [
        {
          label: "基础信息",
          dataType: "projectSetting",
        },
        {
          label: "系统数据",
          dataType: "workflowSetting",
        },
        {
          label: "工作流列表",
          dataType: "workflowList",
        },
        {
          label: "定时任务",
          dataType: "job",
        },
        {
          label: "分支管理",
          dataType: "branch",
        },
        {
          label: "系统参数",
          dataType: "systemSetting",
        },
        {
          label: "数据字典",
          dataType: "dataDic",
        },
      ],
      currentDataType: "projectSetting",
    };
  },
  methods: {
    menuClick(data) {
      this.currentDataType = data.dataType;
    },
    toMerge(){
      this.currentDataType = "branchMerge";
    }
  },
};
</script>

<style lang="scss" scoped>
.settings {
  height: 100%;
  margin: 15px;
  padding: 24px 0;
  background: #fff;
  box-sizing: border-box;
  /deep/.ant-menu:before {
    display: none;
  }

  &-menu {
    height: 100%;

    .el-icon-menu {
      margin-right: 5px;
    }
  }

  &-content {
    padding: 0 24px;
  }
}
</style>
