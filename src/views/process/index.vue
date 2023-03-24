<template>
  <el-container v-loading="listLoading" style="flex-direction: column">
    <custom-header>
      <div slot="opertBtn">
        <span class="el-button-opert-text">
          <el-button
            type="text"
            size="medium"
            icon="el-icon-tickets"
            @click="save"
            >保存</el-button
          >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-tickets"
            @click="testData"
            >测试</el-button
          >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-upload2"
            @click="uploadComment"
            >上传市场
          </el-button>
          <el-button
            type="text"
            size="medium"
            icon="el-icon-delete"
            @click="deleComment"
            >删除
          </el-button>
        </span>
      </div>
    </custom-header>
    <div style="display: flex">
      <!-- <el-main> -->
      <code-editor
        v-if="editorHeight && (!id || processName)"
        v-model="processScript"
        width="80%"
        :height="editorHeight"
        :mode="codeEditorMode"
      />
      <div width="20%">
        输入参数：
        <el-input v-model="requestParam" type="textarea" :row="2" />
        返回值:
        <el-input
          v-model="testRes"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 24 }"
        />
      </div>
    </div>

    <!-- 组件上传 -->
    <uploadCommentDialog
      ref="uploadCommentForm"
      :dialog-visible.sync="uploadCommentVisible"
      :title="uploadCommentTitle"
    />
    <!-- </el-main> -->
  </el-container>
</template>

<script>
import customHeader from "@/components/customHeader/index";
import uploadCommentDialog from "../report/modules/uploadComment/index.vue";
import CodeEditor from "@/components/CodeEditor";
import { getOpenProcesseDataList } from "@/api/chartsData";
export default {
  name: "ProcessEditPage",
  components: {
    customHeader,
    CodeEditor,
    uploadCommentDialog,
  },
  props: {
    id: {
      type: String | Number,
      default: 0,
    },
    currentFileData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      uploadCommentVisible: false,
      uploadCommentTitle: "组件上传",
      listLoading: false,
      editorHeight: 0,
      languageTypes: [
        {
          label: "Groovy",
          value: "groovy",
        },
        {
          label: "Javascript",
          value: "js",
        },
        {
          label: "Java",
          value: "java",
        },
        {
          label: "Python",
          value: "python",
        },
        {
          label: "PHP",
          value: "php",
        },
        {
          label: "Golang",
          value: "golang",
        },
        {
          label: "SQL",
          value: "sql",
        },
      ],
      codeEditorMode: "groovy",
      processName: "",
      processScript: "",
      requestParam: JSON.stringify({
        dataApiId: this.id,
        params: {},
      }),
      testRes: "",
    };
  },
  mounted() {
    this.editorHeight =
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) -
      55 +
      "px";
    this.getDetail();
  },
  beforeDestroy() {
    this.save();
  },
  methods: {
    save() {
      if (this.id) {
        this.edit();
      } else {
        this.add();
      }
    },
    // 删除组件
    deleComment() {
      const deleCreatGroupEvent = new CustomEvent("dele-creat-group", {
        detail: { data: this.currentFileData },
      });
      window.dispatchEvent(deleCreatGroupEvent);
    },
    add() {
      if (!this.processName) return false;
      const params = {
        processName: this.processName,
        languageType: this.codeEditorMode,
        processScript: this.processScript,
        // fileId: this.currentDirId
      };
      this.listLoading = true;
    },
    edit() {
      if (!this.processName) return false;
      const params = {
        processName: this.processName,
        languageType: this.codeEditorMode,
        processScript: this.processScript,
        // fileId: this.currentDirId
      };
      params.id = this.id;
      this.listLoading = true;
    },
    // uploadComment组件上传
    uploadComment() {
      this.uploadCommentVisible = true;
      this.uploadCommentTitle = "组件上传";
    },
    getDetail() {
      if (!this.id) return false;
      this.listLoading = true;
      // 组件上传需要reportId
      setStorage("reportId", this.id);
      getProcessDetailService({
        processId: this.id,
      })
        .then((res) => {
          this.listLoading = false;
          const data = res.data || {};

          this.processName = data.processName || "";
          this.processScript = data.processScript || "";
          // 上传组件存类型
          setStorage("subType", data.processType);
          // this.codeEditorMode = data.languageType || 'js'
        })
        .catch(() => {
          // 上传组件失败存类型
          setStorage("subType", "");
        });
    },
    testData() {
      console.log(this.requestParam, "testData");
      getOpenProcesseDataList(JSON.parse(this.requestParam)).then((res) => {
        console.log(res, "getOpenProcesseDataList");
        if (res.message) {
          this.testRes = res.message;
        } else {
          this.testRes = JSON.stringify(res);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.m-r-20 {
  margin-right: 20px;
}
</style>
