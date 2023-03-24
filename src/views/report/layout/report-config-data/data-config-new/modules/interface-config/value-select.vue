<template>
  <div class="value-config">
    <el-cascader
      size="small"
      v-model="cascaderValueTemp"
      :placeholder="placeholder"
      :options="dataConfigOptions"
      :props="{ checkStrictly: true }"
      clearable
      @change="handleChange"
    ></el-cascader>
  </div>
</template>

<script>
// modules
import { inputInterfaceComponent } from "@/views/report/utils/common-const";
import { pickInputComponentList } from "@/views/report/utils/deal-component-data/transform-component-list";
import { getProcesseDataList, getReportInterfaceList } from "@/api/chartsData";
import { getProcessParamService } from "@/api/process";
import { getVarTreeService } from "@/api/globalVariable";
import {
  getFunctionList,
} from "@/api/function.js";
export default {
  name: "valueSelect",
  components: {},
  props: {
    paramItem: {
      type: Object,
      default: {},
    },
    isBind: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      cascaderValueTemp: {},
      dataConfigOptions: [],
      customOptions: [],
      customInterfaceOptions: [],
      componentOptions: [],
      interfaceOptions: [],
      interfaceApiAll: [],
      globalOptions: [],
      functionOptions: [
        {
          value: 'function',
          label: '函数',
          children: []
        },
        {
          value: 'script',
          label: '脚本',
          children: []
        }
      ],
    };
  },
  // watch: {
  //   componentConfig: {
  //     deep: true,
  //     handler(){
  //       console.log('yyyyyyyyyy', this.componentConfig)
  //     }
  //   }
  // },
  computed: {},
  created() {
    this.initDataConfigOptions();
  },
  mounted() {},
  methods: {
    /**
     * 级联选择各组件的层级判断
     *
     * 页面入参数据最多两层
     * 组件数据最多两层
     * 后端服务最多三、四层
     * 数据表最多三层
     * 数据集最多三层
     * 脚本函数四到五层
     */
    handleChange(data) {
      console.log("val -handleChange", data);
      console.log("val -paramItem", JSON.stringify(this.paramItem));
      if (data.length > 0) {
        if (data[0].type == "component") {
          this.paramItem.param_value_type = "T";
        } else if (data[0].type == "custom") {
          this.paramItem.param_value_type = "V";
          delete this.paramItem.relevanceComponentUuid;
        } else if (data[0].type == "customInterface") {
          this.paramItem.param_value_type = "V";
          delete this.paramItem.relevanceComponentUuid;
        } else if (data[0].type == "function") {
          this.paramItem.param_value_type = "F";
          this.paramItem.type = data[1];
          // this.paramItem.middle = data[data.length - 3].id
          // this.paramItem.param_v_key = data[data.length - 1]
          delete this.paramItem.relevanceComponentUuid;
        } else if (
          data[0].type == "radio-button-tables" ||
          data[0].type == "radio-button-interface" ||
          data[0].type == "radio-button-connect"
        ) {
          this.paramItem.param_value_type = "B";
          delete this.paramItem.relevanceComponentUuid;
        } else if (data[0].type == "global") {
          this.paramItem.param_value_type = "G";
          this.paramItem.middle = data[1].id;
          this.paramItem.param_v_key = data[2].data;
        }
      } else {
        delete this.paramItem.relevanceComponentUuid;
        delete this.paramItem.param_value_type;
        delete this.paramItem.type;
      }

      this.$emit("handleChange", data, this.paramItem);
    },
    checkDataInputType(componentDataInputType, level, dataSourceType, dataMap) {
      let resData = dataMap[level];
      if (dataSourceType === "component" || dataSourceType === "custom") {
        // 如果是页面入参、组件数据来源，强制data为字符串类型
        resData = "";
      }
      if (componentDataInputType === "Array") {
        return typeof resData === "object";
      } else if (componentDataInputType === "Atom") {
        if (dataSourceType === "component") {
          return typeof resData !== "object";
        } else if (dataSourceType === "custom") {
          // 页面入参 处理
          return typeof resData !== "object";
        } else {
          return typeof resData === "object";
        }
      } else {
        return false;
      }
    },
    /**
     * --------------- 初始化字段配置数据 ------------------
     */
    initDataConfigOptions() {
      this.initCustomOptions();
      this.initComponentOptions();
      if (this.isBind) {
        this.initInterfaceOptions();
      }
      this.initCustomInterfaceOptions();
      this.initGlobalOptions();
      this.initFunctionOption()
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
        {
          value: {
            type: "function",
            id: "function",
            data: {},
          },
          label: "函数脚本",
          children: this.functionOptions,
        },
        /********************************** Table分页 Start ************************************/
        // {
        //   label: '分页配置',
        //   value: {
        //     type: "custom",
        //     id: 'pageConfig',
        //     data: {}
        //   },
        //   children: [
        //     {
        //       label: '选定行数据',
        //       value: {
        //         type: "custom",
        //         id: `rowdata`,
        //         data: {
        //           value: 'aaaa'
        //         }
        //       },
        //     }, {
        //       label: '每页行数',
        //       value: {
        //         type: "custom",
        //         id: `rownum`,
        //         data: {
        //           value: 'pageSize'
        //         }
        //       },
        //     }, {
        //       label: '当前页号',
        //       value: {
        //         type: "custom",
        //         id: `pagenum`,
        //         data: {
        //           value: 'current'
        //         }
        //       },
        //     }
        //   ]
        // }
        /********************************** Table分页 End ************************************/
      ];
      this.dataConfigOptions = dataConfigOptions.concat(this.interfaceOptions);
      this.dataConfigOptions = this.dataConfigOptions.concat(
        this.customInterfaceOptions
      );
      // this.dataConfigOptions = dataConfigOptions;
      this.dataConfigOptions = this.dataConfigOptions.filter((v) => v.label); // 把所有没有label的item都过滤掉 @宇清 检查代码
      this.echoCascader();
    },
    echoCascader() {
      // 回显代码
      console.log('echoCascader====', JSON.stringify(this.paramItem))
      if (this.paramItem.param_value_type === "T") {
        this.componentOptions.forEach((componentOption) => {
          if (
            componentOption.value.id == this.paramItem.relevanceComponentUuid
          ) {
            if (["pagenum", "rownum"].includes(this.paramItem.param_v_key)) {
              // Table 分页配置回显
              const children = componentOption.children || [];
              children.forEach((item) => {
                if (item.value.data.value === this.paramItem.param_v_key) {
                  this.cascaderValueTemp = [
                    this.dataConfigOptions[1].value,
                    componentOption.value,
                    item.value,
                  ];
                }
              });
            } else {
              this.cascaderValueTemp = [
                this.dataConfigOptions[1].value,
                componentOption.value,
              ];

              // Table 行选择配置回显
              if (this.paramItem.param_v_key === "rowdata") {
                componentOption.children.forEach((item) => {
                  if (item.value.data.value === this.paramItem.param_v_key) {
                    this.cascaderValueTemp = [
                      this.dataConfigOptions[1].value,
                      componentOption.value,
                      item.value,
                    ];
                  }
                });
              }
            }
          }
        });
      } else if (this.paramItem.param_value_type === "V") {
        if (this.paramItem.type == "customInterface") {
          let existFlag = false;
          this.customInterfaceOptions.forEach((ciOption) => {
            if (this.paramItem.operateApiId == ciOption.value.id) {
              existFlag = true;
              ciOption.children &&
                ciOption.children.forEach((cItem) => {
                  if (cItem.label == this.paramItem.param_v_key) {
                    this.cascaderValueTemp = [ciOption.value, cItem.value];
                  }
                });
            }
          });
          if (!existFlag) {
            // 这边的回显做个特别处理，如果没有读取到 那就拿到id重新请求一边保证 一定可以回显到接口值
            this.queryInterfaceDataList(this.paramItem.operateApiId);
          }
        } else {
          this.customOptions.forEach((customOption) => {
            if (customOption.value.id == this.paramItem.param_v_key) {
              this.cascaderValueTemp = [
                this.dataConfigOptions[0].value,
                customOption.value,
              ];
            }
          });
        }
      } else if (this.paramItem.param_value_type === "B") {
        console.log("paramItem=", this.paramItem);
        console.log(
          "interfaceListData",
          this.dataConfigOptions,
          this.interfaceOptions
        );
        this.interfaceOptions.forEach((iItem) => {
          //2021-08-10 这里面回显需不需要 判断类型，后面看
          if (this.paramItem.type == "radio-button-tables") {
            if (iItem.label == this.paramItem.param_v_table) {
              iItem.children.forEach((child) => {
                if (child.label == this.paramItem.param_v_key) {
                  this.cascaderValueTemp = [iItem.value, child.value];
                }
              });
            }
          } else if (
            this.paramItem.type == "radio-button-interface" ||
            this.paramItem.type == "radio-button-connect"
          ) {
            if (iItem.label == this.paramItem.param_v_name) {
              iItem.children.forEach((child) => {
                if (child.label == this.paramItem.middle) {
                  if (child.children) {
                    // 2022-02-25 这里是原来的数组列表绑定值
                    child.children.forEach((last) => {
                      if (last.label == this.paramItem.param_v_key) {
                        this.cascaderValueTemp = [
                          iItem.value,
                          child.value,
                          last.value,
                        ];
                      }
                      // else if(this.paramItem.actionType=='status-operate-set'){
                      //   // 2022-12-03 Table渲染器功能，(状态渲染器 --> 组件设值)的配置回显
                      //   this.cascaderValueTemp = [iItem.value, child.value];
                      // }
                    });
                  } else {
                    this.cascaderValueTemp = [iItem.value, child.value];
                  }
                }
              });
            }
          }
        });
      } else if (this.paramItem.param_value_type === "F") {
        this.dataConfigOptions[3].children.forEach(child => {
          if (this.paramItem.type === child.value) {
            child.children.forEach(child2 => {
              if (this.paramItem.middle != undefined && this.paramItem.middle.length > 0) {
                //middle有值,代表函数脚本在分组中
                if (this.paramItem.middle === child2.value.id) {
                  if (child2.children != undefined && child2.children.length > 0) {
                    child2.children.forEach(child3 => {
                      if (this.paramItem.operateApiId === child3.value.id) {
                        if (child3.children != undefined && child3.children.length > 0) {
                          child3.children.forEach(child4 => {
                            if (this.paramItem.param_v_key === child4.value.id) {
                              this.cascaderValueTemp = [
                                this.dataConfigOptions[3].value,
                                child.value,
                                child2.value,
                                child3.value,
                                child4.value,
                              ];
                            }
                          })
                        }
                      }
                    })
                  }
                }
              } else {
                if (this.paramItem.operateApiId === child2.value.id) {
                  if (child2.children != undefined && child2.children.length > 0) {
                    child2.children.forEach(child3 => {
                      if (this.paramItem.param_v_key === child3.value.id) {
                        this.cascaderValueTemp = [
                          this.dataConfigOptions[3].value,
                          child.value,
                          child2.value,
                          child3.value,
                        ];
                      }
                    })
                  }
                }
              }
            })
          }
        })
      } else if (this.paramItem.param_value_type === "G") {
        if (
          this.dataConfigOptions[2].label == "全局变量" &&
          this.dataConfigOptions[2].children.length > 0
        ) {
          this.dataConfigOptions[2].children.forEach((scopeChild) => {
            if (scopeChild.value.id == this.paramItem.middle) {
              scopeChild.children.forEach((child) => {
                if (child.value.data == this.paramItem.param_v_key) {
                  this.cascaderValueTemp = [
                    this.dataConfigOptions[2].value,
                    scopeChild.value,
                    child.value,
                  ];
                }
              });
            }
          });
        }
      }

    },
    initCustomOptions() {
      let chooseSubpageIndex = this.$store.getters.chooseSubpageIndex;
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
    initGlobalOptions() {
      getVarTreeService().then((res) => {
        let tempTree = res.dataList;
        tempTree &&
          tempTree.forEach((temp) => {
            let tempChildren = [];
            // 格式处理
            temp.children &&
              temp.children.forEach((tchild) => {
                let single = {
                  label: tchild.variableKey,
                  value: {
                    type: "global",
                    id: tchild.id,
                    data: tchild.variableKey,
                  },
                };
                tempChildren.push(single);
              });
            this.globalOptions.push({
              label: temp.scopeName,
              value: {
                type: "global",
                id: temp.scopeId,
              },
              children: tempChildren,
            });
          });
        //接口回显的延时问题
        this.echoCascader();
      });
    },
    initFunctionOption() {
      getFunctionList({
        dataType: 'report',
        functionType: 'function'
      }).then(res => {
        this.functionOptions[0].children = this.renameFunctionItem(res.dataList || [])
        // console.log('functionOptions[0]===', JSON.stringify(this.functionOptions[0].children))
      })
      getFunctionList({
        dataType: 'report',
        functionType: 'script'
      }).then(res => {
        this.functionOptions[1].children = this.renameFunctionItem(res.dataList || [])
        // console.log('functionOptions[1]===', JSON.stringify(this.functionOptions[1].children))
      })
    },

    parseFunctionReturnValue(value) {
      if (value === undefined || value === null) {
        return undefined
      }
      let returnObj = JSON.parse(value)
      let returnParams = []
      for (let prop in returnObj) {
        if (returnObj.hasOwnProperty(prop)) {
          returnParams.push({
            value: {
              type: "function",
              id: prop,
              data: prop
            },
            label: prop,
            children: undefined
          })
        }
      }

      return returnParams
    },

    renameFunctionItem(list) {
      let renamedList = []
      for (const scriptListElement of list) {
        let renamedItem = {
          value: {
            type: "function",
            id: scriptListElement.queryId,
            data: scriptListElement.queryId,
          },
          label: scriptListElement.name,
          children: []
        }
        if (scriptListElement.children != undefined && scriptListElement.children.length > 0) {
          for (const scriptListElementElement of scriptListElement.children) {
            renamedItem.children.push({
              value: {
                type: "function",
                id: scriptListElementElement.queryId,
                data: scriptListElementElement.queryId,
              },
              label: scriptListElementElement.name,
              children: this.parseFunctionReturnValue(scriptListElementElement.functionOutput)
            })
          }
        } else if (scriptListElement.dataType === 'report') {
          //dataType === 'report'代表是脚本,'scope'代表分组
          renamedItem.children = this.parseFunctionReturnValue(scriptListElement.functionOutput)
        }
        renamedList.push(renamedItem)
      }
      return renamedList
    },

    queryInterfaceDataList(id) {
      getReportInterfaceList().then((res) => {
        this.interfaceApiAll = res.dataList;
        // this.queryProcessApiResService(id);
        this.queryProcessApiParamAndRes(id);
      });
    },
    queryProcessApiParamAndRes(id) {
      const data = {
        processId: id,
      };
      getProcessParamService(data).then((res) => {
        let interfaceName = res.data.processName;
        let obj = {
          label: interfaceName, // 依次判断数据接口、数据表、数据集
          value: {
            type: "customInterface",
            id: id,
            // data: res.data
          },
          children: [],
        };
        res.data.res &&
          res.data.res.forEach((rItem) => {
            let children = {
              label: rItem.name,
              value: {
                type: "customInterface",
                id: rItem.name,
                data: {
                  value: "",
                },
              },
            };
            obj.children.push(children);
          });
        this.$pageDataModelEngine.saveCustomInterfaceData(id, obj);
        this.initDataConfigOptions();
      });
    },
    queryProcessApiResService(id) {
      const data = {
        dataApiId: id,
        params: {},
      };
      getProcesseDataList(data).then((res) => {
        if (res.code === 0) {
          // 2021-12-18 按照新逻辑 存取
          let interfaceName;
          this.interfaceApiAll.forEach((iItem) => {
            if (iItem.id == id) {
              interfaceName = iItem.name;
            }
          });
          let obj = {
            label: interfaceName, // 依次判断数据接口、数据表、数据集
            value: {
              type: "customInterface",
              id: id,
              // data: res.data
            },
            children: [],
          };
          for (const i in res.data) {
            let children = {
              label: i,
              value: {
                type: "customInterface",
                id: i,
                data: {
                  value: res.data[i],
                },
              },
            };
            obj.children.push(children);
          }
          this.$pageDataModelEngine.saveCustomInterfaceData(id, obj);
          this.initDataConfigOptions();
        } else {
          this.$message.error(res.message);
        }
      });
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
      const tableDeepValueArr = [];
      const treeSelectDeepValueArr = [];
      const treeDeepValeArr = [];
      this.pickInputComponentList(
        allComponenList,
        tempArr,
        inputInterfaceComponent,
        tableDeepValueArr,
        treeDeepValeArr
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
      this.componentOptions = [...this.componentOptions, ...tableDeepValueArr, ...treeDeepValeArr];
      // this.componentOptions.forEach(item => {
      //
      // })
      // console.log('组件====', JSON.stringify(this.componentOptions));
      // console.log('treeDeepValeArr====', JSON.stringify(treeDeepValeArr));
      // for (let key in componentData) {
      //   // 保留有value的组件进行选择
      //   let componentDataItem = componentData[key] || {};
      //   // 这步操作用来过滤当前页面输入组件
      //   if (
      //     componentDataItem.options &&
      //     componentDataItem.options.hasOwnProperty("value") &&
      //     inputInterfaceComponent.indexOf(componentDataItem.type) !== -1
      //   ) {
      //     this.componentOptions.push({
      //       label: componentDataItem.options.commonConfigAssignName,
      //       value: {
      //         type: "component",
      //         id: key,
      //         data: componentDataItem,
      //       },
      //     });
      //   }
      // }
    },
    initInterfaceOptions() {
      let interfaceListData = this.$pageDataModelEngine.getInterfaceData();
      this.interfaceOptions.splice(0, this.interfaceOptions.length);
      interfaceListData.forEach((item) => {
        let responseData = item.data.responseData;
        let obj = {
          label: item.data.name || item.data.tableName || item.data.dataSetName, // 依次判断数据接口、数据表、数据集
          value: {
            type: item.type,
            id: item.id,
            data: item.data,
          },
        };

        // 2021-07-05 数组不再进去解析
        if (
          responseData &&
          typeof responseData === "object" &&
          !(responseData instanceof Array)
        ) {
          for (let key in responseData) {
            let objChildrenItem = {
              label: key,
              value: {
                type: "interface",
                id: key,
                data: {
                  value: responseData[key],
                },
              },
            };
            if (!obj.children) {
              obj.children = [];
            }
            obj.children.push(objChildrenItem);
            if (
              responseData[key] &&
              typeof responseData[key] === "object" &&
              !(responseData[key] instanceof Array)
            ) {
              this.deepHandleResponse(
                objChildrenItem,
                responseData[key],
                1,
                item.type
              );
            } else if (responseData[key] instanceof Array) {
              // 列表接口
              this.deepHandleListResponse(
                objChildrenItem,
                responseData[key],
                1,
                item.type
              );
            }
          }
        } else if (item.type == "radio-button-tables") {
          if (!obj.children) {
            obj.children = [];
          }
          item.data.tableFieldList.forEach((tableField) => {
            let objChildrenItem = {
              label: tableField.columnName,
              value: {
                type: "interface",
                id: tableField.columnName,
                data: {
                  // value: responseData[key]
                },
              },
            };

            obj.children.push(objChildrenItem);
          });
        }
        this.interfaceOptions.push(obj);
      });
    },
    // 这里处理主要是事件中的内容进行请求的接口
    initCustomInterfaceOptions() {
      let customInterfaceData =
        this.$pageDataModelEngine.getCustomInterfaceData();
      this.customInterfaceOptions.splice(0, this.customInterfaceOptions.length);
      for (let key in customInterfaceData) {
        this.customInterfaceOptions.push(customInterfaceData[key]);
      }
    },
    deepHandleResponse(obj, responseData, deepNum, type) {
      deepNum++;
      obj.children = [];
      for (let key in responseData) {
        let objChildrenItem = {
          label: key,
          value: {
            type: "interface",
            id: key,
            data: {
              value: responseData[key],
            },
          },
        };
        if (
          deepNum >= 2 ||
          ["radio-button-tables", "radio-button-dataset"].indexOf(type) !== -1
        ) {
          //数据表、数据集只能选择到第一层，后端服务只能选择到第二层
          objChildrenItem.disabled = true;
        }
        obj.children.push(objChildrenItem);
        if (
          responseData[key] &&
          typeof responseData[key] === "object" &&
          !(responseData[key] instanceof Array)
        ) {
          this.deepHandleResponse(
            objChildrenItem,
            responseData[key],
            deepNum,
            type
          );
        } else if (responseData[key] instanceof Array) {
          // 列表接口
          this.deepHandleListResponse(
            objChildrenItem,
            responseData[key],
            1,
            type
          );
        }
      }
    },
    deepHandleListResponse(obj, responseData, deepNum, type) {
      // 数组处理
      obj.children = [];
      // 接口解析列表，默认取第一个
      let rItem = responseData[0];
      for (let key in rItem) {
        let objChildrenItem = {
          label: key,
          value: {
            type: "interface",
            id: key,
            data: {
              value: rItem[key],
            },
          },
        };
        obj.children.push(objChildrenItem);
      }
    },
    pickInputComponentList,
  },
};
</script>
<style scoped lang="scss">
/deep/.el-cascader .el-input .el-input__inner::-webkit-input-placeholder {
  color: #333;
}
</style>
