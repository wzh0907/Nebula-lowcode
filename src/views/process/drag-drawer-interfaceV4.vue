<template>
  <div class="group-wrap">
    <div class="group-content">
      <el-form ref="connectorForm" label-position="left" label-width="110px">
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="showName"></el-input>
        </el-form-item>
        <el-form-item label="接口" prop="flow">
          <el-select
            id="select"
            v-model="subProcessId"
            @change="interfaceChange"
          >
            <!--<i-option v-for="item in cityList" :value="item.value">{{ item.label }}</i-option>-->
            <el-option
              v-for="(item, key) in processList"
              :key="key"
              :label="item.processName"
              :value="item.id"
            >{{ item.processName }}
            </el-option
            >
          </el-select>
        </el-form-item>
      </el-form>
      <el-form ref="paramsForm" label-position="right" label-width="110px">
        <el-row>
          <el-col :span="24">
            <h3>输入参数</h3>
            <el-form-item
              v-for="(item, index) in inParams"
              :key="index"
              :label="item.name.name + ':'"
            >
              <!--<input v-model="item.value" id="outParam1" type="text"/>-->
              <VarSelect
                :key="'call-input-' + index"
                :data="item.value"
                :processId="mainProcessId"
                :type="'input-' + index"
                class="menu-item-select"
                @setVar="setVar"
                @submitVarList="saveVarEdit"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <h3>输出参数</h3>
            <el-form-item :label="item.name + ':'" v-for="(item, index) in outParams" :key="index">
              <VarSelect
                :key="'call-output-' + index"
                :data="item.value"
                :type="'output-' + index"
                @setVar="setVar"
                @submitVarList="saveVarEdit"
                class="menu-item-select"
              />
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
    </div>

    <!-- <div class="group-btns">
      <el-row class="row-btns">
        <el-button
          class="btn btns-delete"
          type="error"
          size="small"
          @click="deleteItem"
          >删除</el-button
        >
        <el-button
          class="btn btns-save"
          type="primary"
          size="small"
          @click="saveConfig"
          >保存</el-button
        >
      </el-row>
    </div> -->
  </div>
</template>

<script>
import VarSelect from "./module/variable-selectV4";
import CodeEditor from "@/components/CodeEditor";
import {getInterfaceList} from "@/api/process";
import {urlParse} from "@/util/index";
import {mapActions} from "vuex";

export default {
  name: "drag-drawer-interface",
  components: {
    VarSelect,
    CodeEditor
  },
  props: ["curDiagram", "mainProcessId"],

  data() {
    return {
      showName: "",
      target: {}, // PropertyName类型 SystemProperty系统变量, CurrentData当前值
      nameMap: {SystemProperty: "系统变量", CurrentData: "当前值"},
      valueMap: {
        SystemProperty: "系统变量",
        CurrentData: "当前数据",
        DocumentProperty: "数据/文档属性",
        Static: "静态值",
        DateTime: "时间值",
        Arguments: "输入参数"
      },
      targetStr: "",
      modal1: false,
      modal2: false,
      modalObj: {type: "", name: ""},
      modal2Obj: {
        property_name: "",
        data_value: "",
        relative_to_current_date_type: "",
        relative_to_current_date_delta: "",
        date_type: "",
        date_format: "",
        value_type: ""
      },
      rowNum: 0,
      opType: 1, // 1新增属性  2编辑属性
      inParams: [],
      outParams: [],
      processList: [],
      processId: "",
      processMap: {},
      curProp: "",
      subProcessId: 0,
      merchantId: 0,
      projectId: 0,
      interfaceId: 0,
      interfaceName: ""
    };
  },
  watch: {
    processId(val, oldval) {
      this.setParmas(this.processMap[this.processId]);
    }
  },
  mounted() {
    var properties = JSON.parse(
      JSON.stringify(this.curDiagram.getProperties())
    );
    console.log(properties, "properties");
    var that = this;
    this.showName = this.curDiagram.title || "";
    this.subProcessId = properties.processId || '';
    this.inParams = properties.inputs || [];
    this.outParams = properties.outputs || [];
    this.interfaceId = this.curDiagram.id;
    this.interfaceName = this.curDiagram.title;
    this.merchantId = this.$store.getters.merchantId;
    this.projectId = this.$store.getters.projectId;
    getInterfaceList(this.merchantId, this.projectId)
      .then(res => {
        if (res.code == 0) {
          that.processList = res.dataList;
        }
      })
      .catch(err => {
      });
  },
  methods: {
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
    saveVarEdit() {
    },
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
              value_type: ""
            };
            inTag.push(inA);
          }
        }
        if (outParams && Object.keys(outParams).length > 0) {
          var outA = {};
          for (var j in outParams) {
            outA[outParams[j].name] = {type: "", name: ""};
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
        processId: this.subProcessId,
        inputs: this.inParams,
        outputs: this.outParams
      };
      let varMap = this.$store.getters.varMap;
      let varTagList = varMap.get(this.mainProcessId);
      this.handlerOutParam(varTagList);
      console.log(configJson, "saveConfig");
      this.$emit("arguments", configJson);
    },
    handlerOutParam(varTagList) {
      varTagList.forEach(item => {
        if (item.id == this.interfaceId) {
          //清空  这个匹配到的值，然后重新加新值
          item.variables = [];
          this.outParams.forEach(outItem => {
            let varItem = {
              defaultVal: outItem.name,
              label: outItem.name,
              name: outItem.name,
              value: outItem.name,
              parentName: this.interfaceName,
              type: 8
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
      this.outParams[this.curProp] = {...this.modalObj};
    },
    okValue() {
      this.inParams[this.curProp] = {...this.modal2Obj};
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
    setValue(name) {
      this.modal2 = true;
      this.curProp = name;
      this.modal2Obj = {...this.inParams[name]} || {};
    },
    setTarget(name) {
      this.modal1 = true;
      this.curProp = name;
      this.modalObj =
        {
          type: "",
          name: "",
          ...this.outParams[name]
        } || {};
    },
    interfaceChange(event) {
      for (var i = 0; i < this.processList.length; i++) {
        var interfaceItem = this.processList[i];
        if (interfaceItem.id == event) {
          var interfaceConfig = JSON.parse(interfaceItem.interfaceConfig);
          this.inParams = [];
          this.outParams = [];
          var params = interfaceConfig.params;
          Object.keys(params).map(key => {
            var inparam = {
              name: {
                category: "输入参数",
                name: key
              },
              value: {}
            };
            this.inParams.push(inparam);
          });
          var path = interfaceConfig.path;

          Object.keys(path).map(key => {
            var inparam = {
              name: {
                category: "输入参数",
                name: key
              },
              value: {}
            };
            this.inParams.push(inparam);
          });
          var body = interfaceConfig.body;
          Object.keys(body).map(key => {
            var inparam = {
              name: {
                category: "输入参数",
                name: key
              },
              value: {}
            };
            this.inParams.push(inparam);
          });
          var headers = interfaceConfig.headers;
          Object.keys(headers).map(key => {
            if (key != "Content-Type") {
              var inparam = {
                name: {
                  category: "输入参数",
                  name: key
                },
                value: {}
              };
              this.inParams.push(inparam);
            }
          });
          var result = interfaceConfig.result;
          result.forEach(node => {
            var outparam = {
              name: node.name,
              path: node.path,
              value: {}
            };
            this.outParams.push(outparam);
          });
          //   nodes.forEach((node) => {
          //     if (node.type == "return") {
          //       var results = node.properties.results;
          //       results.forEach((result) => {
          //         console.log(result,"result");
          //         if(result.type==4){
          //           // 对象需要向下遍历
          //           variables.forEach( variable=>{
          //             if(variable.name==result.category && variable.type==4){
          //               var childrenVar = variable.variables;
          //               childrenVar.forEach(child=>{
          //                 var outparam = {
          //                   name:child.name ?child.name:child.category,
          //                   value: {},
          //                 };
          //                 this.outParams.push(outparam);
          //               });
          //             }
          //           });
          //         }else{
          //           var outparam = {
          //             // name: {
          //             //   category: result.category,
          //             //   name: result.name,
          //             // },
          //             name:result.name ?result.name:result.category,
          //             value: {},
          //           };
          //           this.outParams.push(outparam);
          //         }

          //       });
          //     }
          //   });
          //   variables.forEach( variable=>{
          //     if(variable.name=='输入参数'){
          //       var vars = variable.variables;
          //       vars.forEach(singleVar=>{
          //         console.log(singleVar,"singleVar")
          //         var inparam = {
          //           name: {
          //             category: "输入参数",
          //             name: singleVar.name,
          //           },
          //           value: {},
          //         };
          //         this.inParams.push(inparam);
          //       });
          //     }
          //   });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.mt10 {
  margin-top: 10px;
}

.group-wrap {
  position: relative;
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
  /deep/ .el-cascader .el-input .el-input__inner {
    width: 280px;
  }

  /deep/ .el-input--suffix .el-input__inner {
    margin-top: 5px;
    width: 280px;
  }

  /deep/ .el-input__icon {
    margin-right: -70px;
    line-height: 50px;
  }
}
</style>
