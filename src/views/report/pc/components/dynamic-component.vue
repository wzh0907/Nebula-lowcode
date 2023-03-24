<template>
  <a-col
    v-if="componentConfig.options.commonConfigAssignIsCol"
    :span="componentConfig.options.commonConfigAssignSpanCol"
    class="widget-col widget-view disign-mode drag-widget"
    style="overflow: inherit;"
    :style="{
        display:componentConfig.options.commonConfigAssignHide?'none':''
      }"
    :class="{'component-is-hover-status': componentConfig.componentIsHoverStatus, active: $store.state.app.mobileDesignComponentUUID === componentConfig.uuid, [componentConfig.options.commonConfigAssignSign]: true, [componentConfig.options.commonConfigAssignCustomClass]: true}"
    @click.stop="chooseItemIndex"
    @contextmenu.prevent.stop="rightClickMenu"
  >

    <!-- backgroundColor: componentConfig.options.commonConfig && componentConfig.options.commonConfig.backgroundColor, -->
    <component v-bind:is="componentConfig.component" class="tab"
               :parentNodeList="parentNodeList"
               :style="{
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
    <!--    <div-->
    <!--      class="widget-view-action widget-col-action"-->
    <!--      style="top: auto; bottom: -30px;"-->
    <!--      v-show="operability && $store.state.app.mobileDesignComponentUUID === componentConfig.uuid"-->
    <!--    >-->
    <!--      <i class="iconfont iconfuzhi" title="复制到剪贴板" @click.stop="copyComponentItem"/>-->
    <!--      <i class="iconfont iconniantie" title="黏贴" @click.stop="pasteComponentItem"/>-->
    <!--      <i class="iconfont iconjiantou-top" title="上移" @click.stop="moveUpComponentItem"/>-->
    <!--      <i class="iconfont iconjiantou-bottom" title="下移" @click.stop="moveDownComponentItem"/>-->
    <!--      <i class="iconfont iconclone" title="快速复制" @click.stop="cloneComponentItem"/>-->
    <!--      <i class="iconfont icontrash" title="删除组件" @click.stop="deleteComponentItem"/>-->
    <!--    </div>-->


    <!-- <div
      class="widget-view-drag widget-col-drag"
      v-if="operability && $store.state.app.mobileDesignComponentUUID === componentConfig.uuid"
    >
      <i class="iconfont icondrag drag-widget" />
    </div> -->
  </a-col>
  <div style="overflow: inherit;display:inline-block" class="widget-col widget-view disign-mode drag-widget"
       :class="{'component-is-hover-status': componentConfig.componentIsHoverStatus, active: $store.state.app.mobileDesignComponentUUID === componentConfig.uuid, [componentConfig.options.commonConfigAssignSign]: true, [componentConfig.options.commonConfigAssignCustomClass]: true}"
       :style="{
          width: componentConfig.options.commonConfigCompWidthUnit === 'auto' ? '' : (componentConfig.options.commonConfigCompWidth + componentConfig.options.commonConfigCompWidthUnit),
          height: componentConfig.options.commonConfigCompHeightUnit === 'auto' ? '' : componentConfig.options.commonConfigCompHeight + componentConfig.options.commonConfigCompHeightUnit,
         }"
       v-else
       @click.stop="chooseItemIndex"
       @contextmenu.prevent.stop="rightClickMenu"
  >
    <component v-bind:is="componentConfig.component" class="tab"
               :style="{
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
    <!--    <div-->
    <!--      class="widget-view-action widget-col-action"-->
    <!--      style="top: auto; bottom: -30px;"-->
    <!--      v-show="operability && $store.state.app.mobileDesignComponentUUID === componentConfig.uuid"-->
    <!--    >-->
    <!--      <i class="iconfont iconfuzhi" title="复制到剪贴板" @click.stop="copyComponentItem"/>-->
    <!--      <i class="iconfont iconniantie" title="黏贴" @click.stop="pasteComponentItem"/>-->
    <!--      <i class="iconfont iconjiantou-top" title="上移" @click.stop="moveUpComponentItem"/>-->
    <!--      <i class="iconfont iconjiantou-bottom" title="下移" @click.stop="moveDownComponentItem"/>-->
    <!--      <i class="iconfont iconclone" title="快速复制" @click.stop="cloneComponentItem"/>-->
    <!--      <i class="iconfont icontrash" title="删除组件" @click.stop="deleteComponentItem"/>-->
    <!--    </div>-->
  </div>
</template>

<script>
import {EventBus} from "@/util/event-bus";
import {componentConfigItemType} from "@/views/report/type";
import componentsConfigs from "@/views/report/pc/components/configs/index";
import store from "@/store";
export default {
  name: 'dynamic-components',
  props: {
    operability: {
      type: Boolean,
      default: true
    },
    elIndex: {
      type: Number,
      default: 0
    },
    componentConfig: {
      type: Object,
      default: () => {
      }
    },
    parentNodeList: {
      type: Array,
      default: () => []
    },
  },

  computed: {
    parentList() {
      const list = []
      for (let i = 1; i < this.parentNodeList.length - 1; i++) {
        let item = this.parentNodeList[i]
        list.unshift({
          label: item.name,
          onClick: () => {
            if (!item.uuid) return false
            store.dispatch('app/changeMobileDesignComponentUUID', item.uuid)
            EventBus.$emit('onChangeCurrentWidgetComponentConfig', item)
          }
        })
      }
      let page = this.parentNodeList[0]
      list.push({
        label: page.name,
        onClick: () => {
          this.$emit('pcViewClick')
          let nodeItem = {
            uuid: 1,
            name: page.name,
            componentList: []
          }
          store.dispatch('app/changeMobileDesignComponentUUID', nodeItem.uuid)
          EventBus.$emit('onChangeCurrentWidgetComponentConfig', nodeItem)
        }
      })
      return list
    },
    commonComponentList() {
      let list = []
      for (const element of this.commonComponentConfigs) {
        list.push({
          label: element.name,
          onClick: () => {
            this.$emit('insertComponentItem', this.elIndex, element)
          }
        })
      }
      return list
    },
    eventList() {
      return this.componentConfig.options.eventConfig.eventList || []
    }
  },
  data() {
    return {
      oldOptions: {},
      componentsConfigs: componentsConfigs,
      commonComponentConfigs: [],
    }
  },
  mounted() {
    const commonComponentTypes = [
      "van-design-layout",
      "van-design-text",
      "van-design-icon",
      "van-design-button",
      "van-design-field",
      "van-design-select",
      "van-design-calendar",
      "van-design-image",
      "van-design-tabs",
    ];
    commonComponentTypes.forEach(type => {
      this.componentsConfigs.forEach(components => {
        components.forEach(item => {
          if (type === item.type) {
            this.commonComponentConfigs.push(item);
            // if (commonComponentTypes.indexOf(item.type) !== -1) {
            //   commonComponentList.push(item)
            // } else if (chartComponentTypes.indexOf(item.type) !== -1) {
            //   chartComponentList.push(item)
            // } else if (inputComponentTypes.indexOf(item.type) !== -1) {
            //   inputComponentList.push(item)
            // } else {
            //   otherComponentList.push(item)
            // }
          }
        });
      });
    });
  },
  watch: {
    'componentConfig.options': {
      deep: true,
      immediate: true,
      handler(val, oldVal) {
        if (oldVal === undefined) {
          /**
           * 2021-07-21在dynamic-component 上的watch 有个问题
           只会去最下面的组件
           原因也很简单因为数组 如果不是最后一位，新添加的 在数组最后一个永远是undefine
           */
          // 为空时说明是新创建的组件
          // this.$pageDataModelEngine.saveComponentData(this.componentConfig.uuid, this.componentConfig)
        } else {
          // if (JSON.stringify(val) === JSON.stringify(this.oldOptions)) return false
          // this.$globalData.operateStack.push({
          //   uuid: this.componentConfig.uuid,
          //   options: JSON.parse(JSON.stringify(val))
          // })
        }
        this.oldOptions = JSON.parse(JSON.stringify(val))
      }
    }
  },
  methods: {
    //  async queryMenuExceMethod() {
    //     //  获取本组件下的所有method
    //     const methods = this.$options.methods
    //     _.forEach(this.menuList, item => {
    //       // 判断是否需要执行函数
    //       if (!!item.methodName) {
    //         // 使用this.$options.methods 会有this指向问题
    //         methods[item.methodName].call(this, item)
    //       }
    //     })
    //   },
    // copyComponentItem() {
    //   this.$emit('copyItemIndex', this.elIndex)
    // },
    // pasteComponentItem() {
    //   this.$emit('pasteItemIndex', this.elIndex)
    // },
    chooseItemIndex() {
      this.$emit('chooseItemIndex', this.elIndex, this.componentConfig.uuid)
    },
    deleteComponentItem() {
      this.$emit('deleteComponentItem', this.elIndex)
    },
    cloneComponentItem() {
      this.$emit('cloneComponentItem', this.elIndex)
    },
    moveUpComponentItem() {
      this.$emit('moveUpComponentItem', this.elIndex)
    },
    moveDownComponentItem() {
      this.$emit('moveDownComponentItem', this.elIndex)
    },
    handleWidgetColAdd(index) {
      // this.$emit('addComponentItem', this.elIndex)
    },
    handleWidgetColUpdate(evt) {
    },
    rightClickMenu(event) {
      this.chooseItemIndex()  //先模拟单击，选中组件
      this.$nextTick(function () {
        this.$contextmenu({
          items: [
            {
              label: "复制",
              onClick: () => {
                this.$emit('copyItemIndex', this.elIndex)
              }
            },
            {
              label: "粘贴",
              onClick: () => {
                this.$emit('pasteItemIndex', this.elIndex)
              }
            },
            {
              label: "事件",
              children: [
                {
                  label: "点击事件",
                  onClick: () => {
                    EventBus.$emit('pcEventHandler', 'click')
                  }
                },
                {
                  label: "值变化事件",
                  onClick: () => {
                    EventBus.$emit('pcEventHandler', 'change')
                  }
                }
              ]
            },
            {
              label: "移动",
              children: [
                {
                  label: "向上移动",
                  onClick: () => {
                    this.$emit('moveUpComponentItem', this.elIndex)
                  }
                },
                {
                  label: "向下移动",
                  onClick: () => {
                    this.$emit('moveDownComponentItem', this.elIndex)
                  }
                },
                {
                  label: "置顶",
                  onClick: () => {
                    this.$emit('moveToTopComponentItem', this.elIndex)
                  }
                },
                {
                  label: "置底",
                  onClick: () => {
                    this.$emit('moveToBottomComponentItem', this.elIndex)
                  }
                },
                {
                  label: "向外移动",
                  onClick: () => {
                    EventBus.$emit('moveOutComponentItem', this.elIndex, this.componentConfig)
                    if (this.parentNodeList.length > 2) {
                      this.$emit('deleteComponentItem', this.elIndex)
                    }
                  }
                },
                {
                  label: "向内移动",
                  onClick: () => {
                    this.$emit('moveInComponentItem', this.elIndex)
                  }
                }
              ]
            },
            {
              label: "插入",
              children: this.commonComponentList
            },
            {
              label: "父级",
              children: this.parentList
            },
            {
              label: "删除",
              onClick: () => {
                this.$emit('deleteComponentItem', this.elIndex)
              }
            },
          ],
          event,
          //x: event.clientX,
          //y: event.clientY,
          customClass: "class-a",
          zIndex: 3,
          minWidth: 200
        });
      })
      return false;
    }
  }
}
</script>

<style lang="scss" scoped>
.widget-form-container .widget-form-list .widget-view {
  margin: 0;
}

.widget-form-container .widget-form-list .widget-col {
  background-color: transparent;
  padding: 0;
}

// 突出
.widget-form-container .widget-form-list .disign-mode {
  // border: 2px solid transparent !important;
}

.widget-form-container .widget-form-list .disign-mode.widget-col:hover {
  outline: 0 !important;
  // background: #f5fafe !important;
  background: transparent;
  border: 1px dashed #197aff !important;
  margin: -1px;
}

.widget-form-container
.widget-form-list
.disign-mode.widget-col.component-is-hover-status {
  outline: 0 !important;
  background: #f5fafe !important;
  border: 1px dashed #197aff !important;
  margin: -1px;
}

.widget-form-container .widget-form-list .disign-mode.widget-col.active {
  outline: 0 !important;
  border: 1px solid #197aff !important;
  margin: -1px;
}

.widget-form-container
.widget-form-list
.widget-col
.widget-view-action.widget-col-action {
  background-color: #197aff;
}
</style>
