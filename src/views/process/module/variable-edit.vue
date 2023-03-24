<template>
  <div class="variable-edit-div">
    <el-dialog
      :visible.sync="dialogVisible"
      title="变量"
      width="700"
      :closable="false"
      :mask-closable="false"
      @close="close"
    >
      <p slot="header" style="display: flex; justify-content: space-between">
        变量
        <Icon type="ios-close icon-cancal" @click="cancel" />
      </p>
      <el-row :gutter="30">
        <el-col :span="10">
          <span
            @click="appendTag"
            class="opt-add-btn"
            style="float: right; line-height: 16px; display: flex"
          >
            <i class="iconfont iconjiahao1"></i>字典
          </span>
          <el-tree
            :data="variableTree"
            :render-content="renderContent"
            :default-expand-all="true"
            class="demo-tree-render"
          ></el-tree>
        </el-col>
        <el-col :span="14">
          <!-- <Form :label-width="100" class="routeBy-form" label-position="left" v-if="varTagFlag">
            <FormItem label="名称">
              <Input v-model="variateInfo.name" />
            </FormItem>
            <FormItem label="标注">
              <Tag
                checkable
                @on-change="tagCheck"
                :name="tag.color"
                :color="tag.color"
                :checked="!tag.checked"
                v-for="tag in tagList"
              >{{tag.name}}</Tag>
            </FormItem>
          </Form>-->
          <el-form label-width="100px" class="routeBy-form" label-position="left">
            <el-form-item label="名称">
              <el-input v-model="variateInfo.name" />
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="variateInfo.type">
                <el-radio :label="0">文本</el-radio>
                <el-radio :label="1">数值</el-radio>
                <el-radio :label="2">日期</el-radio>
                <el-radio :label="3">列表</el-radio>
                <el-radio :label="4" v-if="variateInfo.tag">变量合集</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="默认值">
              <el-row v-if="variateInfo.type == '2'">
                <el-col :span="12">
                  <el-date-picker
                    type="date"
                    format="yyyy-MM-dd"
                    v-model="variateInfo.date"
                    placeholder="Select date"
                    style="width: 120px"
                    @change="setOptionDate"
                  ></el-date-picker>
                  <el-checkbox
                    v-model="variateInfo.currentDate"
                    @change="setCheckBoxDate('currentDate')"
                    >当前日期</el-checkbox
                  >
                </el-col>
                <el-col :span="12">
                  <el-time-picker
                    type="time"
                    format="HH:mm:ss"
                    v-model="variateInfo.time"
                    placeholder="Select time"
                    style="width: 120px"
                    @change="setOptionTime"
                  ></el-time-picker>
                  <el-checkbox
                    v-model="variateInfo.currentTime"
                    @change="setCheckBoxDate('currentTime')"
                    >当前时间</el-checkbox
                  >
                </el-col>
              </el-row>
              <el-row v-else>
                <el-input v-model="variateInfo.value" />
              </el-row>
            </el-form-item>
            <el-form-item label="标注">
              <el-tag
                checkable
                @on-change="tagCheck"
                :name="tag.color"
                :color="tag.color"
                :checked="tag.checked"
                v-for="tag in tagList"
                >{{ tag.name }}</el-tag
              >
            </el-form-item>
          </el-form>
          <div class="btn-group">
            <el-button type="error" size="large" @click="removeVariate"
              >删除</el-button
            >
            <!-- <el-button type="info" size="large" @click="saveVariate">保存</el-button> -->
          </div>
        </el-col>
      </el-row>
      <div slot="footer">
        <span>
          <i
            class="iconfont iconxinxi"
            style="font-size: 18px; margin-right: 5px"
          ></i
          >输入参数用于接收从外部输入的同名参数，如页面参数
        </span>
        <!-- <el-button type="info" size="large" @click="saveVariate">保存</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  name: "varEdit",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      tagList: [
        {
          name: "蓝色",
          color: "#328DF5",
          checked: false,
        },
        {
          name: "绿色",
          color: "#39C16C",
          checked: false,
        },
        {
          name: "红色",
          color: "#EF411A",
          checked: false,
        },
        {
          name: "橙色",
          color: "#F89A00",
          checked: false,
        },
        {
          name: "紫色",
          color: "#B375D6",
          checked: false,
        },
        {
          name: "灰色",
          color: "#9E9EA2",
          checked: false,
        },
      ],
      variableTree: [
        {
          title: "parent 1",
          expand: true,
          tag: true,
          children: [
            {
              title: "child 1-1",
              expand: true,
            },
            {
              title: "child 1-2",
              expand: true,
            },
          ],
        },
      ],
      buttonProps: {
        type: "default",
        size: "small",
      },
      variableList: [],
      variateInfo: {},
      varTagFlag: false,
      chosenRoot: {},
      chosenNode: {},
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  watch: {
    show(newData, oldVal) {
      console.log("show",newData);
      // 从父组件获取到回显参数
      if (newData) {
        this.dialogVisible = true;
        this.init();
      }
    },
  },
  // computed: {
  //    dialogVisible: {
  //     get() {
  //       return this.value;
  //     },
  //     set(val) {
  //        this.$emit('cancel')
  //     },
  //   },
  // },
  methods: {
    init() {
      this.variableList = this.$store.getters.varTagList;
      let varTree = [];
      this.variableList.forEach((tag) => {
        let tree = {
          name: tag.name,
          label: tag.name,
          color: tag.color,
          expand: true,
          tag: true,
          value: tag.value,
          type: tag.type,
        };
        let children = [];
        if (tag.variables) {
          if (tag.variables.length > 0) {
            tree.type = 4;
          }
          tag.variables.forEach((variable) => {
            let child = {
              name: variable.name,
              label: variable.name,
              type: variable.type,
              value: variable.value,
              color: variable.color,
              date: variable.data,
              value_type: variable.value_type,
              time: variable.time,
              parentName: tag.name,
              expand: false,
            };
            children.push(child);
          });
        }

        tree.children = children;
        varTree.push(tree);
      });
      this.variableTree = varTree;
    },
    renderContent(h, { root, node, data }) {
      let nodeList = [];
      let markDiv;
      if (data.type == 0) {
        markDiv = "T";
      } else if (data.type == 1) {
        markDiv = "#";
      } else if (data.type == 2) {
        markDiv = "D";
      } else if (data.type == 3) {
        markDiv = "L";
      }
      let mSpan = h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "20px",
            height: "20px",
            color: data.color,
            lineHeight: "20px",
            textAlign: "center",
            fontWeight: "bold",
          },
        },
        markDiv
      );
      // TODO 一级变量
      let mark = h("span", [!data.tag ? mSpan : null, h("span", data.name)]);
      let btnList = [];

      let addBtn = h("i", {
        class: "iconfont iconjiahao1",
        style: {
          // marginRight: "8px",
        },
        on: {
          click: (e) => {
            this.append(data);
            e.stopPropagation();
          },
        },
      });
      // let removeBtn = h("Button", {
      //   props: Object.assign({}, this.buttonProps, {
      //     icon: "ios-remove",
      //   }),
      //   on: {
      //     click: (e) => {
      //       this.remove(root, node, data);
      //       e.stopPropagation();
      //     },
      //   },
      // });
      // let removeTagBtn = h("Button", {
      //   props: Object.assign({}, this.buttonProps, {
      //     icon: "ios-remove",
      //   }),
      //   on: {
      //     click: (e) => {
      //       this.removeTag(data);
      //       e.stopPropagation();
      //     },
      //   },
      // });
      // if (data.tag) {
      //   btnList.push(removeTagBtn);
      // } else {
      //   btnList.push(removeBtn);
      // }

      nodeList.push(mark);
      if (data.tag && data.type == 4) {
        btnList.push(addBtn);
      }
      let btns = h(
        "span",
        {
          style: {
            display: "inline-block",
            float: "right",
            marginRight: "32px",
          },
        },
        btnList
      );
      nodeList.push(btns);
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            cursor: "pointer",
            width: "100%",
          },
          on: {
            click: () => {
              this.chooseVar(root, node, data);
            },
          },
        },
        nodeList
      );
    },
    chooseVar(root, node, data) {
      this.chosenRoot = root;
      this.chosenNode = node;
      this.variateInfo = {};
      if (this.variableTree) {
        for (var i = 0; i < this.variableTree.length; i++) {
          var tree = this.variableTree[i];
          if (tree.name == data.name && !data.parentName) {
            //选择tag
            this.variateInfo = tree;
            this.varTagFlag = true;
          } else {
            if (tree.children) {
              for (var j = 0; j < tree.children.length; j++) {
                var child = tree.children[j];
                if (
                  child.parentName == data.parentName &&
                  child.name == data.name
                ) {
                  this.variateInfo = child;
                  this.varTagFlag = false;

                  // 特殊处理日期
                  if (this.variateInfo.type == 2) {
                    if (this.variateInfo.value_type == "CurrentDate") {
                      this.variateInfo.currentDate = true;
                    } else if (this.variateInfo.value_type == "CurrentTime") {
                      this.variateInfo.currentTime = true;
                    } else if (
                      this.variateInfo.value_type == "CurrentDateTime"
                    ) {
                      this.variateInfo.currentDate = true;
                      this.variateInfo.currentTime = true;
                    }
                    if (this.variateInfo.value) {
                      if (this.variateInfo.value.indexOf(" ") > 0) {
                        let dateTime = this.variateInfo.value.split(" ");
                        this.variateInfo.date = dateTime[0];
                        this.variateInfo.time = dateTime[1];
                      } else if (this.variateInfo.value.indexOf("-") > 0) {
                        this.variateInfo.date = this.variateInfo.value;
                      } else if (this.variateInfo.value.indexOf(":") > 0) {
                        this.variateInfo.time = this.variateInfo.value;
                      }
                    }
                  }
                }
              }
            }
          }
          this.tagCheck(true, this.variateInfo.color);
        }
      }
    },
    chooseVarByData(data) {
      this.variateInfo = {};
      for (var i = 0; i < this.variableTree.length; i++) {
        var tree = this.variableTree[i];
        if (tree.name == data.name) {
          //选择tag
          this.variateInfo = tree;
          this.varTagFlag = true;
        } else {
          for (var j = 0; j < tree.children.length; j++) {
            var child = tree.children[j];
            if (
              child.parentName == data.parentName &&
              child.name == data.name
            ) {
              this.variateInfo = child;
              this.varTagFlag = false;
              // 特殊处理日期
              if (this.variateInfo.type == 2) {
                if (this.variateInfo.value_type == "CurrentDate") {
                  this.variateInfo.currentDate = true;
                } else if (this.variateInfo.value_type == "CurrentTime") {
                  this.variateInfo.currentTime = true;
                } else if (this.variateInfo.value_type == "CurrentDateTime") {
                  this.variateInfo.currentDate = true;
                  this.variateInfo.currentTime = true;
                }
                if (this.variateInfo.value) {
                  if (this.variateInfo.value.indexOf(" ") > 0) {
                    let dateTime = this.variateInfo.value.split(" ");
                    this.variateInfo.date = dateTime[0];
                    this.variateInfo.time = dateTime[1];
                  } else if (this.variateInfo.value.indexOf("-") > 0) {
                    this.variateInfo.date = this.variateInfo.value;
                  } else if (this.variateInfo.value.indexOf(":") > 0) {
                    this.variateInfo.time = this.variateInfo.value;
                  }
                }
              }
            }
          }
        }
        this.tagCheck(true, this.variateInfo.color);
      }
    },
    appendTag() {
      let tag = {
        name: "新增变量",
        expand: true,
        tag: true,
      };
      this.variableTree.push(tag);
      // this.$set(data, "tag", this.variableTree);
      // 添加后默认选中
      this.chooseVarByData(tag);
    },
    append(data) {
      const children = data.children || [];
      let child = {
        name: "新增参数",
        expand: false,
      };
      children.push(child);
      this.$set(data, "children", children);
      this.chooseVarByData(child);
    },
    removeTag(data) {
      const index = this.variableTree.indexOf(data);
      this.variableTree.splice(index, 1);
    },
    remove(root, node, data) {
      const parentKey = root.find((el) => el === node).parent;
      const parent = root.find((el) => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    setOptionDate(value, type) {
      this.variateInfo.date = value;
      this.variateInfo.currentDate = false;
      // this.dealDate();
    },
    setOptionTime(value, type) {
      this.variateInfo.time = value;
      this.variateInfo.currentTime = false;
      // this.dealDate();
    },
    dealDate() {
      if (this.variateInfo.date && this.variateInfo.time) {
        this.variateInfo.value =
          this.variateInfo.date + " " + this.variateInfo.time;
      } else if (this.variateInfo.date) {
        this.variateInfo.value = this.variateInfo.date;
      } else if (varInfo.time) {
        this.variateInfo.value = varInfo.time;
      }
    },
    setCheckBoxDate(type) {
      if (type == "currentDate" && this.variateInfo.currentDate) {
        this.variateInfo.date = "";
      } else if (type == "currentDate" && !this.variateInfo.currentDate) {
        this.variateInfo.value_type = "";
      } else if (type == "currentTime" && !this.variateInfo.currentTime) {
        this.variateInfo.value_type = "";
      } else if (type == "currentTime" && this.variateInfo.currentTime) {
        this.variateInfo.time = "";
      }
    },
    saveVariate() {
      // tree 转 variablelist
      let tempVarList = [];
      this.variableTree.forEach((tree) => {
        let tag = {
          name: tree.name,
          color: tree.color,
        };
        let variables = [];
        if (tree.children) {
          tree.children.forEach((child) => {
            let variable = {
              name: child.name,
              type: child.type,
              value: child.value,
              color: child.color,
            };
            let varInfo = child;
            if (varInfo.type == 2) {
              variable.value = null;
              if (varInfo.currentDate && varInfo.currentTime) {
                variable.value_type = "CurrentDateTime";
              } else if (varInfo.currentDate) {
                variable.value_type = "CurrentDate";
              } else if (varInfo.currentTime) {
                variable.value_type = "CurrentTime";
              }
              if (varInfo.date && varInfo.time) {
                variable.value = varInfo.date + " " + varInfo.time;
              } else if (varInfo.date) {
                variable.value = varInfo.date;
              } else if (varInfo.time) {
                variable.value = varInfo.time;
              }
            }
            variables.push(variable);
          });
          tag.variables = variables;
        }
        tempVarList.push(tag);
      });
      this.$emit("submitVarList", tempVarList);

      this.cancel();
    },
    removeVariate() {
      // 这里面区分是 tag 还是var
      if (this.variateInfo.tag) {
        this.removeTag(this.variateInfo);
      } else {
        //  this.removeTag(data);
        this.remove(this.chosenRoot, this.chosenNode, this.variateInfo);
        this.chosenRoot = {};
        this.chosenNode = {};
      }
      this.variateInfo = {};
    },
    tagCheck(checked, color) {
      this.tagList.forEach((item) => {
        if (item.color == color) {
          item.checked = true;
          this.variateInfo.color = item.color;
        } else {
          item.checked = false;
        }
      });
      // TODO
    },
    cancel() {
      console.log("cancal")
      // 在更新vuex之前，需要进行名字重复校验，如果名字重复，则进行提示 以及return
      // 规则1、变量集合名字不能相同
      let varMap = new Map();
      let collectionExist = false;
      for (let i = 0; i < this.variableTree.length; i++) {
        let tree = this.variableTree[i];
        if (tree.type == 4) {
          if (typeof varMap.get(tree.name) == "undefined") {
            varMap.set(tree.name, tree);
          } else {
            collectionExist = true;
            break;
          }
        }
      }
      if (collectionExist) {
        this.dialogVisible = true;
        this.$Message.error("变量集合名称不能重复", 5);
      } else {
        // 规则2、变量集合内部，名字不能相同
        if (this.dealRepetition()) {
          this.$Message.error("变量名称不能重复", 5);
        } else {
          // 更新vuex
          this.updateVuexVarTag();
          this.dialogVisible = false;
          this.$emit("cancalVarEdit", false);
        }
      }
    },
    dealRepetition() {
      let varMap = new Map();
      let varExist = false;
      for (let i = 0; i < this.variableTree.length; i++) {
        let tree = this.variableTree[i];

        if (tree.type == 4) {
          let variables = tree.children;
          if (variables) {
            for (var j = 0; j < variables.length; j++) {
              let varItem = variables[j];
              if (
                typeof varMap.get(tree.name + "-" + varItem.name) == "undefined"
              ) {
                varMap.set(tree.name + "-" + varItem.name, varItem);
              } else {
                varExist = true;
                break;
              }
            }
          }
        } else if (tree.type != 4) {
          if (typeof varMap.get("-" + tree.name) == "undefined") {
            varMap.set("-" + tree.name, tree);
          } else {
            varExist = true;
            break;
          }
        }
      }
      return varExist;
    },
    updateVuexVarTag() {
      let tempVarList = [];
      let _this = this;
      this.variableTree.forEach((tree) => {
        let tag = {
          name: tree.name,
          color: tree.color,
          type: tree.type,
          value: tree.value,
          value_type: tree.value_type,
        };
        let variables = [];
        if (tree.children) {
          if (tree.children.length > 0) {
            tag.type = 4;
          }
          tree.children.forEach((child) => {
            let variable = {
              name: child.name,
              type: child.type,
              value: child.value,
              color: child.color,
              value_type: child.value_type,
            };
            let varInfo = child;
            if (varInfo.type == 2) {
              variable.value = null;
              if (varInfo.currentDate && varInfo.currentTime) {
                variable.value_type = "CurrentDateTime";
              } else if (varInfo.currentDate) {
                variable.value_type = "CurrentDate";
              } else if (varInfo.currentTime) {
                variable.value_type = "CurrentTime";
              }
              // 这里会有一个问题，如果绑定的变量date 和time 为日期类型，这边转成字符串
              if (varInfo.date && varInfo.time) {
                variable.value =
                  _this.formatDate(varInfo.date, "yyyy-MM-dd") +
                  " " +
                  _this.formatDate(varInfo.time, "hh:mm:ss");
              } else if (varInfo.date) {
                variable.value = _this.formatDate(varInfo.date, "yyyy-MM-dd");
              } else if (varInfo.time) {
                variable.value = _this.formatDate(varInfo.time, "hh:mm:ss");
              }
            }
            variables.push(variable);
          });
          tag.variables = variables;
        }
        tempVarList.push(tag);
      });
      this.setVarTagList(tempVarList);
      this.setVariableList(tempVarList);
    },
    formatDate(date, fmt) {
      if (date instanceof Date) {
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        }
        let o = {
          "M+": date.getMonth() + 1,
          "d+": date.getDate(),
          "h+": date.getHours(),
          "m+": date.getMinutes(),
          "s+": date.getSeconds(),
        };
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + "";
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length === 1 ? str : this.padLeftZero(str)
            );
          }
        }
        return fmt;
      } else {
        return date;
      }
    },
    padLeftZero(str) {
      return ("00" + str).substr(str.length);
    },
    close(){
      this.cancel();
      //  this.$emit("cancalVarEdit", false);
    },
  },
};
</script>

<style scoped lang="less">
.variable-edit-div {
  font-size: 16px;
}
.demo-tree-render {
  margin-top: 40px;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.btn-group {
  display: flex;
  justify-content: center;
}
/deep/.ivu-modal-footer {
  text-align: left;
  font-size: 14px;
  line-height: 14px;
  color: #666666;
}
.icon-cancal {
  font-size: 25px;
  cursor: pointer;
}
.icon-cancal:hover {
  font-weight: bold;
}
</style>
