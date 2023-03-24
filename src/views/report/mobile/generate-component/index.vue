<template>
  <div
    class="generate-component-mobile"
    :class="{perspective: isDesignModel}"
    :style="{
      padding: `${globalConfig.topPaddingDistance || 0}px ${globalConfig.rightPaddingDistance || 0}px ${globalConfig.bottomPaddingDistance || 0}px ${globalConfig.leftPaddingDistance || 0}px`,
      backgroundColor: globalConfig.backgroundColor,
      opacity: (globalConfig.backgroundOpacity && (Math.abs(globalConfig.backgroundOpacity - 10) / 10)),
      fontSize: globalConfig.fontSize,
      backgroundImage: 'url(' + globalConfig.backgroundImage + ')',
      backgroundPosition: globalConfig.backgroundPositionX + '% ' + globalConfig.backgroundPositionY + '%',
      backgroundRepeat: globalConfig.backgroundRepeat,
      backgroundSize: 'cover',
      backgroundAttachment: globalConfig.backgroundAttachment
    }"
  >
    <transition-group name="fade" tag="div" class="widget-form-list">
      <template v-for="(item, key) in componentList">
        <template v-if="item.type !== 'van-design-placeholder'">
          <DynamicComponent
            :key="key"
            :component-config="item"
            :el-index="key"
          />
        </template>
        <template v-else>
          <generate-custom-components
            :key="key"
            :component-config="item"
            :el-index="key"
          />
        </template>
      </template>

    </transition-group>
    <!-- 预加载的组件 -->
    <preloadComponent
      :component-list="componentList"
      :generateComponentsUUID="generateComponentsUUID"
      :subpageList="subpageList"
      :isGenerateModel="true"
      @onChangeComponentList="onChangeComponentList"
      v-if="componentList.length"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import {  getLocalDataByKey, saveAndUpdateLocalData } from '@/views/report/utils/deal-data-cache/index'
import { generateUUID } from "@/views/report/utils/index";
import DynamicComponent from "./dynamic-component.vue";
import preloadComponent from './preload-component.vue'
import componentsConfigs from "@/views/report/mobile/components/configs/index";
import { transformComponentConfigSimpleToFull } from '@/views/report/utils/deal-component-data/transform-component-config'
import { ComponentDataSourceApiQuery } from '@/views/report/utils/deal-component-data-source/index'

import { getAuthorityUserList } from '@/api/authority/index'
export default {
  name: "GenerateComponentMobile",
  components: {
    DynamicComponent,
    preloadComponent,
    // @ts-ignore
    GenerateCustomComponents: window.MakingFormComponent && window.MakingFormComponent.DynamicCustomComponent
  },
  props: {
    isDesignModel: {
      type: Boolean,
      default: false
    },
    componentConfigList: {
      type: Array,
      default: () => []
    },
    subpageList: {
      type: Array,
      default: []
    },
    globalConfig: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // dataIsReady: false,
      permissionIdList: [],
      roleNameList: [],
      componentList: [],
      componentsConfigs,
      generateComponentsUUID: ''
    }
  },
  created() {
    this.getHrefPageParams()
    this.generateComponentsUUID = generateUUID()
    this.handleSubpageList()
    // this.queryPermissionList()
    // this.queryUserRoleService().then(() => {
      if (this.componentConfigList && this.componentConfigList.length) {
        this.componentList = []
        this.transformComponentConfigSimpleToFull(this.componentConfigList, this.componentList, this.componentsConfigs, this.roleNameList, this.generateComponentsUUID)
        //2021-1-14 在预览数据的时候 处理组件中interfaceDataConfig 接口配置 ，重新拉取数据
        // 把所有组件中 有接口配置的都取出来， 记录dataApiId,params,返回值,组件uuid 在map中
        let dataSourceApiQuery = new ComponentDataSourceApiQuery(this.componentConfigList, this.componentList, this.$pageDataModelEngine) // 集中处理页面直接的数据获取
        dataSourceApiQuery.init()
      }
    // })
  },
  mounted() {
    document.body.ondrop = function (event) {
      const isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    getHrefPageParams(){
      let hrefPageParams = getLocalDataByKey('hrefPageParams') || {}
      for(let key in hrefPageParams) {
        // saveAndUpdateLocalData(key, hrefPageParams[key])
        this.$pageDataModelEngine.saveCustomData(key, hrefPageParams[key])
      }
    },
    handleSubpageList(){
      this.subpageList.forEach(item => {
        let listTemp = item.list
        let componentList = []
        this.transformComponentConfigSimpleToFull(listTemp, componentList, this.componentsConfigs, this.roleNameList, this.generateComponentsUUID)
        item.list = componentList
      })
    },
    initPage(){
      this.generateComponentsUUID = generateUUID()
      this.handleSubpageList()
      if (this.componentConfigList && this.componentConfigList.length) {
        this.componentList = []
        this.transformComponentConfigSimpleToFull(this.componentConfigList, this.componentList, this.componentsConfigs, this.roleNameList, this.generateComponentsUUID)
        //2021-1-14 在预览数据的时候 处理组件中interfaceDataConfig 接口配置 ，重新拉取数据
        // 把所有组件中 有接口配置的都取出来， 记录dataApiId,params,返回值,组件uuid 在map中
        let dataSourceApiQuery = new ComponentDataSourceApiQuery(this.componentConfigList, this.componentList, this.$pageDataModelEngine) // 集中处理页面直接的数据获取
        dataSourceApiQuery.init()
      }
    },
    onChangeComponentList(configJson){
      console.log("onChangeComponentList configJson",configJson)
      this.componentConfigList = configJson.list || [];
      this.globalConfig = configJson.config || {};
      this.initPage();
    },
    queryPermissionList(){
      this.permissionIdList = []
      return getAuthorityUserList({
        reportId: this.globalConfig.reportId,
        type: 'component'
      }).then((res: any) => {
        let dataList = res.dataList || []
        dataList.forEach(item => {
          this.permissionIdList.push(item.authorityId)
        })
      })
    },
    transformComponentConfigSimpleToFull
  }
}
</script>

<style lang="scss" scoped>
.generate-component-mobile .widget-form-list {
  border: 0 !important;
  margin: 0 !important;
}
.generate-component-mobile {
  overflow: auto;
  height: 667px;
  &.perspective {
    perspective: 100px; // TODO: 解决fixed定位、移动端模拟器问题
  }
  &::-webkit-scrollbar {
    width: 0;
  }

}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
