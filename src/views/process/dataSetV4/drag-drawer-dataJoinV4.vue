<template>
  <!--  数据连接器  -->
  <div class="data-join-wrap">
    <div class="group-content">
      <el-form
        :model="dataJoinItem"
        :rules="opRule"
        ref="dataJoinForm"
        label-width="80px"
        label-position="left"
      >
        <el-form-item prop="name" label="节点名称">
          <el-input v-model="showName"></el-input>
        </el-form-item>
        <h3 style="margin-top: 20px">数据集</h3>
        <div style="display: flex">
          <VarSelect
            :processId="processId"
            key="dataJoin-leftValue"
            :data="dataJoinItem.left"
            type="leftValue"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
          <el-select
            v-model="dataJoinItem.connectType"
            class="menu-item-select-middle"
          >
            <el-option label="左连接" value="left"></el-option>
            <el-option label="右连接" value="right"></el-option>
            <el-option label="内连接" value="inner"></el-option>
          </el-select>
          <VarSelect
            :processId="processId"
            key="dataJoin-rightValue"
            :data="dataJoinItem.right"
            type="rightValue"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </div>
        <h3 style="margin-top: 20px">条件</h3>
        <div
          class="condition-list-item"
          v-for="(conditionItem, cKey) in dataJoinItem.condition"
          :key="cKey"
        >
          <el-input
            v-model="conditionItem.left_field"
            placeholder="左侧字段名"
            style="width: 220px; line-height: 40px; margin: 0 5px"
          />
          <span class="condition-middle" style="">=</span>
          
          <el-input
            v-model="conditionItem.right_field"
            placeholder="右侧字段名"
            style="width: 220px; line-height: 40px; margin: 0 5px"
          />
          <i
            class="el-icon-delete tree-item-operator"
            style="cursor: pointer"
            @click="delCondition(cKey)"
          ></i>
        </div>
        <div class="opt-add-btn" @click="addNewCondition">
          <i class="iconfont iconjiahao1"></i>
          添加条件
        </div>
      </el-form>
      <h3 style="margin-top: 20px">备注</h3>
      <el-input
        v-model="dataJoinItem.remark"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 15 }"
        placeholder="Enter something..."
      />
    </div>
  </div>
</template>

<script>
import VarSelect from "../module/variable-selectV4";
import CodeEditor from "@/components/CodeEditor";

export default {
  name: "drag-drawer-dataJoinV4",
  components: {
    VarSelect,
    CodeEditor,
  },
  props: {
    curDiagram: {
      type: Object,
    },
    processId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showName: "",
      dataJoinItem: {
        name: "",
        remark: "",
        connectType: "",
        left: {
          category: "",
          name: "",
          type: 0,
          value: "",
        },
        right: {
          category: "",
          name: "",
          type: 0,
          value: "",
        },
        condition: [],
      },
      opRule: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      merchantId: 0,
      projectId: 0,
      //        startArgs:[]
    };
  },
  mounted() {
    var self = this;

    var properties = JSON.parse(
      JSON.stringify(this.curDiagram.getProperties())
    );
    console.log(properties, "properties");
    this.showName = this.curDiagram.title;
    this.dataJoinItem = {
      title: properties.title || "",
      id: properties.id,
      remark: properties.remark,
      left: properties.left || {},
      right: properties.right || {},
      condition: properties.condition || [],
      connectType: properties.connectType || "inner",
    };

    this.dataJoinItem.name = this.curDiagram.title;
    console.log(this.dataJoinItem, "this.dataJoinItem");
    this.merchantId = this.$store.getters.merchantId;
    this.projectId = this.$store.getters.projectId;

    // getVariableList(this.processId, 1, 999).then(res => {
    //   if (res.data.code == 0) {
    //     this.variableList = res.data.data;
    //     this.varMap = new Map();
    //     this.variableList.forEach(item => {
    //       this.varMap.set(item.name, JSON.parse(item.variables));
    //     });
    //   }
    // });
    //      this.startArgs = this.flow.getArgs()
  },
  methods: {
    // ...mapActions(["getVariableList"]),
    setVar(param, type) {
      if (type) {
        let tList = type.split("-");
        console.log("setVar", tList);
        if (tList[0] == "leftValue") {
          this.dataJoinItem.left = {};
          this.dataJoinItem.left = param;
        } else if (tList[0] == "rightValue") {
          this.dataJoinItem.right = {};
          this.dataJoinItem.right = param;
        }
      }
    },
    saveVarEdit(varList) {
      this.$emit("submitVarList", varList);
    },
    select(index) {
      this.editNum = index;
    },

    addNewCondition() {
      console.log("add", this.dataJoinItem);
      this.dataJoinItem.condition.push({
        left_field: "",
        right_field: "",
      });
    },
    delCondition(conIndex) {
      this.dataJoinItem.condition.splice(conIndex, 1);
    },

   
    // 模态框取消按钮触发事件
    cancel() {
      // this.$Message.info('Clicked cancel');
    },

    saveConfig(name) {
      var self = this;
      // this.$refs[name].validate((valid) => {
      //   if (valid) {
      //     // let configJson = this.dataJoinItem;
      //     // configJson.title = this.showName;
      //     // if (
      //     //   this.dataJoinItem.opType != "query" &&
      //     //   this.dataJoinItem.opType != "diy"
      //     // ) {
      //     //   delete configJson.target;
      //     // }
      //     // console.log(configJson, "configJson");

      //     // this.$emit("arguments", configJson);
      //   } else {
      //     this.$Message.error("请选择数据操作");
      //   }
      // });
      let configJson = this.dataJoinItem;
      configJson.title = this.showName;

      console.log(configJson, "configJson");

      this.$emit("arguments", configJson);
    },
    
    cancel() {
      this.$emit("cancel");
    },
  },

  watch: {},
};
</script>

<style scoped lang="less">
.mt10 {
  margin-top: 10px;
}
ul li {
  list-style-type: none;
}
.spp-box-list {
  border: 1px solid #d6d6d6;
  /*padding: 10px;*/
  border-radius: 5px;
  margin-top: 10px;
  min-height: 100px;
}
.spp-box-list li.atrItem:hover {
  background-color: #f6f6f6;
}
.spp-box-list li {
  cursor: pointer;
  line-height: 24px;
  padding: 0 5px;
}
.activeRow {
  background: #e5e5e5;
}
.data-join-wrap {
  position: relative;
  height: 100%;
  .el-select{
  width: 90px;
}
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
.param-btns {
  margin-top: 10px;
}
.param-btns .icon {
  margin-right: 10px;
}
.group-btns .btn {
  margin-right: 15px;
}
.data-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.data-option-name {
  font-weight: bold;
}
.data-option-dir {
  margin-top: 5px;
}
.condition-type-div {
  display: flex;
}
.condition-type-div div {
  border: 1px solid #000;
  border-radius: 5px;
  padding: 0px 15px;
  margin-right: 15px;
  cursor: pointer;
}
.chosen-type {
  background-color: #2d8cf0;
  border: 1px solid #2d8cf0;
  color: #fff;
}

/deep/.menu-item-select-middle {
  margin: 0px 10px;
  width: 90px;
}
.menu-item-select-middle {
  /deep/.el-input {
   width: 90px;
  }
}
.tree-item-operator {
  font-size: 28px;
  line-height: 40px;
  padding: 0px 5px;
}
.condition-list-item {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
.condition-middle{
  width: 95px;
  text-align: center;
  font-size: 22px;
}
</style>
