<template>
  <div class="border-config">
    <el-cascader
      size="small"
      v-model="cascaderValueTemp"
      :options="dataConfigOptions"
      :props="{ checkStrictly: true }"
      clearable
      @change="handleChange"
    ></el-cascader>
  </div>
</template>

<script>
// operateHrefPageParamType
import { inputInterfaceComponent } from "@/views/report/utils/common-const";
import { pickInputComponentList } from "@/views/report/utils/deal-component-data/transform-component-list";
import { getVarTreeService } from "@/api/globalVariable";
export default {
  name: "action-href",
  components: {},
  props: {
    actionSet: {
      type: Object,
      default: () => {
        return {
          param_value_type: "",
          type: "",
          param_v_key: "",
          param_value: "",
        };
      },
    },
  },
  data() {
    return {
      cascaderValueTemp: {},
      dataConfigOptions: [],
      componentOptions: [],
      customOptions: [],
      globalOptions: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.initCustomOptions();
      this.initComponentOptions();
      this.initGlobalVariables();
      let dataConfigOptions = [
        {
          value: {
            type: "custom",
            id: "custom",
            data: {},
          },
          label: "页面入参",
          children: this.customOptions,
        },
        {
          value: {
            type: "component",
            id: "component",
            data: {},
          },
          label: "组件",
          children: this.componentOptions,
        },
        {
          value: {
            type: "global",
            id: "global",
            data: {},
          },
          label: "全局变量",
          children: this.globalOptions,
        },
      ];
      this.dataConfigOptions = dataConfigOptions;
      this.echoCascader();
      // // 回显用
      // if (this.actionSet.type == "component" && this.actionSet.key) {
      //   this.componentOptions.forEach((componentOption) => {
      //     if (componentOption.value.id == this.actionSet.key) {
      //       this.cascaderValueTemp = [
      //         this.dataConfigOptions[0].value,
      //         componentOption.value,
      //       ];
      //     }
      //   });
      // } else if (
      //   this.actionSet.type == "globalVariable" &&
      //   this.actionSet.key
      // ) {
      //   this.globalOptions.forEach((item) => {
      //     if (item.value.data.variableKey == this.actionSet.key) {
      //       this.cascaderValueTemp = [
      //         this.dataConfigOptions[1].value,
      //         item.value,
      //       ];
      //     }
      //   });
      // }
    },
    echoCascader() {
      console.log("echoCascader", this.actionSet);
      // 回显代码
      if (this.actionSet.param_value_type === "T") {
        this.componentOptions.forEach((componentOption) => {
          if (
            componentOption.value.id == this.actionSet.relevanceComponentUuid
          ) {
            this.cascaderValueTemp = [
              this.dataConfigOptions[1].value,
              componentOption.value,
            ];
          }
        });
      } else if (this.actionSet.param_value_type === "V") {
        if (this.actionSet.type == "customInterface") {
          let existFlag = false;
          this.customInterfaceOptions.forEach((ciOption) => {
            if (this.actionSet.operateApiId == ciOption.value.id) {
              existFlag = true;
              ciOption.children &&
                ciOption.children.forEach((cItem) => {
                  if (cItem.label == this.actionSet.param_v_key) {
                    this.cascaderValueTemp = [ciOption.value, cItem.value];
                  }
                });
            }
          });
          if (!existFlag) {
            // 这边的回显做个特别处理，如果没有读取到 那就拿到id重新请求一边保证 一定可以回显到接口值
            this.queryInterfaceDataList(this.actionSet.operateApiId);
          }
        } else {
          this.customOptions.forEach((customOption) => {
            if (customOption.value.id == this.actionSet.param_v_key) {
              this.cascaderValueTemp = [
                this.dataConfigOptions[0].value,
                customOption.value,
              ];
            }
          });
        }
      } else if (this.actionSet.param_value_type === "B") {
        console.log("actionSet=", this.actionSet);
        console.log(
          "interfaceListData",
          this.dataConfigOptions,
          this.interfaceOptions
        );
        this.interfaceOptions.forEach((iItem) => {
          //2021-08-10 这里面回显需不需要 判断类型，后面看
          if (this.actionSet.type == "radio-button-tables") {
            if (iItem.label == this.actionSet.param_v_table) {
              iItem.children.forEach((child) => {
                if (child.label == this.actionSet.param_v_key) {
                  this.cascaderValueTemp = [iItem.value, child.value];
                }
              });
            }
          } else if (this.actionSet.type == "radio-button-interface"||
          this.actionSet.type == "radio-button-connect") {
            if (iItem.label == this.actionSet.param_v_name) {
              iItem.children.forEach((child) => {
                if (child.label == this.actionSet.middle) {
                  child.children.forEach((last) => {
                    if (last.label == this.actionSet.param_v_key) {
                      this.cascaderValueTemp = [
                        iItem.value,
                        child.value,
                        last.value,
                      ];
                    }
                  });
                }
              });
            }
          }
        });
      }else if(this.actionSet.param_value_type === "G"){
         this.globalOptions.forEach((scopeChild) => {
            if (scopeChild.value.id == this.actionSet.middle) {
              scopeChild.children.forEach(child=>{
                if(child.value.data==this.actionSet.param_v_key){
                  this.cascaderValueTemp = [
                    this.dataConfigOptions[2].value,
                    scopeChild.value,
                    child.value
                  ];
                }
              })
            }
          });
      }
    },
    initCustomOptions() {
      let customData = this.$pageDataModelEngine.getCustomData();
      this.customOptions.splice(0, this.customOptions.length);
      for (let key in customData) {
        this.customOptions.push({
          label: key,
          value: {
            type: "custom",
            id: key,
            data: {
              value: customData[key],
            },
          },
        });
      }
    },
    initComponentOptions() {
      let componentData = this.$pageDataModelEngine.getComponentData();
      let allComponenList = [];
      this.componentOptions.splice(0, this.componentOptions.length);
      for (let key in componentData) {
        let componentDataItem = componentData[key] || {};
        allComponenList.push(componentDataItem);
      }
      let tempArr = [];
      this.pickInputComponentList(
        allComponenList,
        tempArr,
        inputInterfaceComponent
      );
      tempArr &&
        tempArr.forEach((item) => {
          this.componentOptions.push({
            label: item.options.commonConfigAssignName,
            value: {
              type: "component",
              id: item.uuid,
              data: item,
            },
          });
        });
    },
    initGlobalVariables() {
     getVarTreeService().then(res=>{
        let tempTree = res.dataList;
        tempTree&&tempTree.forEach(temp=>{
          let tempChildren = [];
          // 格式处理
          temp.children&&temp.children.forEach(tchild=>{
            let single={
              label:tchild.variableKey,
              value: {
                type: "global",
                id: tchild.id,
                data: tchild.variableKey,
                value:tchild.defaultValue
              },
            }
            tempChildren.push(single);
          })
          this.globalOptions.push({
            label:temp.scopeName,
            value: {
              type: "global",
              id: temp.scopeId,
            },
            children:tempChildren
          })
        })
        //接口回显的延时问题
        this.echoCascader();
      })
      
    },
    handleChange(data) {
      console.log("value-set", data);
      // if (data.length > 1) {
      //   let info = {
      //     type: data[0].type,
      //     key: data[1].data.variableKey,
      //   };
      //   this.$emit("chosenActionSet", info);
      // }

      if (data[0].type == "component") {
        this.actionSet.param_value_type = "T";
      } else if (data[0].type == "custom") {
        this.actionSet.param_value_type = "V";
        delete this.actionSet.relevanceComponentUuid;
      } else if (data[0].type == "customInterface") {
        this.actionSet.param_value_type = "V";
        delete this.actionSet.relevanceComponentUuid;
      } else if (data[0].type == "global") {
        this.actionSet.param_value_type = "G";
        delete this.actionSet.relevanceComponentUuid;
      }
      this.$emit("chosenActionSet", data, this.actionSet);
    },
    pickInputComponentList,
  },
};
</script>

<style lang="scss" scoped>
</style>
