<template>
  <div class="group-wrap loop-warp">
    <div class="group-content">
      <el-form label-position="left" label-width="70px">
        <el-form-item label="节点名称">
          <el-input v-model="showName" size="small"/>
        </el-form-item>
        <el-radio style="margin-top: 20px" v-model="loopType" :label="'list'">
          <el-form-item label="循环列表">
            <VarSelect
              key="loopList"
              :data="loopList"
              :processId="processId"
              type="loopList"
              @setVar="setVar"
              @submitVarList="saveVarEdit"
            />
          </el-form-item>
        </el-radio>
        <el-radio v-model="loopType" :label="'count'">
          <el-form-item label="循环次数">
            <VarSelect
              key="loopCount"
              :data="loopCount"
              :processId="processId"
              type="loopCount"
              @setVar="setVar"
              @submitVarList="saveVarEdit"
            />
          </el-form-item>
        </el-radio>
        <el-radio v-model="loopType" :label="'condition'">
          <el-form-item label="条件循环">
            <VarSelect
              key="leftValue"
              :data="condition.left_value"
              :processId="processId"
              type="leftValue"
              @setVar="setVar"
              @submitVarList="saveVarEdit"
            />
            <el-select v-model="condition.op" style="width:80px;margin:0px 5px;">
              <el-option label="=" value="="></el-option>
              <el-option label=">" value=">"></el-option>
              <el-option label="<" value="<"></el-option>
              <el-option label=">=" value=">="></el-option>
              <el-option label="<=" value="<="></el-option>
              <el-option label="!=" value="<>"></el-option>
              <el-option label="包含" value="include"></el-option>
              <el-option label="前包含" value="startWith"></el-option>
              <el-option label="后包含" value="endWith"></el-option>
            </el-select>
            <VarSelect
              key="rightValue"
              :data="condition.right_value"
              :processId="processId"
              type="rightValue"
              @setVar="setVar"
              @submitVarList="saveVarEdit"
            />
          </el-form-item>
        </el-radio>
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
        :autosize="{ minRows: 5, maxRows: 15 }"
        placeholder="Enter something..."
        type="textarea"
      />
    </div>

    <!-- <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem"
          >删除</el-button
        >
        <el-button class="btn btns-save" type="primary" @click="saveConfig"
          >保存</el-button
        >
      </el-row>
    </div> -->
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
            <el-input v-model="modalObj.name" placeholder="请输入..."/>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import VarSelect from "./module/variable-selectV4";
import {mapActions} from "vuex";

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
      nameMap: {SystemProperty: "系统变量", CurrentData: "当前值"},
      targetStr: "",
      modal: false,
      modalObj: {type: "CurrentData", name: ""},
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
      loopType: "",
      loopList: {},
      loopCount: {},
      condition: {
        left_value: {},
        op: "",
        right_value: {},
      },
    };
  },
  mounted() {
    var properties = JSON.parse(
      JSON.stringify(this.curDiagram.getProperties())
    );
    this.showName = this.curDiagram.title;
    this.remark = properties.remark;

    if (properties.loopType) {
      this.loopType = properties.loopType;
      if (this.loopType == "list") {
        this.loopList = properties.source;
      } else if (this.loopType == "count") {
        this.loopCount = properties.source;
      }
    }
    if (properties.target) {
      // this.target = properties.target;
      // this.source = properties.source;
    }
    if (properties.condition) {
      this.condition = properties.condition;
    }
    if (properties.isParallel) {
      this.isParallel = properties.isParallel;
    }


  },
  methods: {
    setVar(param, type) {
      console.log("setVar", param, type, this.radio);
      this.loopList = {};
      this.loopCount = {};

      if (type == "loopList") {
        this.condition.left_value = {};
        this.condition.right_value = {};
        this.loopList = param;
      } else if (type == "loopCount") {
        this.condition.left_value = {};
        this.condition.right_value = {};
        this.loopCount = param;
      } else if (type == "leftValue") {
        this.condition.left_value = param;
      } else if (type == "rightValue") {
        this.condition.right_value = param;
      }
    },
    saveConfig() {
      let configJson = {
        title: this.showName,
        loopType: this.loopType,
        condition: this.condition,
        target: this.target,
        remark: this.remark,
        isParallel: this.isParallel,
      };
      if (this.loopType == "list") {
        configJson.source = this.loopList;
        this.loopList = {};
      } else if (this.loopType == "count") {
        configJson.source = this.loopCount;
        this.loopCount = {};
      }
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
      this.target = {...this.modalObj};
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

<style lang="less" scoped>
.loop-warp {
  /deep/ .el-input--suffix {
    width: 100%;
  }

  /deep/ .el-input {
    //width: 100%;
  }

  /deep/ .el-select {
    width: 100%;
  }
}

.process-wrap .el-form-item {
  margin-bottom: 0px;
}

.el-radio {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.group-wrap {
  position: relative;
  height: 100%;

  /deep/ .el-form-item__content {
    display: flex;
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

.el-form-item {
  margin-bottom: 00px;
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
