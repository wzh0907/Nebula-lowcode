<template>
  <div class="field-set-view">
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="itemList[0] && (itemList[0].dataSetName || itemList[0].tableName)" :name="itemList[0] && (itemList[0].dataSetName || itemList[0].tableName)" v-for="(itemList, key) in tableMap" :key="key">
        <el-table
          :ref="`multipleTable-${key}`"
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
              <el-input size="mini" v-model="scope.row.newValue">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column align="left" label="字段类型" prop="type"></el-table-column>
          <el-table-column
            label="字段描述"
            align="left"
          >
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.description">
              </el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "field-set",
  props: {
    dataTableInfoMapPick: {},
    dataSetFieldList: {
      default: () => []
    },
    // selectedD3TreeTableIds: {
    //   default: () => []
    // }
  },
  data() {
    return {
      activeNames: ['1'],
      // multipleSelection: [],
      tableMap: {}
    };
  },
  watch: {
    tableMap: {
      handler(){
        this.save()
      },
      deep: true
    }
  },
  created(){},
  mounted(){
    // console.log('-------------dateset', this.dataSetFieldList)
    // console.log('-------------dataTableInfoMapPick', this.dataTableInfoMapPick)
    this.pickDataTable()
  },
  methods: {
    save(){
      let dataSetFieldList = []
      for(let key in this.tableMap) {
        let arr = this.tableMap[key] || []
        arr.forEach(item => {
          // console.log('---------------', item)
          dataSetFieldList.push({
            tableName: item.tableName,
            tableId: item.tableId,
            displayName: item.newValue,
            fieldName: item.name,
            fieldType: item.type,
            description: item.description,
            hide: !item.isShow
          })
        })
      }
      // console.log(dataSetFieldList)
      this.$emit('onChangeDataSetFieldList', dataSetFieldList)
    },
    pickDataTable(){
      let tableMap = {}
      for(let key in this.dataTableInfoMapPick) {
        // if (this.selectedD3TreeTableIds.indexOf(Number(key)) === -1) return false;
        let itemArr = this.dataTableInfoMapPick[key]
        let tempList = JSON.parse(JSON.stringify(itemArr))
        tableMap[key] = tempList
        tempList.forEach(item => {
          this.dataSetFieldList.forEach(setFieldItem => {
            // console.log(setFieldItem.fieldName, item.name)
            if (setFieldItem.fieldName === item.name) {
              item.newValue = setFieldItem.displayName
              item.isShow = !setFieldItem.hide
              item.description = setFieldItem.description
              // console.log(setFieldItem)
            }
          })
          if (!item.isShow) return false
          setTimeout(() => {
            this.toggleSelection(item, key)
          }, 0)
        })
        // console.log(tableMap)
      }
      this.tableMap = tableMap
    },
    toggleSelection(row, key) {
      let multipleTableEl = this.$refs[`multipleTable-${key}`][0]
      if (row) {
        multipleTableEl.toggleRowSelection(row);
      } else {
        multipleTableEl.clearSelection();
      }
    },
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
  /deep/.el-collapse {
    border: 0;
    /deep/.el-collapse-item__wrap {
      border: 0;
    }
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
// 改变折叠面板的默认样式
/deep/.el-collapse-item__header {
  padding-left: 20px;
}
/deep/.el-collapse-item__arrow {
  position: absolute;
  margin: 0;
  left: 0;
}
</style>
