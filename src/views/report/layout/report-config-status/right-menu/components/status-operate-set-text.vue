<template>
  <div>
    <div style="margin-bottom: 10px;">操作项：{{ currentOperateItem.name }}</div>
    <el-radio v-model="currentOperateItem._statusOperateSetTextOfType" label="static">
      <el-input
        size="small"
        style="width: 160px;"
        v-model="currentOperateItem._statusOperateSetTextOfStaticValue"
        placeholder="请输入文本值"
      ></el-input>
    </el-radio>
    <p style="height: 10px;"></p>

    <el-radio v-model="currentOperateItem._statusOperateSetTextOfType" label="dynamic">
      <div style="display: inline-block; vertical-align: middle; width: 200px; overflow: hidden;">
        <el-select
          size="small"
          v-model="currentOperateItem._statusOperateSetTextOfLogicKey"
          placeholder="请选择"
          style="margin-bottom: 0px; width: 100px; margin-right: 8px;"
        >
          <el-option
            v-for="(item, key) in currentOperateItem.tableDataRowKeyList"
            :key="key"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <p style="height: 0px;"></p>
        <el-input
          size="small"
          placeholder="请输入内容"
          v-model="currentOperateItem._statusOperateSetTextOfLogicValue"
          style="width: 200px; padding-bottom: 10px"
        >
          <el-select
            placeholder=" "
            v-model="currentOperateItem._statusOperateSetTextOfLogicOperator"
            slot="prepend"
            style="width: 80px"
          >
            <el-option
              v-for="(value, key) in {
                '=': '=',
                '>': '>',
                '>=': '>=',
                '<': '<',
                '<=': '<=',
                '!=': '!='
                // isNull: 'isNull',
                // isNotNull: 'isNotNull',
              }"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-input>
        <p style="height: 0px;"></p>
        <el-input
          size="small"
          style="width: 160px;"
          v-model="currentOperateItem._statusOperateSetTextOfDynamicValue"
          placeholder="请输入文本值 为空则不显示"
        ></el-input>
      </div>
    </el-radio>
    <!-- <div v-for="(configItem, key) in tableColumnConfig.componentList" :key="key" style="margin-bottom: 10px;">
      <span>{{ configItem.name }}：</span>
      <el-radio v-model="tableColumnConfig._statusOperateSetValueOfType" label="static">
        <el-input
          size="small"
          style="width: 160px;"
          v-model="configItem.name"
          placeholder="请输入文本值"
        ></el-input>
      </el-radio>
      <p style="height: 0px;"></p>

      <el-radio v-model="tableColumnConfig._statusOperateSetValueOfType" label="dynamic">
        <div style="display: inline-block; vertical-align: middle; width: 200px; overflow: hidden;">
          <el-select
            size="small"
            v-model="tableColumnConfig._statusOperateSetValueOfRelationKey"
            placeholder="请选择"
            style="margin-bottom: 0px; width: 100px; margin-right: 8px;"
          >
            <el-option
              v-for="(item, key) in tableColumnConfig._statusOperateSetValueOfRelationColumns"
              :key="key"
              :label="key"
              :value="key"
            ></el-option>
          </el-select>
          <p style="height: 0px;"></p>
          <el-input
            size="small"
            placeholder="请输入内容"
            v-model="tableColumnConfig.logicValue"
            style="width: 200px; padding-bottom: 10px"
          >
            <el-select
              placeholder=" "
              v-model="tableColumnConfig.logicOperator"
              slot="prepend"
              style="width: 80px"
            >
              <el-option
                v-for="(value, key) in {
                  '=': '=',
                  '>': '>',
                  '>=': '>=',
                  '<': '<',
                  '<=': '<=',
                  '!=': '!=',
                  isNull: 'isNull',
                  isNotNull: 'isNotNull',
                }"
                :key="key"
                :label="value"
                :value="key"
              ></el-option>
            </el-select>
          </el-input>
        </div>
      </el-radio>
    </div> -->
  </div>
</template>

<script>
// import valueSelect from '@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue'
export default {
  name: 'StatusOperateSetText',
  components: {
    // valueSelect
  },
  props: {
    currentOperateItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // singleActionItem: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // },
    /**
     * 在本组件内tableColumnConfig加了以下属性
     * _statusOperateSetValueOfType 值设置类型 为static、relation两种
     * _statusOperateSetValueOfStaticValue 值设置类型为static时：字段显示的状态值
     * _statusOperateSetValueOfRelationKey 值设置类型为relation时：当前列key
     * 
     * 当type为relation时添加以下属性
     * _statusOperateSetValueOfRelationColumns 列选项
     * _statusOperateSetValueOfRelationToKeyArr 回显使用，选择的接口
     * _statusOperateSetValueOfRelationKeyToValue 值设置类型为relation时：根据key显示的value
     */
    tableColumnConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // chooseDataList: []
      // 静态值
      // staticKey: '',
      // 关联值
      // relationKey: '',
      // relationToKey: '',
      // 配置类型
      // type: 'static',
      // typeList: [
      //   {
      //     label: '静态值',
      //     value: 'static'
      //   },
      //   {
      //     label: '关联值',
      //     value: 'relation'
      //   }
      // ]
    }
  },
  created() {
    // setTimeout(() => {
      // this.actionItem['--xx-----xx-----xx--->'] = '--xx-----xx-----xx--->'
      // console.log('--xx-----xx-----xx--->', this.tableColumnConfig)
      console.log('--xx-----xx-----xx--->', this.currentOperateItem)
      // console.log('xxxxx', this.tableColumnConfig.interfaceDataConfig)
    // }, 3000)
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
