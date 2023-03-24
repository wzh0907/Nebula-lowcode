<template>
  <div class="downComment">
    <a-drawer
      :title="title"
      width="820px"
      :before-close="handleClose"
      :visible.sync="isShowDialog"
      :footer="null"
      @open="dialogOpen"
      @cancel="close"
      @close="close"
    >
      <a-row>
        <a-col :span="12">历史记录</a-col>
        <a-col :span="12" style="text-align: right">
          <span @click="showActiveDialog" style="color:#1890ff;cursor: pointer;"
            ><i class="iconfont iconsave1"></i>保存记录</span
          >
        </a-col>
      </a-row>
      <a-table :columns="columns" :data-source="versionList" :pagination="pagination" @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a style="color:#1890ff" @click="loadDetail(record)">装载</a>
        </span>
      </a-table>
    </a-drawer>
    <ActiveSaveDialog
      :dialog-visible.sync="activiSaveVisible"
      :id="id"
      :type="type"
      :scheme="scheme"
      title="保存记录"
      @saveSuccess="saveSuccess"
    />
  </div>
</template>

<script>
import store from "@/store";
import {
  getVersionListService,
  getVersionDetailService,
} from "@/api/versionManage";
import ActiveSaveDialog from "./activeSave.vue";
export default {
  name: "versionManage",
  components: { ActiveSaveDialog },
  props: {
    title: String,
    //0:从页面设计器打开 1:从侧边栏打开

    dialogVisible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: false,
    },
    type: {
      type: String,
      default: "report",
    },
    scheme: {
      type: String,
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
      columns: [
        {
          title: "时间",
          dataIndex: "createTime",
          key: "createTime",
          width: "30%",
        },
        {
          title: "提交人",
          dataIndex: "createBy",
          key: "createBy",
          width: "20%",
        },
        {
          title: "注释",
          dataIndex: "remark",
          key: "remark",
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      pagination: {
        pageSize: 10,
        current: 0,
      },
      versionList: [],
      activiSaveVisible: false,
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
  watch: {},
  created() {},
  methods: {
    dialogOpen() {
      this.init();
    },
    dialogClose() {},
    init() {
      let params = {
        page: this.pagination.current,
        queryId: this.id,
        size: this.pagination.pageSize,
        type: this.type,
      };
      getVersionListService(params).then((res) => {
        const pagination = { ...this.pagination };
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = res.totalNumber;
        this.versionList = res.dataList;
        this.pagination = pagination;
      });
    },
    loadDetail(record) {
      let params = {
        businessId: record.versionId,
      };
      getVersionDetailService(params).then((res) => {
        if (res.code == 0) {
          this.$emit("loadData", res.data.scheme);
          this.close();
        }
      });
    },
    showActiveDialog() {
      this.activiSaveVisible = true;
      this.$forceUpdate();
      console.log("------------------", this.activiSaveVisible);
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
handleTableChange(pagination, filters, sorter){
  this.pagination=pagination;
  this.init()
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
    saveSuccess() {
      this.init();
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