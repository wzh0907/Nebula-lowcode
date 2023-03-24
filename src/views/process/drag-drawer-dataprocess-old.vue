<template>
  <!--  路由组件  -->
  <div class="group-wrap">
    <div class="group-content">

      <p class="route-title1">
        数据流程形状为您提供了许多用于在流程中操作文档数据的选项，从拆分和组合文档到压缩和解压缩数据。可以定义多个处理步骤来对文档数据执行多个操作。处理步骤按数据处理形状中定义的顺序执行每个处理步骤对从上一处理步骤输出的数据进行操作。      </p>

      <i-form  :label-width="80" label-position="left">
        <Form-item label="显示名称">
          <i-input v-model="title" placeholder="请输入"></i-input>
        </Form-item>
        <!--<Form-item label="路线">-->
          <!--<i-input :value.sync="routeByString" readonly placeholder="选择..." @on-focus="setAttributes" icon="ios-search-outline"></i-input>-->
        <!--</Form-item>-->
      </i-form>

      <h3 class="route-title2">处理步骤</h3>
      <Row>
        <Icon type="ios-add-circle" class="mr5" :size="22" @click="addNewRoute" />
        <Icon type="ios-close-circle" class="mr5" :size="22" @click="delProcess"></Icon>
        <Icon class="mr5"  type="ios-arrow-up" :size="26"  @click="up" />
        <Icon class="mr5" type="ios-arrow-down" :size="26"  @click="down" />
        <Icon class="mr5" type="ios-copy" :size="22"  @click="copy" />
      </Row>
      <Row :gutter="30">
        <i-col span="10">
          <div class="spp-box-list" style="min-height: 300px;">
            <!--<p class="spp-title" >新路线</p>-->
            <ul class="routeByList">
              <li v-for="(item, index) in attributeList" @click="select(index)" v-bind:class="{routeByChecked:index==processIdx}">
                <!--<span>{{ item.type }}</span>-->
                <span>{{   typeMap[item.process_type] }}</span>
                <!--<span style="margin-left:10px;">-->
                <!--<Icon type="ios-close-circle" :size="14" style="color:red;" @click="propertyDelete(index)" />-->
                <!--</span>-->
              </li>
            </ul>
          </div>
        </i-col>
        <i-col span="14" v-if="attributeList.length > 0">
          <Form :label-width="100" class="routeBy-form" label-position="left">
            <FormItem label="处理类型" >
              <el-select v-model="processForm.process_type" @on-change="changeType">
                <el-option value="AddField">字段扩展</el-option>
                <el-option value="AppendTo">行扩展</el-option>
                <el-option value="CustomScript">自定义脚本</el-option>
                <el-option value="ExecString">字符串处理</el-option>
                <el-option value="ExecTime">时间处理</el-option>
                <el-option value="ExecExpression">数值计算</el-option>
              </el-select>
            </FormItem>
            <!--<FormItem label="选择脚本源" >-->
              <!--<Radio-group :model.sync="source" vertical>-->
                <!--<Radio value="usc">-->
                  <!--<span>使用脚本组件</span>-->
                <!--</Radio>-->
                <!--<Radio value="uis">-->
                  <!--<span>使用内联脚本</span>-->
                <!--</Radio>-->
              <!--</Radio-group>-->
            <!--</FormItem>-->
            <FormItem label="语言" v-if="processForm.process_type == 'CustomScript'">
              <el-select v-model="processForm.language" @on-change="langChange">
                <!-- <el-option value="groovy">Groovy 1.5</el-option> -->
                <!-- <el-option value="groovy2">Groovy 2.4</el-option> -->
                <el-option value="javascript">JavaScript</el-option>
              </el-select>
            </FormItem>
            <FormItem label="值" v-if="processForm.process_type == 'CustomScript'">
              <Input v-model="processForm.code" type="textarea" :autosize="false" :rows="7" placeholder="请输入..." ></Input>
            </FormItem>

            <FormItem label="目标对象" v-if="processForm.process_type == 'AppendTo'">
              <Input :value="getPropStr('target')" placeholder="请输入.."  @on-focus="setTarget('target')" icon="ios-search-outline" readonly></Input>
            </FormItem>
            <FormItem label="值" v-if="processForm.process_type == 'AppendTo'">
              <Input :value="getValueStr('value')" placeholder="请输入.."  @on-focus="setValue('value')" icon="ios-search-outline" readonly></Input>
            </FormItem>
            <FormItem label="目标对象" v-if="processForm.process_type == 'AddField'">
              <Input :value="getPropStr('target')" placeholder="请输入.."  @on-focus="setTarget('target')" icon="ios-search-outline" readonly></Input>
            </FormItem>
            <FormItem label="字段名" v-if="processForm.process_type == 'AddField'">
              <Input v-model="processForm.name" @on-change="changeName('name')"/>
            </FormItem>
            <FormItem label="值" v-if="processForm.process_type == 'AddField'">
              <Input :value="getValueStr('value')" placeholder="请输入.."  @on-focus="setValue('value')" icon="ios-search-outline" readonly></Input>
            </FormItem>

            <!--<el-option value="ExecString">字符串处理</el-option>-->
            <FormItem label="处理方式" v-if="processForm.process_type == 'ExecString'">
              <el-select v-model="processForm.op" @on-change="langChange">
                <el-option value="splitstring">截取</el-option>
                <el-option value="findstring">查询</el-option>
                <el-option value="replacestring">替换</el-option>
              </el-select>
            </FormItem>
            <FormItem label="结果" v-if="processForm.process_type == 'ExecString' ">
              <!--<Input v-model="processForm.target" @on-change="changeName('target')"/>-->
              <Input :value="getPropStr('target')" placeholder="请输入.."  @on-focus="setTarget('target')" icon="ios-search-outline" readonly></Input>

            </FormItem>
            <FormItem label="字符串" v-if="processForm.process_type == 'ExecString'">
              <!--<Input v-model="processForm.source" @on-change="changeName('source')"/>-->
              <Input :value="getValueStr('source')" placeholder="请输入.."  @on-focus="setValue('source')" icon="ios-search-outline" readonly></Input>

            </FormItem>
            <FormItem label="起始位置" v-if="processForm.process_type == 'ExecString'&&　processForm.op　=='splitstring'">
              <!--<Input v-model="processForm.start" @on-change="changeName('start')"/>-->
              <Input :value="getValueStr('start')" placeholder="请输入.."  @on-focus="setValue('start')" icon="ios-search-outline" readonly></Input>

            </FormItem>
            <FormItem label="结束位置" v-if="processForm.process_type == 'ExecString'&&　processForm.op　=='splitstring'">
              <!--<Input v-model="processForm.end" @on-change="changeName('end')"/>-->
              <Input :value="getValueStr('end')" placeholder="请输入.."  @on-focus="setValue('end')" icon="ios-search-outline" readonly></Input>

            </FormItem>
            <FormItem label="查找" v-if="processForm.process_type == 'ExecString'&&　processForm.op　=='findstring'">
              <!--<Input v-model="processForm.query" @on-change="changeName('query')"/>-->
              <Input :value="getValueStr('query')" placeholder="请输入.."  @on-focus="setValue('query')" icon="ios-search-outline" readonly></Input>

            </FormItem>
            <FormItem label="匹配规则" v-if="processForm.process_type == 'ExecString'&&　processForm.op　=='replacestring'">
              <!--<Input v-model="processForm.regex" @on-change="changeName('regex')"/>-->
              <Input :value="getValueStr('regex')" placeholder="请输入.."  @on-focus="setValue('regex')" icon="ios-search-outline" readonly></Input>

            </FormItem>
            <FormItem label="替换为" v-if="processForm.process_type == 'ExecString'&&　processForm.op　=='replacestring'">
              <!--<Input v-model="processForm.replace" @on-change="changeName('replace')"/>-->
              <Input :value="getValueStr('replace')" placeholder="请输入.."  @on-focus="setValue('replace')" icon="ios-search-outline" readonly></Input>

            </FormItem>

            <!--<el-option value="ExecTime">时间处理</el-option>-->

            <FormItem label="结果" v-if="processForm.process_type == 'ExecTime'">
              <!--<Input v-model="processForm.target" @on-change="changeName('target')"/>-->
              <Input :value="getPropStr('target')" placeholder="请输入.."  @on-focus="setTarget('target')" icon="ios-search-outline" readonly></Input>

            </FormItem>
            <FormItem label="偏移基数" v-if="processForm.process_type == 'ExecTime'">
              <Input :value="getValueStr('source')" placeholder="请输入.."  @on-focus="setValue('source')" icon="ios-search-outline" readonly></Input>
            </FormItem>
            <FormItem label="偏移值" v-if="processForm.process_type == 'ExecTime'">
              <Input :value="getValueStr('delta')" placeholder="请输入.."  @on-focus="setValue('delta')" icon="ios-search-outline" readonly></Input>
            </FormItem>
            <FormItem label="偏移类型" v-if="processForm.process_type == 'ExecTime'">
              <el-select v-model="processForm.delta_type">
                <el-option value="Second(s)">秒</el-option>
                <el-option value="Minute(s)">分</el-option>
                <el-option value="Hour(s)">时</el-option>
                <el-option value="Day(s)">天</el-option>
                <el-option value="Week(s)">周</el-option>
                <el-option value="Month(s)">月</el-option>
                <el-option value="Year(s)">年</el-option>
              </el-select>
            </FormItem>

            <!--<el-option value="ExecExpression">数值计算</el-option>-->
            <FormItem label="数值1" v-if="processForm.process_type == 'ExecExpression'">
              <Input :value="getValueStr('value1')" placeholder="请输入.."  @on-focus="setValue('value1')" icon="ios-search-outline" readonly></Input>
            </FormItem>
            <FormItem label="操作符" v-if="processForm.process_type == 'ExecExpression'">
              <el-select v-model="processForm.op">
                <el-option value="+">+</el-option>
                <el-option value="-">-</el-option>
                <el-option value="*">*</el-option>
                <el-option value="|">➗</el-option>
                <el-option value="/">取整</el-option>
                <el-option value="%">取余</el-option>
              </el-select>
            </FormItem>
            <FormItem label="数值2" v-if="processForm.process_type == 'ExecExpression'">
              <Input :value="getValueStr('value2')" placeholder="请输入.."  @on-focus="setValue('value2')" icon="ios-search-outline" readonly></Input>
            </FormItem>
            <FormItem label="等于" v-if="processForm.process_type == 'ExecExpression'">
              <Input :value="getPropStr('target')" placeholder="请输入.."  @on-focus="setTarget('target')" icon="ios-search-outline" readonly></Input>
            </FormItem>








          </Form>
        </i-col>
      </Row>
    </div>
    <el-dialog
      v-model="modal2"
      title="变量"
      @on-ok="okAttribute">
      <Form  :label-width="80">
        <FormItem label="变量类型">
          <el-select v-model="modal2Obj.type">
            <el-option value="CurrentData">当前数据</el-option>
            <el-option value="SystemProperty">系统变量</el-option>
          </el-select>
        </FormItem>
        <FormItem label="变量名称" v-if="modal2Obj.type =='SystemProperty'">
          <Input v-model="modal2Obj.name" placeholder="请输入..."/>
        </FormItem>
      </Form>
    </el-dialog>
    <el-dialog
      v-model="modal1"
      title="取值"
      @on-ok="modal1Ok">
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
  name: 'drag-drawer-dataprocess',
  props: ['flow', 'curDiagram'],
  data () {
    return {
      codeMap: {
        groovy: 'import java.util.Properties;' +
            'import java.io.InputStream;' +
              'for( int i = 0; i < dataContext.getDataCount(); i++ ) {' +
            'InputStream is = dataContext.getStream(i);' +
              'Properties props = dataContext.getProperties(i);' +
            'dataContext.storeStream(is, props);' +
              '}',
        groovy2: 'import java.util.Properties;' +
            'import java.io.InputStream;' +
            'for( int i = 0; i < dataContext.getDataCount(); i++ ) {' +
            'InputStream is = dataContext.getStream(i);' +
            'Properties props = dataContext.getProperties(i);' +
            'dataContext.storeStream(is, props);' +
            '}',
        javascript: ''
        // "for( var i = 0; i < dataContext.getDataCount(); i++ ) {"+
        // "var is = dataContext.getStream(i)"+
        // "var props = dataContext.getProperties(i);"+
        // "dataContext.storeStream(is, props);"+
        // "}"
      },
      typeMap: { CustomScript: '自定义脚本', AppendTo: '行扩展', AddField: '字段扩展',
      ExecString: '字符串处理', ExecTime: '时间处理', ExecExpression: '数值计算' },
      nameMap: { CurrentData: '当前数据', SystemProperty: '系统变量' },
      valueMap: {
        SystemProperty: '系统变量',
        CurrentData: '当前数据',
        DocumentProperty: '数据/文档属性',
        Static: '静态值',
        DateTime: '时间值',
        Arguments: '输入参数'
      },
      targetStr: '',
      valueStr: '',
      processForm: {
        process_type: 'AddField',
        language: 'javascript',
        code: '',
        target: '', // PropertyName类型 {}  【和字符串、时间处理、数值计算】 共用
        value: '', // DataValue类型 {}
        name: '',

        /*字符串处理*/
        op:'splitstring', //splitstring || findstring || replacestring
        source:'',//字符串
        //splitstring
        start: 0, //起始位置
        end: 0, //结束位置
        //findstring
        query: "", //查询
        //replacestring
        regex: "", //正则
        replace: "", //替换为

        /*时间处理*/
        source: "", //偏移基数，DataValue类型
        delta: "", //偏移值, DataValue类型
        delta_type: "",//偏移类型 分秒时天周月

        /*数值计算*/
        value1: "", //数值1 DataValue类型
        op: "", //操作符号
        value2: "", //数值2  DataValue类型


      },
      modal1Obj: {
        property_name: '',
        data_value: '',
        relative_to_current_date_type: '',
        relative_to_current_date_delta: '',
        date_type: '',
        date_format: '',
        value_type: ''
      },
      modal2Obj: {
        type: '',
        name: ''
      },
      curProp:'',
      modal1: false,
      modal2: false,
      attributeList: [],
      title: '',
      processIdx: 0,
      startArgs: []
    }
  },
  mounted () {
    this.startArgs = this.flow.getArgs()
    var properties = this.curDiagram.getProperties()
    this.attributeList = properties.steps || []
    this.title = this.curDiagram.title
    this.select(this.processIdx)
  },

  methods: {
    changeName (name) {
      this.attributeList[this.processIdx][name] = this.processForm[name]
    },
    okAttribute () {
      this.processForm.target = this.modal2Obj
      if(this.modal2Obj.type== 'CurrentData'){
        this.modal2Obj.name = ''
      }
      this.targetStr = this.modal2Obj.type ? (this.nameMap[this.modal2Obj.type] + ' ' + this.modal2Obj.name) : ''
      this.attributeList[this.processIdx].target = { ...this.modal2Obj }
    },
    modal1Ok () {
      this.processForm[this.curProp] = this.modal1Obj
      var { value_type, data_value, date_type, date_format, relative_to_current_date_delta, relative_to_current_date_type, property_name } = this.modal1Obj
      this.attributeList[this.processIdx][this.curProp] = this.modal1Obj
//      if (value_type == 'Static') {
//        this.valueStr = '静态值' + (data_value || '')
//      }
//      if (value_type == 'DateTime') {
//        if (date_type == 'CurrentDate') {
//          this.valueStr = '时间日期' + (date_type || '') + '-' + (date_format || '')
//        }
//        if (date_type == 'RelativeDate') {
//          this.valueStr = '时间日期' + (date_type || '') + '-:Current Date' + (relative_to_current_date_delta || '') + ' ' + (relative_to_current_date_type || '')
//        }
//      }
//
//      if (value_type == 'CurrentData') {
//        this.valueStr = '当前数据'
//      }
//      if (value_type == 'DocumentProperty') {
//        (this.valueStr = '文档属性' + (property_name || ''))
//      }
//      if (value_type == 'SystemProperty') {
//        (this.valueStr = '系统变量 ' + (property_name || ''))
//      }
//      if (value_type == 'Arguments') {
//        (this.valueStr = '输入参数' + (property_name || ''))
//      }
    },
    changeType () {
      this.attributeList[this.processIdx].process_type = this.processForm.process_type
      this.resetForm()
    },
    setTarget (name) {
      this.modal2 = true
      this.curProp = name
      this.modal2Obj = {
        type: '',
        name: '',
        ...this.attributeList[this.processIdx].name
      } || {}
    },
    setValue (name) {
      this.modal1 = true
      this.curProp = name
      this.modal1Obj = {...this.attributeList[this.processIdx][name]} || {}
    },
    langChange () {
      this.processForm.code = this.codeMap[this.processForm.language]
    },

    select (idx) {
      this.processIdx = idx
      this.processForm = this.attributeList[idx]
      this.targetStr = ''
      if (this.processForm) {
        this.processForm.target && (this.targetStr = (this.nameMap[this.processForm.target.type] || '') + ' ' + (this.processForm.target.name || ''))
        var { value_type, data_value, date_type, date_format, relative_to_current_date_delta, relative_to_current_date_type, property_name } = this.processForm.value
        this.valueStr = ''
        if (value_type == 'Static') {
          this.valueStr = '静态值' + data_value
        }
        if (value_type == 'DateTime') {
          if (date_type == 'CurrentDate') {
            this.valueStr = '时间日期' + date_type + '-' + date_format
          }
          if (date_type == 'RelativeDate') {
            this.valueStr = '时间日期' + date_type + '-:Current Date' + relative_to_current_date_delta + ' ' + relative_to_current_date_type
          }
        }

        if (value_type == 'CurrentData') {
          this.valueStr = '当前数据'
        }
        if (value_type == 'DocumentProperty') {
          property_name && (this.valueStr = '文档属性' + property_name)
        }
        if (value_type == 'SystemProperty') {
          property_name && (this.valueStr = '系统变量 ' + property_name)
        }
        if (value_type == 'Arguments') {
          property_name && (this.valueStr = '输入参数 ' + property_name)
        }
      }
    },
    saveConfig () {
      var result = { title: this.title, steps: this.attributeList }
      this.$emit('arguments', result)
    },

    addNewRoute () {
      var newscript = {
        process_type: 'AddField',
        language: 'javascript',
        code: this.codeMap['javascript'],
        target: '', // PropertyName类型
        value: '', // DataValue类型
        name: ''
      }
      this.targetStr = ''
      this.valueStr = ''
      this.attributeList.push(newscript)
      this.processIdx = this.attributeList.length -1
      this.processForm = newscript
    },
    delProcess () {
      this.attributeList.splice(this.processIdx, 1)
      var vm = this.attributeList[this.processIdx]
      var len = this.attributeList.length
      if (vm) {
        this.select(this.processIdx)
      } else {
        if (len > 0) {
          this.processIdx--
          this.select(this.processIdx)
        }
      }
    },
    cancel () {
      this.$emit('cancel')
    },
    deleteItem(){
      this.$emit('delete')
      this.$emit('cancel')
    },
    resetForm () {
      this.processForm = {
        ...this.processForm,
        language: 'javascript',
        code: '',
        target: '', // PropertyName类型
        value: '', // DataValue类型
        name: '',
        /*字符串处理*/
        op:'splitstring', //splitstring || findstring || replacestring
        target:'',//结果变量名   【和时间处理、数值计算】 共用
        source:'',//字符串
        //splitstring
        start: 0, //起始位置
        end: 0, //结束位置
        //findstring
        query: "", //查询
        //replacestring
        regex: "", //正则
        replace: "", //替换为

        /*时间处理*/
        source: "", //偏移基数，DataValue类型
        delta: "", //偏移值, DataValue类型
        delta_type: "",//偏移类型 分秒时天周月

        /*数值计算*/
        value1: "", //数值1 DataValue类型
        op: "", //操作符号
        value2: "", //数值2  DataValue类型
      }
    },
    up () {
      var list = this.attributeList
      var idx = this.processIdx
      if (idx > 0) {
        var item = list.splice(idx, 1)
        list.splice(idx - 1, 0, item[0])
        this.attributeList = list
        this.processIdx = idx - 1
      }
    },
    down () {
      var list = this.attributeList
      var idx = this.processIdx
      if (idx > -1) {
        if (idx < list.length - 1) {
          var item = list.splice(idx, 1)
          list.splice(idx + 1, 0, item[0])
          this.attributeList = list
          this.processIdx = idx + 1
        }
      }
    },
    copy () {
      var cur = this.attributeList[this.processIdx]
      let newcur = Object.assign({}, cur)
      newcur.target = Object.assign({}, cur.target)
      newcur.value = Object.assign({}, cur.value)
      console.log(cur, newcur)
      this.attributeList.push(newcur)
    },
    getValueStr(name){
     return typeof this.processForm[name] == 'object' ? `${this.valueMap[this.processForm[name].value_type]} ${this.processForm[name].property_name}` :this.processForm[name]
    },
    getPropStr(key){
     return typeof this.processForm[key] == 'object' ? `${this.nameMap[this.processForm[key].type]} ${this.processForm[key].name}` :this.processForm[key]
    }
  },

  watch: {

  }
}
</script>

<style scoped>
  .mt10{
    margin-top: 10px;
  }
  .mr10{
    margin-right: 10px;
  }
  .mr5{
    margin-right: 5px;
  }
  ul li {
    list-style-type: none;
  }
  .spp-box-list{
    position: relative;
    border: 1px solid #d6d6d6;
    /*padding:0 10px 10px 10px;*/
    border-radius: 5px;
    margin-top: 10px;
    overflow: hidden;
    /*padding-top:28px;*/
  }
  /*.spp-title{*/
  /*position: absolute;top:0;left:0; background: #e5e5e5;padding: 5px 10px;*/
  /*width:calc(100%);*/
  /*}*/
  .routeByList{
    width:100%;
    line-height: 28px;
  }
  .routeByList li {
    /*width:100%;*/
    padding:0 10px;

  }
  .ivu-form-item{
    margin-bottom: 10px;
  }
  .route-title1{
    padding-bottom:15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #e1e1e1;
  }
  .route-title2{
    padding: 10px 0 5px 0;
    border-bottom: 1px solid #e1e1e1;
    margin-bottom: 15px;
  }
  .routeBy-form{
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
  .routeByChecked{
    background-color: #5a6268;
    color:white;
  }

  .group-btns .btn{
    margin-right: 15px;
  }

</style>
