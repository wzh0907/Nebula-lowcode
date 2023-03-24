<template>
  <div>
    <div v-if="!hideAsideMenu" class="aside-menu-page">
      <el-collapse
        v-model="collapseActives"
        class="basetab"
        style="height: calc(100vh - 100px);overflow-y: auto;"
        @change="handleChange"
      >
        <el-collapse-item
          v-for="(aside, key) in asideList"
          :key="key"
          :title="aside.name"
          :name="key"
        >
          <template slot="title">
            <span class="aside-collapse-title">{{ aside.name }}</span>
          </template>
          <draggable
            tag="ul"
            class="menu-item-wrap"
            :list="asideMenuComponentConfigList[key]"
            v-bind="{
                group: { name: draggableGroupName, pull: 'clone', put: false },
                sort: false,
                ghostClass: 'ghost'
              }"
            @end="onDragMoveEnd"
            @start="
                onDragMoveStart($event, asideMenuComponentConfigList[key])
              "
          >
            <li
              v-for="(componentConfig,
                configKey) in asideMenuComponentConfigList[key]"
              :key="configKey"
              @click="handleField(item)"
            >
              <div>
                <!--              <i-->
                <!--                v-if="componentConfig.type == 'van-design-text'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-icon'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="-->
                <!--                      componentConfig.type == 'van-design-datetime-picker'-->
                <!--                    "-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-checkbox'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-select'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-button'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-tabs'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-segment'"-->
                <!--                style="font-size:28px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-stepper'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-steps'"-->
                <!--                style="font-size:16px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-tag'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-divider'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-collapse'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-notice-bar'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-swipe'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <!--              <i-->
                <!--                v-else-if="componentConfig.type == 'van-design-field'"-->
                <!--                style="font-size:35px;line-height: 76px;"-->
                <!--                class="iconfont"-->
                <!--                :class="componentConfig.icon"-->
                <!--              />-->
                <i class="iconfont" :class="componentConfig.icon" />
              </div>
              <div class="icon-text">
                <span>{{ componentConfig.name }}</span>
              </div>
            </li>
          </draggable>
        </el-collapse-item>
      </el-collapse>
    </div>
<!--    <el-tabs v-model="tabsActive" stretch>-->
<!--      <el-tab-pane label="组件" name="basics">-->
<!--        <el-collapse-->
<!--          v-model="collapseActives"-->
<!--          class="basetab"-->
<!--          style="height: calc(100vh - 146px);overflow-y: auto;"-->
<!--          @change="handleChange"-->
<!--        >-->
<!--          <el-collapse-item-->
<!--            v-for="(aside, key) in asideList"-->
<!--            :key="key"-->
<!--            :title="aside.name"-->
<!--            :name="key"-->
<!--          >-->
<!--            <template slot="title">-->
<!--              <span class="aside-collapse-title">{{ aside.name }}</span>-->
<!--            </template>-->
<!--            <draggable-->
<!--              tag="ul"-->
<!--              class="menu-item-wrap"-->
<!--              :list="asideMenuComponentConfigList[key]"-->
<!--              v-bind="{-->
<!--                group: { name: draggableGroupName, pull: 'clone', put: false },-->
<!--                sort: false,-->
<!--                ghostClass: 'ghost'-->
<!--              }"-->
<!--              @end="onDragMoveEnd"-->
<!--              @start="-->
<!--                onDragMoveStart($event, asideMenuComponentConfigList[key])-->
<!--              "-->
<!--            >-->
<!--              <li-->
<!--                v-for="(componentConfig,-->
<!--                configKey) in asideMenuComponentConfigList[key]"-->
<!--                :key="configKey"-->
<!--                @click="handleField(item)"-->
<!--              >-->
<!--                <div>-->
<!--                  <i-->
<!--                    v-if="componentConfig.type == 'van-design-text'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-icon'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="-->
<!--                      componentConfig.type == 'van-design-datetime-picker'-->
<!--                    "-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-checkbox'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-select'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-button'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-tabs'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-segment'"-->
<!--                    style="font-size:28px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-stepper'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-steps'"-->
<!--                    style="font-size:16px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-tag'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-divider'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-collapse'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-notice-bar'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-swipe'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i-->
<!--                    v-else-if="componentConfig.type == 'van-design-field'"-->
<!--                    style="font-size:35px;line-height: 76px;"-->
<!--                    class="iconfont"-->
<!--                    :class="componentConfig.icon"-->
<!--                  />-->
<!--                  <i v-else class="iconfont" :class="componentConfig.icon" />-->
<!--                </div>-->
<!--                <div class="icon-text">-->
<!--                  <span>{{ componentConfig.name }}</span>-->
<!--                </div>-->
<!--              </li>-->
<!--            </draggable>-->
<!--          </el-collapse-item>-->
<!--        </el-collapse>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="模块" name="modules">-->
<!--        <div class="groupComment">-->
<!--          <div class="add_group_model">-->
<!--&lt;!&ndash;            <el-button size="small" @click="downComponentDialogVisible = true"&ndash;&gt;-->
<!--&lt;!&ndash;              >组件市场</el-button&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--            <el-button-->
<!--              size="small"-->
<!--              @click="creatGroupComment"-->
<!--              v-has="'report:addGroup'"-->
<!--              ><strong>新增组件</strong></el-button-->
<!--            >-->
<!--          </div>-->
<!--          <draggable-->
<!--            tag="ul"-->
<!--            class="module-item-wrap"-->
<!--            :list="pageModuleList"-->
<!--            v-bind="{-->
<!--              group: { name: 'people', pull: 'clone', put: false },-->
<!--              sort: false,-->
<!--              ghostClass: 'ghost'-->
<!--            }"-->
<!--          >-->
<!--            <li-->
<!--              v-for="(pageModuleItem, key) in pageModuleList"-->
<!--              :key="key"-->
<!--              @click="toGroup(pageModuleItem)"-->
<!--            >-->
<!--              <div>-->
<!--                <img-->
<!--                  :src="pageModuleItem.options.logoUrl"-->
<!--                  width="60px"-->
<!--                  v-if="pageModuleItem.options.logoUrl"-->
<!--                />-->
<!--                <img src="@/assets/noImg.png" width="60px" v-else />-->
<!--              </div>-->
<!--              <div style="font-size: 16px; font-weight: 500" class="icon-text">-->
<!--                <span>{{ pageModuleItem.reportName }}</span>-->
<!--              </div>-->
<!--            </li>-->
<!--          </draggable>-->
<!--          &lt;!&ndash;          <el-collapse v-model="activeNames" @change="handleChange">&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-collapse-item title="最近使用" name="1">&ndash;&gt;-->
<!--          &lt;!&ndash;              <div class="add_group_model">&ndash;&gt;-->
<!--          &lt;!&ndash;                <el-button size="small" @click="downComponentDialogVisible = true">组件市场</el-button>&ndash;&gt;-->
<!--          &lt;!&ndash;                <el-button size="small" @click="creatGroupComment"><strong>新增组件</strong></el-button>&ndash;&gt;-->
<!--          &lt;!&ndash;              </div>&ndash;&gt;-->
<!--          &lt;!&ndash;              <draggable&ndash;&gt;-->
<!--          &lt;!&ndash;                tag="ul"&ndash;&gt;-->
<!--          &lt;!&ndash;                class="module-item-wrap"&ndash;&gt;-->
<!--          &lt;!&ndash;                :list="pageModuleList"&ndash;&gt;-->
<!--          &lt;!&ndash;                v-bind="{&ndash;&gt;-->
<!--          &lt;!&ndash;                  group: { name: 'people', pull: 'clone', put: false },&ndash;&gt;-->
<!--          &lt;!&ndash;                  sort: false,&ndash;&gt;-->
<!--          &lt;!&ndash;                  ghostClass: 'ghost',&ndash;&gt;-->
<!--          &lt;!&ndash;                }"&ndash;&gt;-->
<!--          &lt;!&ndash;              >&ndash;&gt;-->
<!--          &lt;!&ndash;                <li v-for="(pageModuleItem, key) in pageModuleList" :key="key" @click="toGroup(pageModuleItem)">&ndash;&gt;-->
<!--          &lt;!&ndash;                  <div class="icon-text">&ndash;&gt;-->
<!--          &lt;!&ndash;                    <img src="@/assets/images/group.png" width="100%">&ndash;&gt;-->
<!--          &lt;!&ndash;                    <span>{{ pageModuleItem.reportName }}</span>&ndash;&gt;-->
<!--          &lt;!&ndash;                  </div>&ndash;&gt;-->
<!--          &lt;!&ndash;                </li>&ndash;&gt;-->
<!--          &lt;!&ndash;              </draggable>&ndash;&gt;-->
<!--          &lt;!&ndash;            </el-collapse-item>&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-collapse-item title="组件市场" name="2">&ndash;&gt;-->
<!--          &lt;!&ndash;              <div ref="scrollTopList" class="group_comment" @scroll="handleScroll($event)">&ndash;&gt;-->
<!--          &lt;!&ndash;                <draggable&ndash;&gt;-->
<!--          &lt;!&ndash;                  tag="ul"&ndash;&gt;-->
<!--          &lt;!&ndash;                  class="module-item-wrap"&ndash;&gt;-->
<!--          &lt;!&ndash;                  :list="groupCompositionList"&ndash;&gt;-->
<!--          &lt;!&ndash;                  v-bind="{&ndash;&gt;-->
<!--          &lt;!&ndash;                    group: { name: 'people', pull: 'clone', put: false },&ndash;&gt;-->
<!--          &lt;!&ndash;                    sort: false,&ndash;&gt;-->
<!--          &lt;!&ndash;                    ghostClass: 'ghost',&ndash;&gt;-->
<!--          &lt;!&ndash;                  }"&ndash;&gt;-->
<!--          &lt;!&ndash;                  @end="onModuleDragMoveEnd"&ndash;&gt;-->
<!--          &lt;!&ndash;                >&ndash;&gt;-->
<!--          &lt;!&ndash;                  <li&ndash;&gt;-->
<!--          &lt;!&ndash;                    v-for="(pageModuleItem, key) in groupCompositionList"&ndash;&gt;-->
<!--          &lt;!&ndash;                    :key="key"&ndash;&gt;-->
<!--          &lt;!&ndash;                  >&ndash;&gt;-->
<!--          &lt;!&ndash;                    <div class="icon-text">&ndash;&gt;-->
<!--          &lt;!&ndash;                      <span>{{ pageModuleItem.cpntName }}</span>&ndash;&gt;-->
<!--          &lt;!&ndash;                    </div>&ndash;&gt;-->
<!--          &lt;!&ndash;                  </li>&ndash;&gt;-->
<!--          &lt;!&ndash;                </draggable>&ndash;&gt;-->
<!--          &lt;!&ndash;              </div>&ndash;&gt;-->
<!--          &lt;!&ndash;            </el-collapse-item>&ndash;&gt;-->
<!--          &lt;!&ndash;          </el-collapse>&ndash;&gt;-->

<!--          &lt;!&ndash; <div>-->
<!--            <div class="aplayMarkStyle">-->
<!--              <h3>应用市场组件</h3>-->
<!--            </div>-->

<!--          </div> &ndash;&gt;-->
<!--        </div>-->
<!--      </el-tab-pane>-->
<!--    </el-tabs>-->
    <downComponentDialog
      @refreshGroupComponentList="refreshGroupComponentList"
      :dialog-visible.sync="downComponentDialogVisible"
      openType="1"
      title="组件下载"
    />
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import downComponentDialog from "../../../project-design/dialog-module/downComment/index.vue";
import {
  getGroupCompositionList,
  getGroupComponentListService
} from "@/api/report";
import { EventBus } from "@/util/event-bus.js";
import groupComponentConfig from "@/views/report/pc/components/configs/group-component/index";
import { saveReportV4 } from "@/api/v4";

export default {
  name: "AsideMenu",
  components: {
    Draggable,
    downComponentDialog
  },
  props: {
    componentsConfigs: {
      type: Array,
      default: () => []
    },
    componentList: {
      type: Array,
      default: () => []
    },
    globalConfig: {
      type: Object,
      default: () => {}
    },
    pageModuleList: {
      type: Array,
      default: () => []
    },
    hideAsideMenu: {
      type: Boolean,
      default: false
    },
    deviceDesignType: String
  },
  data() {
    return {
      pageSize: 10,
      pageIndex: 1,
      // hideAsideMenu: false,
      //    totalNumber: 10
      totalPage: 0,
      totalNumber: Number,
      isLoading: true,
      activeNames: ["1"],
      asideMenuComponentConfigList: [],
      groupCompositionList: [],
      draggableGroupName: "people",
      tabsActive: "basics",
      collapseActives: [0, 1, 2, 3],
      downComponentDialogVisible: false,
      // componentsConfigs,
      asideList: [
        {
          name: "通用",
          icon: "iconRectangleCopy"
        },
        {
          name: "图表",
          icon: "iconqita"
        },
        {
          name: "输入",
          icon: "iconqita"
        },
        {
          name: "其他",
          icon: "iconqita"
        }
      ]
      // 树形结构
      // filterText: '',
      // treeDataList: [
      //   {
      //     uuid: 1,
      //     name: '页面',
      //     componentList: []
      //   }
      // ],
      // defaultProps: {
      //   children: 'componentList',
      //   label: 'uuid'
      // }
    };
  },
  created() {
    this.pickupComponentAside();
    // this.getGroupCommenList()
  },
  mounted() {
    EventBus.$on("onChangeDraggableGroupName", data => {
      this.draggableGroupName = data;
    });
    window.addEventListener("scroll", this.handleScroll);
    // this.$nextTick(() => {
    //   window.addEventListener(
    //     "scroll",
    //     this.throttle(this.handleScroll, 500),
    //     true
    //   );
    // });
    window.addEventListener("update-mart-common", this.getGroupCommenList);
  },
  beforeDestroy() {
    window.removeEventListener(`update-mart-common`, this.getGroupCommenList);
  },
  methods: {
    refreshGroupComponentList() {
      this.$emit("refreshGroupComponentList");
    },

    pickupComponentAside() {
      this.asideList = [];
      this.asideList = [
        {
          name: "常用",
          icon: "iconRectangleCopy"
        },
        {
          name: "图表",
          icon: "iconqita"
        },
        {
          name: "输入",
          icon: "iconqita"
        },
        {
          name: "其他",
          icon: "iconqita"
        }
      ];
      let commonComponentTypes;
      let chartComponentTypes;
      let inputComponentTypes;
      let otherComponentTypes;
      if (this.deviceDesignType === "PC") {
        // this.asideMenuComponentConfigList = []
        // this.componentsConfigs.forEach((vals, index) => {
        //   this.asideMenuComponentConfigList[index] = []
        //   vals.forEach((item) => {
        //     if (!item.isAsideMenuHide) {
        //       this.asideMenuComponentConfigList[index].push(item)
        //     }
        //   })
        // })
        commonComponentTypes = [
          "van-design-layout",
          "van-design-text",
          "van-design-icon",

          "van-design-button",
          "van-design-field",
          "van-design-select",
          "van-design-calendar",
          "van-design-image",
          "van-design-tabs",
          "van-design-calendar-range"
        ];
        chartComponentTypes = [
          "van-design-table",
          "van-design-list",
          "van-design-chart-histogram",
          "van-design-chart-line",

          "van-design-chart-line-area",
          "van-design-chart-bar",
          "van-design-chart-funnel",
          "van-design-chart-ring",

          // "van-design-chart-heatmap",
          "van-design-chart-scatter",
          "van-design-chart-pie-radius",
          "van-design-chart-pie",

          "van-design-progress",
          "van-design-progress-bar",
          "van-design-chart-waterfall",
          "van-design-chart-radar"
        ];
        inputComponentTypes = [
          "van-design-editor",
          // "van-design-form",
          "van-design-checkbox",
          "van-design-radio",
          "van-design-cascade",
          "van-design-tree-select",
          "van-design-tree",
          "van-design-slider",
          "van-design-datetime-picker",
          "van-design-upload-img",
          "van-design-stepper",
          "van-design-switch",
          "van-design-checkbox-auth",
          "van-design-upload-file"
        ];
        otherComponentTypes = [
          "van-design-page-header",
          "van-design-divider",
          "van-design-dropdown-menu",
          "van-design-steps",

          "van-design-collapse",
          "van-design-qrcode",
          "van-design-iframe",
          "van-design-custom",
          "van-design-workflow"
        ];
      } else {
        // 修改菜单名称

        // 组件为的菜单分类
        commonComponentTypes = [
          "van-design-text",
          "van-design-icon",
          "van-design-image",
          "van-design-button",
          "van-design-layout",
          "van-design-list",
          "van-design-segment",
          "van-design-tabs",
          "van-design-field",
          "van-design-calendar",
          "van-design-select"
        ];
        chartComponentTypes = [
          "van-design-chart-ring",
          "van-design-chart-bar",
          "van-design-chart-histogram",
          "van-design-chart-line",
          "van-design-progress-bar",
          "van-design-progress",
          "van-design-circle",
          "van-design-table"
        ];
        inputComponentTypes = [
          "van-design-form",
          "van-design-stepper",
          "van-design-datetime-picker",
          "van-design-checkbox",
          "van-design-radio",
          "van-design-rate",
          "van-design-slider",
          "van-design-switch",
          "van-design-location",
          "van-design-upload-img",
          "van-design-dropdown-menu"
        ];
        otherComponentTypes = [
          "van-design-divider",
          "van-design-collapse",
          "van-design-steps",
          "van-design-notice-bar",
          "van-design-swipe",
          "van-design-tag",
          "van-design-countdown",
          "van-design-qrcode",
          "van-design-share",
          "van-design-custom",
          "van-design-idcard-ocr",
          "van-design-video-player"
        ];
      }
      // 分类容器
      const commonComponentList = [];
      const chartComponentList = [];
      const inputComponentList = [];
      const otherComponentList = [];
      this.asideMenuComponentConfigList = [
        commonComponentList,
        chartComponentList,
        inputComponentList,
        otherComponentList
      ];
      commonComponentTypes.forEach(type => {
        this.componentsConfigs.forEach(vals => {
          vals.forEach(item => {
            if (!item.isAsideMenuHide && type === item.type) {
              commonComponentList.push(item);
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
      chartComponentTypes.forEach(type => {
        this.componentsConfigs.forEach(vals => {
          vals.forEach(item => {
            if (!item.isAsideMenuHide && type === item.type) {
              chartComponentList.push(item);
            }
          });
        });
      });
      inputComponentTypes.forEach(type => {
        this.componentsConfigs.forEach(vals => {
          vals.forEach(item => {
            if (!item.isAsideMenuHide && type === item.type) {
              inputComponentList.push(item);
            }
          });
        });
      });
      otherComponentTypes.forEach(type => {
        this.componentsConfigs.forEach(vals => {
          vals.forEach(item => {
            if (!item.isAsideMenuHide && type === item.type) {
              otherComponentList.push(item);
            }
          });
        });
      });
    },
    handleScroll() {
      const scrollTop = this.$refs.scrollTopList.scrollTop;
      const clientHeight = this.$refs.scrollTopList.clientHeight;
      const scrollHeight = this.$refs.scrollTopList.scrollHeight;
      const height = 50; // 根据项目实际定义
      if (scrollTop + clientHeight >= scrollHeight - height) {
        if (this.pageIndex >= this.totalPage) {
          return false;
        } else {
          this.pageIndex++;
          this.getGroupCommenList(); // 请求列表list 接口方法
        }
      } else {
        return false;
      }
    },
    // 获取应用市场复合组件
    getGroupCommenList() {
      const obj = {
        projectType: this.deviceDesignType,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      getGroupCompositionList(obj).then(res => {
        this.totalNumber = res.totalNumber;
        this.totalPage = res.totalPage;
        let data = [];
        data = res.dataList.map(item => {
          return {
            ...item,
            uuid: "",
            type: "",
            ...groupComponentConfig
          };
        });
        // this.groupCompositionList = data;
        this.groupCompositionList = this.groupCompositionList.concat(data);
        if (res.dataList.length < this.pageSize) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
        }
      });
    },
    // 节流函数
    throttle(func, wait) {
      let lastTime = null;
      let timeout;
      return () => {
        const context = this;
        const now = new Date();
        const arg = arguments;
        if (now - lastTime - wait > 0) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          func.apply(context, arg);
          lastTime = now;
        } else if (!timeout) {
          timeout = setTimeout(() => {
            func.apply(context, arg);
          }, wait);
        }
      };
    },
    // 创建复合组件
    creatGroupComment() {
      // 这里没找到 event 失效原因
      // const creatGroupEvent = new CustomEvent('on-preload-creat-group')
      // window.dispatchEvent(creatGroupEvent)
      const params = {};
      params.subType = "group";
      params.reportName = "未命名";
      params.queryType = this.deviceDesignType;
      saveReportV4(params).then(res => {
        this.$emit("refreshGroupComponentList");
        // 创建完后跳转到复合组件页面
        const data = {
          id: res.data.reportId,
          name: "未命名",
          treeId: res.data.reportId
        };
        EventBus.$emit("onChangeDataTypeGroup", data);
      });
    },
    onModuleDragMoveEnd() {
      console.log("onModuleDragMoveEnd");
      // return
      setTimeout(() => {
        console.log("setTimeout");
        this.$emit("updateDownCommen");
      }, 1000);
    },
    onDragMoveEnd() {},
    onDragMoveStart({ oldIndex }, items) {},
    handleChange(val) {},
    toGroup(item) {
      const data = {
        id: item.options.groupComponentId,
        name: item.reportName,
        treeId: item.options.groupComponentId
      };
      EventBus.$emit("onChangeDataTypeGroup", data);
    }
  }
};
</script>

<style lang="scss" scoped>
.comp-icon {
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  margin: 16px 4px 0 0;
  cursor: pointer;
  padding: 2px;
}

.aside-menu-page {
  overflow: auto;
  width: 260px;
  //margin-left: 16px;
  background-color: white;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    // scrollbar-arrow-color:red;
  }



  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
    background: rgba(0, 0, 0, 0.1);
    // scrollbar-arrow-color:red;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: #fff;
  }

  // &::-webkit-scrollbar {
  //   width: 0;
  // }
  /deep/.el-tabs__header {
    margin: 0;
    z-index: 20;
    width: 315px;
    background: #fff;
  }

  /deep/.el-tabs__nav {
    height: 45px;
  }

  /deep/.el-tabs__content {
    // margin-top: 38px;
  }

  .aside-collapse-title {
    padding-left: 20px;
    font-size: 14px;
    font-weight: bold;
  }

  .add_group_model {
    text-align: center;
    margin: 10px 0;
  }

  .menu-item-wrap {
    padding: 0 10px;

    li {
      display: inline-flex;
      //display: flex;
      flex-direction: row;
      width: 46%;
      margin: 0 8px 8px 0;
      //text-align: center;
      color: #666;
      cursor: pointer;
      border: 1px solid #e5e6e8;
      border-radius: 6px;
      padding: 0 8px;
      height: 36px;

      &:hover {
        color: #409eff;
        border: 1px dashed #409eff;
      }

      .iconfont {
        //font-size: 45px;
        font-size: 12px;
        line-height: 36px;
      }

      .icon-text {
        font-size: 12px;
        line-height: 36px;
        margin-left: 8px;
        white-space: nowrap;
        //margin-top: -12px;
      }
    }
  }

  .aplayMarkStyle {
    text-align: center;
    border-top: 1px solid #f7f0f0;
    padding-top: 10px;

    h3 {
      color: #197aff;
    }
  }

  .groupComment {
    max-height: calc(100vh - 96px);
    overflow-y: auto;

    /deep/.el-collapse {
      padding: 0 10px;
    }
  }

  .module-item-wrap {
    padding: 0 10px;

    li {
      display: inline-block;
      width: 50%;
      margin: 10px 0px;
      text-align: center;
      color: #666;
      cursor: pointer;
      border: 1px solid transparent;

      &:hover {
        color: #409eff;
        border: 1px dashed #409eff;
      }
    }
  }

  .group_comment {
    height: 500px;
    overflow: auto;

    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px;
      /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
      // scrollbar-arrow-color:red;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
      background: rgba(0, 0, 0, 0.1);
      // scrollbar-arrow-color:red;
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 0;
      background: #fff;
    }
  }
}

.pane_content {
  height: calc(100vh - 90px);
  overflow-y: auto;
}

/deep/.el-collapse-item__content {
  padding-bottom: 0;
}

.icon-text {
  .operate-group {
    float: right;
    margin-right: 10px;
    cursor: pointer;
    visibility: hidden;
  }

  &:hover .operate-group {
    visibility: initial;
  }
}

.basetab::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
</style>
