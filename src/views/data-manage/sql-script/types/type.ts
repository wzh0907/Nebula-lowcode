interface filterConfigItemInterface {
  name?: string,
  fieldName: string,
  tableName: string,
  filedType: string,
  numberConfig?: {
    filterType: string,
    startParamType: string,
    endParamType: string,
    startValue: string,
    endValue: string,
    specialType: string
  },
  charConfig?: {
    normal?: {
      paramType: string,
      paramValue: any,
      nullAvailable: boolean,
      isExclude: boolean
    },
    wildcard?: {
      paramType: string,
      paramValue: string,
      nullAvailable: boolean,
      isExclude: boolean,
      filterType: string
    }
  },
  dateConfig?: {
    type: string,
    config: string,
    // config: {
    //   selectedRelativeDateType: string,
    //   relativeValue: string,
    //   relativeInputNumBefore: number,
    //   relativeInputNumAfter: number,
    //   isRelativeAnchor: boolean,
    //   relativeAnchorDate: string
    // }
    startDate: string,
    endDate: string,
    // paramType: string,
    paramList: string,
    nullAvailable: boolean,
    isExclude: boolean,
    specialType: string
  }
}
type filterConfigType = filterConfigItemInterface[]

// d3渲染需要的数据格式
type d3RootJsonType = {
  id: number,
  name: string,
  depth?: number,
  nodeType: string
  children?: d3RootJsonChildrenType
}
type d3RootJsonChildrenType = d3RootJsonType[]

// 提交服务端的数据格式
type fromDataListServiceType = {
  nodeId: number,
  nodeName: string
  nodeType: string
  parentConnectData: Object
  rightNodes: fromDataListServiceType
}[]

// 连接表的数据格式
type connectDataObjType = {
  [index: string]: {
    parentNodeId: number
    rightId: number
    joinType: string
    connectFieldList: any
  }
}

export {
  filterConfigItemInterface,
  filterConfigType,
  d3RootJsonType,
  d3RootJsonChildrenType,
  fromDataListServiceType,
  connectDataObjType
}
