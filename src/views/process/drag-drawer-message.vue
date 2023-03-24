<template>
  <div class="group-wrap">
    <div class="group-content">
      <p class="group-text">消息组件用于生成指定格式的流程执行日志并输出到执行器后台，以便跟踪执行器的执行情况和问题定位。可在执行器管理平台查看流程的执行日志</p>
      <el-form class="command-form" :model="formItem" label-width="80px" label-position="left">
        <el-form-item label="节点名称">
          <el-input v-model="showName" />
        </el-form-item>
         <el-form-item label="通知方式">
          <el-select v-model="messageType" class="var-select">
            <el-option value="message">短信</el-option>
            <el-option value="ding" disabled>钉钉</el-option>
            <el-option value="qywx" disabled>企业微信</el-option>
            <el-option value="mail">邮件</el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="接受者">
          <el-input v-model="receiveUser" />
        </el-form-item>
        <el-form-item label="选项">
          <el-checkbox v-model="single">将文档合并为单个消息</el-checkbox>
        </el-form-item>
        <el-form-item label="消息">
          <el-input v-model="message" type="textarea" :rows="4" placeholder="在此处输入你的消息，使用“{1}”插入变量。" />
        </el-form-item>
        <h3>变量</h3>
        <el-row class="param-btns">
          <i class="icon el-icon-circle-plus-outline" :size="20" @click="addVar" />
          <i class="icon el-icon-circle-close"  :size="20" @click="delVar" />
          <i class="icon el-icon-arrow-up" :size="20" @click="up" />
          <i class="icon el-icon-arrow-down" :size="20" @click="down" />
        </el-row>
        <el-row :gutter="30">
          <el-col :span="10">
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
          </el-col>
           
        </el-row>
      </el-form>
    </div>
   

    <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error"  @click="deleteItem">删除</el-button>
        <el-button class="btn btns-save" type="primary"  @click="saveConfig">保存</el-button>
      </el-row>
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
      //        type:'SQL',
      single: false,
      connection: "",
      message: "",
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
      variableList: [],
      messageType:"",
      receiveUser:"",
    };
  },
  mounted() {
    // this.startArgs = this.flow.getArgs();
     var properties = JSON.parse(JSON.stringify(this.curDiagram.getProperties()));
    console.log(properties, "properties");
    var properties = this.curDiagram.getProperties();
    this.showName = this.curDiagram.title || "";
    this.message = properties.message || "";
    this.messageType = properties.messageType || "";
    this.receiveUser = properties.receiveUser || "";
    this.varList = properties.variables || [];
    this.single = properties.merge_option || false;

    this.variableList =this.$store.getters.varTagList

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
    saveConfig() {
      let configJson = {
        title: this.showName,
        merge_option: this.single,
        message: this.message,
        messageType:this.messageType,
        receiveUser:this.receiveUser,
        variables: this.varList
      };
      console.log(configJson);
      this.$emit("arguments", configJson);
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
   
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

