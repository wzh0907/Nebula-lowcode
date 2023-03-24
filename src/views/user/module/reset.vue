<template>
  <el-dialog :title="title" width="450px" v-loading="listLoading" :visible.sync="isShowDialog" @open="dialogOpen">
    <el-form ref="userInfo" :rules="rules" label-width="120px" :model="userInfo">
      <el-form-item label="重置新密码：" prop="password" size="small">
        <el-input maxlength="100" v-model="userInfo.password" />
      </el-form-item>   
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { resetPasswordService } from '@/api/user'
export default {
  name: 'reset',
  props: {
    id: {
      type: String | Number,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }   
  },
  data() {
    return {
      listLoading: false,
      userInfo: {
        id: '',
        password: ''
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  computed: {
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
    save() {
      console.log(123);
      console.log(this.id);
      if (this.id) {
        this.edit()
      }
    },  
    edit() {
      this.$refs.userInfo.validate(async valid => {
        if (valid) {
          const params = {
            id: this.id,
            password: this.userInfo.password,
          }
          this.listLoading = true
          resetPasswordService(params).then(res => {
            this.listLoading = false
            this.isShowDialog = false
            // this.$refs.processForm.resetFields()
            this.$emit('reload')
          })
        }
      })
    },
    dialogOpen() {
      // this.dataForm = {
      //   paramName: '',
      //   paramValue: ''
      // }
      // this.$refs.processForm && this.$refs.processForm.resetFields()
      // if (this.id) {
      //   this.dataForm.paramName = this.detailData.paramName || ''
      //   this.dataForm.paramValue = this.detailData.paramValue || ''
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
