<template>
  <!--  数据连接器  -->
  <div class="data-join-wrap">
    <div class="group-content">
      <el-form
        :model="dataInsertItem"
        :rules="opRule"
        ref="dataJoinForm"
        label-width="80px"
        label-position="left"
      >
        <el-form-item prop="name" label="节点名称">
          <el-input v-model="showName"></el-input>
        </el-form-item>
        <el-form-item label="工作流ID" prop="connection_dbConfigId">
          <VarSelect
            :processId="processId"
            key="workflow-start-workflowId"
            :data="dataInsertItem.workflowId"
            type="workflowId-"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </el-form-item>
        <el-form-item label="记录ID">
          <VarSelect
            :processId="processId"
            key="workflow-start-logId"
            :data="dataInsertItem.logId"
            type="logId-"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </el-form-item>
      </el-form>
      <h3 style="margin-top: 20px">备注</h3>
      <el-input
        v-model="dataInsertItem.remark"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 15 }"
        placeholder="Enter something..."
      />
    </div>
  </div>
</template>

<script>
import VarSelect from "../module/variable-selectV4";
export default {
  name: "drag-drawer-flowStart",
  components: { VarSelect },
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
      dataInsertItem: {
        name: "",
        remark: "",
        workflowId: {
          category: "",
          name: "",
          type: 0,
          value: "",
        },
        logId: {
          category: "",
          name: "",
          type: 0,
          value: "",
        },
      },
      opRule: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      dataSourceList: [],
      merchantId: 0,
      projectId: 0,
      sql: "",
      editorHeight: "200px",
      editorOptions: {
        showGutter: false,
      },
      //        startArgs:[]
    };
  },
  watch: {
    "dataInsertItem.sql"(val) {
      this.sqlAnalysis(val);
    },
  },
  mounted() {
    var self = this;

    var properties = JSON.parse(
      JSON.stringify(this.curDiagram.getProperties())
    );
    console.log(properties, "properties");
    this.showName = this.curDiagram.title;
    this.dataInsertItem = {
      title: properties.title || "",
      id: properties.id,
      remark: properties.remark,
      workflowId: properties.workflowId || {},
      logId: properties.logId || {},
    };

    this.dataInsertItem.name = this.curDiagram.title;
    console.log(this.dataInsertItem, "this.dataInsertItem");
    this.merchantId = this.$store.getters.merchantId;
    this.projectId = this.$store.getters.projectId;
    var _this = this;

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
    andorChange() {
      this.$forceUpdate();
    },
    // ...mapActions(["getVariableList"]),
    setVar(param, type) {
      if (type) {
        let tList = type.split("-");
        console.log("setVar", tList);
        if (tList[0] == "workflowId") {
          this.dataInsertItem.workflowId = {};
          this.dataInsertItem.workflowId = param;
        } else if (tList[0] == "logId") {
          this.dataInsertItem.logId = {};
          this.dataInsertItem.logId = param;
        }
      }
    },
    saveVarEdit(varList) {
      this.$emit("submitVarList", varList);
    },
    select(index) {
      this.editNum = index;
    },

    // 模态框取消按钮触发事件
    cancel() {
      // this.$Message.info('Clicked cancel');
    },

    saveConfig(name) {
      var self = this;

      let configJson = this.dataInsertItem;
      configJson.title = this.showName;

      console.log(configJson, "configJson");

      this.$emit("arguments", configJson);
    },

    cancel() {
      this.$emit("cancel");
    },
    sqlAnalysis(val) {
      // 2020-09-23记录之前的sqlParamList 如果和现在解析的一样 直接赋值
      let tempConditionList = this.dataInsertItem.conditions;
      this.dataInsertItem.conditions = [];
      var pattern = /{(.*?)}/g;
      var conditions = [];
      var temp;
      while ((temp = pattern.exec(val))) {
        // 去除双花括弧 以及去空
        var tItem = temp[0]
          .replace(/{(.*?)}/g, "$1")
          .replace(/(^\s*)|(\s*$)/g, "");
        // 去重
        if (conditions.indexOf(tItem) < 0) {
          conditions.push(tItem);
        }
      }
      //这里的array 就是可以用的了
      for (var key in conditions) {
        var conditionItem = {
          key: conditions[key],
          name: "",
          op: "",
          value: {},
          andor: "VAR",
          more: false,
          condition: {
            left: {},
            op: "",
            right: {},
          },
        };
        if (tempConditionList) {
          for (let i = 0; i < tempConditionList.length; i++) {
            let tempCondi = tempConditionList[i];
            if (conditions[key] == tempCondi.key) {
              conditionItem = tempCondi;
            }
          }
        }

        this.dataInsertItem.conditions.push(conditionItem);
      }
    },
  },
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
  .el-select {
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
.condition-middle {
  width: 95px;
  text-align: center;
  font-size: 22px;
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
    display: flex;
  }
}
.menu-item-li {
  margin: 5px 0px 0px 0px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 5px 10px;
  z-index: 2;
  position: relative;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  height: 50px;

  .tree-item-operator {
    font-size: 28px;
    line-height: 40px;
    padding: 0px 5px;
  }
}

.tree-item-text {
  white-space: nowrap;
  font-size: 16px;
  line-height: 40px;
  padding: 0px 5px;
}
.menu-item-select {
  /deep/ .el-input__inner {
    width: 100px;
  }

  /deep/ .el-select {
    width: 100px;
  }
}
</style>
