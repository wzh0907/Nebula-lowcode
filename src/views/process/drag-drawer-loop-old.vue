<template>
  <div class="group-wrap">
    <div class="group-content">
    <p style="margin-bottom: 10px;">
      返回组件放在文档路径的末尾，并将文档返回到调用源点，该调用源点可以是父进程，也可以是web服务客户端应用程序。
    </p>
    <Form  :label-width="100" label-position="left">
      <FormItem label="名称">
        <Input v-model="showName" />
      </FormItem>
      <FormItem label="返回对象">
        <i-input :value.sync="targetStr" readonly placeholder="选择..." @on-focus="setTarget" icon="ios-search-outline"></i-input>
      </FormItem>
    </Form>
    </div>
    <div class="group-btns">
      <Row>
        <el-button class="btn" type="error" size="small" @click="deleteItem">删除</el-button>
        <el-button class="btn" type="primary" size="small" @click="saveConfig">保存</el-button>
        <el-button class="btn" type="primary" size="small" @click="cancel">关闭</el-button>
      </Row>
    </div>
    <el-dialog
      v-model="modal"
      title="变量"
      @on-ok="ok">
      <Form  :label-width="80">
        <FormItem label="变量类型">
          <el-select v-model="modalObj.type">
            <el-option value="CurrentData">当前值</el-option>
            <el-option value="SystemProperty">系统变量</el-option>

          </el-select>
        </FormItem>
        <template v-if="modalObj.type == 'SystemProperty'">
        <FormItem label="变量名称">
          <Input v-model="modalObj.name" placeholder="请输入..."/>
        </FormItem>
        </template>
      </Form>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'drag-drawer-loop',
  props: ['curDiagram'],
  data () {
    return {
      showName: '',
      target: {}, // PropertyName类型 SystemProperty系统变量, CurrentData当前值
      nameMap: { SystemProperty: '系统变量', CurrentData: '当前值' },
      targetStr: '',
      modal: false,
      modalObj: { type: 'CurrentData', name: '' }
    }
  },
  mounted () {
    var properties = this.curDiagram.getProperties()
    this.showName = this.curDiagram.title
    if (properties.target) {
      this.target = properties.target
      this.targetStr = this.nameMap[this.target.type] + this.target.name
    }
  },
  methods: {
    saveConfig () {
      let configJson = {
        title: this.showName,
        target: this.target
      }
      this.$emit('arguments', configJson)
    },
    setTarget () {
      this.modal = true
      this.modalObj = this.target
    },
    ok () {
      if (this.modalObj.type == 'CurrentData') {
        this.modalObj.name = ''
      }
      this.target = { ...this.modalObj }
      this.targetStr = this.nameMap[this.target.type] + (this.target.name || '')
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
