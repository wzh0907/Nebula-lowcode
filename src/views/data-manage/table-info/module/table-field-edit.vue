<template>
  <div>
    <el-form
      ref="processForm"
      :rules="rules"
      label-width="120px"
      :model="dataForm"
      style="padding-right: 20px;"
      size="small "
    >
      <el-form-item label="列名：" prop="columnName">
        <el-input v-model="dataForm.columnName" maxlength="50" />
      </el-form-item>
      <el-form-item label="类型：" prop="dataType">
        <el-input placeholder="请输入长度" v-model="dataForm.precision" v-if="floatTypeMap.indexOf(dataForm.dataType) === -1">
          <el-select v-model="dataForm.dataType" slot="prepend" placeholder="请选择" style="width: 120px;">
            <el-option
              :label="typeItem"
              :value="typeItem"
              v-for="(typeItem, key) in fieldDataTypeMap"
              :key="key"
            />
          </el-select>
        </el-input>
        <el-input placeholder="请输入小数点长度" v-model="dataForm.scale" v-else>
          <el-select v-model="dataForm.dataType" slot="prepend" placeholder="请选择" style="width: 120px;">
            <el-option
              :label="typeItem"
              :value="typeItem"
              v-for="(typeItem, key) in fieldDataTypeMap"
              :key="key"
            />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="默认值：" prop="columnDefault">
        <el-input v-model="dataForm.columnDefault" maxlength="50" />
      </el-form-item>
      <el-form-item label=" ">
        <el-checkbox size="mini" v-model="dataForm.columnKey">主键</el-checkbox>
        <el-checkbox size="mini" v-model="dataForm.isNullable">Not NULL</el-checkbox>
      </el-form-item>
      <el-form-item label="注释：" prop="columnComment">
        <el-input v-model="dataForm.columnComment" maxlength="50" />
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center;">
      <el-button size="small" type="primary" :disabled="btnLoading" @click="save">保 存</el-button>
      <el-button size="small" @click="$emit('onCancel')">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { addDbTableColumn, editDbTableColumn } from '@/api/database-command/index.js'
import { mapGetters } from "vuex";
export default {
  name: "addProject",
  props: {
    isCreateTable: {
      type: Boolean,
      default: false
    },
    databaseId: {
      type: String,
      default: "",
    },
    tableName: {
      type: String,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    fieldRowData: {},
  },
  data() {
    return {
      fieldDataTypeMap: [
        'VARCHAR', // 字符型
        'INT',  // 整数型
        'FLOAT', 'DOUBLE', // 浮点型
        'DATE', 'TIME', 'YEAR', 'DATETIME', // 日期型
      ],
      floatTypeMap: ['FLOAT', 'DOUBLE', 'DECIMAL'],
      isActiveType: "MOBILE",
      btnLoading: false,
      dataForm: {
        columnName: "",
      },
      rules: {
        columnName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
      },
      marketProjectList: [],
    };
  },
  computed: {
    ...mapGetters(["projectList"]),
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  created() {
    this.dataForm = JSON.parse(JSON.stringify(this.fieldRowData))
    if (this.dataForm.columnKey) this.dataForm.columnKey = true
  },
  mounted() {
    // getMarketProjectListService().then((res) => {
    //   if (res.code == 0) {
    //     this.marketProjectList = res.dataList;
    //   }
    // });
  },
  methods: {
    cancal() {
      this.isShowDialog = false;
      this.dataForm = {
        columnName: "",
      };
    },
    save() {
      this.dataForm.columnKey = this.dataForm.columnKey ? 'pri' : ''
      if (this.isCreateTable) {
        this.$emit('onSaveOneField', this.dataForm)
      } else {
        if (this.fieldRowData.columnName) {
          this.edit()
        } else {
          this.add();
        }
      }
    },
    add() {
      // this.dataForm.characterMaximumLength = '255'
      let params = {
        dbConfigId: this.databaseId,
        tableName: this.tableName,
        columns: [this.dataForm]
      }
      this.btnLoading = true;
      addDbTableColumn(params).then(res => {
        this.$message.success('保存成功');
        this.btnLoading = false;
        this.$emit('onReloadData')
      }).catch(() => {
        this.btnLoading = false;
      })
      // this.$refs.processForm.validate(async (valid) => {
      //   if (valid) {
      //   }
      // });
    },
    edit(){
      // this.dataForm.characterMaximumLength = '255'
      this.dataForm.columnOldName = this.fieldRowData.columnName
      let params = {
        dbConfigId: this.databaseId,
        tableName: this.tableName,
        columns: [this.dataForm]
      }
      this.btnLoading = true;
      editDbTableColumn(params).then(res => {
        this.$message.success('保存成功');
        this.btnLoading = false;
        this.$emit('onReloadData')
      }).catch(() => {
        this.btnLoading = false;
      })
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
.device-type-select {
  overflow: hidden;
  text-align: center;
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
</style>
