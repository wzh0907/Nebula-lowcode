<template>
  <div class="value-config" style="padding: 10px 0px;">
    <el-cascader
      size="small"
      clearable
      v-model="cascadeValueTemp"
      :options="dataConfigOptions"
      :props="{ checkStrictly: true }"
      @change="testHandleChange"></el-cascader>
  </div>
</template>

<script>
// modules
import { EventBus } from "@/util/event-bus.js";
import { componentDataTypes } from "@/views/report/utils/common-const";
import { inputInterfaceComponent } from "@/views/report/utils/common-const";
import { pickInputComponentList } from "@/views/report/utils/deal-component-data/transform-component-list";
import {getVarTreeService} from "@/api/globalVariable";
export default {
  components: {},
  props: {
    componentConfig: {
      type: Object,
      default: {},
    },
    echoConfig:{
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cascadeValueTemp: [],
      dataConfigOptions: [],
      customOptions: [],
      componentOptions: [],
      interfaceOptions: [],
      globalOptions:[],
    };
  },
  computed: {
    // cascaderPlaceholder() {
    //   const interfaceDataConfig =
    //     this.componentConfig.options.interfaceDataConfig;
    //     if(this.echoConfig){
    //       interfaceDataConfig =
    //         this.componentConfig.options.interfaceDataEchoConfig;
    //     }
    //   const contentDataSource = this.componentConfig.options.contentDataSource;
    //   let placeholderStr = "";
    //   if (contentDataSource === "custom") {
    //     placeholderStr = "页面入参";
    //   } else if (contentDataSource === "component") {
    //     placeholderStr = "组件";
    //   } else if (contentDataSource === "radio-button-interface") {
    //     placeholderStr = "后端服务：" + (interfaceDataConfig.name || "");
    //   } else if (contentDataSource === "radio-button-tables") {
    //     placeholderStr = "数据表：" + (interfaceDataConfig.tableName || "");
    //   } else if (contentDataSource === "radio-button-dataset") {
    //     placeholderStr = "数据集：" + (interfaceDataConfig.dataSetName || "");
    //   } else if (contentDataSource === "radio-button-view") {
    //     placeholderStr = "视图：" + (interfaceDataConfig.name || "");
    //   } else {
    //     placeholderStr = "";
    //   }
    //   return placeholderStr;
    // },
  },
  created() {
    console.log('value-config----created')
    this.initDataConfigOptions();
  },
  mounted() {
    // console.log('value-config----mounted')
    EventBus.$off("onChangeInterfaceData");
    EventBus.$on("onChangeInterfaceData", (data) => {
      let that = this;
      that.initDataConfigOptions();
    //   setTimeout(function () {
    // console.log('value-config----onChangeInterfaceData')

    //     that.initDataConfigOptions();
    //   }, 500);
    });
  },
  beforeDestroy() {
    EventBus.$off("onChangeInterfaceData");
  },
  methods: {
    /**
     * 级联选择各组件的层级判断
     *
     * 页面入参数据最多两层
     * 组件数据最多两层
     * 后端服务最多三、四层
     * 数据表最多三层
     * 数据集最多三层
     */
    testHandleChange(data) {
      console.log("testHandleChange", data);
      let componentDataInputType =
        componentDataTypes[this.componentConfig.type];
      let level = data.length || 0;
      let interfaceDataConfig =
        this.componentConfig.options.interfaceDataConfig;
      if(this.echoConfig){
          interfaceDataConfig =
            this.componentConfig.options.interfaceDataEchoConfig;
      }
      if(data.length==0){
        if(this.echoConfig){
          this.componentConfig.options.interfaceDataEchoConfig={
            versions:"1.0.0"
          };
        }else{
          this.componentConfig.options.interfaceDataConfig={
            versions:"1.0.0",
            value:"",
          };

        }
        return false;
      }
      let firstData = data[0] || {};
      let secondData = data[1] || {};
      let thirdData = data[2] || ""; // 第三层基本上是字符串，只有接口类型为后端服务的时候才可能是对象
      let fourData = data[3] || ""; // 这一层百分之九十九点九是字符串，如果不是的话请忽略这一层的值
      let dataSourceType = firstData.type;
      let dataMap = {
        1: firstData,
        2: secondData,
        3: thirdData,
        4: fourData,
      };
      // if (dataSourceType === 'radio-button-default') {
      //   // 静态值
      //   this.componentConfig.options.contentDataSource = dataSourceType
      //   this.componentConfig.options.interfaceDataConfig.versions = '1.0.0'
      //   return false
      // }
      // 校验配置的数据类型与该组件是否匹配
      if (
        !this.checkDataInputType(
          componentDataInputType,
          level,
          dataSourceType,
          dataMap
        )
      ) {
        // 没校验通过，停止向下执行，不进行组件赋值
        this.$message.error("当前组件不支持该数据类型");
        return false;
      }
      // 对组件进行赋值
      if (dataSourceType === "custom") {
        interfaceDataConfig.key = secondData.id;
      } else if (dataSourceType === "global"){
        interfaceDataConfig.key = thirdData.data;
        interfaceDataConfig.scope = secondData.id;

      } else if (dataSourceType === "component") {
        interfaceDataConfig.key = secondData.id;
        // let componentUUID = secondData.id
        // let value = secondData.data.options.value
      } else if (dataSourceType === "radio-button-interface"||dataSourceType === "radio-button-connect") {
        interfaceDataConfig.key = secondData.id;
        interfaceDataConfig.id = firstData.data.id;
        interfaceDataConfig.name = firstData.data.name;
        interfaceDataConfig.paramsConfigs = firstData.data.paramsConfigs;
        interfaceDataConfig.isMockData = firstData.data.isMockData;
        if (componentDataInputType === "Atom") {
          interfaceDataConfig.value = dataMap[level].data.value;
        } else {
          interfaceDataConfig.chartData &&
            (interfaceDataConfig.chartData.rows =
              firstData.data.responseData[interfaceDataConfig.key] || []);
          interfaceDataConfig.tableData =
            firstData.data.responseData[interfaceDataConfig.key] || [];
          if(this.componentConfig.type==='van-design-progress'){
            interfaceDataConfig.tableData=firstData.data.responseData
          }
        }
        delete interfaceDataConfig.dbConfigId;
        delete interfaceDataConfig.tableName;
        delete interfaceDataConfig.queryConfigs;
      } else if (dataSourceType === "radio-button-tables") {
        if (level === 1) {
          interfaceDataConfig.dbConfigId = firstData.data.businessId;
          interfaceDataConfig.tableName = firstData.data.tableName;
          interfaceDataConfig.queryConfigs = firstData.data.queryConfigs;
        }
        //2021-06-17  记录表的主键值
        firstData.data.tableFieldList.forEach((item) => {
          if (item.columnKey === "PRI") {
            interfaceDataConfig.key = item.columnName;
          }
        });
        delete interfaceDataConfig.id;
        delete interfaceDataConfig.name;
      } else if (dataSourceType === "radio-button-dataset") {
        if (level === 1) {
          interfaceDataConfig.id = firstData.data.id;
          interfaceDataConfig.dataSetName = firstData.data.dataSetName;
          interfaceDataConfig.queryConfigs = firstData.data.queryConfigs;
        }
      } else if (dataSourceType === "radio-button-view") {
        if (level === 1) {
          interfaceDataConfig.dbConfigId = firstData.data.dbConfigId;
          interfaceDataConfig.tableName = firstData.data.name;
          interfaceDataConfig.queryConfigs = firstData.data.queryConfigs;
          interfaceDataConfig.tableFieldList = firstData.data.tableFieldList;
          interfaceDataConfig.execSqlText = firstData.data.execSqlText;
        }
      }
      // 组件渲染数据
      interfaceDataConfig.uuid = firstData.id;
      if (
        typeof firstData.data.responseData === "object" &&
        [
          "radio-button-tables",
          "radio-button-dataset",
          "radio-button-view",
        ].indexOf(dataSourceType) !== -1
      ) {
        interfaceDataConfig.chartData &&
          (interfaceDataConfig.chartData.rows =
            firstData.data.responseData || []);
        interfaceDataConfig.tableData = firstData.data.responseData || [];
      }
      if(this.echoConfig){
        this.componentConfig.options.interfaceDataEchoConfig.versions = "1.0.0";
        this.componentConfig.options.contentDataEcho = dataSourceType;
      }else{
        this.componentConfig.options.contentDataSource = dataSourceType;
        this.componentConfig.options.interfaceDataConfig.versions = "1.0.0";

      }

      // 如果是列表组件需要进行数据绑定操作
      if (this.componentConfig.type === "van-design-list") {
        this.$pageDataModelEngine.saveCustomData(
          this.componentConfig.uuid,
          interfaceDataConfig.tableData || []
        );
      }


      // 更新options-config数据
      this.$emit("onUpdateOptionsConfig");
      this.$emit("onChangeValuesConfig",data);

    },
    checkDataInputType(componentDataInputType, level, dataSourceType, dataMap) {
      let resData = dataMap[level];
      if (dataSourceType === "component" || dataSourceType === "custom") {
        // 如果是页面入参、组件数据来源，强制data为字符串类型
        resData = "";
      }
      if (componentDataInputType === "Array") {
        if (dataSourceType === "custom") {
          return true;
        }else {
          return typeof resData === "object";

        }
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
      this.initInterfaceOptions();
      this.initGlobalOptions()
      let dataConfigOptions = [
        // {
        //   value: {
        //     type: 'radio-button-default',
        //     id: 'radio-button-default',
        //     data: {}
        //   },
        //   label: '静态值',
        // },
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
        },{
          value: {
            type: "global",
            id: "global",
            data: {},
          },
          label: "全局变量",
          children: this.globalOptions,
        },
      ];
      this.dataConfigOptions = dataConfigOptions.concat(this.interfaceOptions);
      this.$emit('onChangeDataConfigOptions', this.dataConfigOptions)
      // 监听组件、接口的变化，实时更新级联选择器的选项。页面入参数据就不用监听了，因为理论上它在页面加载时已经确定了，后面不会更新数据
      this.$pageDataModelEngine.onComponentDataEvent((componentData) => {
        this.initComponentOptions();
      });
      // 2022-01-24 说明 如果这边起了监听会导致预览的时候 丢失 级联选择器的值
      // this.$pageDataModelEngine.addListenerInterfaceDataEvent(
      //   (componentData) => {
      //     this.initInterfaceOptions();
      //     let dataConfigOptions = [
      //       {
      //         value: {
      //           type: "custom",
      //           id: "custom",
      //           data: {},
      //         },
      //         label: "页面入参",
      //         children: this.customOptions,
      //       },
      //       {
      //         value: {
      //           type: "component",
      //           id: "component",
      //           data: {},
      //         },
      //         label: "组件",
      //         children: this.componentOptions,
      //       },
      //     ];
      //     this.dataConfigOptions = dataConfigOptions.concat(
      //       this.interfaceOptions
      //     );
      //   }
      // );
      this.echoValueTemp();
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
    initGlobalOptions(){
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
                data: tchild.variableKey
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
        this.echoValueTemp();
      })
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
      const tableDeepValueArr = []
      this.pickInputComponentList(
        allComponenList,
        tempArr,
        inputInterfaceComponent,
        tableDeepValueArr
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
      this.componentOptions = [...this.componentOptions, ...tableDeepValueArr]
    },
    initInterfaceOptions() {
      let interfaceListData = this.$pageDataModelEngine.getInterfaceData();
      this.interfaceOptions.splice(0, this.interfaceOptions.length);
      interfaceListData.forEach((item) => {
        let responseData = item.data.responseData;
        let obj = {
          label: item.data.name || item.data.tableName || item.data.dataSetName||item.data.processName, // 依次判断数据接口、数据表、数据集
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
          // let deepNum = 1 // 递归深度
          // deepHandleResponse(obj, responseData)
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
            }
          }
        }
        this.interfaceOptions.push(obj);
      });
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
        if (responseData[key] && typeof responseData[key] === "object") {
          this.deepHandleResponse(
            objChildrenItem,
            responseData[key],
            deepNum,
            type
          );
        }
      }
    },
    echoValueTemp() {
      let interfaceDataConfig =
        this.componentConfig.options.interfaceDataConfig;
      // console.log('*****interfaceDataConfig****', JSON.stringify(interfaceDataConfig))
      let contentDataSource = this.componentConfig.options.contentDataSource;
            console.log("-----echoValueTemp-------",contentDataSource)
       if(this.echoConfig){
          interfaceDataConfig = this.componentConfig.options.interfaceDataEchoConfig;
          contentDataSource= this.componentConfig.options.contentDataEcho;
        }
      // 这里处理下 值的回显
      if (contentDataSource == "radio-button-interface" ||contentDataSource ==  "radio-button-connect") {
        if(this.componentConfig.type=="van-design-progress"){
          this.interfaceOptions.forEach((iItem) => {
            if (iItem.value.id != undefined && iItem.value.id == interfaceDataConfig.uuid) {
              this.cascadeValueTemp = [iItem.value];
            }
          });
        }else{
          // console.log('interfaceDataConfig====', JSON.stringify(interfaceDataConfig))
          this.interfaceOptions.forEach((iItem) => {
            // console.log('iItem======', JSON.stringify(iItem));
            // if (iItem.value.data.isMockData == true) {
            //   if (iItem.value.data.id != undefined && iItem.value.data.id == interfaceDataConfig.id) {
            //     iItem.children &&
            //     iItem.children.forEach((oItem) => {
            //       if (oItem.label == interfaceDataConfig.key) {
            //         this.cascadeValueTemp = [iItem.value, oItem.value];
            //       }
            //     });
            //   }
            // } else {
              if (iItem.value.id != undefined && iItem.value.id == interfaceDataConfig.uuid) {
                iItem.children &&
                iItem.children.forEach((oItem) => {
                  if (oItem.label == interfaceDataConfig.key) {
                    this.cascadeValueTemp = [iItem.value, oItem.value];
                  }
                });
              }
            // }
          });
        }

      } else if (
        contentDataSource === "radio-button-tables" ||
        contentDataSource === "radio-button-dataset" ||
        contentDataSource === "radio-button-view"
      ) {
        this.interfaceOptions.forEach((iItem) => {
          if (iItem.value.id != undefined && iItem.value.id == interfaceDataConfig.uuid) {
            this.cascadeValueTemp = [iItem.value];
          }
        });
      } else if (contentDataSource === "custom") {
        // placeholderStr = '页面入参'
        this.dataConfigOptions[0].children.forEach(child=>{
           if (child.value.id == interfaceDataConfig.key) {
            this.cascadeValueTemp = [
              this.dataConfigOptions[0].value,
              child.value,
            ];
          }
        })

      } else if (contentDataSource === "component") {
        // placeholderStr = '组件'
        this.dataConfigOptions[1].children.forEach((child) => {
          if (child.value.id == interfaceDataConfig.key) {
            this.cascadeValueTemp = [
              this.dataConfigOptions[1].value,
              child.value,
            ];
          }
        });
      } else if (contentDataSource === "global"){
        if(this.dataConfigOptions[2].label=='全局变量'&&this.dataConfigOptions[2].children.length>0){
          this.dataConfigOptions[2].children.forEach((scopeChild) => {
            if (scopeChild.value.id == interfaceDataConfig.scope) {
              scopeChild.children.forEach(child=>{
                if(child.value.data==interfaceDataConfig.key){
                  this.cascadeValueTemp = [
                    this.dataConfigOptions[2].value,
                    scopeChild.value,
                    child.value
                  ];
                }
              })
            }
          });
        }

      }
    },
    pickInputComponentList
  },
};
</script>
<style scoped lang="scss">
/deep/.el-cascader .el-input .el-input__inner::-webkit-input-placeholder {
  color: #333;
}
</style>
