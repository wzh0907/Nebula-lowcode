<template>
  <div>
    <!-- <el-select
      size="small"
      v-model="tableColumnConfig._statusOperateSetValueOfType"
      placeholder="请选择"
      style="margin-bottom: 20px; width: 200px;"
    >
      <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select> -->

    <!-- 静态值配置 -->
    <el-radio v-model="tableColumnConfig._statusOperateSetValueOfType" label="static">
      <el-input
        size="small"
        style="width: 200px;"
        v-model="tableColumnConfig._statusOperateSetValueOfStaticValue"
        placeholder="请输入文本值"
      ></el-input>
    </el-radio>

    <p style="height: 0px;"></p>
    
    <!-- 关联值配置 -->
    <el-radio v-model="tableColumnConfig._statusOperateSetValueOfType" label="relation">
      <div style="display: inline-block; vertical-align: middle; width: 200px; overflow: hidden;">
        <valueSelect
          :paramItem="singleActionItem"
          :isBind="true"
          @handleChange="handleChange"
          style="width: 200px;"
        />
        <p style="height: 0px;"></p>

        <div style="display: flex;">
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


          <el-select
            size="small"
            v-model="tableColumnConfig._statusOperateSetValueOfRelationKeyToValue"
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
        </div>
      </div>
    </el-radio>
  </div>
</template>

<script>
import valueSelect from '@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue'
export default {
  name: 'StatusOperateSetValue',
  components: {
    valueSelect
  },
  props: {
    singleActionItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
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
      // console.log('xxxxx', this.tableColumnConfig.interfaceDataConfig)
    // }, 3000)
  },
  methods: {
    handleChange(data, paramItem) {
      const chooseDataList = data[data.length - 1].data.value
      if (!Array.isArray(chooseDataList)) return false

      this.tableColumnConfig._statusOperateSetValueOfRelationColumns = chooseDataList[0] || {}
      // console.log('--xx-----xx-----xx--->', data, paramItem)
      this.tableColumnConfig._statusOperateSetValueOfRelationToKeyArr = []
      data.forEach(item => {
        this.tableColumnConfig._statusOperateSetValueOfRelationToKeyArr.push(item.id)
      })
      
      /**************** 没啥特别用处，专门为了回显 ****************/
      if (paramItem.param_value_type == "T") {
        // paramItem.relevanceComponentUuid = data[1].id;
        // this.linkComponent(paramItem);
      } else if (paramItem.param_value_type == "V") {
        // paramItem.type = data[0].type;
        // paramItem.param_v_key = data[1].id;
        // if (data[0].type == "customInterface") {
        //   paramItem.param_value = data[1].data.value;
        //   paramItem.operateApiId = data[0].id;
        // } else {
        //   paramItem.param_value = data[1].data.value.operateHrefPageParamValue;
        // }
      } else if (paramItem.param_value_type == "B") {
        paramItem.type = data[0].type;
        if (data[0].type == "radio-button-tables") {
          paramItem.param_v_table = data[0].data.name;
          paramItem.param_v_key = data[1].id;
          paramItem.param_value = ""; // 接口值取不到的
        } else if (
          data[0].type == "radio-button-interface" ||
          data[0].type == "radio-button-connect"
        ) {
          paramItem.param_v_name = data[0].data.name;
          paramItem.middle = data[1].id;
          if (data.length > 2) {
            // 2022-02-25
            paramItem.param_v_key = data[2].id;
            paramItem.param_value = data[2].data.value; // 接口值取不到的
          } else {
            paramItem.operateApiId = data[0].id;
          }
        }
      }
      this.$forceUpdate();
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
