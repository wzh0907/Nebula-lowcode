<template>
  <el-dialog
    :title="title"
    width="600px"
    v-loading="listLoading"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-table
      :data="tableData"
      style="width: 90%">
       <el-table-column
        prop="platform"
        label="平台">
      </el-table-column>
      <el-table-column
        prop="version"
        label="版本"
        width="100">
      </el-table-column>
      <el-table-column
        prop="address"
        label="下载">
        <template slot-scope="scope">
          <el-button v-if="scope.row.platform=='PC'" @click="handleClick(scope.row)" type="text" size="small">引擎下载地址</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">版本下载地址</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
     
    </div>
  </el-dialog>
</template>

<script>
import { saveVersionItem } from '@/api/v4'
export default {
  name: "addVersion",
  props: {
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
      listLoading: false,
      dataForm: {
        version: "",
        remark: "",
        serverType: "",
      },     
      rules: {
        version: [{ required: true, message: "请输入版本号", trigger: "blur" }],
      },
      tableData: [{
            version: 'V1',
            platform:"PC",
          }, {
             version: 'V2',
            platform:"Android",
         
          }]
    }
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
    save() {
      // this.add();
       this.listLoading = false
            this.isShowDialog = false
            this.$refs.versionForm.resetFields()
            this.$emit('reload')
    },
    add() {
      this.$refs.versionForm.validate(async (valid) => {
        if (valid) {
          console.log(this.dataForm);
          const params = {
            version: this.dataForm.version,
            remark: this.dataForm.remark,
            serverType: this.dataForm.serverType
          }
          this.listLoading = true
          saveVersionItem(params).then(res => {
            this.listLoading = false
            this.isShowDialog = false
            this.$refs.versionForm.resetFields()
            this.$emit('reload')
          })
        }
      });
    },
    dialogOpen() {
       this.$refs.versionForm && this.$refs.versionForm.resetFields()
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
