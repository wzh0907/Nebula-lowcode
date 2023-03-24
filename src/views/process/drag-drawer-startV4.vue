<template>
    <!--  开始  -->
    <div class="group-wrap app-warp">
      <div class="ioDiv">
        <!-- 输入 -->
        <div class="param-title">输入参数</div>
        <draggable
              tag="ul"
              class="menu-item-wrap"
              :list="inParams"
              handle=".handle"
              @end="onDragMoveEnd"
              @start="onDragMoveStart($event, asideMenuComponentConfigList[key])"
            >
            <li v-for="(data,attributeIndex) in inParams" :key="attributeIndex">
              <div class="menu-item-li" >
                <i class="iconfont iconprojectmenu handle"></i>
                <div class="tree-item-func" @click="data.showType=!data.showType;$forceUpdate()">{{ getTypeName(data.type) }}</div>
                <div style="width:80%;display:flex;flex-warp:nowarp" >
                  <span class="input-label">名称</span>
                  <el-input size="small" v-model="data.name"/>
                  <span class="input-label">默认值</span>
                  <DateChoose v-if="data.type == '2'" :data="data"  :type="'in-' + attributeIndex + '-' + 0" @setDate="setDate"/>
                    <el-row v-else>
                      <el-input size="small" v-model="data.value" />
                    </el-row>
                </div>
                <i class="el-icon-delete tree-item-operator" style="cursor: pointer;" @click="propertyDelete(attributeIndex,'input')"></i>
              </div>
              <ul v-if="data.showType" >
                <li v-for="(func,key) in inTypeList" :key="key" @click="funcChange(func.name, attributeIndex)">{{func.name}}</li>
              </ul>
            </li>
       </draggable>
       <div @click="setAttributes" class="opt-add-btn">
         <icon class="iconfont iconjiahao1"></icon>
         添加参数
       </div>
        <div class="param-title">输出参数</div>
         <draggable
              tag="ul"
              class="menu-item-wrap"
              :list="outParams"
              handle=".handle"
              @end="onDragMoveEnd"
              @start="onDragMoveStart($event, asideMenuComponentConfigList[key])"
            >
            <li v-for="(data,attributeIndex) in outParams" :key="attributeIndex">
              <div class="menu-item-li" >
                <i class="iconfont iconprojectmenu handle"></i>
                <div class="tree-item-func" @click="data.showType=!data.showType ;$forceUpdate()">{{ getTypeName(data.type) }}</div>
                <div style="width:80%;display:flex;flex-warp:nowarp" >
                  <span class="input-label">名称</span><el-input size="small" v-model="data.name"/>

                </div>
                <i class="el-icon-delete tree-item-operator" style="cursor: pointer;" @click="propertyDelete(attributeIndex,'output')"></i>
              </div>
              <ul v-if="data.showType" >
                <li v-for="(func,key) in outTypeList" :key="key" @click="outfuncChange(func.name, attributeIndex)">{{func.name}}</li>
              </ul>
            </li>
       </draggable>
        <div @click="addOutParam" class="opt-add-btn">
          <icon class="iconfont iconjiahao1"></icon>
          添加参数
        </div>
      </div>
    </div>
</template>

<script>
import VarSelect from "./module/variable-selectV4";
import VarEdit from "./module/variable-editV4";
import DateChoose from "./module/date-choose";
import Draggable from "vuedraggable";
import { mapMutations } from "vuex";
/* eslint-disable */
export default {
  name: 'drag-drawer-content',
  props:['curDiagram','processId'],
  components: {
    VarSelect,
    VarEdit,
    Draggable,
    DateChoose
  },
  data () {
    return {
      startGroup: [],
      inRowNum: 0,
      outRowNum: 0,
      paramIdx: 0,
      inParams: [],
      outParams: [],
      attributeList: [],
      formItem: {
        default_value: [],
        nameCn: '',
        name: '',
        type: 'String'
      },
      modal1: false,
      modal2: false,
      modal1Obj: {
        property_name: '',
        data_value: '',
        relative_to_current_date_type: '',
        relative_to_current_date_delta: '',
        date_type: '',
        date_format: '',
        value_type: ''
      },
      opType: 1, // 1新增输入参数  2新增输出参数
      variateTagList:[],
      inputList:[],
      outputList:[],
      cVal:"",
      oVal:"",
      typeList:[{name:'文本',type:0},{name:'数值',type:1},{name:'日期',type:2},{name:'列表',type:3},{name:'对象',type:4}],
      inTypeList:[{name:'文本',type:0},{name:'数值',type:1},{name:'日期',type:2}],
      outTypeList:[{name:'文本',type:0},{name:'数值',type:1},{name:'日期',type:2},{name:'列表',type:3}],
    }
  },
  mounted () {
    let varMap = this.$store.getters.varMap;
    this.variateTagList = varMap.get(this.processId);
    var properties = JSON.parse(JSON.stringify(this.curDiagram.getProperties()));
    if(properties.inputs){
      this.inParams = [...properties.inputs]
      this.inParams.forEach(item=>{
        item.showType=false
      })
      this.outParams = [...properties.outputs]
      this.outParams.forEach(item=>{
        item.showType=false
      })
    }
    console.log('this.inParams',properties);
    // if(properties.outputs){
    //   this.outParams = [...properties.outputs]
    // }
  },
  methods: {
     ...mapMutations([
      "setVarMap",
    ]),
    syncReturnData(data){
      this.outParams = [
        ...data,
        ...this.outParams
      ]
    },
    saveConfig () {
      let inputList=[];
      let outputList=[];
      this.inParams.forEach(inItem=>{
        let input={
          category:inItem.category,
          name:inItem.name,
          type:inItem.type,
          value:inItem.value,
          date:inItem.date,
          time:inItem.time,
          currentDate:inItem.currentDate,
          currentTime:inItem.currentTime
        }
        inputList.push(input)
      })
      this.outParams.forEach(inItem=>{
        let output={
          category:inItem.category,
          name:inItem.name,
          type:inItem.type,
          value:inItem.value
        }
        outputList.push(output)
      })
      let data = {
        inputs: inputList,
        outputs:outputList
      }
      this.variateTagList.forEach( item =>{
        if(item.name==='输入参数'){
          item.variables=this.inParams;
        }else if(item.name==='输出参数'){
          item.variables=this.outParams;
        }
      });
      let varMap = {
          processId:this.processId,
          varTagList:this.variateTagList
      }
      this.setVarMap(varMap)

      this.$emit('arguments', data);

    },
    startAddData () {
      this.startGroup.push({
        id: this.startGroup.length + 1,
        type: 'string',
        name: '',
        title: ''
      })
    },
    startDeleteData () {
      if (this.startGroup == 1) return
      this.startGroup.splice(this.startGroup.length - 1, 1)
    },
    delThis (index) {
      this.startGroup.splice(index, 1)
    },
    cancel(){
      console.log("12312323")
      this.$emit('cancel')
    },
    deleteItem(){
      this.$emit('delete')
      this.$emit('cancel')
    },
    setAttributes () {
       var newscript = {
        category: "输入参数",
        name: "",
        type: 0,
        value: "",
        showType:false,
      };
      this.inParams.push(newscript);
      // this.inRowNum = this.inParams.length - 1;
      // this.cVal.push(""+this.inRowNum);
    },
    addOutParam(){
      var newscript = {
        category: "输出参数",
        name: "",
        type: 0,
        value: "",
         showType:false,
      };
      this.outParams.push(newscript);
      // this.outRowNum = this.outParams.length - 1;
      // this.oVal.push(""+this.outRowNum);
    },
    checkedParamRow (index) {
      this.paramIdx = index
    },
    checkedRow (index,tag) {
        if(tag ==1){
          this.inRowNum = index
        }
        if(tag ==2){
          this.outRowNum = index
        }
    },
    resetParam(){
        this.modal1Obj = {
        property_name: '',
          data_value: '',
          relative_to_current_date_type: '',
          relative_to_current_date_delta: '',
          date_type: '',
          date_format: '',
          value_type: ''
      }
    },
      resetForm(){
      this.formItem = {
          default_value: [],
          nameCn: '',
          name: '',
          type: 'String'
      }
    },
    editAtr (tag) {
      this.modal2 = true
//      this.opType = tag
      var cur = {};
      if(tag == 1){
        cur = this.inParams[this.inRowNum]
      }
      if(tag == 2){
        cur = this.outParams[this.outRowNum]
      }
      this.formItem.type = cur.type
      this.formItem.name = cur.name
      this.formItem.nameCn = cur.nameCn

    },
    propertyDelete(attributeIndex,type) {
      if(type==='input'){
        this.inParams.splice(attributeIndex, 1);
      }else{
        this.outParams.splice(attributeIndex, 1);
      }

    },

    upAtr(attributeIndex,type) {
      if(type==='input'){
        var list = this.inParams;
        var idx = attributeIndex;
        if (idx > 0) {
          var item = list.splice(idx, 1);
          list.splice(idx - 1, 0, item[0]);
          this.inParams = list;
          this.inRowNum = idx - 1;
        }
      }else {
        var list = this.outParams;
        var idx = attributeIndex;
        if (idx > 0) {
          var item = list.splice(idx, 1);
          list.splice(idx - 1, 0, item[0]);
          this.outParams = list;
          this.outRowNum = idx - 1;
        }
      }

    },
    downAtr(attributeIndex,type) {
      if(type==='input'){
        var list = this.inParams;
        var idx = attributeIndex;
        if (idx > -1) {
          if (idx < list.length - 1) {
            var item = list.splice(idx, 1);
            list.splice(idx + 1, 0, item[0]);
            this.inParams = list;
            this.inRowNum = idx + 1;
          }
        }
      }else{
        var list = this.outParams;
        var idx = attributeIndex;
        if (idx > -1) {
          if (idx < list.length - 1) {
            var item = list.splice(idx, 1);
            list.splice(idx + 1, 0, item[0]);
            this.inParoutParamsams = list;
            this.outRowNum = idx + 1;
          }
        }
      }

    },

    setParameter () {
      this.modal1 = true
      this.opType = 3
      this.resetParam()
    },
    editParam () {
      this.modal1 = true
      this.opType = 4
      var cur = this.attributeList[this.inRowNum].default_value[this.paramIdx]
      if (cur) {
        this.paramObj = { ...cur }
      }
    },
    paramDelete () {
      this.attributeList[this.inRowNum].default_value.splice(this.paramIdx, 1)
      var paramLen = this.attributeList[this.inRowNum].default_value.length
      if( (this.paramIdx +1) > paramLen){
        this.paramIdx = paramLen -1
      }
    },
    upPam () {
      var list = this.attributeList[this.inRowNum].default_value
      var idx = this.paramIdx
      if (idx > 0) {
        var item = list.splice(idx, 1)
        list.splice(idx - 1, 0, item[0])
        this.attributeList[this.inRowNum].default_value = list
        this.paramIdx = idx - 1
      }
    },
    downPam () {
      var list = this.attributeList[this.inRowNum].default_value
      var idx = this.paramIdx
      if (idx > -1) {
        if (idx < list.length - 1) {
          var item = list.splice(idx, 1)
          list.splice(idx + 1, 0, item[0])
          this.attributeList[this.inRowNum].default_value = list
          this.paramIdx = idx + 1
        }
      }
    },
    okAttribute () {
      if (this.opType == 1) { //inParam
        this.inParams.push(this.formItem)
        this.inRowNum = this.inParams.length - 1
      }
      if (this.opType == 2) {  //outParam
        let item = { ...this.formItem };
        delete item.default_value;
        this.outParams.push(this.formItem)
        this.outRowNum = this.outParams.length - 1
      }
      if (this.opType == 3) { //新增默认值
//          this.attributeList.push(this.modal1Obj)
//          this.paramIdx = this.attributeList.length - 1
        let afr = this.inParams[this.inRowNum].default_value
        afr.push({...this.modal1Obj})
         this.paramIdx = afr.length - 1
      }
      if (this.opType == 4) { //修改默认值
        this.modal1Obj  = {...this.inParams[this.inRowNum].default_value[this.paramIdx]}
      }
    },
    setVar(param, type) {
      let tList = type.split("-");
      if (tList[0] == "out") {
        this.outParams[tList[1]] = {};
         param.category='输出参数';
        this.outParams[tList[1]] = param;
        this.$set(this.outParams, tList[1], param);
      }else if (tList[0] == "in") {
        this.inParams[tList[1]] = {};
        param.category='输入参数';
        this.inParams[tList[1]] = param;
        this.$set(this.inParams, tList[1], param);
      }
    },
    setDate(param, type){
       let tList = type.split("-");
       if (tList[0] == "in") {
        this.inParams[tList[1]] = {};
        param.category='输入参数';
        this.inParams[tList[1]] = param;
        this.$set(this.inParams, tList[1], param);
      }
    },
    setOutVar(param, type) {
      let tList = type.split("-");
      this.outParams[tList[1]] = {};
      if (tList[0] == "return") {
        this.outParams[tList[1]] = param;
        this.$set(this.outParams, tList[1], param);
      }
    },
    funcChange(event, index) {
       this.typeList.forEach(item=>{
        if (item.name == event) {
          if(item.type===2){
            this.inParams[index].date="";
            this.inParams[index].time="";
            this.inParams[index].currentDate=false;
            this.inParams[index].currentTime=false;
          }else{
            delete this.inParams[index].date
            delete this.inParams[index].time
            delete this.inParams[index].currentDate
            delete this.inParams[index].currentTime
          }
          this.inParams[index].type=item.type;
          this.inParams[index].showType=false;
        }
       });

    },
    outfuncChange(event, index){
      this.typeList.forEach(item=>{
        if (item.name == event) {
          this.outParams[index].type=item.type;
          this.outParams[index].showType=false;
        }
       });
    },
    getTypeName(value){
      let name;
      this.typeList.forEach(item=>{
        if(item.type==value){
          name= item.name;
        }
      })
      return name;
    },
    onDragMoveEnd(){},
    onDragMoveStart(){},
    setOptionDate(value, type) {
      console.log("setOptionDate",value,type,this.inParams)

      // this.inParams[index].currentDate = false;
      // this.variateInfo.date = value;
      // this.variateInfo.currentDate = false;
      // this.dealDate(index);
    },
    setOptionTime(value, type) {
      this.variateInfo.time = value;
      this.variateInfo.currentTime = false;
      this.dealDate();
    },
    dealDate(index) {

      if (this.inParams[index].date && this.inParams[index].time) {
        this.inParams[index].value =
          this.inParams[index].date + " " + this.inParams[index].time;
      } else if (this.inParams[index].date) {
        this.inParams[index].value = this.inParams[index].date;
      } else if (this.inParams[index].time) {
        this.inParams[index].value = this.inParams[index].time;
      }
      console.log("dealDate",index,this.inParams)

    },
  },

  watch: {
    // 'type': function (newVal) {
    //   this.type = newVal
    // }
  }
}
</script>

<style scoped lang="less" >
  .mt10{
    margin-top: 10px;
  }
  .delBtn{
    line-height: 32px;
  }
  .ioDiv{
    height: calc( 100% - 100px);
    overflow-y: auto;
  }
  .param-title {
    margin: 10px 0;
    font-size: 14px;
    font-weight: bold;
  }
  .group-wrap{
    height: 100%;
    position: relative;
    padding: 15px;
    overflow: hidden;
    /*display: flex;*/
    /*flex-direction: column;*/
  }
  .group-content{
   /*flex-grow: 1;*/
    margin-bottom: 10px;
    height:calc(100% - 36px);
    overflow-y: auto;
    overflow-x:hidden;
  }
  .group-content > div{
    margin-bottom: 10px;
  }
  .group-btns{
    border-top: 1px solid #dadada;
    padding-left:15px;
    background-color: white;
    position: absolute;
    bottom:0;
    left:0;
    width:100%;
  }

  .group-btns .btn{
    margin-right: 15px;
  }
  .spp-box-list{
    border: 1px solid #d6d6d6;
    padding: 2px 0;
    border-radius: 2px;
    margin-top: 10px;
    min-height:200px;
  }
  .spp-box-list li.atrItem:hover{
    background-color: #f6f6f6;
  }
  .spp-box-list li {
    cursor:pointer;
    line-height: 24px;
    padding:0 5px;
  }
  .param-btns{
    margin-top: 10px;
  }
  .param-btns .icon{
    margin-right: 5px;
  }
  .atrChecked{
    background-color: #5a6268;
    color:white;
  }
  // ----------------- draggable 样式--------------------------
  .data-warp{
  /deep/.el-input--suffix {
    width: 100%;
  }
  /deep/.el-input {
    width: 100%;
  }
  /deep/.el-select{
     width:100%;
  }
}
.mt10 {
  margin-top: 10px;
}
.mr10 {
  margin-right: 10px;
}
ul li{

}
.menu-item-li{
  margin: 0px 0px 20px 0px;
  box-shadow: 0px 2px 30px rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 5px 10px;
  .handle{
    margin: 5px;
    line-height: 28px;
    cursor: pointer;
  }

}
.menu-item-select{
  /deep/.el-cascader .el-input .el-input__inner{
    height:30px;
  }
}
.form-input{
      margin-top: 5px;
    margin-left: 5px;
  /deep/.el-input--suffix .el-input__inner{
    height:30px;
  }
}

.menu-item-wrap{
  position: relative;
  ul{
      width: 90%;
      margin: auto;
      display: flex;
      background-color: #fff;
      box-shadow: 0px 2px 30px rgba(0,0,0,0.1);
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      padding:10px;
      z-index: 1;
    }
   ul li {
    position: relative;
    list-style-type: none;
    padding:5px 10px;
    color:#fff;
    background-color: #0862EA;
    border-radius: 5px;
    margin:2px 5px;
    cursor: pointer;
    font-size:12px;
  }
}

.input-label {
  width:50px;
  line-height:40px;
  text-align: right;
  padding-right: 5px
}

.spp-box-list {
  position: relative;
  border: 1px solid #d6d6d6;
  /*padding:0 10px 10px 10px;*/
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden;
  /*padding-top:28px;*/
}
/*.spp-title{*/
/*position: absolute;top:0;left:0; background: #e5e5e5;padding: 5px 10px;*/
/*width:calc(100%);*/
/*}*/
.routeByList {
  width: 100%;
  line-height: 28px;
}

.ivu-form-item {
  margin-bottom: 10px;
}
.route-title1 {
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e1e1e1;
}
.routeBy-form {
  margin-top: 10px;
}
.group-wrap {
  position: relative;
  // height: 100%;
   height: calc(100vh - 100px);
}
.group-btns {
  border-top: 1px solid #dadada;
  background-color: white;
  position: absolute;
  padding-left: 15px;
  bottom: 0;
  left: 0;
  width: 100%;
}
.group-content {
  /*margin-bottom: 10px;*/
  height: calc(~"100% - 30px");
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
}
.routeByChecked {
  background-color: #5a6268;
  color: white;
}

.group-btns .btn {
  margin-right: 15px;
}
.func-select {
  width: 50%;
}
.new-func-select {
  width: 100%;
}
/deep/ .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.ivu-select-group {
  display: flex;
  flex-wrap: wrap;
}
/deep/.el-tree-node__content{
   height: 72px;
  box-shadow: 0px 2px 30px rgba(0,0,0,0.1);
}
.tree-item-text-wrap{
  max-height: 72px;
}
.tree-item{
  display: flex;
}
.tree-item-text{
  line-height: 40px;
  white-space: nowrap;
  padding: 0px 5px;
}
.tree-item-operator{
  font-size: 28px;
  line-height: 40px;
  padding:0px 5px;
}
.tree-item-func{
    white-space: nowrap;
    padding: 0px 10px;
    border-radius: 5px;
    color: #fff;
    line-height: 30px;
    margin: 5px;
    background-color: #0862EA;
  }
  .menu-item-li{
    z-index: 2;
    position: relative;
    background-color: #fff;
    display: flex;
    height:50px;
  }
   // -------------------------------------------
  .app-warp{
   /deep/.el-input{
     width:160px;
     line-height:40px;
    }
    /deep/.el-input--suffix{
      width:100%
    }
    /deep/.el-select{
      width:100%
    }
    /deep/.menu-item-select-middle{
      width:90px;
    }
    .menu-item-select-middle{
      /deep/.el-input{
        width:100%
      }
    }

}
</style>
