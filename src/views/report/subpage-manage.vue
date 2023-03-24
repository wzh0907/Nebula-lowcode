<template>
  <ul class="pages-select-btn-wrap">
    <li @click="onChangeMainPage" :class="{ active: !chooseSubpageIndex }">
      #1
    </li>
    <li
      v-for="(subpageItem, key) in subpageList"
      :key="key"
      @click="onChangeNewSubpage(subpageItem, key)"
      :class="{ active: chooseSubpageIndex === key + 1 }"
    >
      #{{ key + 2 }}
    </li>
    <li @click="onAddNewSubpage">
      <i class="iconfont iconjiahao1"></i>
    </li>
  </ul>
</template>

<script lang="ts">
// ts类型
import { Vue, Prop, Component } from "vue-property-decorator";
import { generateUUID } from "@/views/report/utils/index.js";
import { saveSubItemService } from "@/api/v5";
import { EventBus } from "@/util/event-bus.js";
@Component({
  components: {},
})
export default class SubpageManage extends Vue {
  name: "SubpageManage";
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  componentList;
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  subpageList;
  @Prop({
    type: Number,
    default: () => {
      return [];
    },
  })
  id;

  // data
  chooseSubpageIndex = 0;

  created() {}

  // method
  onChangeMainPage() {
    this.$emit("onSaveOldPage");
    setTimeout(() => {
      this.chooseSubpageIndex = 0;
      this.$emit("onChangeMainPage");
      this.$emit("onInitPageData");
    });
  }
  onAddSubpage() {
    let subPageUUID = generateUUID();
    this.subpageList.push({
      list: [],
      config: {
        reportId: 0, // this.id,
        uuid: subPageUUID,
        name: "",
        reportName: "",
        pullRefresh: false,
        adaptiveStatusBar: false,
        statusBarColor: "",
        backgroundColor: "#f8f8f8",
        remark: "",
        interfaceDataConfig: [],
        // 布局
        topPaddingDistance: 0,
        rightPaddingDistance: 0,
        bottomPaddingDistance: 0,
        leftPaddingDistance: 0,
      },
      groupList: [],
    });
  }
  onAddNewSubpage() {
    this.$emit("onSaveOldPage");

    let fileName = `子页面`;
    const params = {
      queryType: "PC",
      name: fileName,
      reportName: fileName,
      dataType: "report",
      subType: "report",
      visible: true,
      parentId: this.id,
    };
    saveSubItemService(params).then((res: any) => {
      // this.initData(res.data.treeId);
      if (res.code == 0) {
        this.$emit("onAddNewSubpage", res.data.id);
      }
    });
  }
  onChangeSubpage(subpageItem, index) {
    console.log('onChangeSubpage');
    if (this.chooseSubpageIndex === 0) {
      // 当前是主页切换到子页，需要保存一下主页面的数据，防止componentList被覆盖
      this.$emit("onSaveMainComponentList", this.componentList);
    }
    if (!subpageItem.list) {
      subpageItem.list = [];
    }
    let globalConfig = subpageItem.config;
    let componentList = subpageItem.list;
    let subpageIndex = index + 1;
    this.chooseSubpageIndex = subpageIndex;

    this.$emit("onChangeSubpage", globalConfig, componentList, subpageIndex);
    this.$emit("onInitPageData");
  }
  onChangeNewSubpage(subpageItem, index) {
    this.$emit("onSaveOldPage");
    setTimeout(() => {
      let subpageIndex = index + 1;
      this.chooseSubpageIndex = subpageIndex;
      // 切换前需要先保存一下
      this.$emit("onChangeNewSubpage", subpageItem, subpageIndex);
      this.$emit("onInitPageData");
    }, 50);
  }
}
</script>

<style lang="scss" scoped>
.pages-select-btn-wrap {
  padding-bottom: 20px;
  text-align: center;
  li {
    display: inline-block;
    padding: 2px;
    margin-right: 5px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    border-radius: 100%;
    font-size: 12px;
    cursor: pointer;
    &.active {
      background-color: #197aff;
      color: #fff;
    }
  }
}
</style>
