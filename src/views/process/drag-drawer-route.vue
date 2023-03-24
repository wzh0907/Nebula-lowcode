<template>
  <!--  路由组件  -->
  <div class="group-wrap">
    <div class="group-content">
      <p
        class="group-text"
      >路由组件用于根据指定变量值选择不同的执行路径，该组件逐条判定路径条件，一旦满足则选择该条路径，不再判定其他路径条件。优先选择第一条符合条件的执行路径，不再选择其他符合条件的执行路径</p>

      <el-form :model="routeForm" label-width="80px" label-position="left">
        <el-form-item label="节点名称">
          <el-input size="small" v-model="routeForm.showName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="路由参数">
          <!-- <div class="form-input">
            <el-select v-model="routeParam.category" class="var-select">
              <el-option :value="variable.name" v-for="variable in variableList">{{variable.name}}</el-option>
            </el-select>
            <el-select
              v-model="routeParam.name"
              clearable
              class="var-select"
              v-if="routeParam.category&&varMap"
            >
              <el-option
                :value="variable.name"
                v-for="variable in varMap.get(routeParam.category)"
              >{{variable.name}}</el-option>
            </el-select>
          </div>-->
          <VarSelect
            key="route-routeParam"
            :data="routeParam"
            type="routeParam-"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </el-form-item>
      </el-form>

      <h3 class="route-title2">路线</h3>
      <el-row>
        <el-collapse v-model="cVal">
          <el-collapse-item :title="attributeItem.title" :name="''+attributeIndex" v-for="(attributeItem, attributeIndex) in attributeList">
            <div>
            <el-form label-width="40px" class="routeBy-form" label-position="left">
                <el-form-item label="比较">
                  <el-select v-model="attributeItem.op" @on-change="changeOp">
                    <el-option value="1">=</el-option>
                    <el-option value="2">&gt;</el-option>
                    <el-option value="3">&lt;</el-option>
                    <el-option value="4">&le;</el-option>
                    <el-option value="5">&ge;</el-option>
                    <el-option value="6">!=</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="比较值" v-if="attributeItem">
                  <VarSelect
                    :key="'route-param-'+attributeIndex"
                    :data="attributeItem.value"
                    :type="'param-'+attributeIndex"
                    @setVar="setVar"
                  />
                </el-form-item>                
              </el-form>
               <div class="opt-btn">
                <div @click="delRouteBy(attributeIndex)">X删除</div>
                <div @click="up(attributeIndex)">上移</div>
                <div @click="down(attributeIndex)">下移</div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div @click="addNewRoute" class="opt-add-btn">添加步骤</div>
      </el-row>
      <h3>备注</h3>
      <el-input v-model="routeForm.remark" type="textarea" :autosize="{minRows: 5,maxRows: 15}" placeholder="Enter something..." />
      
      <!-- <Row>
        <Icon class="iconfont iconjiahao mr5" :size="22" @click="addNewRoute" />
        <Icon class="iconfont iconchahao mr5" :size="22" @click="delRouteBy" />
        <Icon class="iconfont iconxiangshang mr5" :size="22" @click="up" />
        <Icon class="iconfont iconxiangxia mr5" :size="22" @click="down" />
      </Row>
      <Row :gutter="30">
        <i-col span="10">
          <div class="spp-box-list" style="min-height: 200px;">
            <ul class="routeByList">
              <li
                v-for="(item, index) in attributeList"
                @click="select(index)"
                v-bind:class="{routeByChecked:index==routeIdx}"
              >
                <span>{{ item.title }}</span>
              </li>
            </ul>
          </div>
        </i-col>
        <i-col span="14">
          <Form :label-width="40" class="routeBy-form" label-position="left">
            <FormItem label="比较">
              <i-select v-model="routeByOp" @on-change="changeOp">
                <el-option value="1">=</el-option>
                <el-option value="2">&gt;</el-option>
                <el-option value="3">&lt;</el-option>
                <el-option value="4">&le;</el-option>
                <el-option value="5">&ge;</el-option>
                <el-option value="6">!=</el-option>
              </i-select>
            </FormItem>
            <FormItem label="比较值" v-if="attributeList[routeIdx]">
              <div class="form-input">
                <el-select
                  v-model="attributeList[routeIdx].value.category"
                  class="var-select"
                  @on-change="changeOp"
                >
                  <el-option :value="variable.name" v-for="variable in variableList">{{variable.name}}</el-option>
                </el-select>
                <el-select
                  v-model="attributeList[routeIdx].value.name"
                  class="var-select"
                  clearable
                  @on-change="dateValueSelect(attributeList[routeIdx].value)"
                  v-if="attributeList[routeIdx].value.category&&varMap"
                >
                  <el-option
                    :value="variable.name"
                    v-for="variable in varMap.get(attributeList[routeIdx].value.category)"
                  >{{variable.name}}</el-option>
                </el-select>
              </div>
            </FormItem>
          </Form>
        </i-col>
      </Row> -->
    </div>

    <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem">删除</el-button>
        <el-button class="btn btns-save" type="primary" @click="saveConfig">保存</el-button>
      </el-row>
    </div>

    <!--  属性弹� -->
    <!-- <el-dialog
      v-model="modal2"
      title="变量"
      @on-ok="okAttribute">
      <Form  :label-width="80" label-position="left">
        <FormItem label="变量类型">
          <el-select v-model="modal.type">
            <el-option value="SystemProperty">系统变量</el-option>
            <el-option value="DocumentProperty">文档属性</el-option>
          </el-select>
        </FormItem>
        <FormItem label="变量名称">
          <Input v-model="modal.name"></Input>
        </FormItem>
      </Form>
    </el-dialog>-->
    <!-- 路线 propertyName -->
    <!-- <el-dialog v-model="modal2" title="变量" @on-ok="okAttribute">
      <Form :label-width="80" label-position="left">
        <FormItem label="变量类型">
          <el-select v-model="modal.category" class="var-select">
            <el-option :value="variable.name" v-for="variable in variableList">{{variable.name}}</el-option>
          </el-select>
          <el-select v-model="modal.name" class="var-select" v-if="modal.category">
            <el-option
              :value="variable.name"
              v-for="variable in varMap.get(modal.category)"
            >{{variable.name}}</el-option>
          </el-select>
        </FormItem>
      </Form>
    </el-dialog> -->
    <!--  属性弹� -->
    <!-- <el-dialog
      v-model="modal1"
      title="取值"
      @on-ok="modal1Ok">
      <Form :model="modal1Data" :label-width="80" label-position="left">
        <FormItem label="变量类型">
          <el-select v-model="modal1Data.value_type">
            <el-option :value="key" v-for="(value, key, index) in valueMap">{{value}}</el-option>
          </el-select>
        </FormItem>
        <template v-if="modal1Data.value_type == 'DateTime'">
        <FormItem label="时间格式">
          <el-select v-model="modal1Data.date_format">
            <el-option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</el-option>
            <el-option value="yyyy-MM-dd">yyyy-MM-dd</el-option>
            <el-option value="MMddyyyy">MMddyyyy</el-option>
            <el-option value="MM/dd/yyyy">MM/dd/yyyy</el-option>
            <el-option value="MM-dd-yyyy">MM-dd-yyyy</el-option>
            <el-option value="MMddyy">MMddyy</el-option>
            <el-option value="yyyyMMdd HHmmss">yyyyMMdd HHmmss</el-option>
            <el-option value="yyyyMMdd HHmmss.SSS">yyyyMMdd HHmmss.SSS</el-option>
            <el-option value="yyyy-MM-dd'T'HH:mm:ss">yyyy-MM-dd'T'HH:mm:ss</el-option>
            <el-option value="yyyy-MM-dd'T'HH:mm:ssZ">yyyy-MM-dd'T'HH:mm:ssZ</el-option>
          </el-select>
        </FormItem>
        <FormItem label="时间类型">
          <el-select v-model="modal1Data.date_type">
            <el-option value="CurrentDate" selected>当前时间</el-option>
            <el-option value="RelativeDate">相对时间</el-option>
          </el-select>
        </FormItem>
        <template v-if="modal1Data.date_type == 'RelativeDate'">
          <FormItem label="偏移值">
            <Input v-model="modal1Data.relative_to_current_date_delta" placeholder="请输入.."></Input>
          </FormItem>
          <FormItem label="偏移类型">
            <el-select v-model="modal1Data.relative_to_current_date_type">
              <el-option value="Second(s)">秒</el-option>
              <el-option value="Minute(s)">分</el-option>
              <el-option value="Hour(s)">时</el-option>
              <el-option value="Day(s)">天</el-option>
              <el-option value="Week(s)">周</el-option>
              <el-option value="Month(s)">月</el-option>
              <el-option value="Year(s)">年</el-option>
            </el-select>
          </FormItem>
        </template>
      </template>
        <template v-if="modal1Data.value_type == 'Static'">
          <FormItem label="值">
            <Input v-model="modal1Data.data_value" placeholder="请输入.."></Input>
          </FormItem>
        </template>
        <template v-if="modal1Data.value_type == 'DocumentProperty'">

          <FormItem label="属性名称">
            <Input v-model="modal1Data.property_name" placeholder="请输入.."></Input>
          </FormItem>
        </template>
        <template v-if="modal1Data.value_type == 'SystemProperty'">
    
          <FormItem label="属性名称">
            <Input v-model="modal1Data.property_name" placeholder="请输入.."></Input>
          </FormItem>
        </template>
        <template v-if="modal1Data.value_type == 'Arguments'">
        <FormItem label="属性名称">
          <el-select v-model="modal1Data.property_name">
            <el-option :value="item.name" v-for="item in startArgs">{{item.title}}</el-option>
          </el-select>
        </FormItem>
        </template>
      </Form>
    </el-dialog>-->

    <!--<Row class="mt10">-->
    <!--<el-button type="primary" @click="saveConfig">保存</el-button>-->
    <!--</Row>-->
  </div>
</template>

<script>
import VarSelect from "./module/variable-select";
import { mapActions } from "vuex";
/* eslint-disable */
export default {
  name: "drag-drawer-route",
  components: {
    VarSelect,
  },
  props: ["flow", "curDiagram", "processId"],
  data() {
    return {
      routeForm: { showName: "",remark:"", routeBy: { type: "", name: "", value: "" } },
      routeByString: "",
      startArgs: [], //从开始组件获取的参数
      modal: { type: "SystemProperty", name: "", value: "" },
      modal1Data: {
        value_type: "SystemProperty",
        date_format: "",
        date_type: "",
        relative_to_current_date_delta: "",
        relative_to_current_date_type: "",
        data_value: "",
        property_name: "",
      },
      //      formItem: {
      //        op: 1,
      //        value: ''
      //      },
      modal2: false,
      modal1: false,
      routeIdx: 0,
      routeByOp: "",
      routeByVal: "",
      attributeList: [], // 属�
      opMap: {
        1: { str: "等于", sym: "=" },
        2: { str: "大于", sym: ">" },
        3: { str: "小于", sym: "<" },
        4: { str: "小于或等于", sym: "<=" },
        5: { str: "大于或等于", sym: ">=" },
        6: { str: "不等于", sym: "<>" },
      },
      nameMap: {
        SystemProperty: "系统变量",
        DocumentProperty: "文档属性",
      },
      valueMap: {
        SystemProperty: "系统变量",
        CurrentData: "当前数据",
        DocumentProperty: "数据/文档属性",
        Static: "静态值",
        DateTime: "时间值",
        Arguments: "输入参数",
      }, //        parameterList:[]
      variableList: [],
      varMap: null,
      routeParam: {
        category: "",
        name: "",
      },
      cVal:'',
    };
  },
  mounted() {
    this.attributeList = [];
    this.startArgs = this.flow.getArgs();
    var properties = JSON.parse(JSON.stringify(this.curDiagram.getProperties()));
    this.routeForm = {
      showName: this.curDiagram.title,
      routeBy: {
        type: (properties.property && properties.property.type) || "",
        name: (properties.property && properties.property.name) || "",
      },
      remark:properties.remark,
    };
    this.routeByString =
      this.routeForm.routeBy.category ||
      "" + " " + this.routeForm.routeBy.name ||
      "";
    if (properties.property) {
      this.routeParam = properties.property;
    }
    var routes = properties.routes || [];
    if (routes.length > 0) {
      var arr = [];
      var self = this;
      routes.forEach((item) => {
        var jtem = { ...item };
        var map = self.opMap;
        for (var i in map) {
          if (jtem.op == map[i].sym) {
            jtem.op = i;
            break;
          }
        }
        arr.push(jtem);
      });
      this.attributeList = arr;
      this.select(this.routeIdx);
    }
    this.variableList = this.$store.getters.varTagList;
    this.varMap = this.$store.getters.varMap;
  },

  methods: {
    setVar(param, type) {
       let tList = type.split("-");
      if (tList[0] == "param") {
        this.attributeList[tList[1]].value = {};
        this.attributeList[tList[1]].value = param;
        this.changeOp();
      }else{
       this.routeParam={};
       this.routeParam=param; 
      }
    },
    saveVarEdit(varList) {
      this.$emit("submitVarList", varList);
    },
    //      // 设置参数的添加按钮触发事�
    //      setParameter(){
    //        this.modal1 = true
    //      },
    // 设置属性的添加按钮触发事件
    setAttributes() {
      this.modal2 = true;
      this.modal = {
        type: this.routeForm.routeBy.type,
        name: this.routeForm.routeBy.name,
      };
    },
    setRValue() {
      this.modal1 = true;
      var cur = this.attributeList[this.routeIdx];
      this.modal1Data = cur.value;
    },
    modal1Ok() {
      this.changeVal();
    },
    // 模态框确定按钮触发事件
    okAttribute() {
      // this.routeForm.routeBy.type = this.modal.type
      this.routeForm.routeBy.category = this.modal.category;
      this.routeForm.routeBy.name = this.modal.name;
      this.routeByString = this.modal.category + " " + this.modal.name;
      //        this.attributeList.push(JSON.parse(JSON.stringify(this.formItem)))
      //        console.log(this.attributeList)
    },
    select(idx) {
      this.routeIdx = idx;
      var cur = this.attributeList[idx];
      this.routeByOp = cur.op;
      this.routeByVal = "";
      if (cur.value.value_type == "Static") {
        cur.value.data_value &&
          (this.routeByVal = "静态值" + cur.value.data_value);
      }
      if (cur.value.value_type == "DateTime") {
        if (cur.value.date_type == "CurrentDate") {
          this.routeByVal =
            "时间日期" + cur.value.date_type + "-" + cur.value.date_format;
        }
        if (cur.value.date_type == "RelativeDate") {
          this.routeByVal =
            "时间日期" +
            cur.value.date_type +
            "-:Current Date" +
            cur.value.relative_to_current_date_delta +
            " " +
            cur.value.relative_to_current_date_type;
        }
      }

      if (cur.value.value_type == "CurrentData") {
        this.routeByVal = "当前数据";
      }
      if (cur.value.value_type == "DocumentProperty") {
        cur.value.property_name &&
          (this.routeByVal = "文档属性" + cur.value.property_name);
      }
      if (cur.value.value_type == "SystemProperty") {
        cur.value.property_name &&
          (this.routeByVal = "系统变量 " + cur.value.property_name);
      }
    },
    saveConfig() {
      var atr_arr = [...this.attributeList];
      var opMap = this.opMap;
      atr_arr.forEach((item, idx) => {
        item.op = opMap[item.op].sym;
      });
      var data = {
        title: this.routeForm.showName,
        property: this.routeParam, // PropertyName类型
        routes: atr_arr,
        remark:this.routeForm.remark,
      };
      var jsonData = JSON.stringify(data); // 转成JSON格式
      var result = $.parseJSON(jsonData); // 转成JSON对象
      console.log(result);
      this.$emit("arguments", result);
    },
    delRouteBy(attributeIndex) {
      this.attributeList.splice(attributeIndex, 1);
    },
    addNewRoute() {
      let c = this.attributeList.length;
      this.attributeList.push({
        title: "新路由" + (c + 1),
        op: "1",
        // value:{
        //   value_type: 'SystemProperty',
        //   date_format: '',
        //   date_type: '',
        //   relative_to_current_date_delta: '',
        //   relative_to_current_date_type: '',
        //   data_value: '',
        //   property_name: ''
        // }
        value: {
          category: "",
          name: "",
          type: 0,
          value: "",
        },
      });
      this.routeIdx = this.attributeList.length - 1;
      this.routeByOp = "1";
      this.routeByVal = "";
    },
    changeOp() {
      var cur = this.attributeList[this.routeIdx];
      let name = cur.value.name;
      if(typeof(cur.value.name)=='undefined'){
        name=""
      }
      cur.title =
        cur.op != 1 || !!cur.value.name
          ? this.opMap[cur.op].str + " " + this.getVariableValue(cur.value)
          : cur.title;
    },
    getVariableValue(variable){
    if(variable.category&&variable.name){
        return variable.category+"/"+variable.name;
    }else if(variable.category){
        return variable.category;
    }else if(variable.name){
        return variable.name;
    }else if(variable.value){
        return variable.value;
    }
    return "";
},
    changeVal() {
      var cur = this.attributeList[this.routeIdx];
      var modalData = this.modal1Data;
      cur.value = {
        value_type: this.modal1Data.value_type,
        date_format: "",
        date_type: "",
        relative_to_current_date_delta: "",
        relative_to_current_date_type: "",
        data_value: "",
        property_name: "",
      };

      if (modalData.value_type == "Static") {
        this.routeByVal = "静态值" + modalData.data_value;
        cur.title = this.opMap[cur.op].str + " " + modalData.data_value;
        cur.value.data_value = modalData.data_value;
      }

      if (this.modal1Data.value_type == "DateTime") {
        if (modalData.date_type == "CurrentDate") {
          this.routeByVal =
            "时间日期" + modalData.date_type + "-" + modalData.date_format;
          cur.title = this.opMap[cur.op].str + " " + this.routeByVal;
          cur.value.date_format = modalData.date_format;
          cur.value.date_type = modalData.date_type;
        }

        if (modalData.date_type == "RelativeDate") {
          this.routeByVal =
            "时间日期" +
            modalData.date_type +
            "-:Current Date" +
            modalData.relative_to_current_date_delta +
            " " +
            modalData.relative_to_current_date_type;
          cur.title = this.opMap[cur.op].str + " " + this.routeByVal;
          cur.value.date_format = modalData.date_format;
          cur.value.date_type = modalData.date_type;
          cur.value.relative_to_current_date_delta =
            modalData.relative_to_current_date_delta;
          cur.value.relative_to_current_date_type =
            modalData.relative_to_current_date_type;
        }
      }
      if (modalData.value_type == "CurrentData") {
        this.routeByVal = "当前数据";
        cur.title = this.opMap[cur.op].str + " " + this.routeByVal;
      }

      if (modalData.value_type == "DocumentProperty") {
        this.routeByVal = "文档属性" + modalData.property_name;
        cur.title = this.opMap[cur.op].str + " " + this.routeByVal;
        cur.value.property_name = modalData.property_name;
      }
      if (modalData.value_type == "SystemProperty") {
        this.routeByVal = "系统变量 " + modalData.property_name;
        cur.title = this.opMap[cur.op].str + " " + this.routeByVal;
        cur.value.property_name = modalData.property_name;
      }
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
    up(attributeIndex) {
      var list = this.attributeList;
      var idx = attributeIndex;
      if (idx > 0) {
        var item = list.splice(idx, 1);
        list.splice(idx - 1, 0, item[0]);
        this.attributeList = list;
        this.routeIdx = idx - 1;
      }
    },
    down(attributeIndex) {
      var list = this.attributeList;
      var idx = attributeIndex;
      if (idx > -1) {
        if (idx < list.length - 1) {
          var item = list.splice(idx, 1);
          list.splice(idx + 1, 0, item[0]);
          this.attributeList = list;
          this.routeIdx = idx + 1;
        }
      }
    },
    dateValueSelect(item) {
      this.varMap.get(item.category).forEach((v) => {
        if (v.name == item.name) {
          this.attributeList[this.routeIdx].value.type = v.type;
          this.attributeList[this.routeIdx].value.value = v.value;
          this.attributeList[this.routeIdx].value.value_type = v.value_type;
        }
      });
      this.changeOp();
    },
  },

  watch: {},
};
</script>

<style scoped>
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
</style>
