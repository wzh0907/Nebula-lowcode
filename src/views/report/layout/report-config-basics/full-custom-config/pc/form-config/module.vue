<template>
  <div style="margin-top: 32px;">
    <el-collapse v-model="activeNames">
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
            <!-- 暂时注释删除和移动 -->
            <!-- <el-button
              class="panel-del-btn"
              circle
              plain
              type="danger"
              size="mini"
              icon="el-icon-minus"
              @click="handleOptionsRemove(index,item.uuid)"
            /> -->
            <i
              class="drag-item drag-item-handle"
              style="font-size: 16px; margin: 0 5px; cursor: move"
            >
              <!-- <i class="iconfont iconbar" /> -->
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
                  v-for="item in dataTableFieldList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
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
              <!-- 下拉框 -->
              <el-select
                v-model="item.options[config.key]"
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
              <!-- 滑块开关 -->
              <el-switch
                v-if="config.formType === 'switch'"
                v-model="item.options[config.key]"
              >
              </el-switch>
              <!-- 列名、列值配置项 -->
              <!-- <columnsValuesConfig
                v-if="config.formType === 'columns-values-config'"
                :columnsConfigs="item[config.key]"
                :addBtnText="config.addBtnText"
                :itemKey="config.itemKey || 'label'"
                :addColumnConfig="config.addColumnConfig"
              /> -->
              <!-- 图标选择 -->
              <!-- <iconUpload
                :iconSrc="item[config.key]"
                @changeConfigValue="changeConfigValue"
                :configOptions="item"
                :configKey="config.key"
                v-if="config.formType === 'icon-upload'"
              /> -->
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </draggable>
    </el-collapse>
    <div style="margin-left: 20px;">
      <el-button type="text" @click="handleAddColumn">{{
        "添加输入项"
      }}</el-button>
    </div>
  </div>
</template>

<script>
import { coverBigComponent } from "@/views/report/utils/common-const";
  let componentTypeMap = {
        input: "van-design-field",
        select: "van-design-select",
        radio: "van-design-radio",
        timePicker:"van-design-datetime-picker",
        checkbox:"van-design-checkbox",
        cascade:"van-design-cascade"
      };
import Draggable from "vuedraggable";
import componentsConfigs from "@/views/report/pc/components/configs/form/form/module/index";
import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";
import { generateUUID } from "@/views/report/utils/index.js";
export default {
  name: "columns-config",
  components: {
    Draggable,
    // iconUpload,
    // columnsValuesConfig,
    // radioButtonGroup,
  },
  props: [
    // "addBtnText",
    "columnsConfigs",
    "collapsePanelColumnsConfigs",
    "addColumnConfig",
    "panelLabelPosition",

    "dataTableFieldList",
    "componentConfig",
  ],
  data() {
    return {
      activeNames: ["1"],
      inputComponentList: [],
    };
  },
  watch: {
    // 'options.inputItoptionsemConfigs': {
    //   deep: true,
    //   handler(vals) {
    //     console.log(vals,"watch options.inputItoptionsemConfigs")
    //     vals && vals[0].componentList.forEach && this.initComponentConfig(vals[0].componentList)

    //   }
    // },
    "columnsConfigs": {
      deep: true,
      handler(vals) {
        this.inputComponentList = [];
        this.handleComponentConfig(
          this.columnsConfigs[0].componentList,
          this.inputComponentList
        );
      },
    },
  },
  mounted() {
    // 把所有的componentConfig 递归找出所有的van-design-field 放到componentList
    this.inputComponentList = [];
    this.handleComponentConfig(
      this.columnsConfigs[0].componentList,
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
        this.columnsConfigs[0].componentList,
        this.inputComponentList
      );

    },
    handleOptionsRemove(index,uuid) {
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
      this.dataTableFieldList.forEach((item) => {
        if (fieldName === item.name) {
          columnsConfigItem["databaseFieldType"] = item.type;
        }
      });
    },
    changeType(name,item,index){
      item.type=componentTypeMap[name];
      let formComponentsConfigs = componentsConfigs[0];
      formComponentsConfigs.forEach((configItem) => {
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
        for(var key in componentTypeMap){
          if(componentTypeMap[key]===item.type){
          componentList.push(item);

          }
        }

      });
    },
    handleComponentItem(
      componentConfigList,
      component,
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
        let type = objTemp.type || "input";
        formComponentsConfigs.forEach((configItem) => {
          if (configItem.type === componentTypeMap[type]) {
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
            this.columnsConfigs[0].componentList.push(newItem);
            // this.options.reloadView = false
            // this.$nextTick(() => {
            //   this.options.reloadView = true
            // })
          }
        });
      }
    },
    componentDeepClone,
  },
};
</script>

<style lang="scss" scoped>
.drag-item-handle {
  position: absolute;
  right: 30px;
  padding: 4px;
  padding-top: 8px;
}
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
// .label-left /deep/.el-form-item__label {
//   float: left;
// }
</style>
