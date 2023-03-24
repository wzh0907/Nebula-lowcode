<template>
  <!--  数据连接器  -->
  <div class="group-wrap">
    <div class="group-content">
      <p
        class="group-text"
      >数据访问用于调用数据整理访问数据库，从数据库装载数据到数据加工流程中，或者更新数据到数据库中。数据加工中的变量值将通过相同的变量名传递到数据整理中，数据整理中使用相同的变量名引用变量值，作为查询条件或设值。</p>
      <i-form
        :model="connectorItem"
        :rules="opRule"
        ref="connectorForm"
        :label-width="80"
        label-position="left"
      >
        <Form-item prop="name" label="节点名称">
          <i-input v-model="connectorItem.name"></i-input>
        </Form-item>
        <!-- <Form-item prop="connection" label="数据连接">
          <i-select v-model="connectorItem.connection" filterable @on-change="onSelectChange">
            <i-option :value="i.id+''" v-for="i in conList">{{i.name}}</i-option>
          </i-select>
        </Form-item>
        <Form-item prop="connection_op" label="数据操作">
          <i-select v-model="connectorItem.connection_op" filterable>
            <i-option :value="i.id+''" v-for="i in opList">{{i.name}}</i-option>
          </i-select>
        </Form-item>-->
        <Form-item prop="connection_op" label="数据操作">
          <i-select
            v-model="connectorItem.connection_op"
            filterable
            clearable
            @on-change="connectChange"
          >
            <i-option :value="i.dsConfigId+''" :label="i.dsConfigName" v-for="i in conList">
              <div class="data-option">
                <div class="data-option-name">{{i.dsConfigName}}</div>
                <div>
                  {{i.dataSourceName}}
                  <span v-if="i.typeName">{{i.typeName}}</span>
                </div>
              </div>
              <div class="data-option-dir">{{i.directoryName}}</div>
            </i-option>
          </i-select>
        </Form-item>
        <FormItem label="输入参数">
          <!-- <div class="form-input">
            <el-select v-model="connectorItem.source.category" class="var-select">
              <el-option :value="variable.name" v-for="variable in variableList">{{variable.name}}</el-option>
            </el-select>
            <el-select
              v-model="connectorItem.source.name"
              class="var-select"
              clearable
              v-if="connectorItem.source.category&&varMap"
            >
              <el-option
                :value="variable.name"
                v-for="variable in varMap.get(connectorItem.source.category)"
              >{{variable.name}}</el-option>
            </el-select>
          </div>-->
          <VarSelect
            key="connector-source"
            :data="connectorItem.source"
            type="source"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </FormItem>
        <FormItem label="输出赋值" v-if="chosenConn.type=='query'">
          <!-- <div class="form-input">
            <el-select v-model="connectorItem.target.category" class="var-select">
              <el-option :value="variable.name" v-for="variable in variableList">{{variable.name}}</el-option>
            </el-select>
            <el-select
              v-model="connectorItem.target.name"
              class="var-select"
              clearable
              v-if="connectorItem.target.category&&varMap"
            >
              <el-option
                :value="variable.name"
                v-for="variable in varMap.get(connectorItem.target.category)"
              >{{variable.name}}</el-option>
            </el-select>
          </div>-->
          <VarSelect
            key="connector-target"
            :data="connectorItem.target"
            type="target"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </FormItem>
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
      </i-form>

      <!--<Row :gutter="16">
      <i-col span="24">
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
      </i-col>
      </Row>-->
    </div>
    <!--  编辑弹框  -->
    <el-dialog v-model="modal2" title="取值" @on-ok="okEdit" @on-cancel="cancel">
      <Form :model="editConnectorData" :label-width="80">
        <FormItem label="变量类型">
          <el-select v-model="editConnectorData.value_type">
            <el-option :value="key" v-for="(value, key, index) in valueMap">{{value}}</el-option>
          </el-select>
        </FormItem>
        <template v-if="editConnectorData.value_type == 'DateTime'">
          <FormItem label="时间格式">
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
          </FormItem>
          <FormItem label="时间类型">
            <el-select v-model="editConnectorData.date_type">
              <el-option value="CurrentDate">当前日期/时间</el-option>
              <el-option value="RelativeDate">相对日期/时间</el-option>
            </el-select>
          </FormItem>
          <template v-if="editConnectorData.date_type == 'RelativeDate'">
            <FormItem label="偏移值">
              <Input
                v-model="editConnectorData.relative_to_current_date_delta"
                placeholder="请输入..."
              ></Input>
            </FormItem>
            <FormItem label="偏移类型">
              <el-select v-model="editConnectorData.relative_to_current_date_type">
                <el-option value="Second(s)">秒</el-option>
                <el-option value="Minute(s)">分</el-option>
                <el-option value="Hour(s)">时</el-option>
                <el-option value="Day(s)">天</el-option>
                <el-option value="Week(s)">周</el-option>
                <el-option value="Month(s)">月</el-option>
                <el-option value="Year(s)">年</el-option>
              </el-select>
            </FormItem>
          </template>
        </template>
        <template v-if="editConnectorData.value_type == 'Static'">
          <FormItem label="值">
            <Input v-model="editConnectorData.data_value" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="editConnectorData.value_type == 'DocumentProperty'">
          <!--          <FormItem label="属性类型">-->
          <!--            <el-select v-model="editConnectorData.property_name.type">-->
          <!--              <el-option value="DocumentProperty">数据集/文档属性</el-option>-->
          <!--              <el-option value="SystemProperty">系统变量</el-option>-->
          <!--            </el-select>-->
          <!--          </FormItem>-->
          <FormItem label="属性名称">
            <Input v-model="editConnectorData.property_name" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="editConnectorData.value_type == 'SystemProperty'">
          <!--          <FormItem label="属性类型">-->
          <!--            <el-select v-model="editConnectorData.property_name.type">-->
          <!--              <el-option value="DocumentProperty">数据集/文档属性</el-option>-->
          <!--              <el-option value="SystemProperty">系统变量</el-option>-->
          <!--            </el-select>-->
          <!--          </FormItem>-->
          <FormItem label="属性名称">
            <Input v-model="editConnectorData.property_name" placeholder="请输入..."></Input>
          </FormItem>
        </template>
      </Form>
    </el-dialog>

    <!--  添加弹框  -->
    <el-dialog v-model="modal1" title="取值" @on-ok="ok" @on-cancel="cancel">
      <Form :model="parameterItem" :label-width="80">
        <FormItem label="变量类型">
          <el-select v-model="parameterItem.value_type">
            <el-option :value="key" v-for="(value, key, index) in valueMap">{{value}}</el-option>
          </el-select>
        </FormItem>
        <template v-if="parameterItem.value_type == 'DateTime'">
          <FormItem label="时间格式">
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
          </FormItem>
          <FormItem label="时间类型">
            <el-select v-model="parameterItem.date_type">
              <el-option value="CurrentDate">当前日期/时间</el-option>
              <el-option value="RelativeDate">相对日期/时间</el-option>
            </el-select>
          </FormItem>
          <template v-if="parameterItem.date_type == 'RelativeDate'">
            <FormItem label="偏移值">
              <Input v-model="parameterItem.relative_to_current_date_delta" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="偏移类型">
              <el-select v-model="parameterItem.relative_to_current_date_type">
                <el-option value="Second(s)">秒</el-option>
                <el-option value="Minute(s)">分</el-option>
                <el-option value="Hour(s)">时</el-option>
                <el-option value="Day(s)">天</el-option>
                <el-option value="Week(s)">周</el-option>
                <el-option value="Month(s)">月</el-option>
                <el-option value="Year(s)">年</el-option>
              </el-select>
            </FormItem>
          </template>
        </template>
        <template v-if="parameterItem.value_type == 'Static'">
          <FormItem label="值">
            <Input v-model="parameterItem.data_value" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="parameterItem.value_type == 'DocumentProperty'">
          <!--          <FormItem label="属性类型">-->
          <!--            <el-select v-model="parameterItem.property_name.type">-->
          <!--              <el-option value="DocumentProperty">数据集/文档属性</el-option>-->
          <!--              <el-option value="SystemProperty">系统变量</el-option>-->
          <!--            </el-select>-->
          <!--          </FormItem>-->
          <FormItem label="属性名称">
            <Input v-model="parameterItem.property_name" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="parameterItem.value_type == 'SystemProperty'">
          <!--          <FormItem label="属性类型">-->
          <!--            <el-select v-model="parameterItem.property_name.type">-->
          <!--              <el-option value="DocumentProperty">数据集/文档属性</el-option>-->
          <!--              <el-option value="SystemProperty">系统变量</el-option>-->
          <!--            </el-select>-->
          <!--          </FormItem>-->
          <FormItem label="属性名称">
            <Input v-model="parameterItem.property_name" placeholder="请输入..."></Input>
          </FormItem>
        </template>
      </Form>
    </el-dialog>
    <div class="group-btns">
      <Row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem">删除</el-button>
        <el-button class="btn btns-save" type="primary" @click="saveConfig('connectorForm')">保存</el-button>
      </Row>
    </div>
  </div>
</template>

<script>
import VarSelect from "./module/variable-select";
import { mapActions } from "vuex";
// import { getVariableList } from "@/api/variable";
export default {
  name: "drag-drawer-connectorV1",
  components: {
    VarSelect,
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
        type: "database",
        connection: "",
        //        loader_type: 'GET',
        connection_op: "",
        source: {},
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
        connection: [
          { required: true, message: "请选择数据连接", trigger: "change" },
        ],
        connection_op: [
          { required: true, message: "请选择数据操作", trigger: "change" },
        ],
      },
      target: {
        category: "",
        name: "",
      },
      variableList: [],
      varMap: null,
      chosenConn: {},
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
    var properties = this.curDiagram.getProperties();
    console.log(properties, "properties");
    this.connectorItem = {
      type: properties.type || "database",
      connection: properties.connection || 1,
      loader_type: properties.loader_type || "GET",
      connection_op: properties.connection_op || "",
      target: properties.target || {},
      source: properties.source || {},
    };

    this.connectorItem.name = this.curDiagram.title;
    console.log(this.connectorItem, "this.connectorItem");
    let merchantId = this.$store.getters.merchantId;
    let projectId = this.$store.getters.projectId;
    
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
      if (type == "source") {
        this.connectorItem.source = {};
        this.connectorItem.source = param;
      } else {
        this.connectorItem.target = {};
        this.connectorItem.target = param;
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
      console.log(this.parameterItem);
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
          //          self.opList.forEach(item => {
          //            if (item.id == self.connectorItem.connection_op) {
          //              self.connectorItem.loader_type = item.op_type
          //              self.connectorItem.connection = item.connection_id
          //            }
          //          })
          let configJson = this.connectorItem;
          configJson.title = this.connectorItem.name;
          console.log(this.chosenConn);
          if (this.chosenConn.type != "query") {
            delete configJson.target;
          }
          console.log(configJson, "configJson");
          //          configJson.parameters = this.connectorList
          // var jsonData = JSON.stringify(this.formItem);// 转成JSON格式
          // var result = $.parseJSON(jsonData);// 转成JSON对象
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
      this.conList.forEach((item) => {
        if (item.dsConfigId == event) {
          this.chosenConn = item;
        }
      });
    },
  },

  watch: {},
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
