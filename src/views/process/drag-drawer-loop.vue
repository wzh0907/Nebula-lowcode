<template>
  <div class="group-wrap">
    <div class="group-content">
      <p class="group-text">
        遍历组件用于逐条处理一组数据，负责把一组数据拆成一条一条数据并传递给后续的加工步骤。每条数据都将经过遍历组件后的所有处理节点，直到遇到结束组件，表示一条数据处理完毕，进行下一条数据的处理过程，直至完成所有条数据的加工处理。
      </p>
      <el-form label-width="100px" label-position="left">
        <el-form-item label="节点名称">
          <el-input size="small"  v-model="showName" />
        </el-form-item>
        <el-form-item label="循环列表">
          <!-- <div class="form-input">
            <Select v-model="source.category" class="var-select">
              <Option :value="variable.name" v-for="variable in variableList">{{variable.name}}</Option>
            </Select>
            <Select v-model="source.name" clearable class="var-select" v-if="source.category&&varMap">
              <Option
                :value="variable.name"                
                v-for="variable in varMap.get(source.category)"
              >{{variable.name}}</Option>
            </Select>
          </div>-->
          <VarSelect
            key="loop-source"
            :data="source"
            type="source"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </el-form-item>
        <el-form-item label="循环赋值">
          <!-- <div class="form-input">
            <Select v-model="target.category" class="var-select">
              <Option :value="variable.name" v-for="variable in variableList">{{variable.name}}</Option>
            </Select>
            <Select v-model="target.name" clearable class="var-select" v-if="target.category&&varMap">
              <Option
                :value="variable.name"                
                v-for="variable in varMap.get(target.category)"
              >{{variable.name}}</Option>
            </Select>
          </div>-->
          <VarSelect
            key="loop-target"
            :data="target"
            type="target"
            @setVar="setVar"
            @submitVarList="saveVarEdit"
          />
        </el-form-item>
        <el-form-item label="是否并行">
          <el-switch v-model="isParallel">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </el-switch>
        </el-form-item>
        <!-- <FormItem label="返回对象">
          <i-input
            :value.sync="targetStr"
            readonly
            placeholder="选择..."
            @on-focus="setTarget"
            icon="ios-search-outline"
          ></i-input>
        </FormItem>-->
      </el-form>
      <h3>备注</h3>
      <el-input
        v-model="remark"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 15 }"
        placeholder="Enter something..."
      />
    </div>

    <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem"
          >删除</el-button
        >
        <el-button class="btn btns-save" type="primary" @click="saveConfig"
          >保存</el-button
        >
      </el-row>
    </div>
    <el-dialog v-model="modal" title="变量" @on-ok="ok">
      <el-form label-width="80px">
        <el-form-item label="变量类型">
          <el-select v-model="modalObj.type">
            <el-option value="CurrentData">当前值</el-option>
            <el-option value="SystemProperty">系统变量</el-option>
          </el-select>
        </el-form-item>
        <template v-if="modalObj.type == 'SystemProperty'">
          <el-form-item label="变量名称">
            <el-input v-model="modalObj.name" placeholder="请输入..." />
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import VarSelect from "./module/variable-select";
// import { getVariableList } from "@/api/variable";
import { mapActions } from "vuex";

export default {
  name: "drag-drawer-loop",
  components: {
    VarSelect,
  },
  props: ["curDiagram", "processId"],
  data() {
    return {
      showName: "",
      remark: "",
      source: {
        category: "",
        name: "",
      },
      target: {}, // PropertyName类型 SystemProperty系统变量, CurrentData当前值
      nameMap: { SystemProperty: "系统变量", CurrentData: "当前值" },
      targetStr: "",
      modal: false,
      modalObj: { type: "CurrentData", name: "" },
      variableList: [],
      varMap: null,
      testvariableList2: [
        {
          name: "123",
          tag: true,
        },
        {
          name: "测试参数123",
          parentName: "123",
        },
      ],
      isParallel: false,
    };
  },
  mounted() {
    var properties = JSON.parse(
      JSON.stringify(this.curDiagram.getProperties())
    );
    this.showName = this.curDiagram.title;
    this.remark = properties.remark;
    if (properties.target) {
      this.target = properties.target;
      this.source = properties.source;
    }
    if (properties.isParallel) {
      this.isParallel = properties.isParallel;
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
      if (type == "source") {
        this.source = {};
        this.source = param;
      } else {
        this.target = {};
        this.target = param;
      }
    },
    saveConfig() {
      let configJson = {
        title: this.showName,
        source: this.source,
        target: this.target,
        remark: this.remark,
        isParallel: this.isParallel,
      };
      this.source = {};
      this.target = {};
      this.$emit("arguments", configJson);
    },
    setTarget() {
      this.modal = true;
      this.modalObj = this.target;
    },
    ok() {
      if (this.modalObj.type == "CurrentData") {
        this.modalObj.name = "";
      }
      this.target = { ...this.modalObj };
      this.targetStr =
        this.nameMap[this.target.type] + (this.target.name || "");
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
    saveVarEdit(varList) {
      this.$emit("submitVarList", varList);
    },
  },
};
</script>

<style scoped>
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
</style>
