<template>
  <!-- 方块单选 -->
  <el-radio-group v-model="componentConfig.options[config.key]" size="small" style="padding-bottom: 10px; width: 350px;" @change="changeRadioValue">
    <el-radio-button :label="item.value" v-for="(item, key) in config.typeConfigs" :key="key">{{ item.label }}</el-radio-button>
    <!-- 第二值 -->
    <div style="padding-top: 10px;" v-if="componentConfig.options[config.key] === 'event-operate-refresh'">
      <el-select multiple filterable v-model="componentConfig.options[formKey]" placeholder="请选择" :key="1" v-if="operateTypeReload">
        <el-option
          v-for="(item, key) in refreshComponentList"
          :key="key"
          :label="item.name + '-' + item.uuid"
          :value="item.uuid">
        </el-option>
      </el-select>
    </div>
    <div style="padding-top: 10px;" v-if="componentConfig.options[config.key] === 'event-operate-href'">
      <el-select v-model="componentConfig.options[formKey]" placeholder="请选择" :key="2">
        <el-option
          v-for="(item, key) in hrefPageList"
          :key="key"
          :label="item.reportName"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div style="padding-top: 10px;" v-if="componentConfig.options[config.key] === 'event-operate-href-native'">
      <el-input
        v-model="componentConfig.options[formKey]"
        class="header_title"
        size="small"
        placeholder="请输入页面名称"
        :key="3"
        v-if="operateTypeReload"
      />
    </div>
    <div style="padding-top: 10px;" v-if="componentConfig.options[config.key] === 'event-operate-dialog'">
      <el-select v-model="componentConfig.options[formKey]" placeholder="请选择" :key="4">
        <el-option
          v-for="(item, key) in dialogComponentList"
          :key="key"
          :label="item.id"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
  </el-radio-group>
</template>

<script>
// const coverBigComponent = ['van-design-tabs','van-design-collapse', 'van-design-layout'] // 可嵌套组件
import { coverBigComponent, dataRefreshComponents } from "@/views/report/utils/common-const";
// const dataRefreshComponents = [
//   'van-design-text-title',
//   'van-design-chart-histogram',
//   'van-design-chart-line',
//   'van-design-chart-ring',
//   'van-design-progress',
//   'van-design-table',
//   'van-design-placeholder',
//   'van-design-circle',
//   'van-design-tag'
// ] // 可数据刷新组件
import { getListAllV4 } from '@/api/report'
import { componentDeepClone } from '@/views/report/utils/deal-component-data/deep-clone-component-config'
export default {
  name: "radio-button-group",
  props: ['componentList', 'componentConfig', 'config'],
  data() {
    return {
      // isNativePage: false,
      operateTypeReload: true,
      formType: '',
      formKey: '',
      refreshComponentList: [],
      hrefPageList: [],
      dialogComponentList: [
        {
          id: 'xxxxx'
        }
      ]
    };
  },
  watch: {
    'componentConfig.options.operateEventType': {
      deep: true,
      handler(val){
        this.operateTypeReload = false
        this.$nextTick(() => {
          this.operateTypeReload = true
        })
      }
    }
  },
  created(){
    this.queryReportAllListServiceV3()
    let tempArr = []
    this.pickRefreshComponentList(this.componentList, tempArr)
    this.refreshComponentList = tempArr
    // 初始化Radio
    this.changeRadioValue(this.componentConfig.options[this.config.key])
  },
  mounted(){  
  },
  methods: {
    changeRadioValue(value){
      let isThePick = false
      this.config.typeConfigs.forEach(item => {
        if (item.value === value && item.formType) {
          isThePick = true
          this.formType = item.formType
          this.formKey = item.key
          // this.formTypeConfigs = item.typeConfigs
          // this.formSelectMultiple = item.isSelectMultiple
        }
      })
      // console.log(this.componentConfig.options[this.formKey])
      if (!isThePick) {
        this.formType = ''
        this.formKey = ''
        // this.formTypeConfigs = []
        // this.formSelectMultiple = false
      }
    },
    pickRefreshComponentList(componentConfigList, componentList){
      componentConfigList.forEach(item => {
        let newItem = this.componentDeepClone(item)
        // let newItem = item
        let componentObj = {}
        let type = newItem.type
        let name = newItem.name
        let uuid = newItem.uuid
        let options = newItem.options
        let optionsColumns = options && options.columns
        if (coverBigComponent.indexOf(type) !== -1 && optionsColumns && optionsColumns.length) {
          optionsColumns.forEach(columnItem => {
            if (columnItem.componentList && columnItem.componentList.length) {
              // let tempComponentList = []
              this.pickRefreshComponentList(columnItem.componentList, componentList)
              // columnItem.componentList = tempComponentList
            }
          })
        }
        componentObj.type = type
        componentObj.name = name
        componentObj.uuid = uuid
        componentObj.options = options
        if (dataRefreshComponents.indexOf(type) !== -1) {
          componentList.push(componentObj)
        }
      })
    },
    // 接口查询
    queryReportAllListServiceV3() {
      const params = {
        parentId: 0,
        queryType: 'MOBILE',
      };
      getListAllV4(params).then(res => {
        this.hrefPageList = res.dataList || {};
      });
    },
    componentDeepClone
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-select .el-select__tags .el-tag.el-tag--info {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
