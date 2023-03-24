<template>
  <!--  结束  -->
  <div class="group-wrap">
    <!-- <p
      class="group-text"
    >停止组件提供了终止当前流程路径的数据加工能力。此组件表示流程路径的终点，流程不再继续进入下一个节点，主流程将进入其他路径继续执行。该组件也可以用于流程处理进入异常状态，终止并退出整个流程 </p> -->
    <div class="group-content">
      <div>结束流程后，是否进行：</div>
      <el-radio-group v-model="exit_process">
        <el-radio  label="exit_loop" class="end-check">退出本次循环</el-radio >
        <el-radio  label="exit_all_loop" class="end-check">退出整个循环</el-radio >
        <el-radio  label="exit_process" class="end-check">退出整个流程</el-radio >
      </el-radio-group>
    </div>
    <!-- <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem" >删除</el-button>
        <el-button class="btn btns-save" type="primary" @click="saveConfig">保存</el-button>
      </el-row>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "drag-drawer-stop",
  props: ["curDiagram"],
  data() {
    return {
      exit_process: '',
    };
  },
  mounted() {
    var properties = JSON.parse(JSON.stringify(this.curDiagram.getProperties()));
    if (properties.exit_process) {
      this.exit_process = properties.exit_process;
    }
  },
  methods: {
    saveConfig() {
      let data = {
        exit_process: this.exit_process
      };
      this.$emit("arguments", data);
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    }
  }
};
</script>

<style scoped>
.group-wrap {
  position: relative;
  height: 100%;
}
.group-btns {
  border-top: 1px solid #dadada;
  background-color: white;
  position: absolute;
  padding-left: 15px;
  bottom: 0;
  left: 0;
  width: 100%;
}
.group-btns .btn {
  margin-right: 15px;
}
.group-content {
  height: calc(100% - 30px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
}
.end-check{
  display: block;
  margin-top: 5px;
}
</style>
