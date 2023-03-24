<template>
  <div>
    <span style="font-weight: bold;">主键值</span>
    <div>
      <valueSelect :paramItem="componentConfig.options" @handleChange="handleChange" style="padding: 10px 0px; "/> 

      <!-- <el-form>
      <el-radio-group
              v-model="componentConfig.options.param_value_type"
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
            <el-form-item label="" v-if="componentConfig.options.param_value_type === 'T'">
              <el-select
                v-model="componentConfig.options.relevanceComponentUuid"
                filterable
                placeholder="请选择"
                @change="linkComponent(componentConfig.options)"
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
            <el-form-item label="" v-if="componentConfig.options.param_value_type === 'V'">
              <el-select
                v-model="componentConfig.options.param_v_key"
                filterable
                placeholder="请选择"
                style="padding-top: 10px"
                @change="onSelectParamKey(componentConfig.options)"
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
            <div style="padding-top: 10px" v-if="componentConfig.options.param_value_type === 'C'">
              <el-input v-model="componentConfig.options.primaryKey"></el-input>
            </div>
            </el-form> -->
    </div>
    <span style="font-weight: bold;">输入项配置</span>
        <div  v-for="(item, index) in inputComponentList" :key="index" class="form-input-item"> 
          <el-input v-model="item.options.label" style="width: 100px;margin-right:10px" />
          <el-select v-model="item.options['databaseField']" placeholder="请选择" @change="changeTableFieldType(item)">
            <el-option v-for="item in tableFieldList" :key="item.columnName" :label="item.columnName" :value="item.columnName"></el-option>
          </el-select>
        </div>
        <!-- <el-collapse v-model="activeNames">
          <draggable
            tag="ul"
            v-bind="{
              group: { name: 'options' },
              ghostClass: 'ghost',
              handle: '.drag-item',
            }"
            :list="inputComponentList"
            handle=".drag-item"
            @end="onDragMoveEnd"
          >
            <el-collapse-item
              :name="index"
              v-for="(item, index) in inputComponentList"
              :key="index"
            >
              <template slot="title">
                {{ item.options["databaseField"] }}
                <i
                  class="drag-item drag-item-handle"
                  style="font-size: 16px; margin: 0 5px; cursor: move"
                >
                </i>
              </template>
              <el-form size="small" style="padding-left: 20px">
                <el-form-item label="字段">
                  <el-select
                    v-model="item.options['databaseField']"
                    placeholder="请选择"
                    @change="changeTableFieldType(item)"
                  >
                    <el-option
                      v-for="item in tableFieldList"
                      :key="item.columnName"
                      :label="item.columnName"
                      :value="item.columnName"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="config.labelName"
                  v-for="(config, index) in collapsePanelColumnsConfigs"
                  :key="index"
                >
                  <el-input
                    v-model="item.options[config.key]"
                    :placeholder="config.placeholder"
                    size="mini"
                    style="width: 100px"
                    v-if="config.formType === 'input'"
                  />
                  <el-select
                    v-model="item.type"
                    placeholder="请选择"
                    v-if="config.formType === 'select'"
                    @change="changeType(item.options[config.key],item,index)"
                  >
                    <el-option
                      v-for="item in config.typeConfigs"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-switch
                    v-if="config.formType === 'switch'"
                    v-model="item.options[config.key]"
                  >
                  </el-switch>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </draggable>
        </el-collapse> -->
        <!-- <div style="margin-left: 20px;">
          <el-button type="text" @click="handleAddColumn">{{
            "添加输入项"
          }}</el-button>
        </div> -->
  </div>

</template>

<script>
import Draggable from "vuedraggable";
import { EventBus } from "@/util/event-bus.js";
import { coverBigComponent } from "@/views/report/utils/common-const";
import componentsConfigs from "@/views/report/pc/components/configs/form/form/module/index";
import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";
import { generateUUID } from "@/views/report/utils/index.js";
import store from "@/store";
import Template from "@/views/report/mobile/components/configs/chart/list/template.vue";
import Split from '@/views/process/split-pane/split.vue';
import valueSelect from "@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue";
let componentTypeMap = {
  input: "van-design-field",
  select: "van-design-select",
  radio: "van-design-radio",
  timePicker: "van-design-datetime-picker",
  checkbox: "van-design-checkbox",
  cascade: "van-design-cascade",
};
export default {
  name: "columns-config",
  components: {
    Draggable,
    Template,
    Split,
    valueSelect,
  },
  // props: {
  //   componentConfig: {
  //     type: Object,
  //     default: () => {
  //       return {}
  //     }
  //   }
  // },
  props: [
    // "addBtnText",
    "columnsConfigs",
    "addColumnConfig",
    "panelLabelPosition",
    "componentConfig",
    "componentUuidList",
  ],
  data() {
    return {
      activeNames: ["1"],
      varDataObj: {},
      inputComponentList: [],
      tableFieldList: [],
      collapsePanelColumnsConfigs: [],
      // valueTemp: ''
    };
  },
  watch: {
    componentConfig: {
      deep: true,
      handler(vals) {
        console.log("watch componentConfig", vals, this.inputComponentList);
        
        this.interfaceData = this.$pageDataModelEngine.getInterfaceData();
        this.interfaceData&&this.interfaceData.forEach(item=>{
          if(item.id==vals.options.interfaceDataConfig.uuid){
            this.tableFieldList=item.data.tableFieldList;
          }
        })
        this.inputComponentList = [];
        this.handleComponentConfig(
          this.componentConfig.options.columns[0].componentList,
          this.inputComponentList
        );
      },
    },
  },

  mounted() {
    this.varDataObj = this.$pageDataModelEngine.getCustomData();
    // 把所有的componentConfig 递归找出所有的van-design-field 放到componentList
    this.tableFieldList = [];
    this.componentConfig.configList.forEach((config) => {
      if (config.formType === "form-config") {
        this.collapsePanelColumnsConfigs = config.collapsePanelColumnsConfigs;
      }
    });
 
    // this.tableFieldList = [];
    // let tableData = this.componentConfig.options.interfaceDataConfig
    //   .tableData[0];
    // for (var key in tableData) {
    //   this.tableFieldList.push({ name: key });
    // }
    this.interfaceData = this.$pageDataModelEngine.getInterfaceData();
    this.interfaceData&&this.interfaceData.forEach(item=>{
      if(item.id==this.componentConfig.options.interfaceDataConfig.uuid){
        this.tableFieldList=item.data.tableFieldList;
      }
    })
    this.inputComponentList = [];
    this.handleComponentConfig(
      this.componentConfig.options.columns[0].componentList,
      this.inputComponentList
    );
  },
  methods: {
    onDragMoveEnd() {
      this.componentConfig.options.reloadView = false;
      this.$nextTick(() => {
        this.componentConfig.options.reloadView = true;
      });
    },
    changeConfigValue(configOptions, configKey, value) {
      configOptions[configKey] = value;
    },
    handleAddColumn() {
      let obj = (this.addColumnConfig &&
        !this.isEmptyObject(this.addColumnConfig) &&
        JSON.parse(JSON.stringify(this.addColumnConfig))) || {
        title: "",
      };

      this.initComponentConfig(obj);
      this.inputComponentList = [];
      this.handleComponentConfig(
        this.componentConfig.options.columns[0].componentList,
        this.inputComponentList
      );
    },
    handleOptionsRemove(index, uuid) {
      //TODO
      // this.columnsConfigs[0].componentList.splice(index, 1);
      // this.inputComponentList = [];
      // this.handleComponentConfig(
      //   this.columnsConfigs[0].componentList,
      //   this.inputComponentList
      // );
    },
    isEmptyObject(obj) {
      for (let key in obj) {
        return false;
      }
      return true;
    },
    changeTableFieldType(fieldName, columnsConfigItem) {
      this.tableFieldList.forEach((item) => {
        if (fieldName === item.columnName) {
          columnsConfigItem["databaseFieldType"] = item.dataType;
        }
      });
    },
    changeType(name, item, index) {
      console.log("changeType", name, item, componentsConfigs);
      item.type = name;
      let formComponentsConfigs = componentsConfigs[0];
      formComponentsConfigs.forEach((configItem) => {
        // TODO 需要特殊处理 多选 以及 日期选择器
        if (configItem.type === item.type) {
          let objTemp = JSON.parse(JSON.stringify(item.options));
          for (let key in configItem.options) {
            if (!objTemp.hasOwnProperty(key)) {
              objTemp[key] = configItem.options[key];
              if (typeof configItem.options[key] === "object") {
                objTemp[key] = JSON.parse(
                  JSON.stringify(configItem.options[key])
                );
              }
            }
          }
          let newItem = this.componentDeepClone(configItem);
          newItem.uuid = generateUUID();
          newItem.options = objTemp;
          newItem.options.commonConfigAssignSign = newItem.uuid;
          newItem.options.commonConfigAssignName = newItem.name;

          item.options = newItem.options;
          item.configList = newItem.configList;
          item.icon = newItem.icon;
          item.component = newItem.component;

          // this.columnsConfigs[0].componentList[index] = newItem
        }
      });
    },
    handleComponentConfig(
      componentConfigList,
      componentList,
      isResetUUID = false
    ) {
      componentConfigList.forEach((item) => {
        let type = item.type;
        if (
          coverBigComponent.indexOf(type) !== -1 &&
          item.options.columns &&
          item.options.columns.length
        ) {
          item.options.columns.forEach((columns) => {
            if (columns.componentList && columns.componentList.length) {
              // let tempComponentList = [];
              this.handleComponentConfig(
                columns.componentList,
                componentList,
                isResetUUID
              );
              // columns.componentList = tempComponentList;
            }
          });
        }
        for (var key in componentTypeMap) {
          if (componentTypeMap[key] === item.type) {
            componentList.push(item);
          }
        }
      });
    },
    handleComponentItem(componentConfigList, component, isResetUUID = false) {
      componentConfigList.forEach((item) => {
        let type = item.type;
        if (
          coverBigComponent.indexOf(type) !== -1 &&
          item.options.columns &&
          item.options.columns.length
        ) {
          item.options.columns.forEach((columns) => {
            if (columns.componentList && columns.componentList.length) {
              // let tempComponentList = [];
              this.handleComponentConfig(
                columns.componentList,
                component,
                isResetUUID
              );
              // columns.componentList = tempComponentList;
            }
          });
        }
        if (item.uuid == component.uuid) {
          // console.log(item, "item");
        }
      });
    },
    initComponentConfig(objTemp) {
      let formComponentsConfigs = componentsConfigs[0];
      if (!objTemp.uuid) {
        let type = objTemp.type || "van-design-field";
        formComponentsConfigs.forEach((configItem) => {
          if (configItem.type === type) {
            for (let key in configItem.options) {
              if (!objTemp.hasOwnProperty(key)) {
                objTemp[key] = configItem.options[key];
                if (typeof configItem.options[key] === "object") {
                  objTemp[key] = JSON.parse(
                    JSON.stringify(configItem.options[key])
                  );
                }
              }
            }
            //  this.columnsConfigs[0].componentList.splice( this.columnsConfigs[0].componentList.length, 1, objTemp) // 使vue侦听数据变化
            let newItem = this.componentDeepClone(configItem);
            newItem.uuid = generateUUID();
            newItem.options = objTemp;
            newItem.options.commonConfigAssignSign = newItem.uuid;
            newItem.options.commonConfigAssignName = newItem.name;
            this.componentConfig.options.columns[0].componentList.push(newItem);
            // this.options.reloadView = false
            // this.$nextTick(() => {
            //   this.options.reloadView = true
            // })
          }
        });
      }
    },
    linkComponent(paramsItem) {
      let uuid = paramsItem.relevanceComponentUuid;
      this.componentUuidList.forEach((item) => {
        if (item.uuid === uuid) {
          paramsItem.primaryKey = item.options.value;
        }
      });
    },
    onSelectParamKey(item) {
      item.primaryKey = this.varDataObj[item.param_v_key];
    },
    handleChange(data, paramItem){
       console.log("handleChange", data, paramItem);
      if (paramItem.param_value_type == "T") {
        paramItem.relevanceComponentUuid = data[1].id;
        this.linkComponent(paramItem);
      } else {        
        paramItem.param_v_key = data[1].id;
        paramItem.param_value = data[1].data.value.operateHrefPageParamValue;
      }
    },
    componentDeepClone,
  },
};
</script>

<style lang="scss" scoped>
.table-column-item {
  border: 1px solid #999;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  .iconfont {
    &.active {
      color: #197aff;
    }
  }
}
.form-input-item{
  display: flex;
  margin-top:20px;
}
</style>
