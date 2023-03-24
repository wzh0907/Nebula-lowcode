import ComponentFunction from './function/components.js'
import {getAllVariable,getVariableByScopeName,saveVariableByScopeName} from '@/views/report/utils/deal-global-variable/globalUtils'
function validatorComponent(component) { }

/**
 * 自定义JS代码执行器
 * @param {Object} actionItem 执行事件的组件对象
 * @param {Object} $pageDataModelEngine 数据引擎
 * 
 * @needData 完成该功能所需的必要数据
 * @param {Array} componentsConfigs 目前平台所支持的所有组件配置（用于添加新组件）
 * @param {Array} subpageList 子页面
 * @param {Array} uuidComponentList 组件树
 * @param {Object} popupConfig 弹窗配置
 * @param {String} deviceType 当前设备类型
 * 
 * @needFnctions 完成该功能所需的必要方法
 * @param {Function} refreshComponentData 刷新组件数据 [入参：组件Ids]
 */
export default function eventOperateJavascript(actionItem, $pageDataModelEngine, needData, needFnctions) {
    const { componentsConfigs, subpageList, uuidComponentList, popupConfig, deviceType } = needData
    const { refreshComponentData } = needFnctions
    let eventCore = {
        components: {
            get: function (componentName) {
                if (!componentName) throw Error('请输入需要查询的组件名称')

                return ComponentFunction.getComponents(componentName, uuidComponentList)
            },
            getValue: function (componentObj) {
                if (!componentObj) throw Error('请传入组件对象')
                if (typeof componentObj !== 'object') throw Error('组件对象必须为Object类型')
                if (Array.isArray(componentObj)) throw Error('组件对象必须为Object类型，暂不支持数组类型')

                return ComponentFunction.getComponentValue(componentObj) 
            },
            setValue: function (componentObj, value) {
                if (!componentObj) throw Error('请传入组件对象')
                if (!value) throw Error('请输入值')
                if (typeof componentObj !== 'object') throw Error('组件对象必须为Object类型')
                if (Array.isArray(componentObj)) throw Error('组件对象必须为Object类型，暂不支持数组类型')

                return ComponentFunction.setComponentValue(componentObj, value)
            },
            toggle: function (componentObj) {
                if (!componentObj) throw Error('请传入组件对象')
                if (typeof componentObj !== 'object') throw Error('组件对象必须为Object类型')
                if (Array.isArray(componentObj)) throw Error('组件对象必须为Object类型，暂不支持数组类型')

                return ComponentFunction.toggleComponentDisplay(componentObj)
            },
            show: function (componentObj) {
                if (!componentObj) throw Error('请传入组件对象')
                if (typeof componentObj !== 'object') throw Error('组件对象必须为Object类型')
                if (Array.isArray(componentObj)) throw Error('组件对象必须为Object类型，暂不支持数组类型')

                return ComponentFunction.showComponentDisplay(componentObj)
            },
            hide: function (componentObj) {
                if (!componentObj) throw Error('请传入组件对象')
                if (typeof componentObj !== 'object') throw Error('组件对象必须为Object类型')
                if (Array.isArray(componentObj)) throw Error('组件对象必须为Object类型，暂不支持数组类型')

                return ComponentFunction.hideComponentDisplay(componentObj)
            },
            // 组件刷新
            refreshData: function (components) {
                if (!components) throw Error('请传入组件列表')
                if (!Array.isArray(components)) throw Error('组件列表必须为Array类型，单个组件请放入数组中使用')

                const ids = components.map(v => v.uuid)
                refreshComponentData(ids)
            }
        },
        page: {
            // 组件刷新
            getParams: function () {
                return $pageDataModelEngine.getCustomData()
            }
        },
        global:{
            getParams:function(){
                return getAllVariable();
            },
            getParamByName:function(){
                return getVariableByScopeName();
            },
            saveParamByName:function(){
                return getAllVasaveVariableByScopeNameriable();
            }
        },
        interface: {
            getAll: () => {
                const interfaceDataList = $pageDataModelEngine.getInterfaceData()
                return interfaceDataList
            }
        }
    }

    console.log('event-operate-javascript run....----->', actionItem.sourceCodeStr)
    const fn = new Function('pm', actionItem.sourceCodeStr)
    fn(eventCore)
}
