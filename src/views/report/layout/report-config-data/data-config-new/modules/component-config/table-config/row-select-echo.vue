<template>
  <div>
    <el-radio-group size="small" v-model="componentConfig.options.echoRowDataType">
      <el-radio-button label="outside">已选值</el-radio-button>
      <el-radio-button label="inside">表列值</el-radio-button>
    </el-radio-group>

    <div style="margin: 12px 0px;" v-if="componentConfig.options.echoRowDataType === 'outside'">
      <el-cascader
        size="small"
        clearable
        v-model="componentConfig.options.echoRowKey_id"
        :options="dataConfigOptions"
        :props="{ checkStrictly: true, value: '_id' }"
        @change="testHandleChange">
      </el-cascader>
    </div>

    <div style="margin: 12px 0px;" v-if="componentConfig.options.echoRowDataType === 'inside'">
      <el-select
        v-model="componentConfig.options.echoRowKeyByInside"
        @change="onChangeDataIndex($event, index)"
        placeholder="选择列值"
        style="width: 210px"
        size="mini"
      >
        <el-option
          v-for="(value, key) in tableFieldList"
          :key="key"
          :label="value.columnName"
          :value="value.columnName"
        >
        </el-option>
      </el-select>
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
      // echoRowDataType: 'outside', // outside：外部值，inside：内部值
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
      this.componentConfig.options.echoRowKey = values[1]
      this.componentConfig.options.echoRowKey_id = values
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
