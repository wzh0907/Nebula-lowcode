<template>
  <div>
    <!-- 分页配置 -->
    <span style="font-weight: bold">记录行数</span>
    <el-tooltip effect="dark" content="刷新列值" placement="top">
      <i
        class="refresh-icon iconfont iconshuaxin"
        alt="刷新"
        @click="refreshTableField"
      ></i>
    </el-tooltip>
    <!-- Select -->
    <div style="margin: 12px 0px;">
      <el-cascader
      size="small"
      clearable
      v-model="componentConfig.options.pagingTotalKey_id"
      :options="dataConfigOptions"
      :props="{ checkStrictly: true, value: '_id' }"
      @change="testHandleChange"></el-cascader>
      <!-- <el-select
        v-model="componentConfig.options.pagingTotalKey"
        @change="onChangeDataIndex($event, index)"
        placeholder="选择列值"
        style="width: 95px"
        size="mini"
      >
        <el-option
          v-for="(value, key) in tableFieldList"
          :key="key"
          :label="value.columnName"
          :value="value.columnName"
        >
        </el-option>
      </el-select> -->
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    componentConfig: {
      type: Object,
      default: {}
    },
    dataConfigOptions: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      // chooseData: [],
      tableFieldList: [],
    }
  },
  created() {
    this.initTableField()
  },
  methods: {
    testHandleChange(values){
      if (values.length < 2) return false;
      // console.log('-------------->', values)
      // this.componentConfig.options.pagingTotalKey = values[1] && values[1].id
      this.componentConfig.options.pagingTotalKey = values[1]
      this.componentConfig.options.pagingTotalKey_id = values
    },
    refreshTableField() {
      let temp = this.$pageDataModelEngine.updateInterfaceData(
        this.componentConfig.options.interfaceDataConfig.uuid
      );
      let rData =
        temp.data.responseData[
          this.componentConfig.options.interfaceDataConfig.key
        ];
      this.tableFieldList = [];
      if (rData instanceof Array && rData.length > 0) {
        for (let rkey in rData[0]) {
          this.tableFieldList.push({ columnName: rkey });
        }
      }
    },
    onChangeDataIndex() {},
    initTableField() {
      const interfaceData = this.$pageDataModelEngine.getInterfaceData();
      interfaceData &&
        interfaceData.forEach((item) => {
          if (
            item.id == this.componentConfig.options.interfaceDataConfig.uuid
          ) {
            if (item.type == "radio-button-interface" || item.type === 'radio-button-connect') {
              this.tableFieldList = item.data.tableFieldList;
              console.log("-------init tableFieldList",this.tableFieldList);
              if (item.data.tableFieldList) {
                this.tableFieldList = item.data.tableFieldList;
              } else {
                // 如果接口里没有 tableFieldList 就从responseData里面解析
                let rData =
                  item.data.responseData[
                    this.componentConfig.options.interfaceDataConfig.key
                  ];
                this.tableFieldList = [];
                if (rData instanceof Array && rData.length > 0) {
                  for (let rkey in rData[0]) {
                    let tData = rData[0];

                    let temp = null;
                    try {
                      temp = JSON.parse(tData[rkey]);
                    } catch (e) {
                      // 错误处理代码片段
                      temp = rkey;
                    }
                    if (temp instanceof Array) {
                      this.tableFieldList.push({
                        columnName: rkey,
                        valueType: "file",
                      });
                    } else {
                      this.tableFieldList.push({
                        columnName: rkey,
                        valueType: "value",
                      });
                    }
                  }
                }
              }
            } else if (item.type == "radio-button-tables") {
              this.tableFieldList = item.data.tableFieldList;
            }
          }
        });
    }
  }
}
</script>
<style scoped lang="scss">
.refresh-icon {
  margin-left: 10px;
  cursor: pointer;
}
</style>
