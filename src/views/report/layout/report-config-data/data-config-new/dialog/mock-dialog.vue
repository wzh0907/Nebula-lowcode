<template>
  <el-dialog
    title="Mock数据"
    :visible.sync="isShowDialog"
    :close-on-click-modal="false"
    width="800px"
    @open="dialogOpen"
  >
    <span style="font-size: large">
      <el-input
        type="textarea"
        :rows="15"
        placeholder="请输入内容"
        v-model="mockData"
      >
      </el-input>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="refresh">刷 新</el-button>
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveMockResult,getMockResult,getProcesseDataList } from "@/api/chartsData";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    interfaceConfig: {
      type: Object,
    },
  },
  data() {
    return {
      mockItem: {},
      mockData: "",
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
    dialogOpen() {
      this.mockData="";
       const mockQuery = {
        processId: this.interfaceConfig.data.id,
        type: 'report',
      }
      getMockResult(mockQuery).then(res=>{
         this.mockData =  res.data.mockData;        
      })
    },
    refresh(){
      console.log("refresh",this.interfaceConfig)
      const data = {
        dataApiId: this.interfaceConfig.data.id,
        params: {},
      };
      getProcesseDataList(data).then((res) => {
        if (res.code === 0) {
          // this.interfaceKeyList = []
           this.mockData = JSON.stringify(res.data);
        } 
      });
    },
    onClose() {
      this.$emit("onClose");
    },
    onSubmit() {
      let mockParam = {
        processId: this.interfaceConfig.data.id,
        type: "report",
        mockData: this.mockData,
      };
      saveMockResult(mockParam);
      this.isShowDialog = false
      this.$emit("onSubmit",this.mockData);
    },
  },
};
</script>

<style scoped lang="scss">
p {
  margin: 0;
  padding: 0;
}
</style>
