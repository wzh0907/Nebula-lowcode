<template>
  <div style="height: 100%; position: relative; overflow: hidden">
    <div class="title-text">
      {{ type === "report" ? "前端脚本" : "后端脚本" }}
    </div>
    <!-- <div style="display: flex; margin-bottom: 16px">
      <a-input placeholder="请输入脚本名称" v-model="scriptName" @change="scriptNameChanged"/>

    </div> -->
    <div class="normal-text" style="display: flex">
      <div style="flex: 1">
        {{
          type === "report"
            ? "请使用JavaScript语言编写脚本"
            : "请使用groovy语言编写脚本"
        }}
      </div>
      <!--      <div class="code-snippets">代码片段</div>-->
      <a-button style="margin-left: 16px" @click="testScript"> 测试 </a-button>
      <a-button type="primary" style="margin-left: 16px" @click="saveScript">
        保存
      </a-button>
      <a-button type="danger" style="margin-left: 16px" @click="deleteScript">
        删除
      </a-button>
    </div>
    <CodeEditor
      ref="codeEditor"
      v-model="script"
      :height="codeHeight"
      :mode="type == 'report' ? 'js' : 'groovy'"
      :editor-options="{ showGutter: false }"
    />
    <a-drawer
      placement="bottom"
      height="300"
      :closable="false"
      :visible="showTest"
      :get-container="false"
      :wrap-style="{ position: 'absolute' }"
      :body-style="{ padding: 0 }"
      @close="showTest = false"
    >
      <TestScript
        ref="testScript"
        :type="type"
        @runTest="runTest"
        @closeTest="showTest = false"
      >
      </TestScript>
    </a-drawer>
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor";
import TestScript from "./test-script.vue";
import { saveFunction, getFunctionDetail } from "@/api/function.js";

export default {
  name: "add-script",
  components: {
    CodeEditor,
    TestScript,
  },
  props: {
    type: {
      type: String,
      default: "report",
    },
  },
  computed: {
    codeHeight() {
      return `calc(100% - 180px)`;
    },
    defaultScript() {
      if (this.type == "report") {
        return `function functionName(parameters) {
  //定义返回值
  let map = new Map();
  //封装返回值
  map.set('key',parameters);
  //返回数据
  return map;
}`;
      } else {
        return `def functionName(String param1, String param2) {
    //定义返回值
    Map map = new HashMap();
    //封装返回值
    map.put("value",param1+param2);

    //返回数据
    return map;
}`;
      }
    },
  },
  data() {
    return {
      groupId: '',
      scriptId: '',
      scriptName: '',
      script: '',
      returnValue: '',  //脚本返回值
      showTest: false,
      form: this.$form.createForm(this, {name: 'dynamic_rule'}),
    }
  },
  methods: {
    scriptNameChanged() {
      let startIndex = this.type === "report" ? 9 : 4;
      let endIndex = this.script.indexOf("(");
      //替换方法名
      let newScript =
        this.script.slice(0, startIndex) +
        this.scriptName +
        this.script.slice(endIndex);
      this.$refs.codeEditor.setValue(newScript);
    },
    getFuncName(fun) {
      let ret = fun.toString();
      ret = ret.substr('function '.length);
      ret = ret.substr(0, ret.indexOf('('));
      return ret;
    },
    saveScript() {
      let functionName = this.getFuncName(this.script);
      if(!functionName){
        this.$message.error("给脚本起个名字吧");
        return;
      }
      if (this.returnValue === undefined || this.returnValue.length === 0) {
        this.$message.error("请先测试脚本");
      } else {
        saveFunction({
          id: this.scriptId || undefined,
          functionType: "script",
          functionName: functionName.trim(),
          functionOutput: this.returnValue,
          type: this.type,
          scheme: this.script,
          scopeId: this.groupId || undefined,
        }).then((res) => {
          this.$emit("saveScript");
          this.$message.success("保存成功");
        });
      }
    },
    getFunctionDetail(scriptId) {
      this.scriptId = scriptId;
      getFunctionDetail({
        businessId: scriptId,
      }).then((res) => {
        this.scriptId = res.data.id;
        this.scriptName = res.data.functionName;
        this.script = res.data.scheme;
        this.$refs.codeEditor.setValue(this.script);
      });
    },
    deleteScript() {
      this.$emit("deleteScript", {
        queryId: this.scriptId,
      });
    },
    openScriptEdit(groupId) {
      this.scriptId = "";
      this.scriptName = "";
      this.script = this.defaultScript;
      this.groupId = groupId || "";
      this.$refs.codeEditor.setValue(this.script);
    },
    testScript() {
      this.showTest = true;
      this.$refs.testScript.parseParams(this.script);
    },
    runTest(value) {
      console.log("runTest result=", value);
      this.returnValue = value;
    },
  },
};
</script>

<style scoped>
.title-text {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}

.normal-text {
  font-size: 14px;
  margin-bottom: 16px;
}

.code-snippets {
  cursor: pointer;
  color: #1890ff;
}

.test-view {
  z-index: 999 !important;
  position: absolute;
  bottom: 0;
  height: 200px;
}
</style>
