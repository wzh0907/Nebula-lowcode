import { componentDeepClone } from '@/views/report/utils/deal-component-data/deep-clone-component-config'
import { coverBigComponent,inputInterfaceComponent } from "@/views/report/utils/common-const";
import { componentConfigItemType } from '@/views/report/type'
/**
 * @功能 把componentList从树型的数据结构转换成扁平的一维数据结构
 *
 * @param obj componentList树状的数据结构
 *
 * @param tempArr componentList扁平的数据结构
 *
 */
export function transformComponentListTreeToPlan(obj: any, tempArr: any) {
  // 遍历 复制数组或对象
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] && typeof obj[key] === "object") {
        transformComponentListTreeToPlan(obj[key], tempArr);
      }
      if (key === 'uuid' && obj.type && obj.options) { // 不止判断uuid，还需确认是不是一个完整的组件配置对象
        tempArr.push(obj)
      }
    }
  }
}

export function pickInputComponentList(
  componentConfigList: any,
  componentList: any,
  filterTypeList?: any[],
  tableDeepValueArr?: any[],
  treeDeepValeArr?: any[]
) {
  // let tableDeepValueArr = [] as any
  // let filterTypeList = []
  if (!filterTypeList) {
    filterTypeList = inputInterfaceComponent
  }
  componentConfigList.forEach(item => {
    // const rawItem = item // 原始对象
    let newItem = componentDeepClone(item)
    // let newItem = item
    // let componentObj = {}
    let componentObj = {} as componentConfigItemType
    let type = newItem.type
    let name = newItem.name
    let uuid = newItem.uuid
    let options = newItem.options
    let optionsColumns = options && options.columns
    if (coverBigComponent.indexOf(type) !== -1 && optionsColumns && optionsColumns.length) {
      optionsColumns.forEach(columnItem => {
        if (columnItem.componentList && columnItem.componentList.length) {
          // let tempComponentList = []
          pickInputComponentList(columnItem.componentList, componentList, filterTypeList, tableDeepValueArr, treeDeepValeArr)
          // columnItem.componentList = tempComponentList
        }
      })
    }
    componentObj.type = type
    componentObj.name = name
    componentObj.uuid = uuid
    componentObj.options = options
    if (filterTypeList && filterTypeList.indexOf(type) !== -1) {
      componentList.push(componentObj)
    }
    else if (type === 'van-design-tree' || type == 'van-design-tree-select') {
      treeDeepValeArr && treeDeepValeArr.push(
        {
          label: item.options.commonConfigAssignName,
          value: {
            type: "custom",
            id: componentObj.uuid,
            data: {}
          },
          children: [
            {
              label: '选中数值',
              value: {
                type: "custom",
                id: `${componentObj.uuid}-value`,
                data: {
                  value: 'value'
                }
              },
            },
            {
              label: '选中名称',
              value: {
                type: "custom",
                id: `${componentObj.uuid}-label`,
                data: {
                  value: 'label'
                }
              },
            }
          ]
        }
      )
    }
    else if (type === 'van-design-table') {
      // const optionsRowdataObj = {
      //   get value() {
      //     return rawItem.options.rowSelectValuesByKeyStr
      //   }
      // }
      // const optionsRownumObj = {
      //   get value() {
      //     // console.log('rawItemrawItemrawItem---->', rawItem)
      //     return rawItem.options.pagination.pageSize
      //   }
      // }
      // const optionsPagenumObj = {
      //   get value() {
      //     return rawItem.options.pagination.current
      //   }
      // }
      // TODO::: 要使用object 代理模式
      tableDeepValueArr && tableDeepValueArr.push(
        {
          label: item.options.commonConfigAssignName,
          value: {
            type: "custom",
            id: componentObj.uuid,
            data: {}
          },
          children: [
            {
              label: '选定行数据',
              value: {
                type: "custom",
                id: `${componentObj.uuid}-rowdata`,
                data: {
                  value: 'rowdata'
                }
              },
            },
            {
              label: '每页行数',
              _id: `${componentObj.uuid}-rownum`,
              value: {
                type: "custom",
                id: `${componentObj.uuid}-rownum`,
                data: {
                  value: 'rownum'
                }
              },
            }, {
              label: '当前页号',
              _id: `${componentObj.uuid}-rownum`,
              value: {
                type: "custom",
                id: `${componentObj.uuid}-pagenum`,
                data: {
                  value: 'pagenum'
                }
              },
            }
          ]
        }
      )
    }
  })
  // console.log('--xx-----xx-----xx--->', tableDeepValueArr)

  // return tableDeepValueArr
}
