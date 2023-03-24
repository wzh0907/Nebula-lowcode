<template>
    <el-input size="small" v-model="confirmValue" >
        <i slot="suffix" class="el-input__icon iconfont iconjiahao1" @click="confirmVar(node)"></i>
    </el-input>
</template>

<script>
export default {
  name: "varConfirm",
  props: {
    node: {
      type: Object,
    },
  },
  data() {
    return {
      confirmValue: "",
    };
  },
  mounted() {},
  methods: {
    confirmVar(node) {
      if(!this.confirmValue){
         this.$message.error("空值不能创建", 1);
        return false
      }
      let path = node.path;
      let pathNodes = node.pathNodes;
      let param = {
        name: this.confirmValue,
        parentName: path[0],
        value: this.confirmValue,
        type: 0,
        defaultVal: this.confirmValue,
        label: this.confirmValue,
      };
      if (pathNodes[0].data.ctype === "connectorV4") {
        param.type = 5;
        if (path.length > 2) {
          param.row = path[1];
        } else {
          param.row = path[1];
          param.value = "";
          param.name = "";
        }
      } else if (
        pathNodes[0].data.name == "变量" &&
        pathNodes[0].data.type == 4
      ) {
        param.type = path[1];
        param.value = "";
        param.name = this.confirmValue;
      } else if (pathNodes[0].data.name == "数值") {
        if (this.isNumber(param.value)) {
          param.type = 1;
        }
      }
      this.$emit("confirmVar", param);
    },
    isNumber(val) {
     var isnum = /^\d+$/.test(val);
     return isnum;
    },
  },
};
</script>

<style scoped lang="scss">
</style>
