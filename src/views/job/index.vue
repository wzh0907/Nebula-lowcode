<template>
  <div class="job-container" v-loading="viewLoading">
    <div>
      <el-radio-group v-model="jobType" @change="init">
        <el-radio :label="'0'">全部</el-radio>
        <el-radio :label="'1'">每天</el-radio>
        <el-radio :label="'2'">每周</el-radio>
        <el-radio :label="'3'">每月</el-radio>
        <el-radio :label="'4'">高级</el-radio>
      </el-radio-group>
      <el-button style="margin-left: 190px" type="primary" size="small" @click="dialogVisible=true;chooseDataRow={}">新建任务</el-button>
<!--      <i class="iconfont iconjia job-add" @click="dialogVisible=true;chooseDataRow={}"/>-->
    </div>
    <el-table
      :data="jobData"
      style="width: 100%; margin-top: 24px">
      <el-table-column
        prop="date"
        label="执行时间"
        width="200"
        >
         <template slot-scope="scope" >
           <div style="display: flex;">
            <span v-if="scope.row.type==1" style="line-height: 36px;">每天</span>
            <span v-if="scope.row.type==3&&scope.row.jobDaily=='-1'" style="line-height: 36px;">最后一天</span>

           <div v-if="scope.row.type==2||(scope.row.type==3&&scope.row.jobDaily!='-1')" class="job-daily-div">
             <img src="@/assets/icon/jobday.svg"  />
            <span class="job-daily">{{scope.row.jobDailyStr}}</span>
           </div>
           <span style="font-size:26px;line-height:36px;font-weight:bold;margin-left:5px;">{{scope.row.jobTime}}</span>
           </div>


         </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="服务名称"
        width="180">
        <template slot-scope="scope">
          <el-link type="primary" v-for="process in scope.row.processVOList">{{process.processName}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="isEnable"
        label="开启/关闭"
        width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEnable" @change="changeEnable(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <add-dialog :detailData="chooseDataRow" :dialog-visible.sync="dialogVisible" title="计划任务" @reload="init" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getJobListService,
  deleteJobService,
  enableJobService,
} from "@/api/job";
export default {
  name: "job",
  data() {
    return {
      viewLoading: false,
      jobType:"0",
      dialogVisible:false,
      chooseDataRow:{},
      jobData: [],
       weekDay: [
        {
          label: "一",
          value: "1",
          chosen: false,
        },
        {
          label: "二",
          value: "2",
          chosen: false,
        },
        {
          label: "三",
          value: "3",
          chosen: false,
        },
        {
          label: "四",
          value: "4",
          chosen: false,
        },
        {
          label: "五",
          value: "5",
          chosen: false,
        },
        {
          label: "六",
          value: "6",
          chosen: false,
        },
        {
          label: "日",
          value: "7",
          chosen: false,
        },
      ],
      monthDay: [
        { name: "1", value: "1", chosen: false },
        { name: "2", value: "2", chosen: false },
        { name: "3", value: "3", chosen: false },
        { name: "4", value: "4", chosen: false },
        { name: "5", value: "5", chosen: false },
        { name: "6", value: "6", chosen: false },
        { name: "7", value: "7", chosen: false },
        { name: "8", value: "8", chosen: false },
        { name: "9", value: "9", chosen: false },
        { name: "10", value: "10", chosen: false },
        { name: "11", value: "11", chosen: false },
        { name: "12", value: "12", chosen: false },
        { name: "13", value: "13", chosen: false },
        { name: "14", value: "14", chosen: false },
        { name: "15", value: "15", chosen: false },
        { name: "16", value: "16", chosen: false },
        { name: "17", value: "17", chosen: false },
        { name: "18", value: "18", chosen: false },
        { name: "19", value: "19", chosen: false },
        { name: "20", value: "20", chosen: false },
        { name: "21", value: "21", chosen: false },
        { name: "22", value: "22", chosen: false },
        { name: "23", value: "23", chosen: false },
        { name: "24", value: "24", chosen: false },
        { name: "25", value: "25", chosen: false },
        { name: "26", value: "26", chosen: false },
        { name: "27", value: "27", chosen: false },
        { name: "28", value: "28", chosen: false },
        { name: "29", value: "29", chosen: false },
        { name: "30", value: "30", chosen: false },
        { name: "31", value: "31", chosen: false },
        { name: "最后一天", value: "-1", chosen: false },
      ],
    };
  },
  components: {
    'add-dialog': () => import('./module/add.vue')
  },
  computed: {
    ...mapGetters(["projectId", "projectList"]),
  },
  created() {
    this.projectType = this.$route.query.type;
    this.init();
  },
  methods: {
    init(){
      getJobListService({type:this.jobType}).then(res=>{
          if(res.code==0){
            this.jobData = res.dataList;
            this.jobData.forEach(jobItem=>{
              if(jobItem.type==2){

                 this.weekDay.forEach((item) => {

                  if(item.value==jobItem.jobDaily){
                    jobItem.jobDailyStr=item.label;
                  }
                });
              }else if(jobItem.type==3){
                this.monthDay.forEach((item) => {
                  if(item.value==jobItem.jobDaily){
                    jobItem.jobDailyStr=item.name;
                  }
                });
              }
            });
          }
      });
    },
    handleDelete(row){
      deleteJobService({jobId:row.jobId}).then(res=>{
        if(res.code==0){
           this.$message.success("删除成功");
           this.init();
        }
      });
    },
    handleClick(row){
      this.dialogVisible=true;
      this.chooseDataRow = row;
    },
    changeEnable(row){
      enableJobService({jobId:row.jobId}).then(res=>{
        if(res.code==0){
           this.$message.success("修改成功");
           this.init();
        }
      });
    }


  },
};
</script>

<style lang="scss" scoped>
.job-container{
  background-color: #fff;
  padding: 20px;
  margin-left: 16px;
  height: calc(100vh - 51px);
  overflow: auto;
}
.job-add{
  font-size: 22px;
  float: right;
  color:#0962ea;
  cursor: pointer;
}
.job-daily-div{
  position: relative;
  display: inline-block;
}
.job-daily{
  position: absolute;
    left: 11px;
    top: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #FC9400;
}
</style>
