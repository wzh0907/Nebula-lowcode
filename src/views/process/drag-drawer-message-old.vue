<template>
  <div class="group-wrap">
    <div class="group-content">
      <p class="group-title">
        消息组件提供了根据输入参数集生成任意形式的消息文本的功能。定义消息文本的形式，消息组件根据参数进行处理，输出完成的消息。
      </p>
      <Form class="command-form" :model="formItem" :label-width="80" label-position="left">
        <FormItem label="显示名称" >
          <Input  v-model="showName"></Input>
        </FormItem>
        <!--<FormItem label="类型" >-->
          <!--<el-select v-model="type">-->
            <!--<el-option value="SQL">SQL Statement</el-option>-->
            <!--<el-option value="StoredProcedure">Store Procedure</el-option>-->
            <!--<el-option value="SystemCommand">System Command</el-option>-->
          <!--</el-select>-->
        <!--</FormItem>-->
        <FormItem label="选项">
          <Checkbox v-model="single">将文档合并为单个消息</Checkbox>
        </FormItem>
        <!--<FormItem label="连接" v-if="type=='SQL' || type=='SP' ">-->
          <!--&lt;!&ndash;<Input  v-model="connection"></Input>&ndash;&gt;-->
          <!--<i-select v-model="connection" filterable>-->
            <!--&lt;!&ndash;<i-option v-for="item in cityList" :value="item.value">{{ item.label }}</i-option>&ndash;&gt;-->
          <!--</i-select>-->
        <!--</FormItem>-->
        <FormItem label="消息" >
          <Input  v-model="message" type="textarea"  :rows="4" placeholder="在此处输入你的消息，使用“{1}”插入变量。"></Input>
        </FormItem>

        <!--<FormItem label="程序名称" v-if="type=='SP'">-->
          <!--<Input  v-model="procedure"  placeholder="在这里输入程序名，使用{1}插入变量。"></Input>-->
        <!--</FormItem>-->
        <!--<FormItem label="命令" v-if="type=='COMMAND'">-->
          <!--<Input  v-model="command"  placeholder="在这里输入命令，使用{1}插入变量。"></Input>-->
        <!--</FormItem>-->
        <FormItem label="变量" >
          <Row class="param-btns">
            <Icon class="icon" type="ios-add-circle" :size="20" @click="addVar" />
            <Icon class="icon" type="md-create" :size="20"  @click="editVar" />
            <Icon class="icon" type="ios-close-circle" :size="20"  @click="delVar" />
          </Row>
          <div class="spp-box-list" >
            <ul>
              <li v-for="(item,index) in varList"  @click="select(index)" :class="{activeRow: index== rowIdx,atrItem:index!=rowIdx}">
                <span>{{ valueMap[item.value_type] }}</span>
                <span v-if="item.value_type == 'DateTime'">{{ item.date_format }}</span>
                <span v-if="item.value_type == 'DateTime'">-{{ item.date_type }}</span>
                <span v-if="item.value_type == 'DateTime'">-{{ item.relative_to_current_date_delta }}</span>
                <span v-if="item.value_type == 'DateTime'">-{{ item.relative_to_current_date_type }}</span>
                <span v-if="item.value_type == 'Static'">{{ item.data_value }}</span>
                <span v-if="item.value_type == 'DocumentProperty' || item.value_type == 'SystemProperty'"> {{ item.property_name }}</span>

              </li>
            </ul>
          </div>
        </FormItem>
      </Form>
    </div>
    <el-dialog
      v-model="modal1"
      title="变量值"
      @on-ok="ok">
      <Form :model="formItem" :label-width="80">
        <FormItem label="取值范围">
          <el-select v-model="formItem.value_type">
            <el-option :value="key" v-for="(value, key, index) in valueMap">{{value}}</el-option>
          </el-select>
        </FormItem>
        <template v-if="formItem.value_type == 'DateTime'">
          <FormItem label="时间格式">
            <!--<Input v-model="formItem.date_format" placeholder="请输入..."></Input>-->
            <el-select v-model="formItem.date_format">
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
            <el-select v-model="formItem.date_type">
              <el-option value="CurrentDate">当前日期/时间</el-option>
              <el-option value="RelativeDate">相对日期/时间</el-option>
            </el-select>
          </FormItem>
          <template v-if="formItem.date_type == 'RelativeDate'">
            <FormItem label="偏移值">
              <Input v-model="formItem.relative_to_current_date_delta" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="偏移类型">
              <el-select v-model="formItem.relative_to_current_date_type">
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
        <template v-if="formItem.value_type == 'Static'">
          <FormItem label="值">
            <Input v-model="formItem.data_value" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="formItem.value_type == 'DocumentProperty'">
          <FormItem label="属性名称">
            <Input v-model="formItem.property_name" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="formItem.value_type == 'SystemProperty'">
          <FormItem label="属性名称">
            <Input v-model="formItem.property_name" placeholder="请输入..."></Input>
          </FormItem>
        </template>
        <template v-if="formItem.value_type == 'Arguments'">
          <FormItem label="属性名称">
            <el-select v-model="formItem.property_name">
              <el-option :value="item.name" v-for="item in startArgs">{{item.title}}</el-option>
            </el-select>
          </FormItem>
        </template>
      </Form>
    </el-dialog>

    <div class="group-btns">
      <Row>
        <el-button class="btn" type="error" size="small" @click="deleteItem">删除</el-button>
        <el-button class="btn" type="primary" size="small" @click="saveConfig">保存</el-button>
        <el-button class="btn" type="primary" size="small" @click="cancel">关闭</el-button>
      </Row>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'drag-drawer-command',
    props:['flow','curDiagram'],
    data () {
      return {
        showName:'',
//        type:'SQL',
        single:false,
        connection:'',
        message:'',
        procedure:'',
        command:'',
        varList:[],
        formItem: {
          data_value: '',
          relative_to_current_date_type: '',
          relative_to_current_date_delta: '',
          date_type: '',
          date_format: '',
          value_type: 'SystemProperty',
          property_name:'',
        },
        modal1: false,
        rowIdx:0,
        opType:1,//1新增 2编辑
        startArgs:[],
        valueMap: {
          SystemProperty: '系统变量',
          CurrentData: '当前数据',
          DocumentProperty: '数据/文档属性',
          Static: '静态值',
          DateTime: '时间值',
          Arguments: '输入参数'
        },

      }
    },
    mounted(){
      this.startArgs = this.flow.getArgs();
      var properties = this.curDiagram.getProperties();
      this.showName =  this.curDiagram.title ||''
      this.message = properties.message || ''
      this.varList = properties.variables || []
    },
    methods: {
      select(index){
        this.rowIdx = index
      },
      addVar(){
        this.resetMadal();
        this.modal1 = true;
        this.opType = 1
      },
      editVar(){
        this.formItem =  {...this.varList[this.rowIdx]}
        this.modal1 = true;
        this.opType = 2
      },
      delVar(){
        this.varList.splice(this.rowIdx, 1)
      },
      ok(){
        if(this.opType == 1){
          this.varList.push(this.formItem)
        }
        if(this.opType == 2){
          this.varList[this.rowIdx] = this.formItem
        }
      },
      resetMadal(){
        this.formItem = {
          data_value: '',
          relative_to_current_date_type: '',
          relative_to_current_date_delta: '',
          date_type: '',
          date_format: '',
          value_type: 'SystemProperty',
          property_name:'',
        }
      },

      saveConfig () {
        let configJson = {
          title:this.showName,
          message: this.message,
          variables:this.varList
        }
        this.$emit('arguments', configJson)
      },
      cancel(){
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
  .mt10{
    margin-top: 10px;
  }
  ul li {
    list-style-type: none;
  }
  .spp-box-list{
    border: 1px solid #d6d6d6;
    border-radius: 5px;
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
  .group-content{
    /*margin-bottom: 10px;*/
    height:calc(100% - 30px);
    overflow-y: auto;
    overflow-x:hidden;
    padding:15px;
  }
  .group-title{
    padding-bottom:15px;
    margin-bottom: 20px;
    border-bottom:1px solid #dadada;
  }
  .activeRow{
    background: #e5e5e5;
  }
  .spp-box-list{
    border: 1px solid #d6d6d6;
    /*padding: 10px;*/
    border-radius: 5px;
    margin-top: 10px;
    min-height:100px;
  }
  .spp-box-list li.atrItem:hover{
    background-color: #f6f6f6;
  }
  .spp-box-list li {
    cursor:pointer;
    line-height: 24px;
    padding:0 5px;
  }
  .command-form .ivu-form-item{
    margin-bottom: 10px;
  }
  .group-btns .btn{
    margin-right: 15px;
  }
</style>

