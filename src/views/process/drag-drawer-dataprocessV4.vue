<template>
  <!--  函数组件  -->
  <div class="group-wrap">
    <div class="group-content">
      <p class="group-text">
        数据流程形状为您提供了许多用于在流程中操作文档数据的选项，从拆分和组合文档到压缩和解压缩数据。可以定义多个处理步骤来对文档数据执行多个操作。处理步骤按数据处理形状中定义的顺序执行每个处理步骤对从上一处理步骤输出的数据进行操作。
      </p>

      <el-form label-width="80px" label-position="left">
        <el-form-item label="节点名称">
          <el-input size="small"  v-model="title" placeholder="请输入"></el-input>
        </el-form-item>
        <!--<Form-item label="路线">-->
        <!--<i-input :value.sync="routeByString" readonly placeholder="选择..." @on-focus="setAttributes" icon="ios-search-outline"></i-input>-->
        <!--</Form-item>-->
      </el-form>

      <h3 class="route-title2">处理步骤</h3>
      <el-row>
        <el-collapse v-model="cVal">
          <el-collapse-item
            :name="'' + attributeIndex"
            :title="funcNameShow(attributeItem)"
            v-for="(attributeItem, attributeIndex) in attributeList"
          >
            <!-- {{ attributeItem.funcType+'/'+attributeItem.funcName }} -->
            <!-- 结果集=函数名（参数1，参数2，参数3） -->
            <!-- {{ attributeItem.target.name+'='+attributeItem.funcName +'('}}        -->
            <!-- {{ funcNameShow(attributeItem) }} -->
            <div>
              <el-form
                label-width="50px"
                class="routeBy-form"
                label-position="left"
              >
                <!-- 2020-06-08 修改数据处理为函数 -->
                <!-- <FormItem label="函数">
                  <el-select v-model="attributeItem.funcType" class="func-select">
                    <el-option :value="func.key" v-for="func in functionTypeList">{{func.key}}</el-option>
                  </el-select>
                  <el-button
                    class="btn"
                    type="primary"
                    size="small"
                    v-if="attributeItem.funcType=='自定义'"
                    @click="newFunc"
                  >新建</el-button>
                  <el-select
                    v-model="attributeItem.funcName"
                    @on-change="funcChange(attributeItem.funcName,attributeIndex)"
                    class="func-select"
                  >
                    <el-option
                      v-for="(item,index) in FList"
                      v-if="item.type==attributeItem.funcType"
                      :value="item.name"
                    >{{item.name}}</el-option>
                  </el-select>
                </FormItem>-->
                <el-form-item label="函数">
                  <el-select
                    v-model="attributeItem.funcName"
                    class="new-func-select"
                    @change="
                      funcChange(attributeItem.funcName, attributeIndex)
                    "
                  >
                    <el-optionGroup :label="nf.name" v-for="nf in newFList">
                      <el-option :value="func.name" v-for="func in nf.funcList">{{
                        func.name
                      }}</el-option>
                    </el-optionGroup>
                  </el-select>
                </el-form-item>
                <div v-if="attributeItem.funcName">
                  <el-form-item
                    v-if="attributeItem.funcName"
                    :label="param.name"
                    label-width="50px"
                    v-for="(param, index) in attributeItem.chosenFunc.paramNodes"
                  >
                    <div
                      style="width: 100%"
                      class="form-input"
                      v-if="param.name == '单位'"
                    >
                      <el-select
                        v-model="attributeItem.args[index].name"
                        class="var-select"
                        clearable
                        @on-change="
                          dateValueUnitSelect(attributeItem.args[index], index)
                        "
                      >
                        <el-option :value="unit.value" v-for="unit in unitList">{{
                          unit.name
                        }}</el-option>
                      </el-select>
                    </div>
                    <div
                      style="width: 100%"
                      class="form-input"
                      v-else-if="param.name == 'Map对象'"
                    >
                      <el-select
                        v-model="attributeItem.args[index].category"
                        class="var-select"
                      >
                        <el-option
                          :value="variable.name"
                          v-for="variable in variableList"
                          >{{ variable.name }}</el-option
                        >
                      </el-select>
                    </div>
                    <div
                      style="width: 100%"
                      class="form-input"
                      v-else-if="param.name == '格式化'"
                    >
                      <el-select
                        v-model="attributeItem.args[index].name"
                        class="var-select"
                      >
                        <el-option
                          :value="variable.name"
                          v-for="variable in formateList"
                          >{{ variable.name }}</el-option
                        >
                      </el-select>
                    </div>
                    <div v-else>
                      <VarSelect
                        :key="'dataprocess-param-' + attributeIndex + index"
                        :data="attributeItem.args[index]"
                        :type="'param-' + attributeIndex + '-' + index"
                        @setVar="setVar"
                      />
                    </div>
                  </el-form-item>
                </div>
                <div
                  v-if="
                    attributeItem.funcName &&
                    attributeItem.chosenFunc.resultNodes
                  "
                >
                  <el-form-item
                    label-width="50px"
                    :label="result.name"
                    v-for="(result, chosenI) in attributeItem.chosenFunc
                      .resultNodes"
                    v-if="
                      attributeItem.funcName &&
                      attributeItem.chosenFunc.resultNodes
                    "
                  >
                    
                    <VarSelect
                      :key="'dataprocess-result-' + attributeIndex"
                      :data="attributeItem.target"
                      :type="'result-' + attributeIndex + '-'"
                      @setVar="setVar"
                    />
                  </el-form-item>
                </div>
              </el-form>
              <div v-if="attributeItem.chosenFunc">
                <i
                  class="iconfont iconxinxi"
                  style="font-size: 18px; margin-right: 5px"
                ></i>
                {{ attributeItem.chosenFunc.resultText }}
              </div>
              <div class="opt-btn">
                <div @click="delProcess(attributeIndex)">X删除</div>
                <div @click="up(attributeIndex)">上移</div>
                <div @click="down(attributeIndex)">下移</div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div @click="addNewRoute" class="opt-add-btn">添加步骤</div>
      </el-row>
      <h3>备注</h3>
      <el-input
        v-model="remark"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 15 }"
        placeholder="Enter something..."
      />

     
    </div>
    <!-- <el-dialog v-model="modal2" title="变量" @on-ok="okAttribute">
      <Form :label-width="80">
        <FormItem label="变量类型">
          <el-select v-model="modal2Obj.type">
            <el-option value="CurrentData">当前数据</el-option>
            <el-option value="SystemProperty">系统变量</el-option>
          </el-select>
        </FormItem>
        <FormItem label="变量名称" v-if="modal2Obj.type =='SystemProperty'">
          <Input v-model="modal2Obj.name" placeholder="请输入..." />
        </FormItem>
      </Form>
    </el-dialog>
    <el-dialog v-model="modal1" title="取值" @on-ok="modal1Ok">
      <Form :model="modal1Obj" :label-width="80" label-position="left">
        <FormItem label="变量类型">
          <el-select v-model="modal1Obj.value_type">
            <el-option :value="key" v-for="(value, key, index) in valueMap">{{value}}</el-option>
          </el-select>
        </FormItem>
    <!--<FormItem label="�>-->
    <!--<Input v-model="modal1Obj.value"></Input>-->
    <!--</FormItem>-->
    <!-- <template v-if="modal1Obj.value_type == 'DateTime'">
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
    <template v-if="modal1Obj.value_type == 'DocumentProperty'">-->
    <!-- <FormItem label="属性类�>
            <el-select v-model="formItem.property_name.type">
              <el-option value="DocumentProperty">数据�文档属�/Option>
              <el-option value="SystemProperty">系统变量</el-option>
            </el-select>
    </FormItem>-->
    <!-- <FormItem label="属性名称">
            <Input v-model="modal1Obj.property_name" placeholder="请输入.."></Input>
          </FormItem>
        </template>
    <template v-if="modal1Obj.value_type == 'SystemProperty'">-->
    <!-- <FormItem label="属性类�>
            <el-select v-model="formItem.property_name.type">
              <el-option value="DocumentProperty">数据�文档属�/Option>
              <el-option value="SystemProperty">系统变量</el-option>
            </el-select>
    </FormItem>-->
    <!-- <FormItem label="属性名性">
            <Input v-model="modal1Obj.property_name" placeholder="请输入.."></Input>
          </FormItem>
        </template>
        <template v-if="modal1Obj.value_type == 'Arguments'">
          <FormItem label="属性名性">
            <el-select v-model="modal1Obj.property_name">
              <el-option :value="item.name" v-for="item in startArgs">{{item.title}}</el-option>
            </el-select>
          </FormItem>
        </template>
      </Form>
    </el-dialog>-->
    <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem"
          >删除</el-button
        >
        <el-button class="btn btns-save" type="primary" @click="saveConfig"
          >保存</el-button
        >
      </el-row>
    </div>
  </div>
</template>

<script>
import VarSelect from "./module/variable-selectV4";
// import { getFunctionList } from "@/api/function";
// import { getVariableList } from "@/api/variable";
import { mapActions, mapMutations } from "vuex";
import Konva from "konva";
export default {
  name: "drag-drawer-dataprocess",
  components: {
    VarSelect,
  },
  props: ["flow", "curDiagram", "processId"],
  data() {
    return {
      codeMap: {
        groovy:
          "import java.util.Properties;" +
          "import java.io.InputStream;" +
          "for( int i = 0; i < dataContext.getDataCount(); i++ ) {" +
          "InputStream is = dataContext.getStream(i);" +
          "Properties props = dataContext.getProperties(i);" +
          "dataContext.storeStream(is, props);" +
          "}",
        groovy2:
          "import java.util.Properties;" +
          "import java.io.InputStream;" +
          "for( int i = 0; i < dataContext.getDataCount(); i++ ) {" +
          "InputStream is = dataContext.getStream(i);" +
          "Properties props = dataContext.getProperties(i);" +
          "dataContext.storeStream(is, props);" +
          "}",
        javascript: "",
        // "for( var i = 0; i < dataContext.getDataCount(); i++ ) {"+
        // "var is = dataContext.getStream(i)"+
        // "var props = dataContext.getProperties(i);"+
        // "dataContext.storeStream(is, props);"+
        // "}"
      },
      typeMap: {
        CustomScript: "自定义脚本",
        AppendTo: "行扩展",
        AddField: "字段扩展",
        ExecString: "字符串处理",
        ExecTime: "时间处理",
        ExecExpression: "数值计算",
      },
      nameMap: { CurrentData: "当前数据", SystemProperty: "系统变量" },
      valueMap: {
        SystemProperty: "系统变量",
        CurrentData: "当前数据",
        DocumentProperty: "数据/文档属性",
        Static: "静态值",
        DateTime: "时间值",
        Arguments: "输入参数",
      },
      targetStr: "",
      valueStr: "",
      processForm: {
        process_type: "AddField",
        language: "javascript",
        code: "",
        target: "", // PropertyName类型 {}  【和字符串、时间处理、数值计算】 共用
        value: "", // DataValue类型 {}
        name: "",

        /*字符串处理*/
        op: "splitstring", //splitstring || findstring || replacestring
        source: "", //字符串
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
        delta_type: "", //偏移类型 分秒时天周月

        /*数值计算*/
        value1: "", //数值1 DataValue类型
        op: "", //操作符号
        value2: "", //数值2  DataValue类型
        funcType: "",
      },
      modal1Obj: {
        property_name: "",
        data_value: "",
        relative_to_current_date_type: "",
        relative_to_current_date_delta: "",
        date_type: "",
        date_format: "",
        value_type: "",
      },
      modal2Obj: {
        type: "",
        name: "",
      },
      curProp: "",
      modal1: false,
      modal2: false,
      attributeList: [],
      title: "",
      remark: "",
      processIdx: 0,
      startArgs: [],
      formateList: [
        {
          name: "yyyy-MM-dd hh:mm:ss",
        },
        {
          name: "yyyy-MM-dd",
        },
        {
          name: "yyyy-MM",
        },
        {
          name: "hh:mm:ss",
        },
        {
          name: "yyyy",
        },
        {
          name: "MM",
        },
        {
          name: "dd",
        },
        {
          name: "hh",
        },
        {
          name: "mm",
        },
        {
          name: "ss",
        },
      ],
      newFList: [
        {
          name: "数值",
          funcList: [
            {
              name: "加法",
              function: "SYS_ADD",
              type: "数值",
              chosen: false,
              resultText: "结果=参数1 + 参数2",
              paramNodes: [
                {
                  name: "参数1",
                },
                {
                  name: "参数2",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "减法",
              function: "SYS_SUB",
              type: "数值",
              chosen: false,
              resultText: "结果=参数1 - 参数2",
              paramNodes: [
                {
                  name: "参数1",
                },
                {
                  name: "参数2",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "乘法",
              function: "SYS_MUL",
              type: "数值",
              chosen: false,
              resultText: "结果=参数1 X 参数2",
              paramNodes: [
                {
                  name: "参数1",
                },
                {
                  name: "参数2",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "除法",
              function: "SYS_DIV",
              type: "数值",
              chosen: false,
              resultText: "结果=参数1 / 参数2",
              paramNodes: [
                {
                  name: "参数1",
                },
                {
                  name: "参数2",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "绝对值",
              function: "SYS_ABS",
              type: "数值",
              chosen: false,
              resultText: "结果=参数1绝对值",
              paramNodes: [
                {
                  name: "参数1",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "取整",
              function: "SYS_FLOOR",
              type: "数值",
              chosen: false,
              resultText: "结果=参数1",
              paramNodes: [
                {
                  name: "数值",
                },
                {
                  name: "小数",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "四舍五入",
              function: "SYS_RINT",
              type: "数值",
              chosen: false,
              resultText: "结果=参数1",
              paramNodes: [
                {
                  name: "参数1",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
          ],
        },
        {
          name: "字符串",
          funcList: [
            {
              name: "字符串相连",
              function: "SYS_CONCAT",
              type: "字符串",
              chosen: false,
              resultText: "结果=参数1 与 参数2字符串相连",
              paramNodes: [
                {
                  name: "参数1",
                },
                {
                  name: "参数2",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "字符串替换",
              function: "SYS_REPLACE",
              type: "字符串",
              chosen: false,
              resultText: "结果=参数3 替换 参数2",
              paramNodes: [
                {
                  name: "原字符串",
                },
                {
                  name: "替换内容",
                },
                {
                  name: "被替换内容",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "字符串分割",
              function: "SYS_SPLIT",
              type: "字符串",
              chosen: false,
              resultText: "结果=参数1 根据 参数2 进行分割",
              paramNodes: [
                {
                  name: "参数1",
                },
                {
                  name: "参数2",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "切换大写",
              function: "SYS_TOUPPER",
              type: "字符串",
              chosen: false,
              resultText: "结果=参数1 转换成大写",
              paramNodes: [
                {
                  name: "参数1",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "切换小写",
              function: "SYS_TOLOWER",
              type: "字符串",
              chosen: false,
              resultText: "结果=参数1 转换成小写",
              paramNodes: [
                {
                  name: "参数1",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "两侧去空",
              function: "SYS_TRIM",
              type: "字符串",
              chosen: false,
              resultText: "结果=参数1 前后去空",
              paramNodes: [
                {
                  name: "参数1",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "字符串长度",
              function: "SYS_STR_LENGTH",
              type: "字符串",
              chosen: false,
              resultText: "结果=参数1长度",
              paramNodes: [
                {
                  name: "参数1",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "取子字符串",
              function: "SYS_STR_SUBSTRING",
              type: "字符串",
              chosen: false,
              resultText: "结果=substring(参数1,from,to) ",
              paramNodes: [
                {
                  name: "参数1",
                },
                {
                  name: "from",
                },
                {
                  name: "to",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
          ],
        },
        {
          name: "日期",
          funcList: [
            {
              name: "日期格式化",
              function: "SYS_DATE_FORMAT",
              type: "日期",
              chosen: false,
              resultText: "结果=参数1根据格式化进行日期转换",
              paramNodes: [
                {
                  name: "参数",
                },
                {
                  name: "格式化",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "获取当前日期",
              function: "SYS_DATE_NOW",
              type: "日期",
              chosen: false,
              resultText: "结果=获取当前日期",
              paramNodes: [],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "日期添加",
              function: "SYS_DATE_ADD",
              type: "日期",
              chosen: false,
              resultText: "结果=参数1 + （参数2）单位",
              paramNodes: [
                {
                  name: "参数1",
                },
                {
                  name: "参数2",
                },
                {
                  name: "单位",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "日期减少",
              function: "SYS_DATE_SUB",
              type: "日期",
              chosen: false,
              resultText: "结果=参数1 - （参数2）单位",
              paramNodes: [
                {
                  name: "参数1",
                },
                {
                  name: "参数2",
                },
                {
                  name: "单位",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "本周一",
              function: "SYS_DATE_1DAYOFWEEK",
              type: "日期",
              chosen: false,
              paramNodes: [],
              resultText: "结果=本周第一天",
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "本周日",
              function: "SYS_DATE_7DAYOFWEEK",
              type: "日期",
              chosen: false,
              paramNodes: [],
              resultText: "结果=本周日",
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "当月第一天",
              function: "SYS_DATE_FIRSTDAYOFMONTH",
              type: "日期",
              chosen: false,
              paramNodes: [],
              resultText: "结果=当月第一天",
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "当月最后一天",
              function: "SYS_DATE_LASTDAYOFMONTH",
              type: "日期",
              chosen: false,
              paramNodes: [],
              resultText: "结果=当月最后一天",
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "上个月第一天",
              function: "SYS_DATE_FIRSTDAYOFLASTMONTH",
              type: "日期",
              chosen: false,
              paramNodes: [],
              resultText: "结果=上个月第一天",
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
            {
              name: "上个月最后一天",
              function: "SYS_DATE_LASTDAYOFLASTMONTH",
              type: "日期",
              chosen: false,
              paramNodes: [],
              resultText: "结果=上个月最后一天",
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
          ],
        },
        {
          name: "列表",
          funcList: [
            {
              name: "追加",
              function: "SYS_LIST_ADD",
              type: "列表",
              chosen: false,
              resultText: "结果=列表+参数1",
              paramNodes: [
                {
                  name: "参数1",
                },
                {
                  name: "列表",
                },
              ],
              resultNodes: [],
            },
            {
              name: "列表取值",
              function: "SYS_LIST_GET",
              type: "列表",
              chosen: false,
              resultText: "结果=列表[index]",
              paramNodes: [
                {
                  name: "列表",
                },
                {
                  name: "index",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
          ],
        },
        {
          name: "其他",
          funcList: [
            {
              name: "赋值",
              function: "SYS_ASSIGN",
              type: "其他",
              chosen: false,
              resultText: "结果=参数1",
              paramNodes: [
                {
                  name: "参数1",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
          ],
        },
        {
          name: "对象",
          funcList: [
            {
              name: "获取属性值",
              function: "SYS_MAP_GET",
              type: "对象",
              chosen: false,
              resultText: "结果=Map.getKey",
              paramNodes: [
                {
                  name: "Map对象",
                },
                {
                  name: "key",
                },
              ],
              resultNodes: [
                {
                  name: "结果",
                },
              ],
            },
          ],
        },
        {
          name: "自定义",
          funcList: [],
        },
      ],
      functionTypeList: [
        {
          key: "数值",
        },
        {
          key: "字符串",
        },
        {
          key: "日期",
        },
        {
          key: "列表",
        },
        {
          key: "其他",
        },
        {
          key: "对象",
        },
        {
          key: "自定义",
        },
      ],
      FList: [
        {
          name: "加法",
          function: "SYS_ADD",
          type: "数值",
          chosen: false,
          resultText: "结果=参数1 + 参数2",
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "减法",
          function: "SYS_SUB",
          type: "数值",
          chosen: false,
          resultText: "结果=参数1 - 参数2",
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "乘法",
          function: "SYS_MUL",
          type: "数值",
          chosen: false,
          resultText: "结果=参数1 X 参数2",
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "除法",
          function: "SYS_DIV",
          type: "数值",
          chosen: false,
          resultText: "结果=参数1 / 参数2",
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "绝对值",
          function: "SYS_ABS",
          type: "数值",
          chosen: false,
          resultText: "结果=参数1绝对值",
          paramNodes: [
            {
              name: "参数1",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },

        {
          name: "字符串相连",
          function: "SYS_CONCAT",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数1 与 参数2字符串相连",
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "字符串替换",
          function: "SYS_REPLACE",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数3 替换 参数2",
          paramNodes: [
            {
              name: "原字符串",
            },
            {
              name: "替换内容",
            },
            {
              name: "被替换内容",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "字符串分割",
          function: "SYS_SPLIT",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数1 根据 参数2 进行分割",
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "切换大写",
          function: "SYS_TOUPPER",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数1 转换成大写",
          paramNodes: [
            {
              name: "参数1",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "切换小写",
          function: "SYS_TOLOWER",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数1 转换成小写",
          paramNodes: [
            {
              name: "参数1",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "两侧去空",
          function: "SYS_TRIM",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数1 前后去空",
          paramNodes: [
            {
              name: "参数1",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        // {
        //   name: "左侧去空",
        //   type: "字符串",
        //   chosen: false,
        //   paramNodes: [
        //     {
        //       name: "参数1"
        //     }
        //   ],
        //   resultNodes: [
        //     {
        //       name: "结果"
        //     }
        //   ]
        // },
        // {
        //   name: "右侧去空",
        //   type: "字符串",
        //   chosen: false,
        //   paramNodes: [
        //     {
        //       name: "参数1"
        //     }
        //   ],
        //   resultNodes: [
        //     {
        //       name: "结果"
        //     }
        //   ]
        // },
        {
          name: "日期格式化",
          function: "SYS_DATE_FORMAT",
          type: "日期",
          chosen: false,
          resultText: "结果=参数1根据格式化进行日期转换",
          paramNodes: [
            {
              name: "参数",
            },
            {
              name: "格式化",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "获取当前日期",
          function: "SYS_DATE_NOW",
          type: "日期",
          chosen: false,
          resultText: "结果=获取当前日期",
          paramNodes: [],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "日期添加",
          function: "SYS_DATE_ADD",
          type: "日期",
          chosen: false,
          resultText: "结果=参数1 + （参数2）单位",
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
            {
              name: "单位",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "日期减少",
          function: "SYS_DATE_SUB",
          type: "日期",
          chosen: false,
          resultText: "结果=参数1 - （参数2）单位",
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "参数2",
            },
            {
              name: "单位",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "当月第一天",
          function: "SYS_DATE_FIRSTDAYOFMONTH",
          type: "日期",
          chosen: false,
          paramNodes: [],
          resultText: "结果=当月第一天",
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "当月最后一天",
          function: "SYS_DATE_LASTDAYOFMONTH",
          type: "日期",
          chosen: false,
          paramNodes: [],
          resultText: "结果=当月最后一天",
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "赋值",
          function: "SYS_ASSIGN",
          type: "其他",
          chosen: false,
          resultText: "结果=参数1",
          paramNodes: [
            {
              name: "参数1",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "追加",
          function: "SYS_LIST_ADD",
          type: "列表",
          chosen: false,
          resultText: "结果=列表+参数1",
          paramNodes: [
            {
              name: "参数1",
            },
            {
              name: "列表",
            },
          ],
          resultNodes: [],
        },
        {
          name: "获取属性值",
          function: "SYS_MAP_GET",
          type: "对象",
          chosen: false,
          resultText: "结果=Map.getKey",
          paramNodes: [
            {
              name: "Map对象",
            },
            {
              name: "key",
            },
          ],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
      ],
      chosenFunc: {},
      funcType: "",
      funcName: "",
      variableList: [],
      subVariables: [],
      propertyName: {},
      dataValue: {},
      unitList: [
        {
          name: "年",
          value: "year",
        },
        {
          name: "月",
          value: "month",
        },
        {
          name: "日",
          value: "day",
        },
        {
          name: "时",
          value: "hour",
        },
        {
          name: "分",
          value: "minute",
        },
        {
          name: "秒",
          value: "second",
        },
      ],
      cVal: "",
    };
  },
  mounted() {
    this.startArgs = this.flow.getArgs();
    var properties = JSON.parse(
      JSON.stringify(this.curDiagram.getProperties())
    );
    this.attributeList = properties.steps || [];
    this.title = this.curDiagram.title;
    this.remark = properties.remark;
    if (this.attributeList[this.processIdx]) {
      this.showfunc(this.attributeList[this.processIdx].funcName);
      // this.select(this.processIdx);
      // this.funcChange(this.attributeList[this.processIdx].funcName,this.processIdx)
    }
    this.showAllFuncArgs();

    this.variableList = this.$store.getters.varTagList;

  },
  methods: {
    ...mapActions(["getVariableList"]),
    changeName(name) {
      this.attributeList[this.processIdx][name] = this.processForm[name];
    },
    okAttribute() {
      this.processForm.target = this.modal2Obj;
      if (this.modal2Obj.type == "CurrentData") {
        this.modal2Obj.name = "";
      }
      this.targetStr = this.modal2Obj.type
        ? this.nameMap[this.modal2Obj.type] + " " + this.modal2Obj.name
        : "";
      this.attributeList[this.processIdx].target = { ...this.modal2Obj };
    },
    modal1Ok() {
      this.processForm[this.curProp] = this.modal1Obj;
      var {
        value_type,
        data_value,
        date_type,
        date_format,
        relative_to_current_date_delta,
        relative_to_current_date_type,
        property_name,
      } = this.modal1Obj;
      this.attributeList[this.processIdx][this.curProp] = this.modal1Obj;
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
    changeType() {
      this.attributeList[
        this.processIdx
      ].process_type = this.processForm.process_type;
      this.resetForm();
    },
    setTarget(name) {
      this.modal2 = true;
      this.curProp = name;
      this.modal2Obj =
        {
          type: "",
          name: "",
          ...this.attributeList[this.processIdx].name,
        } || {};
    },
    setValue(name) {
      this.modal1 = true;
      this.curProp = name;
      this.modal1Obj = { ...this.attributeList[this.processIdx][name] } || {};
    },
    langChange() {
      this.processForm.code = this.codeMap[this.processForm.language];
    },
    select(idx) {
      this.processIdx = idx;
      this.processForm = this.attributeList[idx];
      this.showfunc(this.attributeList[idx].funcName);
    },
    saveConfig() {
      // funcName去空
      let funcAttrList = [];
      this.attributeList.forEach((item) => {
        if (item.funcName) {
          funcAttrList.push(item);
        }
      });

      // args 去空
      funcAttrList.forEach((item) => {
        let argList = [];
        let isnullFlag = false;
        item.args.forEach((element) => {
          if (
            element.category != "" ||
            element.name != "" ||
            element.value != ""
          ) {
            argList.push(element);
          }
        });
        item.args = argList;
      });
      var result = {
        title: this.title,
        steps: funcAttrList,
        remark: this.remark,
      };
      this.$emit("arguments", result);
    },
    addNewRoute() {
      // var newscript = {
      //   process_type: "AddField",
      //   language: "javascript",
      //   code: this.codeMap["javascript"],
      //   target: "", // PropertyName类型
      //   value: "", // DataValue类型
      //   name: ""
      // };
      var newscript = {
        funcType: "",
        funcName: "",
        function: "",
        args: [],
        target: {
          category: "",
          name: "",
        },
      };
      this.targetStr = "";
      this.valueStr = "";
      this.attributeList.push(newscript);
      this.processForm = newscript;
      console.log(this.attributeList, "this.attributeList");
    },
    delProcess(attributeIndex) {
      this.attributeList.splice(attributeIndex, 1);
      // var vm = this.attributeList[index];
      // var len = this.attributeList.length;
      // if (vm) {
      //   this.select(this.processIdx);
      // } else {
      //   if (len > 0) {
      //     this.processIdx--;
      //     this.select(this.processIdx);
      //   }
      // }
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
    resetForm() {
      this.processForm = {
        ...this.processForm,
        language: "javascript",
        code: "",
        target: "", // PropertyName类型
        value: "", // DataValue类型
        name: "",
        /*字符串处理*/
        op: "splitstring", //splitstring || findstring || replacestring
        target: "", //结果变量名   【和时间处理、数值计算】 共用
        source: "", //字符串
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
        delta_type: "", //偏移类型 分秒时天周月

        /*数值计算*/
        value1: "", //数值1 DataValue类型
        op: "", //操作符号
        value2: "", //数值2  DataValue类型
        funcType: "",
      };
    },
    up(attributeIndex) {
      var list = this.attributeList;
      var idx = attributeIndex;
      if (idx > 0) {
        var item = list.splice(idx, 1);
        list.splice(idx - 1, 0, item[0]);
        this.attributeList = list;
        this.processIdx = idx - 1;
      }
    },
    down(attributeIndex) {
      var list = this.attributeList;
      var idx = attributeIndex;
      if (idx > -1) {
        if (idx < list.length - 1) {
          var item = list.splice(idx, 1);
          list.splice(idx + 1, 0, item[0]);
          this.attributeList = list;
          this.processIdx = idx + 1;
        }
      }
    },
    copy() {
      var cur = this.attributeList[this.processIdx];
      let newcur = Object.assign({}, cur);
      newcur.target = Object.assign({}, cur.target);
      newcur.value = Object.assign({}, cur.value);
      console.log(cur, newcur);
      this.attributeList.push(newcur);
    },
    getValueStr(name) {
      return typeof this.processForm[name] == "object"
        ? `${this.valueMap[this.processForm[name].value_type]} ${
            this.processForm[name].property_name
          }`
        : this.processForm[name];
    },
    getPropStr(key) {
      return typeof this.processForm[key] == "object"
        ? `${this.nameMap[this.processForm[key].type]} ${
            this.processForm[key].name
          }`
        : this.processForm[key];
    },
    funcChange(event, attributeIndex) {
      console.log("funcChange");
      this.newFList.forEach((newF) => {
        newF.funcList.forEach((item) => {
          if (item.name == event) {
            // this.chosenFunc = item;
            this.attributeList[attributeIndex].args = [];

            if (item.type == "自定义") {
              this.attributeList[attributeIndex].function = item.funcName;
            } else {
              this.attributeList[attributeIndex].function = item.function;
            }
            this.attributeList[attributeIndex].chosenFunc = item;
            this.attributeList[attributeIndex].funcType = item.funcType;
            // 选择func 的同时需要对 进行赋值 TODO result
            item.paramNodes.forEach((v) => {
              this.attributeList[attributeIndex].args.push({
                category: "",
                name: "",
                type: 0,
                value: "",
              });
            });
          }
        });
      });
    },
    showfunc(event) {
      //回显专用
      this.FList.forEach((item) => {
        if (item.name == event) {
          this.chosenFunc = item;
          // 选择func 的同时需要对 进行赋值 TODO result
        }
      });
    },
    showAllFuncArgs() {
      for (let i = 0; i < this.attributeList.length; i++) {
        let attr = this.attributeList[i];
        this.FList.forEach((item) => {
          if (attr.funcName == item.name) {
            let needPush =
              item.paramNodes.length - this.attributeList[i].args.length;
            // 2020-08-25
            this.attributeList[i].chosenFunc = item;
            for (let k = 0; k < needPush; k++) {
              var newscript = {
                category: "",
                name: "",
                type: 0,
                value: "",
              };
              this.attributeList[i].args.push(newscript);
            }
            // let resNeedPush = item.resultNodes.length - this.attributeList[i].target.length;
            // for (let j = 0; j < resNeedPush; j++) {
            //   var newtar={
            //     category: "",
            //     name: "",
            //   }
            //   this.attributeList[i].target.push(newtar);
            // }
          }
        });
      }
    },
    variableChange(event) {
      // this.variableList.forEach(item => {
      //   if (item.name == event) {
      //     this.subVariables = JSON.parse(item.variables);
      //   }
      // });
    },
    newFunc() {
      const routeUrl = this.$router.resolve({
        path: `/lumb`,
      });
      window.open(routeUrl.href, "_blank");
    },
    
    dateValueUnitSelect(item, index) {
      this.attributeList[this.processIdx].args[index].type = 0;
    },
    setVar(param, type) {
      let tList = type.split("-");
      if (tList[0] == "param") {
        this.attributeList[tList[1]].args[tList[2]] = {};
        this.attributeList[tList[1]].args[tList[2]] = param;
        this.$set(this.attributeList[tList[1]].args, tList[2], param);
      } else {
        this.attributeList[tList[1]].target = param;
        this.$set(this.attributeList[tList[1]].target, param);
      }
    },
    updateVar() {
      this.$refs.varSelectItem.updateVuexVar();
      // this.$emit("submitVarList", varList);
    },
    funcNameShow(val) {
      let text = "";
      if (val.funcName == "" && val.funcType == "") {
        return text;
      }
      if (val.funcType == "数值") {
        // 数值表达式特殊处理
        text = val.target.name + "=";
        if (val.funcName == "加法") {
          text +=
            this.getShowNameByVal(val.args[0]) +
            "+" +
            this.getShowNameByVal(val.args[1]);
        } else if (val.funcName == "减法") {
          text +=
            this.getShowNameByVal(val.args[0]) +
            "-" +
            this.getShowNameByVal(val.args[1]);
        } else if (val.funcName == "乘法") {
          text +=
            this.getShowNameByVal(val.args[0]) +
            "*" +
            this.getShowNameByVal(val.args[1]);
        } else if (val.funcName == "除法") {
          text +=
            this.getShowNameByVal(val.args[0]) +
            "/" +
            this.getShowNameByVal(val.args[1]);
        } else if (val.funcName == "绝对值") {
          text += "|" + this.getShowNameByVal(val.args[0]) + "|";
        }
      } else {
        text = this.getShowNameByVal(val.target) + "=" + val.funcName + "(";
        val.args.forEach((item) => {
          // text += item.name ? item.name : "" + "+";
          text += this.getShowNameByVal(item) + ",";
        });
        text = text.substring(0, text.length - 1);
        text += ")";
      }

      return text;
    },
    getShowNameByVal(val) {
      if (val.name) {
        return val.name;
      } else if (val.value) {
        return val.value;
      } else if (val.category) {
        return val.category;
      } else {
        return "";
      }
    },
  },
  watch: {},
};
</script>

<style scoped lang="less" >
.mt10 {
  margin-top: 10px;
}
.mr10 {
  margin-right: 10px;
}
ul li {
  list-style-type: none;
}
.spp-box-list {
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
.routeByList {
  width: 100%;
  line-height: 28px;
}

.ivu-form-item {
  margin-bottom: 10px;
}
.route-title1 {
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e1e1e1;
}
.routeBy-form {
  margin-top: 10px;
}
.group-wrap {
  position: relative;
  // height: 100%;
   height: calc(100vh - 100px);
}
.group-btns {
  border-top: 1px solid #dadada;
  background-color: white;
  position: absolute;
  padding-left: 15px;
  bottom: 0;
  left: 0;
  width: 100%;
}
.group-content {
  /*margin-bottom: 10px;*/
  height: calc(~"100% - 30px");
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
}
.routeByChecked {
  background-color: #5a6268;
  color: white;
}

.group-btns .btn {
  margin-right: 15px;
}
.func-select {
  width: 50%;
}
.new-func-select {
  width: 100%;
}
/deep/ .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.ivu-select-group {
  display: flex;
  flex-wrap: wrap;
}
</style>
