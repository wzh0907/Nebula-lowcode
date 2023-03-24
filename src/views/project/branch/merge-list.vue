<template>
  <div v-loading="viewLoading" class="setting-container">
    <a-row class="setting-title">分支合并</a-row>
    <a-row type="flex" :gutter="16">
      <a-col :span="11" style="text-align: right">
        <a-select
          style="width: 220px"
          v-model="leftId"
          @change="initMergeList"
          :allow-clear="true"
        >
          <a-select-option
            v-for="(branchItem, bKey) in branchList"
            :value="branchItem.queryId"
            :key="bKey"
            >{{ branchItem.name }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="1"> </a-col>
      <a-col :span="11">
        <a-select
          style="width: 220px"
          v-model="rightId"
          @change="initMergeList"
          :allow-clear="true"
        >
          <a-select-option
            v-for="(branchItem, bKey) in branchList"
            :value="branchItem.queryId"
            :key="bKey"
            >{{ branchItem.name }}</a-select-option
          >
        </a-select>
      </a-col>
    </a-row>
    <a-row style="margin-top: 20px">
      <a-col :span="11" style="text-align: right">
        文件：
        <a-tag
          v-for="(fileTypeItem, fKey) in fileTypeList"
          :key="fKey"
          :color="fileTypeItem.isSelected ? 'blue' : ''"
          @click="fileTypeClick(fileTypeItem)"
          >{{ fileTypeItem.name }}</a-tag
        >
      </a-col>
      <a-col :span="1" style="text-align: center"> </a-col>
      <a-col :span="11">
        分类：
        <a-tag
          v-for="(classifyItem, cKey) in classifyList"
          :key="cKey"
          :color="classifyItem.isSelected ? 'blue' : ''"
          @click="classifyClick(classifyItem)"
          >{{ classifyItem.name }}</a-tag
        >
      </a-col>
    </a-row>

    <a-row type="flex" :gutter="16">
      <a-col :span="11">
        <a-table
          :loading="loading"
          :columns="columns"
          :data-source="leftList"
          @rowClick="leftRowClick"
          :customRow="renderTrBackground"
        >
        </a-table>
      </a-col>

      <a-col :span="1" style="text-align: center">
        <div style="display: flex; flex-direction: column; width: 44px">
          <a-button
            class="merge-button"
            title="向右合并"
            @click="mergeRightItem"
            v-if="leftchooseId"
          >
            <i class="iconfont iconshang" style="transform: rotate(90deg)"></i>
          </a-button>
          <a-button
            class="merge-button"
            title="向左合并"
            @click="mergeLeftItem"
            v-if="rightchooseId"
          >
            <i class="iconfont iconshang" style="transform: rotate(-90deg)"></i>
          </a-button>
          <a-button
            class="merge-button"
            title="明细合并"
            v-if="leftchooseId && rightchooseId"
            @click="toMergeDetail"
          >
            <i class="iconfont iconswap"></i>
          </a-button>
          <a-button
            class="merge-button"
            title="删除"
            v-if="leftchooseId || rightchooseId"
            @click="deleteMergeDetail"
          >
            <i class="iconfont icontrash"></i>
          </a-button>
        </div>
      </a-col>
      <a-col :span="11">
        <a-table
          :loading="loading"
          :columns="columns"
          :data-source="rightList"
          @rowClick="rightRowClick"
          :customRow="renderTrBackground"
        >
        </a-table>
      </a-col>
    </a-row>
    <mergeDrawer ref="mergeDetail" :dialog-visible.sync="mergeDrawerVisible" :mergeDetail="mergeDetail" @mergeDrawerClose="mergeDrawerClose"/>
    <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
      </div> -->
  </div>
</template>

<script>
import {
  branchListAllService,
  mergeListService,
  mergeItemService,
} from "@/api/branch";
import tree from "@/views/report/pc/components/configs/form/tree";
import mergeDrawer from "./modal/mergeDrawer.vue";
export default {
  components: { mergeDrawer },
  data() {
    return {
      viewLoading: false,
      loading: false,
      leftId: null,
      rightId: null,
      branchList: [
        {
          name: "111",
          id: 11,
        },
        {
          name: "222",
          id: 22,
        },
      ],
      fileType: "PC",
      fileTypeList: [
        {
          name: "电脑",
          value: "PC",
          isSelected: true,
        },
        {
          name: "移动端",
          value: "MOBILE",
          isSelected: false,
        },
        {
          name: "后端服务",
          value: "process",
          isSelected: false,
        },
        {
          name: "接口",
          value: "interface",
          isSelected: false,
        },
      ],
      classify: "increased",
      classifyList: [
        {
          name: "新增",
          value: "increased",
          isSelected: true,
        },
        {
          name: "缺少",
          value: "lack",
          isSelected: false,
        },
        {
          name: "差异",
          value: "diff",
          isSelected: false,
        },
        {
          name: "相同",
          value: "same",
          isSelected: false,
        },
      ],
      columns: [
        {
          title: "文件名",
          dataIndex: "name",
          key: "name",
          width: "30%",
        },
        {
          title: "日期",
          dataIndex: "updateTime",
          key: "updateTime",
          width: "30%",
        },
        {
          title: "提交人",
          dataIndex: "createBy",
          key: "createBy",
          width: "20%",
        },
        {
          title: "注释",
          dataIndex: "remark",
          key: "remark",
        },
      ],
      leftList: [
        // {
        //   queryId: 1,
        //   name: "页面测试",
        //   updateTime: "2023-03-07",
        //   createBy: "15862314726",
        //   remark: "测试",
        //   isSelected: false,
        // },
        // {
        //   queryId: 2,
        //   name: "页面测试2",
        //   updateTime: "2023-03-07",
        //   createBy: "15862314726",
        //   remark: "测试",
        //   isSelected: false,
        // },
      ],
      rightList: [],
      leftchooseId: "",
      leftchoose:{
        name:"",
        updateTime:"",
        type:"",
        subType:"",
        remark:"",
        createBy:"",
      },
      rightchooseId: "",
      rightchoose:{
        name:"",
        updateTime:"",
        type:"",
        subType:"",
        remark:"",
        createBy:"",
      },
      mergeDirection: "",
      mergeDrawerVisible: false,
      mergeDetail:{},
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      branchListAllService().then((res) => {
        this.branchList = res.dataList;
      });
    },
    initMergeList() {
      if (this.leftId && this.rightId && this.fileType && this.classify) {
        this.loading = true;
        let params = {
          leftId: this.leftId,
          rightId: this.rightId,
          fileType: this.fileType,
          classify: this.classify,
        };
        mergeListService(params).then((res) => {
          this.loading = false;
          this.leftList = res.data.leftList;
          this.leftList &&
            this.leftList.forEach((item) => {
              item.isSelected = false;
            });
          this.rightList = res.data.rightList;
          this.rightList &&
            this.rightList.forEach((item) => {
              item.isSelected = false;
            });
        });
      } else {
        this.leftchooseId = "";
        this.rightchooseId = "";
      }
    },
    mergeLeftItem() {
      this.mergeDirection = "rightToLeft";
      let params = {
        leftId: this.leftId,
        rightId: this.rightId,
        mergeDirection: this.mergeDirection,
        type: this.fileType,
        queryId: this.rightchooseId,
      };
      this.mergeItem(params);
    },
    mergeRightItem() {
      this.mergeDirection = "leftToRight";
      let params = {
        leftId: this.leftId,
        rightId: this.rightId,
        mergeDirection: this.mergeDirection,
        type: this.fileType,
        queryId: this.leftchooseId,
      };
      this.mergeItem(params);
    },
    mergeItem(params) {
      this.loading = true;
      mergeItemService(params).then((res) => {
        this.loading = false;
        if (res.code == 0) {
          this.$antdMessage.success("合并成功");
          this.initMergeList();
        }
      });
    },
    fileTypeClick(item) {
      this.fileTypeList.forEach((fItem) => {
        if (item.value == fItem.value) {
          fItem.isSelected = !item.isSelected;
          if (fItem.isSelected) {
            this.fileType = fItem.value;
            this.initMergeList();
          }
        } else {
          fItem.isSelected = false;
        }
      });
    },
    classifyClick(item) {
      this.classifyList.forEach((cItem) => {
        if (item.value == cItem.value) {
          cItem.isSelected = !item.isSelected;
          if (cItem.isSelected) {
            this.classify = cItem.value;
            this.initMergeList();
          }
        } else {
          cItem.isSelected = false;
        }
      });
    },
    leftRowClick(record, index) {
      this.leftList.forEach((lItem, index) => {
        if (lItem.queryId == record.queryId) {
          lItem.isSelected = !lItem.isSelected;
          this.$set(this.leftList, index, lItem);
          this.leftchooseId = record.queryId;
          this.leftchoose={
            name:lItem.name,
            updateTime:lItem.updateTime,
            type:lItem.type,
            subType:lItem.subType,
            remark:lItem.remark,
            createBy:lItem.createBy,
          };
        } else {
          lItem.isSelected = false;
          this.$set(this.leftList, index, lItem);
        }
      });
    },
    rightRowClick(record, index) {
      this.rightList.forEach((lItem, index) => {
        if (lItem.queryId == record.queryId) {
          lItem.isSelected = !lItem.isSelected;
          this.$set(this.rightList, index, lItem);
          this.rightchooseId = record.queryId;
          this.rightchoose={
            name:lItem.name,
            updateTime:lItem.updateTime,
            type:lItem.type,
            subType:lItem.subType,
            remark:lItem.remark,
            createBy:lItem.createBy,
          };
        } else {
          lItem.isSelected = false;
          this.$set(this.rightList, index, lItem);
        }
      });
    },
    renderTrBackground(record, index) {
      if (record.isSelected) {
        return {
          style: {
            "background-color": "#e6f7ff",
            color: "#1890ff",
          },
        }; // 返回到行样式
      } else {
        return {}; // 返回到行样式
      }
    },
    deleteMergeDetail() {
      this.$antdMessage.info("TODO");
    },
    toMergeDetail(){
      if(this.leftchooseId != this.rightchooseId){
        this.$antdMessage.info("页面必须相同才能进行合并操作");
        return;
      }
      if(this.fileType!='PC'&&this.fileType!='MOBILE'){
        this.$antdMessage.info("暂时只支持页面的详细合并");
        return;
      }
      this.mergeDetail={
        leftId: this.leftId,
        rightId: this.rightId,
        fileType: this.fileType,
        leftchooseId: this.leftchooseId,
        rightchooseId:this.rightchooseId,
        leftchoose:this.leftchoose,
        rightchoose:this.rightchoose,
      }
      this.$refs.mergeDetail.init(this.leftchooseId)
      this.mergeDrawerVisible = true
    },
    mergeDrawerClose(){
      let projectId = Number(this.$route.query.projectId);
      this.$store.dispatch("project/setProjectId", projectId);
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.setting-container {
  width: 100%;
  padding: 24px 0;

  .setting-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }

  .ant-row {
    margin-bottom: 20px;
  }

  .upload-btn {
    margin: 15px 0 0 15px;
  }
  .mtable-row {
    background-color: #000;
  }
  .merge-button {
    margin-top: 10px;
    padding: 0px 10px;
  }
}
</style>
  