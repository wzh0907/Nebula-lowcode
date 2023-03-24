<template>
  <el-dialog
    :title="title"
    width="450px"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-form
      ref="processForm"
      :rules="rules"
      label-width="80px"
      :model="dataForm"
    >
      <!-- <el-form-item></el-form-item> -->
      <!--      <div class="device-type-select">
        <p class="device-wrap" :class="{active: isActiveType === 'Dataset'}" style="margin-right: 30px" @click="isActiveType = 'Dataset'">
          <i class="iconfont iconshujuji" />
          <br>
          数据集
        </p>
        <p class="device-wrap" :class="{active: isActiveType === 'Script'}" style="margin-right: 30px" @click="isActiveType = 'Script'">
          <i class="iconfont iconsql" />
          <br>
          脚本
        </p>
        <p class="device-wrap" :class="{active: isActiveType === 'View'}" style="margin-right: 30px" @click="isActiveType = 'View'">
          <i class="iconfont iconglassesyanjing" />
          <br>
          视图
        </p>
        <p class="device-wrap" :class="{active: isActiveType === 'StoredProcedure'}" style="margin-right: 30px" @click="isActiveType = 'StoredProcedure'">
          <i class="iconfont iconicon-sql" />
          <br>
          存储过程
        </p>
      </div> -->
      <el-form-item label="名称：" prop="fileName" size="small">
        <el-input v-model="dataForm.fileName" maxlength="50" />
      </el-form-item>
      <el-form-item />
      <el-form-item label="数据源：" prop="databaseId" size="small">
        <el-select
          v-model="dataForm.databaseId"
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="item in databaseList"
            :key="item.id"
            :label="item.dataSourceName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancal">取 消</el-button>
      <el-button
        type="primary"
        :disabled="btnLoading"
        @click="save"
      >保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddProject',
  props: {
    id: {
      type: String | Number,
      default: ''
    },
    entryDirId: {
      type: String | Number,
      default: '0'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    databaseList: {
      type: Array,
      default: []
    },
    detailData: {}
  },
  data() {
    return {
      isActiveType: 'Script',
      btnLoading: false,
      dataForm: {
        fileName: '',
        databaseId: ''
      },
      rules: {
        fileName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        databaseId: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // ...mapGetters(["projectList"]),
    isShowDialog: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    cancal() {
      this.isShowDialog = false
      this.dataForm = {
        fileName: '',
        databaseId: ''
      }
    },
    save() {
      this.$refs.processForm.validate(async(valid) => {
        if (valid) {
          if (this.isActiveType === 'Dataset') {
            this.$emit('addFile', 'dataset', this.entryDirId, this.dataForm.fileName, this.dataForm.databaseId)
          } else if (this.isActiveType === 'Script') {
            this.$emit('addFile', 'datasetScript', this.entryDirId, this.dataForm.fileName, this.dataForm.databaseId)
          } else if (this.isActiveType === 'View') {
            this.$emit('addFile', 'view', this.entryDirId, this.dataForm.fileName, this.dataForm.databaseId)
          } else if (this.isActiveType === 'StoredProcedure') {
            this.$emit('addFile', 'procedure', this.entryDirId, this.dataForm.fileName, this.dataForm.databaseId)
          }
          this.isShowDialog = false
        }
      })
    },
    // add() {
    //   this.$refs.processForm.validate(async (valid) => {
    //     if (valid) {
    //       let params = {
    //         type: this.isActiveType,
    //         fileName: this.dataForm.fileName,
    //       };
    //       this.btnLoading = true;
    //       addProjectService(params)
    //         .then((res) => {
    //           this.$message.success("添加成功");
    //           this.$store.dispatch("project/getProjectList", true).then(() => {
    //             // location.reload();
    //             this.cancal()
    //             this.btnLoading = false;
    //           });
    //         })
    //         .catch(() => {
    //           this.btnLoading = false;
    //         });
    //     }
    //   });
    // },
    dialogOpen() {
      this.$refs.processForm && this.$refs.processForm.resetFields()
      this.isActiveType = 'Script'
      this.dataForm = {
        fileName: '',
        databaseId: ''
      }
    }
  }
}
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
