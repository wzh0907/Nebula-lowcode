<template>
  <!--  结束  -->
  <div class="group-wrap">
    <div class="group-content">
      <Checkbox v-model="exit_process">是否退出整个流程</Checkbox>
    </div>
    <div class="group-btns">
      <Row>
        <el-button class="btn" type="error" size="small" @click="deleteItem">删除</el-button>
        <el-button  class="btn" type="primary" size="small" @click="saveConfig">保存</el-button>
        <el-button class="btn" type="primary" size="small" @click="cancel">关闭</el-button>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'drag-drawer-stop',
  props: ['curDiagram'],
  data () {
    return {
        exit_process: false
    }
  },
  mounted () {
    var properties = this.curDiagram.getProperties()
    if (properties.exit_process) {
      this.exit_process = properties.exit_process
    }
  },
  methods: {
    saveConfig () {
      let data = {
          exit_process: this.exit_process
      }
      this.$emit('arguments', data)
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
