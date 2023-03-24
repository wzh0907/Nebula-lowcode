<template>
  <div>
    <el-drawer
      :visible.sync="isShowDrawer"
      :title="title"
      width="300"
      :mask-closable="false"
      :closable="false"
      :min-width="300"
      :draggable="draggable"
      :scrollable="true"
      @on-close="close"
      :class="showWindowType ? 'to-right' : ''"
    >
      <div class="group-wrap">
        <div class="group-btns">
          <el-row class="row-btns">
            <el-col :span="8">
              <div @click="back">
                <i class="iconfont iconshangyibu debug-font"></i>
                <br />上一步
              </div>
            </el-col>
            <el-col :span="8">
              <div @click="next">
                <i class="iconfont iconxiayibu debug-font"></i>
                <br />下一步
              </div>
            </el-col>
            <el-col :span="8">
              <div @click="close">
                <i class="iconfont icontingzhi debug-font"></i>
                <br />结束
              </div>
            </el-col>
          </el-row>
          <el-row style="text-align: left; margin-top: 20px">
            <div class="step-div" @click="showStepDrawer">
              <i class="iconfont icondanxuankuangxuanzhong"></i>
              {{ currentStepName }}
              <span v-if="currentChildStepName"
                >>{{ currentChildStepName }}</span
              >
            </div>
          </el-row>
        </div>
        <el-tabs :value="tabValue">
          <el-tab-pane label="变量" name="tab-var" class="data-pane">
            <el-tree :data="currentVariables" :render-content="renderContent" :default-expand-all="true"></el-tree>
          </el-tab-pane>
          <el-tab-pane label="返回数据" name="tab-data" class="data-pane">
            <el-tree :data="returnDataList" :render-content="renderContent" :default-expand-all="true"></el-tree>
          </el-tab-pane>
          <el-tab-pane label="异常" name="tab-exception" class="data-pane">{{
            stepException
          }}</el-tab-pane>
        </el-tabs>
      </div>
      <!-- <Drawer title="Basic Drawer" width="34%" :closable="false" v-model="value1">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>-->
    </el-drawer>
    <div class="show-step-drawer" v-show="showWindowType === 'start'">
      <div slot="header" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18" class="head-icon"></Icon> -->
        <img src="@/assets/icon/start.jpg" class="head-icon" />
        <b>开始</b>
      </div>
      <drag-drawer-start
        ref="startDrag"
        key="start"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'start'"
      ></drag-drawer-start>
    </div>
    <div class="show-step-drawer" v-show="showWindowType === 'connector'">
      <div slot="header" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/connector.jpg" class="head-icon" />
        <b>数据</b>
      </div>
      <drag-drawer-connector
        key="connectorKey"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'connector'"
      ></drag-drawer-connector>
    </div>
    <div class="show-step-drawer" v-show="showWindowType === 'loop'">
      <div slot="header" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/loop.jpg" class="head-icon" />
        <b>循环</b>
      </div>
      <drag-drawer-loop
        key="loop"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        :processId="processId"
        v-if="showWindowType === 'loop'"
      ></drag-drawer-loop>
    </div>
    <div class="show-step-drawer" v-show="showWindowType === 'return'">
      <div slot="header" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/return.jpg" class="head-icon" />
        <b>返回</b>
      </div>
      <drag-drawer-return
        key="return"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'return'"
      ></drag-drawer-return>
    </div>
    <div class="show-step-drawer" v-show="showWindowType === 'branch'">
      <div slot="header" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/branch.jpg" class="head-icon" />
        <b>树枝形状</b>
      </div>
      <drag-drawer-branch
        key="branchKey"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'branch'"
      ></drag-drawer-branch>
    </div>
    <div class="show-step-drawer" v-show="showWindowType === 'route'">
      <div slot="header" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/route.jpg" class="head-icon" />
        <b>路由</b>
      </div>
      <drag-drawer-route
        key="route"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="flow"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'route'"
      ></drag-drawer-route>
    </div>
    <div class="show-step-drawer" v-show="showWindowType === 'if'">
      <div slot="header" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/if.jpg" class="head-icon" />
        <b>条件</b>
      </div>
      <drag-drawer-if
        key="if"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="flow"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        :processId="processId"
        v-if="showWindowType === 'if'"
      ></drag-drawer-if>
    </div>
    <div class="show-step-drawer" v-show="showWindowType === 'dataprocess'">
      <div slot="header" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18"></Icon> -->
        <img src="@/assets/icon/dataprocess.jpg" class="head-icon" />
        <b>函数</b>
      </div>
      <drag-drawer-dataprocess
        key="dataprocess"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :flow="flow"
        :curDiagram="curDiagram"
        :processId="processId"
        @delete="deleteDiagram"
        v-if="showWindowType === 'dataprocess'"
      ></drag-drawer-dataprocess>
    </div>
    <div class="show-step-drawer" v-show="showWindowType === 'stop'">
      <div slot="header" class="drag-head">
        <!-- <Icon type="md-aperture" :size="18" class="head-icon"></Icon> -->
        <img src="@/assets/icon/stop.jpg" class="head-icon" />
        <b>结束</b>
      </div>
      <drag-drawer-stop
        key="stop"
        :type="showWindowType"
        @arguments="syncData"
        @cancel="cancelDrawer"
        :curDiagram="curDiagram"
        @delete="deleteDiagram"
        v-if="showWindowType === 'stop'"
      ></drag-drawer-stop>
    </div>
  </div>

  <!--  函数组件  -->
</template>

<script>
import { getDebug } from "@/api/report";
import { mapActions, mapMutations } from "vuex";
import NextFlow from "./nextflow.js";
import DragDrawerStart from "./drag-drawer-start";
import DragDrawerConnector from "./drag-drawer-connector";
import DragDrawerLoop from "./drag-drawer-loop";
import DragDrawerIf from "./drag-drawer-if";
import DragDrawerRoute from "./drag-drawer-route";
import DragDrawerReturn from "./drag-drawer-return";
import DragDrawerBranch from "./drag-drawer-branch";
import DragDrawerDataprocess from "./drag-drawer-dataprocess";
import DragDrawerStop from "./drag-drawer-stop";
export default {
  name: "drag-drawer-debug",
  components: {
    DragDrawerStart,
    DragDrawerConnector,
    DragDrawerLoop,
    DragDrawerReturn,
    DragDrawerBranch,
    DragDrawerRoute,
    DragDrawerIf,
    DragDrawerDataprocess,
    DragDrawerStop,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    processId: {
      type: Number,
      default: 0,
    },
    flow: {
      type: Object,
    },
    title: {
      type: String,
      default: 256,
    }, // 是否可拖
    width: {
      type: [String, Number],
      default: 256,
    }, // 是否可拖动修改宽度
    draggable: {
      type: Boolean,
      default: false,
    },
    // 最小拖动宽度
    minWidth: {
      type: [String, Number],
      default: 256,
    },
  },
  data() {
    return {
      showDebugDrawer: false,
      value1: false,
      merchantId: 0,
      projectId: 0,
      userName: "",
      thirdUserId: "",
      tabValue: "tab-var",
      showWindowType: null,
      showWindowFlag: false,
      curDiagram: {},
      stepException: "",
      stepList: [],
      currentStepid: 0,
      currentChildStepId: 0,
      currentStepName: "",
      currentChildStepName: "",
      currentStepIndex: 0,
      currentVariables: [],
      returnDataList: [],
      buttonProps: {
        type: "default",
        size: "small",
      },
    };
  },
  mounted() {
    // this.showDebugDrawer = this.value;
    // this.init();
  },
  computed: {
    isShowDrawer: {
      get() {
        return this.value;
      },
      set(val) {
         this.$emit('cancel')
      },
    },
  },
  methods: {
    cleanStep() {
      this.currentChildStepId = 0;
      this.currentChildStepName = null;
    },
    close() {
      // 清空所有的绿点
      this.showWindowType = "";
      this.$emit("cancel");
      // this.$refs.drawerWrapper.closeTT();
    },
    back() {
      if (this.currentStepIndex > 0) {
        this.cleanStep();
        this.currentStepIndex = this.currentStepIndex - 1;
        this.show(this.currentStepIndex);
      }
    },
    next() {
      if (this.currentStepIndex < this.stepList.length - 1) {
        this.cleanStep();
        this.currentStepIndex = this.currentStepIndex + 1;
        this.show(this.currentStepIndex);
      }
    },
    showStepDrawer() {
      //拉取 2020-08-21 临时处理方案  直接把type  赋值给showType
      if (this.showWindowType) {
        this.showWindowType = null;
      } else {
        this.showWindowType = this.curDiagram.type;
      }
    },
    showStep() {
      // this.showWindowType=true;
      // this.showWindowType = "start";
      let cstepid = 0;
      if (this.currentStepid != "start") {
        cstepid = this.currentStepid;
      }
      const res = this.$emit("showStep", cstepid, (diagram) => {
        this.curDiagram = diagram;
        if (this.showWindowType) {
          this.showWindowType = this.curDiagram.type;
        }
        this.currentStepName = diagram.title;
        if (this.currentChildStepId != 0) {
          // 如果子步骤不为0 说明有子步骤
          let steps = diagram.properties.steps;
          this.currentChildStepName =
            steps[this.currentChildStepId - 1].funcName +
            "/" +
            steps[this.currentChildStepId - 1].funcType;
        }
      });
    },
    syncData() {},
    deleteDiagram() {},
    cancelDrawer() {},
    renderContent(h, { root, node, data }) {
      let variableData = h("span", data.value);
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
          },
        },
        [
          h("span", [h("span", data.title)]),
          h(
            "span",
            {
              style: {
                wordBreak: "normal",
                width: "auto",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                display: "inline-block",
                float: "right",
                marginRight: "32px",
              },
            },
            data.value

            // [
            //   h("Button", {
            //     props: Object.assign({}, this.buttonProps, {
            //       icon: "ios-add",
            //     }),
            //     style: {
            //       marginRight: "8px",
            //     },
            //     on: {
            //       click: () => {
            //         this.append(data);
            //       },
            //     },
            //   }),
            //   h("Button", {
            //     props: Object.assign({}, this.buttonProps, {
            //       icon: "ios-remove",
            //     }),
            //     on: {
            //       click: () => {
            //         this.remove(root, node, data);
            //       },
            //     },
            //   }),
            // ]
          ),
        ]
      );
    },
    init() {
      // // loading
      // this.$Spin.show({
      //   render: (h) => {
      //     return h("div", [
      //       h("Icon", {
      //         class: "demo-spin-icon-load",
      //         props: {
      //           type: "ios-loading",
      //           size: 18,
      //         },
      //       }),
      //       h("div", "Loading"),
      //     ]);
      //   },
      // });

      this.merchantId = this.$store.getters.merchantId;
      this.projectId = this.$store.getters.projectId;
      this.userName = this.$store.getters.userName;
      this.thirdUserId = this.$store.getters.thirdUserId;

      // 初始化 步骤
      this.currentStepName = "";
      this.currentChildStepName = "";
      this.currentStepIndex = 0;
      this.currentVariables = [];
      this.returnDataList = [];
      this.stepException = "";
      this.tabValue = "tab-var";
      let param = {
        dataApiId: this.processId,
        debug: "true",
        params: {},
      };
      getDebug(
        param,
        this.merchantId,
        this.projectId,
        this.userName,
        this.thirdUserId
      ).then((res) => {
        //  this.$Spin.hide();
        if (res.code == 0) {
          let dataList = res.data;
          this.stepList = res.log;
          this.returnDataList = [];
          for (var key in dataList) {
            let returnData = {
              title: key,
            };
            if (dataList[key] instanceof Array) {
              let arrayList = [];
              if (dataList[key].length > 100) {
                // 进入全自动列表优化
                for (var i = 0; i < dataList[key].length; i = i + 100) {
                  var retractList = [];
                  for (var j = i; j < i + 100; j++) {
                    let varList = [];
                    for (var varKey in dataList[key][j]) {
                      let varItem = {
                        title: varKey,
                        value: dataList[key][j][varKey],
                      };
                      varList.push(varItem);
                    }
                    if (varList && varList.length > 0) {
                      let varItem = {
                        title: j,
                        children: varList,
                      };
                      retractList.push(varItem);
                    }
                  }
                  let arrayItem = {
                    title: "[" + i + "..." + (j - 1) + "]",
                    children: retractList,
                  };
                  arrayList.push(arrayItem);
                }
              } else {
                for (var i = 0; i < dataList[key].length; i++) {
                  let varList = [];
                  for (var varKey in dataList[key][i]) {
                    let varItem = {
                      title: varKey,
                      value: dataList[key][i][varKey],
                    };
                    varList.push(varItem);
                  }
                  let arrayItem = {
                    title: i,
                    children: varList,
                  };
                  arrayList.push(arrayItem);
                }
              }

              returnData.children = arrayList;
              returnData.expand = true;
            } else {
              returnData.value = dataList[key];
            }

            this.returnDataList.push(returnData);
          }
          this.show(this.currentStepIndex);
        } else if (res.code == 1000) {
          this.stepException = res.msg;
          this.tabValue = "tab-exception";
        }
      }).catch(err => {
          //  this.$Spin.hide();
      });
    },
    show(index) {
      // 变量
      this.currentVariables = [];
      let stepVar = this.stepList[index].vars;
      for (var key in stepVar) {
        let childVar = stepVar[key];
        let childrenVar = [];
        for (var childKey in childVar) {
          let childStep = {
            title: childKey,
          };
          if (childVar[childKey] instanceof Array) {
            // 变量值为数组 特殊处理展示 ，前期吧所有展示出来，后期改成缩进
            let arrayList = [];
            for (var i = 0; i < childVar[childKey].length; i++) {
              let varList = [];
              for (var varKey in childVar[childKey][i]) {
                let varItem = {
                  title: varKey,
                  value: childVar[childKey][i][varKey],
                };
                varList.push(varItem);
              }
              let arrayItem = {
                title: i,
                children: varList,
              };
              arrayList.push(arrayItem);
            }

            childStep.children = arrayList;
            childStep.expand = true;
          } else {
            childStep.value = childVar[childKey];
          }

          childrenVar.push(childStep);
        }
        let stepDate = {
          title: key,
          label: key,
          value: childVar,
          expand: true,
          children: childrenVar,
        };
        this.currentVariables.push(stepDate);
      }
      // 流程  如果是函数返回值这种 会有第一步第二步，所以有下划线_ 进行特殊处理
      if (this.stepList[index].pid.indexOf("_") > 0) {
        let sList = this.stepList[index].pid.split("_");
        this.currentStepid = sList[0];
        this.currentChildStepId = sList[1];
      } else {
        this.currentStepid = this.stepList[index].pid;
      }
      this.showStep();
    },
  },
  watch: {
    merchantId(newData, oldVal) {
      // 从父组件获取到回显参数
      this.merchantId = newData;
    },
    projectId(newData, oldVal) {
      this.projectId = newData;
    },
  },
};
</script>

<style scoped lang="scss">
.group-wrap {
  margin-top: -22px;
}
.group-btns {
  text-align: center;
}
.debug-font {
  font-size: 34px;
  cursor: pointer;
}
/deep/.to-right .ivu-drawer-content {
  right: 305px;
  animation: mymove 5s infinite;
  -webkit-animation: mymove 5s infinite; /* Safari 和 Chrome */
}
.show-step-drawer {
  position: absolute;
  background-color: #ffffff;
  width: 300px;
  top: 0px;
  right: 0;
  height: 100%;
  bottom: 0;
  z-index: 1001;
}
.step-div {
  line-height: 30px;
  font-size: 16px;
  color: #333333;
  text-align: center;
  cursor: pointer;
}
.drag-head {
  display: flex;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px solid #e8eaec;
  padding: 14px 16px;
  margin-bottom: 10px;
}
.head-icon {
  width: 18px;
  height: 18px;
}
</style>
<style scoped lang="less">
.data-pane {
  overflow-y: auto;
  overflow-x: hidden;
  height: ~"calc(100vh - 240px)";
}
</style>
