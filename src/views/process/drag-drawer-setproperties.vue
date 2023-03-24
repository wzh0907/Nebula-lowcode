<template>
  <div class="group-wrap">
    <div class="group-content">
    <p style="margin-bottom: 10px;">设置属性形状允许您设置各种文档和流程属性的值。这些属性可用于设置出站连接器属性，例如文件名或电子邮件主题，或将某些值存储在内存中以促进集成，属性值可以包括静态或动态值。</p>
    <Row style="margin-bottom: 10px">
      <Input v-model="showName" placeholder="显示名称" style="width: 300px" />
    </Row>
    <Row :gutter="16">
      <i-col span="12">
        <h4>要设置的属性</h4>
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
      <i-col span="12">

        <h4 v-if="attributeList.length > 0">参数</h4>
        <h4 v-if="attributeList.length == 0">选择要编辑的属性</h4>
        <div v-if="attributeList.length > 0">
          <Row class="param-btns">
            <Icon class="icon" type="ios-add-circle" :size="20" @click="setParameter" />
            <Icon class="icon" type="md-create" :size="20"  @click="editParam" />
            <Icon class="icon" type="ios-close-circle" :size="20"  @click="paramDelete" />
            <Icon class="icon"  type="ios-arrow-up" :size="26"  @click="upPam" />
            <Icon class="icon" type="ios-arrow-down" :size="26"  @click="downPam" />
          </Row>
          <div class="spp-box-list" v-if="attributeList.length > 0">
            <ul>
              <li v-for="(item,index) in attributeList[rowNum].paramList" @click="checkedParamRow(index)" :class="{atrChecked: index == paramIdx, atrItem: index != paramIdx}">
                <span>{{ valueMap[item.value_type] }} </span>
                <span>{{ item.date_format }}</span>
                <span>{{ item.date_type }}</span>
                <span>{{ item.relative_to_current_date_delta }}</span>
                <span>{{ item.relative_to_current_date_type }}</span>
                <span>{{ item.data_value }}</span>
                <span>{{ item.property_name }}</span>
                <!--<span style="margin-left:10px;">-->
                  <!--<Icon type="ios-close-circle" :size="14" style="color:red;" @click="propertyDelete(index)" />-->
                <!--</span>-->
              </li>
            </ul>
          </div>
      </div>
      </i-col>
    </Row>
    </div>
    <!--  属性弹框  -->
    <el-dialog
      v-model="modal2"
      title="变量"
      @on-ok="okAttribute"
      @on-cancel="cancel">
      <Form :model="formItem" :label-width="80">
        <FormItem label="变量类型">
          <el-select v-model="formItem.type">
            <el-option value="SystemProperty">系统变量</el-option>
            <el-option value="DocumentProperty">文档属性</el-option>
          </el-select>
        </FormItem>
        <FormItem label="变量名称">
          <Input v-model="formItem.name" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
    </el-dialog>
    <el-dialog
      v-model="modal1"
      title="取值"
      @on-ok="okParameter"
      @on-cancel="cancel">

      <Form :model="paramObj" :label-width="80">
        <FormItem label="取值范围">
          <el-select v-model="paramObj.value_type">
            <el-option :value="key" v-for="(value, key, index) in valueMap">{{value}}</el-option>
          </el-select>
        </FormItem>
        <template v-if="paramObj.value_type == 'DateTime'">
          <FormItem label="时间格式">
            <!--<Input v-model="paramObj.date_format" placeholder="请输入..."></Input>-->
            <el-select v-model="paramObj.date_format">
              <el-option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</el-option>
              <el-option value="MMddyyyy">MMddyyyy</el-option>
              <el-option value="MM/dd/yyyy">MM/dd/yyyy</el-option>
              <el-option value="MM-dd-yyyy">MM-dd-yyyy</el-option>
              <el-option value="MMddyy">MMddyy</el-option>
              <el-option value="yyyyMMdd HHmmss">yyyyMMdd HHmmss</el-option>
              <el-option value="yyyyMMdd HHmmss.SSS">yyyyMMdd HHmmss.SSS</el-option>
              <el-option value="yyyy-MM-dd">yyyy-MM-dd</el-option>
              <el-option value="yyyy-MM-dd'T'HH:mm:ss">yyyy-MM-dd'T'HH:mm:ss</el-option>
              <el-option value="yyyy-MM-dd'T'HH:mm:ssZ">yyyy-MM-dd'T'HH:mm:ssZ</el-option>
            </el-select>
          </FormItem>
          <FormItem label="时间类型">
            <el-select v-model="paramObj.date_type">
              <el-option value="CurrentDate">当前日期/时间</el-option>
              <el-option value="RelativeDate">相对日期/时间</el-option>
            </el-select>
          </FormItem>
          <template v-if="paramObj.date_type == 'RelativeDate'">
            <FormItem label="偏移值">
              <Input v-model="paramObj.relative_to_current_date_delta" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="偏移类型">
              <el-select v-model="paramObj.relative_to_current_date_type">
                <el-option value="Second(s)">秒</el-option>
                <el-option value="Minute(s)">分</el-option>
                <el-option value="Hour(s)">时</el-option>
                <el-option value="Day(s)">天</el-option>
                <el-option value="Week(s)">周</el-option>
                <el-option value="Month(s)">月</el-option>
                <el-option value="Year(s)">年</el-option>
              </el-select>
            </FormItem>
          </template>
        </template>
        <template v-if="paramObj.value_type == 'Static'">
          <FormItem label="值">
            <Input v-model="paramObj.data_value" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="paramObj.value_type == 'DocumentProperty'">
          <!-- <FormItem label="属性类型">
            <el-select v-model="paramObj.property_name.type">
              <el-option value="DocumentProperty">数据集/文档属性</el-option>
              <el-option value="SystemProperty">系统变量</el-option>
            </el-select>
          </FormItem> -->
          <FormItem label="属性名称">
            <Input v-model="paramObj.property_name" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="paramObj.value_type == 'SystemProperty'">
          <!-- <FormItem label="属性类型">
            <el-select v-model="paramObj.property_name.type">
              <el-option value="DocumentProperty">数据集/文档属性</el-option>
              <el-option value="SystemProperty">系统变量</el-option>
            </el-select>
          </FormItem> -->
          <FormItem label="属性名称">
            <Input v-model="paramObj.property_name" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="paramObj.value_type == 'Arguments'">
          <FormItem label="属性名称">
            <el-select v-model="paramObj.property_name">
              <el-option :value="item.name" v-for="item in startArgs">{{item.title}}</el-option>
            </el-select>
          </FormItem>
        </template>
      </Form>
    </el-dialog>
      <div class="group-btns">
        <Row  >
          <el-button class="btn" type="error" size="small" @click="deleteItem">删除</el-button>
          <el-button class="btn" type="primary" size="small" @click="saveConfig">保存</el-button>
          <el-button class="btn" type="primary" size="small" @click="close">关闭</el-button>
        </Row>
      </div>
    </div>
</template>

<script>
export default {
  name: 'drag-drawer-setproperties',
  props: ['flow', 'curDiagram'],
  data () {
    return {
      paramObj: {
        property_name: '',
        data_value: '',
        relative_to_current_date_type: '',
        relative_to_current_date_delta: '',
        date_type: '',
        date_format: '',
        value_type: ''
      },
      startArgs: [],
      showName: '',
      formItem: {
        paramList: [],
        name: '',
        type: 'SystemProperty'
      },
      nameMap: {
        SystemProperty: '系统变量',
          DocumentProperty: '文档属性',
      },
      valueMap: {
        SystemProperty: '系统变量',
        CurrentData: '当前数据',
        DocumentProperty: '数据/文档属性',
        Static: '静态值',
        DateTime: '时间值',
        Arguments: '输入参数'
      },      modal1: false,
      modal2: false,
      attributeList: [], // 属性
      //      parameterList:[],
      rowNum: 0,
      paramIdx: 0,
      opType: 1 // 1新增属性  2编辑属性 3新增参数 4编辑参数
    }
  },
  methods: {
    checkedRow (index) {
      this.rowNum = index
    },
    checkedParamRow (index) {
      this.paramIdx = index
    },
    setParameter () {
      this.modal1 = true
      this.opType = 3
      this.resetParam()
    },
    editParam () {
      this.modal1 = true
      this.opType = 4
      var cur = this.attributeList[this.rowNum].paramList[this.paramIdx]
      if (cur) {
        this.paramObj = { ...cur }
      }
    },

    setAttributes () {
      this.modal2 = true
      this.opType = 1
      this.resetForm()
    },
    editAtr () {
      this.modal2 = true
      this.opType = 2
      var cur = this.attributeList[this.rowNum]
      this.formItem.type = cur.type
      this.formItem.name = cur.name
    },
    // 模态框确定按钮触发事件
    okAttribute () {
      if (this.opType == 1) {
        this.attributeList.push(this.formItem)
        this.rowNum = this.attributeList.length - 1
      }
      if (this.opType == 2) {
        this.attributeList[this.rowNum].type = this.formItem.type
        this.attributeList[this.rowNum].name = this.formItem.name
      }
    },
    // 模态框确定按钮触发事件
    okParameter () {
      if (this.opType == 3) {
        var cur = this.attributeList[this.rowNum]
        cur.paramList.push(this.paramObj)
        this.paramIdx = cur.paramList.length - 1
      }
      if (this.opType == 4) {
        this.attributeList[this.rowNum].paramList[this.paramIdx] = this.paramObj
      }
    },
    // 模态框取消按钮触发事件
    cancel () {
      // this.$Message.info('Clicked cancel');
      this.resetForm()
    },
    // 属性列表删除项
    propertyDelete () {
      this.attributeList.splice(this.rowNum, 1)
    },

    paramDelete () {
      this.attributeList[this.rowNum].paramList.splice(this.paramIdx, 1)
      var paramLen = this.attributeList[this.rowNum].paramList.length
      if( (this.paramIdx +1) > paramLen){
        this.paramIdx = paramLen -1
      }
    },

    saveConfig () {
      var parameters = []
      this.attributeList.forEach((item, i) => {
        var obj = { property: { type: item.type, name: item.name }, values: [] }
        item.paramList.forEach((jtem, j) => {
          obj.values.push(jtem)
        })
        parameters.push(obj)
      })
      var result = { title: this.showName, parameters: parameters }
      this.$emit('arguments', result)
    },
    resetForm () {
      this.formItem = {
        paramList: [],
        name: '',
        type: 'SystemProperty'
      }
    },
    resetParam () {
      this.paramObj = {
        property_name: '',
        data_value: '',
        relative_to_current_date_type: '',
        relative_to_current_date_delta: '',
        date_type: '',
        date_format: '',
        value_type: ''
      }
    },
    close () {
      this.$emit('cancel')
    },
    deleteItem(){
      this.$emit('delete')
      this.$emit('cancel')
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
    upPam () {
      var list = this.attributeList[this.rowNum].paramList
      var idx = this.paramIdx
      if (idx > 0) {
        var item = list.splice(idx, 1)
        list.splice(idx - 1, 0, item[0])
        this.attributeList[this.rowNum].paramList = list
        this.paramIdx = idx - 1
      }
    },
    downPam () {
      var list = this.attributeList[this.rowNum].paramList
      var idx = this.paramIdx
      if (idx > -1) {
        if (idx < list.length - 1) {
          var item = list.splice(idx, 1)
          list.splice(idx + 1, 0, item[0])
          this.attributeList[this.rowNum].paramList = list
          this.paramIdx = idx + 1
        }
      }
    },

  },
  mounted () {
    this.startArgs = this.flow.getArgs()
    var properties = this.curDiagram.getProperties()
    this.showName = this.curDiagram.title
    var attr = []
    if (properties.parameters) {
      properties.parameters.forEach(item => {
        attr.push({
          paramList: item.values,
          name: item.property.name,
          type: item.property.type
        })
      })
    }
    this.attributeList = attr
  },
  watch: {

  }
}
</script>

<style scoped>
  .activeRow{
    background: #e5e5e5;
  }
  .mt10{
    margin-top: 10px;
  }
  ul li {
    list-style-type: none;
  }
  .spp-box-list{
    border: 1px solid #d6d6d6;
    padding: 2px 0;
    border-radius: 2px;
    margin-top: 10px;
    min-height:300px;
  }
  .spp-box-list li.atrItem:hover{
    background-color: #f6f6f6;
  }
  .spp-box-list li {
    cursor:pointer;
    line-height: 24px;
    padding:0 5px;
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
  .group-content{
    /*margin-bottom: 10px;*/
    height:calc(100% - 30px);
    overflow-y: auto;
    overflow-x:hidden;
    padding:15px;
  }
  .param-btns{
    margin-top: 10px;

  }
  .param-btns .icon{
    margin-right: 10px;
  }
  .atrChecked{
    background-color: #5a6268;
    color:white;
  }

  .group-btns .btn{
    margin-right: 15px;
  }

</style>
