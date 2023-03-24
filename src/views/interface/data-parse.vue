<template>
  <el-dialog
    :title="title"
    width="680px"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <div v-loading="listLoading">
      <div class="content-wrap content-left">
        <el-tree
          node-key="name"
          :default-expanded-keys="pickDataNameIndexList"
          :default-checked-keys="pickDataNameIndexList"
          :props="props"
          :data="treeDataList"
          show-checkbox
          @check="handleCheckChange"
        >
        </el-tree>
      </div>
      <div class="content-wrap content-right">
        <ul>
          <li v-for="(item, key) in pickDataList" :key="key">{{ item.name }}</li>
        </ul>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="saveData">保 存</el-button>
      <el-button @click="isShowDialog = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "Add",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    interfaceDataList: {
      type: Object | Array,
      default: {}
    },
    interfaceParseData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      title: "数据解析",
      listLoading: false,
      props: {
        label: "name",
        children: "children",
      },
      treeDataList: [],
      pickDataNameIndexList: [],
      pickDataList: []
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
  created() {},
  mounted() {},
  methods: {
    saveData(){
      this.isShowDialog = false
      this.$emit('onGetParseData', this.pickDataList)
    },
    handleCheckChange(data, checkData) {
      let checkedKeys = checkData.checkedKeys || []
      if (data.name) {
        // let pickDataIndex = this.pickDataList.indexOf(data)
        let pickDataIndex = this.pickDataNameIndexList.indexOf(data.name)
        if (pickDataIndex !== -1 && checkedKeys.indexOf(data.name) === -1) {
          this.pickDataNameIndexList.splice(pickDataIndex, 1)
          this.pickDataList.splice(pickDataIndex, 1)
        } else if (pickDataIndex === -1 && checkedKeys.indexOf(data.name) !== -1) {
          this.pickDataList.push(data)
          this.pickDataNameIndexList.push(data.name)
        }
      }
    },
    handleInterfaceData(inputData, outputData, objTempArr,path){
      if (typeof inputData !== 'object') return false
      if (!inputData.push || typeof inputData.push !== 'function') { // object
        outputData.children = []
        for(let key in inputData) {
          let inputDataValue = inputData[key]
          if (inputDataValue !== null && typeof inputDataValue === 'object' && (!inputDataValue.push || typeof inputDataValue.push !== 'function')) { // object
            let tempObj = {
              name: key,
              originData: inputDataValue
            }
            tempObj.path = path?(path+"/"+key):key;
            objTempArr.push(tempObj.name)
            outputData.children.push(tempObj)
            //  console.log("迭代",inputDataValue, tempObj, objTempArr,)
            this.handleInterfaceData(inputDataValue, tempObj, objTempArr,tempObj.path)
          } else { // array || other
            let tempObj = {
              name: key,
              originData: inputDataValue
            }
            tempObj.path = path?(path+"/"+key):key;
            objTempArr.push(tempObj.name)
            outputData.children.push(tempObj)
          }
        }
      } else { // array
      }
    },
    dialogOpen() {
      let tempObj = {}
      let objTempArr = [] // 所有对象的key集合
      this.handleInterfaceData(this.interfaceDataList, tempObj, objTempArr,"")
      this.treeDataList = [tempObj]
      this.pickDataNameIndexList = []
      this.pickDataList = []
      this.interfaceParseData.forEach(item => {
        if (item.name && objTempArr.indexOf(item.name) !== -1) {
          this.pickDataNameIndexList.push(item.name)
          this.pickDataList.push(item)
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
ul,
li,
p {
  margin: 0;
  padding: 0;
}
.content-wrap {
  display: inline-block;
  width: 45%;
  height: 500px;
  vertical-align: top;
  border: 1px solid #ccc;
  overflow-y: auto;
  &.content-right {
    float: right;
    li {
      padding: 5px 10px;
    }
  }
}
// .table-info {
//   li {
//     display: flex;
//     line-height: 50px;
//     text-align: left;
//     border-bottom: 1px solid #ccc;
//     p {
//       flex: 1;
//     }
//   }
// }
</style>
