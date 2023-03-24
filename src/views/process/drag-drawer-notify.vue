<template>
  <div class="group-wrap">
    <div class="group-content">
      <p class="group-text">通知组件可以构建自定义执行日志或通知消息，并发送到邮件、短信、钉钉和企业微信。这些通知消息可以是静态消息，也可以是使用输入参数生成的动态消息。</p>
      <Form class="command-form" :model="formItem" :label-width="80" label-position="left">
        <FormItem label="显示名称">
          <Input v-model="showName"></Input>
        </FormItem>
        <FormItem label="通知方式">
          <i-select v-model="notifyType">
            <i-option v-for="item in notifyTypeList" :value="item.value">{{ item.label }}</i-option>
          </i-select>
        </FormItem>
        <FormItem label="接受者">
          <Input
            :value="getValueStr()"
            placeholder="请输入.."
            @on-focus="setValue()"
            icon="ios-search-outline"
            readonly
          ></Input>
        </FormItem>
        <FormItem label="标题">
          <Input v-model="title"></Input>
        </FormItem>
        <!--<FormItem label="类型" >-->
        <!--<el-select v-model="type">-->
        <!--<el-option value="SQL">SQL Statement</el-option>-->
        <!--<el-option value="StoredProcedure">Store Procedure</el-option>-->
        <!--<el-option value="SystemCommand">System Command</el-option>-->
        <!--</el-select>-->
        <!--</FormItem>-->
        <FormItem label="消息等级">
          <!--<Checkbox v-model="single">每次执行一次</Checkbox>-->

          <Radio-group v-model="msgLevel">
            <Radio label="information">
              <!--<Icon type="logo-apple"></Icon>-->
              <span>Information</span>
            </Radio>
            <Radio label="warning">
              <!--<Icon type="social-windows"></Icon>-->
              <span>Warning</span>
            </Radio>
            <Radio label="error">
              <!--<Icon type="social-windows"></Icon>-->
              <span>Error</span>
            </Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="消息">
          <Input v-model="message" type="textarea" :rows="4" placeholder="在此处输入你的消息，使用“{1}”插入变量。"></Input>
        </FormItem>

        <!--<FormItem label="SQL" v-if="type=='SQL'">-->
        <!--<Input  v-model="sql"  :rows="4" placeholder="在此处输入脚本，使用“？”插入变量。"></Input>-->
        <!--</FormItem>-->

        <!--<FormItem label="程序名称" v-if="type=='SP'">-->
        <!--<Input  v-model="procedure"  placeholder="在这里输入程序名，使用{1}插入变量。"></Input>-->
        <!--</FormItem>-->
        <!--<FormItem label="命令" v-if="type=='COMMAND'">-->
        <!--<Input  v-model="command"  placeholder="在这里输入命令，使用{1}插入变量。"></Input>-->
        <!--</FormItem>-->
        <FormItem label="变量">
          <Row class="param-btns">
            <Icon class="icon" type="ios-add-circle" :size="20" @click="addVar" />
            <Icon class="icon" type="md-create" :size="20" @click="editVar" />
            <Icon class="icon" type="ios-close-circle" :size="20" @click="delVar" />
          </Row>
          <div class="spp-box-list">
            <ul>
              <li
                v-for="(item,index) in varList"
                @click="select(index)"
                :class="{activeRow: index== rowIdx,atrItem:index!=rowIdx}"
              >
                <span>{{ item.category+'/'+item.name }}</span>
              </li>
            </ul>
          </div>
        </FormItem>
      </Form>
    </div>
    <el-dialog v-model="modal1" title="变量值" @on-ok="ok">
      <Form :model="formItem" :label-width="80">
        <!-- <FormItem label="取值范围">
          <el-select v-model="formItem.value_type">
            <el-option :value="key" v-for="(value, key, index) in valueMap">{{value}}</el-option>
          </el-select>
        </FormItem>-->
        <FormItem label="变量类型">
          <el-select v-model="formItem.category" class="var-select">
            <el-option :value="variable.name" v-for="variable in variableList">{{variable.name}}</el-option>
          </el-select>
          <el-select
            v-model="formItem.name"
            class="var-select"
            v-if="formItem.category"
            @on-change="dateValueSelect()"
          >
            <el-option
              :value="variable.name"
              v-for="variable in varMap.get(formItem.category)"
            >{{variable.name}}</el-option>
          </el-select>
        </FormItem>
      </Form>
    </el-dialog>

    <div class="group-btns">
      <Row>
        <el-button class="btn" type="error" size="small" @click="deleteItem">删除</el-button>
        <el-button class="btn" type="primary" size="small" @click="saveConfig">保存</el-button>
        <el-button class="btn" type="primary" size="small" @click="cancel">关闭</el-button>
      </Row>
    </div>
  </div>
</template>

<script>
// import { getVariableList } from "@/api/variable";
import { mapActions } from "vuex";
export default {
  name: "drag-drawer-command",
  props: ["flow", "curDiagram", "processId"],
  data() {
    return {
      showName: "",
      notifyType: "",
      notifyTypeList: [
        { label: "短信", value: "SMS" },
        { label: "钉钉", value: "DingDing" },
        { label: "企业微信", value: "WeiXin" },
        { label: "邮件", value: "Email" }
      ],
      account: "", //value类型
      title: "",
      message: "",
      msgLevel: "information",

      type: "SQL",
      single: false,
      connection: "",
      sql: "",
      procedure: "",
      command: "",
      varList: [],
      formItem: {
        category:'',
        name:'',
        type:0,
        value:'',
      },
      modal1: false,
      rowIdx: 0,
      opType: 1, //1新增 2编辑
      startArgs: [],
      valueMap: {
        SystemProperty: "系统变量",
        CurrentData: "当前数据",
        DocumentProperty: "数据/文档属性",
        Static: "静态值",
        DateTime: "时间值",
        Arguments: "输入参数"
      },
      variableList: [],
      varMap: null
    };
  },
  mounted() {
    this.startArgs = this.flow.getArgs();
    var properties = this.curDiagram.getProperties();
    this.showName = this.curDiagram.title || "";
    this.title = properties.type || "";

    this.notifyType = properties.notifyType || "";
    this.account = properties.account || "";
    this.msgLevel = properties.msgLevel || "";
    this.message = properties.message || "";

    this.varList = properties.variables || [];
    getVariableList(this.processId, 1, 999).then(res => {
      if (res.data.code == 0) {
        this.variableList = res.data.data;
        this.varMap = new Map();
        this.variableList.forEach(item => {
          this.varMap.set(item.name, JSON.parse(item.variables));
        });
      }
    });
  },
  methods: {
    ...mapActions(["getVariableList"]),
    select(index) {
      this.rowIdx = index;
    },
    addVar() {
      this.resetMadal();
      this.modal1 = true;
      this.opType = 1;
    },
    editVar() {
      this.formItem = { ...this.varList[this.rowIdx] };
      this.modal1 = true;
      this.opType = 2;
    },
    delVar() {
      this.varList.splice(this.rowIdx, 1);
    },
    ok() {
      if (this.opType == 1) {
        this.varList.push(this.formItem);
      }
      if (this.opType == 2) {
        this.varList[this.rowIdx] = this.formItem;
      }
      if (this.opType == 3) {
        this.account = this.formItem;
      }
    },
    resetMadal() {
      this.formItem = {
        category:'',
        name:'',
        type:0,
        value:'',
      };
    },

    saveConfig() {
      delete this.account.type;
      delete this.account.value;
      let configJson = {
        title: this.title,
        account: this.account,
        notifyType: this.notifyType,
        message: this.message,
        msgLevel: this.msgLevel,
        variables: this.varList
      };
      this.$emit("arguments", configJson);
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
    getValueStr() {
      return typeof this.account == "object"
        ? this.account.category+"/"+this.account.name
        : this.account;
    },
    setValue() {
      this.modal1 = true;
      this.opType = 3;
      this.formItem = { ...this.account } || {};
    },
    dateValueSelect() {
      this.varMap.get(this.formItem.category).forEach(v => {
        if (v.name == this.formItem.name) {
          this.formItem.type = v.type;
          this.formItem.value = v.value;
           this.formItem.value_type = v.value_type;
        }
      });
    }
  }
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
  border-radius: 5px;
  margin-top: 10px;
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
.group-title {
  padding-bottom: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #dadada;
}
.activeRow {
  background: #e5e5e5;
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
.command-form .ivu-form-item {
  margin-bottom: 10px;
}
.group-btns .btn {
  margin-right: 15px;
}
</style>

