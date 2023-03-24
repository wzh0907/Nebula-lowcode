<template>
    <div class="setting-container" v-loading="viewLoading"  >
      <div>

        <a-row class="setting-title">系统参数</a-row>


        <el-form :inline="true"  :model="searchForm" class="demo-form-inline">
                    <el-form-item  prop="term">
                        <el-input size="small" v-model="searchForm.term" placeholder="输入查询内容" :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  type="primary" size="small" @click="search">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="dialogVisible=true;chooseDataRow={}">新建参数</el-button>
                    </el-form-item>
        </el-form>

      </div>
      <el-table
        :data="jobData"
        style="width: 100%; ">
        <el-table-column
          prop="keyName"
          label="关键字"
          width="200"
          >
        </el-table-column>
        <el-table-column
          prop="sandbox"
          label="测试环境">
        </el-table-column>
        <el-table-column
          prop="prod"
          label="生产环境">
        </el-table-column>


        <el-table-column
          prop="address"
          label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <add-dialog :detailData="chooseDataRow" :dialog-visible.sync="dialogVisible" title="新增系统参数" @reload="init" />
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import {
    getSystemSettingListService,
    deleteSystemSettingService,
  } from "@/api/system-setting";

  export default {
    name: "systemSetting",
    data() {
      return {
        viewLoading: false,
        jobType:"0",
        dialogVisible:false,
        chooseDataRow:{},
        jobData: [],
        searchForm:{
            term:'',
        }
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
        getSystemSettingListService().then(res=>{
            if(res.code==0){
              this.jobData = res.dataList;
            }
        });
      },
      handleDelete(row){
        deleteSystemSettingService({id:row.id}).then(res=>{
          if(res.code==0){
             this.$message.success("删除成功");
             this.init();
          }
        });
      },

      handleClick(row){
        this.dialogVisible=true;
        const rowCopy = Object.assign({}, row)
        this.chooseDataRow = rowCopy;
      },


    search() {
      let param = {
        keyName: this.searchForm.term,
      };

      getSystemSettingListService(param).then(res=>{
            if(res.code==0){
              this.jobData = res.dataList;
            }
        });
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

} 

  </style>
  