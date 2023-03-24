export default class SweepCrawler {
  static makeBeautify (componentConfig, $pageDataModelEngine){
    let componentType = componentConfig.type
    let dataSourceType = componentConfig.options.contentDataSource
    let interfaceDataConfig = componentConfig.options.interfaceDataConfig

    if(componentType === 'van-design-form' && componentConfig.options.columns){
      // this.beautifyFormComponent(componentConfig.options, interfaceDataConfig)
    } else if (componentType === 'van-design-checkbox') {
      this.beautifyCheckboxComponent()
    } else if (componentType === 'van-design-progress') {
      // item.options.interfaceDataConfig.rateValue=interfaceData[interfaceDataConfig.rateKey]
      // item.options.interfaceDataConfig.maxValue=interfaceData[interfaceDataConfig.maxKey]
    } else if (componentType === 'van-design-list') {
      // console.log('xxxx', componentConfig)
      // let listTemp = interfaceData[apiKey]
      // saveAndUpdateLocalData(item.uuid, listTemp || [])
      $pageDataModelEngine.saveCustomData(componentConfig.uuid, interfaceDataConfig.tableData || [])
    }
    
  }
  static beautifyFormComponent(options, interfaceDataConfig){
    options.columns=[];
    interfaceDataConfig.tableData.forEach(colItem=>{
      options.columns.push({
        label:colItem[options.labelKey],
        value:colItem[options.valueKey]
      })
    })
  }
  static beautifyCheckboxComponent(){}
  static beautifyProgressComponent(){}
}
