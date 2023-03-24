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
     
      <el-form-item label="名称：" prop="processName" size="small">
        <el-input v-model="dataForm.processName" maxlength="50" />
      </el-form-item>
      <el-form-item />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancal">取 消</el-button>
      <!-- <el-button
        type="primary"
        :disabled="btnLoading"
        @click="save"
      >保 存</el-button> -->
      <el-button
        type="primary"
        :disabled="btnLoading"
        @click="saveNew"
      >保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { renameProcessService } from "@/api/v4/index";
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
    processItem:{
      type: Object,
      default: {}
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    detailData: {}
  },
  data() {
    return {
      isActiveType: 'ProcessFlow',
      btnLoading: false,
      dataForm: {
        fileName: ''
      },
      rules: {
        processName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
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
        processName: ''
      }
    },
    save() {
      this.$refs.processForm.validate(async(valid) => {
        if (valid) {
          if(this.dataForm.processId){
            //update
            var params = {
              processName: this.dataForm.processName,
              processId: this.dataForm.processId,
            };
            renameProcessService(params).then((res) => {
              if (res.code === 0) {
                this.$emit("initData");
                  this.isShowDialog = false
              }
            });
          }else{
            this.$emit('addFile', 'processFlow', this.entryDirId, this.dataForm.processName)
            this.isShowDialog = false
          }
        
        }
      })
    },
    saveNew(){
       this.$refs.processForm.validate(async(valid) => {
        if (valid) {
          if(this.dataForm.processId){
            //update
            var params = {
              processName: this.dataForm.processName,
              processId: this.dataForm.processId,
            };
            renameProcessService(params).then((res) => {
              if (res.code === 0) {
                this.$emit("initData");
                  this.isShowDialog = false
              }
            });
          }else{
            this.$emit('addFile', 'processFlowNew', this.entryDirId, this.dataForm.processName)
            this.isShowDialog = false
          }
        
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
       this.dataForm = {
            processName: this.processItem.processName,
              processId: this.processItem.processId,
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
