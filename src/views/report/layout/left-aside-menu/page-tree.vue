<template>
  <div class="pages-tree-wrap">
    <el-input placeholder="输入组件名称进行过滤" v-model="filterText" size="small" @change="onDebuger">
    </el-input>
    <el-tree
      class="pages-tree"
      highlight-current
      :data="treeDataList"
      :props="defaultProps"
      @node-drop="handleDrop"
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      default-expand-all
      :filter-node-method="filterNode"
      node-key="uuid"
      @node-click="onDoubleNodeClick"
      ref="tree"
    >
      <span
        slot-scope="{ data }"
        :title="`${data.name}：${
          (data.componentPointer &&
            data.componentPointer.options.commonConfigAssignName) ||
          data.componentName
        }${data.childrenName ? ' / ' + data.childrenName : ''}`"
        style="width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
        @mousemove="onMousemover(data)"
        @mouseleave="onMouseleave(data)"
      >
        <i class="iconfont" :class="data.icon" v-if="data.icon"></i>
        <span
          v-if="
            (data.componentPointer &&
              data.componentPointer.options.commonConfigAssignName) ||
            data.componentName
          "
        >
          {{
            `${
              (data.componentPointer &&
                data.componentPointer.options.commonConfigAssignName) ||
              data.componentName
            }${data.childrenName ? " / " + data.childrenName : ""}`
          }}
        </span>
        <!-- TODO::: 待优化；为pc表格列值的图标类型特殊处理 -->
        <span v-else-if="(typeof data.name) !== 'object'">
          {{
            `${data.name}${data.childrenName ? " / " + data.childrenName : ""}`
          }}
        </span>
        <span v-else> 图标 </span>
      </span>
    </el-tree>
    <!-- design help -->
    <designHelpSaveCode :dialog-visible.sync="helpDialogVisible" />
  </div>
</template>

<script>
import { coverBigComponent } from "@/views/report/utils/common-const";
import designHelpSaveCode from "./modules/design-help-save-code.vue";
import store from "@/store";
import { EventBus } from "@/util/event-bus.js";
export default {
  name: "page-tree",
  components: {
    designHelpSaveCode,
  },
  props: {
    // componentsConfigs: {
    //   type: Array,
    //   default: () => [],
    // },
    componentList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      helpDialogVisible: false,
      isDoubleClick: false,
      // 树形结构
      filterText: "",
      treeDataList: [
        {
          uuid: 1,
          name: "页面",
          componentList: [],
        },
      ],
      defaultProps: {
        children: "componentList",
        label: "uuid",
      },
      tempComponent: {},
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    componentList: {
      immediate: true,
      deep: true,
      handler(vals, oldVals) {
        if (!this.treeDataList[0].componentList.length) {
          this.initPageTreeData(vals, this.treeDataList[0].componentList);
        } else {
          // TODO::: 待优化，性能差，不停做计算
          this.treeDataList[0].componentList = [];
          this.initPageTreeData(
            this.componentList,
            this.treeDataList[0].componentList
          );
        }
      },
    },
  },
  created() {},
  mounted() {
    EventBus.$on("onReloadAsideMenu", (data) => {
      if (!this.treeDataList[0].componentList.length) {
        this.initPageTreeData(
          this.componentList,
          this.treeDataList[0].componentList
        );
      } else {
        // TODO::: 待优化，性能差，不停做计算
        this.treeDataList[0].componentList = [];
        this.initPageTreeData(
          this.componentList,
          this.treeDataList[0].componentList
        );
      }
    });
  },
  beforeDestroy() {
    EventBus.$off("onReloadAsideMenu");
  },
  methods: {
    onDebuger(value) {
      if (value === "design-help-123456") {
        this.helpDialogVisible = true;
      }
    },
    onMousemover(nodeItem) {
      // 2021-08-13 由于鼠标hover 事件 每次都会被深度监听的componentList 捕获 ，导致大量的重复运算，暂时注释
      // nodeItem && nodeItem.componentPointer && this.$set(nodeItem.componentPointer, 'componentIsHoverStatus', true)
    },
    onMouseleave(nodeItem) {
      // nodeItem && nodeItem.componentPointer && this.$set(nodeItem.componentPointer, 'componentIsHoverStatus', false)
    },
    // 模拟双击事件，双击间隔为300ms
    onDoubleNodeClick(nodeItem) {
      // if (this.isDoubleClick) {
      //   this.handleNodeClick(nodeItem, isDoubleClick)
      // }
      this.handleNodeClick(nodeItem, this.isDoubleClick);
      this.isDoubleClick = !this.isDoubleClick;
      setTimeout(() => {
        this.isDoubleClick = false;
      }, 300);
    },
    handleNodeClick(nodeItem, isDoubleClick) {
      isDoubleClick && this.$emit("onChangeNode");
      if (nodeItem.uuid === 1) {
        // 页面节点特殊处理
        store.dispatch("app/changeMobileDesignComponentUUID", nodeItem.uuid);
        EventBus.$emit("onChangeCurrentWidgetComponentConfig", nodeItem);
        return false;
      }
      if (nodeItem._specialConfig) {
        // 表格节点特殊处理
        store.dispatch("app/changeMobileDesignComponentUUID", nodeItem.uuid);
        EventBus.$emit(
          "onChangeCurrentWidgetComponentConfig",
          nodeItem._specialConfig
        );
        return false;
      }
      if (!nodeItem.uuid || !nodeItem.componentPointer) return false;
      store.dispatch("app/changeMobileDesignComponentUUID", nodeItem.uuid);
      EventBus.$emit(
        "onChangeCurrentWidgetComponentConfig",
        nodeItem.componentPointer
      );
    },
    initPageTreeData(dataList, tempArr) {
      dataList.forEach((item) => {
        if (!item.uuid) return false;
        let treeObj = {
          uuid: item.uuid,
          icon: item.icon,
          name: item.name,
          type:item.type,
          componentName: item.options.commonConfigAssignName,
          componentPointer: item, // 引用组件对象，不占用内存
          componentList: [],
        };
        if(item.type=='van-design-group-component'){
          treeObj.name="复合组件"+ (item.reportName?":"+item.reportName:"");
        }
        if (
          item.options &&
          item.options.columns &&
          item.options.columns.length > 0
        ) {
          item.options.columns.forEach((columnsItem, columnsIndex) => {
            if (
              !columnsItem.componentList ||
              typeof columnsItem.componentList.push !== "function"
            )
              return false;
            treeObj.componentList[columnsIndex] = {
              uuid: columnsItem.specialUUID || columnsItem.value + "", // specialUUID为表格列菜单的特殊属性
              childrenName: columnsItem.value + "",
              name: item.name,
              type: item.type,
              componentName: item.options.commonConfigAssignName,
              componentList: [],
              _specialConfig: columnsItem._specialConfig,
            };
            this.initPageTreeData(
              columnsItem.componentList,
              treeObj.componentList[columnsIndex].componentList
            );
          });
        }
        tempArr.push(treeObj);
      });
    },
    onClickComponent(data) {
      this.$refs.tree.setCurrentKey(data.uuid)
    },
    filterNode(value, data) {
      if (!value || !data || !data.componentName) return true;
      return data.componentName.indexOf(value) !== -1;
    },
    /**
     * draggingNode 被拖拽节点
     * dropNode 结束拖拽时最后进入的节点
     */
    handleDrop(draggingNode, dropNode, dropType, ev) {

      //判断第一步，先处理平级的情况
      //找到原来的位置 把他删了，然后找到新的位置 吧临时变量插入
      this.tempComponent = {};
      this.handleComponent(this.componentList, draggingNode.label);
      this.findComponentInTree(this.treeDataList[0].componentList,this.componentList, draggingNode.label);
      // this.componentList.forEach((cItem,cIndex)=>{
      //       if(cItem.uuid==dropNode.label){
      //         tempComponent=this.componentList[cIndex]
      //         this.componentList.splice(cIndex, 1 )
      //       }
      // })


      // this.treeDataList[0].componentList.forEach((item, index) => {
      //   if (item.uuid == draggingNode.label) {
      //     this.componentList.splice(index, 0, this.tempComponent);
      //   }
      // });
    },
    handleComponent(componentList, componentUuid) {
      componentList.forEach((component, index) => {
        let type = component.type;

        if (component.uuid == componentUuid) {
          this.tempComponent = componentList[index];
          componentList.splice(index, 1);
        } else if (
          coverBigComponent.indexOf(type) !== -1 &&
          component.options.columns &&
          component.options.columns.length
        ) {
          component.options.columns.forEach((columns) => {
            if (columns.componentList && columns.componentList.length) {
              this.handleComponent(columns.componentList, componentUuid);
            }
          });
        } else if (type === "van-design-group-component") {
          this.handleComponent(component.options.componentList, componentUuid);
        }
      });
    },
    findComponentInTree(treeComponentList, componentList, componentUuid) {
      treeComponentList.forEach((treeComponent, index) => {
        if (treeComponent.uuid == componentUuid) {
          componentList.splice(index, 0, this.tempComponent);
        } else if (
          treeComponent.componentList &&
          treeComponent.componentList.length
        ) {
          componentList.forEach((componentChild) => {

            if (componentChild.uuid == treeComponent.uuid) {
              treeComponent.componentList.forEach((child,cIndex) => {
                this.findComponentInTree(child.componentList,componentChild.options.columns[cIndex].componentList,componentUuid);
              });
            }
          });
        }
      });
    },
    allowDrop(draggingNode, dropNode, type) {
      /**
       * 1、这里首先处理 不能放到 最外层
       * 2、然后处理，非嵌套组件 不能inner
       *
       *
       */
      //限制首层仅有一个节点，其他节点不可并列
      if (!dropNode.parent.parent) {
        return false;
      }
      if (type == "inner") {
        let ctype = dropNode.data.type;
        if (coverBigComponent.indexOf(ctype) !== -1) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
    allowDrag(draggingNode) {
       if(!draggingNode.data.type){
         return false;
       }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.pages-tree-wrap {
  padding: 10px;
  user-select: none;
  height: calc(100vh - 51px);
  overflow-y: auto;
  .pages-tree {
    padding-top: 10px;
  }
}
</style>
