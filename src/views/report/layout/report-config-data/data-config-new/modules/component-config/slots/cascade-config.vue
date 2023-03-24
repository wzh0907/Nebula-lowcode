<template>
  <div>
    <el-cascader
      size="small"
      clearable
      v-model="cascadeValueTemp"
      :options="interfaceList"
      :props="{ checkStrictly: true }"
      @change="handleInterfaceChanged"></el-cascader>
    <div v-if="cascadeValueTemp.length > 0">
      <div style="display: flex; align-items: center; margin-top: 10px">
        <div style="width: 80px">值</div>
        <el-select v-model="componentConfig.options.setOptions.value" placeholder="请选择值" @change="selectParentId">
          <el-option
            v-for="item in interfaceParams"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="display: flex; align-items: center; margin-top: 10px">
        <div style="width: 80px">名称</div>
        <el-select v-model="componentConfig.options.setOptions.name" placeholder="请选择值" @change="selectParentId">
          <el-option
            v-for="item in interfaceParams"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="display: flex; align-items: center; margin-top: 10px">
        <div style="width: 80px">节点ID</div>
        <el-select v-model="componentConfig.options.setOptions.id" placeholder="请选择值" @change="selectParentId">
          <el-option
            v-for="item in interfaceParams"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="display: flex; align-items: center; margin-top: 10px">
        <div style="width: 80px">父节点ID</div>
        <el-select v-model="componentConfig.options.setOptions.parentId" placeholder="请选择值" @change="selectParentId">
          <el-option
            v-for="item in interfaceParams"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
import {componentDataTypes} from "@/views/report/utils/common-const";
import {EventBus} from "@/util/event-bus";

export default {
  name: "cascade-config",
  components: {
  },
  watch: {
  },
  props: {
    // reloadDataSourceApiConfig: {
    //   default: {
    //     type: Boolean,
    //     default: false
    //   }
    // },
    // componentList: {
    //   default: {
    //     type: Object,
    //     default: [],
    //   },
    // },
    componentConfig: {
      default: {
        type: Object,
        default: {},
      },
    },
  },
  computed: {
    interfaceParams() {
      let interfaceData = this.cascadeValueTemp[this.cascadeValueTemp.length - 1]
      if (interfaceData.data != undefined
        && interfaceData.data.value != undefined
        && interfaceData.data.value.length > 0) {
        let params = interfaceData.data.value[0]
        let paramList = []
        for (let key in params) {
          paramList.push({
            value: key,
            label: key
          })
        }
        return paramList
      }
      return []
    }
  },
  data() {
    return {
      cascadeValueTemp: [],
      interfaceList: []
    };
  },
  created() {
    // console.log(this.componentConfig)
    this.initInterfaceList()
  },
  mounted() {
    EventBus.$off("onChangeInterfaceData");
    EventBus.$on("onChangeInterfaceData", (data) => {
      // let that = this;
      this.initInterfaceList();
    });

    console.log('interfaceOptions=', this.interfaceList);
  },
  methods: {
    initInterfaceList() {
      let interfaceListData = this.$pageDataModelEngine.getInterfaceData()
      // this.interfaceOptions.splice(0, this.interfaceOptions.length);
      // this.$emit('onChangeDataConfigOptions', this.dataConfigOptions)
      interfaceListData.forEach((item) => {
        let responseData = item.data.responseData;
        let obj = {
          label: item.data.name,
          value: {
            type: item.type,
            id: item.id,
            data: item.data,
          },
        };
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
            }
          }
        }
        this.interfaceList.push(obj);
      });
      this.echoValue()
    },
    handleInterfaceChanged(data) {
      console.log("handleInterfaceChanged", data);
      let componentDataInputType = 'Array'
      let level = data.length || 0;
      let interfaceDataConfig = this.componentConfig.options.interfaceDataConfig;
      console.log("interfaceDataConfig", interfaceDataConfig);
      if (data.length == 0) {
        this.componentConfig.options.interfaceDataConfig = {
          versions: "1.0.0",
          value: "",
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
      }
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
      if (dataSourceType === "radio-button-interface") {
        interfaceDataConfig.key = secondData.id;
        interfaceDataConfig.id = firstData.data.id;
        interfaceDataConfig.name = firstData.data.name;
        interfaceDataConfig.paramsConfigs = firstData.data.paramsConfigs;
        interfaceDataConfig.isMockData = firstData.data.isMockData;

        // interfaceDataConfig.chartData &&
        // (interfaceDataConfig.chartData.rows =
        //   firstData.data.responseData[interfaceDataConfig.key] || []);
        interfaceDataConfig.tableData =
          firstData.data.responseData[interfaceDataConfig.key] || [];

        delete interfaceDataConfig.dbConfigId;
        delete interfaceDataConfig.tableName;
        delete interfaceDataConfig.queryConfigs;
        console.log('interfaceDataConfig=====', interfaceDataConfig);
      }
      // // 组件渲染数据
      // interfaceDataConfig.uuid = firstData.id;
      // if (
      //   typeof firstData.data.responseData === "object" &&
      //   [
      //     "radio-button-tables",f
      //     "radio-button-dataset",
      //     "radio-button-view",
      //   ].indexOf(dataSourceType) !== -1
      // ) {
      //   interfaceDataConfig.chartData &&
      //   (interfaceDataConfig.chartData.rows =
      //     firstData.data.responseData || []);
      //   interfaceDataConfig.tableData = firstData.data.responseData || [];
      // }
      // if(this.echoConfig){
      //   this.componentConfig.options.interfaceDataEchoConfig.versions = "1.0.0";
      //   this.componentConfig.options.contentDataEcho = dataSourceType;
      // }else{
      this.componentConfig.options.contentDataSource = dataSourceType;
      this.componentConfig.options.interfaceDataConfig.versions = "1.0.0";

      // }
      //
      // // 如果是列表组件需要进行数据绑定操作
      // if (this.componentConfig.type === "van-design-list") {
      //   this.$pageDataModelEngine.saveCustomData(
      //     this.componentConfig.uuid,
      //     interfaceDataConfig.tableData || []
      //   );
      // }


      // 更新options-config数据
      this.$emit("onUpdateOptionsConfig");
      this.$emit("onChangeValuesConfig", data);
    },
    echoValue() {
      let interfaceDataConfig = this.componentConfig.options.interfaceDataConfig;
      let contentDataSource = this.componentConfig.options.contentDataSource;
      console.log("-----echoValueTemp-------", contentDataSource)
      // if(this.echoConfig){
      //   interfaceDataConfig = this.componentConfig.options.interfaceDataEchoConfig;
      //   contentDataSource= this.componentConfig.options.contentDataEcho;
      // }
      // 这里处理下 值的回显
      if (contentDataSource == "radio-button-interface") {
        this.interfaceList.forEach((iItem) => {
          if (iItem.value.data.id == interfaceDataConfig.id) {
            iItem.children &&
            iItem.children.forEach((oItem) => {
              if (oItem.label == interfaceDataConfig.key) {
                this.cascadeValueTemp = [iItem.value, oItem.value];
              }
            });
          }
        });
      }
    },
    checkDataInputType(componentDataInputType, level, dataSourceType, dataMap) {
      let resData = dataMap[level];
      if (componentDataInputType === "Array") {
        return typeof resData === "object";
      } else {
        return false;
      }
    },
    selectParentId(value) {
      let tempValue = this.componentConfig.options.setOptions.value
      let name = this.componentConfig.options.setOptions.name
      let id = this.componentConfig.options.setOptions.id
      let parentId = this.componentConfig.options.setOptions.parentId
      if (tempValue && name &&　id && parentId　) {
        let data = JSON.parse(JSON.stringify(this.componentConfig.options.interfaceDataConfig.tableData))
        let setOptions = this.componentConfig.options.setOptions
        let newDealData = this.dealData(data,setOptions)
        this.$set(this.componentConfig.options,'optionsData',newDealData)
      }
    },
    // 处理数据
    dealData(arr, setOptions) {
      let map = {}
      let newData = []
      arr.forEach(item => {
        item.label = item[setOptions.name].toString()
        item.value = item[setOptions.value].toString()
        map[item[setOptions.id]] = item
      })
      arr.forEach(items => {
        let mapItem = map[items[setOptions.parentId]]
        if (mapItem) {
          (mapItem.children || (mapItem.children = [])).push(items)
        } else {
          newData.push(items)
        }
      })
      return newData
    },
    handleInterfaceDataConfig(dataConfig) {
      let labelKey = this.componentConfig.options.labelKey
      let valueKey = this.componentConfig.options.valueKey
      let tableData = dataConfig.tableData
      this.componentConfig.options.columns = []
      tableData && tableData.forEach(item => {
        this.componentConfig.options.columns.push({
          label: item[labelKey],
          value: item[valueKey]
        })
      })
    },
    handleColumns(columns) {
      this.componentConfig.options.columnsStrArr = []
      columns && columns.forEach(item => {
        let label = item.label
        this.componentConfig.options.columnsStrArr.push(label)
      })
      // let contentDataSource = this.componentConfig.options.contentDataSource
      // let labelKey = this.componentConfig.options.labelKey
      // let valueKey = this.componentConfig.options.valueKey
      // this.componentConfig.options.columnsStrArr = []
      // if (contentDataSource === 'radio-button-default') {
      //   columns.forEach(item => {
      //     let label = item.label
      //     this.componentConfig.options.columnsStrArr.push(label)
      //   })
      // } else {
      //   columns.forEach(item => {
      //     let label = item[labelKey]
      //     this.componentConfig.options.columnsStrArr.push(label)
      //   })
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
