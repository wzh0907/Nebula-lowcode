<template>
  <div class="preview-wrap">
    <el-dialog
      :title="title"
      style="padding: 50px;"
      :before-close="handleClose"
      :visible.sync="isShowDialog"
      @open="dialogOpen"
    >
      <div class="content-wrap" v-if="isShowDialog && componentList.length">
        <GenerateComponentPc isDesignModel :componentConfigList="componentList" :subpageList="subpageList" :globalConfig="globalConfig" :pageEventConfig="pageEventConfig" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'IconDialog',
  props: {
    title: String,
    dialogVisible: {
      type: Boolean,
      default: false
    },
    componentList: {
      type: Array,
      default: []
    },
    subpageList: {
      type: Array,
      default: []
    },
    globalConfig: {
      type: Object,
      default: {}
    },
    pageEventConfig:{
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      previewComponentList: []
    }
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  created() {},
  methods: {
    initData() {},
    handleClose() {
      this.isShowDialog = false
      /**
       * 2022-01-28 由于数据引擎 在 页面跳转之类的事件之后，会将interface替换成别的页面的接口，所以在预览弹窗关闭的时候
       * 做一个临时处理 重新清空处理下 interface,
       * 原则上是应该隔离 编辑端和预览端的数据的，不过这边还没处理好数据引擎的 并行方案
       *  
       **/ 
      
      this.$pageDataModelEngine.clearModelDataPool()
      let interfaceDataConfig = this.globalConfig.interfaceDataConfig || []
      interfaceDataConfig.forEach(item => {
        this.$pageDataModelEngine.saveInterfaceData(item)
      })
      this.$pageDataModelEngine.clearComponentData();
      this.componentList.forEach((item, index) => {
       this.$pageDataModelEngine.saveComponentData(item.uuid, item);
      });
    },
    dialogOpen() {
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.content-wrap {
  height: 100%;
  padding-top: 20px;
  overflow-y: auto;
}
/deep/.el-dialog {
  margin-top: 0 !important;
  width: 100%;
  height: 100%;
}
/deep/.el-dialog__body {
  height: 100%;
  padding:0px;
  // padding-top: 20px;
}
</style>
