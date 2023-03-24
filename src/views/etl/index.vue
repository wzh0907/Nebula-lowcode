<template>
  <div class="etl-container">
      <div class="manage-list-wrap">
        <div class="system-title">
          <span>数据ETL列表</span>
          <i class="iconfont iconjiahao1" style="float: right;" @click="onAddETL" />
        </div>
        <div class="system-list-wrap">
          <ul>
            <li v-for="(item, key) in etlList" :key="key" :class="{active: etlId === item.id}" @click="onSelectedETL(key)">
              <p class="overlow-ellipsis" style="font-size: 16px; padding: 5px 0px; font-weight: bold;">{{ item.name }}</p>
              <div>
                <p>来源：{{item.sourceDbConfigName+"/"+item.sourceTableName}}</p>
                <p>目标：{{item.targetDbConfigName+"/"+item.targetTableName}}</p>
              </div>
              <p class="system-ctrl">
                <!-- <i class="iconfont iconbianji1" style="margin-right: 10px;" @click.stop="onEditSystemConnect(item.id)" /> -->
                <i class="iconfont icontrash" style="color: #ea8964;margin-right: 10px;" @click.stop="confirmDel(item.id)"/>
              </p>
            </li>
          </ul>
        </div>
      </div>
    <div id="draw" class="draw-container">
      <custom-header>    
      <span slot="title">
        <div style="width:200px;line-height:40px;"><el-input size="small" placeholder="请输入ETL名字" v-model="etlName" style="margin:5px;"/> </div>
      </span>
      <div slot="opertBtn">
        <span class="el-button-opert-text">
           <el-button type="text" class="save_btn" icon="el-icon-tickets" @click="saveETL">保存</el-button>
          <el-button type="text" class="save_btn" icon="iconfont iconchilun" @click="gosetting">高级设置</el-button>
          <el-switch
            v-model="value"
          >
          </el-switch>
          清洗脚本         
        </span>
      </div>
    </custom-header>
      <div class="table-container">
        <div class="left-list data-list list-wrap">
           <div class="list-head" >
             源数据:
             <span v-if="sourceTableName"  @click="addDataDialogVisible=true;etlType='source'">{{sourceTableName}}</span>
             <el-link  v-else type="primary" @click="addDataDialogVisible=true;etlType='source'">请选择</el-link >
           </div>
        <el-table
          :data="sourceTable"
          style="width: 100%">
          <el-table-column
            prop="columnName"
            label="字段名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="dataType"
            label="类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="precision"
            label="精度"
            width="80">
          </el-table-column>
          <el-table-column
            prop="notNull"
            label="Not Null">
            <template slot-scope="scope">
              <div :id="'source-'+scope.row.columnName"><el-checkbox  v-model="scope.row.isNullable"></el-checkbox></div>
            </template>
          </el-table-column>
           <!-- <el-table-column
            prop="sync"
            label="Not Null">
            <template slot-scope="scope">
              <div :id="'source-'+scope.row.columnName"><el-checkbox  v-model="scope.row.isNullable"></el-checkbox></div>
            </template> -->
          </el-table-column>
        </el-table>
        </div>
        <ul class="right-list data-list list-wrap">
          <div class="list-head" @click="addDataDialogVisible=true;etlType='target'"> 
            目的地:{{targetTableName?targetTableName:'请选择'}}
          </div> 
          <el-table
          :data="targetTable"
          style="width: 100%">
          <el-table-column
            label=""
            width="20">
            <template slot-scope="scope">
              <div :id="'target-'+scope.row.columnName"></div>
            </template>
          </el-table-column>
          <el-table-column
            prop="columnName"
            label="字段名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="dataType"
            label="类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="precision"
            label="精度"
            width="80">
          </el-table-column>
          <el-table-column
            prop="notNull"
            label="Not Null">
            <template slot-scope="scope">
              <el-checkbox  v-model="scope.row.isNullable"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        
        </ul>
      </div>
      <i class="remove-btn"></i>
    </div>
      <addDataDialog
      :visible="addDataDialogVisible"
      :showInterface="false"
      @onClose="addDataDialogVisible = false"
      @onSubmit="onAddDataDialogSubmit"
    />
     <settingDialog
      :visible="settingDialogVisible"
      :sourceTable="sourceTable"
      :settingInfo="settingInfo"
      @onSave="saveSetting"
      @onClose="settingDialogVisible = false"
    />
  </div>
</template>·
<script>
import CustomHeader from "@/components/customHeader";
import { mapActions } from "vuex";
import jsplumb from "jsplumb";
import { getEtlListService, saveEtlService, deleteEtlService } from "@/api/etl";
import { getDbTableColumnsList } from "@/api/database-command/index.js";
import iconUpload from "../report/layout/report-config-basics/basics-config/icon-upload.vue";
import addDataDialog from "../report/layout/report-config-data/data-config-new/dialog/add-data-dialog.vue";
import settingDialog from "./module/setting.vue";
export default {
  components: { iconUpload, addDataDialog, CustomHeader, settingDialog },
  data() {
    return {
      etlList: [],
      addDataDialogVisible: false,
      selectedConnectId: "",
      eltType: "source",
      etlName: "",
      lumbName: "",
      lumbId: null,
      lineLumb: null,
      scorllCount: 0,
      choseFunction: false,
      newInputFlag: false,
      newOutputFlag: false,
      chosenOutputFlag: false,
      chosenInputFlag: false, // 控制 输入的变量垃圾桶
      editFunctionInfo: {
        flag: false,
        paramNodes: [],
      },
      dateFormateList: [
        {
          name: "年/月/日",
          value: "yyyy/MM/dd",
        },
        {
          name: "年/月/日 时:分:秒",
          value: "yyyy/MM/dd hh:mm:ss",
        },
      ],
      timeList: [
        {
          name: "年",
          value: "y",
        },
        {
          name: "月",
          value: "M",
        },
        {
          name: "日",
          value: "d",
        },
        {
          name: "时",
          value: "H",
        },
        {
          name: "分",
          value: "m",
        },
        {
          name: "秒",
          value: "s",
        },
      ],
      functionType: "",
      functionTypeList: [
        {
          key: "数值",
        },
        {
          key: "字符串",
        },
        {
          key: "日期",
        },
        {
          key: "其他",
        },
        {
          key: "列表",
        },
      ],
      FList: [
        {
          name: "加法",
          function: "SYS_ADD(a, b)",
          type: "数值",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "减法",
          function: "SYS_SUB(a, b)",
          type: "数值",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "乘法",
          function: "SYS_MUL(a, b)",
          type: "数值",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "除法",
          function: "SYS_DIV(a, b)",
          type: "数值",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "绝对值",
          function: "SYS_ABS(a)",
          type: "数值",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },

        {
          name: "字符串相连",
          function: "SYS_CONCAT(a,b)",
          type: "字符串",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "字符串替换",
          function: "SYS_REPLACE(oldString, newString )",
          type: "字符串",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "字符串分割",
          function: "SYS_SPLIT(a, b)",
          type: "字符串",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "切换大写",
          function: "SYS_TOUPPER(a)",
          type: "字符串",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "切换小写",
          function: "SYS_TOLOWER(a)",
          type: "字符串",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "两侧去空",
          function: "SYS_TRIM(a)",
          type: "字符串",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        // {
        //   name: "左侧去空",
        //   type: "字符串",
        //   chosen: false,
        //   paramNodes: [
        //     {
        //       name: "参数1"
        //     }
        //   ],
        //   resultNodes: [
        //     {
        //       name: "结果"
        //     }
        //   ]
        // },
        // {
        //   name: "右侧去空",
        //   type: "字符串",
        //   chosen: false,
        //   paramNodes: [
        //     {
        //       name: "参数1"
        //     }
        //   ],
        //   resultNodes: [
        //     {
        //       name: "结果"
        //     }
        //   ]
        // },
        {
          name: "日期格式化",
          function: "SYS_DATE_FORMAT(a)",
          type: "日期",
          chosen: false,
          paramNodes: [
            {
              name: "格式化",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "获取当前日期",
          function: "SYS_DATE_NOW()",
          type: "日期",
          chosen: false,
          paramNodes: [],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "日期添加",
          function: "SYS_DATE_ADD(a, b)",
          type: "日期",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "日期减少",
          function: "SYS_DATE_SUB(a, b)",
          type: "日期",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "赋值",
          function: "SYS_ASSIGN(a)",
          type: "其他",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "追加",
          function: "SYS_LIST_ADD(a,list)",
          type: "列表",
          chosen: false,
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
      ],
      nodeList: {
        functionList: [],
        inputList: [
          {
            id: "input1",
            chosen: false,
            type: "input",
            name: "时间",
          },
          {
            id: "input2",
            chosen: false,
            type: "input",
            name: "商品",
          },
          {
            id: "input3",
            chosen: false,
            type: "input",
            name: "品类",
          },
          {
            id: "input4",
            chosen: false,
            type: "input",
            name: "门店",
          },
          {
            id: "input5",
            chosen: false,
            type: "input",
            name: "月销量",
          },
          // {
          //   id: "input6",
          //   chosen: false,
          //   type: "input",
          //   name: "月销量"
          // },
          // {
          //   id: "input7",
          //   chosen: false,
          //   type: "input",
          //   name: "月销量"
          // },
          // {
          //   id: "input8",
          //   chosen: false,
          //   type: "input",
          //   name: "月销量"
          // },
          // {
          //   id: "input9",
          //   chosen: false,
          //   type: "input",
          //   name: "月销量"
          // },
          // {
          //   id: "input10",
          //   chosen: false,
          //   type: "input",
          //   name: "月销量"
          // },
          // {
          //   id: "input11",
          //   chosen: false,
          //   type: "input",
          //   name: "月销量"
          // },
          // {
          //   id: "input12",
          //   chosen: false,
          //   type: "input",
          //   name: "月销量"
          // },
          // {
          //   id: "input13",
          //   chosen: false,
          //   type: "input",
          //   name: "月销量"
          // },
          // {
          //   id: "input14",
          //   chosen: false,
          //   type: "input",
          //   name: "月销量"
          // },
          // {
          //   id: "input15",
          //   chosen: false,
          //   type: "input",
          //   name: "月销量"
          // },
          // {
          //   id: "input16",
          //   chosen: false,
          //   type: "input",
          //   name: "月销量"
          // }
        ],
        outputList: [
          {
            id: "output1",
            chosen: false,
            type: "output",
            name: "日期",
          },
          {
            id: "output2",
            chosen: false,
            type: "output",
            name: "门店",
          },
          {
            id: "output3",
            chosen: false,
            type: "output",
            name: "月销量",
          },
        ],
      },
      newFuncList: [
        // {
        //   id: "",
        //   funcName: "",
        //   inputs: [
        //     {
        //       nodeType: 1, // 1: 输入实体， 2: 函数输出参数作为输入  3:静态值
        //       name: "",
        //       fromNodeId: "", // 当nodeType==2时: "xx", 函数节点Id
        //       value: "" //当nodeType==3时:静态值
        //     }
        //   ],
        //   output: {
        //     nodeType: 101, //101: 输出到实体  102:输出到函数作为下一个函数输入
        //     name: "", //当nodeType==101时 实体字段名称
        //     toNodeId: "" //  当nodeType==102时 输出到某函数的节点Id
        //   }
        // }
      ],
      commonConfig: {
        isSource: true,
        isTarget: true,
        connector: ["Straight"],
        maxConnections: 1,
        paintStyle: {
          fill: "#333",
        },
        hoverPaintStyle: {
          outlineStroke: "#333",
        },
      },
      inputcommonConfig: {
        isSource: true,
        connector: ["Straight"],
        maxConnections: 1,
        paintStyle: {
          fill: "#333",
        },
        hoverPaintStyle: {
          outlineStroke: "#333",
        },
      },
      lineConfig: {
        endpoint: ["Dot", { radius: 6, cssClass: "cursor-pointer" }],
        connector: ["Straight"],
        paintStyle: { stroke: "#bbb", strokeWidth: 3 },
        overlays: [["Arrow", { width: 12, length: 12, location: 0.5 }]],
        anchor: ["Left", "Right"],
      },
      leftLineConfig: {
        endpoint: ["Dot", { radius: 3, cssClass: "cursor-pointer" }],
        connector: ["Straight"],
        paintStyle: { stroke: "#bbb", strokeWidth: 3 },
        overlays: [["Arrow", { width: 12, length: 12, location: 0.5 }]],
        anchor: ["Left", "Right"],
      },
      rightLineConfig: {
        endpoint: ["Dot", { radius: 3, cssClass: "cursor-pointer" }],
        connector: ["Straight"],
        paintStyle: { stroke: "#bbb", strokeWidth: 3 },
        overlays: [["Arrow", { width: 12, length: 12, location: 0.5 }]],
        anchor: ["Right"],
      },
      noAnchorLineConfig: {
        endpoint: ["Dot", { radius: 3, cssClass: "cursor-pointer" }],
        connector: ["Straight"],
        paintStyle: { stroke: "#bbb", strokeWidth: 3 },
        overlays: [["Arrow", { width: 12, length: 12, location: 0.5 }]],
      },
      newInputName: "",
      newOutputName: "",
      funcName: "",
      testNode:
        '{"functionList":[{"id":"func4099c5a9-3f7d-4daa-8cea-9c355a5ed2b2","type":"数值","name":"绝对值","paramNodes":[{"id":"param-78ba4aa9-e0b2-444c-a49e-a8dcfc27927c","name":"参数1","from":{"sourceName":"门店","type":"input","sourceId":"input4"}}],"resultNodes":[{"id":"param-f4906c1c-4af4-4bb4-847e-9d433b400c0e","name":"结果","targetType":"param","targetName":"参数2","targetId":"param-3b6a958a-20ec-462b-b94c-416d4099287f"}],"top":30,"left":141.9875030517578},{"id":"func00ff2f00-dbdc-43e6-b955-d197e17f4006","type":"数值","name":"加","paramNodes":[{"id":"param-8bc58e01-b947-448b-84c6-9b5a2666040a","name":"参数1","from":{"sourceName":"商品","type":"input","sourceId":"input2"}},{"id":"param-3b6a958a-20ec-462b-b94c-416d4099287f","name":"参数2","from":{"type":"param","sourceId":"param-f4906c1c-4af4-4bb4-847e-9d433b400c0e"}}],"resultNodes":[{"id":"param-ff61a153-337b-4b90-90e3-f14eb0852da4","name":"结果","targetType":"output","targetName":"月销量","targetId":"output3"}],"top":28,"left":589.0000152587891},{"id":"func43de9ba5-6942-4936-8da8-7a72c4c22653","type":"日期","name":"日期格式化","paramNodes":[{"id":"param-7897c30a-c71d-446d-be47-ba5ce9f1d293","name":"格式化","from":{"sourceName":"时间","type":"input","sourceId":"input1"}}],"resultNodes":[{"id":"param-9906f680-d732-4ba5-88b1-63dfd875ee8b","name":"结果","targetType":"output","targetName":"日期","targetId":"output1"}],"top":269,"left":194.9875030517578,"dateFormateValue":"yyyy/MM/dd"}],"inputList":[{"id":"input1","chosen":false,"type":"input","name":"时间"},{"id":"input2","chosen":false,"type":"input","name":"商品"},{"id":"input3","chosen":false,"type":"input","name":"品类"},{"id":"input4","chosen":false,"type":"input","name":"门店"},{"id":"input5","chosen":false,"type":"input","name":"月销量"},{"id":"input6","chosen":false,"type":"input","name":"月销量"},{"id":"input7","chosen":false,"type":"input","name":"月销量"},{"id":"input8","chosen":false,"type":"input","name":"月销量"},{"id":"input9","chosen":false,"type":"input","name":"月销量"},{"id":"input10","chosen":false,"type":"input","name":"月销量"},{"id":"input11","chosen":false,"type":"input","name":"月销量"},{"id":"input12","chosen":false,"type":"input","name":"月销量"},{"id":"input13","chosen":false,"type":"input","name":"月销量"},{"id":"input14","chosen":false,"type":"input","name":"月销量"},{"id":"input15","chosen":false,"type":"input","name":"月销量"},{"id":"input16","chosen":false,"type":"input","name":"月销量"}],"outputList":[{"id":"output1","chosen":false,"type":"output","name":"日期"},{"id":"output2","chosen":false,"type":"output","name":"门店"},{"id":"output3","chosen":false,"type":"output","name":"月销量"}]}',
      testConnLine:
        '[{"sourceId":"input4","targetId":"param-78ba4aa9-e0b2-444c-a49e-a8dcfc27927c"},{"sourceId":"input2","targetId":"param-8bc58e01-b947-448b-84c6-9b5a2666040a"},{"sourceId":"param-f4906c1c-4af4-4bb4-847e-9d433b400c0e","targetId":"param-3b6a958a-20ec-462b-b94c-416d4099287f"},{"sourceId":"param-ff61a153-337b-4b90-90e3-f14eb0852da4","targetId":"output3"},{"sourceId":"input1","targetId":"param-7897c30a-c71d-446d-be47-ba5ce9f1d293"},{"sourceId":"param-9906f680-d732-4ba5-88b1-63dfd875ee8b","targetId":"output1"}]',

      sourceTable: [],
      targetTable: [],
      etlId: 0,
      sourceDbConfigId: 0,
      sourceTableName: "",
      targetDbConfigId: 0,
      targetTableName: "",
      value: "",
      settingDialogVisible: false,
      settingInfo: {
        trigger: {},
        start: "",
      },
    };
  },
  methods: {
    onAddETL() {
      this.etlName = "新建ETL";
      this.sourceDbConfigId = 0;
      this.sourceTableName = "";
      this.targetDbConfigId = 0;
      this.targetTableName = "";
      this.etlId = 0;
      this.sourceTable = [];
      this.targetTable = [];
      this.lineLumb.deleteEveryEndpoint();
      this.lineLumb.deleteEveryConnection();
    },
    getSourceTable(type) {
      getDbTableColumnsList({
        dbConfigId: this.sourceDbConfigId,
        tableName: this.sourceTableName,
      }).then((res) => {
        if (res.code == 0) {
          this.sourceTable = res.dataList;
          if (type != "select") {
            this.lineLumb.deleteEveryEndpoint();
            this.lineLumb.deleteEveryConnection();
            this.repaint();
          }
        }
      });
    },
    getTargetTable(type) {
      getDbTableColumnsList({
        dbConfigId: this.targetDbConfigId,
        tableName: this.targetTableName,
      }).then((res) => {
        if (res.code == 0) {
          this.targetTable = res.dataList;
          if (type != "select") {
            this.lineLumb.deleteEveryEndpoint();
            this.lineLumb.deleteEveryConnection();
            this.repaint();
          }
        }
      });
    },
    onSelectedETL(index) {
      let etlInfo = this.etlList[index];
      this.etlName = etlInfo.name;
      let config = JSON.parse(etlInfo.configJson);
      this.sourceDbConfigId = config.sourceDbConfigId;
      this.sourceTableName = config.sourceTableName;
      this.targetDbConfigId = config.targetDbConfigId;
      this.targetTableName = config.targetTableName;
      this.settingInfo.trigger = config.trigger;
      this.settingInfo.start = config.start;
      this.etlId = etlInfo.id;
      if (this.sourceDbConfigId && this.targetDbConfigId) {
        this.getSourceTable("select");
        this.getTargetTable("select");
        var _this = this;
        setTimeout(function () {
          _this.drawETL(config);
        }, 500);
      }
    },
    saveETL() {
      let linkDictList = [];
      let allConnections = this.lineLumb.getAllConnections();
      allConnections.forEach((item) => {
        let sourcelist = item.sourceId.split("source-");
        let targetlist = item.targetId.split("target-");
        linkDictList.push({
          sourceId: sourcelist[1],
          targetId: targetlist[1],
        });
      });
      let config = {
        sourceDbConfigId: this.sourceDbConfigId,
        sourceTableName: this.sourceTableName,
        targetDbConfigId: this.targetDbConfigId,
        targetTableName: this.targetTableName,
        connect: linkDictList,
        trigger: this.settingInfo.trigger,
        start: this.settingInfo.start,
      };
      let param = {
        name: this.etlName,
        configJson: JSON.stringify(config),
      };
      if (this.etlId) {
        param.id = this.etlId;
      }

      saveEtlService(param).then((res) => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.initData();
        }
      });
    },
    saveDate() {
      const msg = this.$Message.loading("正在提交...", 0);
      for (let i = 0; i < this.nodeList.functionList.length; i++) {
        let functionItem = this.nodeList.functionList[i];
        // 吧xy 值写入function 中
        functionItem.top = $("#" + functionItem.id).position().top;
        functionItem.left = $("#" + functionItem.id).position().left;
      }
      let linkDictList = [];
      let allConnections = this.lineLumb.getAllConnections();
      allConnections.forEach((item) => {
        linkDictList.push({
          sourceId: item.sourceId,
          targetId: item.targetId,
        });
      });
      for (let i = 0; i < this.nodeList.functionList.length; i++) {
        let functionItem = this.nodeList.functionList[i];
        // 查找 function param targetId 对应的值
        functionItem.paramNodes.forEach((item) => {
          let from = { type: "static", value: item.defaultValue };
          linkDictList.forEach((conn) => {
            if (item.id == conn.targetId) {
              let type = this.getType(conn.sourceId);
              from = {
                sourceName: this.getNameByIdAndType(conn.sourceId, type),
                type: type,
                sourceId: conn.sourceId,
              };
            }
          });
          item.from = from;
        });
        let result = functionItem.resultNodes[0]; // result 暂时只处理1个
        linkDictList.forEach((conn) => {
          if (result.id == conn.sourceId) {
            let type = this.getType(conn.targetId);
            result.targetType = type;
            result.targetName = this.getNameByIdAndType(conn.targetId, type);
            result.targetId = conn.targetId;
          }
        });
      }
      // console.log(this.nodeList);
      // console.log(JSON.stringify(this.nodeList));
      // 2020-06-09 拼接接口参数
      this.newFuncList = [];
      for (let i = 0; i < this.nodeList.functionList.length; i++) {
        let functionItem = this.nodeList.functionList[i];
        let inputList = [];
        let outputInfo = {};
        functionItem.paramNodes.forEach((item) => {
          let input;
          if (item.from.type == "input") {
            input = {
              nodeType: 1,
              name: item.from.sourceName,
            };
          } else if (item.from.type == "result") {
            input = {
              nodeType: 2,
              fromNodeId: this.getFuncIdByResultId(item.from.sourceId), // 函数节点id
            };
          } else if (item.from.type == "static") {
            input = {
              nodeType: 3,
              value: item.from.value,
            };
          }
          inputList.push(input);
        });
        let result = functionItem.resultNodes[0]; // result 暂时只处理1个
        if (result.targetType == "output") {
          outputInfo = {
            nodeType: 101,
            name: result.targetName,
          };
        } else if (result.targetType == "param") {
          outputInfo = {
            nodeType: 102,
            toNodeId: this.getFuncIdByParamId(result.targetId),
          };
        }
        let newNode = {
          id: functionItem.id,
          funcName: functionItem.name,
          inputs: inputList,
          output: outputInfo,
        };
        this.newFuncList.push(newNode);
      }

      // 调接口前面 拼装参数
      let params = {
        name: this.lumbName,
        input: this.nodeList.inputList,
        func: this.newFuncList,
        output: this.nodeList.outputList,
        config: {
          connLine: linkDictList,
          nodeList: this.nodeList,
        }, // 这里都是我用的参数 可以吧nodeList 以及连线
      };
      let config = {
        connLine: linkDictList,
        nodeList: this.nodeList,
      };
      if (this.lumbId) {
        updateFunction(
          this.lumbId,
          this.lumbName,
          this.funcName,
          JSON.stringify(this.nodeList.inputList),
          JSON.stringify(this.newFuncList),
          JSON.stringify(this.nodeList.outputList),
          JSON.stringify(config)
        )
          .then((res) => {
            msg();
            if (res.data.code == 0) {
              this.$Message.success("编辑成功");
            } else {
              this.$Message.error(res.data.message, 10);
            }
          })
          .catch((err) => {
            msg();
            this.$Message.error(err.response.data.message, 10);
            reject(err);
          });
      } else {
        createFunction(
          this.lumbName,
          this.getFuncName(),
          JSON.stringify(this.nodeList.inputList),
          JSON.stringify(this.newFuncList),
          JSON.stringify(this.nodeList.outputList),
          JSON.stringify(config)
        )
          .then((res) => {
            msg();
            if (res.data.code == 0) {
              this.$Message.success("保存成功", 2);
              this.lumbId = res.data.data.id;
              this.$router.replace("/lumb/" + this.lumbId);
            } else {
              this.$Message.error(res.data.message, 10);
            }
          })
          .catch((err) => {
            msg();
            reject(err);
          });
      }

      // let data = {
      //   inputs: [],
      //   outputs: [],
      //   functions: [
      //     {
      //       parammeters: [
      //         {
      //           name: "",
      //           from: {
      //             type: "input/static/function",
      //             sourceName: "",
      //             sourceId: "",
      //             value: ""
      //           }
      //         }
      //       ],
      //       result: {}
      //     }
      //   ]
      // };
    },
    getType(id) {
      if (id.indexOf("input") > -1) {
        return "input";
      } else if (id.indexOf("param") > -1) {
        return "param";
      } else if (id.indexOf("output") > -1) {
        return "output";
      } else if (id.indexOf("result") > -1) {
        return "result";
      }
    },
    getNameByIdAndType(id, type) {
      if (type == "input") {
        for (let i = 0; i < this.nodeList.inputList.length; i++) {
          let item = this.nodeList.inputList[i];
          if (item.id == id) {
            return item.name;
          }
        }
      } else if (type == "output") {
        for (let i = 0; i < this.nodeList.outputList.length; i++) {
          let item = this.nodeList.outputList[i];
          if (item.id == id) {
            return item.name;
          }
        }
      } else if (type == "function") {
        for (let i = 0; i < this.nodeList.functionList.length; i++) {
          let item = this.nodeList.functionList[i];
          if (item.id == id) {
            return item.name;
          }
        }
      } else if (type == "param") {
        for (let i = 0; i < this.nodeList.functionList.length; i++) {
          let item = this.nodeList.functionList[i];
          for (let j = 0; j < item.paramNodes.length; j++) {
            let paramItem = item.paramNodes[j];
            if (paramItem.id == id) {
              return paramItem.name;
            }
          }
        }
      } else if (type == "result") {
        for (let i = 0; i < this.nodeList.functionList.length; i++) {
          let item = this.nodeList.functionList[i];
          for (let j = 0; j < item.resultNodes.length; j++) {
            let rItem = item.resultNodes[j];
            if (rItem.id == id) {
              return rItem.name;
            }
          }
        }
      }
    },
    getFuncIdByResultId(resultId) {
      for (let i = 0; i < this.nodeList.functionList.length; i++) {
        let func = this.nodeList.functionList[i];
        if (resultId == func.resultNodes[0].id) {
          return func.id;
        }
      }
    },
    getFuncIdByParamId(paramId) {
      for (let i = 0; i < this.nodeList.functionList.length; i++) {
        let func = this.nodeList.functionList[i];
        func.paramNodes.forEach((item) => {
          if (item.id == paramId) {
            return func.id;
          }
        });
      }
    },
    draw(config) {
      let _this = this;
      _this.lineLumb.deleteEveryEndpoint();
      _this.lineLumb.deleteEveryConnection();
      _this.nodeList = config.nodeList;
      _this.repaint();
      this.$nextTick(() => {
        let connLines = config.connLine;
        for (let i = 0; i < connLines.length; i++) {
          let line = connLines[i];
          if (line.sourceId.indexOf("input") > -1) {
            _this.lineLumb.connect(
              {
                source: line.sourceId,
                target: line.targetId,
              },
              _this.lineConfig
            );
          } else if (line.targetId.indexOf("output") > -1) {
            _this.lineLumb.connect(
              {
                source: line.sourceId,
                target: line.targetId,
              },
              _this.lineConfig
            );
          } else {
            _this.lineLumb.connect(
              {
                source: line.sourceId,
                target: line.targetId,
              },
              _this.noAnchorLineConfig
            );
          }
        }
      });
    },
    drawETL(config) {
      let _this = this;
      _this.lineLumb.deleteEveryEndpoint();
      _this.lineLumb.deleteEveryConnection();
      // _this.repaint();
      for (let i = 0; i < _this.sourceTable.length; i++) {
        let inputNode = _this.sourceTable[i];
        _this.lineLumb.addEndpoint(
          "source-" + inputNode.columnName,
          {
            anchors: ["Right"],
          },
          _this.inputcommonConfig
        );
      }

      for (let i = 0; i < _this.targetTable.length; i++) {
        let outputNode = _this.targetTable[i];
        _this.lineLumb.addEndpoint(
          "target-" + outputNode.columnName,
          {
            anchors: ["Left"],
          },
          _this.commonConfig
        );
      }
      let connLines = config.connect;
      for (let i = 0; i < connLines.length; i++) {
        let line = connLines[i];
        _this.lineLumb.connect(
          {
            source: "source-" + line.sourceId,
            target: "target-" + line.targetId,
          },
          _this.lineConfig
        );
      }
      this.$nextTick(() => {});
    },
    addFunction() {
      this.choseFunction = true;
    },
    cancel() {},
    confirmFunction() {
      for (let i = 0; i < this.FList.length; i++) {
        if (this.FList[i].chosen) {
          let count = this.nodeList.functionList.length + 1;
          let fParamNodes = this.FList[i].paramNodes;
          let fResultNodes = this.FList[i].resultNodes;
          let paramNodes = [];
          let resultNodes = [];
          for (let j = 0; j < fParamNodes.length; j++) {
            paramNodes.push({
              id: "param-" + this.getUUID(),
              name: fParamNodes[j].name,
            });
          }
          for (let k = 0; k < fResultNodes.length; k++) {
            resultNodes.push({
              id: "result-" + this.getUUID(),
              name: fResultNodes[k].name,
            });
          }

          this.nodeList.functionList.push({
            id: "func" + this.getUUID(),
            type: this.FList[i].type,
            name: this.FList[i].name,
            paramNodes: paramNodes,
            resultNodes: resultNodes,
          });
          this.repaint();
        }
      }
    },
    confirmInput() {
      let inputList = this.nodeList.inputList;
      this.nodeList.inputList.push({
        id: "input" + this.getUUID(),
        chosen: false,
        type: "input",
        name: this.newInputName,
      });
      this.repaint();
    },
    confirmOutput() {
      let outputList = this.nodeList.outputList;
      this.nodeList.outputList.push({
        id: "output" + this.getUUID(),
        chosen: false,
        type: "output",
        name: this.newOutputName,
      });
      this.repaint();
    },
    choseFunc(index) {
      for (let i = 0; i < this.FList.length; i++) {
        if (index == i) {
          this.FList[index].chosen = true;
        } else {
          this.FList[i].chosen = false;
        }
      }
    },
    choseInput(index) {
      this.chosenInputFlag = false;
      for (let i = 0; i < this.nodeList.inputList.length; i++) {
        if (index == i) {
          this.nodeList.inputList[index].chosen = true;
          this.chosenInputFlag = true;
        } else {
          this.nodeList.inputList[i].chosen = false;
        }
      }
    },
    choseOutput(index) {
      this.chosenOutputFlag = false;
      for (let i = 0; i < this.nodeList.outputList.length; i++) {
        if (index == i) {
          this.nodeList.outputList[index].chosen = true;
          this.chosenOutputFlag = true;
        } else {
          this.nodeList.outputList[i].chosen = false;
        }
      }
    },
    deleteInput() {
      let inputList = this.nodeList.inputList;
      let inid = null;
      for (let i = 0; i < inputList.length; i++) {
        if (inputList[i].chosen) {
          this.chosenInputFlag = false;
          inid = inputList[i].id;
          this.nodeList.inputList.splice(i, 1);
          this.lineLumb.remove(inid);
          break;
        }
      }
      // this.lineLumb.repaintEverything();
      // this.repaint();
      this.$nextTick(() => {
        if (inid) {
          // this.lineLumb.remove(inid);
          this.lineLumb.repaintEverything();
        }
      });
    },
    deleteOutput() {
      let outputList = this.nodeList.outputList;
      let outid = null;
      for (let i = 0; i < outputList.length; i++) {
        if (outputList[i].chosen) {
          this.chosenOutputFlag = false;
          outid = outputList[i].id;
          this.nodeList.outputList.splice(i, 1);
          this.lineLumb.remove(outid);
          break;
        }
      }
      // this.lineLumb.repaintEverything();
      // this.repaint();
      this.$nextTick(() => {
        if (outid) {
          // this.lineLumb.remove(inid);
          this.lineLumb.repaintEverything();
        }
      });
    },
    deleteFunction(index) {
      let func = this.nodeList.functionList[index];
      for (let i = 0; i < func.paramNodes.length; i++) {
        this.lineLumb.remove(func.paramNodes[i].id);
      }
      for (let j = 0; j < func.resultNodes.length; j++) {
        this.lineLumb.remove(func.resultNodes[j].id);
      }
      this.lineLumb.remove(func.id);

      this.nodeList.functionList.splice(index, 1);

      this.$nextTick(() => {
        this.lineLumb.repaintEverything();
      });
    },
    editFunction(functionId) {
      // 编辑函数默认值 TODO
      this.nodeList.functionList.forEach((v) => {
        if (functionId == v.id) {
          this.editFunctionInfo.flag = true;
          this.editFunctionInfo.id = v.id;
          this.editFunctionInfo.paramNodes = v.paramNodes;
          this.editFunctionInfo.name = v.name;
          this.editFunctionInfo.type = v.type;
        }
      });
    },
    confirmEdit() {
      for (let i = 0; i < this.nodeList.functionList.length; i++) {
        let v = this.nodeList.functionList[i];
        if (this.editFunctionInfo.id == v.id) {
          this.nodeList.functionList[i].paramNodes =
            this.editFunctionInfo.paramNodes;
        }
      }
    },
    save() {
      let foldData = {};
      // console.log(this.lineLumb);
      // console.log(this.lineLumb.getAllConnections());
      let targetEndpointList = [];
      let linkDictList = [];
      let allConnections = this.lineLumb.getAllConnections();
      allConnections.forEach((item) => {
        // if (filterIds.indexOf(item.sourceId) !== -1) {
        linkDictList.push({
          sourceId: item.sourceId,
          targetId: item.targetId,
          sourceEndpoint: item.endpoints[0],
          targetEndpoint: item.endpoints[1],
        });
        console.log(linkDictList);
        targetEndpointList.push(item.endpoints[1]);
        // }
      });
      // foldData[foldId] = linkDictList;
      // console.log(targetEndpointList);
    },
    jspBeforeDrop(info) {
      info.targetId = info.dropEndpoint.elementId;
      let connections = this.lineLumb.getConnections({
        source: info.sourceId,
        target: info.targetId,
      });
      if (info.targetId === info.sourceId) {
        return;
      } else {
        if (connections.length === 0) {
          // 检查是否已经建立过连接
          this.addEdge(info);
        } else {
          Modal.warning({
            title: "两个节点之间只能有一条连接",
          });
        }
      }
    },
    repaint() {
      this.lineLumb.deleteEveryEndpoint();
      this.lineLumb.deleteEveryConnection();
      let _this = this;

      this.$nextTick(() => {
        //重新绘制 function
        this.paintNodes(_this.lineLumb);
      });
    },
    initData() {
      // let id = this.$route.params.id;
      // if (id) {
      //   this.lumbId = id;
      //   getFunction(id).then(res => {
      //     if (res.data.code == 0) {
      //       let config = JSON.parse(res.data.data.config);
      //       this.funcName = res.data.data.func_name;
      //       this.draw(config);
      //     }
      //   });
      // }
      getEtlListService().then((res) => {
        console.log("etlList", res);
        this.etlList = res.dataList;
      });
    },
    setExitPoint(id, position) {
      // var config = getBaseNodeConfig()
      this.lineLumb.addEndpoint(
        id,
        {
          anchors: position || "Bottom",
          uuid: id + "-out",
        },
        this.commonConfig
      );
    },
    paintNodes(j) {
      console.log("paintNodes", j, this.sourceTable);
      let _this = this;

      for (let i = 0; i < _this.sourceTable.length; i++) {
        let inputNode = _this.sourceTable[i];
        j.addEndpoint(
          "source-" + inputNode.columnName,
          {
            anchors: ["Right"],
          },
          _this.inputcommonConfig
        );
      }
      for (let i = 0; i < _this.targetTable.length; i++) {
        let outputNode = _this.targetTable[i];
        j.addEndpoint(
          "target-" + outputNode.columnName,
          {
            anchors: ["Left"],
          },
          _this.commonConfig
        );
      }
    },
    handleScroll() {
      this.lineLumb.repaintEverything();
    },
    endpointClick() {
      console.log("111");
    },
    getUUID() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    },
    getFuncName() {
      return "USER_" + this.getUUID().replace(/[-]/g, "");
    },
    onAddDataDialogSubmit(data) {
      console.log("onAddDataDialogSubmit", data);
      let dbConfigId = data.data.dbConfigId;
      let tableName = data.data.tableName;
      if (data.data.dataType == "view") {
        tableName = data.data.name;
      }

      if (this.etlType === "source") {
        this.sourceDbConfigId = dbConfigId;
        this.sourceTableName = tableName;
        this.getSourceTable();
      } else {
        this.targetDbConfigId = dbConfigId;
        this.targetTableName = tableName;
        this.getTargetTable();
      }

      this.addDataDialogVisible = false;
    },
    confirmDel(id) {
      const h = this.$createElement;
      this.$msgbox({
        title: "删除",
        message: h(
          "p",
          { style: "font-size: 16px; padding: 60px 0px; text-align: center;" },
          [
            h("span", null, "请确认是否删除？"),
            h("br", null, ""),
            h(
              "span",
              { style: "font-size: 12px; color: red" },
              "删除后将会影响已有数据，请认真确认；"
            ),
          ]
        ),
        showCancelButton: true,
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.deleteEtl(id);
        })
        .catch(() => {});
    },
    deleteEtl(id) {
      deleteEtlService({ etlId: id }).then((res) => {
        if (res.code == 0) {
          this.$message.success("删除成功");
          this.initData();
        }
      });
    },
    gosetting() {
      this.settingDialogVisible = true;
      console.log("setting", this.sourceTable);
    },
    saveSetting(settingInfo) {
      console.log("saveSetting", settingInfo);
      this.settingInfo.trigger = settingInfo.trigger;
      this.settingInfo.start = settingInfo.start;
      this.settingDialogVisible = false;
    },
  },
  mounted() {
    let _this = this;
  },
  created() {
    document.addEventListener("scroll", this.handleScroll, true);
    let _this = this;
    this.$nextTick(() => {
      jsPlumb.ready(function () {
        jsPlumb.setContainer("draw");
        var j = jsPlumb.getInstance({
          Container: "draw",
        });
        _this.lineLumb = j;

        j.importDefaults({
          Endpoint: _this.lineConfig.endpoint,
          Connector: _this.lineConfig.connector,
          PaintStyle: _this.lineConfig.paintStyle,
          Overlays: [["Arrow", { width: 12, length: 12, location: 0.5 }]], // 这里的修改逻辑 参考https://www.cnblogs.com/lee3/p/14870924.html 引用通一个overlay 导致所有的连线 都在一个对象里
        });
        _this.paintNodes(j);
      });
      // _this.lineLumb.bind("beforeDrop", _this.jspBeforeDrop);
      // _this.lineLumb.bind("endpointDblClick", _this.endpointClick);
    });
    this.initData();
  },
};
</script>

<style lang="less">
* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  background: #f5f5f5;
}
ol,
ul,
li {
  list-style: none;
}
.etl-container {
  display: flex;
  // height: calc(100vh - 100px);
  height: 100vh;
  user-select: none;
  background: #fff;
  .header_left {
    -webkit-box-flex: 0;
    -ms-flex: 0;
    flex: 0;
  }
  .header_right {
    width: 100%;
    text-align: center;
  }
}
.manage-list-wrap {
  width: 240px;
  .system-title {
    padding: 20px;
    border-bottom: 1px solid #e4e5e6;
    span {
      font-size: 18px;
      font-weight: bold;
    }
    i {
      cursor: pointer;
    }
  }
}
.system-list-wrap,
.interface-list-wrap {
  float: left;
  width: 240px;
  .system-ctrl {
    visibility: hidden;
    position: absolute;
    right: 10px;
    top: 15px;
    font-size: 12px;
    cursor: pointer;
    color: #409eff;
  }
  li {
    position: relative;
    // height: 70px;
    // margin-bottom: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 20px;
    border-left: 5px solid transparent;
    border-bottom: 1px solid #e4e5e6;
    // background-color: #f2f2f2;
    &.active {
      background-color: #edeeef;
      // color: #f85757;
    }
    &:hover {
      .system-ctrl {
        visibility: initial;
      }
    }
  }
}
.system-list-wrap {
  // padding-left: 20px;
  border-right: 1px solid #e4e5e6;
  overflow-y: auto;
  height: calc(100vh - 200px);
  ul {
    // padding: 10px 5px;
    // background-color: #d7d7d7;
    li {
      &.active {
        border-left: 5px solid #409eff;
        // background-color: #ffedeb;
        // color: #f85757;
      }
      p {
        margin-bottom: 0;
      }
    }
  }
}

.draw-container {
  flex: 1;
  position: relative;
}
.draw-header {
  position: absolute;
  display: flex;
  justify-content: space-between;
  z-index: 100;
  background: #fff;
  width: 97%;
}
.table-container {
  display: flex;
  justify-content: space-between;
}

.btn-group {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  text-align: right;
}

.btn-group a:hover {
  color: #66b1ff;
}

.btn-group a {
  margin-right: 15px;
  color: #409eff;
}

a.btn-submit {
  color: #67c23a;
}

.draw-container .list-wrap {
  position: relative;
  width: 45%;
  overflow: auto;
  background-color: #fff;
  height: ~"calc(100vh - 100px)";
  // height: 90vh;
}

.list-wrap {
  border: 1px solid #eaeaea;
  border-left: 0px;
}
.list-wrap:nth-child(1) {
  border-left: 1px solid #eaeaea;
}
.list-wrap:nth-child(2) {
  width: 50%;
  position: relative;
}
.data-list {
  height: 400px;
}
.function-list {
  height: 400px;
}

.left-list > li > div {
  text-align: right;
  padding-right: 10px;
}
.right-list > li > div {
  padding-left: 10px;
}
// .function-list {
//   position: absolute;
//   left: 30%;
// }

// .right-list {
//   right: 50px;
// }

.data-list li {
  padding: 0 10px;
  /* width: 100px; */
  // width: max-content;
  height: 30px;
  /* background: #ecf5ff; */
  line-height: 30px;
  font-size: 16px;
  /* color: #409eff; */
  /* border: 1px solid #b3d8ff; */
  /* border-radius: 10px; */
  cursor: pointer;
  /* text-align: center */
}

.data-list li:hover,
.data-list li.selected {
  /* background: #409eff;
  border-color: #409eff;
  color: #fff; */
}

.function-list li {
  position: absolute;
  width: 300px;
  /* height: 100px; */
  margin: 15px;
  // background: #ecf5ff;
  background: #efefef;
  line-height: 30px;
  font-size: 16px;
  // color: #409eff;
  color: #333;
  border: 1px solid #bbb;
  cursor: pointer;
  text-align: center;
}

/* .function-list li textarea {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  padding: 10px;
  border: 0;
  resize: none;
  outline:none;
} */

.function-list li .params-wrap {
  width: 100%;
  height: 60px;
  padding-left: 10px;
  text-align: left;
  background-color: #fff;
}
.function-list li .result-wrap {
  width: 100%;
  height: 30px;
  padding-right: 10px;
  text-align: right;
}

.function-list li img {
  position: absolute;
  right: 5px;
  top: 5px;
}

.hover-g {
  cursor: pointer;
  opacity: 1;
  stroke-width: 4;
}

.remove-btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  font-size: 14px;
  cursor: pointer;
  display: none;
}

.result-container {
  padding: 20px;
  border-top: 1px solid #ccc;
}

.result-container h3 {
  font-weight: bold;
}

.result-container li {
  font-size: 16px;
  line-height: 35px;
}

/* tab-title */
.tab-title {
  padding-top: 50px;
  text-align: center;
}

/* *************************************************** jsplumb style ********************************************************* */

/* .displaynone {
  width: 100px;
  height: 20px;
} */
.pad-right-10 {
  padding-right: 10px;
}
.pad-left-10 {
  padding-left: 10px;
}
.cursor-pointer {
  cursor: pointer;
}

.list-head {
  position: sticky;
  top: 0px;
  z-index: 99;
  background-color: #efefef;
  padding: 5px;
  font-size: 16px;
}
.icon_plus {
  float: right;
  margin-top: 3px;
  font-size: 20px;
  cursor: pointer;
}
.modal_div {
  display: flex;
  margin-top: 5px;
}
.modal_ul {
  margin-left: 23px;
  border: 1px solid #eaeaea;
  min-width: 200px;
  min-height: 100px;
  max-height: 500px;
}
.modal_ul li {
  padding: 5px;
}
.modal_ul .chosen {
  background-color: #eaeaea;
}
.data-list .chosen {
  background-color: #eaeaea;
}
// 导航条
.op-row {
  padding: 10px 10px 10px 5px;
  border-bottom: 1px solid #eaeaea;
  background-color: #004ea2;
  z-index: 3;
  height: 50px;
  font-family: Alibaba-PuHuiTi-Regular, "Helvetica Neue For Number",
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial,
    sans-serif !important;
  -webkit-font-smoothing: auto;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  color: #fff;
}

.op-row {
  input {
    margin-left: 10px;
    color: #fff;
    border: 0px;
    background-color: #004ea2;
  }
  input::-webkit-input-placeholder {
    /* WebKit browsers 适配谷歌 */
    color: #fff;
  }
  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 适配火狐 */
    color: #fff;
  }
  input::-moz-placeholder {
    /* Mozilla Firefox 19+ 适配火狐 */
    color: #fff;
  }
  input:-ms-input-placeholder {
    /* Internet Explorer 10+  适配ie*/
    color: #fff;
  }
}
.l-btns {
  padding-left: 8px;
}
.l-btns button {
  margin-right: 15px;
}
.r-btns .btns-w {
  justify-content: flex-end;
}
.r-btns button {
  margin-left: 15px;
}
.btns-w {
  display: flex;
  align-items: center;
}
.save_btn {
  border: 0px;
  font-size: 14px;
  margin-top: -2px;
  margin-right: 5px;
}
.save_btn > .ivu-icon {
  margin-top: 1px;
  font-size: 16px;
  font-weight: bold;
}
.edit-model {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
</style>