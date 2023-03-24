let workFlowList = [
  {
    label: "流程",
    componentList: [
      {
        id: "work-flow-approval",
        type: "work-flow-approval",
        name: "审核节点",
        url: require("@/assets/icon/if.svg"),
        color:'#FF9944',
      },
      {
        id: "work-flow-business-handler",
        type: "work-flow-business-handler",
        name: "业务处理",
        url: require("@/assets/icon/if.svg"),
        color:'#FF9944',
      },
      {
        id: "work-flow-if",
        type: "work-flow-if",
        name: "条件节点",
        url: require("@/assets/icon/if.svg"),
        color:'#FF9944',
      },
    ]
  },
]

export {
  workFlowList,
}
