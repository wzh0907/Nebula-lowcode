<template>
    <el-dialog
      width="600px"
      :show-close="false"
      :before-close="onHandleClose"
      :visible.sync="isShowDialog"
    >
      <div>
        <p style="color: #F56C6C; font-weight: bold;">注意：直接手动输入配置文件，会导致页面被覆盖！</p>
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 18}"
          placeholder="请输入内容"
          v-model="configJson">
        </el-input>
      </div>
      <span slot="footer">
        <el-button @click="onHandleClose">取消</el-button>
        <el-button type="danger" @click="onSave">保存</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'designHelpCode',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      configJson: '',
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
  methods: {
    onSave(){

    },
    onHandleClose() {
      this.isShowDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog__header {
  padding: 0px;
}
</style>
