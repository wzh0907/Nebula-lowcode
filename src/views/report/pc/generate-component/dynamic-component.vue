<template>
  <div v-if="componentConfig.options.commonConfigAssignIsCol">
    <a-col
      :span="componentConfig.options.commonConfigAssignSpanCol"
      :style="{
      display:componentConfig.options.commonConfigAssignHide?'none':''
    }"
    class="widget-col widget-view"
    :class="componentConfig.options.commonConfigAssignSign + ' ' + componentConfig.options.commonConfigAssignCustomClass"
    v-if="componentConfig.options.commonConfigAssignIsCol&&componentConfig.options.commonConfig && !componentConfig.options.commonConfig.displayHide"
  >
    <!-- backgroundColor: componentConfig.options.commonConfig && componentConfig.options.commonConfig.backgroundColor, -->
    <div>
      <component @click.native.stop="triggerEvent('click')" v-bind:is="componentConfig.component" v-bind:style="testClass" v-if="componentConfig.type=='van-design-custom'" class="tab">
      </component>
      <component @click.native.stop="triggerEvent('click')" v-bind:is="componentConfig.component" v-else class="tab"
                 :style="{
        pointer: 'cursor',
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
  </a-col>
  </div>
  <div
    style="overflow: inherit;display:inline-block;vertical-align: middle;"
    :style="{
      width: componentConfig.options.commonConfigCompWidthUnit === 'auto' ? '' : (componentConfig.options.commonConfigCompWidth + componentConfig.options.commonConfigCompWidthUnit),
      height: componentConfig.options.commonConfigCompHeightUnit === 'auto' ? '' : componentConfig.options.commonConfigCompHeight + componentConfig.options.commonConfigCompHeightUnit,
    }"
    class="widget-col widget-view"
    :class="componentConfig.options.commonConfigAssignSign + ' ' + componentConfig.options.commonConfigAssignCustomClass"
    v-else-if="componentConfig.options.commonConfig && !componentConfig.options.commonConfig.displayHide"
  >
      <div style="width: 100%; height: 100%">
        <component @click.native.stop="triggerEvent('click')" v-bind:is="componentConfig.component" v-bind:style="testClass" v-if="componentConfig.type=='van-design-custom'" class="tab">
        </component>
        <component @click.native.stop="triggerEvent('click')" v-bind:is="componentConfig.component" v-else class="tab"
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
</template>

<script lang="ts">
import { getCustomService } from "@/api/reportCustom";
/* eslint-disable */
export default {
  name: "dynamic-components",
  props: ["elIndex", "isSelected", "componentConfig", "interfaceTableDataItem"],
  data() {
    return {
      testClass: "",
    };
  },
  watch: {
    "componentConfig.options.value": {
      deep: true,
      handler(val) {
        this.triggerChangeEvent();
      },
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
    this.componentConfig.options &&
      (this.componentConfig.options._isGenerateComponent = true);
    if (this.componentConfig.options.customId) {
      let param = {
        customId: this.componentConfig.options.customId,
      };

      getCustomService(param).then((res) => {
        // let data = eval("(false || "+res.data.data+")");
        // let methods = eval('('+res.data.methods+')');
        let mixin = eval("(false ||" + res.data.mixin + ")");
        console.log("mixin=", mixin);
        this.componentConfig.component = {
          data: mixin.data,
          template: res.data.template,
          // mixin:mixin
          methods: mixin.methods,
        };
        this.testClass = res.data.style;
        let style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(this.testClass));

        document.body.appendChild(style);
        var head = document.getElementsByTagName("head")[0];

        head.appendChild(style);
      });
    }
  },
  methods: {
    // PC
    triggerEvent() {
      if (
        !this.componentConfig.options.eventConfig ||
        !this.componentConfig.options.eventConfig.eventList
      )
        return false;
      this.componentConfig.options.eventConfig.eventList.forEach(
        (eventItem) => {
          let eventDataPackage = {
            actionList: eventItem.actionList,
          };
          if (eventItem.eventType !== "change") {
            let eventHandle = new CustomEvent(
              `${this.componentConfig.generateComponentsUUID}-on-preload-handle-btn-confirm`,
              {
                detail: {
                  eventType: eventItem.eventType,
                  data: eventDataPackage,
                  version: eventItem.version
                },
              }
            );
            window.dispatchEvent(eventHandle);
          }
        }
      );
    },
    triggerChangeEvent() {
      if (
        !this.componentConfig.options.eventConfig ||
        !this.componentConfig.options.eventConfig.eventList
      )
        return false;
      this.componentConfig.options.eventConfig.eventList.forEach(
        (eventItem) => {
          let eventDataPackage = {
            actionList: eventItem.actionList,
          };
          if (eventItem.eventType === "change") {
            let eventHandle = new CustomEvent(
              `${this.componentConfig.generateComponentsUUID}-on-preload-handle-btn-confirm`,
              {
                detail: {
                  eventType: eventItem.eventType,
                  data: eventDataPackage,
                  version: eventItem.version
                },
              }
            );
            window.dispatchEvent(eventHandle);
          }
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.mm {
  background: #ff0000;
}
</style>
