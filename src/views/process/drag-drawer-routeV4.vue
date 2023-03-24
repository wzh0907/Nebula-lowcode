<template>
  <!--  路由组件  -->
  <div class="group-wrap data-warp">
    <div class="group-content">
      <el-form :model="routeForm" label-position="left" label-width="80px">
        <el-form-item label="节点名称">
          <el-input v-model="routeForm.showName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="路由参数">

          <VarSelect
            key="route-routeParam"
            :data="routeParam"
            :processId="processId"
            type="routeParam-"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </el-form-item>
      </el-form>

      <h3 class="route-title2">路线</h3>
      <!-- <el-row>
        <el-collapse v-model="cVal">
          <el-collapse-item :title="attributeItem.title" :name="''+attributeIndex" v-for="(attributeItem, attributeIndex) in attributeList">
            <div>
            <el-form label-width="40px" class="routeBy-form" label-position="left">
                <el-form-item label="比较">
                  <el-select v-model="attributeItem.op" @on-change="changeOp">
                    <el-option label='=' value="1"></el-option>
                    <el-option label='&gt;' value="2"></el-option>
                    <el-option label='&lt;' value="3"></el-option>
                    <el-option label='&lt;=' value="4"></el-option>
                    <el-option label='&gt;=' value="5"></el-option>
                    <el-option label='!=' value="6"></el-option>
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

      </el-row>-->
      <draggable
        :list="attributeList"
        class="menu-item-wrap"
        handle=".handle"
        tag="ul"
      >
        <li v-for="(attributeItem,attributeIndex) in attributeList" :key="attributeIndex">
          <div class="menu-item-li">
            <i class="iconfont iconprojectmenu handle"></i>
            <div style="width:90%;display:flex;flex-warp:nowarp">
              <el-select v-model="attributeItem.op" style="width:80px;margin:0px 5px;" @on-change="changeOp">
                <el-option label='=' value="1"></el-option>
                <el-option label='&gt;' value="2"></el-option>
                <el-option label='&lt;' value="3"></el-option>
                <el-option label='&lt;=' value="4"></el-option>
                <el-option label='&gt;=' value="5"></el-option>
                <el-option label='!=' value="6"></el-option>
              </el-select>
              <VarSelect
                :key="'route-param-'+attributeIndex"
                :data="attributeItem.value"
                :processId="processId"
                :type="'param-'+attributeIndex"
                @setVar="setVar"
              />
            </div>
            <i class="el-icon-delete tree-item-operator" style="cursor: pointer;"
               @click="delRouteBy(attributeIndex)"></i>
          </div>
        </li>
      </draggable>
      <div class="opt-add-btn" @click="addNewRoute">
        <icon class="iconfont iconjiahao1"></icon>
        添加步骤
      </div>
      <h3 style="margin-top: 20px">备注</h3>
      <el-input v-model="routeForm.remark" :autosize="{minRows: 5,maxRows: 15}" placeholder="Enter something..."
                type="textarea"/>

    </div>

    <!-- <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem">删除</el-button>
        <el-button class="btn btns-save" type="primary" @click="saveConfig">保存</el-button>
      </el-row>
    </div> -->


  </div>
</template>

<script>
import VarSelect from "./module/variable-selectV4";
import Draggable from "vuedraggable";
import {mapActions} from "vuex";
/* eslint-disable */
export default {
  name: "drag-drawer-route",
  components: {
    VarSelect,
    Draggable
  },
  props: ["flow", "curDiagram", "processId"],
  data() {
    return {
      routeForm: {showName: "", remark: "", routeBy: {type: "", name: "", value: ""}},
      routeByString: "",
      startArgs: [], //从开始组件获取的参数
      modal: {type: "SystemProperty", name: "", value: ""},
      modal1Data: {
        value_type: "SystemProperty",
        date_format: "",
        date_type: "",
        relative_to_current_date_delta: "",
        relative_to_current_date_type: "",
        data_value: "",
        property_name: "",
      },

      modal2: false,
      modal1: false,
      routeIdx: 0,
      routeByOp: "",
      routeByVal: "",
      attributeList: [], // 属�
      opMap: {
        1: {str: "等于", sym: "="},
        2: {str: "大于", sym: ">"},
        3: {str: "小于", sym: "<"},
        4: {str: "小于或等于", sym: "<="},
        5: {str: "大于或等于", sym: ">="},
        6: {str: "不等于", sym: "<>"},
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
      routeParam: {
        category: "",
        name: "",
      },
      cVal: '',
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
      remark: properties.remark,
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
        var jtem = {...item};
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
  },

  methods: {
    setVar(param, type) {
      let tList = type.split("-");
      if (tList[0] == "param") {
        this.attributeList[tList[1]].value = {};
        this.attributeList[tList[1]].value = param;
        this.changeOp();
      } else {
        this.routeParam = {};
        this.routeParam = param;
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
        remark: this.routeForm.remark,
      };
      // var jsonData = JSON.stringify(data); // 转成JSON格式
      // var result = $.parseJSON(jsonData); // 转成JSON对象
      // console.log(result);
      this.$emit("arguments", data);
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
      if (typeof (cur.value.name) == 'undefined') {
        name = ""
      }
      cur.title =
        cur.op != 1 || !!cur.value.name
          ? this.opMap[cur.op].str + " " + this.getVariableValue(cur.value)
          : cur.title;
    },
    getVariableValue(variable) {
      if (variable.category && variable.name) {
        return variable.category + "/" + variable.name;
      } else if (variable.category) {
        return variable.category;
      } else if (variable.name) {
        return variable.name;
      } else if (variable.value) {
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

  },

  watch: {},
};
</script>

<style lang="less" scoped>
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
    background-color: #0862EA;
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
  background-color: #0862EA;
}

.menu-item-li {
  z-index: 2;
  position: relative;
  background-color: #fff;
  display: flex;
  height: 50px;
}
</style>
