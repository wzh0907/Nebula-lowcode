<template>
  <div class="value-config" style="padding: 10px 0px">
    <el-form size="small" label-width="70px">
      <el-form-item label="默认值">
        <!-- 组件选中的默认值 -->
<!--        日期组件，默认当日、本周一、本月一号-->
        <el-select
          v-if="componentConfig.type == 'van-design-calendar'"
          v-model="options.defaultValueType"
          clearable
          placeholder="请选择"
          @clear="options.value = ''"
        >
          <el-option
            v-for="item in calendarOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input
          v-else
          v-model="options.value"
          placeholder="默认值"
        />
      </el-form-item>
      <!-- 回显用 -->
      <el-form-item label="组件设值" class="form-set">
        <valuesConfig
          :componentConfig="componentConfig"
          :echoConfig="echoConfig"
          @onUpdateOptionsConfig="onUpdateOptionsConfig"
        />
      </el-form-item>
      <!-- 这个功能是用来绑定全局变量的 -->
      <!-- <el-form-item label="数据绑定">
        <valuesConfig
          :componentConfig="componentConfig"
          @onUpdateOptionsConfig="onUpdateOptionsConfig"
        />
      </el-form-item> -->
      <el-form-item label="选项数据" v-if="containInputFormBase">
        <el-radio-group v-model="options.contentDataSource">
          <el-radio-button label="radio-button-interface"
            >关联数据</el-radio-button
          >
          <el-radio-button label="radio-button-default"
            >选项定义</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <div v-if="containInputFormBase&&options.contentDataSource == 'radio-button-interface'">
        <valuesConfig
          :componentConfig="componentConfig"
          @onUpdateOptionsConfig="onUpdateOptionsConfig"
          @onChangeValuesConfig="onChangeValuesConfig"
        />
        <div class="value-select-div">
          <el-select v-model="options.labelKey"  size="mini" placeholder="请选择名称" clearable>
            <el-option
              v-for="item in valuesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select v-model="options.valueKey"  size="mini" placeholder="请选择值" clearable>
            <el-option
              v-for="item in valuesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- <el-input
            v-model="options.valueKey"
            style="width: 90px"
            size="mini"
            placeholder="名称"
          />
          <el-input v-model="options.labelKey" size="mini" placeholder="值" /> -->
        </div>
      </div>
      <div v-if="containInputFormBase&&options.contentDataSource == 'radio-button-default'">
        <columnsValuesConfig
          :columnsConfigs="componentConfig.options.defaultTableData"
          :addBtnText="addBtnText"
          :addColumnConfig="addColumnConfig"
        />
      </div>
    </el-form>
  </div>
</template>

<script>
import valuesConfig from "./values-config.vue";
import columnsValuesConfig from "@/views/report/layout/report-config-basics/basics-config/columns-values-config.vue";
import {inputFormBaseComponent} from "@/views/report/utils/common-const.js";
// modules
export default {
  components: { valuesConfig, columnsValuesConfig },
  props: {
    componentConfig: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      addColumnConfig: {
        label: "",
        value: "",
      },
      addBtnText: "添加选项",
      valuesList: [],
      calendarOptions: [
        {
          value: 'Today',
          label: '当日',
        },
        {
          value: 'Monday',
          label: '本周一',
        },
        {
          value: 'MonthStart',
          label: '本月一号',
        }
      ],
      calendarValue: ''
    };
  },
  watch: {},
  computed: {
    options() {
      console.log("componentConfig", this.componentConfig);
      return this.componentConfig.options;
    },
    containInputFormBase(){
      return inputFormBaseComponent.indexOf(this.componentConfig.type) == -1;
      //  return false;
    },
    echoConfig(){
      // input 组件的设置  不是回显 ，直接放在interfaceDataConfig
      if(this.componentConfig.type=="van-design-field"
        ||this.componentConfig.type=="van-design-calendar"
        ||this.componentConfig.type=="van-design-datetime-picker"){
        return false;
      }
      return true;
    },
  },

  created() {},
  mounted() {
  },
  beforeDestroy() {},
  methods: {
    onUpdateOptionsConfig() {
      this.$emit("onUpdateOptionsConfig");
    },
    onChangeValuesConfig(data) {
      this.valuesList = [];
      if (data.length > 1) {
        if (data[1].data.value && data[1].data.value.length > 0) {
          let vallist = data[1].data.value[0];
          for (var key in vallist) {
            this.valuesList.push({ label: key, value: key });
          }
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
/deep/.el-cascader .el-input .el-input__inner::-webkit-input-placeholder {
  color: #333;
}
/deep/.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
.value-select-div {
  display: flex;
}
.form-set{
  /deep/.el-form-item__label{
    line-height: 52px;
  }
}

</style>
