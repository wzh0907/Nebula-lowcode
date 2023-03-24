<template>
  <div class="var-select-div">
    <!-- <Input v-model="chosenVar" placeholder="Enter something..." @on-focus="itest"/> -->
    <el-dropdown  trigger="click" style="width:80%" @command="variableChoose">
      <el-input size="small" v-model="chosenVar" placeholder @on-change="inputChange" />
      <el-dropdown-menu slot="dropdown" width="100%" >
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
    </el-dropdown>
    <!-- <el-select v-model="chosenVar" style="width:80%" @on-change="variableChoose" clearable>
      <el-option
        v-for="item in variableList"
        :value="item.name"
        :class="item.tag?'tag-class':'val-class'"
      >
        <span class="var-option" :style="'color:'+item.color">{{item.markText}}</span>
        {{ item.name }}
      </el-option>
    </el-select>-->
    <span @click="showVarModel" class="select-add-btn">
      <i class="iconfont iconjiahao1"></i>变量
    </span>
    <VarEdit
      ref="varEdit"
      :show="showVarEditModel"
      @cancalVarEdit="cancalVarEdit"
      @submitVarList="saveVarEdit"
    />
  </div>
</template>

<script>
import VarEdit from "./variable-edit";
import { mapActions } from "vuex";
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
  },
  components: {
    VarEdit,
  },
  watch: {
    data(newData, oldVal) {
      // 从父组件获取到回显参数
      this.show(newData);
    },
  },
  data() {
    return {
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
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.variableList = this.$store.getters.variableList;
      this.show(this.data);
    },
    show(dataItem) {
      // 这一步特殊处理是用来回显静态常量
      this.chosenVar = dataItem.value;
      this.variableList.forEach((variable) => {
        if(dataItem.type!=4 && variable.parentName==dataItem.category&&variable.name==dataItem.name){
          this.chosenVar = dataItem.category + "/" + variable.name;
        }else if (dataItem.type==variable.type && dataItem.category == variable.name) {
          this.chosenVar = variable.name;
        }
      });
    },
    variableChoose(item) {
      console.log("variableChoose",item);
      let param = {};
      let itemList = item.split("@");
      let parentName = itemList[0];
      let itemName = itemList[1];
      let itemType = itemList[2];
      this.variableList.forEach((variable) => {
        if (
          parentName != 'undefined' &&
          itemName == variable.name &&
          parentName == variable.parentName
        ) {
          // 变量
          param.category = variable.parentName;
          param.name = variable.name;
          param.type = variable.type;
          param.value = variable.value;
          if(variable.value_type){
            param.value_type  = variable.value_type;
          }
        } else if (parentName === 'undefined' && itemName == variable.name &&itemType==variable.type) {          
          //tag
          param.category = variable.name;
          param.name = "";
          param.type = variable.type;
          param.value = variable.value;
          if(variable.value_type){
            param.value_type  = variable.value_type;
          }
        }
      });
      this.$emit("setVar", param, this.type);
    },
    showVarModel() {
      this.showVarEditModel = true;
    },
    cancalVarEdit() {
      this.showVarEditModel = false;
      this.variableList = this.$store.getters.variableList;
      this.$emit("cancalVarEdit", false);
    },
    saveVarEdit(tempVarList) {
      this.$emit("submitVarList", tempVarList);
      // 延时接受vuex
      setTimeout(() => {
        this.init();
      }, 2000);
    },
    inputChange() {
      let param = {
        category: "",
        name: "",
        type: 0,
        value: this.chosenVar,
      };
      console.log("inputchange");
      // console.log(this.chosenVar);
      this.$emit("setVar", param, this.type);
      // $($($('.select-test').get(0)).get(0)).click()
    },
  },
};
</script>

<style scoped lang="scss">
.var-select-div {
  display: flex;
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
</style>
