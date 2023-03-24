<template>
  <el-dialog
    :title="title"
    width="450px"
    :visible.sync="isShowDialog"
    :append-to-body="true"
    :close-on-click-modal="false"
    @open="dialogOpen"
  >
    <el-form
      ref="processForm"
      :rules="rules"
      label-width="80px"
      :model="dataForm"
    >
      <el-form-item label="名称：" prop="dicName" size="small">
        <el-input v-model="dataForm.dicName" maxlength="50" />
      </el-form-item>
      <el-form-item />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>

      <el-button type="primary" :disabled="btnLoading" @click="saveNew"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { addDicCategory } from "@/api/data-dic";
export default {
  name: "AddDic",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    dicName: {
      type: String,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    detailData: {},
  },
  data() {
    return {
      btnLoading: false,
      dataForm: {
        dicName: "",
      },
      rules: {
        dicName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
      },
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
  created() {},
  mounted() {},
  methods: {
    cancel() {
      this.isShowDialog = false;
      this.dataForm = {
        dicName: "",
      };
    },

    saveNew() {
      this.$refs.processForm.validate(async (valid) => {
        if (valid) {
          //update
          var params = {
            dicName: this.dataForm.dicName,
            id: this.id,
          };
          addDicCategory(params).then((res) => {
            if (res.code === 0) {
              this.$emit("initData");
              this.isShowDialog = false;
            }
          });
        }
      });
    },

    dialogOpen() {
      this.dataForm = {
        dicName: this.dicName,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.device-type-select {
  overflow: hidden;
  text-align: center;
  margin-bottom: 20px;
  .device-wrap {
    display: inline-block;
    &.active {
      color: #f56c6c;
    }
    cursor: pointer;
    .iconfont {
      font-size: 42px;
    }
  }
}
</style>
