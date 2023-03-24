<template>
  <div
    class="mobile-phone-view"
    :style="{ backgroundColor: globalConfig.backgroundColor }"
    @click="$emit('mobileViewClick')"
    @contextmenu.prevent.stop="rightClickMenu"
  >
    <mobileComponent
      ref="mobileView"
      :style="{}"
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
import mobileComponent from "./components/index.vue";
import { mktApplyCpntDown } from "@/api/componentApply";
import { Vue, Component, Prop } from "vue-property-decorator";
// import componentsConfigs from "@/views/report/mobile/components/configs/index";
import useReportRightMenu from "@/hooks/use-report-right-menu/index";
const { commonComponentListFn } = useReportRightMenu("mobile");
import {getStorage,setStorage} from "@/util/storageUtil.js";

@Component({
  components: {
    mobileComponent,
  },
})
export default class MobileDesign extends Vue {
  name: "FmMakingFormMobile";
  $refs: { mobileView: HTMLFormElement };
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
    console.log("mobile init");
    this.$refs.mobileView.initApiQuery();
  }

  rightClickMenu(event) {
    this.$emit("mobileViewClick"); //先模拟单击，选中页面
    this.$nextTick(function () {
      // @ts-ignore
      this.$contextmenu({
        items: [
          {
            label: "复制",
            onClick: () => {
              setStorage(
                "clipboard_mobile_report_id",
                getStorage("reportId") || ""
              );
            },
          },
          {
            label: "粘贴",
            onClick: () => {
              this.$emit("onCopyReportView", "clipboard_mobile_report_id");
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
.mobile-phone-view {
  overflow: auto;
  position: relative;
  margin: 0 auto;
  // width: 397px;
  // height: 667px;
  width: 375px;
  min-height: 100%;
  background-color: #f8f8f8;
  border-radius: 5px;
  box-shadow: 0 0 2px 1px #ccc;
  border-top: 1px solid #e0e0e0;
  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>
