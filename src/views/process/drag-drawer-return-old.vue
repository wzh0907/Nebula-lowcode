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
      <!--<FormItem label="返回对象">-->
        <!--<i-input :value.sync="targetStr" readonly placeholder="选择..." @on-focus="setTarget" icon="ios-search-outline"></i-input>-->
      <!--</FormItem>-->
    </Form>
      <Row :gutter="16">
        <i-col span="12">
          <h4>返回对象</h4>
          <Row class="mt10 param-btns">
            <Icon class="icon" type="ios-add-circle" :size="20" @click="setAttributes" />
            <Icon class="icon" type="md-create" :size="20"  @click="editAtr" />
            <Icon class="icon" type="ios-close-circle" :size="20"  @click="propertyDelete" />
            <Icon class="icon"  type="ios-arrow-up" :size="26"  @click="upAtr" />
            <Icon class="icon" type="ios-arrow-down" :size="26"  @click="downAtr" />
          </Row>
          <div class="spp-box-list">
            <ul>
              <li v-for="(item,index) in attributeList" @click="checkedRow(index)" :class="{atrChecked: index == rowNum, atrItem: index != rowNum}">
                <!--<div :class="{ activeRow : rowNum == index }">-->
                <span>{{ nameMap[item.type] }} </span>
                <span>{{ item.name }}</span>
                <!--</div>-->
              </li>
            </ul>
          </div>
        </i-col>
      </Row>
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
            <el-option value="SystemProperty">系统变量</el-option>
            <el-option value="CurrentData">当前值</el-option>
          </el-select>
        </FormItem>
        <FormItem label="变量名称" v-if="modalObj.type == 'SystemProperty'">
          <Input v-model="modalObj.name" placeholder="请输入..."/>
        </FormItem>
      </Form>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: 'drag-drawer-return',
        props:['curDiagram'],
        data() {
            return {
              showName:'',
              target: {}, // PropertyName类型 SystemProperty系统变量, CurrentData当前值
              nameMap: {SystemProperty:'系统变量', CurrentData:'当前值'},
              targetStr: '',
              modal: false,
              modalObj:{type:'',name:''},
              attributeList: [],
              rowNum: 0,
              opType: 1 // 1新增属性  2编辑属性
            }
        },
      mounted(){
        var properties = this.curDiagram.getProperties();
        this.showName = this.curDiagram.title;
        if(properties.return){
          this.attributeList = properties.return
//          this.targetStr =  this.nameMap[this.target.type] + this.target.name
        }
      },
        methods: {
          saveConfig() {
              var self = this;
              let configJson = {
                title:this.showName,
                return : this.attributeList
              }
              this.$emit('updatestart', self.attributeList)
              this.$emit('arguments', configJson)
          },
          checkedRow (index) {
            this.rowNum = index
          },
          setTarget(){
            this.modal = true
            this.modalObj = this.target
          },
          ok(){
            this.target = {...this.modalObj}
//            this.targetStr = this.nameMap[this.target.type] + this.target.name
            if(this.opType == 1){
              this.attributeList.push(this.target)
            }else{
              this.attributeList[this.rowNum] = this.target
            }

          },
          cancel(){
            this.$emit('cancel')
          },
          deleteItem(){
            this.$emit('delete')
            this.$emit('cancel')
          },
          setAttributes () {
            this.modal = true
            this.opType = 1
            this.resetForm()
          },
          resetForm () {
            this.modalObj = { type: '', name: ''}
          },
          editAtr () {
            this.modal = true
            this.opType = 2
            var cur = this.attributeList[this.rowNum]
            this.modalObj.type = cur.type
            this.modalObj.name = cur.name
          },
          propertyDelete () {
            this.attributeList.splice(this.rowNum, 1)
          },
          upAtr () {
            var list = this.attributeList
            var idx = this.rowNum
            if (idx > 0) {
              var item = list.splice(idx, 1)
              list.splice(idx - 1, 0, item[0])
              this.attributeList = list
              this.rowNum = idx - 1
            }
          },
          downAtr () {
            var list = this.attributeList
            var idx = this.rowNum
            if (idx > -1) {
              if (idx < list.length - 1) {
                var item = list.splice(idx, 1)
                list.splice(idx + 1, 0, item[0])
                this.attributeList = list
                this.rowNum = idx + 1
              }
            }
          },
        }
    }
</script>

<style scoped>
  .mt10{
    margin-top: 10px;
  }
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
  .spp-box-list{
    border: 1px solid #d6d6d6;
    padding: 2px 0;
    border-radius: 2px;
    margin-top: 10px;
    min-height:200px;
  }
  .spp-box-list li.atrItem:hover{
    background-color: #f6f6f6;
  }
  .spp-box-list li {
    cursor:pointer;
    line-height: 24px;
    padding:0 5px;
  }
  .atrChecked{
    background-color: #5a6268;
    color:white;
  }

</style>
