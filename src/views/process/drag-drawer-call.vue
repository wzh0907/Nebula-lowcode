<template>
  <div class="group-wrap">
    <div class="group-content">
      <el-form
        ref="connectorForm"
        label-width="80px"
        label-position="left"
      >
        <el-form-item prop="name" label="节点名称">
          <el-input size="small"  v-model="showName"></el-input>
        </el-form-item>
        <el-form-item prop="flow" label="流程">
          <el-select
            v-model="subProcessId"
            @change="subProcessChange"
          >
          <!--<i-option v-for="item in cityList" :value="item.value">{{ item.label }}</i-option>-->
          <el-option :value="item.id" :key="item.id" :label="item.processName" v-for="item in processList"></el-option>
        </el-select>
        </el-form-item>
          <h3>输入参数</h3>
           <el-form-item
            :label="item.name.name + ':'"
            v-for="(item, index) in inParams"
          >
            <!--<input v-model="item.value" id="outParam1" type="text"/>-->
            <VarSelect
              :key="'call-input-'+index"
              :data="item.value"
              :type="'input-'+index"
              @setVar="setVar"
              @submitVarList="saveVarEdit"
            />
          </el-form-item>
          <h3>输出参数</h3>
          <el-form-item
            :label="item.name + ':'"
            v-for="(item, index) in outParams"
          >
            <!--<input v-model="item.value" id="outParam1" type="text"/>-->
            <VarSelect
              :key="'call-output-'+index"
              :data="item.value"
              :type="'output-'+index"
              @setVar="setVar"
              @submitVarList="saveVarEdit"
            />
          </el-form-item>
      </el-form>
    </div>

    <div class="group-btns">
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
    </div>
    <el-dialog v-model="modal1" title="变量" @on-ok="ok">
      <el-form label-width="80px">
        <el-form-item label="变量类型">
          <el-select v-model="modalObj.type">
            <el-option value="SystemProperty">系统变量</el-option>
            <el-option value="CurrentData">当前值</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变量名称">
          <el-input v-model="modalObj.name" placeholder="请输入..." />
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="modal2" title="取值" @on-ok="okValue">
      <el-form :model="modal2Obj" label-width="80px">
        <el-form-item label="变量类型">
          <el-select v-model="modal2Obj.value_type">
            <el-option :value="key" v-for="(value, key, index) in valueMap">{{
              value
            }}</el-option>
          </el-select>
        </el-form-item>
        <template v-if="modal2Obj.value_type == 'DateTime'">
          <el-form-item label="时间格式">
            <!--<Input v-model="modal2Obj.date_format" placeholder="请输入..."></Input>-->
            <el-select v-model="modal2Obj.date_format">
              <el-option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</el-option>

              <el-option value="MMddyyyy">MMddyyyy</el-option>
              <el-option value="MM/dd/yyyy">MM/dd/yyyy</el-option>
              <el-option value="MM-dd-yyyy">MM-dd-yyyy</el-option>
              <el-option value="MMddyy">MMddyy</el-option>
              <el-option value="yyyyMMdd HHmmss">yyyyMMdd HHmmss</el-option>
              <el-option value="yyyyMMdd HHmmss.SSS">yyyyMMdd HHmmss.SSS</el-option>
              <el-option value="yyyy-MM-dd">yyyy-MM-dd</el-option>
              <el-option value="yyyy-MM-dd'T'HH:mm:ss"
                >yyyy-MM-dd'T'HH:mm:ss</el-option
              >
              <el-option value="yyyy-MM-dd'T'HH:mm:ssZ"
                >yyyy-MM-dd'T'HH:mm:ssZ</el-option
              >
            </el-select>
          </el-form-item>
          <el-form-item label="时间类型">
            <el-select v-model="modal2Obj.date_type">
              <el-option value="CurrentDate">当前日期/时间</el-option>
              <el-option value="RelativeDate">相对日期/时间</el-option>
            </el-select>
          </el-form-item>
          <template v-if="modal2Obj.date_type == 'RelativeDate'">
            <el-form-item label="偏移值">
              <el-input
                v-model="modal2Obj.relative_to_current_date_delta"
                placeholder="请输入..."
              ></el-input>
            </el-form-item>
            <el-form-item label="偏移类型">
              <el-select v-model="modal2Obj.relative_to_current_date_type">
                <el-option value="Second(s)">秒</el-option>
                <el-option value="Minute(s)">分</el-option>
                <el-option value="Hour(s)">时</el-option>
                <el-option value="Day(s)">天</el-option>
                <el-option value="Week(s)">周</el-option>
                <el-option value="Month(s)">月</el-option>
                <el-option value="Year(s)">年</el-option>
              </el-select>
            </el-form-item>
          </template>
        </template>
        <template v-if="modal2Obj.value_type == 'Static'">
          <el-form-item label="值">
            <el-input
              v-model="modal2Obj.data_value"
              placeholder="请输入..."
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="modal2Obj.value_type == 'DocumentProperty'">
          <!--          <FormItem label="属性类型">-->
          <!--            <el-select v-model="modal2Obj.property_name.type">-->
          <!--              <el-option value="DocumentProperty">数据集/文档属性</el-option>-->
          <!--              <el-option value="SystemProperty">系统变量</el-option>-->
          <!--            </el-select>-->
          <!--          </FormItem>-->
          <el-form-item label="属性名称">
            <el-input
              v-model="modal2Obj.property_name"
              placeholder="请输入..."
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="modal2Obj.value_type == 'SystemProperty'">
          <!--          <FormItem label="属性类型">-->
          <!--            <el-select v-model="modal2Obj.property_name.type">-->
          <!--              <el-option value="DocumentProperty">数据集/文档属性</el-option>-->
          <!--              <el-option value="SystemProperty">系统变量</el-option>-->
          <!--            </el-select>-->
          <!--          </FormItem>-->
          <el-form-item label="属性名称">
            <el-input
              v-model="modal2Obj.property_name"
              placeholder="请输入..."
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import VarSelect from "./module/variable-select";
import CodeEditor from '@/components/CodeEditor'
import { getSubProcessList } from "@/api/process";
import { mapActions } from "vuex";
export default {
  name: "drag-drawer-call",
  components: {
    VarSelect,
    CodeEditor,
  },
  props: ["curDiagram"],

  data() {
    return {
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
      subProcessId: 0,
      merchantId: 0,
      projectId: 0,
    };
  },
  watch: {
    processId(val, oldval) {
      this.setParmas(this.processMap[this.processId]);
    },
  },
  mounted() {
    var properties = JSON.parse(JSON.stringify(this.curDiagram.getProperties()));
    console.log(properties, "properties");
    var that = this;
    this.showName=this.curDiagram.title||"";
    this.subProcessId = properties.processId||0;
    this.inParams = properties.inputs||[];
    this.outParams = properties.outputs||[];

    this.merchantId = this.$store.getters.merchantId;
    this.projectId = this.$store.getters.projectId;
    getSubProcessList(this.merchantId, this.projectId)
      .then((res) => {
        console.log(res);
        if (res.code == 0) {
          that.processList = res.dataList;
        }
      })
      .catch((err) => {});
  },
  methods: {
    setVar(param, type) {
      let tList = type.split("-");
      if (tList[0] == "output") {
        this.outParams[tList[1]].value = {};
        this.outParams[tList[1]].value = param;
      }else if (tList[0] == "input") {
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
            console.log(inParams[j].name);
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
        processId: this.subProcessId,
        inputs: this.inParams,
        outputs: this.outParams,
      };
      console.log(configJson,"saveConfig");
      this.$emit("arguments", configJson);
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
    setValue(name) {
      this.modal2 = true;
      this.curProp = name;
      this.modal2Obj = { ...this.inParams[name] } || {};
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
    subProcessChange(event) {
      for (var i = 0; i < this.processList.length; i++) {
        var subProcess = this.processList[i];
        if (subProcess.id == event) {
          var scheme = JSON.parse(subProcess.scheme);
          var nodes = scheme.nodes;
          var variables = scheme.variables;
          this.inParams = [];
          this.outParams = [];
          nodes&&nodes.forEach((node) => {
            if (node.type == "return") {
              var results = node.properties.results;
              results&&results.forEach((result) => {
                console.log(result,"result");
                if(result.type==4){
                  // 对象需要向下遍历
                  variables&&variables.forEach( variable=>{
                    if(variable.name==result.category && variable.type==4){
                      var childrenVar = variable.variables;
                      childrenVar.forEach(child=>{
                        var outparam = {                        
                          name:child.name ?child.name:child.category,
                          value: {},
                        };
                        this.outParams.push(outparam);
                      });
                    }
                  });
                }else{
                  var outparam = {
                    // name: {
                    //   category: result.category,
                    //   name: result.name,
                    // },
                    name:result.name ?result.name:result.category,
                    value: {},
                  };
                  this.outParams.push(outparam);
                }
                
              });
            }
          });
          variables&&variables.forEach( variable=>{
            if(variable.name=='输入参数'){
              var vars = variable.variables;
              vars&&vars.forEach(singleVar=>{
                console.log(singleVar,"singleVar")
                var inparam = {
                  name: {
                    category: "输入参数",
                    name: singleVar.name,
                  },
                  value: {},
                };
                this.inParams.push(inparam);
              });
            }
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.mt10 {
  margin-top: 10px;
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
</style>
