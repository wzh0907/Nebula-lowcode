<template>
  <div>
    <el-collapse v-model="queryActiveNames">
      <el-collapse-item
        :name="index"
        v-for="(item, index) in queryConfigs"
        :key="index"
      >
        <template slot="title">
          {{ item.param_name }}
          <el-button
            class="panel-del-btn"
            circle
            plain
            type="danger"
            size="mini"
            icon="el-icon-minus"
            @click="handleOptionsRemove(index)"
          />
        </template>
        <el-form
          size="small"
          label-width="70px"
          style="padding-left: 20px"
          class="label-left"
        >
          <el-form-item label="列名：">
            <el-select
              v-model="item.param_name"
              placeholder="请选择"
              @change="changeColumnItemName(item, interfaceDataConfig.tableFieldList)"
              v-if="
                interfaceDataConfig.type ===
                'radio-button-tables'
              "
            >
              <el-option
                v-for="(apiParams, key) in interfaceDataConfig.tableFieldList"
                :key="key"
                :label="apiParams.columnName"
                :value="apiParams.columnName"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="item.param_name"
              placeholder="请选择"
              @change="changeColumnItemName(item, interfaceDataConfig.datasetParamsList)"
              v-else
            >
              <el-option
                v-for="(apiParams, key) in interfaceDataConfig.datasetParamsList"
                :key="key"
                :label="apiParams.name"
                :value="apiParams.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运算符：">
            <el-select v-model="item.operator" filterable placeholder="请选择">
              <el-option
                v-for="operator in operatorMap"
                :key="operator.value"
                :label="operator.name"
                :value="operator.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="条件值：">
            <valueSelect :paramItem="item" @handleChange="handleChange"/> 
          </el-form-item>
          <!-- <el-form-item label="条件值：">
            <el-radio-group
              v-model="item.param_value_type"
              size="small"
              style="padding-bottom: 10px"
            >
              <el-radio-button
                :label="condition.value"
                v-for="(condition, key) in [
                  { name: '组件', value: 'T' },
                  { name: '变量', value: 'V' },
                  { name: '常量', value: 'C' },
                ]"
                :key="key"
              >
                {{ condition.name }}
              </el-radio-button>
            </el-radio-group>
            <el-form-item label="" v-if="item.param_value_type === 'T'">
              <el-select
                v-model="item.relevanceComponentUuid"
                filterable
                placeholder="请选择"
                @change="linkComponent(item)"
              >
                <el-option
                  v-for="(uuidItem, key) in componentUuidList"
                  :key="key"
                  :label="uuidItem.options.commonConfigAssignName"
                  :value="uuidItem.uuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" v-if="item.param_value_type === 'V'">
              <el-select
                v-model="item.param_v_key"
                filterable
                placeholder="请选择"
                style="padding-top: 10px"
                @change="onSelectParamKey(item)"
              >
                <el-option
                  v-for="(value, key) in varDataObj"
                  :key="key"
                  :label="key"
                  :value="key"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <div style="padding-top: 10px" v-if="item.param_value_type === 'C'">
              <el-input v-model="item.param_value"></el-input>
            </div>
          </el-form-item> -->
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div style="margin-left: 20px">
      <el-button type="text" @click="handleAddColumn"
        >添加条件</el-button
      >
    </div>
  </div>
</template>

<script>
import valueSelect from "./value-select.vue";
export default {
  components: { valueSelect },
  props: {
    interfaceDataConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 可输入组件的list
    componentUuidList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    chooseSubpageIndex: {
      type: Number
    }
  },
  data() {
    return {
      varDataObj: {},
      queryActiveNames: "",
      // processApiParamsList: [],
      queryConfigs: [],
      operatorMap: [
        {
          name: '=',
          value: '='
        }, {
          name: '!=',
          value: '!='
        }, {
          name: '>',
          value: '>'
        }, {
          name: '<',
          value: '<'
        }, {
          name: '>=',
          value: '>='
        }, {
          name: '<=',
          value: '<='
        }, {
          name: '包含',
          value: 'include'
        }, {
          name: '前包含',
          value: 'beforeInclude'
        }, {
          name: '后包含',
          value: 'afterInclude'
        }
      ],

      // 接口获取
      
    };
  },
  watch: {},
  created() {
    if (!this.interfaceDataConfig.queryConfigs) {
      this.$set(this.interfaceDataConfig, "queryConfigs", []);
    }
    this.queryConfigs = this.interfaceDataConfig.queryConfigs;
    this.varDataObj = this.$pageDataModelEngine.getCustomData();
    for(var key in this.varDataObj){
      if(this.varDataObj[key].type&&this.varDataObj[key].type=='pageParam'){
        if(this.varDataObj[key].linkPageIndex != this.chooseSubpageIndex){
          delete this.varDataObj[key]
        }
      }
    }
   
  },
  mounted() {},
  methods: {
    changeColumnItemName(item, selectItemList) {
      selectItemList.forEach(optionItem => {
        if (item.param_name === optionItem.name) {
          item.displayName = optionItem.displayName
          item.fieldType = optionItem.fieldType || optionItem.type
        }
      })
    },
    onSelectParamKey(item) {
      item.param_value = this.varDataObj[item.param_v_key];
    },
    linkComponent(paramsItem) {
      let uuid = paramsItem.relevanceComponentUuid;
      this.componentUuidList.forEach((item) => {
        if (item.uuid === uuid) {
          paramsItem.param_value = item.options.value;
        }
      });
    },
    handleAddColumn() {
      let obj = {
        param_name: '',
        param_value: '',
        param_value_type: ''
      }
      this.interfaceDataConfig.queryConfigs.push(obj);
    },
    handleOptionsRemove(index) {
      this.interfaceDataConfig.queryConfigs.splice(index, 1);
    },
    handleChange(data, paramItem){
      if (paramItem.param_value_type == "T") {
        paramItem.relevanceComponentUuid = data[1].id;
        this.linkComponent(paramItem);
      } else {
        paramItem.param_v_key = data[1].id;
        // 注意这里只处理了页面入参，别的还没处理
        paramItem.param_value = data[1].data.value.operateHrefPageParamValue;
      }
    }
  },
};
</script>
<style scoped lang="scss">
.panel-del-btn {
  position: absolute;
  right: 5px;
  padding: 4px;
}
/deep/.el-collapse-item__header {
  padding-left: 20px;
}
/deep/.el-form-item__label{
    float: none;
    display: inline-block;
    text-align: left;
    padding: 0 0 10px;
}
/deep/.el-collapse-item__arrow {
  position: absolute;
  margin: 0;
  left: 25px;
}
// 覆写el-label
.label-left /deep/.el-form-item__label {
  float: left;
}
</style>
