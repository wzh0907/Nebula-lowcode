<template>
  <!--  决策组件  -->
  <div class="group-wrap">
    <div class="group-content">
      <p class="group-text">条件组件通过比较两个变量值决定执行路径，执行路径只能两条选其一</p>
      <el-form :model="formItem" label-width="80px">
        <!-- <FormItem label="第一值">
        <Input  :value.sync="firstString"
               @on-focus="showModal1(1)" placeholder="请选择..." icon="ios-search-outline" readonly></Input>
     
        </FormItem>-->
        <el-form-item label="比较值">
          <VarSelect
            key="if-leftValue"
            :data="leftValue"
            type="leftValue"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </el-form-item>
        <el-form-item label="比较">
          <el-select v-model="op">
            <el-option value="===">=</el-option>
            <el-option value=">">&gt;</el-option>
            <el-option value="<">&lt;</el-option>
            <el-option value=">=">&ge;</el-option>
            <el-option value="<=">&le;</el-option>
            <el-option value="<>">!=</el-option>
          </el-select>
        </el-form-item>
        <!-- <FormItem label="第二值">
        <Input :value.sync="secondString"
               @on-focus="showModal1(2)" placeholder="请选择..." icon="ios-search-outline" readonly></Input>
        </FormItem>-->
        <el-form-item label="比较值">
         
          <VarSelect
            key="if-rightValue"
            :data="rightValue"
            type="rightValue"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </el-form-item>
      </el-form>
      <h3>备注</h3>
      <el-input v-model="remark" type="textarea" :autosize="{minRows: 5,maxRows: 15}" placeholder="Enter something..." />
      
    </div>
    <!-- <el-dialog
      v-model="modal1"
      title="添加值"
      @on-ok="okIf">
      <Form :model="formItem" :label-width="80">
        <FormItem label="取值范围">
          <el-select v-model="formItem.value_type">
            <el-option :value="key" v-for="(value, key, index) in valueMap">{{value}}</el-option>
          </el-select>
        </FormItem>
        <template v-if="formItem.value_type == 'DateTime'">
          <FormItem label="时间格式">
    <!--<Input v-model="formItem.date_format" placeholder="请输入..."></Input>-->
    <!-- <el-select v-model="formItem.date_format">
              <el-option value="MMddyyyy">MMddyyyy</el-option>
              <el-option value="MM/dd/yyyy">MM/dd/yyyy</el-option>
              <el-option value="MM-dd-yyyy">MM-dd-yyyy</el-option>
              <el-option value="MMddyy">MMddyy</el-option>
              <el-option value="yyyyMMdd HHmmss">yyyyMMdd HHmmss</el-option>
              <el-option value="yyyyMMdd HHmmss.SSS">yyyyMMdd HHmmss.SSS</el-option>
              <el-option value="yyyy-MM-dd">yyyy-MM-dd</el-option>
              <el-option value="yyyy-MM-dd'T'HH:mm:ss">yyyy-MM-dd'T'HH:mm:ss</el-option>
              <el-option value="yyyy-MM-dd'T'HH:mm:ssZ">yyyy-MM-dd'T'HH:mm:ssZ</el-option>
            </el-select>
          </FormItem>
          <FormItem label="时间类型">
            <el-select v-model="formItem.date_type">
              <el-option value="CurrentDate">当前日期/时间</el-option>
              <el-option value="RelativeDate">相对日期/时间</el-option>
            </el-select>
          </FormItem>
          <template v-if="formItem.date_type == 'RelativeDate'">
            <FormItem label="偏移值">
              <Input v-model="formItem.relative_to_current_date_delta" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="偏移类型">
              <el-select v-model="formItem.relative_to_current_date_type">
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
        <template v-if="formItem.value_type == 'Static'">
          <FormItem label="值">
            <Input v-model="formItem.data_value" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="formItem.value_type == 'DocumentProperty'">
          <FormItem label="属性名称">
            <Input v-model="formItem.property_name" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="formItem.value_type == 'SystemProperty'">
          <FormItem label="属性名称">
            <Input v-model="formItem.property_name" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="formItem.value_type == 'Arguments'">
          <FormItem label="属性名称">
            <el-select v-model="formItem.property_name">
              <el-option :value="item.name" v-for="item in startArgs">{{item.title}}</el-option>
            </el-select>
          </FormItem>
        </template>
      </Form>
    </el-dialog>-->

    <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem">删除</el-button>
        <el-button class="btn btns-save" type="primary" @click="saveConfig">保存</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import VarSelect from "./module/variable-select";
// import { getVariableList } from "@/api/variable";
import { mapActions } from "vuex";
export default {
  name: "drag-drawer-if",
  components: {
    VarSelect,
  },
  props: ["flow", "curDiagram", "processId"],
  data() {
    return {
      formItem: {
        data_value: "",
        relative_to_current_date_type: "",
        relative_to_current_date_delta: "",
        date_type: "",
        date_format: "",
        value_type: "",
        property_name: "",
        name: "",
        type: "",
      },
      op: "",
      modal1: false,
      //        modal2: false,
      firstData: {},
      secondData: {},
      firstString: "",
      secondString: "",
      num: 0,
      startArgs: [],
      valueMap: {
        SystemProperty: "系统变量",
        CurrentData: "当前数据",
        DocumentProperty: "数据/文档属性",
        Static: "静态值",
        DateTime: "时间值",
        Arguments: "输入参数",
      },
      leftValue: {
        category: "",
        name: "",
        type: 0,
        value: "",
      },
      rightValue: {
        category: "",
        name: "",
        type: 0,
        value: "",
      },
      variableList: [],
      remark:"",
    };
  },
  mounted() {
    this.firstData = { ...this.formItem };
    this.secondData = { ...this.formItem };
    this.startArgs = this.flow.getArgs();
    var properties = JSON.parse(JSON.stringify(this.curDiagram.getProperties()));
    //      if(properties.arguments){
    //        this.startGroup = properties.arguments
    //      }
    //      left_value: this.firstData,
    //        op: this.op,
    //        right_value: this.secondData
    //      this.firstData =  properties.left_value
    this.op = properties.op || "";
    //      this.secondData =  properties.right_value
    if (properties.left_value) {
      this.leftValue = properties.left_value;
    }
    if (properties.right_value) {
      this.rightValue = properties.right_value;
    }
    this.remark =  properties.remark;
    // this.okIf(1, properties.left_value),
    // this.okIf(2, properties.right_value)
    this.variableList = this.$store.getters.varTagList;

  },
  methods: {
    ...mapActions(["getVariableList"]),
    setVar(param, type) {
      if (type == "leftValue") {
        this.leftValue = {};
        this.leftValue = param;
      } else {
        this.rightValue = {};
        this.rightValue = param;
      }
    },
    saveVarEdit(varList) {
      this.$emit("submitVarList", varList);
    },
    showModal1(num) {
      this.modal1 = true;
      if (num == 1) {
        this.num = 1;
        this.formItem = { ...this.firstData };
      }
      if (num == 2) {
        this.num = 2;
        this.formItem = { ...this.secondData };
      }
    },
    // 模态框确定按钮触发事件
    okIf(tag, data) {
      if (this.num == 1 || tag == 1) {
        var firstData = (this.firstData = data || { ...this.formItem });
        var str = this.valueMap[firstData.value_type] || "";
        var type = firstData.value_type;
        if (type == "Static") {
          str += firstData.data_value + " " || "";
        }
        if (type == "DateTime") {
          if (firstData.date_type == "CurrentDate") {
            str += (firstData.date_type || "") + (firstData.date_format || "");
          }
          if (firstData.date_type == "RelativeDate") {
            str +=
              (firstData.date_type || "") +
              (firstData.date_format || "") +
              (firstData.relative_to_current_date_type || "") +
              (firstData.relative_to_current_date_delta || "");
          }
        }
        if (type == "CurrentData") {
          str = str;
        }
        if (type == "DocumentProperty") {
          str += firstData.property_name || "";
        }
        if (type == "SystemProperty") {
          str += firstData.property_name || "";
        }
        if (type == "Arguments") {
          str += firstData.property_name || "";
        }
        this.firstString = str;
      }
      if (this.num == 2 || tag == 2) {
        var secondData = (this.secondData = data || { ...this.formItem });
        var str = this.valueMap[secondData.value_type] || "";
        var type = secondData.value_type;
        if (type == "Static") {
          str += secondData.data_value + " " || "";
        }
        if (type == "DateTime") {
          if (secondData.date_type == "CurrentDate") {
            str +=
              (secondData.date_type || "") + (secondData.date_format || "");
          }
          if (secondData.date_type == "RelativeDate") {
            str +=
              (secondData.date_type || "") +
              (secondData.date_format || "") +
              (secondData.relative_to_current_date_type || "") +
              (secondData.relative_to_current_date_delta || "");
          }
        }
        if (type == "CurrentData") {
          str = str;
        }
        if (type == "DocumentProperty") {
          str += secondData.property_name || "";
        }
        if (type == "SystemProperty") {
          str += secondData.property_name || "";
        }
        if (type == "Arguments") {
          str += secondData.property_name || "";
        }
        this.secondString = str;
      }
    },
    // 模态框取消按钮触发事件
    cancel() {
      this.formItem = {};
    },
    // 属性列表删除项
    propertyDelete(index) {
      this.attributeList.splice(index, 1);
    },

    saveConfig() {
      // let configJson = {
      //   left_value: this.firstData,
      //   op: this.op,
      //   right_value: this.secondData
      // }
      let configJson = {
        left_value: this.leftValue,
        op: this.op,
        right_value: this.rightValue,
        remark:this.remark,
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

<style scoped>
.mt10 {
  margin-top: 10px;
}
ul li {
  list-style-type: none;
}
.spp-box-list {
  border: 1px solid #d6d6d6;
  padding: 10px;
  border-radius: 5px;
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
.group-content {
  /*margin-bottom: 10px;*/
  height: calc(100% - 30px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
}
.group-btns .btn {
  margin-right: 15px;
}
</style>
