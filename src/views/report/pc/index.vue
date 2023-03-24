<template>
  <div
    class="pc-view"
    @click="$emit('pcViewClick')"
    @contextmenu.prevent.stop="rightClickMenu"
    :style="{
      backgroundColor: globalConfig.backgroundColor,
      backgroundImage: 'url(' + globalConfig.backgroundImage + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      opacity:
        globalConfig.backgroundOpacity &&
        Math.abs(globalConfig.backgroundOpacity - 10) / 10,
      fontSize: globalConfig.fontSize + 'px',
      color: globalConfig.fontColor,
      padding: `${globalConfig.topPaddingDistance || 0}px ${
        globalConfig.rightPaddingDistance || 0
      }px ${globalConfig.bottomPaddingDistance || 0}px ${
        globalConfig.leftPaddingDistance || 0
      }px`,
    }"
  >
    <pcComponent
      ref="pcView"
      :componentList="componentList"
      :globalConfig="globalConfig"
      :parentNodeList="parentNodeList"
      @onChangeComponentList="onChangeComponentList"
      @onChangeChooseItemIndex="onChangeChooseItemIndex"
    />
  </div>
</template>

<script lang="ts">
import { EventBus } from "@/util/event-bus";
import pcComponent from "./components/index.vue";
import { mktApplyCpntDown } from "@/api/componentApply";
import { Vue, Component, Prop } from "vue-property-decorator";
// import componentsConfigs from "@/views/report/pc/components/configs/index";
import useReportRightMenu from "@/hooks/use-report-right-menu/index";
const { commonComponentListFn } = useReportRightMenu("pc");
import {getStorage,setStorage} from "@/util/storageUtil.js";
@Component({
  components: {
    pcComponent,
  },
})
export default class PcDesign extends Vue {
  name: "FmMakingFormPc";
  $refs: { pcView: HTMLFormElement };
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  componentList;
  @Prop({
    type: Object,
    default: () => {
      return {};
    },
  })
  globalConfig;
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  parentNodeList;
  async onChangeComponentList(componentList) {
    for (let i = 0; i < componentList.length; i++) {
      if (componentList[i].cpntName && !componentList[i].markStatus) {
        await this.showComment(componentList[i]);
      }
    }
    this.$emit("onChangeComponentList", componentList);
  }
  onChangeChooseItemIndex(currentComponentList, index) {
    this.$emit("onChangeChooseItemIndex", currentComponentList, index);
  }

  showComment(item) {
    return new Promise<void>((resolve, reject) => {
      let obj = {
        id: item.id,
        dirParentId: 0,
      };
      mktApplyCpntDown(obj).then((res) => {
        let configJson = JSON.parse(res.data.configJson || "{}").list || [];
        item.options.componentList = configJson;
        item.markStatus = true;
        resolve();
      });
    });
  }
  initApiQuery() {
    this.$refs.pcView.initApiQuery();
  }

  rightClickMenu(event) {
    this.$emit("pcViewClick"); //先模拟单击，选中页面
    this.$nextTick(function () {
      // @ts-ignore
      this.$contextmenu({
        items: [
          {
            label: "复制",
            onClick: () => {
              setStorage(
                "clipboard_pc_report_id",
                getStorage("reportId") || ""
              );
            },
          },
          {
            label: "粘贴",
            onClick: () => {
              this.$emit("onCopyReportView", "clipboard_pc_report_id");
            },
          },
          {
            label: "事件",
            children: [
              {
                label: "页面加载",
                onClick: () => {
                  EventBus.$emit("onPageEventClick", "load");
                },
              },
              {
                label: "页面重载",
                onClick: () => {
                  EventBus.$emit("onPageEventClick", "show");
                },
              },
            ],
          },
          {
            label: "插入",
            children: commonComponentListFn(this.componentList),
          },
        ],
        event,
        customClass: "class-a",
        zIndex: 3,
        minWidth: 200,
      });
    });
    return false;
  }
}
</script>

<style lang="scss" scoped>
.pc-view {
  position: relative;
  overflow: auto;
  min-height: 100%;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 2px 1px #ccc;
  border-top: 1px solid #e0e0e0;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 0;
    background: #fff;
  }
}
</style>
