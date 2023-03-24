<template>
  <!--  决策组件  -->
  <div class="group-wrap">
    <div class="group-content">
    <p style="margin-bottom: 10px;">决策形状基于两个值的正确/错误比较来路由文档。这些值可以是任何值，包括当前文档（配置文件元素）中的字段值，静态值，数据库结果，应用程序查询等等。</p>
    <Form :model="formItem" :label-width="80">
      <FormItem label="第一值">
        <Input  :value.sync="firstString"
               @on-focus="showModal1(1)" placeholder="请选择..." icon="ios-search-outline" readonly></Input>
        <!--<p style="border: 1px solid #e5e5e5; border-radius: 5px; padding: 0 8px;" @click="showModal1(1)">-->
          <!--<span>{{ firstData.value_type }}</span>-->
          <!--<span>{{ firstData.date_format }}</span>-->
          <!--<span>{{ firstData.date_type }}</span>-->
          <!--<span>{{ firstData.relative_to_current_date_delta }}</span>-->
          <!--<span>{{ firstData.relative_to_current_date_type }}</span>-->
          <!--<span>{{ firstData.data_value }}</span>-->
          <!--<span>{{ firstData.property_name }}</span>-->
          <!--&lt;!&ndash;<Icon type="md-create" :size="16" style="color:blue; cursor:pointer; margin-left: 10px;" />&ndash;&gt;-->
        <!--</p>-->
      </FormItem>
      <FormItem label="比较">
        <el-select v-model="op">
          <el-option value="===">等于</el-option>
          <el-option value=">">大于</el-option>
          <el-option value="<">小于</el-option>
          <el-option value=">=">大于等于</el-option>
          <el-option value="<=">小于等于</el-option>
          <el-option value="<>">不等于</el-option>
        </el-select>
      </FormItem>
      <FormItem label="第二值">
        <Input :value.sync="secondString"
               @on-focus="showModal1(2)" placeholder="请选择..." icon="ios-search-outline" readonly></Input>
        <!--<p style="border: 1px solid #e5e5e5; border-radius: 5px; padding: 0 8px;" @click="showModal1(2)">-->
          <!--<span>{{ secondData.value_type }}</span>-->
          <!--<span>{{ secondData.date_format }}</span>-->
          <!--<span>{{ secondData.date_type }}</span>-->
          <!--<span>{{ secondData.relative_to_current_date_delta }}</span>-->
          <!--<span>{{ secondData.relative_to_current_date_type }}</span>-->
          <!--<span>{{ secondData.data_value }}</span>-->
          <!--<span>{{ secondData.property_name }}</span>-->
          <!--<Icon type="md-create" :size="16" style="color:blue; cursor:pointer; margin-left: 10px;" />-->
        <!--</p>-->
      </FormItem>
    </Form>
    </div>
    <el-dialog
      v-model="modal1"
      title="添加值"
      @on-ok="okIf">
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
  name: 'drag-drawer-if',
  props: ['flow', 'curDiagram'],
  data () {
    return {
      formItem: {
        data_value: '',
        relative_to_current_date_type: '',
        relative_to_current_date_delta: '',
        date_type: '',
        date_format: '',
        value_type: '',
        property_name: '',
        name: '',
        type: ''
      },
      op: '',
      modal1: false,
      //        modal2: false,
      firstData: {},
      secondData: {},
      firstString: '',
      secondString: '',
      num: 0,
      startArgs: [],
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
  mounted () {
    this.firstData = { ...this.formItem }
    this.secondData = { ...this.formItem }
    this.startArgs = this.flow.getArgs()
    var properties = this.curDiagram.getProperties()
    //      if(properties.arguments){
    //        this.startGroup = properties.arguments
    //      }
    //      left_value: this.firstData,
    //        op: this.op,
    //        right_value: this.secondData
    //      this.firstData =  properties.left_value
    this.op = properties.op || ''
    //      this.secondData =  properties.right_value

    this.okIf(1, properties.left_value),
    this.okIf(2, properties.right_value)
  },
  methods: {
    showModal1 (num) {
      this.modal1 = true
      if (num == 1) {
        this.num = 1
        this.formItem = { ...this.firstData }
      }
      if (num == 2) {
        this.num = 2
        this.formItem = { ...this.secondData }
      }
    },
    // 模态框确定按钮触发事件
    okIf (tag, data) {
      if (this.num == 1 || tag == 1) {
        var firstData = this.firstData = (data || { ...this.formItem })
        var str = this.valueMap[firstData.value_type] || ''
        var type = firstData.value_type
        if (type == 'Static') {
          str += ((firstData.data_value + ' ') || '')
        }
        if (type == 'DateTime') {
          if (firstData.date_type == 'CurrentDate') {
            str += ((firstData.date_type || '') + (firstData.date_format || ''))
          }
          if (firstData.date_type == 'RelativeDate') {
            str += ((firstData.date_type || '') + (firstData.date_format || '') + (firstData.relative_to_current_date_type || '') + (firstData.relative_to_current_date_delta || ''))
          }
        }
        if (type == 'CurrentData') {
          str = str
        }
        if (type == 'DocumentProperty') {
          str += (firstData.property_name || '')
        }
        if (type == 'SystemProperty') {
          str += (firstData.property_name || '')
        }
        if (type == 'Arguments') {
          str += (firstData.property_name || '')
        }
        this.firstString = str
      }
      if (this.num == 2 || tag == 2) {
        var secondData = this.secondData = (data || { ...this.formItem })
        var str = this.valueMap[secondData.value_type] || ''
        var type = secondData.value_type
        if (type == 'Static') {
          str += ((secondData.data_value + ' ') || '')
        }
        if (type == 'DateTime') {
          if (secondData.date_type == 'CurrentDate') {
            str += ((secondData.date_type || '') + (secondData.date_format || ''))
          }
          if (secondData.date_type == 'RelativeDate') {
            str += ((secondData.date_type || '') + (secondData.date_format || '') + (secondData.relative_to_current_date_type || '') + (secondData.relative_to_current_date_delta || ''))
          }
        }
        if (type == 'CurrentData') {
          str = str
        }
        if (type == 'DocumentProperty') {
          str += (secondData.property_name || '')
        }
        if (type == 'SystemProperty') {
          str += (secondData.property_name || '')
        }
        if (type == 'Arguments') {
          str += (secondData.property_name || '')
        }
        this.secondString = str
      }
    },
    // 模态框取消按钮触发事件
    cancel () {
      this.formItem = {}
    },
    // 属性列表删除项
    propertyDelete (index) {
      this.attributeList.splice(index, 1)
    },

    saveConfig () {
      let configJson = {
        left_value: this.firstData,
        op: this.op,
        right_value: this.secondData
      }
      this.$emit('arguments', configJson)
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
  .mt10{
    margin-top: 10px;
  }
  ul li {
    list-style-type: none;
  }
  .spp-box-list{
    border: 1px solid #d6d6d6;
    padding: 10px;
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
  .group-btns .btn{
    margin-right: 15px;
  }
</style>
