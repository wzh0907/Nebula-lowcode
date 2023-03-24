<template>
  <el-dialog
    :title="title"
    top="5vh"
    width="950px"
    :visible.sync="isShowDialog"
    :append-to-body="true"
    @open="dialogOpen"
  >
    <el-form
      :inline="true"
      ref="crudForm"
      :rules="rules"
      :model="crudForm"
      class="demo-form-inline"
    >
      <el-form-item label="表名" class="curd-form-item">
        {{ crudForm.tableName }}
      </el-form-item>
      <el-form-item label="主键" prop="tablePrimaryKey" class="curd-form-item">
        <el-select v-model="crudForm.tablePrimaryKey" placeholder="选择主键">
          <el-option
            v-for="(col, index) in tableColumns"
            :label="col.columnName"
            :value="col.columnName"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName" >
        <el-input v-model="crudForm.menuName" placeholder="菜单名称"></el-input>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%;" height="400">
      <el-table-column prop="colName" label="列名" width="180">
      </el-table-column>
      <el-table-column prop="colType" label="类型" width="100">
      </el-table-column>
      <el-table-column prop="colTitle" label="标题" width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.colTitle" />
        </template>
      </el-table-column>
      <el-table-column prop="isTableCol" label="表格列" width="80">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isTableCol" />
        </template>
      </el-table-column>
      <el-table-column prop="isSelect" label="查询" width="80">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isSelect" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="编辑">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isEditable" />
          <el-select
            v-model="scope.row.editType"
            style="width: 110px; margin-right: 10px"
          >
            <el-option value="text" label="输入组件"></el-option>
            <el-option value="date" label="日期"></el-option>
            <el-option value="select" label="下拉框"></el-option>
            <el-option value="radio" label="单选"></el-option>
            <el-option value="checkbox" label="多选"></el-option>
          </el-select>
          <el-checkbox v-model="scope.row.isCheck" />必填
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancal">取 消</el-button>
      <el-button type="primary" :disabled="btnLoading" @click="save"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { crudService } from "@/api/crud";
export default {
  name: "CrudDialog",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    tableColumns: {
      type: Array,
    },
    dbConfigId: {
      type: Number,
      default: 0,
    },
    dataSourceName:{
      type:String,
      default:''
    },
    detailData: {},
  },
  data() {
    return {
      btnLoading: false,
      crudForm: {
        tableName: "",
        tablePrimaryKey: "",
        menuName: "",
      },
      rules: {
        tablePrimaryKey: [
          { required: true, message: "请选择主键", trigger: "blur" },
        ],
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
        ],
      },
      tableData: [],
    };
  },
  computed: {
    // ...mapGetters(["projectList"]),
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  created() {},
  mounted() {},
  methods: {
    cancal() {
      this.isShowDialog = false;
    },
    save() {
      this.$refs.crudForm.validate(async (valid) => {
        if (valid) {
          this.btnLoading=true;
          let param = {
            menuName: this.crudForm.menuName,
            tableName: this.crudForm.tableName,
            tablePrimaryKey: this.crudForm.tablePrimaryKey,
            dbConfigId: this.dbConfigId,
            tableData: this.tableData,
            dataSourceName:this.dataSourceName,
          };
          crudService(param).then((res) => {
            if (res.code == 0) {
              this.isShowDialog = false;
            }
            this.btnLoading=false
          });
        }
      });
    },
    dialogOpen() {
      this.tableData = [];
      this.tableColumns.forEach((tableItem) => {
        let temp = {
          colName: tableItem.columnName,
          colType: tableItem.columnType,
          colTitle: tableItem.columnName,
          isTableCol: false,
          isSelect: false,
          isEditable: false,
          editType: "text",
          isCheck: false,
        };
        this.tableData.push(temp);
        this.crudForm.tableName = tableItem.tableName;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.device-type-select {
  overflow: hidden;
  text-align: center;
  margin-bottom: 20px;
  .device-wrap {
    display: inline-block;
    &.active {
      color: #f56c6c;
    }
    cursor: pointer;
    .iconfont {
      font-size: 42px;
    }
  }
}
.demo-form-inline{
  display: flex;
  justify-content:space-between;
}

</style>
