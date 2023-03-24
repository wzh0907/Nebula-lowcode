export default class InterfaceFunction {
    // 通过组件名获取组件引用
    static call($pageDataModelEngine) {
        // let varDataObj = $pageDataModelEngine.getCustomData()
        // let params = {};
        // let paramsConfigs = actionItem.interfaceDataConfig.paramsConfigs || [];
        // paramsConfigs.forEach((paramsConfig) => {
        //     let paramValue = this.getActionValue(paramsConfig, varDataObj, this);
        //     params[paramsConfig.param_name] = paramValue; // TODO::: 待优化，要通过uuid遍历实时获取

        // });
        // const data = {
        //     dataApiId: operateApiId,
        //     params,
        // };
        // getProcesseDataList(data).then((res) => {
        //     if (res.code === 0) {
        //         // 2021-12-18 按照新逻辑 存取
        //         let interfaceName;

        //         let obj = {
        //             label: interfaceName, // 依次判断数据接口、数据表、数据集
        //             value: {
        //                 type: "customInterface",
        //                 id: operateApiId,
        //                 data: res.data
        //             },
        //         };
        //         this.vm.$pageDataModelEngine.saveCustomInterfaceData(operateApiId, obj);
        //     }
        //     this.nextEvent(node, actionList)
        // }).catch(() => {

        // })
    }
}
