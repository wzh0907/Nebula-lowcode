<template>
  <div class="group-wrap">
    <div class="group-content">
      <el-form ref="connectorForm" label-width="70px" label-position="left">
        <el-form-item prop="name" label="节点名称">
          <el-input
            size="small"
            style="width: 220px"
            v-model="showName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="flow" label="函数">
          <el-cascader
            v-model="functionId"
            :show-all-levels="false"
            :options="functionList"
            :props="{ value: 'queryId', label: 'name', emitPath: false }"
            @change="handleFunction"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <h3>输入参数</h3>
            <el-form-item
              :label="item.name.name + ':'"
              v-for="(item, index) in inParams"
              :key="index"
            >
              <VarSelect
                :processId="mainProcessId"
                :key="'call-input-' + index"
                :data="item.value"
                :type="'input-' + index"
                @setVar="setVar"
                @submitVarList="saveVarEdit"
                class="menu-item-select"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import VarSelect from "../module/variable-selectV4";
import CodeEditor from "@/components/CodeEditor";
import { getFunctionList, getFunctionDetail } from "@/api/function";
import { mapActions } from "vuex";
export default {
  name: "drag-drawer-function",
  components: {
    VarSelect,
    CodeEditor,
  },
  props: ["curDiagram", "mainProcessId"],

  data() {
    return {
      callId: 0,
      callName: "",
      showName: "",
      target: {}, // PropertyName类型 SystemProperty系统变量, CurrentData当前值
      nameMap: { SystemProperty: "系统变量", CurrentData: "当前值" },
      valueMap: {
        SystemProperty: "系统变量",
        CurrentData: "当前数据",
        DocumentProperty: "数据/文档属性",
        Static: "静态值",
        DateTime: "时间值",
        Arguments: "输入参数",
      },
      targetStr: "",
      modal1: false,
      modal2: false,
      modalObj: { type: "", name: "" },
      modal2Obj: {
        property_name: "",
        data_value: "",
        relative_to_current_date_type: "",
        relative_to_current_date_delta: "",
        date_type: "",
        date_format: "",
        value_type: "",
      },
      rowNum: 0,
      opType: 1, // 1新增属性  2编辑属性
      inParams: [],
      outParams: [],
      processList: [],
      processId: "",
      processMap: {},
      curProp: "",
      functionId: 0,
      functionList: [],
    };
  },
  watch: {
    processId(val, oldval) {
      this.setParmas(this.processMap[this.processId]);
    },
  },
  mounted() {
    var properties = JSON.parse(
      JSON.stringify(this.curDiagram.getProperties())
    );
    console.log(properties, "properties");
    var that = this;
    this.showName = this.curDiagram.title || "";
    this.functionId = properties.functionId || 0;
    this.inParams = properties.inputs || [];
    this.outParams = properties.outputs || [];
    this.callId = this.curDiagram.id;
    this.callName = this.curDiagram.title;

    let params = {
      dataType: "process",
      functionType: "script",
    };
    getFunctionList(params)
      .then((res) => {
        if (res.code == 0) {
          that.functionList = res.dataList;
        }
      })
      .catch((err) => {});
  },
  methods: {
    handleFunction(functionId) {
      this.inParams = [];
      this.outParams = [];
      if (functionId) {
        let params = {
          businessId: functionId,
        };
        getFunctionDetail(params).then((res) => {
          let scheme = res.data.scheme;
          this.parseParams(scheme);
          let functionOutput = JSON.parse(res.data.functionOutput);
          for (const key in functionOutput) {
            var outparam = {
              category: "输出参数",
              name: key,
            };
            this.outParams.push(outparam);
          }

          // TODO 接口处理 输出
          // utputs &&
          //         outputs.forEach((singleVar) => {
          //           var outparam = {
          //             category: "输出参数",
          //             name: singleVar.name,
          //           };
          //           this.outParams.push(outparam);
          //         });
        });
      }
    },
    parseParams(script) {
      this.script = script;
      this.params = [];
      //解析参数,从括号中取出参数名
      let startIndex = script.indexOf("(");
      let endIndex = script.indexOf(")");
      //取出参数并去空格
      let paramString = script
        .slice(startIndex + 1, endIndex)
        .replace(/\s*/g, "");
      let paramArray = paramString.split(",");
      for (const paramArrayElement of paramArray) {
        var inparam = {
          name: {
            category: "输入参数",
            name: paramArrayElement,
          },
          value: {},
        };
        this.inParams.push(inparam);
      }
    },

    setVar(param, type) {
      let tList = type.split("-");
      if (tList[0] == "output") {
        this.outParams[tList[1]].value = {};
        this.outParams[tList[1]].value = param;
      } else if (tList[0] == "input") {
        this.inParams[tList[1]].value = {};
        this.inParams[tList[1]].value = param;
      }
    },
    saveVarEdit() {},
    setParmas(process_schema) {
      if (process_schema) {
        var p = JSON.parse(process_schema);
        var inParams,
          outParams,
          inTag = [],
          outTag = [];
        for (var i in p.nodes) {
          if (p.nodes[i].title == "开始") {
            inParams = p.nodes[i].properties.arguments;
            outParams = p.nodes[i].properties.outputs;
          }
        }
        //          {0 : {......   name : '',.......} }
        if (inParams && Object.keys(inParams).length > 0) {
          var inA = {};
          for (var j in inParams) {
            inA[inParams[j].name] = {
              property_name: "",
              data_value: "",
              relative_to_current_date_type: "",
              relative_to_current_date_delta: "",
              date_type: "",
              date_format: "",
              value_type: "",
            };
            inTag.push(inA);
          }
        }
        if (outParams && Object.keys(outParams).length > 0) {
          var outA = {};
          for (var j in outParams) {
            outA[outParams[j].name] = { type: "", name: "" };
            outTag.push(outA);
          }
        }
        this.inParams = inTag;
        this.outParams = outTag;
      }
    },
    saveConfig() {
      let configJson = {
        title: this.showName,
        functionId: this.functionId,
        inputs: this.inParams,
        outputs: this.outParams,
      };

      let varMap = this.$store.getters.varMap;
      let varTagList = varMap.get(this.mainProcessId);
      this.handlerOutParam(varTagList);
      console.log(configJson, "saveConfig");
      this.$emit("arguments", configJson);
    },
    handlerOutParam(varTagList) {
      varTagList &&
        varTagList.forEach((item) => {
          if (item.id == this.callId) {
            //清空  这个匹配到的值，然后重新加新值
            item.variables = [];
            this.outParams &&
              this.outParams.forEach((outItem) => {
                let varItem = {
                  defaultVal: outItem.name,
                  label: outItem.name,
                  name: outItem.name,
                  value: outItem.name,
                  parentName: this.callName,
                  type: 9,
                };
                item.variables.push(varItem);
              });
          }
        });
    },
    setTarget() {
      this.modal1 = true;
      this.modalObj = this.target;
    },
    ok() {
      if (this.modalObj.type == "CurrentData") {
        this.modal2Obj.name = "";
      }
      this.outParams[this.curProp] = { ...this.modalObj };
    },
    okValue() {
      this.inParams[this.curProp] = { ...this.modal2Obj };
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
    setAttributes() {
      this.modal1 = true;
      this.opType = 1;
      this.resetForm();
    },
    editAtr() {
      this.modal1 = true;
      this.opType = 2;
      var cur = this.attributeList[this.rowNum];
      this.modalObj.type = cur.type;
      this.modalObj.name = cur.name;
    },
    propertyDelete() {
      this.attributeList.splice(this.rowNum, 1);
    },
    upAtr() {
      var list = this.attributeList;
      var idx = this.rowNum;
      if (idx > 0) {
        var item = list.splice(idx, 1);
        list.splice(idx - 1, 0, item[0]);
        this.attributeList = list;
        this.rowNum = idx - 1;
      }
    },
    downAtr() {
      var list = this.attributeList;
      var idx = this.rowNum;
      if (idx > -1) {
        if (idx < list.length - 1) {
          var item = list.splice(idx, 1);
          list.splice(idx + 1, 0, item[0]);
          this.attributeList = list;
          this.rowNum = idx + 1;
        }
      }
    },
    getValueStr(name) {
      return typeof this.inParams[name] == "object"
        ? `${this.valueMap[this.inParams[name].value_type]} ${
            this.inParams[name].value_type == "Static"
              ? this.inParams[name].data_value || ""
              : this.inParams[name].property_name || ""
          }`
        : this.inParams[name];
    },
    getPropStr(key) {
      return typeof this.outParams[key] == "object"
        ? `${this.nameMap[this.outParams[key].type]} ${
            this.outParams[key].name
          }`
        : this.outParams[key];
    },

    setTarget(name) {
      this.modal1 = true;
      this.curProp = name;
      this.modalObj =
        {
          type: "",
          name: "",
          ...this.outParams[name],
        } || {};
    },
    
  },
};
</script>

<style scoped lang="less">
.mt10 {
  margin-top: 10px;
}
.group-wrap {
  position: relative;
  /deep/.el-input--small .el-input__inner {
    height: 40px;
    line-height: 40px;
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
.group-btns .btn {
  margin-right: 15px;
}
.group-content {
  height: calc(100% - 30px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
}
.group-content > .el-input--small .el-input__inner {
  width: 220px;
}
.spp-box-list {
  border: 1px solid #d6d6d6;
  padding: 2px 0;
  border-radius: 2px;
  margin-top: 10px;
  min-height: 200px;
}
.spp-box-list li.atrItem:hover {
  background-color: #f6f6f6;
}
.spp-box-list li {
  cursor: pointer;
  line-height: 24px;
  padding: 0 5px;
}
.params > div {
  line-height: 30px;
  margin: 10px 0 0 20px;
}
.params > div > input {
  border-radius: 5px;
  margin-left: 10px;
  border: 1px solid #999;
}
.params > div > input:focus {
  border: none;
}
.content h3 {
  line-height: 40px;
}
.process {
  line-height: 40px;
}
.process label {
  margin-right: 15px;
}
.param-line {
  display: flex;
  align-items: center;
}
.param-line label {
  margin-right: 20px;
}
.menu-item-select {
  /deep/.el-cascader .el-input .el-input__inner {
    width: 280px;
  }
  /deep/.el-input--suffix .el-input__inner {
    margin-top: 5px;
    width: 280px;
  }
  /deep/.el-input__icon {
    margin-right: -70px;
    line-height: 50px;
  }
}
</style>
