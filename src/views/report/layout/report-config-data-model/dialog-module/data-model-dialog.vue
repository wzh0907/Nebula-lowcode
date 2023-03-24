<template>
  <el-dialog
    :title="title"
    top="5vh"
    width="1000px"
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
      <el-form-item label="数据库" prop="dbConfigId" class="curd-form-item">
        <el-select v-model="crudForm.dbConfigId" @change="dbChange">
          <el-option
            v-for="dbItem in dbList"
            :key="dbItem.businessId"
            :label="dbItem.dataSourceName"
            :value="dbItem.businessId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表名" prop="tableName" class="curd-form-item">
        <el-input v-model="crudForm.tableName" placeholder="表名"></el-input>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="crudForm.menuName" placeholder="菜单名称"></el-input>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" scatyle="width: 100%" max-height="400">
      <el-table-column prop="colTitle" label="标题" width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.colTitle" />
        </template>
      </el-table-column>
      <el-table-column label="组件类型" width="170">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.editType"
            style="width: 150px; margin-right: 10px"
          >
            <el-option
              v-for="(eItem, eKey) in editTypeList"
              :value="eItem.value"
              :label="eItem.label"
              :key="eKey"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="colName" label="列名" width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.columnName" />
        </template>
      </el-table-column>

      <el-table-column label="数据类型" width="220">
        <template slot-scope="scope">
          <el-input
            placeholder="请输入长度"
            v-model="scope.row.precision"
            v-if="floatTypeMap.indexOf(scope.row.dataType) === -1"
          >
            <el-select
              v-model="scope.row.dataType"
              slot="prepend"
              placeholder="请选择"
              style="width: 120px"
            >
              <el-option
                :label="typeItem"
                :value="typeItem"
                v-for="(typeItem, key) in fieldDataTypeMap"
                :key="key"
              />
            </el-select>
          </el-input>
          <el-input
            placeholder="请输入小数点长度"
            v-model="scope.row.scale"
            v-else
          >
            <el-select
              v-model="scope.row.dataType"
              slot="prepend"
              placeholder="请选择"
              style="width: 120px"
            >
              <el-option
                :label="typeItem"
                :value="typeItem"
                v-for="(typeItem, key) in fieldDataTypeMap"
                :key="key"
              />
            </el-select>
          </el-input>
        </template>
      </el-table-column>

      <!-- <el-table-column label="主键" width="120">
        <template slot-scope="scope">
          <el-checkbox
            size="mini"
            v-model="scope.row.columnKeyFlag"
            @change="changePri(scope.row)"
            >主键</el-checkbox
          >
          <el-checkbox size="mini" v-model="scope.row.isNullable"
            >Not NULL</el-checkbox
          >
        </template>
      </el-table-column> -->

      <el-table-column prop="isTableCol" label="表格列" width="80">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isTableCol" />
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
import { crudByModelService } from "@/api/crud";
import { getDbSrclist } from "@/api/database-command/index.js";
import { addDbTable } from "@/api/database-command/index.js";
import { coverBigComponent } from "@/views/report/utils/common-const";
export default {
  name: "CrudDialog",
  props: {
    id: {
      type: Number,
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
    componentUUIDList: {
      type: Array,
      default: [],
    },
    componentList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      btnLoading: false,
      dbList: [],
      tableColumns: [],
      crudForm: {
        dbConfigId: null,
        tableName: "",
        tablePrimaryKey: "",
        menuName: "",
      },
      fieldDataTypeMap: [
        "VARCHAR", // 字符型
        "INT", // 整数型
        "FLOAT",
        "DOUBLE", // 浮点型
        "DATE",
        "TIME",
        "YEAR",
        "DATETIME", // 日期型
      ],
      floatTypeMap: ["FLOAT", "DOUBLE", "DECIMAL"],
      rules: {
        dbConfigId: [
          { required: true, message: "请选择数据源", trigger: "blur" },
        ],
        tableName: [{ required: true, message: "请输入表名", trigger: "blur" }],
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
        ],
      },
      tableData: [],
      editTypeList: [
        {
          label: "输入框",
          value: "text",
        },
        {
          label: "日期选择器",
          value: "date",
        },
        {
          label: "选择器",
          value: "select",
        },
        {
          label: "单选",
          value: "radio",
        },
        {
          label: "多选",
          value: "checkbox",
        },
      ],
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
    initDb() {
      getDbSrclist().then((res) => {
        const dataList = res.dataList || [];
        this.dbList = [];
        dataList.forEach((element) => {
          if (element.type == "database") {
            this.dbList.push(element);
          }
        });
      });
    },
    addTableData() {
      this.tableData.push({
        columnName: "",
        precision: 0,
      });
    },
    confirmDel(row) {
      this.tableData.forEach((item, index) => {
        if (item == row) {
          this.tableData.splice(index, 1);
        }
      });
    },
    changePri(row) {
      if (row.columnKeyFlag) {
        row.columnKey = "pri";
      } else {
        row.columnKey = "";
      }
    },
    dbChange() {
      this.dbList.forEach((item) => {
        if (item.businessId == this.crudForm.dbConfigId) {
          this.crudForm.dataSourceName = item.dataSourceName;
        }
      });
    },
    save() {
      this.tableData.forEach((tItem) => {
        if (!tItem.columnName) {
          this.$message.error("列名必填");
          return;
        }
        this.setNameByComponentByUuid(
          this.componentList,
          tItem.uuid,
          tItem.columnName,
          tItem.colTitle
        );
      });
      this.$refs.crudForm.validate(async (valid) => {
        if (valid) {
          this.crudForm.tablePrimaryKey = "";
          this.tableData.forEach((item) => {
            item.colName = item.columnName;
            // if (item.columnKeyFlag) {
            //   this.crudForm.tablePrimaryKey = item.columnName;
            // }
          });
          // if (!this.crudForm.tablePrimaryKey) {
          //   this.$message.error("必须选择主键");
          //   return;
          // }
          this.btnLoading = true;

          // 1、建表
          let param = {
            tableName: this.crudForm.tableName,
            dbConfigId: this.crudForm.dbConfigId,
            columns: this.tableData,
          };
          addDbTable(param).then((res) => {
            if (res.code == 0) {
              this.crudForm.tablePrimaryKey = res.data;
              // 2、生成页面
              this.generateCrud();
            }
          });
        }
      });
    },
    generateCrud() {
      let param = {
        menuName: this.crudForm.menuName,
        tableName: this.crudForm.tableName,
        tablePrimaryKey: this.crudForm.tablePrimaryKey,
        dbConfigId: this.crudForm.dbConfigId,
        tableData: this.tableData,
        dataSourceName: this.crudForm.dataSourceName,
        modelReportId: this.id,
        componentList:JSON.stringify(this.componentList),
      };
      crudByModelService(param).then((res) => {
        if (res.code == 0) {
          this.$message.success("数据模型创建成功");
          this.isShowDialog = false;
          this.$emit("onReloadView");
        }
        this.btnLoading = false;
      });
    },
    dialogOpen() {
      this.tableData = [];
      this.componentUUIDList &&
        this.componentUUIDList.forEach((cItem, cIndex) => {
          let eType = "";
          this.editTypeList.forEach((item) => {
            if (item.label == cItem.name) {
              eType = item.value;
            }
          });
          this.tableData.push({
            colTitle: cItem.options.label,
            columnName: cItem.options.commonConfigAssignName,
            colName: cItem.options.commonConfigAssignName,
            uuid: cItem.uuid, //前端处理用
            editType: eType,
            dataType: "VARCHAR",
            precision: 100,
            isSelect: true,
            isEditable: true,
            isCheck: cItem.options.required,
          });
        });

      this.initDb();
    },
    setNameByComponentByUuid(componentConfigList, uuid, name,label) {
      componentConfigList.forEach((newItem) => {
        let type = newItem.type;
        let options = newItem.options;
        let optionsColumns = options && options.columns;
        if (
          coverBigComponent.indexOf(type) !== -1 &&
          optionsColumns &&
          optionsColumns.length
        ) {
          optionsColumns.forEach((columnItem) => {
            if (columnItem.componentList && columnItem.componentList.length) {
              // let tempComponentList = []
              this.setNameByComponentByUuid(columnItem.componentList, uuid,name,label);
              // columnItem.componentList = tempComponentList
            }
          });
        } else {
          if (newItem.uuid == uuid) {
            newItem.options.commonConfigAssignName = name;
            newItem.options.label = label;
          }
        }
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
.demo-form-inline {
  display: flex;
  justify-content: space-between;
}
.add-table-data {
  margin-top: 10px;
  text-align: center;
}
</style>
