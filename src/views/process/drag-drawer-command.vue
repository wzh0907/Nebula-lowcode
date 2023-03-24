<template>
  <div class="group-wrap">
    <div class="group-content">
      <p class="group-text">命令组件用于调用数据加工工具外部的能力，并作为数据加工流程的节点，如操作系统指令，数据库存储过程调用等。利用该组件可以实现系统级的操作指令。</p>
      <Form class="command-form" :model="formItem" :label-width="80" label-position="left">
        <FormItem label="节点名称">
          <Input v-model="showName"></Input>
        </FormItem>
        <FormItem label="类型">
          <el-select v-model="type">
            <el-option value="SQL">SQL Statement</el-option>
            <el-option value="StoredProcedure">Store Procedure</el-option>
            <el-option value="SystemCommand">System Command</el-option>
          </el-select>
        </FormItem>
        <FormItem label="选项">
          <Checkbox v-model="single">每次执行一次</Checkbox>
        </FormItem>
        <FormItem label="连接" v-if="type=='SQL' || type=='SP' ">
          <!--<Input  v-model="connection"></Input>-->
          <i-select v-model="connection" filterable>
            <i-option v-for="item in conList" :value="item.id +''">{{ item.name }}</i-option>
          </i-select>
        </FormItem>
        <FormItem label="SQL" v-if="type=='SQL'">
          <Input v-model="sql" type="textarea" :rows="2" placeholder="在此处输入脚本，使用“？”插入变量。"></Input>
        </FormItem>

        <FormItem label="程序名称" v-if="type=='StoredProcedure'">
          <Input v-model="procedure" placeholder="在这里输入程序名，使用{1}插入变量。"></Input>
        </FormItem>
        <FormItem label="命令" v-if="type=='SystemCommand'">
          <Input v-model="command" placeholder="在这里输入命令，使用{1}插入变量。"></Input>
        </FormItem>
        <h3>变量</h3>
        <Row class="param-btns">
          <Icon class="icon" type="ios-add-circle" :size="20" @click="addVar" />
          <Icon class="icon" type="ios-close-circle" :size="20" @click="delVar" />
          <Icon class="icon" type="ios-arrow-up" :size="20" @click="up" />
          <Icon class="icon" type="ios-arrow-down" :size="20" @click="down" />
        </Row>
        <Row :gutter="30">
          <i-col span="10">
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
          </i-col>
          <i-col span="14">
            <Form :label-width="40" class="routeBy-form" label-position="left">
              <FormItem label="参数" v-if="varList[rowIdx]">
                <div class="form-input">
                  <el-select v-model="varList[rowIdx].category" class="var-select">
                    <el-option
                      :value="variable.name"
                      v-for="variable in variableList"
                    >{{variable.name}}</el-option>
                  </el-select>
                  <el-select
                    v-model="varList[rowIdx].name"
                    class="var-select"
                    clearable
                    @on-change="dateValueSelect(varList[rowIdx])"
                    v-if="varMap&&varList[rowIdx].category"
                  >
                    <el-option
                      :value="variable.name"
                      v-for="variable in varMap.get(varList[rowIdx].category)"
                    >{{variable.name}}</el-option>
                  </el-select>
                </div>
              </FormItem>
            </Form>
          </i-col>
        </Row>
      </Form>
    </div>
    <!-- <el-dialog v-model="modal1" title="变量值" @on-ok="ok">
      <Form :model="formItem" :label-width="80">
        <FormItem label="变量类型">
          <el-select v-model="formItem.category" class="var-select">
            <el-option :value="variable.name" v-for="variable in variableList">{{variable.name}}</el-option>
          </el-select>
          <el-select
            v-model="formItem.name"
            class="var-select"
            v-if="formItem.category"
            @on-change="dateValueSelect(varList[rowIdx])"
          >
            <el-option
              :value="variable.name"
              v-for="variable in varMap.get(formItem.category)"
            >{{variable.name}}</el-option>
          </el-select>
        </FormItem>
      </Form>
    </el-dialog>-->

    <div class="group-btns">
       <Row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem" >删除</el-button>
        <el-button class="btn btns-save" type="primary" @click="saveConfig">保存</el-button>
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
      type: "",
      single: false,
      connection: "",
      sql: "",
      procedure: "",
      command: "",
      varList: [],
      formItem: {
        category: "",
        name: "",
        type: 0,
        value: ""
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
      conList: [],
      variableList: [],
      varMap: null,
      rowIdx: 0
    };
  },
  mounted() {
    var self = this;
    this.startArgs = this.flow.getArgs();
    var properties = this.curDiagram.getProperties();
    this.showName = this.curDiagram.title || "程序命令";
    this.type = properties.type || "SQL";
    this.connection = properties.connection || "";
    this.procedure = properties.procedure_name || "";
    this.varList = properties.variables || [];
    this.command = properties.command || "";
    this.single = properties.command_option || false;
    this.sql = properties.sql || "";
 
       this.variableList =this.$store.getters.varTagList
     this.varMap = this.$store.getters.varMap
    // getVariableList(this.processId, 1, 999).then(res => {
    //   if (res.data.code == 0) {
    //     this.variableList = res.data.data;
    //     this.varMap = new Map();
    //     this.variableList.forEach(item => {
    //       this.varMap.set(item.name, JSON.parse(item.variables));
    //     });
    //   }
    // });
  },
  methods: {
    ...mapActions(["getVariableList"]),
    select(index) {
      this.rowIdx = index;
    },
    addVar() {
      // this.resetMadal();
      // this.modal1 = true;
      // this.opType = 1;
      var newscript = {
        category: "",
        name: "",
        type: 0,
        value: ""
      };
      this.varList.push(newscript);
      this.rowIdx = this.varList.length - 1;
      this.processForm = newscript;
      console.log(this.varList, "this.varList");
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
    },
    resetMadal() {
      this.formItem = {
        category: "",
        name: "",
        type: 0,
        value: ""
      };
    },

    saveConfig() {
      let configJson = {};
      if (this.type == "StoredProcedure") {
        configJson = {
          title: this.showName,
          type: this.type,
          command_option: this.single,
          connection: this.connection,
          procedure_name: this.procedure,
          variables: this.varList
        };
      } else if (this.type == "SQL") {
        configJson = {
          title: this.showName,
          type: this.type,
          command_option: this.single,
          connection: this.connection,
          sql: this.sql,
          variables: this.varList
        };
      } else if (this.type == "SystemCommand") {
        configJson = {
          title: this.showName,
          type: this.type,
          command_option: this.single,
          command: this.command,
          variables: this.varList
        };
      }

      this.$emit("arguments", configJson);
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
    up() {
      var list = this.varList;
      var idx = this.rowIdx;
      if (idx > 0) {
        var item = list.splice(idx, 1);
        list.splice(idx - 1, 0, item[0]);
        this.varList = list;
        this.rowIdx = idx - 1;
      }
    },
    down() {
      var list = this.varList;
      var idx = this.rowIdx;
      if (idx > -1) {
        if (idx < list.length - 1) {
          var item = list.splice(idx, 1);
          list.splice(idx + 1, 0, item[0]);
          this.varList = list;
          this.rowIdx = idx + 1;
        }
      }
    },
    dateValueSelect(item) {
      this.varMap.get(item.category).forEach(v => {
        if (v.name == item.name) {
          this.varList[this.rowIdx].type = v.type;
          this.varList[this.rowIdx].value = v.value;
          this.varList[this.rowIdx].value_type = v.value_type;
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

