<template>
  <el-dialog
    :title="title"
    width="450px"
    :visible.sync="isShowDialog"
    :append-to-body="true"
  >
    <el-form
      ref="dirForm"
      :rules="rules"
      label-width="100px"
      :model="dataForm"
    >
      <el-form-item label="分组名称：" prop="name" size="small">
        <el-input v-model="dataForm.name" maxlength="50" />
      </el-form-item>
      <el-form-item />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :disabled="btnLoading" @click="save"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import {
  saveConnectGroup
} from "@/api/database.js";
export default {
  name: "AddDir",
  props: {
    id: {
      type: String | Number,
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
  },
  data() {
    return {
      isActiveType: "ProcessFlow",
      btnLoading: false,
      dataForm: {
        name: "",
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
    };
  },
  computed: {
    // ...mapGetters(["projectList"]),
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
        name: "",
      };
    },
    save() {
      this.$refs.dirForm.validate(async (valid) => {
        if (valid) {
          //update
          saveConnectGroup({
            dbConfigId: this.id,
            name: this.dataForm.name,
            parentId: 0,
            type: "connect"
          }).then(res => {
            this.$emit("initData");
            this.isShowDialog = false;
          })
        }
      });
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
