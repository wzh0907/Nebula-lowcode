<template>
  <div class="field-set-view">
    <div class="table-operation">
      <el-form size="mini" :inline="true" class="form-gap">
        <el-form-item>
          <span class="mini-font"></span>
        </el-form-item>
        <el-form-item style="float: right;" v-show="isEditMode">
          <el-button type="text" @click="isEditMode = false">取消</el-button>
        </el-form-item>
        <el-form-item style="float: right;" v-show="isEditMode">
          <el-button type="text" @click="isEditMode = false">保存</el-button>
        </el-form-item>
        <el-form-item style="float: right;" v-show="!isEditMode">
          <el-button type="text" @click="isEditMode = true">编辑</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="itemList"
      element-loading-text="Loading"
      highlight-current-row
      stripe
      border
      style="width: 100%;"
      @select="handleSelectionChange"
      @select-all="handleSelectionChangeAll($event, itemList)"
    >
      <el-table-column
        type="selection"
        class-name="custom-table-column"
        label-class-name="custom-table-header"
        width="100">
      </el-table-column>
      <el-table-column align="left" label="原字段名" prop="name"></el-table-column>
      <el-table-column
        label="新字段名"
        align="left"
      >
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newValue" v-show="isEditMode"></el-input>
          <span v-show="!isEditMode">{{ scope.row.newValue }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="字段类型" prop="type"></el-table-column>
      <el-table-column
        label="字段描述"
        align="left"
      >
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.remarks" v-show="isEditMode"></el-input>
          <span v-show="!isEditMode">{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "field-set-view",
  props: {
    dataTableList: {},
    dataSetFieldList: {
      default: () => []
    }
  },
  data() {
    return {
      isEditMode: false,
      // activeNames: ['1'],
      // multipleSelection: [],
      itemList: []
    };
  },
  created(){},
  mounted(){
    // console.log(this.dataSetFieldList)
    this.itemList = JSON.parse(JSON.stringify(this.dataTableList))
  },
  methods: {
    save(){
      let dataSetFieldList = []
      this.itemList.forEach(item => {
        dataSetFieldList.push({
          displayName: item.newValue,
          fieldName: item.name,
          fieldType: item.type,
          hide: !item.isShow
        })
      })
      // console.log(dataSetFieldList)
      this.$emit('onChangeDataSetFieldList', dataSetFieldList)
    },
    // pickDataTable(){
    //   let tableMap = {}
    //   for(let key in this.dataTableInfoMap) {
    //     // if (this.selectedD3TreeTableIds.indexOf(Number(key)) === -1) return false;
    //     let itemArr = this.dataTableInfoMap[key]
    //     let tempList = JSON.parse(JSON.stringify(itemArr))
    //     tableMap[key] = tempList
    //     tempList.forEach(item => {
    //       this.dataSetFieldList.forEach(setFieldItem => {
    //         // console.log(setFieldItem.fieldName, item.name)
    //         if (setFieldItem.fieldName === item.name) {
    //           item.newValue = setFieldItem.displayName
    //           item.isShow = !setFieldItem.hide
    //           // console.log(setFieldItem)
    //         }
    //       })
    //       if (!item.isShow) return false
    //       setTimeout(() => {
    //         this.toggleSelection(item, key)
    //       }, 0)
    //     })
    //     // console.log(tableMap)
    //   }
    //   this.tableMap = tableMap
    // },
    // toggleSelection(row, key) {
    //   let multipleTableEl = this.$refs[`multipleTable-${key}`][0]
    //   if (row) {
    //     multipleTableEl.toggleRowSelection(row);
    //   } else {
    //     multipleTableEl.clearSelection();
    //   }
    // },
    handleSelectionChangeAll(selectList, listAll){
      listAll.forEach(row => {
        row.isShow = (selectList.length !== 0)
      })
      this.save()
    },
    handleSelectionChange(selectList, row) {
      row.isShow = !row.isShow
      this.save()
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
