<template>
  <div class="settings">
    <a-drawer
      :title="title"
      width="820px"
      :visible.sync="isShowDialog"
      :footer="null"
       :bodyStyle="{ padding: '0px 24px' }"
      @cancel="close"
      @close="close"
    >
      <a-spin :spinning="loading">
        <a-row class="chart-row">
          <a-col :span="18">请输入指令并提交</a-col>
          <a-col :span="6"
            ><span style="color: #1890ff; cursor: pointer" @click="showApiKey"
              >参数配置</span
            ></a-col
          >
        </a-row>
        <transition name="fade-transform" mode="out-in">
          <a-row class="chart-row" v-show="showapiKeyVisible">
            <a-col :span="12"
              >API Key<a-input
                v-model="apiKey"
                style="margin-left: 10px; width: 220px"
                allow-clear
            /></a-col>
            <a-col :span="12"
              >模型<a-input
                v-model="model"
                style="margin-left: 10px; width: 220px"
                allow-clear
            /></a-col>
          </a-row>
        </transition>

        <a-row class="chart-row">
          <a-col :span="20">
            <a-input
              ref="userNameInput"
              v-model="prompt"
              placeholder="请输入命令，如: 使用js开发一个函数计算两个数的和"
            >
              <a-tooltip slot="suffix" title="发送" @click="toChart">
                <i class="iconfont iconfabu1"></i>
              </a-tooltip>
            </a-input>
          </a-col>
          <a-col :span="4" style="text-align: right">
            <a-button @click="copy" class="tag">拷贝</a-button>
          </a-col>
        </a-row>
        <CodeEditor
          ref="codeEditor"
          v-model="script"
          :editorOptions="editorOptions"
          :height="editorHeight"
          mode="js"
          width="100%"
        />
      </a-spin>
    </a-drawer>
  </div>
</template>
<script>
import Clipboard from "clipboard";
import CodeEditor from "@/components/CodeEditor";
import { toChartService } from "@/api/chartGPT";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "settingTree",
  components: {
    CodeEditor,
  },
  props: {
    title: String,
    //0:从页面设计器打开 1:从侧边栏打开

    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      script: "",
      prompt: "",
      apiKey: "",
      model: "gpt-3.5-turbo",
      editorOptions: {
        showGutter: true,
      },
      editorHeight: "500px",
      loading: false,
      showapiKeyVisible: false,
    };
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  created() {
    this.apiKey=getStorage("chat-apiKey")
    this.model = getStorage("chat-model")?getStorage("chat-model"):"code-davinci-002"
  },
  methods: {
    showApiKey() {
      this.showapiKeyVisible = !this.showapiKeyVisible;
    },
    toChart() {
      if(!this.apiKey||!this.model){
        this.showapiKeyVisible=true;
        this.$antdMessage.info("请输入apiKey以及model");
        return;
      }
      this.loading = true;
      let params = {
        prompt: this.prompt,
        apiKey:this.apiKey,
        model:this.model
      };
      setStorage("chat-apiKey",this.apiKey);
      setStorage("chat-model",this.model);
      toChartService(params).then((res) => {
        if (res.code == 0) {
          this.loading = false;
          this.script = res.data.text;
          this.$refs.codeEditor.setValue(res.data.text);
        }
      });
    },
    copy() {
      let script = this.script;
      let clipboard = new Clipboard(".tag", {
        text: function () {
          return script;
        },
      });
      clipboard.on("success", (e) => {
        this.$antdMessage.success("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$antdMessage.error("复制失败,");
        clipboard.destroy();
      });
    },
    close() {
      this.isShowDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-row {
  margin-top: 10px;
  margin-bottom: 10px;
}


</style>
