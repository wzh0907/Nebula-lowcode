<template>
    <!--  开始  -->
    <div class="group-wrap">
      <p
        class="group-text"
      >开始组件作为数据加工流程的起点，一个加工流程有且只能有一个开始组件。</p>
     <!--<div class="group-content">
       <div v-for="(n,index) in startGroup" :key="index" :index="index" >
         <Row type="flex" :gutter="16" >

           <i-col span="8">
             <i-input v-model="n.title" placeholder="参数名称"></i-input>
           </i-col>
           <i-col span="8">
             <i-input v-model="n.name" placeholder="英文名称"></i-input>
           </i-col>
           <i-col  span="6">
             <el-select v-model="n.type">
                <el-option v-for="item in startTypeList" :value="item.value" :key="item.value">{{ item.label }}</el-option>
             </el-select>
           </i-col>

           <i-col span="2" class="delBtn">
             <Icon type="ios-remove-circle" :size="18" @click="delThis(index)" />
           </i-col>

         </Row>
       </div>
       <Row>
         <el-button class="btn" type="primary" size="small"  @click="startAddData">添加</el-button>
       </Row>
     </div>-->
      <!-- <div class="group-content">
        <Row :gutter="16">
          <i-col span="12">
            <h4>输入参数</h4>
            <Row class="mt10 param-btns">
              <Icon class="icon" type="ios-add-circle" :size="20" @click="setAttributes(1)" />
              <Icon class="icon" type="md-create" :size="20"  @click="editAtr(1)" />
              <Icon class="icon" type="ios-close-circle" :size="20"  @click="propertyDelete(1)" />
              <Icon class="icon"  type="ios-arrow-up" :size="26"  @click="upAtr(1)" />
              <Icon class="icon" type="ios-arrow-down" :size="26"  @click="downAtr(1)" />
            </Row>
            <div class="spp-box-list">
              <ul>
                <li v-for="(item,index) in inParams" @click="checkedRow(index, 1)" :class="{atrChecked: index == inRowNum, atrItem: index != inRowNum}">
                  <span>{{ nameMap[item.type] }} </span>
                  <span>{{ item.name }}</span>
                </li>
              </ul>
            </div>
          </i-col>
          <i-col span="12">
            <h4>默认值</h4>
            <div>
              <Row class="param-btns">
                <Icon class="icon" type="ios-add-circle" :size="20" @click="setParameter" />
                <Icon class="icon" type="md-create" :size="20"  @click="editParam" />
                <Icon class="icon" type="ios-close-circle" :size="20"  @click="paramDelete" />
                <Icon class="icon"  type="ios-arrow-up" :size="26"  @click="upPam" />
                <Icon class="icon" type="ios-arrow-down" :size="26"  @click="downPam" />
              </Row>
              <div class="spp-box-list" >
                <ul v-if="inParams.length > 0">
                  <li v-for="(item,index) in inParams[inRowNum].default_value" @click="checkedParamRow(index)" :class="{atrChecked: index == paramIdx, atrItem: index != paramIdx}">
                    <span>{{ valueMap[item.value_type] }} </span>
                    <span>{{ item.date_format }}</span>
                    <span>{{ item.date_type }}</span>
                    <span>{{ item.relative_to_current_date_delta }}</span>
                    <span>{{ item.relative_to_current_date_type }}</span>
                    <span>{{ item.data_value }}</span>
                    <span>{{ item.property_name }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col span="12">
            <h4>输出参数</h4>
            <Row class="mt10 param-btns">
              <Icon class="icon" type="ios-add-circle" :size="20" @click="setAttributes(2)" />
              <Icon class="icon" type="md-create" :size="20"  @click="editAtr(2)" />
              <Icon class="icon" type="ios-close-circle" :size="20"  @click="propertyDelete(2)" />
              <Icon class="icon"  type="ios-arrow-up" :size="26"  @click="upAtr(2)" />
              <Icon class="icon" type="ios-arrow-down" :size="26"  @click="downAtr(2)" />
            </Row>
            <div class="spp-box-list">
              <ul>
                <li v-for="(item,index) in outParams" @click="checkedRow(index,2)" :class="{atrChecked: index == outRowNum, atrItem: index != outRowNum}">
                  <span>{{ nameMap[item.type] }} </span>
                  <span>{{ item.name }}</span>
                </li>
              </ul>
            </div>
          </i-col> -->
          <!--<i-col span="12">
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
                    &lt;!&ndash;<span style="margin-left:10px;">&ndash;&gt;
                    &lt;!&ndash;<Icon type="ios-close-circle" :size="14" style="color:red;" @click="propertyDelete(index)" />&ndash;&gt;
                    &lt;!&ndash;</span>&ndash;&gt;
                  </li>
                </ul>
              </div>
            </div>
          </i-col>-->
        <!-- </Row>
      </div> -->
      <!-- <div class="group-btns">
        <Row>
            <el-button class="btn" type="primary" size="small"  @click="saveConfig">保存</el-button>
            <el-button class="btn" type="primary" size="small" @click="cancel">关闭</el-button>
        </Row>
      </div> -->
      <!-- <el-dialog
        v-model="modal2"
        title="参数设置"
        @on-ok="okAttribute">
        <Form :model="formItem" :label-width="80">
          <FormItem label="参数名称">
            <Input v-model="formItem.nameCn" placeholder="请输入中文名称"></Input>
          </FormItem>
          <FormItem label="变量名">
            <Input v-model="formItem.name" placeholder="请输入变量名"></Input>
          </FormItem>
          <FormItem label="类型">
            <el-select v-model="formItem.type">
              <el-option value="String">字符串</el-option>
              <el-option value="DataValue">数值</el-option>
              <el-option value="Time">时间</el-option>
            </el-select>
          </FormItem>
        </Form>
      </el-dialog> -->
      <el-dialog
        v-model="modal1"
        title="取值"
        @on-ok="okAttribute">
        <Form :model="modal1Obj" :label-width="80" label-position="left">
          <FormItem label="变量类型">
            <el-select v-model="modal1Obj.value_type">
              <el-option :value="key" v-for="(value, key, index) in valueMap">{{value}}</el-option>
            </el-select>
          </FormItem>
          <!--<FormItem label="�>-->
          <!--<Input v-model="modal1Obj.value"></Input>-->
          <!--</FormItem>-->
          <template v-if="modal1Obj.value_type == 'DateTime'">
            <FormItem label="时间格式">
              <el-select v-model="modal1Obj.date_format">
                <el-option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</el-option>
                <el-option value="yyyy-MM-dd">yyyy-MM-dd</el-option>
                <el-option value="MMddyyyy">MMddyyyy</el-option>
                <el-option value="MM/dd/yyyy">MM/dd/yyyy</el-option>
                <el-option value="MM-dd-yyyy">MM-dd-yyyy</el-option>
                <el-option value="MMddyy">MMddyy</el-option>
                <el-option value="yyyyMMdd HHmmss">yyyyMMdd HHmmss</el-option>
                <el-option value="yyyyMMdd HHmmss.SSS">yyyyMMdd HHmmss.SSS</el-option>
                <el-option value="yyyy-MM-dd'T'HH:mm:ss">yyyy-MM-dd'T'HH:mm:ss</el-option>
                <el-option value="yyyy-MM-dd'T'HH:mm:ssZ">yyyy-MM-dd'T'HH:mm:ssZ</el-option>
              </el-select>
              <!--<Input v-model="modal1Obj.date_format" placeholder="请输�.."></Input>-->
            </FormItem>
            <FormItem label="时间类型">
              <el-select v-model="modal1Obj.date_type">
                <el-option value="CurrentDate" selected>当前时间</el-option>
                <el-option value="RelativeDate">相对时间</el-option>
              </el-select>
            </FormItem>
            <template v-if="modal1Obj.date_type == 'RelativeDate'">
              <FormItem label="偏移值">
                <Input v-model="modal1Obj.relative_to_current_date_delta" placeholder="请输入.."></Input>
              </FormItem>
              <FormItem label="偏移类型">
                <el-select v-model="modal1Obj.relative_to_current_date_type">
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
          <template v-if="modal1Obj.value_type == 'Static'">
            <FormItem label="值">
              <Input v-model="modal1Obj.data_value" placeholder="请输入.."></Input>
            </FormItem>
          </template>
          <template v-if="modal1Obj.value_type == 'DocumentProperty'">
            <!-- <FormItem label="属性类�>
              <el-select v-model="formItem.property_name.type">
                <el-option value="DocumentProperty">数据�文档属�/Option>
                <el-option value="SystemProperty">系统变量</el-option>
              </el-select>
            </FormItem> -->
            <FormItem label="属性名称">
              <Input v-model="modal1Obj.property_name" placeholder="请输入.."></Input>
            </FormItem>
          </template>
          <template v-if="modal1Obj.value_type == 'SystemProperty'">
            <!-- <FormItem label="属性类�>
              <el-select v-model="formItem.property_name.type">
                <el-option value="DocumentProperty">数据�文档属�/Option>
                <el-option value="SystemProperty">系统变量</el-option>
              </el-select>
            </FormItem> -->
            <FormItem label="属性名性">
              <Input v-model="modal1Obj.property_name" placeholder="请输入.."></Input>
            </FormItem>
          </template>
          <template v-if="modal1Obj.value_type == 'Arguments'">
            <FormItem label="属性名性">
              <el-select v-model="modal1Obj.property_name">
                <el-option  :value="item.name" v-for="item in startArgs">{{item.title}}</el-option>
              </el-select>
            </FormItem>
          </template>
        </Form>
      </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'drag-drawer-content',
  props:['curDiagram'],
  data () {
    return {
      startGroup: [],
      inRowNum: 0,
      outRowNum: 0,
      paramIdx: 0,
      inParams: [],
      outParams: [],
      attributeList: [],
//      startTypeList: [
//        {
//          value: 'string',
//          label: '字符串'
//        },
//        {
//          value: 'number',
//          label: '数字'
//        },
//        {
//          value: 'datetime',
//          label: '时间'
//        }
//      ],
      formItem: {
        default_value: [],
        nameCn: '',
        name: '',
        type: 'String'
      },
      nameMap: { String: '字符串', DataValue: '数值', Time: '时间'  },
      valueMap: {
        SystemProperty: '系统变量',
        CurrentData: '当前数据',
        DocumentProperty: '数据/文档属性',
        Static: '静态值',
        DateTime: '时间值',
        Arguments: '输入参数'
      },
      modal1: false,
      modal2: false,
      modal1Obj: {
        property_name: '',
        data_value: '',
        relative_to_current_date_type: '',
        relative_to_current_date_delta: '',
        date_type: '',
        date_format: '',
        value_type: ''
      },
      opType: 1 // 1新增输入参数  2新增输出参数
    }
  },
  mounted () {
    // var properties = this.curDiagram.getProperties();
    // if(properties.arguments){
    //   this.inParams = [...properties.arguments]
    // }
    // if(properties.outputs){
    //   this.outParams = [...properties.outputs]
    // }
  },
  methods: {
    syncReturnData(data){
      this.outParams = [
        ...data,
        ...this.outParams
      ]
    },
    saveConfig () {
      let data = {
        arguments: this.inParams,
        outputs:this.outParams
      }
      this.$emit('arguments', data);
//      var tagGroup = {}
//      this.startGroup.forEach((item, index)=>{
//          if(!item.title){
//            tagGroup[index] = false
//          }else{
//            tagGroup[index] = true
//          }
//          if(!item.name){
//            tagGroup[index] = false
//          }else{
//            tagGroup[index] = true
//          }
//      })
//      if(tagGroup.length>0) {
//        var tagValues = Object.values(tagGroup)
//        if(eval(tagValues.join('&&'))){
//          let data = {
//            arguments: this.startGroup,
//            outputs:this.outParams
//          }
//          this.$emit('arguments', data)
//        }else{
//          this.$Notice.error({
//            title: '参数名称或英文名称不能为空'
//          });
//        }
//      }else {
//        this.$emit('arguments', {arguments: []})
//      }

    },
    startAddData () {
      this.startGroup.push({
        id: this.startGroup.length + 1,
        type: 'string',
        name: '',
        title: ''
      })
    },
    startDeleteData () {
      if (this.startGroup == 1) return
      this.startGroup.splice(this.startGroup.length - 1, 1)
    },
    delThis (index) {
      this.startGroup.splice(index, 1)
    },
    cancel(){
      this.$emit('cancel')
    },
    deleteItem(){
      this.$emit('delete')
      this.$emit('cancel')
    },
    setAttributes (tag) {
      this.modal2 = true
      this.opType = tag
      this.resetForm()
    },
    checkedParamRow (index) {
      this.paramIdx = index
    },
    checkedRow (index,tag) {
        if(tag ==1){
          this.inRowNum = index
        }
        if(tag ==2){
          this.outRowNum = index
        }
    },
    resetParam(){
        this.modal1Obj = {
        property_name: '',
          data_value: '',
          relative_to_current_date_type: '',
          relative_to_current_date_delta: '',
          date_type: '',
          date_format: '',
          value_type: ''
      }
    },
      resetForm(){
      this.formItem = {
          default_value: [],
          nameCn: '',
          name: '',
          type: 'String'
      }
    },
    editAtr (tag) {
      this.modal2 = true
//      this.opType = tag
      var cur = {};
      if(tag == 1){
        cur = this.inParams[this.inRowNum]
      }
      if(tag == 2){
        cur = this.outParams[this.outRowNum]
      }
      this.formItem.type = cur.type
      this.formItem.name = cur.name
      this.formItem.nameCn = cur.nameCn

    },
    propertyDelete (tag) {
      if(tag == 1){
        this.inParams.splice(this.inRowNum, 1)
      }
      if(tag == 2){
        this.outParams.splice(this.outRowNum, 1)
      }
    },
    upAtr (tag) {
      var list = this.inParams, idx = this.inRowNum;
      if(tag == 1){
        list = this.inParams;
        idx = this.inRowNum;
      }
      if(tag == 2){
         list = this.outParams;
         idx = this.outRowNum;
      }
      if (idx > 0) {
        var item = list.splice(idx, 1)
        list.splice(idx - 1, 0, item[0])
        if(tag == 1){
          this.inParams = list
          this.inRowNum = idx - 1
        }
        if(tag == 2){
          this.outParams = list
          this.outRowNum = idx - 1
        }
      }
    },
    downAtr (tag) {
      var list = this.inParams, idx = this.inRowNum;
      if(tag == 1){
        list = this.inParams;
        idx = this.inRowNum;
      }
      if(tag == 2){
        list = this.outParams;
        idx = this.outRowNum;
      }
      if (idx > -1) {
        if (idx < list.length - 1) {
          var item = list.splice(idx, 1)
          list.splice(idx + 1, 0, item[0])
          if(tag == 1){
            this.inParams = list
            this.inRowNum = idx + 1
          }
          if(tag == 2){
            this.outParams = list
            this.outRowNum = idx + 1
          }
        }
      }
    },

    setParameter () {
      this.modal1 = true
      this.opType = 3
      this.resetParam()
    },
    editParam () {
      this.modal1 = true
      this.opType = 4
      var cur = this.attributeList[this.inRowNum].default_value[this.paramIdx]
      if (cur) {
        this.paramObj = { ...cur }
      }
    },
    paramDelete () {
      this.attributeList[this.inRowNum].default_value.splice(this.paramIdx, 1)
      var paramLen = this.attributeList[this.inRowNum].default_value.length
      if( (this.paramIdx +1) > paramLen){
        this.paramIdx = paramLen -1
      }
    },
    upPam () {
      var list = this.attributeList[this.inRowNum].default_value
      var idx = this.paramIdx
      if (idx > 0) {
        var item = list.splice(idx, 1)
        list.splice(idx - 1, 0, item[0])
        this.attributeList[this.inRowNum].default_value = list
        this.paramIdx = idx - 1
      }
    },
    downPam () {
      var list = this.attributeList[this.inRowNum].default_value
      var idx = this.paramIdx
      if (idx > -1) {
        if (idx < list.length - 1) {
          var item = list.splice(idx, 1)
          list.splice(idx + 1, 0, item[0])
          this.attributeList[this.inRowNum].default_value = list
          this.paramIdx = idx + 1
        }
      }
    },
    okAttribute () {
      if (this.opType == 1) { //inParam
        this.inParams.push(this.formItem)
        this.inRowNum = this.inParams.length - 1
      }
      if (this.opType == 2) {  //outParam
        let item = { ...this.formItem };
        delete item.default_value;
        this.outParams.push(this.formItem)
        this.outRowNum = this.outParams.length - 1
      }
      if (this.opType == 3) { //新增默认值
//          this.attributeList.push(this.modal1Obj)
//          this.paramIdx = this.attributeList.length - 1
        let afr = this.inParams[this.inRowNum].default_value
        afr.push({...this.modal1Obj})
         this.paramIdx = afr.length - 1
      }
      if (this.opType == 4) { //修改默认值
        this.modal1Obj  = {...this.inParams[this.inRowNum].default_value[this.paramIdx]}
      }


    },

  },

  watch: {
    // 'type': function (newVal) {
    //   this.type = newVal
    // }
  }
}
</script>

<style scoped>
  .mt10{
    margin-top: 10px;
  }
  .delBtn{
    line-height: 32px;
  }
  .group-wrap{
    height: 100%;
    position: relative;
    padding: 15px;
    overflow: hidden;
    /*display: flex;*/
    /*flex-direction: column;*/
  }
  .group-content{
   /*flex-grow: 1;*/
    margin-bottom: 10px;
    height:calc(100% - 36px);
    overflow-y: auto;
    overflow-x:hidden;
  }
  .group-content > div{
    margin-bottom: 10px;
  }
  .group-btns{
    border-top: 1px solid #dadada;
    padding-left:15px;
    background-color: white;
    position: absolute;
    bottom:0;
    left:0;
    width:100%;
  }

  .group-btns .btn{
    margin-right: 15px;
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
  .param-btns{
    margin-top: 10px;
  }
  .param-btns .icon{
    margin-right: 5px;
  }
  .atrChecked{
    background-color: #5a6268;
    color:white;
  }
</style>
