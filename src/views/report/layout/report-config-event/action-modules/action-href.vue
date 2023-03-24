<template>
  <div class="border-config">
    <el-form
      size="small"
      label-width="70px"
      class="label-left"
      >
        <el-form-item :label="item.operateHrefPageParamName" v-for="(item, index) in singleInterfaceDataConfig.hrefPageParams" :key="index"> 
          <valueSelect :paramItem="item" :isBind="true" @handleChange="handleChange" style="padding: 10px 0px; "/> 
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import valueSelect from "@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue";
// operateHrefPageParamType
export default {
  name: "action-href",
   components: {
    valueSelect,
    // eventItemConfig
  },
  data() {
    return {
      singleInterfaceDataConfig:this.actionItem.interfaceDataConfig,
      paramsActiveNames: ''
    };
  },
  props: {
    actionItem: {
      type: Object,
      default: () => {},
    },
    varDataObj: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    actionItem: {
      handler(newVal, oldVal) {
        this.singleInterfaceDataConfig = newVal.interfaceDataConfig;
      },
      deep: true,
    },
  },

  methods: {
    handleOptionsRemoveInterfaceConfig(index, paramList) {
      paramList.splice(index, 1);
    },
    handleAddColumnInterfaceConfig(paramList) {
      if (!paramList) return false;
      paramList.push({
        operateHrefPageParamName: "",
        operateHrefPageParamKey: "",
      });
    },
    
    handleChange(data, paramItem){
      if (paramItem.param_value_type == "T") {
        paramItem.relevanceComponentUuid = data[1].id;
      } else if(paramItem.param_value_type == "V") {     
        paramItem.type = data[0].type;   
        paramItem.param_v_key = data[1].id;
          if (data[0].type == "customInterface") {
          paramItem.param_value = data[1].data.value;
          paramItem.operateApiId = data[0].id;
        } else {
          paramItem.param_value = data[1].data.value.operateHrefPageParamValue;
        }
      } else if(paramItem.param_value_type == "B"){
        paramItem.type = data[0].type;
        if (data[0].type == "radio-button-tables") {
          paramItem.param_v_table = data[0].data.name;
          paramItem.param_v_key = data[1].id;
          paramItem.param_value = ""; // 接口值取不到的
        } else if (data[0].type == "radio-button-interface"||data[0].type == "radio-button-connect") {
          paramItem.param_v_name = data[0].data.name;
          paramItem.middle = data[1].id;
          if(data.length>2){
            // 2022-02-25
            paramItem.param_v_key = data[2].id;
            paramItem.param_value = data[2].data.value; // 接口值取不到的
          }else{
            paramItem.operateApiId = data[0].id;
          }
         
        }
      }
      this.$forceUpdate();
    }
  },
};
</script>

<style lang="scss" scoped>
.panel-del-btn {
  position: absolute;
  right: 5px;
  padding: 4px;
}
/deep/.el-collapse-item__header {
  padding-left: 20px;
}
/deep/.el-collapse-item__arrow {
  position: absolute;
  margin: 0;
  left: 0;
}

// 覆写el-label
.label-left /deep/.el-form-item__label {
  float: left;
  line-height: 52px;
}
</style>
