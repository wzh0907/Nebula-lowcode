<template>
  <el-dialog
    :title="title"
    width="450px"
    :visible.sync="isShowDialog"
    :append-to-body="true"
    @open="dialogOpen"
  >
    <el-form
      ref="dirForm"
      :rules="rules"
      label-width="100px"
      :model="dataForm"
    >
      <el-form-item label="文件夹名称：" prop="name" size="small">
        <el-input v-model="dataForm.name" maxlength="50" />
      </el-form-item>
      <el-form-item />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancal">取 消</el-button>
      <el-button type="primary" :disabled="btnLoading" @click="save"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { saveDirectoryV4 } from "@/api/v4/index";
export default {
  name: "AddDir",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    dirId: {
      type: String | Number,
      default: "0",
    },
    dirItem: {
      type: Object,
      default: {},
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    queryType: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    detailData: {},
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
    cancal() {
      this.isShowDialog = false;
      this.dataForm = {
        name: "",
      };
    },
    save() {
      this.$refs.dirForm.validate(async (valid) => {
        if (valid) {
          if (this.dataForm.id) {
            //update
            let id = this.dataForm.id;
            let name = this.dataForm.name;
            saveDirectoryV4({
              // parentId: dirId || this.currentDirId,
              id,
              name,
            }).then(() => {
              this.$emit("initData");
              this.isShowDialog = false;
            });
          } else {
            if (!this.dirId && this.currentDirLevel >= 5) return false;
            saveDirectoryV4({
              parentId: this.dirId,
              name: this.dataForm.name,
              queryType:this.queryType,
              type:this.type
            }).then((res) => {
              this.$emit("initData");
              this.isShowDialog = false;
            });
          }
        }
      });
    },

    dialogOpen() {
      this.dataForm = {
        name: this.dirItem.name,
        id: this.dirItem.id,
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
