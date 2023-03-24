<template>
  <el-dialog :title="title" width="600px" :visible.sync="isShowDialog" @open="dialogOpen">
    <el-form ref="dbForm" v-loading="listLoading" :rules="rules" :model="dataForm">
      <el-form-item label="名称：" :label-width="formLabelWidth" prop="processName">
        <el-input v-model="dataForm.processName" disabled />
      </el-form-item>
      <el-form-item label="定时执行：" :label-width="formLabelWidth" prop="cronExpress">
        <el-input v-model="dataForm.cronExpress" placeholder="请输入定时执行时间，点击“？”查看帮助">
          <el-button slot="append" icon="el-icon-question" @click="goQuestionPage" />
        </el-input>
      </el-form-item>
      <el-form-item label="描述：" :label-width="formLabelWidth" prop="description">
        <el-input v-model="dataForm.description" type="textarea" placeholder="请添加对象描述" :autosize="{ minRows: 3, maxRows: 5}" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <!-- <el-button @click="testConnect">连接测试</el-button> -->
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editProcessPropertyService, getProcessDetailService } from '@/api/process'
export default {
  name: 'Property',
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
    },
    detailData: {}
  },
  data() {
    return {
      listLoading: false,
      formLabelWidth: '120px',
      dataForm: {},
      rules: {
        processName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
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
      if (!this.id) return false
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          const params = this.dataForm
          params.id = this.id
          this.listLoading = true
          editProcessPropertyService(params).then(res => {
            this.listLoading = false
            this.isShowDialog = false
            this.$refs.dbForm.resetFields()
            this.$emit('reload')
          })
        }
      })
    },
    goQuestionPage() {
      window.open('http://www.bejson.com/othertools/cron/')
    },
    getDetail() {
      if (!this.id) return
      this.listLoading = true
      getProcessDetailService({
        processId: this.id
      }).then(res => {
        this.listLoading = false
        const data = res.data || {}
        this.dataForm = {
          processName: data.processName,
          cronExpress: data.cronExpress,
          description: data.description
        }
      })
    },
    dialogOpen() {
      this.dataForm = {}
      this.$refs.dbForm && this.$refs.dbForm.resetFields()
      // this.dataForm = this.detailData || {}
      // this.processScript = this.dataForm.processScript || ''
      this.getDetail()
      // this.queryProductList()
    },
    handleClose() {},
    confirm() {},
    close() {}
  }
}
</script>

<style lang="scss" scoped>
.merchantsConfig {
  width: 360px;
}
.tip {
  margin-left: 125px;
  font-size: 12px;
  color: #ff9966;
}
</style>
