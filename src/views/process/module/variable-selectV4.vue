<template>
  <div class="var-select-div">
    <!-- <el-dropdown  trigger="click" style="width:80%" @command="variableChoose">
      <el-input size="small" v-model="chosenVar" placeholder @on-change="inputChange" />
      <el-dropdown-menu slot="dropdown" >
        <el-dropdown-item
          v-for="item in variableList"
          :command="item.parentName+'@'+item.name+'@'+item.type"
          :class="item.tag?'tag-class':'val-class'"
          style="width:100%"
        >
          <span class="var-option" :style="'color:'+item.color">{{item.markText}}</span>
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>   -->
    <el-cascader
      ref="varSelect"
      v-model="value"
      :options="options"
      :props="{ checkStrictly: true }"
      clearable
      @change="handleChange"
      @expand-change="expandChange"
    >
      <template slot-scope="{ node, data }">
        <div v-if="data.type == 'input'">
          <span v-if="node.isLeaf">
            <VarConfirm :node="node" @confirmVar="confirmVar" />
          </span>
        </div>
        <div class="node-div" v-else>
          <span class="node-div-span">{{ data.label }}</span>
          <!-- <span  class="node-div-span" v-else>
            {{ data.label }}
            <el-tooltip class="item" effect="dark" :content="data.label" placement="top" :label="data.label">
               <i class="select-more iconfont icongengduo" />
            </el-tooltip>
          </span> -->

          <i
            class="select-delete iconfont icontrash"
            v-if="node.isLeaf"
            @click="deleteVar(node)"
          />
        </div>
      </template>
    </el-cascader>
  </div>
</template>

<script>
import VarEdit from "./variable-edit";
import VarConfirm from "./variable-confirm";
import { mapActions, mapMutations } from "vuex";
export default {
  name: "varSelect",
  props: {
    type: {
      type: String,
    },
    data: {
      type: Object,
      default: () => {},
    },
    processId: {
      type: Number,
    },
  },
  components: {
    VarEdit,
    VarConfirm,
  },

  data() {
    return {
      value: [],
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [{}],
        },
      ],
      varTagList: [],
      varMap: null,
      chosenVar: "",
      showVarEditModel: false,
      variableList: [
        {
          name: "123",
          tag: true,
        },
        {
          name: "测试参数123",
          parentName: "123",
        },
      ],
      tempVarChildren: [
        {
          value: "0",
          label: "文本",
          name: "文本",
          defaultVal: "0",
          children: [{ type: "input" }],
        },
        {
          value: "1",
          label: "数值",
          name: "数值",
          defaultVal: "1",
          children: [{ type: "input" }],
        },
        {
          value: "2",
          label: "日期",
          name: "日期",
          defaultVal: "2",
          children: [{ type: "input" }],
        },
        {
          value: "3",
          label: "列表",
          name: "列表",
          defaultVal: "3",
          children: [{ type: "input" }],
        },
        {
          value: "4",
          label: "map",
          name: "map",
          defaultVal: "4",
          children: [{ type: "input" }],
        },
      ],
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    varTagList: {
      handler(newVal, oldVal) {
        this.init();
      },
      deep: true,
    },
    data: {
      handler(newData, oldVal) {
        // 从父组件获取到回显参数
        this.show(newData);
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations(["setVarMap"]),
    init() {
      // this.variableList = this.$store.getters.variableList;
      // this.varTagList = this.$store.getters.varTagList;

      let varMap = this.$store.getters.varMap;
      this.varTagList = varMap.get(this.processId);
      this.handleVarList(this.varTagList);
      // 格式化 变量列表 转换成 级联需要的格式
      this.convertVar(this.varTagList);
      this.show(this.data);
    },
    handlerVarMap(varTagList) {
      let varMap = {
        processId: this.processId,
        varTagList: varTagList,
      };
      this.setVarMap(varMap);
    },
    handleVarList(varTagList) {
      var variableList = [];
      varTagList.forEach((tag) => {
        let variable = {
          id: tag.id,
          name: tag.name,
          tag: true,
          color: tag.color,
          type: tag.type,
          ctype: tag.ctype,
          value: tag.value,
          value_type: tag.value_type,
        };
        variableList.push(variable);
        if (tag.variables) {
          if (tag.variables.length > 0) {
            variable.type = 4;
          }

          tag.variables.forEach((vv) => {
            let markDiv;
            if (vv.type == 0) {
              markDiv = "T";
            } else if (vv.type == 1) {
              markDiv = "#";
            } else if (vv.type == 2) {
              markDiv = "D";
            } else if (vv.type == 3) {
              markDiv = "L";
            }
            let vchild = {
              id: tag.id,
              name: vv.name,
              type: vv.type,
              value: vv.value,
              parentName: tag.name,
              color: vv.color,
              markText: markDiv,
              value_type: vv.value_type,
              row: vv.row,
              ctype: tag.ctype,
            };
            variableList.push(vchild);
          });
        }
      });
      this.variableList = variableList;
    },
    handleinput(value) {
      return true;
    },
    expandChange() {
      var _this = this;
      setTimeout(function () {
        let children = _this.$refs.varSelect.$children[1].$children;
        _this.dealWithVarSelect(children);
      }, 50);
    },
    //处理级联选择器 自定义输入框 前面的radio
    dealWithVarSelect(children) {
      for (var j = 0; j < children.length; j++) {
        let leafChildren = children[j].$children[0].$children;
        for (var i = 0; i < leafChildren.length; i++) {
          let leaf = leafChildren[i];
          if (leaf.$children.length > 1) {
            leaf.$children[0].$el.style.display = "none";
          }
        }
      }
    },
    deleteVar(node) {
      let pathNodes = node.pathNodes;
      if (
        pathNodes[0].data.name != "变量" &&
        pathNodes[0].data.name != "数值"
      ) {
        this.$message.error("目前只能删除变量和数值", 2);
      } else {
        this.varTagList.forEach((varItem) => {
          if (varItem.name == pathNodes[0].data.name) {
            if (varItem.name == "变量") {
              varItem.variables.forEach((subItem, subIndex) => {
                if (
                  subItem.type == pathNodes[1].data.value &&
                  subItem.name == pathNodes[2].data.name
                ) {
                  varItem.variables.splice(subIndex, 1);
                }
              });
            } else if (varItem.name == "数值") {
              varItem.variables.forEach((subItem, subIndex) => {
                if (subItem.name == pathNodes[1].data.name) {
                  varItem.variables.splice(subIndex, 1);
                }
              });
            }
          }
        });
      }
    },
    convertVar(varTagList) {
      this.options = [];
      varTagList.forEach((varItem) => {
        let tempItem = {
          value: varItem.name,
          defaultVal: varItem.value,
          label: varItem.name,
          name: varItem.name,
          type: varItem.type,
          ctype: varItem.ctype,
        };
        if (varItem.id) {
          tempItem.id = varItem.id;
        }
        if(varItem.name=='系统变量'&&varItem.ctype=='system'){
          let rowChildren = [
            // {
            //   value: "currentUser",
            //   defaultVal: "currentUser",
            //   label: "当前用户",
            //   name: "当前用户",
            //   children: [],
            // },
            {
              value: "page",
              defaultVal: "page",
              label: "前端页面",
              name: "前端页面",
              children: [],
            }]
            rowChildren.forEach((rowChild) => {
              varItem.variables &&
                varItem.variables.forEach((child) => {

                  if (rowChild.value == child.row) {
                    let tempChild = {
                      value: child.name,
                      defaultVal: child.value,
                      label: child.name,
                      name: child.name,
                      type: child.type,
                    };
                    rowChild.children.unshift(tempChild);
                  }
                });
              });
               tempItem.children = rowChildren;
        }else if (varItem.ctype === "connectorV4") {
          let rowChildren = [
            {
              value: "current",
              defaultVal: "current",
              label: "当前行",
              name: "当前行",
              children: [{ type: "input" }],
            },
            {
              value: "first",
              defaultVal: "first",
              label: "第一行",
              name: "第一行",
              children: [{ type: "input" }],
            },
            {
              value: "last",
              defaultVal: "last",
              label: "最后一行",
              name: "最后一行",
              children: [{ type: "input" }],
            },
            { type: "input" },
          ];
          let connectorSecond = [];
          rowChildren.forEach((rowChild) => {
            varItem.variables &&
              varItem.variables.forEach((child) => {
                if (!child.value) {
                  //没有value 代表着 就是connectorV4的第二层
                  if (connectorSecond.indexOf(child.row) === -1) {
                    connectorSecond.push(child.row);
                  }
                }
                if (rowChild.value == child.row) {
                  let tempChild = {
                    value: child.name,
                    defaultVal: child.value,
                    label: child.name,
                    name: child.name,
                    type: child.type,
                  };
                  rowChild.children.unshift(tempChild);
                }
              });
          });
          //TODO
          connectorSecond.forEach((csitem) => {
            let tempChild = {
              value: csitem,
              defaultVal: csitem,
              label: csitem,
              name: "",
              type: 5,
            };
            rowChildren.splice(rowChildren.length - 1, 0, tempChild);
          });

          tempItem.children = rowChildren;
        } else if (varItem.name == "变量" && varItem.type === 4) {
          // 临时处理方法 ，按照第一层名字匹配
          let rowChildren = this.tempVarChildren;
          rowChildren.forEach((rowChild) => {
            rowChild.children = [];
            varItem.variables &&
              varItem.variables.forEach((child) => {
                if (rowChild.value == child.type) {
                  let tempChild = {
                    value: child.name,
                    defaultVal: child.name,
                    label: child.name,
                    name: child.name,
                    type: rowChild.value,
                  };
                  rowChild.children.push(tempChild);
                }
              });
            rowChild.children.push({ type: "input" });
          });
          tempItem.children = rowChildren;
        } else {
          let tempChildren = [];
          varItem.variables &&
            varItem.variables.forEach((child) => {
              let tempChild = {
                value: child.name,
                label: child.name,
                name: child.name,
                type: child.type,
              };
              tempChildren.push(tempChild);
            });
          tempChildren.push({
            type: "input",
          });
          if (tempChildren) {
            tempItem.children = tempChildren;
          }
        }
        this.options.push(tempItem);
      });
    },
    show(dataItem) {
      if (dataItem.row && dataItem.name) {
        // 这边特殊处理是 ，如果 id 存在说明是 数据源，流程等 变量，则需要从最新的vartag 里面把最新的name取出来
        this.value = [dataItem.category, dataItem.row, dataItem.name];
      } else if (dataItem.category == "变量") {
        // 暂时不处理 如果不选择第三层的临时变量
        this.value = [dataItem.category, dataItem.type, dataItem.name];
      } else if (dataItem.row) {
        this.value = [dataItem.category, dataItem.row];
      } else if (dataItem.name) {
        this.value = [dataItem.category, dataItem.name];
      } else {
        this.value = [dataItem.category];
      }
      // // 这一步特殊处理是用来回显静态常量
      // this.chosenVar = dataItem.value;
      // this.variableList.forEach((variable) => {
      //   if(dataItem.type!=4 && variable.parentName==dataItem.category&&variable.name==dataItem.name){
      //     this.chosenVar = dataItem.category + "/" + variable.name;
      //   }else if (dataItem.type==variable.type && dataItem.category == variable.name) {
      //     this.chosenVar = variable.name;
      //   }
      // });
    },
    handleChange(value) {
      let param = {};
      let parentName = "";
      let itemName = "";
      let row = "";
      // 这里特指数据
      console.log("handleChange value",value)
      if (value.length > 2) {
        parentName = value[0];
        row = value[1];
        itemName = value[2];
      } else {
        parentName = value.length > 1 ? value[0] : "undefined";
        itemName = value.length > 1 ? value[1] : value[0];
      }
      // let itemType = itemList[2];
      this.variableList.forEach((variable) => {
        if (
          parentName != "undefined" &&
          itemName == variable.name &&
          parentName == variable.parentName &&
          variable.ctype != "connectorV4"
        ) {
          // 变量
          param.id = variable.id;
          param.category = variable.parentName;
          param.name = variable.name;
          param.type = variable.type;
          param.value = variable.value;
          if (variable.value_type) {
            param.value_type = variable.value_type;
          }
          param.row = variable.row;
        } else if (
          parentName != "undefined" &&
          parentName == variable.name &&
          variable.ctype == "connectorV4"
        ) {
          // row
          param.id = variable.id;
          param.category = variable.name;
          param.type = 5;
          param.row = row;
          param.name = itemName;
          param.value = itemName;
        } else if (parentName === "undefined" && itemName == variable.name) {
          //tag
          param.id = variable.id;
          param.category = variable.name;
          param.name = "";
          param.type = variable.type;
          param.value = variable.value;
          if (variable.value_type) {
            param.value_type = variable.value_type;
          }
        }
      });
      console.log("serVar", param, this.type);
      this.$emit("setVar", param, this.type);
    },
    showVarModel() {
      this.showVarEditModel = true;
    },
    cancalVarEdit() {
      this.showVarEditModel = false;
      // this.variableList = this.$store.getters.variableList;
      this.$emit("cancalVarEdit", false);
    },
    saveVarEdit(tempVarList) {
      this.$emit("submitVarList", tempVarList);
      // 延时接受vuex
      setTimeout(() => {
        this.init();
      }, 2000);
    },
    inputChange(node, data) {},
    confirmVar(param) {
      this.varTagList.forEach((varTag) => {
        if (varTag.name == param.parentName) {
          if (varTag.variables) {
            varTag.variables.push(param);
          } else {
            varTag.variables = [param];
          }
        }
      });
      this.handlerVarMap(this.varTagList);
      // this.variableList = this.$store.getters.variableList;
      this.convertVar(this.varTagList);
      this.expandChange();
    },
  },
};
</script>

<style scoped lang="scss">
.var-select-div {
  display: flex;

  /deep/ .el-cascader .el-input--suffix {
    //width: 110px;
    width: 220px;
  }
}
.var-select-button {
  width: 60px;
  padding: 5px 5px 6px;
}
.tag-class {
  padding: 0;
  font-size: 14px !important;
  color: #999;
  height: 30px;
  line-height: 30px;
  margin-left: -15px;
}
.var-option {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  /* background: data.color; */
  border-radius: 5px;
  font-weight: bold;
}
.select-add-btn {
  padding-top: 5px;
  color: #409eff;
  cursor: pointer;
  line-height: 30px;
  display: flex;
}
/deep/ .ivu-select-dropdown {
  width: 80%;
}
/deep/ .ivu-dropdown-menu {
  max-height: 200px;
  overflow-y: auto;
}
/deep/ .ivu-input {
  cursor: pointer;
}
.select-delete {
  visibility: hidden;
  position: absolute;
  right: 20px;
}
.select-more {
  position: absolute;
  right: 25px;
}
.node-div {
  max-width: 200px;
  line-height: 30px;
  height: 30px;
  &:hover {
    .select-delete {
      visibility: initial;
    }
  }
  .node-div-span {
    width: 100%;
    word-break: keep-all; /* 不换行 */
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow: ellipsis;
  }
}
</style>
