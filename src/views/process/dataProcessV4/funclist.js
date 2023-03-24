let funcList=[
    {
      name: "数值",
      type: "dataprocess-number",
      funcList: [
        {
            name: "加法",
            function: "SYS_ADD",
            type: "数值",
            chosen: false,
            resultText: "结果= {变量1} + {变量2}",
            expression:['结果','=','变量1','+','变量2'],
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
            expression:['结果','=','变量1','-','变量2'],
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
             expression:['结果','=','变量1','X','变量2'],
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
            expression:['结果','=','变量1','/','变量2'],
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
            expression:['结果','=','|','变量1','|'],
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
            expression:['结果','=','变量1','四舍五入保留','变量2','位小数'],
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
      type: "dataprocess-string",
      funcList: [
        { 
          name: "相连",
          function: "SYS_CONCAT",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数1 与 参数2字符串相连",
          expression:['结果','=','变量1','连接','变量2'],
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
          name: "替换",
          function: "SYS_REPLACE",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数3 替换 参数2",
          expression:['结果','=','变量1','中','变量2','替换为','变量3'],
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
          name: "分割",
          function: "SYS_SPLIT",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数1 根据 参数2 进行分割",
          expression:['结果','=','变量1','按','变量2','分割'],
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
          name: "大写",
          function: "SYS_TOUPPER",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数1 转换成大写",
          expression:['结果','=','变量1','字母大写'],
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
          name: "小写",
          function: "SYS_TOLOWER",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数1 转换成小写",
          expression:['结果','=','变量1','字母小写'],
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
          name: "去除空格",
          function: "SYS_TRIM",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数1 前后去空",
          expression:['结果','=','变量1','去除空格'],
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
          name: "长度",
          function: "SYS_STR_LENGTH",
          type: "字符串",
          chosen: false,
          resultText: "结果=参数1长度",
          expression:['结果','=','变量1','长度'],
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
          name: "截取",
          function: "SYS_STR_SUBSTRING",
          type: "字符串",
          chosen: false,
          resultText: "结果=substring(参数1,from,to) ",
          expression:['结果','=','变量1','从',"变量2",'到','变量3','截取'],
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
      type: "dataprocess-date",
      funcList: [
        {
          name: "格式化",
          function: "SYS_DATE_FORMAT",
          type: "日期",
          chosen: false,
          resultText: "结果=参数1根据格式化进行日期转换",
          expression:['结果','=','变量1','按','格式','格式化'],
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
          name: "增加",
          function: "SYS_DATE_ADD",
          type: "日期",
          chosen: false,
          resultText: "结果=参数1 + （参数2）单位",
          expression:['结果','=','变量1','增加','变量2',"单位"],
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
          expression:['结果','=','变量1','减少','变量2',"单位"],
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
          name: "日期差",
          function: "SYS_DATE_DIFF",
          type: "日期",
          chosen: false,
          resultText: "结果=参数1 - 参数2单位",
          expression:['结果','=','变量1','减少','变量2',"单位"],
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
          name: "今天",
          function: "SYS_DATE_NOW",
          type: "日期",
          chosen: false,
          resultText: "结果=获取当前日期",
          expression:['结果','=','获取当前日期'],
          paramNodes: [],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "周一",
          function: "SYS_DATE_1DAYOFWEEK",
          type: "日期",
          chosen: false,
          paramNodes: [],
          resultText: "结果=本周第一天",
          expression:['结果','=','本周第一天'],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "周日",
          function: "SYS_DATE_7DAYOFWEEK",
          type: "日期",
          chosen: false,
          paramNodes: [],
          resultText: "结果=本周日",
          expression:['结果','=','本周日'],
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
          expression:['结果','=','当月第一天'],
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
          expression:['结果','=','当月最后一天'],
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
          expression:['结果','=','上个月第一天'],
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
          expression:['结果','=','上个月最后一天'],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "每年第一天",
          function: "SYS_DATE_FIRSTDAYOFYEAR",
          type: "日期",
          chosen: false,
          paramNodes: [],
          resultText: "结果=每年第一天",
          expression:['结果','=','每年第一天'],
          resultNodes: [
            {
              name: "结果",
            },
          ],
        },
        {
          name: "每年最后一天",
          function: "SYS_DATE_LASTDAYOFYEAR",
          type: "日期",
          chosen: false,
          paramNodes: [],
          resultText: "结果=每年最后一天",
          expression:['结果','=','每年最后一天'],
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
      type: "dataprocess-list",
      funcList: [
        {
          name: "追加",
          function: "SYS_LIST_ADD",
          type: "列表",
          chosen: false,
          resultText: "把参数1追加到列表",
          expression:['把','变量1','追加到','变量2'],
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
          name: "行数据",
          function: "SYS_LIST_GET",
          type: "列表",
          chosen: false,
          resultText: "结果=列表[index]",
          expression:['结果','=','变量1','第','变量2',"行"],
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
        {
          name: "列表长度",
          function: "SYS_LIST_SIZE",
          type: "列表",
          chosen: false,
          resultText: "结果=列表[index]",
          expression:['结果','=','变量1','的长度'],
          paramNodes: [
            {
              name: "列表",
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
      type: "dataprocess-other",
      funcList: [
        {
          name: "赋值",
          function: "SYS_ASSIGN",
          type: "其他",
          chosen: false,
          resultText: "结果=参数1",
          expression:['结果','=','变量1'],
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
      name:"字典",
      type: "dataprocess-map",
      funcList:[
        {
          name: "属性取值",
          function: "SYS_MAP_GET",
          type: "其他",
          chosen: false,
          resultText: "结果=Map.getKey",
          expression:['结果','=','变量1','的key','变量2',"值"],
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
        {
          name: "属性设值",
          function: "SYS_MAP_PUT",
          type: "其他",
          chosen: false,
          resultText: "变量 设置 key变量 属性值为 变量",
          expression:['变量1','设置','key','属性值为','变量3'],
          paramNodes: [
            {
              name: "变量1",
            },
            {
              name: "key",
            },
            {
              name: "变量3",
            },
          ],
          resultNodes: [],
        },
      ]
    }
    // {
    //   name: "对象",
    //   type: "dataprocess-object",
    //   funcList: [
    //     {
    //       name: "获取属性值",
    //       function: "SYS_MAP_GET",
    //       type: "对象",
    //       chosen: false,
    //       resultText: "结果=Map.getKey",
    //       paramNodes: [
    //         {
    //           name: "Map对象",
    //         },
    //         {
    //           name: "key",
    //         },
    //       ],
    //       resultNodes: [
    //         {
    //           name: "结果",
    //         },
    //       ],
    //     },
    //   ],
    // }
]

export default{
    funcList
}