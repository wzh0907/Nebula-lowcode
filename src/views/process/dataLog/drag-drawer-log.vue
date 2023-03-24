<template>
  <!--  数据连接器  -->
  <div class="group-wrap connector-warp">
    <div class="group-content">
      <el-form
        :model="connectorItem"
        ref="connectorForm"
        label-width="80px"
        label-position="left"
      >
        <el-form-item prop="name" label="节点名称">
          <el-input v-model="showName"></el-input>
        </el-form-item>
     
      <h3>
        运行日志
        <span style="font-size: 12px">使用{占位符}增加占位符编辑功能</span>
      </h3>
      <el-row >
        <CodeEditor
          v-model="connectorItem.logText"
          width="100%"
          :height="editorHeight"
          mode="sql"
          :editorOptions="editorOptions"
        />
      </el-row>
      <h3 class="route-title2">占位符</h3>
      <el-row>
        <ul class="menu-item-wrap">
          <li
            v-for="(condiItem, condiIndex) in connectorItem.conditions"
            :key="condiIndex"
          >
            <div class="menu-item-li">
              <span class="tree-item-text">{{ condiItem.key + ":" }}</span>

              <VarSelect
                :processId="processId"
                :key="'logText-' + condiIndex"
                :data="condiItem.value"
                :type="'logText-' + condiIndex"
                @setVar="setVar"
                @submitVarList="saveVarEdit"
                class="menu-item-select"
              />
            </div>
            
          </li>
        </ul>
      </el-row>
      </el-form>
    </div>
  
  </div>
</template>

<script>
import VarSelect from "../module/variable-selectV4";
import CodeEditor from "@/components/CodeEditor";
export default {
  name: "drag-drawer-connector-query",
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
    subType: {
      type: String,
      default: "connector-query",
    },
  },
  data() {
    return {
      showName: "",
      showSql: "",
      showView:true,
      connectorItem: {
        name: "",
        remark: "",
        type: "database",
        opType: "query",
        //        loader_type: 'GET',
        connection_op: "",
        source: {},
        sourceList: [],
        sqlParamList: [],
        target: {},
        //        sql:'',
      },
      //        connection_id:6
      //        id:1
      //        name:"test op1"
      //        op_type:"GET"
      //        param:""
      //        sql:"select * from tb_connection_op

      parameterItem: {
        property_name: "",
        data_value: "",
        relative_to_current_date_type: "",
        relative_to_current_date_delta: "",
        date_type: "",
        date_format: "",
        value_type: "SystemProperty",
        showName: "",
      },
      modal1: false,
      modal2: false,
      connectorList: [], // 属性
      conList: [],
      conMap: {},
      opList: [],
      editConnectorData: {},
      editNum: 0,
     
      target: {
        category: "",
        name: "",
      },
      varMap: null,
      chosenConn: {},
      op: "",
      cVal: "",
      wVal: "",
      sVal: "",
      loading1: false,
      merchantId: 0,
      projectId: 0,
      fieldList: [],
      logText: "",
      editorHeight: "200px",
      editorOptions: {
        showGutter: false,
      },
      dataSourceList: [],
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
    this.connectorItem = {
      type: properties.type || "log",
      id: properties.id,
      logText: properties.logText,
      conditions: properties.conditions,
    };
    this.connectorItem.id = this.curDiagram.id;
    this.connectorItem.name = this.curDiagram.title;
    this.merchantId = this.$store.getters.merchantId;
    this.projectId = this.$store.getters.projectId;
     var _this = this;
      // 由于watch 了sql 变化导致sqlParamList清空，所以在这边延时回显paramList
      setTimeout(function () {
        _this.connectorItem.conditions = [];
        _this.connectorItem.conditions = properties.conditions;
      }, 1000);

    
  },
  methods: {
    
    setVar(param, type) {
      if (type) {
        let tList = type.split("-");
        if (tList[0] == "logText") {
          this.connectorItem.conditions[tList[1]].value = {};
          this.connectorItem.conditions[tList[1]].value = param;
          this.$set(this.connectorItem.conditions[tList[1]].value, param);
          this.$forceUpdate();
        }
      }
    },
    saveVarEdit(varList) {
      this.$emit("submitVarList", varList);
    },
    select(index) {
      this.editNum = index;
    },
    onSelectChange(v) {
      let self = this;

      const { connectorItem, conMap } = this;
      self.connectorItem.connection_op = "";
      self.opList = conMap[connectorItem.connection];
      //      self.opList.forEach(item => {
      //            if (item.id == v) {
      //              self.showSql = item.sql
      //            }
      //      })
    },
    addCon() {
      this.resetForm();
      this.modal1 = true;
    },
    // 点击编辑按钮触发事件
    editConnector(item, index) {
      this.modal2 = true;
      this.editConnectorData = { ...this.connectorList[this.editNum] };
    },
    okEdit() {
      // this.connectorList.splice(this.editNum,1,this.editConnectorData)
      this.connectorList[this.editNum] = this.editConnectorData;
    },
    // 模态框确定按钮触发事件
    ok() {
      this.connectorList.push(this.parameterItem);
    },
    // 模态框取消按钮触发事件
    cancel() {
      // this.$Message.info('Clicked cancel');
    },
    // 属性列表删除项
    propertyDelete() {
      this.connectorList.splice(this.editNum, 1);
    },
    saveConfig() {
      let name = "connectorForm";
      var self = this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          let configJson = this.connectorItem;
          configJson.title = this.showName;
        
          console.log(configJson, "configJson");
          
          this.$emit("arguments", configJson);
        } else {
          this.$Message.error("请选择数据操作");
        }
      });
    },
    
    resetForm() {
      this.parameterItem = {
        property_name: "",
        data_value: "",
        relative_to_current_date_type: "",
        relative_to_current_date_delta: "",
        date_type: "",
        date_format: "",
        value_type: "SystemProperty",
        showName: "",
      };
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
    
    addNewRoute() {
      var sourceItem = {
        field: "",
        op: "",
        source: {},
      };
      this.connectorItem.sourceList.push(sourceItem);
    },
    addNewSet() {
      var setItem = {
        field: "",
        op: "",
        source: {},
      };
      this.connectorItem.setList.push(setItem);
    },
    delProcess(sourceIndex) {
      this.connectorItem.sourceList.splice(sourceIndex, 1);
    },
    delSet(setIndex) {
      this.connectorItem.setList.splice(setIndex, 1);
    },

   
    // 解析sql 中的{{  }}
    sqlAnalysis(val) {
      // 2020-09-23记录之前的sqlParamList 如果和现在解析的一样 直接赋值
      let tempConditionList = this.connectorItem.conditions;
      this.connectorItem.conditions = [];
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
          value: {},
        };
        for (let i = 0; i < tempConditionList.length; i++) {
          let tempCondi = tempConditionList[i];
          if (conditions[key] == tempCondi.key) {
            conditionItem = tempCondi;
          }
        }
        this.connectorItem.conditions.push(conditionItem);
      }
    },
  
    choseType(condiIndex, type) {
      this.connectorItem.conditions[condiIndex].andor = type;
      this.$forceUpdate();
    },
  },

  watch: {
    "connectorItem.logText"(val) {
      this.sqlAnalysis(val);
    },
  },
};
</script>
<style scoped lang='less'>
.connector-warp {
  /deep/.el-input {
    width: 180px;
  }
  /deep/.el-input--suffix {
    width: 180px;
  }
  /deep/.el-select {
    width: 180px;
  }
  /deep/.menu-item-select-middle {
    width: 90px;
  }
  .menu-item-select-middle {
    /deep/.el-input {
      width: 100%;
    }
  }
}
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
.condition-list-div {
  display: flex;
  margin: 5px 0;
}
.condition-list-span {
  margin: 10px 10px 0 10px;
}
.chosen-type {
  background-color: #0862ea;
  border: 1px solid #0862ea;
  color: #fff;
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
  /deep/.el-cascader .el-input .el-input__inner {
    height: 30px;
  }
  /deep/.el-input--suffix .el-input__inner {
    margin-top: 5px;
    height: 30px;
  }
  /deep/.el-input__icon {
    line-height: 30px;
  }
}
.condition-item {
  display: inline-block;
  width: 80px;
  margin-right: 5px;
  /deep/.el-input {
    width: 80px;
  }
  /deep/.el-input__inner {
    width: 80px;
  }
  /deep/.el-input--suffix .el-input__inner {
    width: 80px;
  }
}
</style>
