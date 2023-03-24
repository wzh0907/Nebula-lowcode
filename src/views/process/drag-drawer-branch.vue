<template>
  <!--  分支  -->
  <div class="group-wrap">
    <div class="group-content">
    <!-- <p class="group-text">分支组件用于依次执行多个流程路径，每条分支包含一个按顺序执行的单独路径，分支路径上的处理节点执行完毕后，继续下一条分支路径的执行。 </p> -->
    <el-form :model="formItem" label-width="80px" :rules="rule" ref="branchForm" >
      <el-form-item label="分支个数" prop="branch_count">
        <el-input   v-model.number="formItem.branch_count" placeholder="请输入数字"  type="branch_count"></el-input>
        <p style="color: #999;">指定2到25之间的数字</p>
      </el-form-item>
    </el-form>
      <h3>备注</h3>
      <el-input v-model="formItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 15}" placeholder="Enter something..." />
      
    </div>
    <!-- <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error"  @click="deleteItem" >删除</el-button>
        <el-button class="btn btns-save" type="primary"  @click="saveConfig('branchForm')">保存</el-button>
      </el-row>
    </div> -->
  </div>

</template>

<script>
export default {
  name: 'drag-drawer-branch',
  props: ['curDiagram'],
  data () {
    return {
      formItem: {
        branch_count: 2,
        remark:""
      },
      rule: {
        branch_count: [
          { type: 'number', Range: true, min: 2, max: 25, message: '请输入2-25之间的数字', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    var properties = JSON.parse(JSON.stringify(this.curDiagram.getProperties()));
    if (properties.branch_count) {
      this.formItem.branch_count = properties.branch_count;
      this.formItem.remark = properties.remark;
    }
  },
  methods: {
    saveConfig () {
      let name="branchForm"
      this.$refs[name].validate((valid) => {
        if (valid) {
          let configJson = {
            branch_count: parseInt(this.formItem.branch_count),
            remark:this.formItem.remark
          }
          this.$emit('arguments', configJson)
        } else {
          this.$message.error('请检查输入分支')
        }
      })
    },
    cancel () {
      this.$emit('cancel')
    },
    deleteItem(){
      this.$emit('delete')
      this.$emit('cancel')
    }

  }
}
</script>

<style scoped>
  .group-wrap{
    position: relative;
    height:100%;
  }
  .group-btns{
    border-top: 1px solid #dadada;
    background-color: white;
    position: absolute;
    padding-left:15px;
    bottom:0;
    left:0;
    width:100%;
  }
  .group-btns .btn{
    margin-right: 15px;
  }
  .group-content{
    height:calc(100% - 30px);
    overflow-y: auto;
    overflow-x:hidden;
    padding:15px;
  }
</style>
