<template>
  <div class="downComment">
    <a-modal
      :title="title"
      width="620px"
      :before-close="handleClose"
      :visible.sync="isShowDialog"
      @open="dialogOpen"
      @cancel="close"
      @ok="saveOk"
    >
      <a-textarea
        placeholder="请输入注释"
        v-model="remark"
        :auto-size="{ minRows: 2, maxRows: 6 }"
      />
    </a-modal>
  </div>
</template>

<script>
import { saveVersionService } from "@/api/versionManage";
export default {
  name: "activeSave",
  props: {
    title: String,
    //0:从页面设计器打开 1:从侧边栏打开

    dialogVisible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: false,
    },
    type: {
      type: String,
      default: "report",
    },
    scheme: {
      type: String,
      default: false,
    },
  },
  data() {
    return {
      remark: "",
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
  components: {},
  watch: {},
  created() {},
  methods: {
    dialogOpen() {
      this.init();
    },
    dialogClose() {},
    saveOk() {
      let params = {
        type: this.type,
        queryId: this.id,
        scheme: this.scheme,
        remark: this.remark,
      };
      saveVersionService(params).then((res) => {
        console.log("------------", res);
        if(res.code==0){
            this.$antdMessage.success('保存成功')
            this.$emit("saveSuccess")
            this.close();
        }
      });
    },

    handleClose() {
      this.isShowDialog = false;
    },
    close() {
      this.isShowDialog = false;
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },

    // 失去焦点初始化
    inputBlur() {
      this.saveVar();
      this.tabClickIndex = null;
      this.tabClickLabel = "";
    },
    saveVar() {
      saveVarService(this.tabCLickRow).then((res) => {
        this.selectVarList(this.currentScopeId);
      });
    },
    deleteVar(row) {
      let businessId = row.id;
      this.$confirm("请确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deelteGlobalVar(businessId);
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss">
.add-var {
  color: #409eff;
}
.delete-item {
  font-size: 20px;
  margin: 20px;
  cursor: pointer;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.scope-tag {
  cursor: pointer;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>