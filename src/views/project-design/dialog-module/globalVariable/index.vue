<template>
  <div class="downComment">
    <el-dialog
      :title="title"
      width="620px"
      :before-close="handleClose"
      :visible.sync="isShowDialog"
      @open="dialogOpen"
      @closed="dialogClose"
    >
      <el-row>
        <el-tag
          class="scope-tag"
          v-for="scopeItem in scopeList"
          :key="scopeItem.id"
          :disable-transitions="false"
          closable
          @click="choseScope(scopeItem)"
          @close="deleteScope(scopeItem)"
        >
          {{ scopeItem.scopeName }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput"
          >+添加分组</el-button
        >
      </el-row>
      <el-row v-if="currentScopeId"  style="margin-top:10px">
        <el-table
          :data="varList"
          :row-class-name="tableRowClassName"
          border
          style="width: 100%"
          max-height="500px"
          @cell-click="tabClick"
        >
          <el-table-column prop="reason" label="变量名" align="center">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.index === tabClickIndex &&
                  tabClickLabel === '变量名'
                "
              >
                <el-input
                  v-model="scope.row.variableKey"
                  maxlength="300"
                  placeholder="请输入变量名"
                  size="mini"
                  @keyup.enter.native="inputBlur"
                  @blur="inputBlur"
                />
              </span>
              <span v-else>{{ scope.row.variableKey }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="默认值" align="center">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.index === tabClickIndex &&
                  tabClickLabel === '默认值'
                "
              >
                <el-input
                  v-model="scope.row.defaultValue"
                  maxlength="300"
                  placeholder="请输入默认值"
                  size="mini"
                  @keyup.enter.native="inputBlur"
                  @blur="inputBlur"
                />
              </span>
              <span v-else>{{ scope.row.defaultValue }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteVar(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" style="margin-top:10px;text-align:center"><el-button @click="addVar">添加</el-button></el-col>
      </el-row>

      <!-- <el-row v-for="(varItem,index) in varList" :key="index" style="margin-top:10px;">
        <el-col :span="11"><el-input v-model="varItem.variableKey" placeholder="数据项名称" /></el-col>
        <el-col :span="10"><el-input v-model="varItem.defaultValue" placeholder="数据默认值" style="margin-left:20px"/></el-col>
        <el-col :span="3  " style="padding-top:8px;padding-left:20px"><i class="delete-item iconfont icontrash"  @click="deleteItem(index)"></i></el-col>
      </el-row>
      <el-row style="padding-top:10px;">
        <el-col :span="8">
          <div class="add-var" @click="addVar">+添加数据项</div>
        </el-col>
      </el-row> -->
      
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import {
  getScopeListService,
  deleteScopeService,
  addScopeService,
  getVarListService,
  saveVarService,
  deleteVarService,
} from "@/api/globalVariable";

import {initVariable} from '@/views/report/utils/deal-global-variable/globalUtils'
export default {
  name: "downComment",
  props: {
    title: String,
    //0:从页面设计器打开 1:从侧边栏打开

    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      varList: [],
      scopeList: [],
      currentScopeId: null,
      inputVisible: false,
      inputValue: "",
      tabClickIndex: null, // 点击的单元格
      tabClickLabel: "", // 当前点击的列名
      tabCLickRow: {},
    };
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  components: {},
  watch: {},
  created() {},
  methods: {
    dialogOpen() {
      this.init();
      // getGlobalVariableListService().then((res) => {
      //   if(res.code==0){
      //     this.varList = res.dataList
      //   }
      // });
    },
    dialogClose(){
      initVariable();
    },
    init() {
      getScopeListService().then((res) => {
        if (res.code == 0) {
          this.scopeList = res.dataList;
        }
      });
    },

    addVar() {
      let item = {
        variableKey: "",
        defaultValue: "",
      };
      this.varList.push(item);
    },
    deleteItem(index) {
      this.varList.splice(index, 1);
    },
    save() {
      saveGlobalVariableService(this.varList).then((res) => {
        store.dispatch("global/setGlobalVariables", this.varList);
        this.close();
      });
    },
    choseScope(item) {
      this.currentScopeId = item.id;
      this.selectVarList(item.id);
    },
    selectVarList(scopeId) {
      let param = {
        businessScopeId: scopeId,
      };
      getVarListService(param).then((res) => {
        this.varList = res.dataList;
      });
    },
    deleteScope(item) {
      let param = {
        businessScopeId: item.id,
      };
      deleteScopeService(param).then((res) => {
        this.init();
      });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        let param = {
          scopeName: inputValue,
        };
        addScopeService(param).then((res) => {
          this.init();
        });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    handleClose() {
      this.isShowDialog = false;
    },
    close() {
      this.isShowDialog = false;
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },
    tabClick(row, column, cell, event) {
      switch (column.label) {
        case "变量名":
          this.tabClickIndex = row.index;
          this.tabClickLabel = column.label;
          this.tabCLickRow = row;
          break;
        case "默认值":
          this.tabClickIndex = row.index;
          this.tabClickLabel = column.label;
          this.tabCLickRow = row;
          break;
        default:
          return;
      }
    },
    // 失去焦点初始化
    inputBlur() {
      this.saveVar();
      this.tabClickIndex = null;
      this.tabClickLabel = "";
    },
    saveVar() {
      saveVarService(this.tabCLickRow).then((res) => {
         this.selectVarList(this.currentScopeId);
      });
    },
    deleteVar(row) {
      let businessId = row.id;
      this.$confirm("请确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deelteGlobalVar(businessId);
        })
        .catch(() => {});
    },
    deelteGlobalVar(businessId) {
      let param = {
        businessId: businessId,
      };
      deleteVarService(param).then((res) => {
        this.selectVarList(this.currentScopeId);
      });
    },
    addVar() {
      this.varList.push({
        variableKey: "",
        defaultValue: "",
        scopeId: this.currentScopeId,
      });
      this.tabClickIndex = this.varList.length - 1;
      this.tabClickLabel = "变量名";
    },
  },
};
</script>

<style lang="scss">
.add-var {
  color: #409eff;
}
.delete-item {
  font-size: 20px;
  margin: 20px;
  cursor: pointer;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.scope-tag {
  cursor: pointer;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>