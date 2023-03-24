<template>
  <div>
    <div style="text-align: center; margin-bottom: 20px; font-weight: bold;">数据{{ tableRowDetailData && tableRowDetailData.length ? '编辑' : '添加' }}</div>
    <el-form
      ref="processForm"
      label-width="120px"
      :model="dataForm"
      style="padding-right: 20px;"
      size="small"
    >
      <el-form-item :label="item.columnName" v-for="(item, key) in tableColumns" :key="key">
        <el-input v-model="dataForm[item.columnName]" maxlength="50" />
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center; padding-bottom: 20px;">
      <el-button size="small" type="primary" :disabled="btnLoading" @click="save">保 存</el-button>
      <el-button size="small" @click="$emit('onCancel')">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { addDbTableColumnData, editDbTableColumnData } from '@/api/database-command/index.js'
export default {
  name: "table-row-data-update",
  props: {
    tableName: {
      type: String,
      default: "",
    },
    databaseId: {
      type: String,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    tableColumns: {
      type: Array,
      default: () => [],
    },
    tableRowDetailData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isActiveType: "MOBILE",
      btnLoading: false,
      oldDataForm: {},
      dataForm: {
        // projectName: "",
        // fromProjectId: null,
      },
      // rules: {
      //   projectName: [
      //     { required: true, message: "请输入名称", trigger: "blur" },
      //   ],
      // },
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
  created() {
    // console.log(this.tableColumns, this.tableRowDetailData)
    this.dataForm = {}
    let obj = {}
    if (this.tableRowDetailData && this.tableRowDetailData.length) {
      for (let index = 0; index < this.tableColumns.length; index++) {
        const name = this.tableColumns[index].columnName;
        const value = this.tableRowDetailData[index]
        obj[name] = value
      }
    }
    this.dataForm = obj
    this.oldDataForm = JSON.parse(JSON.stringify(obj))
    // console.log(this.dataForm)
  },
  mounted() {},
  methods: {
    cancal() {
      this.isShowDialog = false;
      this.dataForm = {
        // projectName: "",
        // fromProjectId: null,
      };
    },
    save() {
      // console.log(this.dataForm)
      if (this.tableRowDetailData && this.tableRowDetailData.length) {
        this.edit()
      } else {
        this.add()
      }
    },
    add() {
      let setColumns = []
      for(let key in this.dataForm) {
        setColumns.push({
          columnName: key,
          columnValue: this.dataForm[key]
        })
      }
      let params = {
        dbConfigId: this.databaseId,
        tableName: this.tableName,
        setColumns
      }
      addDbTableColumnData(params).then(res => {
        this.$message.success('保存成功');
        this.$emit('onReloadData')
      })
    },
    edit() {
      let setColumns = []
      let conditionColumns = []
      for(let key in this.oldDataForm) {
        conditionColumns.push({
          columnName: key,
          condition: '=',
          connectType: 'and',
          columnValue: this.oldDataForm[key]
        })
      }
      for(let key in this.dataForm) {
        setColumns.push({
          columnName: key,
          columnValue: this.dataForm[key]
        })
      }
      let params = {
        dbConfigId: this.databaseId,
        tableName: this.tableName,
        setColumns,
        conditionColumns
      }
      editDbTableColumnData(params).then(res => {
        this.$message.success('保存成功');
        this.$emit('onReloadData')
      })
    },
    dialogOpen() {
      this.dataForm = {
        projectName: "",
        fromProjectId: null,
      };
    },
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
