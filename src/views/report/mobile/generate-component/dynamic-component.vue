<template>
  <!-- borderRadius: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderRadius + 'px', -->
  <div v-if="componentConfig.options.commonConfigAssignIsCol">
    <van-col

        :span="componentConfig.options.commonConfigAssignSpanCol"
        :style="{
      display:componentConfig.options.commonConfigAssignHide?'none':''
    }"
        class="widget-col widget-view"
        :class="componentConfig.options.commonConfigAssignSign + ' ' + componentConfig.options.commonConfigAssignCustomClass"
        v-if="componentConfig.options.commonConfig && !componentConfig.options.commonConfig.displayHide"
    >
      <!-- backgroundColor: componentConfig.options.commonConfig && componentConfig.options.commonConfig.backgroundColor, -->
      <div @click.stop="triggerEvent('click')">
        <component v-bind:is="componentConfig.component" class="tab"
                   :style="{
          overflow: 'hidden',
          marginTop: componentConfig.options.commonConfig && componentConfig.options.commonConfig.topSpaceDistance+'px',
          marginBottom: componentConfig.options.commonConfig && componentConfig.options.commonConfig.bottomSpaceDistance+'px',
          marginLeft: componentConfig.options.commonConfig && componentConfig.options.commonConfig.leftSpaceDistance+'px',
          marginRight: componentConfig.options.commonConfig && componentConfig.options.commonConfig.rightSpaceDistance+'px',
          paddingTop: componentConfig.options.commonConfig && componentConfig.options.commonConfig.topPaddingDistance+'px',
          paddingBottom: componentConfig.options.commonConfig && componentConfig.options.commonConfig.bottomPaddingDistance+'px',
          paddingLeft: componentConfig.options.commonConfig && componentConfig.options.commonConfig.leftPaddingDistance+'px',
          paddingRight: componentConfig.options.commonConfig && componentConfig.options.commonConfig.rightPaddingDistance+'px',
          borderTopLeftRadius: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderTopLeftRadius + 'px',
          borderTopRightRadius: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderTopRightRadius + 'px',
          borderBottomLeftRadius: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderBottomLeftRadius + 'px',
          borderBottomRightRadius: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderBottomRightRadius + 'px',
          borderLeft: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderStyle?(componentConfig.options.commonConfig.borderStyle.leftSize+'px'+' '+componentConfig.options.commonConfig.borderStyle.leftDirveType+' '+ componentConfig.options.commonConfig.borderStyle.leftDirveColor):'',
          borderTop: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderStyle?(componentConfig.options.commonConfig.borderStyle.topSize+'px'+' '+componentConfig.options.commonConfig.borderStyle.topDirveType+' '+ componentConfig.options.commonConfig.borderStyle.topDirveColor):'',
          borderRight: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderStyle?(componentConfig.options.commonConfig.borderStyle.rightSize+'px'+' '+componentConfig.options.commonConfig.borderStyle.rightDirveType+' '+ componentConfig.options.commonConfig.borderStyle.rightDirveColor):'',
          borderBottom: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderStyle?(componentConfig.options.commonConfig.borderStyle.bottomSize+'px'+' '+componentConfig.options.commonConfig.borderStyle.bottomDirveType+' '+ componentConfig.options.commonConfig.borderStyle.bottomDirveColor):'',
          boxShadow: componentConfig.options.commonConfig && componentConfig.options.commonConfig.isShowShadow? componentConfig.options.commonConfig.shadow:'',
        }"
        ></component>
      </div>
    </van-col>
  </div>
  <div v-else
       style="overflow: inherit;display:inline-block"
       :style="{
         width: componentConfig.options.commonConfigCompWidthUnit === 'auto' ? '' : (componentConfig.options.commonConfigCompWidth + componentConfig.options.commonConfigCompWidthUnit),
          height: componentConfig.options.commonConfigCompHeightUnit === 'auto' ? '' : componentConfig.options.commonConfigCompHeight + componentConfig.options.commonConfigCompHeightUnit,
       }"
  >
    <div
        style="overflow: inherit;display:inline-block"
        :style="{
      display:componentConfig.options.commonConfigAssignHide?'none':''
    }"
        class="widget-col widget-view"
        :class="componentConfig.options.commonConfigAssignSign + ' ' + componentConfig.options.commonConfigAssignCustomClass"
        v-if="componentConfig.options.commonConfig && !componentConfig.options.commonConfig.displayHide"
    >
      <!-- backgroundColor: componentConfig.options.commonConfig && componentConfig.options.commonConfig.backgroundColor, -->
      <div @click.stop="triggerEvent('click')">
        <component v-bind:is="componentConfig.component" class="tab"
                   :style="{
          overflow: 'hidden',
          marginTop: componentConfig.options.commonConfig && componentConfig.options.commonConfig.topSpaceDistance+'px',
          marginBottom: componentConfig.options.commonConfig && componentConfig.options.commonConfig.bottomSpaceDistance+'px',
          marginLeft: componentConfig.options.commonConfig && componentConfig.options.commonConfig.leftSpaceDistance+'px',
          marginRight: componentConfig.options.commonConfig && componentConfig.options.commonConfig.rightSpaceDistance+'px',
          paddingTop: componentConfig.options.commonConfig && componentConfig.options.commonConfig.topPaddingDistance+'px',
          paddingBottom: componentConfig.options.commonConfig && componentConfig.options.commonConfig.bottomPaddingDistance+'px',
          paddingLeft: componentConfig.options.commonConfig && componentConfig.options.commonConfig.leftPaddingDistance+'px',
          paddingRight: componentConfig.options.commonConfig && componentConfig.options.commonConfig.rightPaddingDistance+'px',
          borderTopLeftRadius: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderTopLeftRadius + 'px',
          borderTopRightRadius: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderTopRightRadius + 'px',
          borderBottomLeftRadius: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderBottomLeftRadius + 'px',
          borderBottomRightRadius: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderBottomRightRadius + 'px',
          borderLeft: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderStyle?(componentConfig.options.commonConfig.borderStyle.leftSize+'px'+' '+componentConfig.options.commonConfig.borderStyle.leftDirveType+' '+ componentConfig.options.commonConfig.borderStyle.leftDirveColor):'',
          borderTop: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderStyle?(componentConfig.options.commonConfig.borderStyle.topSize+'px'+' '+componentConfig.options.commonConfig.borderStyle.topDirveType+' '+ componentConfig.options.commonConfig.borderStyle.topDirveColor):'',
          borderRight: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderStyle?(componentConfig.options.commonConfig.borderStyle.rightSize+'px'+' '+componentConfig.options.commonConfig.borderStyle.rightDirveType+' '+ componentConfig.options.commonConfig.borderStyle.rightDirveColor):'',
          borderBottom: componentConfig.options.commonConfig && componentConfig.options.commonConfig.borderStyle?(componentConfig.options.commonConfig.borderStyle.bottomSize+'px'+' '+componentConfig.options.commonConfig.borderStyle.bottomDirveType+' '+ componentConfig.options.commonConfig.borderStyle.bottomDirveColor):'',
          boxShadow: componentConfig.options.commonConfig && componentConfig.options.commonConfig.isShowShadow? componentConfig.options.commonConfig.shadow:'',
        }"
        ></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
export default {
  name: "dynamic-components",
  props: ["elIndex", "componentConfig", "interfaceTableDataItem"],
  data() {
    return {};
  },
  watch: {
    "componentConfig.options.value": {
      deep: true,
      handler(val) {
        this.triggerChangeEvent()
      }
    },
    "interfaceTableDataItem": {
      immediate: true,
      deep: true,
      handler(val) {
        if (this.componentConfig.options) {
          this.componentConfig.options._isGenerateComponent = true
          this.interfaceTableDataItem && this.$set(this.componentConfig.options, '_interfaceTableDataItem', this.interfaceTableDataItem)
        }
      }
    }
  },
  created() {
    if (this.componentConfig.options) {
      this.componentConfig.options._isGenerateComponent = true
    }
  },
  methods: {
    triggerEvent() {
      if (!this.componentConfig.options.eventConfig || !this.componentConfig.options.eventConfig.eventList) return false
      this.componentConfig.options.eventConfig.eventList.forEach(eventItem => {
        let eventDataPackage = {
          actionList: eventItem.actionList
        }
        if (eventItem.eventType !== 'change') {
          let eventHandle = new CustomEvent(`${this.componentConfig.generateComponentsUUID}-on-preload-handle-btn-confirm`, {
            detail: {
              eventType: eventItem.eventType,
              data: eventDataPackage,
              version: eventItem.version
            }
          })
          window.dispatchEvent(eventHandle)
        }
      })
    },
    triggerChangeEvent() {
      if (!this.componentConfig.options.eventConfig || !this.componentConfig.options.eventConfig.eventList) return false
      this.componentConfig.options.eventConfig.eventList.forEach(eventItem => {
        let eventDataPackage = {
          actionList: eventItem.actionList
        }
        if (eventItem.eventType === 'change') {
          let eventHandle = new CustomEvent(`${this.componentConfig.generateComponentsUUID}-on-preload-handle-btn-confirm`, {
            detail: {
              eventType: eventItem.eventType,
              data: eventDataPackage,
              version: eventItem.version
            }
          })
          window.dispatchEvent(eventHandle)
        }

      })
    }
  },
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

.mm {
  background: #ff0000;
}
</style>
