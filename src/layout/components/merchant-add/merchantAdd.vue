<template>
  <el-dialog
    :title="title"
    width="600px"
    append-to-body
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      label-width="0"
      :model="dataForm"
    >
      <el-form-item label="" prop="merchantName" >
          <el-input v-model="dataForm.merchantName" placeholder="请输入企业名称"/>
      </el-form-item>
      <!-- <el-form-item label="企业编码">
          <el-input  v-model="dataForm.merchantCode"/>
      </el-form-item>
      <el-form-item label="备注">
          <el-input v-model="dataForm.remark" type="textarea" :rows="2"/>
      </el-form-item> -->
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
import { merchantAdd } from '@/api/merchant'
export default {
  name: 'AddProject',
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
      selectProjectStatus: -1,
      selectTypeStatus: 0,
      businessTypeList: [],
      isActiveType: 'MOBILE',
      dictCode: '',
      btnLoading: false,
      markAppList: [], // 项目列表
      dataForm: {
        merchantName: '',
        merchantCode: '',
        remark: ''
      },
      rules: {
        merchantName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      marketProjectList: []
    }
  },
  computed: {
    // ...mapGetters(["markAppList"]),
    isShowDialog: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  created() {
  },
  mounted() {
    
  },
  methods: {
    // 获取应用项目业务类型
    
    cancal() {
      this.isShowDialog = false
      this.dataForm = {
        merchantName: '',
        merchantCode: null
      }
    },
    save() {
      this.add()
    },
    add() {
      this.$refs.dataForm.validate(async(valid) => {
        if (valid) {
          const params = {
            merchantName: this.dataForm.merchantName,
            merchantCode: this.dataForm.merchantCode,
            remark: this.dataForm.remark,
          }
          this.btnLoading = true
          merchantAdd(params)
            .then((res) => {
              this.$message.success('添加成功')
              console.log("merchantAdd",res)
              this.$emit("createMerchant",res.data.id)
              this.cancal
              this.btnLoading = false
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    
    dialogOpen() {
      this.dataForm = {
        merchantName: '',
        merchantCode:'',
        remark:''
      }
    }
  }
}
</script>

<style lang="scss" scoped>


.creat_project_main{
  display: flex;
  .created_left{
    width:100px;
    border-right: 1px #F2F2F2 solid;
    ul{
      li{
        padding: 10px 0;
        cursor: pointer;
        &.active {
          // color: #EB5757;
        }
      }
    }
  }
  .created_right{
    flex:1;
    .device-type-select {
      overflow: hidden;
      text-align: center;
      margin-top: 16px;
      display: flex;
      align-items: center;
      .device-wrap {
        display: inline-block;
        border:1px solid #ccc;
        padding: 20px 30px;
        border-radius: 10px;
        &.active {
          // color: #EB5757;
          // border:1px solid #EB5757;
        }
        cursor: pointer;
        .iconfont {
          font-size: 42px;
        }
        span{
          display: block;
        }
      }
    }
    .created_right_bottom{
      margin-top: 16px;
      margin-left: 16px;
      .device-type-project-list{
        width: 100%;
        height: 300px;
        overflow: auto;
        ul{
          li{
           float: left;
           margin: 20px 40px 0 0;
           cursor: pointer;
           span{
             display: block;
             margin: 10px 0;
            &.active {
              // color: #EB5757;
            }
           }
           img{
              width: 162px;
              height: 132px;
              border-radius: 10px;
              &.active {
                // color: #EB5757;
                // border:1px solid #EB5757;
              }
           }
          }
        }
      }
    }
  }
}
</style>
