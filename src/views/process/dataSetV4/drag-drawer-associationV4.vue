<template>
  <!--  数据连接器  -->
  <div class="data-join-wrap">
    <div class="group-content">
      <el-form
        :model="dataInsertItem"
        :rules="opRule"
        ref="dataJoinForm"
        label-width="80px"
        label-position="left"
      >
        <el-form-item prop="name" label="节点名称">
          <el-input v-model="showName"></el-input>
        </el-form-item>
        <el-form-item label="主数据" prop="connection_dbConfigId">
          <VarSelect
            :processId="processId"
            key="dataJoin-leftValue"
            :data="dataInsertItem.source"
            type="source"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </el-form-item>
        <el-form-item label="字段名称">
          <el-input v-model="dataInsertItem.detailName" @input="andorChange"></el-input>
        </el-form-item>
        <el-form-item label="数据库" prop="connection_dbConfigId">
          <el-select
            v-model="dataInsertItem.dbConfigId"
            class="menu-item-select-db"
            clearable
            filterable
            @change="dbConfigChange"
          >
            <el-option
              v-for="dataSourceItem in dataSourceList"
              :label="dataSourceItem.dataSourceName"
              :value="dataSourceItem.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <h3>
          SQL脚本
          <span style="font-size: 12px">使用{占位符}增加占位符编辑功能</span>
        </h3>
        <el-row>
          <CodeEditor
            v-model="dataInsertItem.sql"
            :editorOptions="editorOptions"
            :height="editorHeight"
            mode="sql"
            width="100%"
          />
        </el-row>
        <el-row>
          <ul class="menu-item-wrap">
            <li
              v-for="(condiItem, condiIndex) in dataInsertItem.conditions"
              :key="condiIndex"
            >
              <div class="menu-item-li" style="justify-content: normal">
                <span class="tree-item-text">{{ condiItem.key + ":" }}</span>
                <el-select v-model="condiItem.andor" class="menu-item-select" style="width:100px" @change="andorChange">
                  <el-option label="变量" value="VAR"></el-option>
                  <el-option label="AND" value="AND"></el-option>
                  <el-option label="OR" value="OR"></el-option>
                </el-select>
                <el-input
                  v-if="condiItem.andor != 'VAR'"
                  v-model="condiItem.name"
                  placeholder="字段名"
                  size="small"
                  style="width: 150px; line-height: 40px; margin: 0 5px"
                />
                <!--              <div class="condition-item">-->
                <el-select
                  v-if="condiItem.andor != 'VAR'"
                  v-model="condiItem.op"
                  class="menu-item-select"
                >
                  <el-option label="=" value="="></el-option>
                  <el-option label=">" value=">"></el-option>
                  <el-option label="<" value="<"></el-option>
                  <el-option label=">=" value=">="></el-option>
                  <el-option label="<=" value="<="></el-option>
                  <el-option label="!=" value="<>"></el-option>
                  <el-option label="in" value="in"></el-option>
                  <el-option label="not in" value="not in"></el-option>
                  <el-option label="like" value="like"></el-option>
                  <el-option label="not like" value="not like"></el-option>
                </el-select>
                <!--              </div>-->

                <VarSelect
                  style="margin-left: 16px"
                  :key="'connector-sql-' + condiIndex"
                  :data="condiItem.value"
                  :processId="processId"
                  :type="'sql-' + condiIndex"
                  class="menu-item-select-var"
                  @setVar="setVar"
                  @submitVarList="saveVarEdit"
                />
                <span
                  v-if="condiItem.andor != 'VAR'"
                  class="tree-item-text"
                  style="cursor: pointer"
                  @click="condiItem.more = !condiItem.more"
                  >条件</span
                >
              </div>
              <ul v-if="condiItem.more">
                <li>
                  <span class="tree-item-text">当</span>
                  <VarSelect
                    :key="'connector-left-' + condiIndex"
                    :data="condiItem.condition.left"
                    :processId="processId"
                    :type="'left-' + condiIndex"
                    class="menu-item-select-var"
                    @setVar="setVar"
                    @submitVarList="saveVarEdit"
                  />
                  <el-select
                    v-model="condiItem.condition.op"
                    class="menu-item-select"
                    @change="changeCondition(condiItem)"
                  >
                    <el-option label="=" value="="></el-option>
                    <el-option label=">" value=">"></el-option>
                    <el-option label="<" value="<"></el-option>
                    <el-option label=">=" value=">="></el-option>
                    <el-option label="<=" value="<="></el-option>
                    <el-option label="!=" value="<>"></el-option>
                    <el-option label="isNull" value="isNull"></el-option>
                    <el-option label="isNotNull" value="isNotNull"></el-option>
                  </el-select>
                  <VarSelect
                    :key="'connector-right-' + condiIndex"
                    :data="condiItem.condition.right"
                    :processId="processId"
                    :type="'right-' + condiIndex"
                    class="menu-item-select-var"
                    @setVar="setVar"
                    @submitVarList="saveVarEdit"
                  />
                  <span class="tree-item-text">使用表达式</span>
                </li>
              </ul>
            </li>
          </ul>
        </el-row>
      </el-form>
      <h3 style="margin-top: 20px">备注</h3>
      <el-input
        v-model="dataInsertItem.remark"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 15 }"
        placeholder="Enter something..."
      />
    </div>
  </div>
</template>

<script>
import VarSelect from "../module/variable-selectV4";
import CodeEditor from "@/components/CodeEditor";
import { getDataSourceList } from "@/api/report";
export default {
  name: "drag-drawer-associationV4",
  components: {
    VarSelect,
    CodeEditor,
  },
  props: {
    curDiagram: {
      type: Object,
    },
    processId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showName: "",
      dataInsertItem: {
        name: "",
        remark: "",
        dbConfigId:"",
        detailName:"",
        source: {
          category: "",
          name: "",
          type: 0,
          value: "",
        },
        sql: "",
        conditions: [],
      },
      opRule: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      dataSourceList: [],
      merchantId: 0,
      projectId: 0,
      sql: "",
      editorHeight: "200px",
      editorOptions: {
        showGutter: false,
      },
      //        startArgs:[]
    };
  },
  watch: {
    "dataInsertItem.sql"(val) {
      this.sqlAnalysis(val);
    },
  },
  mounted() {
    var self = this;

    var properties = JSON.parse(
      JSON.stringify(this.curDiagram.getProperties())
    );
    console.log(properties, "properties");
    this.showName = this.curDiagram.title;
    this.dataInsertItem = {
      title: properties.title || "",
      id: properties.id,
      detailName:properties.detailName,
      remark: properties.remark,
      source: properties.source || {},
      sql: properties.sql,
      dbConfigId:properties.dbConfigId
    };

    this.dataInsertItem.name = this.curDiagram.title;
    console.log(this.dataInsertItem, "this.dataInsertItem");
    this.merchantId = this.$store.getters.merchantId;
    this.projectId = this.$store.getters.projectId;
    this.getDbConfigList();
    var _this = this;
    // 由于watch 了sql 变化导致sqlParamList清空，所以在这边延时回显paramList
    setTimeout(function () {
      _this.dataInsertItem.conditions = [];
      _this.dataInsertItem.conditions = properties.conditions;
      _this.$forceUpdate()  
    }, 1000);
    
    // getVariableList(this.processId, 1, 999).then(res => {
    //   if (res.data.code == 0) {
    //     this.variableList = res.data.data;
    //     this.varMap = new Map();
    //     this.variableList.forEach(item => {
    //       this.varMap.set(item.name, JSON.parse(item.variables));
    //     });
    //   }
    // });
    //      this.startArgs = this.flow.getArgs()
  },
  methods: {
    getDbConfigList() {
      getDataSourceList(this.merchantId, this.projectId).then((res) => {
        if (res.code == 0) {
          this.dataSourceList = res.dataList;
        }
      });
    },
    dbConfigChange(event) {
      for (var i = 0; i < this.dataSourceList.length; i++) {
        var dataSource = this.dataSourceList[i];
        if (dataSource.id == event) {
          this.dataInsertItem.dataSourceName = dataSource.dataSourceName;
        }
      }
    },
    andorChange(){
      this.$forceUpdate();
    },
    // ...mapActions(["getVariableList"]),
    setVar(param, type) {
      if (type) {
        let tList = type.split("-");
        console.log("setVar", tList);
        if (tList[0] == "source") {
          this.dataInsertItem.source = {};
          this.dataInsertItem.source = param;
        } else if (tList[0] == "rightValue") {
          this.dataInsertItem.right = {};
          this.dataInsertItem.right = param;
        } else if (tList[0] == "param") {
          // TODO
          this.dataInsertItem.sourceList[tList[1]].source = {};
          this.dataInsertItem.sourceList[tList[1]].source = param;
          this.$set(this.dataInsertItem.sourceList[tList[1]].source, param);
        } else if (tList[0] == "set") {
          this.dataInsertItem.setList[tList[1]].source = {};
          this.dataInsertItem.setList[tList[1]].source = param;
          this.$set(this.dataInsertItem.setList[tList[1]].source, param);
        } else if (tList[0] == "sql") {
          this.dataInsertItem.conditions[tList[1]].value = {};
          this.dataInsertItem.conditions[tList[1]].value = param;
          this.$set(this.dataInsertItem.conditions[tList[1]].value, param);
          this.$forceUpdate();
        } else if (tList[0] == "right") {
          this.dataInsertItem.conditions[tList[1]].condition.right = {};
          this.dataInsertItem.conditions[tList[1]].condition.right = param;
          this.$set(
            this.dataInsertItem.conditions[tList[1]].condition.right,
            param
          );
        } else if (tList[0] == "left") {
          this.dataInsertItem.conditions[tList[1]].condition.left = {};
          this.dataInsertItem.conditions[tList[1]].condition.left = param;
          this.$set(
            this.dataInsertItem.conditions[tList[1]].condition.left,
            param
          );
        }
      }
    },
    saveVarEdit(varList) {
      this.$emit("submitVarList", varList);
    },
    select(index) {
      this.editNum = index;
    },

    // 模态框取消按钮触发事件
    cancel() {
      // this.$Message.info('Clicked cancel');
    },

    saveConfig(name) {
      var self = this;

      let configJson = this.dataInsertItem;
      configJson.title = this.showName;

      console.log(configJson, "configJson");

      this.$emit("arguments", configJson);
    },

    cancel() {
      this.$emit("cancel");
    },
    sqlAnalysis(val) {
      // 2020-09-23记录之前的sqlParamList 如果和现在解析的一样 直接赋值
      let tempConditionList = this.dataInsertItem.conditions;
      this.dataInsertItem.conditions = [];
      var pattern = /{(.*?)}/g;
      var conditions = [];
      var temp;
      while ((temp = pattern.exec(val))) {
        // 去除双花括弧 以及去空
        var tItem = temp[0]
          .replace(/{(.*?)}/g, "$1")
          .replace(/(^\s*)|(\s*$)/g, "");
        // 去重
        if (conditions.indexOf(tItem) < 0) {
          conditions.push(tItem);
        }
      }
      //这里的array 就是可以用的了
      for (var key in conditions) {
        var conditionItem = {
          key: conditions[key],
          name: "",
          op: "",
          value: {},
          andor: "VAR",
          more: false,
          condition: {
            left: {},
            op: "",
            right: {},
          },
        };
        if(tempConditionList){
          for (let i = 0; i < tempConditionList.length; i++) {
            let tempCondi = tempConditionList[i];
            if (conditions[key] == tempCondi.key) {
              conditionItem = tempCondi;
            }
          }
        }
       
        this.dataInsertItem.conditions.push(conditionItem);
      }
    },
  },
};
</script>

<style scoped lang="less">
.mt10 {
  margin-top: 10px;
}
ul li {
  list-style-type: none;
}
.spp-box-list {
  border: 1px solid #d6d6d6;
  /*padding: 10px;*/
  border-radius: 5px;
  margin-top: 10px;
  min-height: 100px;
}
.spp-box-list li.atrItem:hover {
  background-color: #f6f6f6;
}
.spp-box-list li {
  cursor: pointer;
  line-height: 24px;
  padding: 0 5px;
}
.activeRow {
  background: #e5e5e5;
}
.data-join-wrap {
  position: relative;
  height: 100%;
  .el-select {
    width: 90px;
  }
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
  height: calc(100% - 30px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
}
.param-btns {
  margin-top: 10px;
}
.param-btns .icon {
  margin-right: 10px;
}
.group-btns .btn {
  margin-right: 15px;
}
.data-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.data-option-name {
  font-weight: bold;
}
.data-option-dir {
  margin-top: 5px;
}
.condition-type-div {
  display: flex;
}
.condition-type-div div {
  border: 1px solid #000;
  border-radius: 5px;
  padding: 0px 15px;
  margin-right: 15px;
  cursor: pointer;
}
.chosen-type {
  background-color: #2d8cf0;
  border: 1px solid #2d8cf0;
  color: #fff;
}

/deep/.menu-item-select-middle {
  margin: 0px 10px;
  width: 90px;
}
.menu-item-select-middle {
  /deep/.el-input {
    width: 90px;
  }
}
.tree-item-operator {
  font-size: 28px;
  line-height: 40px;
  padding: 0px 5px;
}
.condition-list-item {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
.condition-middle {
  width: 95px;
  text-align: center;
  font-size: 22px;
}
.menu-item-wrap {
  position: relative;

  ul {
    width: 90%;
    margin: auto;
    display: flex;
    background-color: #fff;
    box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    padding: 10px;
    z-index: 1;
  }

  ul li {
    position: relative;
    list-style-type: none;
    display: flex;
  }
}
.menu-item-li {
  margin: 5px 0px 0px 0px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 5px 10px;
  z-index: 2;
  position: relative;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  height: 50px;

  .tree-item-operator {
    font-size: 28px;
    line-height: 40px;
    padding: 0px 5px;
  }
}

.tree-item-text {
  white-space: nowrap;
  font-size: 16px;
  line-height: 40px;
  padding: 0px 5px;
}
.menu-item-select {

  /deep/ .el-input__inner {
      width:100px
  }


  /deep/ .el-select{
    width:100px
  }
}
</style>
