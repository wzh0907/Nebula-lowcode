<template>
  <div>
    <div v-loading="listLoading" style="display: flex;">
      <!-- Left -->
      <div class="content-wrap" style="flex: 1;">
        <div style="padding: 5px; font-weight: bold;">接口返回数据</div>
        <div style="border: 1px solid #e9eaeb; border-radius: 4px; height: 460px" v-if="isShowLeftTree">
          <el-tree
            node-key="path"
            :default-expanded-keys="pickDataPathIndexList"
            :default-checked-keys="pickDataPathIndexList"
            :props="props"
            :data="treeDataList"
            :render-content="renderContent"
            show-checkbox
            default-expand-all
            @check="handleCheckChange"
          >
          </el-tree>
        </div>
      </div>
      <!-- 操作 -->
      <div style="width: 75px; position: relative;">
        <div style="position: absolute; text-align: center; top: 0; margin: auto; bottom: 0; left: 0; right: 0; height: 200px;">
          <div style="margin-bottom: 20px;">
            <el-button size="small" icon="el-icon-refresh" @click="onRefresh" title="请求接口更新数据"></el-button>
          </div>
          <div style="margin-bottom: 20px;">
            <el-button size="small" icon="el-icon-arrow-right" @click="onPickData"></el-button>
          </div>
          <div style="margin-bottom: 20px;">
            <el-button size="small" icon="el-icon-arrow-left" @click="onUnpickData"></el-button>
          </div>
        </div>
      </div>
      <!-- Right -->
      <div class="content-wrap content-right" style="flex: 1;">
        <div style="padding: 5px; font-weight: bold;">输出数据</div>
        <div style="border: 1px solid #e9eaeb; border-radius: 4px; height: 460px">
          <ul>
            <li v-for="(item, key) in pickDataList" :key="key">
              <el-checkbox :label="item.path" v-model="item._ischecked">
                <span v-if="item.originValue !== undefined">
                  {{ `${item.name}：` }}
                  <span style="display: inline-block; max-width: 200px;" :style="{color: colorMap[typeof item.originValue] || '#409eff'}">{{ computedValueType(item.originValue) }}</span>
                </span>
                <span style="display: inline-block; max-width: 200px;" v-else>{{ item.label || item.path }}</span>
              </el-checkbox>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
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
    interfaceData: {
      type: Object | Array,
      default: {}
    },
    interfaceParseList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      colorMap: {
        string: '#008000',
        number: '#FF0000',
        boolean: '#0000FF',
        object: '#409eff',
      },
      isShowLeftTree: true,
      checkedKeys: [],
      title: "数据解析",
      listLoading: false,
      props: {
        label: "label",
        children: "children",
      },
      treeDataList: [],
      // pickDataNameIndexList: [],
      pickDataPathIndexList:[],
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
    computedValueType(value) {
      const labelValue = (
            typeof value === 'object'
              ? (Array.isArray(value) ? 'Array' : 'Object')
              : value
          )
      return labelValue
    },
    renderContent(h, { node, data, store }) {
      // console.log(node, data, store)
      const value = data.originValue

      return h('span', [
        h('span', `${data.name}：`),
        h('span', {
          style: {
            display: 'inline-block',
            maxWidth: '200px',
            color: this.colorMap[typeof value] || '#409eff',
            // 超出省略号
            // 'overflow': 'hidden',
            // 'text-overflow': 'ellipsis',
            // 'display': '-webkit-box',
            // '-webkit-line-clamp': '1',
            // '-webkit-box-orient': 'vertical'
          }
        }, this.computedValueType(value))
      ])
      // return (
      //   <span class="custom-tree-node">
      //     <span>{ data.name }: </span>
      //     <span :style="{color: colorMap[value]}">{ labelValue }</span>
      //   </span>);
    },
    onPickData () {
      // console.log('xxxxxx', this.treeDataList)
      this.pickDataList = []

      const _list = []
      function deepListFn (item) {
        _list.push(item)
        if (item.children) {
          item.children.forEach(item => {
            deepListFn(item)
          })
        }
      }
      this.treeDataList.forEach(item => {
        deepListFn(item)
      })
      // this.treeDataList.forEach(item => {
      //   _list.push(item)
      //   if (item.children) {
      //     item.children.forEach(item => {
      //       _list.push(item)
      //     })
      //   }
      // })
      // this.pickDataPathIndexList = []
      _list.forEach(item => {
        // this.pickDataPathIndexList.push(item.path)
        if (this.checkedKeys.includes(item.path)) {
          this.$set(item, '_ischecked', false)
          this.pickDataList.push(item)
        }
      })
      // console.log(this.pickDataList)

      this.$emit('onGetParseData', this.pickDataList)
    },
    onUnpickData () {
      this.isShowLeftTree = false
      // console.log(this.pickDataList)
      this.pickDataList = this.pickDataList.filter(v => !v._ischecked)

      this.pickDataPathIndexList = []
      this.pickDataList.forEach(item => {
        this.pickDataPathIndexList.push(item.path)
      })
      // console.log(this.pickDataPathIndexList)
      this.$nextTick(() => {
        this.isShowLeftTree = true
      })

      this.$emit('onGetParseData', this.pickDataList)
    },
    // onCheckSelectStatus() {
    //   let pickDataIndex = this.pickDataPathIndexList.indexOf(data.path)
    //   if (pickDataIndex !== -1 ) {
    //     this.pickDataNameIndexList.splice(pickDataIndex, 1)
    //     this.pickDataPathIndexList.splice(pickDataIndex, 1)
    //     this.pickDataList.splice(pickDataIndex, 1)
    //   } else if (pickDataIndex === -1 && checkedKeys.indexOf(data.path) !== -1) {
    //     this.pickDataList.push(data)
    //     this.pickDataNameIndexList.push(data.name)
    //     this.pickDataPathIndexList.push(data.path)
    //   }
    //   this.$emit('onGetParseData', this.pickDataList)
    // },

    onRefresh(){
      this.$emit('onTestInterface')
      this.$message.success('刷新成功')
    },
    saveData(){
      this.isShowDialog = false
      this.$emit('onGetParseData', this.pickDataList)
    },
    clearPickData() {

    },
    handleCheckChange(data, checkData) {
      // console.log((data, checkData))
      this.checkedKeys = checkData.checkedKeys || []

      // let checkedKeys = checkData.checkedKeys || []
      // if (data.path) {
      //   // let pickDataIndex = this.pickDataList.indexOf(data)
      //   let pickDataIndex = this.pickDataPathIndexList.indexOf(data.path)
      //   if (pickDataIndex !== -1 ) {
      //     this.pickDataNameIndexList.splice(pickDataIndex, 1)
      //     this.pickDataPathIndexList.splice(pickDataIndex, 1)
      //     this.pickDataList.splice(pickDataIndex, 1)
      //   } else if (pickDataIndex === -1 && checkedKeys.indexOf(data.path) !== -1) {
      //     this.pickDataList.push(data)
      //     this.pickDataNameIndexList.push(data.name)
      //       this.pickDataPathIndexList.push(data.path)
      //   }
      //   console.log('onGetParseData=', this.pickDataList);
      //   this.$emit('onGetParseData', this.pickDataList)
      // }
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
    handleInterfaceDataNew(inputData, outputData, objTempArr,path){
      if (typeof inputData !== 'object') return false
      if (!inputData.push || typeof inputData.push !== 'function') { // object
        outputData.children = []
        for(let key in inputData) {
          let inputDataValue = inputData[key]
          const labelValue = (
            typeof inputDataValue === 'object'
              ? (Array.isArray(inputDataValue) ? 'Array' : 'Object')
              : inputDataValue
          )
          if (inputDataValue !== null && typeof inputDataValue === 'object' && (!inputDataValue.push || typeof inputDataValue.push !== 'function')) { // object
            let tempObj = {
              label: `${key}: ${labelValue}`,
              originValue: inputDataValue, // 原始值
              name: key,
              originData: inputDataValue
            }
            tempObj.path = path?(path+"/"+key):key;
            let temp={
              name:tempObj.name,
              path:tempObj.path
            }
            objTempArr.push(temp)
            outputData.children.push(tempObj)
            //  console.log("迭代",inputDataValue, tempObj, objTempArr,)
            this.handleInterfaceDataNew(inputDataValue, tempObj, objTempArr,tempObj.path)
          } else { // array || other
            let tempObj = {
              label: `${key}: ${labelValue}`,
              originValue: inputDataValue, // 原始值
              name: key,
              originData: []
            }
            tempObj.path = path?(path+"/"+key):key;
                let temp={
              name:tempObj.name,
              path:tempObj.path
            }
            objTempArr.push(temp)
            outputData.children.push(tempObj)
          }
        }
      } else { // array
      }
    },
    dataParse() {
      console.log('dataParse');
      let tempObj = {}
      let objTempArr = [] // 所有对象的key集合
      // this.handleInterfaceData(this.interfaceData, tempObj, objTempArr,"")
       this.handleInterfaceDataNew(this.interfaceData, tempObj, objTempArr,"")
      this.treeDataList = tempObj.children
      // this.pickDataNameIndexList = []
      this.pickDataList = []
      this.interfaceParseList.forEach(item => {
        objTempArr.forEach(temp=>{
          if(item.name &&temp.path==item.path){
            //  this.pickDataNameIndexList.push(item.name)
             this.pickDataPathIndexList.push(item.path)
            this.pickDataList.push(item)
          }
        })
        // if (item.name && objTempArr.indexOf(item.name) !== -1) {
        //   this.pickDataNameIndexList.push(item.name)
        //   this.pickDataList.push(item)
        // }
      })

      this.checkedKeys = this.pickDataPathIndexList
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
  // width: 45%;
  height: 500px;
  vertical-align: top;
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
