<template>
  <div class="settings">
    <a-drawer
      :title="title"
      width="100%"
      :visible.sync="isShowDialog"
      :footer="null"
      :loading="loading"
      @cancel="close"
      @close="close"
    >
      <div style="display: flex;justify-content: center;">
        <div class="merge-div"
        :class="{ 'merge-div-choose': leftIsSelect }"
        @click="mDivClick(mergeDetail.leftId)">
          <div>{{mergeDetail.leftchoose.name}}</div>
          <div>{{mergeDetail.leftchoose.updateTime}}  {{mergeDetail.leftchoose.createBy}}</div>
        </div>
        <div style="display: flex; flex-direction: column; width: 44px">
          <a-button
            class="merge-button"
            title="向右合并"
            @click="mergeRightItem"
          >
            <i class="iconfont iconshang" style="transform: rotate(90deg)"></i>
          </a-button>
          <a-button
            class="merge-button"
            title="向左合并"
            @click="mergeLeftItem"
          >
            <i class="iconfont iconshang" style="transform: rotate(-90deg)"></i>
          </a-button>
        </div>
        <div class="merge-div"
        :class="{ 'merge-div-choose': rightIsSelect }"
        @click="mDivClick(mergeDetail.rightId)">
          <div>{{mergeDetail.rightchoose.name}}</div>
          <div>{{mergeDetail.rightchoose.updateTime}}  {{mergeDetail.rightchoose.createBy}}</div>
        </div>
      </div>
      <a-row style="height:calc(100vh - 112px);overflow-y: auto;">
        <webDesignerIndex
          v-if="isShowDialog&&queryId"
          :id="queryId"
          :editType="'merge'"
          :ref="'webDesignerIndex'"
          :project-type="'PC'"
          :currentFileData="{}"
        />
      </a-row>
    </a-drawer>
  </div>
</template>
<script>
import webDesignerIndex from "@/views/report/index.vue";
import {
  mergeItemService,
} from "@/api/branch";
export default {
  name: "mergeDrawer",
  components: {
    webDesignerIndex,
  },
  props: {
    title: String,
    //0:从页面设计器打开 1:从侧边栏打开
    mergeDetail:{
      type: Object,
      default: {
        leftId: null,
        rightId: null,
        type: null,
        leftchooseId: null,
        rightchooseId:null,
        leftchoose:{},
        rightchoose:{}
      },
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      queryId:null,
      loading:false,
      leftIsSelect:true,
      rightIsSelect:false,
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
  },
  methods: {
    init(chooseId){
      this.queryId=Number(chooseId)
      console.log('---------',this.queryId);
    },
    close() {
      this.isShowDialog = false;
      this.$emit("mergeDrawerClose")
    },
    mergeLeftItem(){
      let mergeDirection = "rightToLeft";
      let params = {
        leftId: this.mergeDetail.leftId,
        rightId: this.mergeDetail.rightId,
        mergeDirection: mergeDirection,
        type: this.mergeDetail.fileType,
        queryId: this.mergeDetail.rightchooseId,
      };
      this.mergeItem(params);
    },
    mergeRightItem(){
      let mergeDirection = "leftToRight";
      let params = {
        leftId: this.mergeDetail.leftId,
        rightId: this.mergeDetail.rightId,
        mergeDirection: mergeDirection,
        type: this.mergeDetail.fileType,
        queryId: this.mergeDetail.leftchooseId,
      };
      this.mergeItem(params);
    },
    mergeItem(params) {
      this.loading = true;
      mergeItemService(params).then((res) => {
        this.loading = false;
        if (res.code == 0) {
          this.$antdMessage.success("合并成功");
          this.close();
        }
      });
    },
    mDivClick(projectId){
      this.$store.dispatch("project/setProjectId", projectId);
      this.$refs.webDesignerIndex.onLoadDesignView();
      if(this.mergeDetail.leftId==projectId){
        this.leftIsSelect=true
        this.rightIsSelect=false
      }else{
        this.leftIsSelect=false
        this.rightIsSelect=true
      }
      
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-row {
  margin-top: 10px;
  margin-bottom: 10px;
}
.merge-div{
    width: 300px;
   
    border-radius: 5px;
    padding: 10px;
    text-align: center;
    margin:0px 10px ;
    cursor: pointer;
}
.merge-div:active{
  border: 1px solid #409eff;
  color: #409eff;
}
.merge-div-choose{
  border: 1px solid #409eff;
  color: #409eff;
}
</style>
