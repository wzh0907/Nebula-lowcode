<template>
  <!--  数据连接器  -->
  <div class="group-wrap">
    <div class="group-content">
      <p
        class="group-text"
      >数据访问用于调用数据整理访问数据库，从数据库装载数据到数据加工流程中，或者更新数据到数据库中。数据加工中的变量值将通过相同的变量名传递到数据整理中，数据整理中使用相同的变量名引用变量值，作为查询条件或设值。</p>
      <el-form
        :model="connectorItem"
        :rules="opRule"
        ref="connectorForm"
        label-width="80px"
        label-position="left"
      >
        <el-form-item prop="name" label="节点名称">
          <el-input size="small"  v-model="connectorItem.name"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="操作方法">
          <el-select v-model="connectorItem.opType" @on-change="opTypeChange">
            <el-option value="query">查询</el-option>
            <el-option value="insert">插入</el-option>
            <el-option value="update">修改</el-option>
            <el-option value="delete">删除</el-option>
            <el-option value="diy">自定义</el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="connection_op" label="数据操作" v-if="connectorItem.opType=='query'">
          <el-select v-model="connectorItem.id" filterable clearable @change="connectChange">
            <el-option
              :value="i.id"
              :label="i.dsConfigName?i.dsConfigName:i.tableName"
              v-for="i in conList"
            >
              <div v-if="i.dataType=='dataSet'">
                <div class="data-option">
                  <div class="data-option-name">{{i.dsConfigName}}</div>
                  <div>
                    {{i.dataSourceName}}
                    <span v-if="i.typeName">{{i.typeName}}</span>
                  </div>
                </div>
                <div class="data-option-dir">{{i.directoryName}}</div>
              </div>
              <div v-else>
                <div class="data-option">
                  <div class="data-option-name">{{i.tableName}}</div>
                  <div>{{i.dbConfigName}}</div>
                </div>
                <div class="data-option-dir">{{i.remarks}}</div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="table_name"
          label="表名"
          v-if="connectorItem.opType=='insert'||connectorItem.opType=='update'||connectorItem.opType=='delete'"
        >
          <el-select v-model="connectorItem.id" filterable clearable @change="connectChange">
            <el-option :value="'table-'+i.tableId" :label="i.tableName" v-for="i in conList">
              <!-- <div v-if="i.dataType=='dataSet'"> -->
              <div class="data-option">
                <div class="data-option-name">{{i.tableName}}</div>
                <div>{{i.dbConfigName}}</div>
              </div>
              <div class="data-option-dir">{{i.remarks}}</div>
              <!-- </div>
              <div v-else>
                <div class="data-option">
                  <div class="data-option-name">{{i.tableName}}</div>
                  <div>{{i.dbConfigName}}</div>
                </div>
                <div class="data-option-dir">{{i.remarks}}</div>
              </div>-->
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="connection_dbConfigId" label="选择数据源" v-if="connectorItem.opType=='diy'">
          <el-select v-model="connectorItem.dbConfigId" filterable clearable  @on-change="dbConfigChange">
            <el-option
              :value="dataSourceItem.id"
              :label="dataSourceItem.dataSourceName"
              v-for="dataSourceItem in dataSourceList"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <FormItem label="输入参数">
          <VarSelect
            key="connector-source"
            :data="connectorItem.source"
            type="source"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </FormItem>-->
        <el-form-item label="输出赋值" v-if="connectorItem.opType=='query'||connectorItem.opType=='diy'">
          <VarSelect
            key="connector-target"
            :data="connectorItem.target"
            type="target"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </el-form-item>
        <!--<FormItem label="SQL">-->
        <!--<p >{{showSql}}</p>-->
        <!--</FormItem>-->
        <!-- <FormItem label="连接器">-->
        <!--<el-select v-model="connectorItem.connection">-->
        <!--<el-option :value="item.id" v-for="item in conList">{{item.name}}</el-option>-->
        <!--</el-select>-->
        <!--</FormItem>
        <!--<FormItem label="加载类型">-->
        <!--<el-select v-model="connectorItem.loader_type">-->
        <!--<el-option value="GET">GET</el-option>-->
        <!--&lt;!&ndash; <el-option value="SEND">SEND</el-option> &ndash;&gt;-->
        <!--</el-select>-->
        <!--</FormItem>-->
        <!--<FormItem label="SQL">-->
        <!--<Input v-model="connectorItem.sql" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>-->
        <!--</FormItem>-->
      </el-form>
      <h3
        class="route-title2"
        v-if="connectorItem.opType=='insert'||connectorItem.opType=='update'"
      >列赋值</h3>
      <el-row v-if="connectorItem.opType=='insert'||connectorItem.opType=='update'">
        <el-collapse v-model="cVal">
          <el-collapse-item :title="setItem.field" :name="'set'+setIndex" v-for="(setItem,setIndex) in connectorItem.setList">
            <div>
              <el-form label-width="50px" class="routeBy-form" label-position="left">
                <el-form-item label="字段">
                  <el-select v-model="setItem.name">
                    <el-option :value="field.name" :label="field.name" v-for="field in fieldList"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="值">
                  <!-- 这里取变量 -->
                  <VarSelect
                    :key="'connector-set-' + setIndex"
                    :data="setItem.source"
                    :type="'set-'+ setIndex"
                    @setVar="setVar"
                    @submitVarList="saveVarEdit"
                  />
                </el-form-item>
              </el-form>
              <div class="opt-btn">
                <div @click="delSet(setIndex)">X删除</div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div @click="addNewSet" class="opt-add-btn">添加赋值</div>
      </el-row>
      <h3
        class="route-title2"
        v-if="connectorItem.opType=='query'||connectorItem.opType=='update'||connectorItem.opType=='delete'"
      >条件配置</h3>
      <el-row
        v-if="connectorItem.opType=='query'||connectorItem.opType=='update'||connectorItem.opType=='delete'"
      >
        <el-collapse v-model="wVal">
          <el-collapse-item
            :title="sourceItem.field"
            :name="'source'+sourceIndex"
            v-for="(sourceItem,sourceIndex) in connectorItem.sourceList"
          >
            <div>
              <el-form label-width="50px" class="routeBy-form" label-position="left">
                <el-form-item label="字段">
                  <el-select v-model="sourceItem.field">
                    <el-option
                      :value="field.displayName?field.displayName:field.name"
                      :label="field.displayName?field.displayName:field.name"
                      v-for="field in fieldList"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="运算符">
                  <el-select v-model="sourceItem.op">
                    <el-option value="===">=</el-option>
                    <el-option value=">">&gt;</el-option>
                    <el-option value="<">&lt;</el-option>
                    <el-option value=">=">&ge;</el-option>
                    <el-option value="<=">&le;</el-option>
                    <el-option value="<>">!=</el-option>
                    <el-option value="include">包含</el-option>
                    <el-option value="startWith">前包含</el-option>
                    <el-option value="endWith">后包含</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="值">
                  <!-- 这里取变量 -->
                  <VarSelect
                    :key="'connector-param-' + sourceIndex"
                    :data="sourceItem.source"
                    :type="'param-'+ sourceIndex"
                    @setVar="setVar"
                    @submitVarList="saveVarEdit"
                  />
                </el-form-item>
              </el-form>
              <div class="opt-btn">
                <div @click="delProcess(sourceIndex)">X删除</div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div @click="addNewRoute" class="opt-add-btn">添加条件</div>
      </el-row>
      <h3 v-if="connectorItem.opType=='diy'">SQL脚本</h3>
      <el-row v-if="connectorItem.opType=='diy'">
        <CodeEditor
          v-model="connectorItem.sql"
          width="100%"
          :height="editorHeight"
          mode="sql"
          :editorOptions="editorOptions"
        />
      </el-row>
      <h3 class="route-title2" v-if="connectorItem.opType=='diy'">变量</h3>
      <el-row v-if="connectorItem.opType=='diy'">
        <el-collapse v-model="sVal">
          <el-collapse-item
            :title="paramItem.name"
            :name="'sql'+paramIndex"
            v-for="(paramItem,paramIndex) in connectorItem.sqlParamList"
          >
            <div>
              <el-form label-width="50px" class="routeBy-form" label-position="left">
                <el-form-item :label="paramItem.name">
                  <VarSelect
                    :key="'connector-sql-' + paramIndex"
                    :data="paramItem.source"
                    :type="'sql-'+ paramIndex"
                    @setVar="setVar"
                    @submitVarList="saveVarEdit"
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <!--<Row :gutter="16">
      <el-col span="24">
        <h4>参数</h4>
        <Row class="param-btns">
          <Icon class="icon" type="ios-add-circle" :size="20" @click="addCon" />
          <Icon class="icon" type="md-create" :size="20"  @click="editConnector" />
          <Icon class="icon" type="ios-close-circle" :size="20"  @click="propertyDelete" />
        </Row>
        <div class="spp-box-list" >
          <ul>
            <li v-for="(item,index) in connectorList" @click="select(index)" :class="{activeRow: index==editNum,atrItem:index!=editNum}">
              <span>{{ item.value_type }}</span>
              <span v-if="item.value_type == 'DateTime'">{{ item.date_format }}</span>
              <span v-if="item.value_type == 'DateTime'">-{{ item.date_type }}</span>
              <span v-if="item.value_type == 'DateTime'">-{{ item.relative_to_current_date_delta }}</span>
              <span v-if="item.value_type == 'DateTime'">-{{ item.relative_to_current_date_type }}</span>
              <span v-if="item.value_type == 'Static'">{{ item.data_value }}</span>
              <span v-if="item.value_type == 'DocumentProperty' || item.value_type == 'SystemProperty'"> {{ item.property_name }}</span>

              &lt;!&ndash;<span  style="margin-left:10px;">&ndash;&gt;
                &lt;!&ndash;<Icon type="md-create" :size="14" style="color:blue;" @click="editConnector(item,index)" />&ndash;&gt;
              &lt;!&ndash;</span>&ndash;&gt;
              &lt;!&ndash;<span style="margin-left:5px;">&ndash;&gt;
                &lt;!&ndash;<Icon type="ios-close-circle" :size="14" style="color:red;" @click="propertyDelete(index)" />&ndash;&gt;
              &lt;!&ndash;</span>&ndash;&gt;
            </li>
          </ul>
        </div>
      </el-col>
      </Row>-->
      <h3>备注</h3>
      <el-input v-model="connectorItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 15}" placeholder="Enter something..." />
      
    </div>
    <!--  编辑弹框  -->
    <el-dialog v-model="modal2" title="取值" @on-ok="okEdit" @on-cancel="cancel">
      <el-form :model="editConnectorData" label-width="80px">
        <el-form-item label="变量类型">
          <el-select v-model="editConnectorData.value_type">
            <el-option :value="key" v-for="(value, key, index) in valueMap">{{value}}</el-option>
          </el-select>
        </el-form-item>
        <template v-if="editConnectorData.value_type == 'DateTime'">
          <el-form-item label="时间格式">
            <!--<Input v-model="editConnectorData.date_format" placeholder="请输入..."></Input>-->
            <el-select v-model="editConnectorData.date_format">
              <el-option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</el-option>

              <el-option value="MMddyyyy">MMddyyyy</el-option>
              <el-option value="MM/dd/yyyy">MM/dd/yyyy</el-option>
              <el-option value="MM-dd-yyyy">MM-dd-yyyy</el-option>
              <el-option value="MMddyy">MMddyy</el-option>
              <el-option value="yyyyMMdd HHmmss">yyyyMMdd HHmmss</el-option>
              <el-option value="yyyyMMdd HHmmss.SSS">yyyyMMdd HHmmss.SSS</el-option>
              <el-option value="yyyy-MM-dd">yyyy-MM-dd</el-option>
              <el-option value="yyyy-MM-dd'T'HH:mm:ss">yyyy-MM-dd'T'HH:mm:ss</el-option>
              <el-option value="yyyy-MM-dd'T'HH:mm:ssZ">yyyy-MM-dd'T'HH:mm:ssZ</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间类型">
            <el-select v-model="editConnectorData.date_type">
              <el-option value="CurrentDate">当前日期/时间</el-option>
              <el-option value="RelativeDate">相对日期/时间</el-option>
            </el-select>
          </el-form-item>
          <template v-if="editConnectorData.date_type == 'RelativeDate'">
            <el-form-item label="偏移值">
              <el-input
                v-model="editConnectorData.relative_to_current_date_delta"
                placeholder="请输入..."
              ></el-input>
            </el-form-item>
            <el-form-item label="偏移类型">
              <el-select v-model="editConnectorData.relative_to_current_date_type">
                <el-option value="Second(s)">秒</el-option>
                <el-option value="Minute(s)">分</el-option>
                <el-option value="Hour(s)">时</el-option>
                <el-option value="Day(s)">天</el-option>
                <el-option value="Week(s)">周</el-option>
                <el-option value="Month(s)">月</el-option>
                <el-option value="Year(s)">年</el-option>
              </el-select>
            </el-form-item>
          </template>
        </template>
        <template v-if="editConnectorData.value_type == 'Static'">
          <el-form-item label="值">
            <el-input v-model="editConnectorData.data_value" placeholder="请输入..."></el-input>
          </el-form-item>
        </template>
        <template v-if="editConnectorData.value_type == 'DocumentProperty'">
          <!--          <FormItem label="属性类型">-->
          <!--            <el-select v-model="editConnectorData.property_name.type">-->
          <!--              <el-option value="DocumentProperty">数据集/文档属性</el-option>-->
          <!--              <el-option value="SystemProperty">系统变量</el-option>-->
          <!--            </el-select>-->
          <!--          </FormItem>-->
          <el-form-item label="属性名称">
            <el-input v-model="editConnectorData.property_name" placeholder="请输入..."></el-input>
          </el-form-item>
        </template>
        <template v-if="editConnectorData.value_type == 'SystemProperty'">
          <!--          <FormItem label="属性类型">-->
          <!--            <el-select v-model="editConnectorData.property_name.type">-->
          <!--              <el-option value="DocumentProperty">数据集/文档属性</el-option>-->
          <!--              <el-option value="SystemProperty">系统变量</el-option>-->
          <!--            </el-select>-->
          <!--          </FormItem>-->
          <el-form-item label="属性名称">
            <el-input v-model="editConnectorData.property_name" placeholder="请输入..."></el-input>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>

    <!--  添加弹框  -->
    <el-dialog v-model="modal1" title="取值" @on-ok="ok" @on-cancel="cancel">
      <el-form :model="parameterItem" label-width="80px">
        <el-form-item label="变量类型">
          <el-select v-model="parameterItem.value_type">
            <el-option :value="key" v-for="(value, key, index) in valueMap">{{value}}</el-option>
          </el-select>
        </el-form-item>
        <template v-if="parameterItem.value_type == 'DateTime'">
          <el-form-item label="时间格式">
            <!--<Input v-model="parameterItem.date_format" placeholder="请输入..."></Input>-->
            <el-select v-model="parameterItem.date_format">
              <el-option value="MMddyyyy">MMddyyyy</el-option>
              <el-option value="MM/dd/yyyy">MM/dd/yyyy</el-option>
              <el-option value="MM-dd-yyyy">MM-dd-yyyy</el-option>
              <el-option value="MMddyy">MMddyy</el-option>
              <el-option value="yyyyMMdd HHmmss">yyyyMMdd HHmmss</el-option>
              <el-option value="yyyyMMdd HHmmss.SSS">yyyyMMdd HHmmss.SSS</el-option>
              <el-option value="yyyy-MM-dd">yyyy-MM-dd</el-option>
              <el-option value="yyyy-MM-dd'T'HH:mm:ss">yyyy-MM-dd'T'HH:mm:ss</el-option>
              <el-option value="yyyy-MM-dd'T'HH:mm:ssZ">yyyy-MM-dd'T'HH:mm:ssZ</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间类型">
            <el-select v-model="parameterItem.date_type">
              <el-option value="CurrentDate">当前日期/时间</el-option>
              <el-option value="RelativeDate">相对日期/时间</el-option>
            </el-select>
          </el-form-item>
          <template v-if="parameterItem.date_type == 'RelativeDate'">
            <el-form-item label="偏移值">
              <el-input v-model="parameterItem.relative_to_current_date_delta" placeholder="请输入..."></el-input>
            </el-form-item>
            <el-form-item label="偏移类型">
              <el-select v-model="parameterItem.relative_to_current_date_type">
                <el-option value="Second(s)">秒</el-option>
                <el-option value="Minute(s)">分</el-option>
                <el-option value="Hour(s)">时</el-option>
                <el-option value="Day(s)">天</el-option>
                <el-option value="Week(s)">周</el-option>
                <el-option value="Month(s)">月</el-option>
                <el-option value="Year(s)">年</el-option>
              </el-select>
            </el-form-item>
          </template>
        </template>
        <template v-if="parameterItem.value_type == 'Static'">
          <el-form-item label="值">
            <el-input v-model="parameterItem.data_value" placeholder="请输入..."></el-input>
          </el-form-item>
        </template>
        <template v-if="parameterItem.value_type == 'DocumentProperty'">
          <!--          <FormItem label="属性类型">-->
          <!--            <el-select v-model="parameterItem.property_name.type">-->
          <!--              <el-option value="DocumentProperty">数据集/文档属性</el-option>-->
          <!--              <el-option value="SystemProperty">系统变量</el-option>-->
          <!--            </el-select>-->
          <!--          </FormItem>-->
          <el-form-item label="属性名称">
            <el-input v-model="parameterItem.property_name" placeholder="请输入..."></el-input>
          </el-form-item>
        </template>
        <template v-if="parameterItem.value_type == 'SystemProperty'">
          <!--          <FormItem label="属性类型">-->
          <!--            <el-select v-model="parameterItem.property_name.type">-->
          <!--              <el-option value="DocumentProperty">数据集/文档属性</el-option>-->
          <!--              <el-option value="SystemProperty">系统变量</el-option>-->
          <!--            </el-select>-->
          <!--          </FormItem>-->
          <el-form-item label="属性名称">
            <el-input v-model="parameterItem.property_name" placeholder="请输入..."></el-input>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
    <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem">删除</el-button>
        <el-button class="btn btns-save" type="primary" @click="saveConfig('connectorForm')">保存</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import VarSelect from "./module/variable-select";
import CodeEditor from '@/components/CodeEditor'
import {
  getDataSetListItem,
  getTableList,
  getTableFieldList,
  getDataSourceList,
} from "@/api/report";
import { mapActions } from "vuex";
// import { getVariableList } from "@/api/variable";
export default {
  name: "drag-drawer-connector",
  components: {
    VarSelect,
    CodeEditor,
  },
  props: {
    curDiagram: {
      type: Object,
    },
    processId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showName: "",      
      showSql: "",
      connectorItem: {
        name: "",
        remark:"",
        type: "database",
        opType: "",
        //        loader_type: 'GET',
        connection_op: "",
        source: {},
        sourceList: [],
        sqlParamList: [],
        target: {},
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
        showName: "",
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
        Arguments: "输入参数",
      },
      opRule: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        // connection: [
        //   { required: true, message: "请选择数据连接", trigger: "change" },
        // ],
        // connection_op: [
        //   { required: true, message: "请选择数据操作", trigger: "change" },
        // ],
      },
      target: {
        category: "",
        name: "",
      },
      variableList: [],
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
        showGutter: false,
      },
      dataSourceList: [],
      //        startArgs:[]
    };
  },
  mounted() {
    var self = this;

    //    getConList().then((res) => {
    //      if (res.data.code == 0) {
    //        self.conList = res.data.data
    //
    //      }
    //    })
    var properties = JSON.parse(JSON.stringify(this.curDiagram.getProperties()));
    console.log(properties, "properties");
    this.connectorItem = {
      type: properties.type || "database",
      // connection: properties.connection || 1,
      loader_type: properties.loader_type || "GET",
      // connection_op: properties.connection_op || "",
      target: properties.target || {},
      // source: properties.source || {},
      opType: properties.opType || "query",
      tableId: properties.tableId || 0,
      tableName: properties.tableName || "",
      dataSourceName:properties.dataSourceName || "",
      dbConfigId: properties.dbConfigId || 0,
      dataSetName: properties.dataSetName || "",
      dataSetId: properties.dataSetId || 0,
      connection_type: properties.connection_type || "",
      title: properties.title || "",
      sourceList: properties.sourceList || [],
      setList: properties.setList || [],
      id: properties.id,
      sql: properties.sql,
      sqlParamList: properties.sqlParamList,
      remark:properties.remark,
    };

    this.connectorItem.name = this.curDiagram.title;
    console.log(this.connectorItem, "this.connectorItem");
    this.merchantId = this.$store.getters.merchantId;
    this.projectId = this.$store.getters.projectId;
    if (
      this.connectorItem.opType == "insert" ||
      this.connectorItem.opType == "update" ||
      this.connectorItem.opType == "delete"
    ) {
      getTableList(this.merchantId, this.projectId).then((res) => {
        if (res.code == 0) {
          this.conList = res.dataList;
          this.connectChange(properties.id);
        }
      });
    } else if (this.connectorItem.opType == "diy") {
      this.getDbConfigList();
      var _this = this;
      // 由于watch 了sql 变化导致sqlParamList清空，所以在这边延时回显paramList
      setTimeout(function () {
        _this.connectorItem.sqlParamList = [];
        _this.connectorItem.sqlParamList = properties.sqlParamList;
      }, 1000);
    } else {
      
    }

    this.variableList = this.$store.getters.varTagList;
    this.varMap = this.$store.getters.varMap;

    // getVariableList(this.processId, 1, 999).then(res => {
    //   if (res.data.code == 0) {
    //     this.variableList = res.data.data;
    //     this.varMap = new Map();
    //     this.variableList.forEach(item => {
    //       this.varMap.set(item.name, JSON.parse(item.variables));
    //     });
    //   }
    // });
    //      this.startArgs = this.flow.getArgs()
  },
  methods: {
    // ...mapActions(["getVariableList"]),
    setVar(param, type) {
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
        this.connectorItem.sqlParamList[tList[1]].source = {};
        this.connectorItem.sqlParamList[tList[1]].source = param;
        this.$set(this.connectorItem.sqlParamList[tList[1]].source, param);
        this.$forceUpdate();
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

      const { connectorItem, conMap } = this;
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
      this.editConnectorData = { ...this.connectorList[this.editNum] };
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

    saveConfig(name) {
      var self = this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          let configJson = this.connectorItem;
          configJson.title = this.connectorItem.name;
          if (
            this.connectorItem.opType != "query" &&
            this.connectorItem.opType != "diy"
          ) {
            delete configJson.target;
          }
          console.log(configJson, "configJson");

          this.$emit("arguments", configJson);
        } else {
          this.$Message.error("请选择数据操作");
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
        showName: "",
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
      if(event){
      let eList = event.split("-");
      this.conList.forEach((item) => {
        if (eList[0] == "dataSet") {
          if (item.dsConfigId == eList[1]) {
            this.chosenConn = item;
            this.connectorItem.dataSetId = item.dsConfigId;
            this.connectorItem.dataSetName = item.dsConfigName;
            this.connectorItem.loader_type = "dataSet";
            // 查询数据集 字段
            getDataSetListItem(
              item.dsConfigId,
              this.merchantId,
              this.projectId
            ).then((res) => {
              if (res.code == 0) {
                this.fieldList = res.data.params;
              }
            });
          }
          // 暂时没想好怎么处理dataset 与table
          // else if (item.tableId == event) {
          //   this.chosenConn = item;
          // }
        } else if (eList[0] == "table") {
          if (item.tableId == eList[1]) {
            this.chosenConn = item;
            this.connectorItem.tableId = item.tableId;
            this.connectorItem.tableName = item.tableName;
            this.connectorItem.dbConfigId = item.dbConfigId;
            this.connectorItem.loader_type = "table";
            getTableFieldList(
              item.dbConfigId,
              item.tableName,
              item.tableId,
              this.merchantId,
              this.projectId
            ).then((res) => {
              if (res.code == 0) {
                this.fieldList = res.data.params;
              }
            });
          }
        }
      });
      }
      
    },
    dbConfigChange(event){
      for(var i=0;i<this.dataSourceList.length;i++){
        var dataSource = this.dataSourceList[i];
        if(dataSource.id==event){
          this.connectorItem.dataSourceName=dataSource.dataSourceName;
        }
      }
    },
    addNewRoute() {
      var sourceItem = {
        field: "",
        op: "",
        source: {},
      };
      this.connectorItem.sourceList.push(sourceItem);
    },
    addNewSet() {
      var setItem = {
        field: "",
        op: "",
        source: {},
      };
      this.connectorItem.setList.push(setItem);
    },
    delProcess(sourceIndex) {
      this.connectorItem.sourceList.splice(sourceIndex, 1);
    },
    delSet(setIndex) {
      this.connectorItem.setList.splice(setIndex, 1);
    },
    opTypeChange(val) {
      this.conList = [];
      this.connectorItem.sourceList = [];
      this.connectorItem.setList = [];
      if (val == "insert" || val == "update" || val == "delete") {
        this.getTable();
      } else if (val == "query") {
        
      } else if (val == "diy") {
        this.getDbConfigList();
      }
    },
    getTable() {
      getTableList(this.merchantId, this.projectId).then((res) => {
        if (res.code == 0) {
          this.conList = res.dataList;
        }
      });
    },
    // 解析sql 中的{{  }}
    sqlAnalysis(val) {
      // 2020-09-23记录之前的sqlParamList 如果和现在解析的一样 直接赋值
      let tempParamList = this.connectorItem.sqlParamList;
      this.connectorItem.sqlParamList = [];
      var pattern = /{{(.*?)}}/g;
      var sqlParamList = [];
      var temp;
      while ((temp = pattern.exec(val))) {
        // 去除双花括弧 以及去空
        var tItem = temp[0]
          .replace(/{{(.*?)}}/g, "$1")
          .replace(/(^\s*)|(\s*$)/g, "");
        // 去重
        if (sqlParamList.indexOf(tItem) < 0) {
          sqlParamList.push(tItem);
        }
      }
      //这里的array 就是可以用的了
      for (var key in sqlParamList) {
        var sqlParamItem = {
          name: sqlParamList[key],
          source: {},
        };
        for(let i=0;i<tempParamList.length;i++){
          let tempParam = tempParamList[i];
          if(sqlParamList[key]==tempParam.name){
            sqlParamItem.source=tempParam.source
          }
        }
        this.connectorItem.sqlParamList.push(sqlParamItem);
      }
    },
    // 获取数据源列表
    getDbConfigList() {
      getDataSourceList(this.merchantId, this.projectId).then((res) => {
        if (res.code == 0) {
          this.dataSourceList = res.dataList;
        }
      });
    },
    // searchOption(query) {
    //   var self = this;
    //   console.log(query, "searchOption");
    //   let merchantId = this.$store.getters.merchantId;
    //   let projectId = this.$store.getters.projectId;
    //   let params = {
    //     name: query,
    //   };
    //   getOpList(params, merchantId, projectId).then((res) => {
    //     if (res.data.code == 0) {
    //       self.conList = res.data.dataList;
    //       // self.opList = res.data.dataList[2].operationList;
    //       for (var i in self.conList) {
    //         self.conMap[self.conList[i].id] = self.conList[i].operationList;
    //         if (self.conList[i]) {
    //           if (self.conList[i].type == "query") {
    //             self.conList[i].typeName = "【查询】";
    //           } else if (self.conList[i].type == "create") {
    //             self.conList[i].typeName = "【创建】";
    //           } else if (self.conList[i].type == "update") {
    //             self.conList[i].typeName = "【更新】";
    //           } else if (self.conList[i].type == "delete") {
    //             self.conList[i].typeName = "【删除】";
    //           }
    //         }
    //         if (this.connectorItem.connection == self.conList[i].id) {
    //           self.opList = res.data.dataList[i].operationList;
    //         }
    //       }
    //       //        self.onSelectChange(self.connectorItem.connection_op)
    //       // console.log(properties,"properties");
    //       // this.connectChange(properties.connection_op);
    //     }
    //   });
    // },
  },

  watch: {
    "connectorItem.sql"(val) {
      this.sqlAnalysis(val);
    },
  },
};
</script>

<style scoped>
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
</style>
