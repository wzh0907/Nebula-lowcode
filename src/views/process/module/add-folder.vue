<template>
  <el-dialog :title="title" v-loading="listLoading" width="600px" :visible.sync="isShowDialog" @open="dialogOpen">
    <el-form ref="dbForm" :model="dataForm">
      <el-form-item label="名称：" :label-width="formLabelWidth" prop="name">
        <el-input v-model="dataForm.name" :placeholder="name || '请输入文件夹名称'" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" :disabled="!dataForm.name" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addDirService } from '@/api/dir_tree'
export default {
  name: 'Add',
  props: {
    id: {
      type: String | Number,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    parentId: {
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
      formLabelWidth: '120px',
      dataForm: {}
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
      if (this.id) {
        this.edit()
      } else {
        this.add()
      }
    },
    add() {
      const params = this.dataForm
      params.parentId = this.parentId
      params.type = 'process'
      this.listLoading = true
      addDirService(params).then(res => {
        this.listLoading = false
        this.isShowDialog = false
        this.$refs.dbForm.resetFields()
        this.$emit('reload')
      })
    },
    edit() {
      const params = this.dataForm
      params.parentId = this.parentId
      params.type = 'process'
      params.id = this.id
      this.listLoading = true
      addDirService(params).then(res => {
        this.listLoading = false
        this.isShowDialog = false
        this.$refs.dbForm.resetFields()
        this.$emit('reload')
      })
    },
    dialogOpen() {
      this.dataForm = {}
      this.$refs.dbForm && this.$refs.dbForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
