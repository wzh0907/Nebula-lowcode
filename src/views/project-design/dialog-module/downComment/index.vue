<template>
  <div class="downComment">
    <el-dialog
      :title="title"
      width="820px"
      :before-close="handleClose"
      :visible.sync="isShowDialog"
      @open="dialogOpen"
    >
      <el-form ref="downDialogForm" style="text-align: center">
        <el-col>
          <el-form-item
            label=""
            prop="cpntName"
            style="width: 60%; margin: 0 auto"
          >
            <el-input
              placeholder="输入名称搜索"
              v-model="cpntName"
              @change="change"
              class="search-input"
            >
              <el-button
                slot="append"
                @click="searchApply"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item class="componentList">
            <downCommentList
              @refreshGroupComponentList="refreshGroupComponentList"
              @refreshConfigJson="refreshConfigJson"
              @refreshProcessDetail="refreshProcessDetail"
              @refreshCpntList="refreshCpntList"
              @uploadDirTree="uploadDirTree"
              @close="close"
              :mktCommentList="mktCommentList"
              :dirId="dirId"
              :openType="openType"
              :dataType="dataType"
            />
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="save">确定</el-button> -->
        <el-button @click="close">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCommonDirTreeService,
  checkMktCommentList,
  getMktCpntType,
  mktGetQueryCpntType,
} from "@/api/componentApply";
import downCommentList from "./downCommentList";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "downComment",
  props: {
    title: String,
    //0:从页面设计器打开 1:从侧边栏打开
    openType: {
      type: String,
      default: "0",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dataType: {
      type: String,
      default: "report",
    },
  },
  data() {
    return {
      value: [],
      activeType: "",
      dirId: 0,
      treeDirList: [],
      cpntName: "",
      mktCommentList: [],
      martTypeList: [],
      mktQueryCpntTypeList: [],
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
  components: {
    downCommentList,
  },
  watch: {},
  created() {},
  methods: {
    refreshProcessDetail(processDetail) {
      this.$emit("refreshProcessDetail", processDetail);
    },

    refreshConfigJson(configJson) {
      this.$emit("refreshConfigJson", configJson);
    },

    refreshGroupComponentList() {
      this.$emit("refreshGroupComponentList");
    },
    refreshCpntList() {
      this.getMktCommentList("all");
    },

    uploadDirTree() {
      this.$emit("uploadDataTree");
      this.getMktCommentList();
    },
    change() {
      this.$forceUpdate(); // 组件偶尔输入不了
    },
    searchApply() {
      this.getMktCommentList("all");
    },
    handleChange(value) {
      this.dirId = value[value.length - 1];
    },
    dialogOpen() {
      this.getMktCommentList("all");
      // this.getCommentMktCpntType();
      // this.getQueryCpntType();
    },
    //获取组件查询条件类型
    getQueryCpntType() {
      mktGetQueryCpntType().then((res) => {
        this.mktQueryCpntTypeList = res.dataList;
      });
    },

    handleClick(value) {
      this.getMktCommentList(value.name);
    },
    //获取组件市场管理列表
    getMktCommentList(type) {
      let obj = {
        cpntName: this.cpntName,
        cpntType: type,
        dataType: this.dataType,
        subType: this.openType == "1" ? "group" : getStorage("subType"), //从侧边栏组件市场打开，subType写死group
      };
      checkMktCommentList(obj).then((res) => {
        this.mktCommentList = res.dataList;
      });
    },
    // 获取业务分类
    // getCommentMktCpntType() {
    //   getMktCpntType().then((res) => {
    //     this.martTypeList = res.dataList;
    //     this.activeType = this.martTypeList[0].dictCode;
    //     this.getMktCommentList(this.activeType);
    //   });
    // },
    handleClose() {
      this.$refs["downDialogForm"].resetFields();
      this.value = [];
      this.cpntName = "";
      // this.dataType = 'report'
      this.isShowDialog = false;
    },
    close() {
      this.$refs["downDialogForm"].resetFields();
      this.value = [];
      // this.dataType = 'report'
      this.cpntName = "";
      this.isShowDialog = false;
    },
  },
};
</script>

<style lang="scss">
.downComment {
  /deep/.el-form-item {
    margin-bottom: 20px;
  }
  \deep\.el-input-group__append,
  .el-input-group__prepend {
    width: 80px;
  }

  .input-with-select \deep\.el-input-group__append,
  .el-input-group__prepend {
    background-color: #fff;
  }
  .componentList {
    overflow: auto;
    height: 420px;
    margin-top: 16px;
  }
}
</style>
