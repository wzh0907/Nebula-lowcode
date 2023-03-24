<template>
  <el-dialog
    :title="title"
    width="450px"
    v-loading="listLoading"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-table
      v-loading="listLoading"
      :data="authorityAllList"
      element-loading-text="Loading"
      highlight-current-row
      stripe
      style="width: 100%;"
    >
      <el-table-column align="center" label="权限名称" prop="authorityName">
        <template slot-scope="scope">
          <div>{{ scope.row.authorityName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="权限类型" align="center" prop="type">
        <template slot-scope="scope">
          <div>{{ scope.row.type }}</div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { getAuthorityAllList } from '@/api/authority/index'

export default {
  name: "permissionDetail",
  props: {
    // id: {
    //   type: String | Number,
    //   default: ""
    // },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
  //  detailData: {}
  },
  data() {
    return {
      listLoading: false,
      authorityAllList: [],
    };
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    queryAuthorityAllList(){
      getAuthorityAllList({
        // reportId: 'xxx',
        // type: 'component'
      }).then(res => {
        this.authorityAllList = res.dataList || []
      })
    },
    dialogOpen() {
      this.queryAuthorityAllList()
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item{
  margin-bottom: 20px;
}
.new-role{
  float: right;
}
</style>
