<template>
  <div class="border-config">
    <el-radio v-model="valueType" label="constant" @change="changeActionSet">
      <el-input
        type="textarea"
        size="small"
        v-model="constantPopupValue"
        placeholder="请输入提示信息"
      ></el-input>
    </el-radio>
    <el-radio
      v-model="valueType"
      label="custom"
      class="radio-first"
      @change="changeActionSet"
    >
      <valueSelect
        :paramItem="currentActionSet.getInfo"
        :isBind="true"
        @handleChange="handleChange"
        style="padding: 10px 0px; display: inline-block"
      />
    </el-radio>
  </div>
</template>

<script>
import valueSet from "./value-set.vue";
import valueSelect from "@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue";
export default {
  name: "event-action-set",
  components: { valueSet, valueSelect },
  props: {
    actionSet: {
      type: Object,
      default: () => {
        return {
          type: "component", // globalVariable
          key: "", // uuid 或者是 全局变量的key
          value: "", //
          valueType: "", // constant 常量 custom 接口值)
          getInfo:{
            param_value_type: "",
            type: "",
            param_v_key: "",
            param_value: "",
          },
          setInfo: {
            param_value_type: "",
            type: "",
            param_v_key: "",
            param_value: "",
          },
        };
      },
    },
    popupBody: ''
  },
  data() {
    return {
      currentActionSet: this.actionSet,
      constantPopupValue: this.popupBody,
      valueType: "",
    };
  },
  watch: {
    currentActionSet: {
      handler(val) {
        this.$emit("saveActionSet", val);
      },
      deep: true,
    },
    constantPopupValue: {
      handler(val) {
        this.$emit("savePopupValue", val);
      },
      deep: true,
    },
  },
  created() {
    this.init();
    console.log("--------------------create",this.currentActionSet)
  },
  methods: {
    init() {
      this.valueType = this.currentActionSet.valueType || 'constant';
      this.$emit("saveActionSet", this.currentActionSet);
      if (this.currentActionSet.valueType == "constant") {
        this.constantInfo.value = this.currentActionSet.value;
      }
    },
    handleChange(data, paramItem) {
      console.log("handleChange", data, paramItem);
      if (paramItem.param_value_type == "T") {
        paramItem.relevanceComponentUuid = data[1].id;
        this.linkComponent(paramItem);
      } else if (paramItem.param_value_type == "V") {
        paramItem.type = data[0].type;
        paramItem.param_v_key = data[1].id;
        if (data[0].type == "customInterface") {
          paramItem.param_value = data[1].data.value;
          paramItem.operateApiId = data[0].id;
        } else {
          paramItem.param_value = data[1].data.value.operateHrefPageParamValue;
        }
      } else if (paramItem.param_value_type == "B") {
        paramItem.type = data[0].type;
        if (data[0].type == "radio-button-tables") {
          paramItem.param_v_table = data[0].data.name;
          paramItem.param_v_key = data[1].id;
          paramItem.param_value = ""; // 接口值取不到的
        } else if (data[0].type == "radio-button-interface"||
        data[0].type == "radio-button-connect") {
          paramItem.param_v_name = data[0].data.name;
          paramItem.middle = data[1].id;
          if (data.length > 2) {
            paramItem.param_v_key = data[2].id;
            paramItem.param_value = data[2].data.value; // 接口值取不到的
          } else {
            paramItem.operateApiId = data[0].id;
          }
        }
      }
      this.$forceUpdate();
    },
    changeActionSet(val) {
      if (this.currentActionSet.valueType != val) {
        this.constantPopupValue = "";
        this.currentActionSet.valueType = val;
      }
      if (val == "constant") {
        this.currentActionSet.value = this.constantPopupValue;
      }
    },
    linkComponent(paramsItem) {
      let uuid = paramsItem.relevanceComponentUuid;
      this.componentUuidList.forEach((item) => {
        if (item.uuid === uuid) {
          paramsItem.param_value = item.options.value;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.event-item-select {
  /deep/.el-cascader .el-input .el-input__inner {
    height: 32px;
    width: 80px;
  }
  /deep/.el-input--suffix .el-input__inner {
    margin-top: 5px;
    height: 32px;
    line-height: 32px;
    width: 50px;
    padding-right: 15px;
  }
  /deep/.el-input__suffix {
    right: -24px;
    top: 2px;
  }
  /deep/.el-input__icon {
    line-height: 32px;
    width: 80px;
  }
}
.event-item-input {
  margin-left: 5px;
  width: 45px;
}
.last-day {
  margin-left: 10px;
}
.el-radio {
  height: 40px;
  line-height: 40px;
}
.radio-first {
  margin-bottom: 10px;
}
</style>
