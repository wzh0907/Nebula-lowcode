<template>
  <div v-if="easyFlowVisible" style="height: 100%">
    <el-row>
      <!--顶部工具菜单-->
      <el-col :span="24">
        <div class="ef-tooltar">
          <!-- <el-link type="primary" :underline="false">{{data.name}}</el-link>
                    <el-divider direction="vertical"></el-divider> -->
          <el-button
            type="text"
            icon="el-icon-delete"
            size="large"
            @click="deleteElement"
            :disabled="!this.activeElement.type"
            >删除</el-button
          >
          <el-button
            type="text"
            icon="iconfont iconqingkong"
            size="large"
            @click="onClearCanvas"
            >清空</el-button
          >
          <el-button
            type="text"
            icon="el-icon-s-unfold"
            size="large"
            @click="$emit('foldUp', data)"
            >收起</el-button
          >
        </div>
      </el-col>
    </el-row>
    <div style="display: flex; height: calc(100% - 47px)">
      <div style="width: 180px; padding: 15px; border-right: 1px solid #dce3e8">
        <node-menu @addNode="addNode" ref="nodeMenu"></node-menu>
      </div>
      <div id="efContainer" ref="efContainer" class="container" v-flowDrag>
        <template v-for="node in data.nodeList">
          <flow-node
            :id="node.id"
            :key="node.id"
            :node="node"
            :activeElement="activeElement"
            @changeNodeSite="changeNodeSite"
            @nodeRightMenu="nodeRightMenu"
            @clickNode="clickNode"
          >
          </flow-node>
        </template>
        <!-- <template v-for="node in data.nodeList" v-if="node.type === 'event-operate-logic-judgment'">
                    <flowNodeShape
                        :id="node.id"
                        :key="node.id"
                        :node="node"
                        :activeElement="activeElement"
                        @changeNodeSite="changeNodeSite"
                        @nodeRightMenu="nodeRightMenu"
                        @clickNode="clickNode"
                    >
                    </flowNodeShape>
                </template> -->
        <!-- <div v-else>
                    test
                </div> -->
        <!-- 给画布一个默认的宽度和高度 -->
        <div style="position: absolute; top: 2000px; left: 2000px">&nbsp;</div>
      </div>
      <!-- 右侧表单 -->
      <!-- <div style="width: 300px;border-left: 1px solid #dce3e8;background-color: #FBFBFB">
                <flow-node-form ref="nodeForm" @setLineLabel="setLineLabel" @repaintEverything="repaintEverything"></flow-node-form>
            </div> -->
    </div>
    <!-- 流程数据详情 -->
    <!-- <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>
        <flow-help v-if="flowHelpVisible" ref="flowHelp"></flow-help> -->
  </div>
</template>

<script>
import draggable from "vuedraggable";
// import { jsPlumb } from 'jsplumb'
// 使用修改后的jsplumb
import "./tools/jsplumb";
import { easyFlowMixin } from "./tools/mixins";
import flowNode from "./components/node.vue";
import flowNodeShape from "./components/node-shape.vue";
import nodeMenu from "./components/node_menu.vue";
// import FlowInfo from './info'
// import FlowHelp from './help'
// import FlowNodeForm from './node_form'
import lodash from "lodash";
// import { getDataA } from './不需要的代码/data_A'
// import { getDataB } from './不需要的代码/data_B'
// import { getDataC } from './不需要的代码/data_C'
// import { getDataD } from './不需要的代码/data_D'
// import { getDataE } from './不需要的代码/data_E'
// import { ForceDirected } from './force-directed'

export default {
  props: {
    eventList: {
      type: Array,
      default: () => [],
    },
    chooseEventType: {
      type: String,
      default: "click",
    },
  },
  data() {
    return {
      logicJudgmentInfoPool: {},
      defaultData: {
        name: "test999999",
        nodeList: [],
        lineList: [],
      },
      // jsPlumb 实例
      jsPlumb: null,
      // 控制画布销毁
      easyFlowVisible: true,
      // 控制流程数据显示与隐藏
      flowInfoVisible: false,
      // 是否加载完毕标志位
      loadEasyFlowFinish: false,
      flowHelpVisible: false,
      // 数据
      data: {},
      // 激活的元素、可能是节点、可能是连线
      activeElement: {
        // 可选值 node 、line
        type: undefined,
        // 节点ID
        nodeId: undefined,
        // 连线ID
        sourceId: undefined,
        targetId: undefined,
      },
      zoom: 0.5,
      // type字典
      typeAndNameMap: {
        "event-operate-logic-judgment": "判定",
        "event-operate-refresh": "数据刷新",
        "event-operate-interface": "接口调用",
        "event-operate-display": "隐藏/显示",
        "event-operate-href": "页面跳转",
        "event-operate-form-submit": "表单提交",
        "event-operate-dialog-box": "弹出层",
        "event-operate-back": "页面返回",
        "event-operate-close-page":"关闭传值",
        "event-operate-set": "组件设值",
        "event-operate-dialog-box-msg": "提示框",
        "event-operate-dialog-box-confirm": "确认框",
        "event-operate-form-validate":"表单校验",
        "event-operate-make-phone-call":"拨打电话",
        "event-operate-main-menu-href":"主页跳转",
      },
    };
  },
  // 一些基础配置移动该文件中
  mixins: [easyFlowMixin],
  components: {
    draggable,
    flowNode,
    flowNodeShape,
    nodeMenu,
    // FlowInfo,
    // FlowNodeForm,
    // FlowHelp
  },
  directives: {
    flowDrag: {
      bind(el, binding, vnode, oldNode) {
        if (!binding) {
          return;
        }
        el.onmousedown = (e) => {
          if (e.button == 2) {
            // 右键不管
            return;
          }
          //  鼠标按下，计算当前原始距离可视区的高度
          let disX = e.clientX;
          let disY = e.clientY;
          el.style.cursor = "move";

          document.onmousemove = function (e) {
            // 移动时禁止默认事件
            e.preventDefault();
            const left = e.clientX - disX;
            disX = e.clientX;
            el.scrollLeft += -left;

            const top = e.clientY - disY;
            disY = e.clientY;
            el.scrollTop += -top;
          };

          document.onmouseup = function (e) {
            el.style.cursor = "auto";
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },
  created() {
    // 初始化数据
    this.flowChartDataInit();
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance();
    this.$nextTick(() => {
      // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
      // this.dataReload(getDataB())
      // this.dataReload({
      //     name: 'test999999',
      //     nodeList: [],
      //     lineList: []
      // })
      this.dataReload(this.defaultData);
    });
  },
  methods: {
    // 事件流程图回显
    flowChartDataInit() {
      let nodeList = [];
      let lineList = [];
      let actionList = [];
      //
      if (this.eventList.length == 1) {
        if (this.eventList[0].eventType == "change") {
          this.eventList.unshift({
            actionList: [],
            eventType: "click",
          });
        }else if (this.eventList[0].eventType == "show") {
          this.eventList.unshift({
            actionList: [],
            eventType: "load",
          });
        } else if (this.eventList[0].eventType == "click") {
          this.eventList.push({
            actionList: [],
            eventType: "change",
          });
        }else if (this.eventList[0].eventType == "load") {
          this.eventList.push({
            actionList: [],
            eventType: "show",
          });
        }
      }
      if (this.chooseEventType == "click") {
        if (!this.eventList.length || !this.eventList[0].actionList) {
          // 做一层判断防止有的组件（页面）没有事件导致报错
          return false;
        }
        actionList = this.eventList[0].actionList || [];
      } else if (this.chooseEventType == "change") {
        if (!this.eventList.length || !this.eventList[1].actionList) {
          // 做一层判断防止有的组件（页面）没有事件导致报错
          return false;
        }
        actionList = this.eventList[1].actionList || [];
      } else if (this.chooseEventType == "load") {
        if (!this.eventList.length || !this.eventList[0].actionList) {
          // 做一层判断防止有的组件（页面）没有事件导致报错
          return false;
        }
        actionList = this.eventList[0].actionList || [];
      } else if (this.chooseEventType == "show") {
        if (!this.eventList.length || !this.eventList[1].actionList) {
          // 做一层判断防止有的组件（页面）没有事件导致报错
          return false;
        }
        actionList = this.eventList[1].actionList || [];
      }
      let flowOriginId = this.getUUID();
      nodeList.push({
        id: flowOriginId,
        name: "开始",
        type: "flow-origin",
        left: "250px",
        top: "10px",
        ico: "el-icon-video-play",
        actionItem: {},
      });
      this.unpackageEventAction(actionList, nodeList, lineList, flowOriginId);
      this.defaultData = {
        name: "test999999",
        nodeList,
        lineList,
      };
    },
    // 把可执行的事件配置转换为事件流程图
    unpackageEventAction(actionList, nodeList, lineList, flowOriginId) {
      let oldId = flowOriginId;
      let defaultTop = 0;
      actionList.forEach((actionItem) => {
        defaultTop += 100;
        let newId = this.getUUID();
        if (actionItem.actionType === "event-operate-logic-judgment") {
          // TODO: 待优化
          this.logicJudgmentInfoPool[newId] ||
            (this.logicJudgmentInfoPool[newId] = {});
        }
        nodeList.push({
          id: newId,
          name: this.typeAndNameMap[actionItem.actionType],
          type: actionItem.actionType,
          left:
            (actionItem._eventFlowChartConfig &&
              actionItem._eventFlowChartConfig.left) ||
            "250px",
          top:
            (actionItem._eventFlowChartConfig &&
              actionItem._eventFlowChartConfig.top) ||
            defaultTop + "px",
          ico: "el-icon-video-play",
          actionItem,
        });
        if (oldId && newId) {
          lineList.push({
            from: oldId,
            to: newId,
          });
        }
        oldId = newId;

        // 逻辑节点
        if (actionItem.logicChildren) {
          // 只要走到这里，说明是新的事件配置数据结构，不用考虑兼容问题
          this.unpackageNodeAndLineList(
            nodeList,
            actionItem.logicChildren,
            lineList,
            oldId
          );
        }
      });
    },
    unpackageNodeAndLineList(nodeList, logicChildren, lineList, oldId) {
      logicChildren.forEach((logicItem) => {
        let newId = this.getUUID();
        if (logicItem.type === "event-operate-logic-judgment") {
          // TODO: 待优化
          this.logicJudgmentInfoPool[newId] ||
            (this.logicJudgmentInfoPool[newId] = {});
        }
        nodeList.push({
          id: newId,
          name: this.typeAndNameMap[logicItem.type],
          type: logicItem.type,
          left: logicItem.left,
          top: logicItem.top,
          ico: "el-icon-video-play",
          actionItem: logicItem.actionItem,
        });
        if (oldId && newId) {
          lineList.push({
            from: oldId,
            to: newId,
            label: logicItem._connectionLabel,
          });
        }
        if (logicItem.children) {
          this.unpackageNodeAndLineList(
            nodeList,
            logicItem.children,
            lineList,
            newId
          );
        }
      });
    },
    jsPlumbInit() {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting);
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true);
        // 初始化节点
        this.loadEasyFlow();
        // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
        this.jsPlumb.bind("click", (conn, originalEvent) => {
          this.activeElement.type = "line";
          this.activeElement.sourceId = conn.sourceId;
          this.activeElement.targetId = conn.targetId;
          this.$emit("onClickLine", {
            from: conn.sourceId,
            to: conn.targetId,
            label: conn.getLabel(),
          });
          // this.$refs.nodeForm.lineInit({
          //     from: conn.sourceId,
          //     to: conn.targetId,
          //     label: conn.getLabel()
          // })
        });
        // 连线
        this.jsPlumb.bind("connection", (evt) => {
          let nodeType = evt.source.dataset.nodeType;
          let from = evt.source.id;
          let to = evt.target.id;
          let lineData = { from: from, to: to };
          if (nodeType === "event-operate-logic-judgment") {
            let label = "假";
            let logicJudgmentInfo = this.logicJudgmentInfoPool[from];
            if (!logicJudgmentInfo) {
              this.logicJudgmentInfoPool[from] = {
                hasFalseLine: true,
              };
            } else if (logicJudgmentInfo.hasFalseLine) {
              logicJudgmentInfo.hasTrueLine = true;
              label = "真";
            }
            lineData.label = label;
            this.setLineLabel(from, to, label);
          }
          if (this.loadEasyFlowFinish) {
            this.data.lineList.push(lineData);
          }
        });

        // 删除连线回调
        this.jsPlumb.bind("connectionDetached", (evt) => {
          this.deleteLine(evt.sourceId, evt.targetId);
        });

        // 改变线的连接节点
        this.jsPlumb.bind("connectionMoved", (evt) => {
          this.changeLine(evt.originalSourceId, evt.originalTargetId);
        });

        // 连线右击
        this.jsPlumb.bind("contextmenu", (evt) => {
          console.log("contextmenu", evt);
        });

        // 连线
        this.jsPlumb.bind("beforeDrop", (evt) => {
          let from = evt.sourceId;
          let to = evt.targetId;
          if (from === to) {
            this.$message.error("节点不支持连接自己");
            return false;
          }
          if (this.hasLine(from, to)) {
            this.$message.error("该关系已存在,不允许重复创建");
            return false;
          }
          if (this.hashOppositeLine(from, to)) {
            this.$message.error("不支持两个节点之间连线回环");
            return false;
          }
          // 校验连接条数
          let fromCount = this.connectLineCount(from, "from");
          let toCount = this.connectLineCount(to, "to");
          // console.log(fromCount, toCount)
          let logicJudgmentInfo = this.logicJudgmentInfoPool[from];
          if (fromCount >= 1) {
            if (logicJudgmentInfo) {
              // 逻辑节点可以连接两个节点
              if (fromCount >= 2) {
                this.$message.error("该节点只能连接两个节点");
                return false;
              }
            } else {
              this.$message.error("只能连接一个节点");
              return false;
            }
          }
          if (toCount >= 1) {
            this.$message.error("只能被一个节点连接");
            return false;
          }
          // 校验通过
          this.$message.success("连接成功");
          return true;
        });

        // beforeDetach
        this.jsPlumb.bind("beforeDetach", (evt) => {
          console.log("beforeDetach", evt);
        });
        this.jsPlumb.setContainer(this.$refs.efContainer);
      });
    },
    // 加载流程图
    loadEasyFlow() {
      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(
          node.id,
          lodash.merge(this.jsplumbSourceOptions, {})
        );
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions);
        if (!node.viewOnly) {
          this.jsPlumb.draggable(node.id, {
            containment: "parent",
            stop: function (el) {
              // 拖拽节点结束后的对调
              console.log("拖拽结束: ", el);
            },
          });
        }
      }
      // 初始化连线
      for (var i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i];
        var connParam = {
          source: line.from,
          target: line.to,
          label: line.label ? line.label : "",
          connector: line.connector ? line.connector : "",
          anchors: line.anchors ? line.anchors : undefined,
          paintStyle: line.paintStyle ? line.paintStyle : undefined,
        };
        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions);
      }
      this.$nextTick(function () {
        this.loadEasyFlowFinish = true;
      });
    },
    // 设置连线条件
    setLineLabel(from, to, label) {
      var conn = this.jsPlumb.getConnections({
        source: from,
        target: to,
      })[0];
      if (!label || label === "") {
        conn.removeClass("flowLabel");
        conn.addClass("emptyFlowLabel");
      } else {
        conn.addClass("flowLabel");
      }
      conn.setLabel({
        label: label,
      });
      this.data.lineList.forEach(function (line) {
        if (line.from == from && line.to == to) {
          line.label = label;
        }
      });
    },
    // 删除激活的元素
    deleteElement() {
      if (this.activeElement.type === "node") {
        this.deleteNode(this.activeElement.nodeId);
      } else if (this.activeElement.type === "line") {
        this.$confirm("确定删除所点击的线吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            var conn = this.jsPlumb.getConnections({
              source: this.activeElement.sourceId,
              target: this.activeElement.targetId,
            })[0];
            this.jsPlumb.deleteConnection(conn);
          })
          .catch(() => {});
      }
    },
    // 删除线
    deleteLine(from, to) {
      this.data.lineList = this.data.lineList.filter(function (line) {
        if (line.from == from && line.to == to) {
          return false;
        }
        return true;
      });
    },
    // 改变连线
    changeLine(oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo);
    },
    // 改变节点的位置
    changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        if (node.id === data.nodeId) {
          node.left = data.left;
          node.top = data.top;
        }
      }
    },
    /**
     * 拖拽结束后添加新的节点
     * @param evt
     * @param nodeMenu 被添加的节点对象
     * @param mousePosition 鼠标拖拽结束的坐标
     */
    addNode(evt, nodeMenu, mousePosition) {
      var screenX = evt.originalEvent.clientX,
        screenY = evt.originalEvent.clientY;
      let efContainer = this.$refs.efContainer;
      var containerRect = efContainer.getBoundingClientRect();
      var left = screenX,
        top = screenY;
      // 计算是否拖入到容器中
      if (
        left < containerRect.x ||
        left > containerRect.width + containerRect.x ||
        top < containerRect.y ||
        containerRect.y > containerRect.y + containerRect.height
      ) {
        this.$message.error("请把节点拖入到画布中");
        return;
      }
      left = left - containerRect.x + efContainer.scrollLeft;
      top = top - containerRect.y + efContainer.scrollTop;
      // 居中
      left -= 85;
      top -= 16;
      var nodeId = this.getUUID();
      // 动态生成名字
      var origName = nodeMenu.name;
      var nodeName = origName;
      var index = 1;
      while (index < 10000) {
        var repeat = false;
        for (var i = 0; i < this.data.nodeList.length; i++) {
          let node = this.data.nodeList[i];
          if (node.name === nodeName) {
            nodeName = origName + index;
            repeat = true;
          }
        }
        if (repeat) {
          index++;
          continue;
        }
        break;
      }
      var node = {
        id: nodeId,
        name: nodeName,
        type: nodeMenu.type,
        left: left + "px",
        top: top + "px",
        ico: nodeMenu.ico,
        actionItem: nodeMenu.actionItem,
        // state: 'success'
      };
      /**
       * 这里可以进行业务判断、是否能够添加该节点
       */
      this.data.nodeList.push(node);
      this.$nextTick(function () {
        this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions);
        this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions);
        this.jsPlumb.draggable(nodeId, {
          containment: "parent",
          stop: function (el) {
            // 拖拽节点结束后的对调
            console.log("拖拽结束: ", el);
          },
        });
      });
    },
    /**
     * 删除节点
     * @param nodeId 被删除节点的ID
     */
    deleteNode(nodeId) {
      this.$confirm("确定要删除节点" + nodeId + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          /**
           * 这里需要进行业务判断，是否可以删除
           */
          this.data.nodeList = this.data.nodeList.filter(function (node) {
            if (node.id === nodeId) {
              // 伪删除，将节点隐藏，否则会导致位置错位
              // node.show = false
              return false;
            }
            return true;
          });
          this.$nextTick(function () {
            this.jsPlumb.removeAllEndpoints(nodeId);
          });
        })
        .catch(() => {});
      return true;
    },
    clickNode(nodeId, node) {
      this.activeElement.type = "node";
      this.activeElement.nodeId = nodeId;
      // this.$refs.nodeForm.nodeInit(this.data, nodeId)
      this.$emit("onClickNode", node);
    },
    // 查询节点有几条连线
    connectLineCount(nodeId, direction) {
      // let fromCount = 0
      // let toCount = 0
      let count = 0;
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i];
        // direction必须是from、to两种
        if (line[direction] === nodeId) {
          count++;
        }
        // if (line.to === nodeId) {
        //     toCount ++
        // }
      }
      return count;
      // return {
      //     fromCount,
      //     toCount
      // }
    },
    // 是否具有该线
    hasLine(from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i];
        if (line.from === from && line.to === to) {
          return true;
        }
      }
      return false;
    },
    // 是否含有相反的线
    hashOppositeLine(from, to) {
      return this.hasLine(to, from);
    },
    nodeRightMenu(nodeId, evt) {
      this.menu.show = true;
      this.menu.curNodeId = nodeId;
      this.menu.left = evt.x + "px";
      this.menu.top = evt.y + "px";
    },
    // repaintEverything() {
    //     this.jsPlumb.repaint()
    // },
    // 流程数据信息
    // dataInfo() {
    //     this.flowInfoVisible = true
    //     this.$nextTick(function () {
    //         this.$refs.flowInfo.init()
    //     })
    // },
    // 加载流程图
    dataReload(data) {
      this.easyFlowVisible = false;
      this.data.nodeList = [];
      this.data.lineList = [];
      this.$nextTick(() => {
        data = lodash.cloneDeep(data);
        this.easyFlowVisible = true;
        this.data = data;
        this.$nextTick(() => {
          this.jsPlumb = jsPlumb.getInstance();
          this.$nextTick(() => {
            this.jsPlumbInit();
          });
        });
      });
    },
    onClearCanvas() {
      this.jsPlumb = jsPlumb.getInstance();
      this.$nextTick(() => {
        // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
        let flowOriginId = this.getUUID();
        this.dataReload({
          name: "test999999",
          nodeList: [
            {
              id: flowOriginId,
              name: "开始",
              type: "flow-origin",
              left: "250px",
              top: "10px",
              ico: "el-icon-video-play",
              actionItem: {},
            },
          ],
          lineList: [],
        });
      });
    },
    zoomAdd() {
      if (this.zoom >= 1) {
        return;
      }
      this.zoom = this.zoom + 0.1;
      this.$refs.efContainer.style.transform = `scale(${this.zoom})`;
      this.jsPlumb.setZoom(this.zoom);
    },
    zoomSub() {
      if (this.zoom <= 0) {
        return;
      }
      this.zoom = this.zoom - 0.1;
      this.$refs.efContainer.style.transform = `scale(${this.zoom})`;
      this.jsPlumb.setZoom(this.zoom);
    },
    // 返回唯一标识
    getUUID() {
      return Math.random().toString(36).substr(3, 10);
    },
    updateFlowPanel(data) {
      this.setLineLabel(data.from, data.to, data.value ? "真" : "假");
    },
    // 模拟载入数据dataA
    // dataReloadA() {
    //     this.dataReload(getDataA())
    // },
    // // 模拟载入数据dataB
    // dataReloadB() {
    //     this.dataReload(getDataB())
    // },
    // // 模拟载入数据dataC
    // dataReloadC() {
    //     this.dataReload(getDataC())
    // },
    // // 模拟载入数据dataD
    // dataReloadD() {
    //     this.dataReload(getDataD())
    // },
    // // 模拟加载数据dataE，自适应创建坐标
    // dataReloadE() {
    //     let dataE = getDataE()
    //     let tempData = lodash.cloneDeep(dataE)
    //     let data = ForceDirected(tempData)
    //     this.dataReload(data)
    //     this.$message({
    //         message: '力导图每次产生的布局是不一样的',
    //         type: 'warning'
    //     });
    // },
    // 下载数据
    // downloadData() {
    //     this.$confirm('确定要下载该流程数据吗？', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning',
    //         closeOnClickModal: false
    //     }).then(() => {
    //         var datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, '\t'));
    //         var downloadAnchorNode = document.createElement('a')
    //         downloadAnchorNode.setAttribute("href", datastr);
    //         downloadAnchorNode.setAttribute("download", 'data.json')
    //         downloadAnchorNode.click();
    //         downloadAnchorNode.remove();
    //         this.$message.success("正在下载中,请稍后...")
    //     }).catch(() => {
    //     })
    // },
    // openHelp() {
    //     this.flowHelpVisible = true
    //     this.$nextTick(function () {
    //         this.$refs.flowHelp.init()
    //     })
    // }
  },
};
</script>
<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #e0e3e7;
  height: 20px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
.ef-tooltar {
  text-align: center;
}
</style>
