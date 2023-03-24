<template>
  <!--  决策组件  -->
  <div class="group-wrap">
    <div class="group-content">
      <el-form ref="connectorForm" label-width="70px" label-position="left">
        <el-form-item prop="name" label="节点名称"> 
          <el-input v-model="showName" placeholder="请输入"></el-input>
        </el-form-item>
        <draggable
          :list="attributeList"
          class="menu-item-wrap"
          handle=".handle"
          tag="ul"
        >
          <li
            v-for="(attributeItem, attributeIndex) in attributeList"
            :key="attributeIndex"
          >
            <div class="menu-item-li">
              <i class="iconfont iconprojectmenu handle"></i>
              <div style="width: 90%; display: flex; flex-warp: nowarp">
                <el-input v-model="attributeItem.name"></el-input>
              </div>
              <i
                class="el-icon-delete tree-item-operator"
                style="cursor: pointer"
                @click="delRouteBy(attributeIndex)"
              ></i>
            </div>
          </li>
        </draggable>
        <div class="opt-add-btn" @click="addNewRoute">
          <icon class="iconfont iconjiahao1"></icon>
          添加类型
        </div>
      </el-form>
      <h3 style="margin-top: 20px">备注</h3>
      <el-input
        v-model="remark"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 15 }"
        placeholder="Enter something..."
      />
    </div>
  </div>
</template>

<script>
import VarSelect from "./module/variable-selectV4";
import Draggable from "vuedraggable";
import { mapActions } from "vuex";
export default {
  name: "drag-drawer-if",
  components: {
    VarSelect,
    Draggable,
  },
  props: ["flow", "curDiagram", "processId"],
  data() {
    return {
      showName: "",
      op: "",
      modal1: false,
      //        modal2: false,
      firstData: {},
      secondData: {},
      firstString: "",
      secondString: "",
      num: 0,
      startArgs: [],
      remark: "",
      attributeList: [],
    };
  },
  mounted() {
    this.attributeList = [];
    this.startArgs = this.flow.getArgs();
    var properties = JSON.parse(
      JSON.stringify(this.curDiagram.getProperties())
    );
    //      if(properties.arguments){
    //        this.startGroup = properties.arguments
    //      }
    //      left_value: this.firstData,
    //        op: this.op,
    //        right_value: this.secondData
    //      this.firstData =  properties.left_value
    this.showName = this.curDiagram.title || "";
    this.remark = properties.remark;
    var exceptions = properties.exceptions || [];
    this.attributeList = exceptions;
  },
  methods: {
    saveVarEdit(varList) {
      this.$emit("submitVarList", varList);
    },

    // 模态框确定按钮触发事件

    // 属性列表删除项
    propertyDelete(index) {
      this.attributeList.splice(index, 1);
    },
    addNewRoute() {
      let c = this.attributeList.length;
      this.attributeList.push({
        name: "",
       
      });
 
    },
    delRouteBy(index){
      this.attributeList.splice(index,1);
    },
    saveConfig() {
      // let configJson = {
      //   left_value: this.firstData,
      //   op: this.op,
      //   right_value: this.secondData
      // }
      let configJson = {
        title: this.showName,
        remark: this.remark,
        exceptions: this.attributeList,
      };
      this.$emit("arguments", configJson);
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped lang="less">
.mt10 {
  margin-top: 10px;
}

.mr10 {
  margin-right: 10px;
}

ul li {
  list-style-type: none;
}

.spp-box-list {
  position: relative;
  border: 1px solid #d6d6d6;
  /*padding:0 10px 10px 10px;*/
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden;
  /*padding-top:28px;*/
}

/*.spp-title{*/
/*position: absolute;top:0;left:0; background: #e5e5e5;padding: 5px 10px;*/
/*width:calc(100%);*/
/*}*/
.routeByList {
  width: 100%;
  line-height: 28px;
}

.routeByList li {
  /*width:100%;*/
  padding: 0 10px;
}

.ivu-form-item {
  margin-bottom: 10px;
}

.route-title1 {
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e1e1e1;
}

.routeBy-form {
  margin-top: 10px;
}

.group-wrap {
  position: relative;
  /* height: 100%; */
  height: calc(100vh - 100px);
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

.group-content {
  /*margin-bottom: 10px;*/
  height: calc(100% - 30px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
}

.routeByChecked {
  background-color: #5a6268;
  color: white;
}

.group-btns .btn {
  margin-right: 15px;
}

// ----------------- draggable 样式--------------------------
.data-warp {
  /deep/ .el-input--suffix {
    width: 100%;
  }

  /deep/ .el-input {
    //width: 100%;
  }

  /deep/ .el-select {
    width: 100%;
  }
}

.mt10 {
  margin-top: 10px;
}

.mr10 {
  margin-right: 10px;
}

ul li {
}

.menu-item-li {
  margin: 5px 0px 0px 0px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 5px 10px;

  .handle {
    margin: 5px;
    line-height: 28px;
    cursor: pointer;
  }
}

.menu-item-select {
  /deep/ .el-cascader .el-input .el-input__inner {
    height: 30px;
  }
}

.form-input {
  margin-top: 5px;
  margin-left: 5px;

  /deep/ .el-input--suffix .el-input__inner {
    height: 30px;
  }
}

.menu-item-wrap {
  position: relative;

  ul {
    width: 90%;
    margin: auto;
    display: flex;
    background-color: #fff;
    box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    padding: 10px;
    z-index: 1;
  }

  ul li {
    position: relative;
    list-style-type: none;
    padding: 5px 10px;
    color: #fff;
    background-color: #0862ea;
    border-radius: 5px;
    margin: 2px 5px;
    cursor: pointer;
    font-size: 12px;
  }
}

.spp-box-list {
  position: relative;
  border: 1px solid #d6d6d6;
  /*padding:0 10px 10px 10px;*/
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden;
  /*padding-top:28px;*/
}

/*.spp-title{*/
/*position: absolute;top:0;left:0; background: #e5e5e5;padding: 5px 10px;*/
/*width:calc(100%);*/
/*}*/
.routeByList {
  width: 100%;
  line-height: 28px;
}

.ivu-form-item {
  margin-bottom: 10px;
}

.route-title1 {
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e1e1e1;
}

.routeBy-form {
  margin-top: 10px;
}

.group-wrap {
  position: relative;
  // height: 100%;
  height: calc(100vh - 100px);
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

.group-content {
  /*margin-bottom: 10px;*/
  height: calc(~"100% - 30px");
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
}

.routeByChecked {
  background-color: #5a6268;
  color: white;
}

.group-btns .btn {
  margin-right: 15px;
}

.func-select {
  width: 50%;
}

.new-func-select {
  width: 100%;
}

/deep/ .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .ivu-select-group {
  display: flex;
  flex-wrap: wrap;
}

/deep/ .el-tree-node__content {
  height: 72px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
}

.tree-item-text-wrap {
  max-height: 72px;
}

.tree-item {
  display: flex;
}

.tree-item-text {
  line-height: 40px;
  white-space: nowrap;
  padding: 0px 5px;
}

.tree-item-operator {
  font-size: 28px;
  line-height: 40px;
  padding: 0px 5px;
}

.tree-item-func {
  white-space: nowrap;
  padding: 0px 10px;
  border-radius: 5px;
  color: #fff;
  line-height: 30px;
  margin: 5px;
  background-color: #0862ea;
}

.menu-item-li {
  z-index: 2;
  position: relative;
  background-color: #fff;
  display: flex;
  height: 50px;
}
</style>
