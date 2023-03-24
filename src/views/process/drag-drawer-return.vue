<template>
  <div class="group-wrap">
    <div class="group-content">
      <p
        class="group-text"
      >输出组件用于统一封装数据作为流程处理的结果。结果数据将以Json的形式返回，每个返回对象作为Json的一个节点，变量名作为Json的key，变量值作为Json的value。可以添加多个返回对象</p>
      <el-form label-width="100px" label-position="left">
        <el-form-item label="名称">
          <el-input size="small" v-model="showName" />
        </el-form-item>
        <h3 class="route-title2">返回对象</h3>
        <el-row>
          <el-collapse v-model="cVal">
            <el-collapse-item
              :title="attributeItem.category+ '/'+ attributeItem.name"
              :name="''+attributeIndex"
              v-for="(attributeItem, attributeIndex) in attributeList"
            >
              <div>
                <el-form label-width="50px" class="routeBy-form" label-position="left">
                  <el-form-item label="参数" v-if="attributeItem">
                    <VarSelect
                      :key="'return-param-'+attributeIndex"
                      :data="attributeItem"
                      :type="'return-'+attributeIndex"
                      @setVar="setVar"
                    />
                  </el-form-item>
                </el-form>
                <div class="opt-btn">
                  <div @click="propertyDelete(attributeIndex)">X删除</div>
                  <div @click="upAtr(attributeIndex)">上移</div>
                  <div @click="downAtr(attributeIndex)">下移</div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div @click="setAttributes" class="opt-add-btn">添加步骤</div>
        </el-row>
        <h3>备注</h3>
        <el-input v-model="remark" type="textarea" :autosize="{minRows: 5,maxRows: 15}" placeholder="Enter something..." />
      
        <!-- <Row >
            <Icon class="iconfont iconjiahao mr5" :size="22" @click="setAttributes" />
        <Icon class="iconfont iconchahao mr5" :size="22" @click="propertyDelete"/>
        <Icon class="iconfont iconxiangshang mr5" :size="22" @click="upAtr" />
        <Icon class="iconfont iconxiangxia mr5" :size="22" @click="downAtr" />
          </Row>
          <Row :gutter="30">
            <i-col span="10">
              <div class="spp-box-list">
                <ul>
                  <li
                    v-for="(item,index) in attributeList"
                    @click="checkedRow(index)"
                    :class="{atrChecked: index == rowNum, atrItem: index != rowNum}"
                  >
                    <span>{{ item.category +"/"+item.name }}</span>
                  </li>
                </ul>
              </div>
            </i-col>
            <i-col span="14">
              <el-form :label-width="40" class="routeBy-form" label-position="left">
                <el-form-item label="参数" v-if="attributeList[rowNum]">
                  <div class="form-input">
                    <el-select v-model="attributeList[rowNum].category" class="var-select">
                      <el-option
                        :value="variable.name"
                        v-for="variable in variableList"
                      >{{variable.name}}</el-option>
                    </el-select>
                    <el-select
                      v-model="attributeList[rowNum].name"
                      class="var-select"
                      clearable
                      @on-change="dateValueSelect(attributeList[rowNum])"
                      v-if="varMap&&attributeList[rowNum].category"
                    >
                      <el-option
                        :value="variable.name"
                        v-for="variable in varMap.get(attributeList[rowNum].category)"
                      >{{variable.name}}</el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-form>
            </i-col>
        </Row>-->
      </el-form>
    </div>
    <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem">删除</el-button>
        <el-button class="btn btns-save" type="primary" @click="saveConfig">保存</el-button>
      </el-row>
    </div>
    <!-- <el-dialog v-model="modal" title="变量" @on-ok="ok">
      <el-form :label-width="80">
        <el-form-item label="变量类型">
          <el-select v-model="modalObj.category" class="var-select">
            <el-option :value="variable.name" v-for="variable in variableList">{{variable.name}}</el-option>
          </el-select>
          <el-select v-model="modalObj.name" class="var-select" v-if="modalObj.category">
            <el-option
              :value="variable.name"
              v-for="variable in varMap.get(modalObj.category)"
            >{{variable.name}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>-->
  </div>
</template>

<script>
import VarSelect from "./module/variable-select";
// import { getVariableList } from "@/api/variable";
import { mapActions } from "vuex";
export default {
  name: "drag-drawer-return",
  components: {
    VarSelect,
  },
  props: ["curDiagram", "processId"],
  data() {
    return {
      showName: "",
      remark:"",
      target: {}, // PropertyName类型 SystemProperty系统变量, CurrentData当前值
      nameMap: { SystemProperty: "系统变量", CurrentData: "当前值" },
      targetStr: "",
      modal: false,
      modalObj: { category: "", name: "" },
      attributeList: [],
      rowNum: 0,
      opType: 1, // 1新增属性  2编辑属性
      variableList: [],
      varMap: null,
      cVal: "",
    };
  },
  mounted() {
    var properties = JSON.parse(JSON.stringify(this.curDiagram.getProperties()));
    this.showName = this.curDiagram.title;
    this.remark = properties.remark;
    if (properties.results) {
      this.attributeList = properties.results;
      //          this.targetStr =  this.nameMap[this.target.type] + this.target.name
    }
    this.variableList = this.$store.getters.varTagList;
    this.varMap = this.$store.getters.varMap;
    // getVariableList(this.processId, 1, 999).then(res => {
    //   if (res.data.code == 0) {
    //     this.variableList = res.data.data;
    //     this.varMap = new Map();
    //     this.variableList.forEach(item => {
    //       this.varMap.set(item.name, JSON.parse(item.variables));
    //     });
    //   }
    // });
  },
  methods: {
    ...mapActions(["getVariableList"]),
    setVar(param, type) {
      let tList = type.split("-");
      this.attributeList[tList[1]] = {};
      if (tList[0] == "return") {
        this.attributeList[tList[1]] = param;
        this.$set(this.attributeList, tList[1], param);
      }
      console.log(this.attributeList, "setVar");
    },
    saveConfig() {
      var self = this;
      let configJson = {
        title: this.showName,
        results: this.attributeList,
        remark:this.remark,
      };
      // this.$emit("updatestart", self.attributeList);
      this.$emit("arguments", configJson);
    },
    checkedRow(index) {
      this.rowNum = index;
    },
    setTarget() {
      this.modal = true;
      this.modalObj = this.target;
    },
    ok() {
      // this.target = { ...this.modalObj };
      // //            this.targetStr = this.nameMap[this.target.type] + this.target.name
      if (this.opType == 1) {
        this.attributeList.push(this.modalObj);
      } else {
        this.attributeList[this.rowNum] = this.modalObj;
      }
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
    setAttributes() {
      // this.attributeList[this.rowNum] = this.modalObj;
      // this.modal = true;
      // this.opType = 1;
      // this.resetForm();
      var newscript = {
        category: "",
        name: "",
        type: 0,
        value: "",
      };
      this.attributeList.push(newscript);
      this.rowNum = this.attributeList.length - 1;
    },
    resetForm() {
      this.modalObj = { category: "", name: "" };
    },
    editAtr() {
      this.modal = true;
      this.opType = 2;
      var cur = this.attributeList[this.rowNum];
      this.modalObj.type = cur.type;
      this.modalObj.name = cur.name;
    },
    propertyDelete(attributeIndex) {
      this.attributeList.splice(attributeIndex, 1);
    },
    upAtr(attributeIndex) {
      var list = this.attributeList;
      var idx = attributeIndex;
      if (idx > 0) {
        var item = list.splice(idx, 1);
        list.splice(idx - 1, 0, item[0]);
        this.attributeList = list;
        this.rowNum = idx - 1;
      }
    },
    downAtr(attributeIndex) {
      var list = this.attributeList;
      var idx = attributeIndex;
      if (idx > -1) {
        if (idx < list.length - 1) {
          var item = list.splice(idx, 1);
          list.splice(idx + 1, 0, item[0]);
          this.attributeList = list;
          this.rowNum = idx + 1;
        }
      }
    },
    dateValueSelect(item) {
      this.varMap.get(item.category).forEach((v) => {
        if (v.name == item.name) {
          this.attributeList[this.rowNum].type = v.type;
          this.attributeList[this.rowNum].value = v.value;
          this.attributeList[this.rowNum].value_type = v.value_type;
        }
      });
    },
  },
};
</script>

<style scoped>
ul li {
  list-style-type: none;
}
.mt10 {
  margin-top: 10px;
}
.group-wrap {
  position: relative;
  height: 100%;
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
.group-btns .btn {
  margin-right: 15px;
}
.group-content {
  height: calc(100% - 30px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
}
.spp-box-list {
  border: 1px solid #d6d6d6;
  padding: 2px 0;
  border-radius: 2px;
  margin-top: 10px;
  min-height: 200px;
}
.spp-box-list li.atrItem:hover {
  background-color: #f6f6f6;
}
.spp-box-list li {
  cursor: pointer;
  line-height: 24px;
  padding: 0 5px;
}
.atrChecked {
  background-color: #5a6268;
  color: white;
}
</style>
