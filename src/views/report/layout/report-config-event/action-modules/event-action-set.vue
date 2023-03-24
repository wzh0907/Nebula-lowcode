<template>
  <div class="border-config">
    <valueSet
      :actionSet="currentActionSet.setInfo"
      @chosenActionSet="chosenActionSet"
    ></valueSet>
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
<!--    <el-radio-->
<!--        v-model="valueType"-->
<!--        label="function"-->
<!--        class="radio-first"-->
<!--        @change="changeActionSet"-->
<!--    >-->
<!--      <valueSelect-->
<!--          placeholder="请选择函数脚本"-->
<!--          :paramItem="currentActionSet.functionInfo"-->
<!--          :isBind="true"-->
<!--          @handleChange="handleChange"-->
<!--          style="padding: 10px 0px; display: inline-block"-->
<!--      />-->
<!--    </el-radio>-->
    <el-radio v-model="valueType" label="constant" @change="changeActionSet">
      <el-input
        size="small"
        v-model="constantInfo.value"
        placeholder="静态值"
      ></el-input>
    </el-radio>
    <el-radio v-model="valueType" label="today" @change="changeActionSet"
      >今日</el-radio
    >
    <el-radio v-model="valueType" label="lastDay" @change="changeActionSet"
      >前<el-input
        size="small"
        v-model="lastDayInfo.day"
        class="event-item-input"
        style="width: 60px"
      ></el-input
      >天</el-radio
    >
    <el-radio
      v-model="valueType"
      label="currentUnitDay"
      @change="changeActionSet"
    >
      本
      <el-select v-model="currentUnitDayInfo.unit" size="small" class="event-item-select">
        <el-option
          v-for="(item, key) in dateRange"
          :key="key"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        size="small"
        v-model="currentUnitDayInfo.day"
        class="event-item-input"
      ></el-input>
      <el-checkbox v-model="currentUnitDayInfo.isLastDay" class="last-day"
        >最后一天</el-checkbox
      >
    </el-radio>
    <el-radio v-model="valueType" label="lastUnitDay" @change="changeActionSet">
      上
      <el-select v-model="lastUnitDayInfo.unit" size="small" class="event-item-select">
        <el-option
          v-for="(item, key) in dateRange"
          :key="key"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        size="small"
        v-model="lastUnitDayInfo.day"
        class="event-item-input"
      ></el-input>
      <el-checkbox v-model="lastUnitDayInfo.isLastDay" class="last-day"
        >最后一天</el-checkbox
      >
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
          unit: "", // week month season year
          day: 0,
          valueType: "", //function 函数 constant 常量  today lastDay(x)前几天  currentUnitDay(x,unit) lastUnitDay(x,unit)
          isLastDay: false,
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
  },
  data() {
    return {
      dateRange: [
        {
          label: "周",
          value: "week",
        },
        {
          label: "月",
          value: "month",
        },
        {
          label: "季",
          value: "season",
        },
        {
          label: "年",
          value: "year",
        },
      ],
      currentActionSet: this.actionSet,
      constantInfo: {
        value: "",
      },
      todayInfo: {},
      lastDayInfo: {
        day: "",
      },
      currentUnitDayInfo: {
        unit: "",
        day: "",
        isLastDay: false,
      },
      lastUnitDayInfo: {
        unit: "",
        day: "",
        isLastDay: false,
      },
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
    constantInfo: {
      handler(val) {
        this.changeActionSet("constant");
      },
      deep: true,
    },
    lastDayInfo: {
      handler(val) {
        this.changeActionSet("lastDay");
      },
      deep: true,
    },
    currentUnitDayInfo: {
      handler(val) {
        this.changeActionSet("currentUnitDay");
      },
      deep: true,
    },
    lastUnitDayInfo: {
      handler(val) {
        this.changeActionSet("lastUnitDay");
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
      this.valueType = this.currentActionSet.valueType;
      if (this.currentActionSet.valueType == "constant") {
        this.constantInfo.value = this.currentActionSet.value;
      } else if (this.currentActionSet.valueType == "today") {
      } else if (this.currentActionSet.valueType == "lastDay") {
        this.lastDayInfo.day = this.currentActionSet.day;
      } else if (this.currentActionSet.valueType == "currentUnitDay") {
        this.currentUnitDayInfo.unit = this.currentActionSet.unit;
        this.currentUnitDayInfo.day = this.currentActionSet.day;
        this.currentUnitDayInfo.isLastDay = this.currentActionSet.isLastDay;
      } else if (this.currentActionSet.valueType == "lastUnitDay") {
        this.lastUnitDayInfo.unit = this.currentActionSet.unit;
        this.lastUnitDayInfo.day = this.currentActionSet.day;
        this.lastUnitDayInfo.isLastDay = this.currentActionSet.isLastDay;
      }
    },
    handleChange(data, paramItem) {
      console.log("handleChange", data, paramItem);
      if (paramItem.param_value_type == "T") {
        paramItem.relevanceComponentUuid = data[1].id;
        if (data.length === 3) {
          // TODO:: 待优化 目前组件有三层的是Table和树形组件（特殊处理）
          paramItem.param_v_key = data[2].data.value;
        }
        this.linkComponent(paramItem);
      } else if (paramItem.param_value_type == "F") {
        //脚本函数
        if (data.length === 5) {
          //如果有5层,代表函数脚本在分组中
          paramItem.middle = data[data.length - 3].id
        } else {
          paramItem.middle = undefined
        }
        paramItem.operateApiId = data[data.length - 2].id;
        paramItem.operateApiId = data[data.length - 2].id;
        paramItem.param_v_key = data[data.length - 1].id;
        console.log("function paramItem=", paramItem);
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
        this.clearAllActionSet();
        this.currentActionSet.valueType = val;
      }
      if (val == "constant") {
        this.currentActionSet.value = this.constantInfo.value;
      } else if (val == "today") {
      } else if (val == "lastDay") {
        this.currentActionSet.day = this.lastDayInfo.day;
      } else if (val == "currentUnitDay") {
        this.currentActionSet.unit = this.currentUnitDayInfo.unit;
        this.currentActionSet.day = this.currentUnitDayInfo.day;
        this.currentActionSet.isLastDay = this.currentUnitDayInfo.isLastDay;
      } else if (val == "lastUnitDay") {
        this.currentActionSet.unit = this.lastUnitDayInfo.unit;
        this.currentActionSet.day = this.lastUnitDayInfo.day;
        this.currentActionSet.isLastDay = this.lastUnitDayInfo.isLastDay;
      }

    },
    clearAllActionSet() {
      this.currentActionSet.unit = "";
      this.currentActionSet.day = "";
      this.currentActionSet.isLastDay = "";
      this.currentActionSet.value = "";
      for (var key in this.currentUnitDayInfo) {
        delete this.currentUnitDayInfo[key];
      }
      for (var key in this.lastUnitDayInfo) {
        delete this.lastUnitDayInfo[key];
      }
      delete this.constantInfo.value;
      delete this.lastDayInfo.day;
    },
    chosenActionSet(data, paramItem) {
      console.log("chosenActionSet", data, paramItem);

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
          if (data.length > 1) {
            paramItem.param_v_key = data[2].id;
            paramItem.param_value = data[2].data.value; // 接口值取不到的
          }
        }
      } else if(paramItem.param_value_type == "G"){
        paramItem.middle = data[1].id;
        paramItem.param_v_key = data[2].data
        paramItem.param_value = data[2].value; // 接口值取不到的
      }
       this.$forceUpdate();
      // this.currentActionSet.type = info.type;
      // this.currentActionSet.key = info.key;
    },
    linkComponent(paramsItem) {
      console.log('paramsItem==', JSON.stringify(paramsItem));
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
