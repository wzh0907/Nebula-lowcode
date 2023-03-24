<template>
  <el-dialog
    v-loading="listLoading"
    :title="title"
    width="600px"
    :visible.sync="isShowDialog"
    :close-on-click-modal="false"
    @open="dialogOpen"
  >
    <el-form
      ref="versionForm"
      :rules="rules"
      label-width="120px"
      :model="dataForm"
    >
    <el-form-item label="关键字"   prop="keyName" size="small">
        <el-input type="text" v-model="dataForm.keyName"  placeholder="请输入参数名"   ></el-input>
      </el-form-item>

      <el-form-item></el-form-item>
    <el-form-item label="测试环境"   prop="sandbox" size="small">
        <el-input  v-model="dataForm.sandbox"   placeholder="请输入参数值"  ></el-input>
      </el-form-item>
 
      <el-form-item></el-form-item>
      <el-form-item label="生产环境" prop="prod" size="small">
        <el-input  v-model="dataForm.prod"    placeholder="请输入参数值"  ></el-input>
      </el-form-item>

 
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSystemSettingListService, saveSystemSettingService } from "@/api/system-setting";

export default {
  name: "AddVersion",
  props: {
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
      interfaceDataAll: [],
      listLoading: false,
      dataForm: {
        keyName:"",
        sandbox:"",
        prod:"",
      },
      rules: {
        // version: [{ required: true, message: "请输入版本号", trigger: "blur" }],
      },
      dataForm: this.detailData,
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
    // listApiService().then((res) => {
    //   this.interfaceDataAll = res.dataList;
    // });
  },
  mounted() {},
  methods: {
    save() {
      const params = {
        keyName: this.dataForm.keyName,
        sandbox: this.dataForm.sandbox,
        prod: this.dataForm.prod,
      };

      if (this.dataForm.id) {
        params.id = this.dataForm.id;
      }

      // console.log(params)

      saveSystemSettingService(params).then((res) => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.isShowDialog = false;
          this.$emit("reload");
        }
      });

    },
    dialogOpen() {
      if (this.detailData) {
        this.dataForm = this.detailData;
      } else {
        this.dataForm = {};
      }
    },

  },
};
</script>

<style lang="scss" scoped>
 
</style>
