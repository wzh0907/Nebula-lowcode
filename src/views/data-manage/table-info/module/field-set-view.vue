<template>
  <div class="field-set-view">
    <div class="table-operation">
      <el-form size="mini" :inline="true" class="form-gap">
        <el-form-item>
          表名：
        </el-form-item>
        <el-form-item v-if="isEditTableName">
          <el-input v-model="quoteTableName"></el-input>
        </el-form-item>
        <el-form-item v-else>
          <span>{{ quoteTableName }}</span>
        </el-form-item>
        <el-form-item>
          <span class="mini-font"></span>
        </el-form-item>
        <el-form-item v-show="isEditTableName">
          <el-button type="text" @click="isEditTableName = false">取消</el-button>
        </el-form-item>
        <el-form-item v-show="isEditTableName">
          <el-button type="text" @click="onEditTableName">保存</el-button>
        </el-form-item>
<!--        <el-form-item v-show="!isEditTableName">-->
<!--          <el-button type="text" @click="isEditTableName = true">编辑</el-button>-->
<!--        </el-form-item>-->

        <el-form-item style="float: right;" v-if="isCreateTable">
          <el-button type="text" @click="onCreateTable">保存</el-button>
        </el-form-item>
<!--        <el-form-item style="float: right;" >-->
<!--          <el-button type="text" @click="onAddCol">+添加列</el-button>-->
<!--        </el-form-item>-->

      </el-form>
    </div>
    <el-table
      :data="tableColumns"
      height="500"
      element-loading-text="Loading"
      highlight-current-row
      stripe
      border
      style="width: 100%;"
    >
      <el-table-column align="center" label="列名" prop="columnName"></el-table-column>
      <el-table-column align="center" label="类型" prop="columnType"></el-table-column>
      <el-table-column align="center" label="主键" prop="columnKey"></el-table-column>
      <el-table-column align="center" label="是否为null" prop="isNullable">
        <template slot-scope="scope">
          <span>
            {{ scope.row.isNullable ? 'YES' : 'NO' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认值" prop="columnDefault"></el-table-column>
      <el-table-column align="center" label="注释" prop="columnComment"></el-table-column>
<!--      <el-table-column-->
<!--        label="操作"-->
<!--        align="center"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="text" @click="onEditField(scope.row)">编辑</el-button>-->
<!--          <el-button type="text" @click="onDeleteField(tableColumns, scope.$index, scope.row)">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <!-- 抽屉弹窗 -->
    <el-drawer
      :visible.sync="drawerVisible"
      :modal="false"
      :show-close="false"
      direction="rtl"
      :before-close="onHandleDrawerClose">
      <tableFieldEdit v-if="drawerVisible" :isCreateTable="isCreateTable" :tableName="tableName" :databaseId="databaseId" :fieldRowData="fieldRowData" @onReloadData="onReloadData" @onSaveOneField="onSaveOneField" @onCancel="drawerVisible = false" />
    </el-drawer>
  </div>
</template>

<script>
import { addDbTable, deleteDbTableColumn, renameTableService } from '@/api/database-command/index.js'
import tableFieldEdit from './table-field-edit.vue'
export default {
  name: "field-set-view",
  components: {
    tableFieldEdit
  },
  props: {
    isCreateTable: false,
    tableName: '',
    databaseId: '',
    tableColumns: {
      default: () => []
    }
    // dataTableList: {},
    // dataSetFieldList: {
    //   default: () => []
    // }
  },
  data() {
    return {
      drawerVisible: false,
      isEditTableName: false,
      quoteTableName: '',
      fieldRowData: {}
      // activeNames: ['1'],
      // multipleSelection: [],
      // itemList: []
    };
  },
  created(){
    this.quoteTableName = this.tableName
  },
  mounted(){
    // console.log(this.dataSetFieldList)
    // this.itemList = JSON.parse(JSON.stringify(this.dataTableList))
    // console.log(this.itemList)
  },
  methods: {
    onEditTableName(){
      this.isEditTableName = false
      renameTableService({
        dbConfigId: this.databaseId,
        newName: this.quoteTableName,
        oldName: this.tableName
      }).then(res => {
        this.$message.success('重命名成功');
        this.$emit('onReloadDbSrclist')
      })
    },
    onReloadData(){
      this.drawerVisible = false
      this.$emit('onReloadData')
    },
    onCreateTable(){
      let params = {
        dbConfigId: this.databaseId,
        tableName: this.tableName,
        columns: this.tableColumns
      }
      addDbTable(params).then(res => {
        this.$message.success('保存成功');
        this.$emit('onReloadData')
      })
    },
    onSaveOneField(data){
      this.drawerVisible = false
      // data.characterMaximumLength = '255'
      this.tableColumns.push(JSON.parse(JSON.stringify(data)))
      this.fieldRowData = {}
    },
    // save(){
    //   let dataSetFieldList = []
    //   this.itemList.forEach(item => {
    //     dataSetFieldList.push({
    //       displayName: item.newValue,
    //       fieldName: item.name,
    //       fieldType: item.type,
    //       hide: !item.isShow
    //     })
    //   })
    //   // console.log(dataSetFieldList)
    //   this.$emit('onChangeDataSetFieldList', dataSetFieldList)
    // },
    onEditField(data){
      this.drawerVisible = true
      this.fieldRowData = data
    },
    onDeleteField(listData, index, rowData){
      // console.log(listData, index)
      this.$confirm('确认删除该字段？')
      .then(_ => {
        if (this.isCreateTable) {
          listData.splice(index, 1)
        } else {
          let params = {
            dbConfigId: this.databaseId,
            tableName: this.tableName,
            columns: [rowData]
          }
          deleteDbTableColumn(params).then(res => {
            this.$message.success('删除成功');
            this.$emit('onReloadData')
          })
        }
      })
      .catch(_ => {});
    },
    onHandleDrawerClose(done){
      this.$confirm('确认关闭？')
      .then(_ => {
        done();
      })
      .catch(_ => {});
    },
    onAddCol(){
      this.drawerVisible = true
      this.fieldRowData = {}
    }
  }
};
</script>

<style lang="scss" scoped>
.field-set-view {
  .table-operation {
    padding: 10px;
    .mini-font {
      font-size: 12px;
    }
  }
  .form-gap {
    margin-bottom: 10px;
  }
}
// 表格选择框添加文字
/deep/.el-table /deep/.custom-table-column .cell:before{
  content: "保留";
  position: absolute;
  right: 35px;
}
/deep/.el-table /deep/.custom-table-header .cell:before{
  content: "全选";
  position: absolute;
  right: 35px;
}
</style>
