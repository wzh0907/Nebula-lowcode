<template>
  <div class="downComment">
    <a-modal
      :title="title"
      width="620px"
      :before-close="handleClose"
      :visible.sync="isShowDialog"
      :confirmLoading="loading"
      @open="dialogOpen"
      @cancel="close"
      @ok="saveOk"
    >
      <a-form
        :layout="formLayout"
        ref="dataForm"
        label-width="100px"
        :model="dataForm"
      >
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="复制自"
          prop="复制自"
        >
          {{ branchName }}
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="分支名称"
          prop="分支名称"
        >
          <a-input v-model="dataForm.name" placeholder="分支名称" />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="备注"
          prop="备注"
        >
          <a-textarea placeholder="备注" v-model="dataForm.remark" rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { saveBranchTreeService } from "@/api/branch";
export default {
  name: "activeSave",
  props: {
    title: String,
    //0:从页面设计器打开 1:从侧边栏打开

    dialogVisible: {
      type: Boolean,
      default: false,
    },
    queryId: {
      type: Number,
      default: false,
    },
    branchName: {
      type: String,
      default: false,
    },
  },
  data() {
    return {
      remark: "",
      formLayout: "horizontal",
      dataForm: {
        name: "",
        remark: "",
      },
      loading:false
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
    formItemLayout() {
      const { formLayout } = this;
      return formLayout === "horizontal"
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }
        : {};
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
      this.loading=true;
      let params = {
        parentId: this.queryId,
        name: this.dataForm.name,
        remark: this.dataForm.remark,
      };
      console.log("------------", params);
      saveBranchTreeService(params).then((res) => {
        if (res.code == 0) {
          this.loading=false;
          this.$antdMessage.success("新建成功");
          this.close();
          this.$emit('loadData')
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