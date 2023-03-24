<template>
  <el-dialog :title="title" width="450px" v-loading="listLoading" :close-on-click-modal="false" :visible.sync="isShowDialog" @open="dialogOpen">
    12313
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'syncDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    exectorUrl:{
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
     
    },  
    edit() {
      
    },
    checkStatus(){
        
        if(this.exectorUrl){
          axios.get(
          this.exectorUrl+"/sync/v1/status"         
          )
          .then(function(res){
            // window.open("http://"+res.data.file,"_blank")
          })
        }
    },
    dialogOpen() {
        this.checkStatus();
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
