<template>
  <div class="selectTypesOpert">
     <el-tooltip effect="dark" content="刷新绑定值" placement="top">
      <i
        class="refresh-icon iconfont iconshuaxin"
        alt="刷新"
        @click="refreshInterface"
      ></i>
     </el-tooltip>
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
import { coverBigComponent } from "@/views/report/utils/common-const";
import { mapGetters } from "vuex";
export default {
  name: "text-bind-data-config",
  components: {},
  props: {
    componentConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(["componentList"]),
  },
  data() {
    return {
      dataOriginComponentVarDataObjMap: {},
      cascaderValueTemp: [],
      dataConfigOptions: [],
      interfaceOptions: [],
      parentInterfaceDataConfig: {},
    };
  },
  created() {
    //_data_origin_component_uuid
    // 这边重构一下 不从 本地 存储直接获取字段了，我们从  数据model 对应的
    this.initDataConfigOptions();
  },
  methods: {
    handleChange(data) {
      this.componentConfig.options.contentDataSource = "radio-button-bind";
      if (data.length == 3) {
        this.componentConfig.options.interfaceDataConfig.bindDataKey =
          data[2].id;
        this.componentConfig.options.interfaceDataConfig.value =
          data[2].data.value;
      } else if (data.length == 2) {
        this.componentConfig.options.interfaceDataConfig.bindDataKey =
          data[1].id;
        // 这里可能需要做一点点特殊处理 TODO
        this.componentConfig.options.interfaceDataConfig.value =
          data[0].data.responseData[0][data[1].id];
      }
    },
    onChangeBindDataKey() {
      //2021-08-10 在修改列表信息后这个值可能没用嘞，后期优化 TODO
      let interfaceDataConfig =
        this.componentConfig.options.interfaceDataConfig || {};
      this.componentConfig.options.contentDataSource = "radio-button-bind";
      this.$set(
        interfaceDataConfig,
        "value",
        this.dataOriginComponentVarDataObjMap[interfaceDataConfig.bindDataKey]
      );
    },
    initDataConfigOptions(newInterfaceData) {
      this.findParentComponent(
        this.componentList,
        this.componentConfig.options._data_origin_component_uuid
      );
      this.initInterfaceOptions(newInterfaceData);
      let dataConfigOptions = [];
      this.dataConfigOptions = dataConfigOptions.concat(this.interfaceOptions);

      // 回显用
      if (this.componentConfig.options.interfaceDataConfig.bindDataKey) {
        this.interfaceOptions.forEach((iItem) => {
          if (iItem.value.id == this.parentInterfaceDataConfig.uuid) {
            // 判断是 接口 还是 表 还是数据集
            if (iItem.value.type == "radio-button-interface"||iItem.value.type == "radio-button-connect") {
              // 说明是接口
              iItem.children &&
                iItem.children.forEach((oItem) => {
                  if (oItem.label == this.parentInterfaceDataConfig.key) {
                    oItem.children &&
                      oItem.children.forEach((pItem) => {
                        if (
                          pItem.label ==
                          this.componentConfig.options.interfaceDataConfig
                            .bindDataKey
                        ) {
                          this.cascaderValueTemp = [
                            iItem.value,
                            oItem.value,
                            pItem.value,
                          ];
                        }
                      });
                  }
                });
            } else {
              iItem.children &&
                iItem.children.forEach((oItem) => {
                  if (
                    oItem.label ==
                    this.componentConfig.options.interfaceDataConfig.bindDataKey
                  ) {
                    this.cascaderValueTemp = [iItem.value, oItem.value];
                  }
                });
            }
          }
        });
      }
    },
    refreshInterface() {
       this.interfaceOptions = [];
      let temp = this.$pageDataModelEngine.updateInterfaceData(
        this.parentInterfaceDataConfig.uuid
      );
      this.initDataConfigOptions(temp);
    },
    initInterfaceOptions(newInterfaceData) {
      let interfaceListData = [];
      if (newInterfaceData) {
        interfaceListData = [newInterfaceData];
      } else {
        interfaceListData = this.$pageDataModelEngine.getInterfaceData();
      }

      interfaceListData.forEach((item) => {

        if (item.id == this.parentInterfaceDataConfig.uuid) {
          
          this.dataOriginComponentVarDataObjMap = [];
          //匹配到相关接口（表） 之后需要进行数据处理
          // 2021-07-05 数组不再进去解析
          let responseData = item.data.responseData;
          let obj = {
            label:
              item.data.name || item.data.tableName || item.data.dataSetName, // 依次判断数据接口、数据表、数据集
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
        }
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
            item.type
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
    findParentComponent(componentList, componentUuid) {
      // 找到父节点 列表 的 配置 用来处理接口 绑定值的选择只能有1个 后期如果有别的方法拿到父节点的interfaceConfig 那就去掉这边的代码
      componentList.forEach((component) => {
        let type = component.type;

        if (component.uuid == componentUuid) {
          this.parentInterfaceDataConfig =
            component.options.interfaceDataConfig;
        } else if (
          coverBigComponent.indexOf(type) !== -1 &&
          component.options.columns &&
          component.options.columns.length
        ) {
          component.options.columns.forEach((columns) => {
            if (columns.componentList && columns.componentList.length) {
              this.findParentComponent(columns.componentList, componentUuid);
            }
          });
        } else if (type === "van-design-group-component") {
          this.findParentComponent(
            component.options.componentList,
            componentUuid
          );
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.selectTypesOpert{
  position: relative;
}
.refresh-icon{
  position: absolute;
    top: -22px;
    cursor: pointer;
    left: 85px;
}
</style>
