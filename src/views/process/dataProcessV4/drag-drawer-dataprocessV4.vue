<template>
  <!--  函数组件  -->
  <div class="group-wrap data-warp">
    <div class="group-content">


      <el-form label-width="80px" label-position="left">
        <el-form-item label="节点名称">
          <el-input style="width:220px;" v-model="title" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>

      <h3 class="route-title2">处理步骤</h3>
       <draggable
              tag="ul"
              class="menu-item-wrap"
              :list="attributeList"
              handle=".handle"
              @end="onDragMoveEnd"
              @start="onDragMoveStart($event, asideMenuComponentConfigList[key])"
            >
            <li v-for="(data,attributeIndex) in attributeList" :key="attributeIndex">
              <div class="menu-item-li" >
                <i class="iconfont iconprojectmenu handle"></i>
                <div class="tree-item-func" @click="data.showFunc=!data.showFunc">{{ data.funcName||'请选择' }}</div>
                <div style="width:80%;display:flex;flex-warp:nowarp" >
                  <div v-for="(resultitem,resKey) in data.expression" :key="resKey">
                   <VarSelect
                    :processId="processId"
                    v-if="resultitem=='结果'"
                    :key="'dataprocess-target-' + attributeIndex+'0'"
                    :data="data.target"
                    :type="'target-' + attributeIndex + '-' + 0"
                    @setVar="setVar"
                    class="menu-item-select"
                  />
                  <VarSelect
                  :processId="processId"
                      v-else-if="resultitem=='变量1'"
                          :key="'dataprocess-param-' + attributeIndex+'0'"
                          :data="data.args[0]"
                          :type="'param-' + attributeIndex + '-' + 0"
                          @setVar="setVar"
                          class="menu-item-select"
                        />
                    <VarSelect
                    :processId="processId"
                        v-else-if="resultitem=='变量2'"
                          :key="'dataprocess-param-' + attributeIndex+'1'"
                          :data="data.args[1]"
                          :type="'param-' + attributeIndex + '-' + 1"
                          @setVar="setVar"
                          class="menu-item-select"
                        />
                        <VarSelect
                        :processId="processId"
                        v-else-if="resultitem=='变量3'"
                          :key="'dataprocess-param-' + attributeIndex+'2'"
                          :data="data.args[2]"
                          :type="'param-' + attributeIndex + '-' + 2"
                          @setVar="setVar"
                          class="menu-item-select"
                        />
                        <div
                          style="width: 100%"
                          class="form-input"
                          v-else-if="resultitem == '格式'"
                        >
                          <el-select
                            v-model="data.args[1].name"
                            class="var-select"
                          >
                            <el-option
                              :value="variable.name"
                              v-for="variable in formateList"
                              >{{ variable.name }}</el-option
                            >
                          </el-select>
                        </div>
                         <div
                          style="width: 100%"
                          class="form-input"
                          v-else-if="resultitem == '单位'"
                        >
                          <el-select
                            v-model="data.args[2].name"
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
                  <el-input size="small" v-model="data.args[1].name" placeholder="key" style="width:80px;line-height: 40px;" v-else-if="resultitem==='key'" />

                  <span v-else-if="operateList.indexOf(resultitem)>-1" class="tree-item-operator">{{resultitem}}</span>
                  <span v-else class="tree-item-text">{{resultitem}}</span>

                </div>
                </div>

                <!-- <VarSelect
                    :key="'dataprocess-target-' + attributeIndex+'0'"
                    :data="data.target"
                    :type="'target-' + attributeIndex + '-' + 0"
                    @setVar="setVar"
                  />
                <span class="tree-item-operator">=</span>
                <VarSelect
                          :key="'dataprocess-param-' + attributeIndex+'0'"
                          :data="data.args[0]"
                          :type="'param-' + attributeIndex + '-' + 0"
                          @setVar="setVar"
                        />
                <span class="tree-item-operator">+</span>
                  <VarSelect
                          :key="'dataprocess-param-' + attributeIndex+'1'"
                          :data="data.args[1]"
                          :type="'param-' + attributeIndex + '-' + 0"
                          @setVar="setVar"
                        /> -->
                <i class="el-icon-delete tree-item-operator" style="cursor: pointer;" @click="delProcess(attributeIndex)"></i>
              </div>
              <ul v-if="data.showFunc" >
                <li v-for="(func,key) in currentFuncList" :key="key" @click="funcChange(func.name, attributeIndex)">{{func.name}}</li>
              </ul>
            </li>

       </draggable>
      <div @click="addNewRoute" class="opt-add-btn">添加步骤</div>
      <!-- <el-row>
        <el-collapse v-model="cVal">
          <el-collapse-item
            :name="'' + attributeIndex"
            :title="funcNameShow(attributeItem)"
            v-for="(attributeItem, attributeIndex) in attributeList"
          >

            <div>
              <el-form
                label-width="50px"
                class="routeBy-form"
                label-position="left"
              >

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
      </el-row> -->
      <h4>备注</h4>
      <el-input
        v-model="remark"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 15 }"
        placeholder="Enter something..."
      />


    </div>

    <!-- <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem"
          >删除</el-button
        >
        <el-button class="btn btns-save" type="primary" @click="saveConfig"
          >保存</el-button
        >
      </el-row>
    </div> -->
  </div>
</template>

<script>
import VarSelect from "../module/variable-selectV4";
import Draggable from "vuedraggable";
import funcList from "./funclist";
// import { getVariableList } from "@/api/variable";
import { mapActions } from "vuex";
export default {
  name: "drag-drawer-dataprocess",
  components: {
    VarSelect,
    Draggable
  },
  props: ["flow", "curDiagram", "processId","subType"],
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
          name: "yyyy-MM-dd HH:mm:ss",
        },
        {
          name: "yyyy-MM-dd",
        },
        {
          name: "yyyy-MM",
        },
        {
          name: "HH:mm:ss",
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
          name: "HH",
        },
        {
          name: "mm",
        },
        {
          name: "ss",
        },
        {
          name: "yyyyMMddHHmmss",
        },
         {
          name: "yyyyMMdd",
        },
      ],
      currentFuncList:[
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
          name: "格式化",
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
          name: "增加",
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
          name: "减少",
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
      allFuncList:funcList.funcList,
      operateList:['=','+','-','X','/','|'],
      chosenFunc: {},
      funcType: "",
      funcName: "",
      variateTagList: [],
      subVariables: [],
      propertyName: {},
      dataValue: {},
      varMap: null,
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
      isShowTree:true,
    };
  },
  mounted() {
    this.allFuncList.forEach(fItem=>{
      // 初始化currentFunclist
      if(this.subType==fItem.type){
          this.currentFuncList=fItem.funcList;
      }
    });

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


    // getVariableList(this.processId, 1, 999).then(res => {
    //   if (res.data.code == 0) {
    //     this.variableList = res.data.data;
    //     this.varMap = new Map();
    //     this.variableList.forEach(item => {
    //       this.varMap.set(item.name, JSON.parse(item.variables));
    //     });
    //   }
    // });
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
        showFunc:true,
        target: {
          category: "",
          name: "",
        },
      };
      this.targetStr = "";
      this.valueStr = "";
      this.attributeList.push(newscript);
      console.log("addNewRoute",this.attributeList);
      this.processForm = newscript;
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
      // this.newFList.forEach((newF) => {
      //   newF.funcList.forEach((item) => {

      //     if (item.name == event) {
      //       console.log(item)
      //       // this.chosenFunc = item;
      //       this.attributeList[attributeIndex].args = [];

      //       if (item.type == "自定义") {
      //         this.attributeList[attributeIndex].function = item.funcName;
      //       } else {
      //         this.attributeList[attributeIndex].function = item.function;
      //       }
      //       this.attributeList[attributeIndex].chosenFunc = item;
      //       this.attributeList[attributeIndex].funcType = item.function;
      //       this.attributeList[attributeIndex].funcName = item.name;
      //       this.attributeList[attributeIndex].showFunc = false;
      //       this.attributeList[attributeIndex].resultTest = item.resultTest;
      //       // 选择func 的同时需要对 进行赋值 TODO result
      //       item.paramNodes.forEach((v) => {
      //         this.attributeList[attributeIndex].args.push({
      //           category: "",
      //           name: "",
      //           type: 0,
      //           value: "",
      //         });
      //       });
      //     }
      //   });
      // });
      this.currentFuncList.forEach(item=>{
        if (item.name == event) {
              this.attributeList[attributeIndex].args = [];

            if (item.type == "自定义") {
              this.attributeList[attributeIndex].function = item.funcName;
            } else {
              this.attributeList[attributeIndex].function = item.function;
            }
            this.attributeList[attributeIndex].chosenFunc = item;
            this.attributeList[attributeIndex].funcType = item.function;
            this.attributeList[attributeIndex].funcName = item.name;
            this.attributeList[attributeIndex].showFunc = false;
            this.attributeList[attributeIndex].expression = item.expression;
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
      console.log("funcChange",event,this.attributeList);

    },
    showfunc(event) {
      //回显专用
      // this.FList.forEach((item) => {
      //   if (item.name == event) {
      //     this.chosenFunc = item;
      //     // 选择func 的同时需要对 进行赋值 TODO result
      //   }
      // });
    },
    showAllFuncArgs() {
      for (let i = 0; i < this.attributeList.length; i++) {
        let attr = this.attributeList[i];
        this.currentFuncList.forEach((item) => {
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
    dateValueSelect(item, index) {
      this.varMap.get(item.category).forEach((v) => {
        if (v.name == item.name) {
          this.attributeList[this.processIdx].args[index].type = v.type;
          this.attributeList[this.processIdx].args[index].value = v.value;
          this.attributeList[this.processIdx].args[index].value_type =
            v.value_type;
        }
      });
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
    allowDrag() {
      return true;
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.dataType === "project") return false;
      if (type === "inner" && dropNode.data.dataType !== "directory") {
        return false;
      } else {
        return true;
      }
    },
    showChosenFunc(data,node){
      console.log("showChosenFunc",data,node);
      data.showChosenFunc=true;
    },
    onDragMoveEnd(){},
    onDragMoveStart(){},
  },
  watch: {},
};
</script>

<style scoped lang="less" >
.data-warp{
  /deep/.el-input--suffix {
    width: 100%;
  }
  /deep/.el-input {
    width: 100%;
  }
  /deep/.el-select{
     width:100%;
  }
}
.mt10 {
  margin-top: 10px;
}
.mr10 {
  margin-right: 10px;
}
ul li{

}
.menu-item-li{
  margin: 5px 0px 0px 0px;
  box-shadow: 0px 2px 30px rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 5px 10px;
  .handle{
    margin: 5px;
    line-height: 28px;
    cursor: pointer;
  }

}
.menu-item-select{
  /deep/.el-cascader .el-input .el-input__inner{
    height:30px;
  }
}
.form-input{
      margin-top: 5px;
    margin-left: 5px;
  /deep/.el-input--suffix .el-input__inner{
    height:30px;
  }
}

.menu-item-wrap{
  position: relative;
  ul{
      width: 90%;
      margin: auto;
      display: flex;
      background-color: #fff;
      box-shadow: 0px 2px 30px rgba(0,0,0,0.1);
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      padding:10px;
      z-index: 1;
      overflow-x: auto;
    }
   ul li {
    position: relative;
    list-style-type: none;
    padding:5px 10px;
    color:#fff;
    background-color: #0862EA;
    border-radius: 5px;
    margin:2px 5px;
    cursor: pointer;
    font-size:12px;
    white-space: nowrap;
  }
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
/deep/.el-tree-node__content{
   height: 72px;
  box-shadow: 0px 2px 30px rgba(0,0,0,0.1);
}
.tree-item-text-wrap{
  max-height: 72px;
}
.tree-item{
  display: flex;
}
.tree-item-text{
  line-height: 40px;
  white-space: nowrap;
  padding: 0px 5px;
}
.tree-item-operator{
  font-size: 28px;
  line-height: 40px;
  padding:0px 5px;
}
.tree-item-func{
    white-space: nowrap;
    padding: 0px 10px;
    border-radius: 5px;
    color: #fff;
    line-height: 30px;
    margin: 5px;
    background-color: #0862EA;
  }
  .menu-item-li{
    z-index: 2;
    position: relative;
    background-color: #fff;
    display: flex;
    height:50px;
  }


</style>
