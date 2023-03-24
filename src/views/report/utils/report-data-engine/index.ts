import { QueryInterface } from '../deal-component-data-source/index-v1.0.0'
import QueryInterfaceData from './query-interface-data'
export default class PageDataModelEngine {
  globalData: any
  modelDataPoolComponent: {any}
  modelDataPoolInterfaceList: any[]
  modelDataPoolCustomData: {any}
  modelDataPoolCustomInterfaceData: {any}
  // 内置属性
  customDataEventStack: any[]
  componentDataEventStack: any[]
  interfaceDataEventStack: any[]
  // 接口对象-主要负责查询接口入参以及 接口返回值（返回值包括 表、数据集、接口等）
  queryService: any

  constructor(globalData){
    this.globalData = globalData


    this.modelDataPoolComponent = this.globalData.modelDataPool.component
    this.modelDataPoolInterfaceList = this.globalData.modelDataPool.interface
    this.modelDataPoolCustomData = this.globalData.modelDataPool.customData
    this.modelDataPoolCustomInterfaceData = {} as any
    // 存储监听的回调方法
    this.customDataEventStack = []
    this.componentDataEventStack = []
    this.interfaceDataEventStack = []
  }

  // 清空Model池，重新赋值（注意：这里的清空只是内容清空，实际的对象引用没有变）
  clearModelDataPool(){
    this.modelDataPoolInterfaceList.splice(0, this.modelDataPoolInterfaceList.length)
    for(let key in this.modelDataPoolComponent) {
      delete this.modelDataPoolComponent[key]
    }
    for(let key in this.modelDataPoolCustomData) {
      delete this.modelDataPoolCustomData[key]
    }
    for(let key in this.modelDataPoolCustomInterfaceData) {
      delete this.modelDataPoolCustomInterfaceData[key]
    }

    this.customDataEventStack.splice(0, this.customDataEventStack.length)
    this.componentDataEventStack.splice(0, this.componentDataEventStack.length)
    this.interfaceDataEventStack.splice(0, this.modelDataPoolInterfaceList.length)

    delete this.queryService
  }
  /**
   * 在首页onchangeComponentList 触发的时候清除所有 component
   */
  clearComponentData(){
    for(let key in this.modelDataPoolComponent) {
      delete this.modelDataPoolComponent[key]
    }
  }
  clearCustomDatePage(){
    for(let key in this.modelDataPoolCustomData) {
      if(this.modelDataPoolCustomData[key].type&&this.modelDataPoolCustomData[key].type=='pageParam'){
        delete this.modelDataPoolCustomData[key]
      }
    }
  }

  /**
   * 请求接口，初始化接口数据
   * 这是个异步操作
   */
  initInterfaceData(){
    this.queryService = new QueryInterfaceData(this.modelDataPoolInterfaceList)
    this.queryService.run()
  }

  setPagination(config){
    this.modelDataPoolInterfaceList.forEach(item=>{
      if(item.id==config.uuid){
        item.data.pagination=config.pagination
      }
    })
  }

  // get
  getCleanInterfaceConfig(){
    // 获取一份没有responseData的接口配置备份，注意是备份不是原对象
    let interfaceConfigs = []
    let interfaceListTemp = JSON.parse(JSON.stringify(this.modelDataPoolInterfaceList))
    interfaceListTemp.forEach(interfaceItem => {
      if (!interfaceItem.data.isMockData) {
        delete interfaceItem.data.responseData
      }
    })
    return interfaceListTemp
  }
  getAllData(){
    return {
      component: this.modelDataPoolComponent,
      interface: this.modelDataPoolInterfaceList,
      custom: this.modelDataPoolCustomData
    }
  }
  getComponentData(uuid){
    if (uuid) {
      return this.modelDataPoolComponent[uuid]
    } else {
      return this.modelDataPoolComponent
    }
  }
  getInterfaceData(key){
    if(key){
      let singleData={};
      this.modelDataPoolInterfaceList&&this.modelDataPoolInterfaceList.forEach(item=>{
        if(item.id==key){
          singleData=item;
        }
      })
      return singleData
    }else{
      return this.modelDataPoolInterfaceList
    }
  }
  updateInterfaceData(key){
    if(key){
      let singleData={};
      this.modelDataPoolInterfaceList&&this.modelDataPoolInterfaceList.forEach(item=>{
        if(item.id==key){
          this.queryService.getInterfaceParamAndData(item)
          singleData=item;
        }
      })
      console.log('------------updateInterfaceData',singleData,key)
      return singleData
    }else{
      return this.modelDataPoolInterfaceList
    }
  }
  getCustomData(key,dataType){
    // customData 包含了page 页面入参 和一些绑定的变量
    if (key) {
      // 2021-07-01 临时方案
      if(dataType){
        return this.modelDataPoolCustomData[key].value;
      }else{
        // 区分下 是页面还是绑定数据
        if(this.modelDataPoolCustomData[key] && typeof this.modelDataPoolCustomData[key].linkPageIndex!='undefined'){
          return this.modelDataPoolCustomData[key].operateHrefPageParamValue
        }else{
          return this.modelDataPoolCustomData[key]
        }
      }
    } else {
      return this.modelDataPoolCustomData
    }
  }


  getCustomInterfaceData(key){
    if (key&&this.modelDataPoolCustomInterfaceData[key]) {
      return this.modelDataPoolCustomInterfaceData[key];
    } else {
      return this.modelDataPoolCustomInterfaceData
    }
  }



  // save
  saveComponentData(uuid, componentConfig){
    this.modelDataPoolComponent[uuid] = componentConfig
    this.onComponentDataEvent()
  }
  saveInterfaceData(apiData){
    // 待优化 TODO
    this.modelDataPoolInterfaceList.push(apiData)
    if(this.queryService && apiData.data.isMockData != true){
      // 如果 接口对象以及初始化，则调用 saveInterfacParamAndData
      this.queryService.saveInterfacParamAndData(apiData);
    }else{
      //没有初始化则会在 首页 所有的saveInterfaceData 结束后主动调用 接口对象的初始化方法 initInterfaceData
    }
    this.dispatchInterfaceDataEvent()
  }
  saveCustomData(key, value,dataType){
    // 2021-07-01 临时方案 后期 变量选择的时候 要做成级联选择的方式，到时候这块重构下
    if(dataType){
      this.modelDataPoolCustomData[key] = dataType
    }else{
      this.modelDataPoolCustomData[key] = value

    }
    this.onCustomDataEvent()
  }

  saveCustomInterfaceData(key, value){
    // 这个方法主要是用来处理 事件 接口返回值的
    this.modelDataPoolCustomInterfaceData[key] = value
  }

  // delete
  deleteInterfaceData(index){
    this.modelDataPoolInterfaceList.splice(index, 1)
    this.dispatchInterfaceDataEvent()
  }
  // 清除所有接口数据
  // clearInterfaceData(){
  //   this.modelDataPoolInterfaceList.splice(0, this.modelDataPoolInterfaceList.length)
  // }

  /**
   * 监听事件
   * 有参数是自定义监听方法，没参数说明是触发监听方法
   *
   * @param func 回调方法
   */
  onCustomDataEvent(func?){
    if (func) {
      this.customDataEventStack.push(func)
    } else {
      this.customDataEventStack.forEach(funcItem => {
        if (typeof funcItem === 'function') {
          funcItem()
        }
      })
    }
  }
  onComponentDataEvent(func?){
    if (func) {
      this.componentDataEventStack.push(func)
    } else {
      this.componentDataEventStack.forEach(funcItem => {
        if (typeof funcItem === 'function') {
          funcItem(this.modelDataPoolComponent)
        }
      })
    }
  }
  // 注册Interface事件
  addListenerInterfaceDataEvent(func){
    this.interfaceDataEventStack.push(func)
  }
  // 触发Interface事件
  dispatchInterfaceDataEvent(){
    this.interfaceDataEventStack.forEach(funcItem => {
      if (typeof funcItem === 'function') {
        funcItem()
      }
    })
  }
  /**
   * 移除事件监听
   * 事件原理：通过回调方法的地址找到监听事件栈的位置，然后移除
   *
   * @param func 调用on方法时传的监听方法
   */
  removeCustomDataEvent(func) {
    let index = this.customDataEventStack.indexOf(func)
    if (index !== -1) {
      this.customDataEventStack.splice(index, 1)
    }
  }
}
