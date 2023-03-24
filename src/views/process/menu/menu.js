let menuList = [
  // { id: 'start', type: 'start', name: '开始', url: require('@/assets/icon/start.jpg') },
  {
    label: "逻辑",
    componentList: [
      {
        id: "ifV4",
        type: "ifV4",
        name: "条件",
        tips: "条件组件通过比较两个变量值决定执行路径，执行路径只能两条选其一",
        url: require("@/assets/icon/if.svg"),
        color:'#FF9944',
      },
      {
        id: "branchV4",
        type: "branchV4",
        name: "分支",
        tips: "分支组件用于依次执行多个流程路径，每条分支包含一个按顺序执行的单独路径，分支路径上的处理节点执行完毕后，继续下一条分支路径的执行。",
        url: require("@/assets/icon/branch.svg"),
        color:'#FF9944',
      },
      {
        id: "loopV4",
        type: "loopV4",
        name: "循环",
        tips: "遍历组件用于逐条处理一组数据，负责把一组数据拆成一条一条数据并传递给后续的加工步骤。每条数据都将经过遍历组件后的所有处理节点，直到遇到结束组件，表示一条数据处理完毕，进行下一条数据的处理过程，直至完成所有条数据的加工处理。",
        url: require("@/assets/icon/loop.svg"),
        color:'#FF9944',
      },
      {
        id: "routeV4",
        type: "routeV4",
        name: "路由",
        tips: "路由组件用于根据指定变量值选择不同的执行路径，该组件逐条判定路径条件，一旦满足则选择该条路径，不再判定其他路径条件。优先选择第一条符合条件的执行路径，不再选择其他符合条件的执行路径",
        url: require("@/assets/icon/route.svg"),
        color:'#FF9944',
      },
      {
        id: "try",
        type: "try",
        name: "异常处理",
        url: require("@/assets/icon/if.svg"),
        color:'#FF9944',
      },
    ]
  },
  {
    label: "运算",
    componentList: [
      {
        id: "dataprocess-number",
        type: "dataprocess-number",
        name: "数值",
        url: require("@/assets/icon/dataprocess.svg"),
        color:'#754BB6',
      },
      {
        id: "dataprocess-string",
        type: "dataprocess-string",
        name: "文本",
        url: require("@/assets/icon/dataprocess.svg"),
        color:'#754BB6',
      },
      {
        id: "dataprocess-date",
        type: "dataprocess-date",
        name: "日期",
        url: require("@/assets/icon/dataprocess.svg"),
        color:'#754BB6',
      },
      {
        id: "dataprocess-list",
        type: "dataprocess-list",
        name: "列表",
        url: require("@/assets/icon/dataprocess.svg"),
        color:'#754BB6',
      },
      // {
      //   id: "dataprocess-object",
      //   type: "dataprocess-object",
      //   name: "对象",
      //   url: require("@/assets/icon/dataprocess.svg"),
      // },
      {
        id: "dataprocess-other",
        type: "dataprocess-other",
        name: "赋值",
        url: require("@/assets/icon/dataprocess.svg"),
        color:'#754BB6',
      },
      {
        id: "dataprocess-map",
        type: "dataprocess-map",
        name: "字典",
        url: require("@/assets/icon/dataprocess.svg"),
        color:'#754BB6',
      },
      {
        id: "dataprocessfunction",
        type: "dataprocessfunction",
        name: "函数",
        url: require("@/assets/icon/dataprocess.svg"),
        color:'#754BB6',
      },

    ]
  },
  {
    label: "数据库",
    componentList: [
      {
        id: "connector-query",
        type: "connector-query",
        name: "装载",
        tips: "数据访问用于调用数据整理访问数据库，从数据库装载数据到数据加工流程中，或者更新数据到数据库中。数据加工中的变量值将通过相同的变量名传递到数据整理中，数据整理中使用相同的变量名引用变量值，作为查询条件或设值。",
        url: require("@/assets/icon/connector-query.svg"),
        color:'#03B3CC',
      },
      {
        id: "connector-insert",
        type: "connector-insert",
        name: "新增",
        tips: "数据访问用于调用数据整理访问数据库，从数据库装载数据到数据加工流程中，或者更新数据到数据库中。数据加工中的变量值将通过相同的变量名传递到数据整理中，数据整理中使用相同的变量名引用变量值，作为查询条件或设值。",
        url: require("@/assets/icon/connector-insert.svg"),
        color:'#03B3CC',
      },
      {
        id: "connector-update",
        type: "connector-update",
        name: "修改",
        tips: "数据访问用于调用数据整理访问数据库，从数据库装载数据到数据加工流程中，或者更新数据到数据库中。数据加工中的变量值将通过相同的变量名传递到数据整理中，数据整理中使用相同的变量名引用变量值，作为查询条件或设值。",
        url: require("@/assets/icon/connector-update.svg"),
        color:'#03B3CC',
      },
      {
        id: "connector-delete",
        type: "connector-delete",
        name: "删除",
        tips: "数据访问用于调用数据整理访问数据库，从数据库装载数据到数据加工流程中，或者更新数据到数据库中。数据加工中的变量值将通过相同的变量名传递到数据整理中，数据整理中使用相同的变量名引用变量值，作为查询条件或设值。",
        url: require("@/assets/icon/connector-delete.svg"),
        color:'#03B3CC',
      },
      {
        id: "connector-custom",
        type: "connector-custom",
        name: "SQL",
        tips: "数据访问用于调用数据整理访问数据库，从数据库装载数据到数据加工流程中，或者更新数据到数据库中。数据加工中的变量值将通过相同的变量名传递到数据整理中，数据整理中使用相同的变量名引用变量值，作为查询条件或设值。",
        url: require("@/assets/icon/connector-custom.svg"),
        color:'#03B3CC',
      },
    ]
  },
  {
    label: "数据集",
    componentList: [
      {
        id: "dataJoinV4",
        type: "dataJoinV4",
        name: "数据集连接",
        url: require("@/assets/icon/dataprocess.svg"),
        color:'#3F7192',
      },
      {
        id: "dataUnionV4",
        type: "dataUnionV4",
        name: "数据集合并",
        url: require("@/assets/icon/dataprocess.svg"),
        color:'#3F7192',
      },
      {
        id: "dataSortV4",
        type: "dataSortV4",
        name: "数据集排序",
        url: require("@/assets/icon/dataprocess.svg"),
        color:'#3F7192',
      },
      {
        id: "associationV4",
        type: "associationV4",
        name: "数据集内嵌",
        url: require("@/assets/icon/dataprocess.svg"),
        color:'#3F7192',
      },
    ]
  },
  {
    label: "其他",
    componentList: [
      {
        id: "log",
        type: "log",
        name: "日志",
        url: require("@/assets/icon/message.svg"),
        color:'#3C78F3',
      },

      {
        id: "interfaceV4",
        type: "interfaceV4",
        name: "接口",
        tips: "调用外部接口",
        url: require("@/assets/icon/interface.svg"),
        color:'#3C78F3',
      },
      {
        id: "processcallV4",
        type: "processcallV4",
        name: "子流程",
        url: require("@/assets/icon/processcall.svg"),
        color:'#3C78F3',
      },
      {
        id: "scriptV4",
        type: "scriptV4",
        name: "代码",
        url: require("@/assets/icon/processcall.svg"),
        color:'#3C78F3',
      },
      {
        id: "stopV4",
        type: "stopV4",
        name: "结束",
        tips: "停止组件提供了终止当前流程路径的数据加工能力。此组件表示流程路径的终点，流程不再继续进入下一个节点，主流程将进入其他路径继续执行。该组件也可以用于流程处理进入异常状态，终止并退出整个流程 ",
        url: require("@/assets/icon/stop.svg"),
        color:'#3C78F3',
      },
      {
        id: "flowStart",
        type: "flowStart",
        name: "发起审批",
        tips: " ",
        url: require("@/assets/icon/stop.svg"),
        color:'#3C78F3',
      },
      {
        id: "flowList",
        type: "flowList",
        name: "工作流列表",
        tips: " ",
        url: require("@/assets/icon/stop.svg"),
        color:'#3C78F3',
      },
      {
        id: "flowLog",
        type: "flowLog",
        name: "审批日志",
        tips: " ",
        url: require("@/assets/icon/stop.svg"),
        color:'#3C78F3',
      },
      
    ]
  },
]

export default {
  menuList
}
