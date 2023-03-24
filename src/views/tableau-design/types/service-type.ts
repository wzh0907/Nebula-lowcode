type reductionItemServiceType = {
  data: {
    dataSetFieldList: {
      displayName: string,
      fieldName: string,
      fieldType: string,
      hide: boolean,
      id: number,
      // 客户端新增字段
      name: string,
      type: string,
      tableName: string,
      tableId: number,
      dataSetName?: string,
      dataSetId?: number,
      isShow: boolean
    }[]
  }
}

type tableFieldServiceType = {
  dataList: {
    name: string,
    tableName?: string,
    type: string,
    // 客户端新增字段
    tableId: number,
    isShow: boolean,
    isHide?: boolean,
    // 编辑模式新增字段
    isInputVar?: boolean,
    newValue?: ''
  }[]
}

type tableListServiceType = {
  dataList: {
    id: number,
    tableId: number,
    dbConfigId: number,
    tableName: string,
    isHide?: boolean
  }[]
}

type dbConfigListServiceType = {
  dataList: {
    id: number
  }[]
}

type reductionResultListServiceType = {
  data: {
    id: number,
    dbConfigId: number,
    name: string,
    type: string,
    modeType: string,
    graphConfig: string,
    filterConfig: string,
    statisticsConfig: string,
    processList: any,
    dmlVOList: any,
    sqlParamList: any,
    execSqlText: string,
    dataSetFieldList: {
      id: number,
      displayName: string,
      fieldName: string,
      fieldType: string,
      hide: boolean
    }[]
  }
}

type reductionDatasetListServiceType = {
  dataList: {
    id: number,
    dbConfigId: number,
    dataSetName: string,
    isHide?: boolean
  }[]
}

type reductionExecuteResType = {
  data: {
    columnList: {
      name: string,
      aliasName: string,
      tableName: string,
      type: string,
      isShow?: boolean
    }[],
    valueList: {
      [index: number]: string
    }[]
  }
}

export {
  reductionItemServiceType,
  tableFieldServiceType,
  tableListServiceType,
  dbConfigListServiceType,
  reductionResultListServiceType,
  reductionDatasetListServiceType,
  reductionExecuteResType
}