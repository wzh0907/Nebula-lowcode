<template>
  <div>
    <div v-loading="listLoading">
      <!-- <div class="content-wrap">
        <div style="padding: 5px;">返回数据</div>
        <div style="border: 1px solid #ccc; height: 460px">
          <el-tree
            node-key="path"
            :default-expanded-keys="pickDataPathIndexList"
            :default-checked-keys="pickDataPathIndexList"
            :props="props"
            :data="treeDataList"
            show-checkbox
            @check="handleCheckChange"
          >
          </el-tree>
        </div>
      </div>

      <div class="content-wrap content-right">
        <div style="padding: 5px">输出数据</div>
        <div style="border: 1px solid #ccc; height: 460px">
          <ul>
            <li v-for="(item, key) in pickDataList" :key="key">{{ item.path }}</li>
          </ul>
        </div>
      </div> -->

      <treeTransfer
        :title="['接口返回数据', '输出数据']"
        :from_data='treeDataList'
        :to_data='pickDataList'
        :defaultProps="{ label: 'label' }"
        @add-btn='add'
        @remove-btn='remove'
        mode='transfer'
        height='460px'
        filter
        openAll
      />

    </div>
  </div>
</template>

<script>
// import { generateUUID } from "@/views/report/utils/index.js";
import treeTransfer from 'el-tree-transfer'
export default {
  name: "Add",
  components: {
    treeTransfer
  },
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
      listLoading: false,
      props: {
        label: "name",
        children: "children",
      },
      treeDataList: [],
      pickDataNameIndexList: [],
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
    // 监听穿梭框组件添加
    add(fromData, toData, obj){
      console.log('addd')
      this.pickDataList.push({
        label: obj.label,
        name: obj.name,
        path: obj.id
      })
      console.log(this.pickDataList, obj)
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      // console.log("fromData:", fromData);
      // console.log("toData:", toData);
      // console.log("obj:", obj);
    },
    // 监听穿梭框组件移除
    remove(fromData,toData,obj){
      console.log('remove')
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      // console.log("fromData:", fromData);
      // console.log("toData:", toData);
      // console.log("obj:", obj);
    },
    saveData(){
      this.isShowDialog = false
      this.$emit('onGetParseData', this.pickDataList)
    },
    clearPickData() {

    },
    handleCheckChange(data, checkData) {
      let checkedKeys = checkData.checkedKeys || []
      if (data.path) {
        // let pickDataIndex = this.pickDataList.indexOf(data)
        let pickDataIndex = this.pickDataPathIndexList.indexOf(data.path)
        if (pickDataIndex !== -1 ) {
          this.pickDataNameIndexList.splice(pickDataIndex, 1)
          this.pickDataPathIndexList.splice(pickDataIndex, 1)
          this.pickDataList.splice(pickDataIndex, 1)
        } else if (pickDataIndex === -1 && checkedKeys.indexOf(data.path) !== -1) {
          this.pickDataList.push(data)
          this.pickDataNameIndexList.push(data.name)
            this.pickDataPathIndexList.push(data.path)
        }
        console.log('onGetParseData=', this.pickDataList);
        this.$emit('onGetParseData', this.pickDataList)
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
              id: path?(path+"/"+key):key,
              // pid: path?(path+"/"+key):key,
              label: `${key}: ${labelValue}`,
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
              id: path?(path+"/"+key):key,
              // pid: path?(path+"/"+key):key,
              label: `${key}: ${labelValue}`,
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
      // console.log('dataParse');
      let tempObj = {}
      let objTempArr = [] // 所有对象的key集合
      // this.handleInterfaceData(this.interfaceData, tempObj, objTempArr,"")
       this.handleInterfaceDataNew(this.interfaceData, tempObj, objTempArr,"")
      this.treeDataList = tempObj.children
      this.treeDataList.forEach(item => {
        item.pid = 0
      })
      console.log('xxxxxxxxxxxxx', this.treeDataList)
      this.pickDataNameIndexList = []
      this.pickDataList = []
      this.interfaceParseList.forEach(item => {
        objTempArr.forEach(temp=>{
          if(item.name &&temp.path==item.path){
            this.pickDataNameIndexList.push(item.name)
            this.pickDataPathIndexList.push(item.path)
            this.pickDataList.push(item)
          }
        })
        // if (item.name && objTempArr.indexOf(item.name) !== -1) {
        //   this.pickDataNameIndexList.push(item.name)
        //   this.pickDataList.push(item)
        // }
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
