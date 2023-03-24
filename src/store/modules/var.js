import {
    getNewProcessDetail
  } from "@/api/process";

export default {
    state: {
      varTagList: [],
      varMap:new Map(),
      variableList:[]
    },
    mutations: {
      setVarMap(state, varMap){
        var processId=varMap.processId
        var varTagList = varMap.varTagList;
        state.varMap.set(processId,varTagList);
      },
      setVarTagList (state, varTagList) {
        state.varTagList = varTagList
        var varMap = new Map()
        varTagList.forEach(item => {
            varMap.set(item.name, item.variables);
         });
        state.varMap = varMap;
      },
      setVariableList(state, varTagList){
        var variableList=[];
        varTagList.forEach( tag =>{
          let variable={
            id:tag.id,
            name:tag.name,
            tag:true,
            color:tag.color,
            type:tag.type,
            ctype:tag.ctype,
            value:tag.value,
            value_type:tag.value_type
          }
          variableList.push(variable)
          if(tag.variables){
            if(tag.variables.length>0){
              variable.type=4;
            }
            
            tag.variables.forEach(vv=>{
              let markDiv;
              if (vv.type == 0) {
                markDiv = "T";
              }else if(vv.type == 1){
                 markDiv = "#";
              }else if(vv.type == 2){
                 markDiv = "D";
              }else if(vv.type == 3){
                 markDiv = "L";
              }
              let vchild={
                id:tag.id,
                name:vv.name,
                type:vv.type,
                value:vv.value,
                parentName:tag.name,
                color:vv.color,
                markText:markDiv,
                value_type:vv.value_type,
                row:vv.row,
                ctype:tag.ctype,
              }
              variableList.push(vchild)
            });
          }
          
        });
        state.variableList = variableList;
      }      
    },
    getters:{
        varTagList: state => state.varTagList,
        varMap: state => state.varMap,
        variableList: state => state.variableList
    },
    actions: {
      // 登录
      getNewProcessDetail ({ commit }, { id, projectId }) {
        userName = userName.trim()
        return new Promise((resolve, reject) => {
            getNewProcessDetail({
                id,
                projectId
          }).then(res => {
            let scheme = JSON.parse(res.data.data.scheme);
            this.variateTagList = scheme.variables;
            commit('varTagList', variateTagList)
            resolve()
          }).catch(err => {
            reject(err)
          })
        })
      },
    }
  }
  