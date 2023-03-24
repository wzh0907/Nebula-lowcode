<template>
  <!--  数据连接器  -->
  <div class="group-wrap connector-warp">
    <div class="group-content">
      <el-form
        ref="connectorForm"
        :model="connectorItem"
        :rules="opRule"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="showName"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="name" label="操作方法">
          <el-select v-model="connectorItem.opType" @change="opTypeChange">
            <el-option label="查询" value="query"></el-option>
            <el-option label="插入" value="insert"></el-option>
            <el-option label="修改" value="update"></el-option>
            <el-option label="删除" value="delete"></el-option>
            <el-option label="自定义" value="diy"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item
          v-if="connectorItem.opType == 'query'"
          label="数据视图"
          prop="connection_op"
        >
          <el-button v-if="connectorItem.tableName" class="panel-add-btn" type="text" @click.stop="
              addDataDialogVisible = true;
              showView = true;
            "
          >数据表：{{ connectorItem.tableName }}
          </el-button
          >
          <el-button v-else-if="connectorItem.dataSetName" class="panel-add-btn" type="text" @click.stop="
              addDataDialogVisible = true;
              showView = true;
            "
          >SQL脚本：{{ connectorItem.dataSetName }}
          </el-button
          >
          <el-button v-else class="panel-add-btn" type="text" @click.stop="
              addDataDialogVisible = true;
              showView = true;
            ">请选择数据视图
          </el-button>
        </el-form-item>
        <el-form-item
          v-if="
            connectorItem.opType == 'insert' ||
              connectorItem.opType == 'update' ||
              connectorItem.opType == 'delete'
          "
          label="数据表"
          prop="table_name"
        >
          <el-button v-if="connectorItem.tableName" class="panel-add-btn" type="text" @click.stop="
              addDataDialogVisible = true;
              showView = false;
            "
          >数据表：{{ connectorItem.tableName }}
          </el-button>
          <el-button v-else class="panel-add-btn" type="text" @click.stop="
              addDataDialogVisible = true;
              showView = true;
            ">请选择数据表
          </el-button>
        </el-form-item>
        <el-form-item
          v-if="connectorItem.opType == 'diy'"
          label="数据库"
          prop="connection_dbConfigId"
        >
          <el-select
            v-model="connectorItem.dbConfigId"
            class="menu-item-select-db"
            clearable
            filterable
            @change="dbConfigChange"
          >
            <el-option
              v-for="dataSourceItem in dataSourceList"
              :label="dataSourceItem.dataSourceName"
              :value="dataSourceItem.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <h3
        v-if="
          connectorItem.opType == 'insert' || connectorItem.opType == 'update'
        "
        class="route-title2"
      >
        列赋值
      </h3>
      <el-row
        v-if="
          connectorItem.opType == 'insert' || connectorItem.opType == 'update'
        "
      >
        <ul class="menu-item-wrap">
          <li
            v-for="(setItem, setIndex) in connectorItem.setList"
            :key="setIndex"
          >
            <div class="menu-item-li" style="justify-content: normal">
              <el-select v-model="setItem.name" class="menu-item-select-put">
                <el-option
                  v-for="(field, fieldIndex) in fieldList"
                  :key="fieldIndex"
                  :label="field.columnName"
                  :value="field.columnName"
                ></el-option>
              </el-select>
              <span class="condition-list-span">=</span>
              <VarSelect
                style="flex: 1"
                :key="'connector-set-' + setIndex"
                :data="setItem.source"
                :processId="processId"
                :type="'set-' + setIndex"
                class="menu-item-select-var"
                @setVar="setVar"
                @submitVarList="saveVarEdit"
              />
              <!-- <div class="condition-list-btn" @click="delSet(setIndex)">X</div> -->
              <i
                class="el-icon-delete tree-item-operator"
                style="cursor: pointer"
                @click="delSet(setIndex)"
              ></i>
            </div>
          </li>
        </ul>
        <div class="opt-add-btn" @click="addNewSet">添加赋值</div>
      </el-row>
      <h3
        v-if="
          connectorItem.opType == 'query' ||
            connectorItem.opType == 'update' ||
            connectorItem.opType == 'delete'
        "
        class="route-title2"
      >
        条件配置
      </h3>
      <el-row
        v-if="
          connectorItem.opType == 'query' ||
            connectorItem.opType == 'update' ||
            connectorItem.opType == 'delete'
        "
      >
        <ul class="menu-item-wrap">
          <li
            v-for="(sourceItem, sourceIndex) in connectorItem.sourceList"
            :key="sourceIndex"
          >
            <div class="menu-item-li">
              <el-select v-model="sourceItem.field" class="menu-item-select">
                <el-option
                  v-for="(field, fieldIndex) in fieldList"
                  :key="fieldIndex"
                  :label="
                    field.displayName
                      ? field.displayName
                      : field.name
                      ? field.name
                      : field.columnName
                  "
                  :value="
                    field.displayName
                      ? field.displayName
                      : field.name
                      ? field.name
                      : field.columnName
                  "
                ></el-option>
              </el-select>
              <el-select
                v-model="sourceItem.op"
                class="menu-item-select menu-item-select-middle"
                style="margin: 0px 5px"
              >
                <el-option label="=" value="="></el-option>
                <el-option label=">" value=">"></el-option>
                <el-option label="<" value="<"></el-option>
                <el-option label=">=" value=">="></el-option>
                <el-option label="<=" value="<="></el-option>
                <el-option label="!=" value="<>"></el-option>
                <el-option label="in" value="in"></el-option>
                <el-option label="包含" value="include"></el-option>
                <el-option label="前包含" value="startWith"></el-option>
                <el-option label="后包含" value="endWith"></el-option>
              </el-select>
              <VarSelect
                :key="'connector-param-' + sourceIndex"
                :data="sourceItem.source"
                :processId="processId"
                :type="'param-' + sourceIndex"
                class="menu-item-select-var"
                @setVar="setVar"
                @submitVarList="saveVarEdit"
              />
              <i
                class="el-icon-delete tree-item-operator"
                style="cursor: pointer"
                @click="delProcess(sourceIndex)"
              ></i>
            </div>
          </li>
        </ul>
        <div class="opt-add-btn" @click="addNewRoute">
          <icon class="iconfont iconjiahao1"></icon>
          添加条件
        </div>
      </el-row>
      <h3 v-if="connectorItem.opType == 'diy'">
        SQL脚本
        <span style="font-size: 12px">使用{占位符}增加占位符编辑功能</span>
      </h3>
      <el-row v-if="connectorItem.opType == 'diy'">
        <CodeEditor
          v-model="connectorItem.sql"
          :editorOptions="editorOptions"
          :height="editorHeight"
          mode="sql"
          width="100%"
        />
      </el-row>
      <h3 v-if="connectorItem.opType == 'diy'" class="route-title2">占位符</h3>
      <el-row v-if="connectorItem.opType == 'diy'">
        <ul class="menu-item-wrap">
          <li
            v-for="(condiItem, condiIndex) in connectorItem.conditions"
            :key="condiIndex"
          >
            <div class="menu-item-li" style="justify-content: normal">
              <span class="tree-item-text">{{ condiItem.key + ":" }}</span>
              <el-select v-model="condiItem.andor" class="menu-item-select">
                <el-option label="变量" value="VAR"></el-option>
                <el-option label="AND" value="AND"></el-option>
                <el-option label="OR" value="OR"></el-option>
              </el-select>
              <el-input
                v-if="condiItem.andor != 'VAR'"
                v-model="condiItem.name"
                placeholder="字段名"
                size="small"
                style="width: 150px; line-height: 40px; margin: 0 5px"
              />
<!--              <div class="condition-item">-->
                <el-select
                  v-if="condiItem.andor != 'VAR'"
                  v-model="condiItem.op"
                  class="menu-item-select"
                >
                  <el-option label="=" value="="></el-option>
                  <el-option label=">" value=">"></el-option>
                  <el-option label="<" value="<"></el-option>
                  <el-option label=">=" value=">="></el-option>
                  <el-option label="<=" value="<="></el-option>
                  <el-option label="!=" value="<>"></el-option>
                  <el-option label="in" value="in"></el-option>
                  <el-option label="not in" value="not in"></el-option>
                  <el-option label="like" value="like"></el-option>
                  <el-option label="not like" value="not like"></el-option>
                </el-select>
<!--              </div>-->

              <VarSelect
                style="margin-left: 16px"
                :key="'connector-sql-' + condiIndex"
                :data="condiItem.value"
                :processId="processId"
                :type="'sql-' + condiIndex"
                class="menu-item-select-var"
                @setVar="setVar"
                @submitVarList="saveVarEdit"
              />
              <span
                v-if="condiItem.andor != 'VAR'"
                class="tree-item-text"
                style="cursor: pointer"
                @click="condiItem.more = !condiItem.more"
              >条件</span
              >
            </div>
            <ul v-if="condiItem.more">
              <li>
                <span class="tree-item-text">当</span>
                <VarSelect
                  :key="'connector-left-' + condiIndex"
                  :data="condiItem.condition.left"
                  :processId="processId"
                  :type="'left-' + condiIndex"
                  class="menu-item-select-var"
                  @setVar="setVar"
                  @submitVarList="saveVarEdit"
                />
                <el-select
                  v-model="condiItem.condition.op"
                  class="menu-item-select"
                  @change="changeCondition(condiItem)"
                >
                  <el-option label="=" value="="></el-option>
                  <el-option label=">" value=">"></el-option>
                  <el-option label="<" value="<"></el-option>
                  <el-option label=">=" value=">="></el-option>
                  <el-option label="<=" value="<="></el-option>
                  <el-option label="!=" value="<>"></el-option>
                  <el-option label="isNull" value="isNull"></el-option>
                  <el-option label="isNotNull" value="isNotNull"></el-option>
                </el-select>
                <VarSelect
                  :key="'connector-right-' + condiIndex"
                  :data="condiItem.condition.right"
                  :processId="processId"
                  :type="'right-' + condiIndex"
                  class="menu-item-select-var"
                  @setVar="setVar"
                  @submitVarList="saveVarEdit"
                />
                <span class="tree-item-text">使用表达式</span>
              </li>
            </ul>
          </li>
        </ul>
      </el-row>
      <h3 style="margin-top: 20px">备注</h3>
      <el-input
        v-model="connectorItem.remark"
        :autosize="{ minRows: 5, maxRows: 15 }"
        placeholder="Enter something..."
        type="textarea"
      />
    </div>
    <addDataDialog
      :showView="showView"
      :visible="addDataDialogVisible"
      @onClose="addDataDialogVisible = false"
      @onSubmit="onAddDataDialogSubmit"
    />
    <!-- <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem">删除</el-button>
        <el-button class="btn btns-save" type="primary" @click="saveConfig('connectorForm')">保存</el-button>
      </el-row >
    </div> -->
  </div>
</template>

<script>
import addDataDialog from "./dialog/add-data-dialog.vue";
import VarSelect from "../module/variable-selectV4";
import CodeEditor from "@/components/CodeEditor";
import {
  getDataSetListItem,
  getTableList,
  getTableFieldList,
  getDataSourceList
} from "@/api/report";
import {getDbTableColumnsList} from "@/api/database-command";
import {mapActions, mapMutations} from "vuex";

export default {
  name: "drag-drawer-connector-query",
  components: {
    VarSelect,
    CodeEditor,
    addDataDialog
  },
  props: {
    curDiagram: {
      type: Object
    },
    processId: {
      type: Number,
      default: 0
    },
    subType: {
      type: String,
      default: "connector-query"
    }
  },
  data() {
    return {
      addDataDialogVisible: false,
      showName: "",
      showSql: "",
      showView: true,
      connectorItem: {
        name: "",
        remark: "",
        type: "database",
        opType: "query",
        //        loader_type: 'GET',
        connection_op: "",
        source: {},
        sourceList: [],
        sqlParamList: [],
        target: {}
        //        sql:'',
      },
      //        connection_id:6
      //        id:1
      //        name:"test op1"
      //        op_type:"GET"
      //        param:""
      //        sql:"select * from tb_connection_op

      parameterItem: {
        property_name: "",
        data_value: "",
        relative_to_current_date_type: "",
        relative_to_current_date_delta: "",
        date_type: "",
        date_format: "",
        value_type: "SystemProperty",
        showName: ""
      },
      modal1: false,
      modal2: false,
      connectorList: [], // 属性
      conList: [],
      conMap: {},
      opList: [],
      editConnectorData: {},
      editNum: 0,
      valueMap: {
        SystemProperty: "系统变量",
        CurrentData: "当前数据",
        DocumentProperty: "数据/文档属性",
        Static: "静态值",
        DateTime: "时间值",
        Arguments: "输入参数"
      },
      opRule: {
        name: [{required: true, message: "请输入名称", trigger: "blur"}]
        // connection: [
        //   { required: true, message: "请选择数据连接", trigger: "change" },
        // ],
        // connection_op: [
        //   { required: true, message: "请选择数据操作", trigger: "change" },
        // ],
      },
      target: {
        category: "",
        name: ""
      },
      varMap: null,
      chosenConn: {},
      op: "",
      cVal: "",
      wVal: "",
      sVal: "",
      loading1: false,
      merchantId: 0,
      projectId: 0,
      fieldList: [],
      sql: "",
      editorHeight: "200px",
      editorOptions: {
        showGutter: false
      },
      dataSourceList: []
      //        startArgs:[]
    };
  },
  mounted() {
    var self = this;
    if (this.subType === "connector-query") {
      this.opType = "query";
    } else if (this.subType === "connector-insert") {
      this.opType = "insert";
    } else if (this.subType === "connector-update") {
      this.opType = "update";
    } else if (this.subType === "connector-delete") {
      this.opType = "delete";
    } else if (this.subType === "connector-custom") {
      this.opType = "diy";
    }
    //    getConList().then((res) => {
    //      if (res.data.code == 0) {
    //        self.conList = res.data.data
    //
    //      }
    //    })
    var properties = JSON.parse(
      JSON.stringify(this.curDiagram.getProperties())
    );

    console.log(properties, "properties");
    this.showName = this.curDiagram.title;
    this.connectorItem = {
      type: properties.type || "database",
      // connection: properties.connection || 1,
      loader_type: properties.loader_type || "GET",
      // connection_op: properties.connection_op || "",
      target: properties.target || {},
      // source: properties.source || {},
      opType: this.opType,
      tableId: properties.tableId || 0,
      tableName: properties.tableName || "",
      dataSourceName: properties.dataSourceName || "",
      dbConfigId: properties.dbConfigId || '',
      dataSetName: properties.dataSetName || "",
      dataSetId: properties.dataSetId || 0,
      connection_type: properties.connection_type || "",
      title: properties.title || "",
      sourceList: properties.sourceList || [],
      setList: properties.setList || [],
      id: properties.id,
      sql: properties.sql,
      conditions: properties.conditions,
      remark: properties.remark
    };
    this.connectorItem.id = this.curDiagram.id;
    this.connectorItem.name = this.curDiagram.title;
    this.merchantId = this.$store.getters.merchantId;
    this.projectId = this.$store.getters.projectId;
    if (this.connectorItem.opType == "diy") {
      this.getDbConfigList();
      var _this = this;
      // 由于watch 了sql 变化导致sqlParamList清空，所以在这边延时回显paramList
      setTimeout(function () {
        _this.connectorItem.conditions = [];
        _this.connectorItem.conditions = properties.conditions;
      }, 1000);
    } else {
      let data = {};
      let dialogData = {
        type: "radio-button-tables",
        data: data
      };
      if (this.connectorItem.loader_type === "dataSet") {
        dialogData.type = "radio-button-dataset";
        dialogData.data = {
          id: this.connectorItem.dataSetId,
          dbConfigId: this.connectorItem.dbConfigId,
          name: this.connectorItem.dataSetName
        };
      } else if (this.connectorItem.loader_type === "table") {
        dialogData.type = "radio-button-tables";
        dialogData.data = {
          dbConfigId: this.connectorItem.dbConfigId,
          tableName: this.connectorItem.tableName
        };
      }
      if (this.connectorItem.dbConfigId) {
        this.onAddDataDialogSubmit(dialogData, false);
      }
    }
  },
  methods: {
    onAddDataDialogSubmit(data, isNewFlag) {
      delete this.connectorItem.dataSetId;
      delete this.connectorItem.dataSetName;
      delete this.connectorItem.dbConfigId;
      delete this.connectorItem.tableName;
      if (data.type === "radio-button-dataset") {
        this.connectorItem.loader_type = "dataSet";
        this.connectorItem.dataSetId = data.data.id;
        this.connectorItem.dataSetName = data.data.name;
        this.connectorItem.dbConfigId = data.data.dbConfigId;
        getDataSetListItem(data.data.id).then(res => {
          if (res.code == 0) {
            this.fieldList = res.data.params;
            this.autoFillSetList(isNewFlag);
          }
        });
      } else if (data.type === "radio-button-tables") {
        this.connectorItem.loader_type = "table";
        this.connectorItem.dbConfigId = data.data.dbConfigId;
        this.connectorItem.tableName = data.data.tableName;
        getDbTableColumnsList({
          dbConfigId: data.data.dbConfigId,
          tableName: data.data.tableName
        }).then(res => {
          if (res.code == 0) {
            this.fieldList = res.dataList;
            this.autoFillSetList(isNewFlag);
          }
        });
      }
      console.log("-------111-----", data, this.fieldList)

      // 需要吧 fieldList 存到数据装载里面
      this.addDataDialogVisible = false;

    },
    autoFillSetList(isNewFlag) {
      this.$nextTick(() => {
        // 2022-02-10 如果是新增 和 修改 需要吧所有字段都列出来
        if (this.fieldList.length > 0 && isNewFlag &&
          (this.connectorItem.opType == 'insert' ||
            this.connectorItem.opType == 'update')) {
          this.connectorItem.setList = []
          this.fieldList.forEach(fieldItem => {
            let setItem = {
              name: fieldItem.columnName,
              source: {}
            }
            this.connectorItem.setList.push(setItem);
          })
        }
      })
    },
    setVar(param, type) {
      if (type) {
        let tList = type.split("-");
        if (tList[0] == "source") {
          this.connectorItem.source = {};
          this.connectorItem.source = param;
        } else if (tList[0] == "target") {
          this.connectorItem.target = {};
          this.connectorItem.target = param;
          this.$set(this.connectorItem.target, param);
        } else if (tList[0] == "param") {
          // TODO
          this.connectorItem.sourceList[tList[1]].source = {};
          this.connectorItem.sourceList[tList[1]].source = param;
          this.$set(this.connectorItem.sourceList[tList[1]].source, param);
        } else if (tList[0] == "set") {
          this.connectorItem.setList[tList[1]].source = {};
          this.connectorItem.setList[tList[1]].source = param;
          this.$set(this.connectorItem.setList[tList[1]].source, param);
        } else if (tList[0] == "sql") {
          this.connectorItem.conditions[tList[1]].value = {};
          this.connectorItem.conditions[tList[1]].value = param;
          this.$set(this.connectorItem.conditions[tList[1]].value, param);
          this.$forceUpdate();
        } else if (tList[0] == "right") {
          this.connectorItem.conditions[tList[1]].condition.right = {};
          this.connectorItem.conditions[tList[1]].condition.right = param;
          this.$set(
            this.connectorItem.conditions[tList[1]].condition.right,
            param
          );
        } else if (tList[0] == "left") {
          this.connectorItem.conditions[tList[1]].condition.left = {};
          this.connectorItem.conditions[tList[1]].condition.left = param;
          this.$set(
            this.connectorItem.conditions[tList[1]].condition.left,
            param
          );
        }
      }
    },
    saveVarEdit(varList) {
      this.$emit("submitVarList", varList);
    },
    select(index) {
      this.editNum = index;
    },
    onSelectChange(v) {
      let self = this;

      const {connectorItem, conMap} = this;
      self.connectorItem.connection_op = "";
      self.opList = conMap[connectorItem.connection];
      //      self.opList.forEach(item => {
      //            if (item.id == v) {
      //              self.showSql = item.sql
      //            }
      //      })
    },
    addCon() {
      this.resetForm();
      this.modal1 = true;
    },
    // 点击编辑按钮触发事件
    editConnector(item, index) {
      this.modal2 = true;
      this.editConnectorData = {...this.connectorList[this.editNum]};
    },
    okEdit() {
      // this.connectorList.splice(this.editNum,1,this.editConnectorData)
      this.connectorList[this.editNum] = this.editConnectorData;
    },
    // 模态框确定按钮触发事件
    ok() {
      this.connectorList.push(this.parameterItem);
    },
    // 模态框取消按钮触发事件
    cancel() {
      // this.$Message.info('Clicked cancel');
    },
    // 属性列表删除项
    propertyDelete() {
      this.connectorList.splice(this.editNum, 1);
    },

    saveConfig() {
      let name = "connectorForm";
      var self = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          let configJson = this.connectorItem;
          configJson.title = this.showName;
          if (
            this.connectorItem.opType != "query" &&
            this.connectorItem.opType != "diy"
          ) {
            delete configJson.target;
          }
          console.log(configJson, "configJson");
          if (this.connectorItem.opType == "query") {
            let varMap = this.$store.getters.varMap;
            let varTagList = varMap.get(this.processId);
            this.handleQueryField(varTagList);
          }

          this.$emit("arguments", configJson);
        } else {
          this.$Message.error("请选择数据操作");
        }
      });
    },
    handleQueryField(varTagList) {
      varTagList.forEach(item => {
        if (item.id == this.connectorItem.id) {
          this.fieldList.forEach(field => {
            let name = field.columnName || field.name;
            let varItem = {
              defaultVal: name,
              label: name,
              name: name,
              value: name,
              parentName: this.connectorItem.name,
              row: "current",
              type: 5
            };
            let firstVarItem = {
              defaultVal: name,
              label: name,
              name: name,
              value: name,
              parentName: this.connectorItem.name,
              row: "first",
              type: 5
            };
            let lastVaritem = {
              defaultVal: name,
              label: name,
              name: name,
              value: name,
              parentName: this.connectorItem.name,
              row: "last",
              type: 5
            };
            let existFlag = false;
            let firstExistFlag = false;
            let lastExistFlag = false;
            // 需要做个是否重复的判断
            item.variables.forEach(variableItem => {
              if (
                variableItem.name == varItem.name &&
                variableItem.row == varItem.row
              ) {
                existFlag = true;
              }
              if (
                variableItem.name == firstVarItem.name &&
                variableItem.row == firstVarItem.row
              ) {
                firstExistFlag = true;
              }
              if (
                variableItem.name == lastVaritem.name &&
                variableItem.row == lastVaritem.row
              ) {
                lastExistFlag = true;
              }
            });
            if (!existFlag) {
              item.variables.push(varItem);
            }
            if (!firstExistFlag) {
              item.variables.push(firstVarItem);
            }
            if (!lastExistFlag) {
              item.variables.push(lastVaritem);
            }
          });
        }
      });
    },
    resetForm() {
      this.parameterItem = {
        property_name: "",
        data_value: "",
        relative_to_current_date_type: "",
        relative_to_current_date_delta: "",
        date_type: "",
        date_format: "",
        value_type: "SystemProperty",
        showName: ""
      };
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
    connectChange(event) {
      // if (event) {
      //   let eList = event.split("-");
      //   this.conList.forEach((item) => {
      //     if (eList[0] == "dataSet") {
      //       if (item.dsConfigId == eList[1]) {
      //         this.chosenConn = item;
      //         this.connectorItem.dataSetId = item.dsConfigId;
      //         this.connectorItem.dataSetName = item.dsConfigName;
      //         this.connectorItem.loader_type = "dataSet";
      //         // 查询数据集 字段
      //         getDataSetListItem(item.dsConfigId).then((res) => {
      //           if (res.code == 0) {
      //             this.fieldList = res.data.params;
      //           }
      //         });
      //       }
      //       // 暂时没想好怎么处理dataset 与table
      //       // else if (item.tableId == event) {
      //       //   this.chosenConn = item;
      //       // }
      //     } else if (eList[0] == "table") {
      //       if (item.tableId == eList[1]) {
      //         this.chosenConn = item;
      //         this.connectorItem.tableId = item.tableId;
      //         this.connectorItem.tableName = item.tableName;
      //         this.connectorItem.dbConfigId = item.dbConfigId;
      //         this.connectorItem.loader_type = "table";
      //         getTableFieldList(
      //           item.dbConfigId,
      //           item.tableName,
      //           item.tableId
      //         ).then((res) => {
      //           if (res.code == 0) {
      //             this.fieldList = res.data.params;
      //           }
      //         });
      //       }
      //     }
      //   });
      // }
    },
    dbConfigChange(event) {
      for (var i = 0; i < this.dataSourceList.length; i++) {
        var dataSource = this.dataSourceList[i];
        if (dataSource.id == event) {
          this.connectorItem.dataSourceName = dataSource.dataSourceName;
        }
      }
    },
    addNewRoute() {
      var sourceItem = {
        field: "",
        op: "",
        source: {}
      };
      this.connectorItem.sourceList.push(sourceItem);
    },
    addNewSet() {
      var setItem = {
        field: "",
        op: "",
        source: {}
      };
      this.connectorItem.setList.push(setItem);
    },
    delProcess(sourceIndex) {
      this.connectorItem.sourceList.splice(sourceIndex, 1);
    },
    delSet(setIndex) {
      this.connectorItem.setList.splice(setIndex, 1);
    },

    getTable() {
      getTableList(this.merchantId, this.projectId).then(res => {
        if (res.code == 0) {
          this.conList = res.dataList;
        }
      });
    },
    // 解析sql 中的{{  }}
    sqlAnalysis(val) {
      // 2020-09-23记录之前的sqlParamList 如果和现在解析的一样 直接赋值
      let tempConditionList = this.connectorItem.conditions;
      this.connectorItem.conditions = [];
      var pattern = /{(.*?)}/g;
      var conditions = [];
      var temp;
      while ((temp = pattern.exec(val))) {
        // 去除双花括弧 以及去空
        var tItem = temp[0]
          .replace(/{(.*?)}/g, "$1")
          .replace(/(^\s*)|(\s*$)/g, "");
        // 去重
        if (conditions.indexOf(tItem) < 0) {
          conditions.push(tItem);
        }
      }
      //这里的array 就是可以用的了
      for (var key in conditions) {
        var conditionItem = {
          key: conditions[key],
          name: "",
          op: "",
          value: {},
          andor: "VAR",
          more: false,
          condition: {
            left: {},
            op: "",
            right: {}
          }
        };
        for (let i = 0; i < tempConditionList.length; i++) {
          let tempCondi = tempConditionList[i];
          if (conditions[key] == tempCondi.key) {
            conditionItem = tempCondi;
          }
        }
        this.connectorItem.conditions.push(conditionItem);
      }
    },
    // 获取数据源列表
    getDbConfigList() {
      getDataSourceList(this.merchantId, this.projectId).then(res => {
        if (res.code == 0) {
          this.dataSourceList = res.dataList;
        }
      });
    },
    moreOption(condiIndex) {
      if (this.connectorItem.conditions[condiIndex].more) {
        this.connectorItem.conditions[condiIndex].more = false;
      } else {
        this.connectorItem.conditions[condiIndex].more = true;
      }
      this.$forceUpdate();
    },
    choseType(condiIndex, type) {
      this.connectorItem.conditions[condiIndex].andor = type;
      this.$forceUpdate();
    },
    changeCondition(condiItem) {
      if (
        condiItem.condition.op == "isNull" ||
        condiItem.condition.op == "isNotNull"
      ) {
        condiItem.condition.right = {
          category: "",
          name: "",
          type: 0,
          value: ""
        };
      }
    }
  },

  watch: {
    "connectorItem.sql"(val) {
      this.sqlAnalysis(val);
    }
  }
};
</script>
<style lang="less" scoped>
.connector-warp {
  /deep/ .el-input {
    width: 180px;
  }

  /deep/ .el-input--suffix {
    //width: 110px;
    width: 100%;
  }

  /deep/ .el-select {
    //width: 80px;
  }

  /deep/ .menu-item-select-middle {
    width: 90px;
  }

  .menu-item-select-middle {
    /deep/ .el-input {
      width: 100%;
    }
  }
}

.mt10 {
  margin-top: 10px;
}

ul li {
  list-style-type: none;
}

.spp-box-list {
  border: 1px solid #d6d6d6;
  /*padding: 10px;*/
  border-radius: 5px;
  margin-top: 10px;
  min-height: 100px;
}

.spp-box-list li.atrItem:hover {
  background-color: #f6f6f6;
}

.spp-box-list li {
  cursor: pointer;
  line-height: 24px;
  padding: 0 5px;
}

.activeRow {
  background: #e5e5e5;
}

.group-wrap {
  position: relative;
  height: 100%;
}

.group-btns {
  border-top: 1px solid #dadada;
  background-color: white;
  position: absolute;
  padding-left: 15px;
  bottom: 0;
  left: 0;
  width: 100%;
}

.group-content {
  /*margin-bottom: 10px;*/
  height: calc(100% - 30px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
}

.param-btns {
  margin-top: 10px;
}

.param-btns .icon {
  margin-right: 10px;
}

.group-btns .btn {
  margin-right: 15px;
}

.data-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-option-name {
  font-weight: bold;
}

.data-option-dir {
  margin-top: 5px;
}

.condition-type-div {
  display: flex;
}

.condition-type-div div {
  border: 1px solid #000;
  border-radius: 5px;
  padding: 0px 15px;
  margin-right: 15px;
  cursor: pointer;
}

.condition-list-div {
  display: flex;
  margin: 5px 0;
}

.condition-list-span {
  margin: 10px 15px 0 15px;
}

.chosen-type {
  background-color: #0862ea;
  border: 1px solid #0862ea;
  color: #fff;
}

.menu-item-wrap {
  position: relative;

  ul {
    width: 90%;
    margin: auto;
    display: flex;
    background-color: #fff;
    box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    padding: 10px;
    z-index: 1;
  }

  ul li {
    position: relative;
    list-style-type: none;
    display: flex;
  }
}

.menu-item-li {
  margin: 5px 0px 0px 0px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 5px 10px;
  z-index: 2;
  position: relative;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  height: 50px;


  .tree-item-operator {
    font-size: 28px;
    line-height: 40px;
    padding: 0px 5px;
  }
}

.tree-item-text {
  white-space: nowrap;
  font-size: 16px;
  line-height: 40px;
  padding: 0px 5px;
}

.menu-item-select {
  /deep/ .el-cascader .el-input .el-input__inner {
    height: 30px;
  }

  /deep/ .el-input--suffix .el-input__inner {
    margin-top: 5px;
    height: 30px;
  }

  /deep/ .el-input__icon {
    line-height: 30px;
  }
}

.menu-item-select-db {
  width: 180px;

  /deep/ .el-cascader .el-input .el-input__inner {
    width: 180px;
  }

  /deep/ .el-input--suffix {
    width: 180px;
  }
}

.menu-item-select-var {
  /deep/ .el-cascader .el-input .el-input__inner {
    height: 30px;
    width: 180px;
  }

  /deep/ .el-input--suffix {
    width: 180px;
  }

  /deep/ .el-input--suffix .el-input__inner {
    margin-top: 5px;
    height: 30px;
  }

  /deep/ .el-input__icon {
    line-height: 30px;
  }
}

.menu-item-select-put {
  /deep/ .el-cascader .el-input .el-input__inner {
    height: 30px;
    width: 180px;
  }

  /deep/ .el-input--suffix {
    width: 100%
  }

  /deep/ .el-input--suffix .el-input__inner {
    margin-top: 5px;
    height: 30px;
  }

  /deep/ .el-input__icon {
    line-height: 30px;
  }
}

.condition-item {
  display: inline-block;
  width: 80px;
  margin-right: 15px;

  /deep/ .el-input {
    width: 80px;
  }

  /deep/ .el-input__inner {
    width: 80px;
  }

  /deep/ .el-input--suffix .el-input__inner {
    width: 80px;
  }
}
</style>
