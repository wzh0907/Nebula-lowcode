<template>
  <div v-loading="viewLoading" class="release-container">
    <el-steps :active="steps" align-center class="step">
      <el-step title="执行器安装" description="下载执行器到服务器，并解压缩，启动执行器"></el-step>
      <el-step title="项目部署" description="输入执行器地址，部署项目到执行器。"></el-step>
      <el-step title="参数配置" description="配置本地生产环境的连接参数"></el-step>
    </el-steps>
    <div v-if="steps==0" style="width: 60%;margin: auto;">
        <el-row >
          <el-col :span="24" style="text-align:center">请根据服务器类型选择安装方式<br> <span style="font-size:12px;color: #777;">已完成执行器安装直接进入<el-link type="primary" @click="steps++">下一步></el-link></span></el-col>
           <el-col :span="12" style="text-align:center;padding-right:40px;border-right:2px dashed #0962ea">
            <el-row>
              <img src="@/assets/images/window.svg" width="80px">
            </el-row>
            <el-row>
              <h2> Window</h2>
            </el-row>
            <el-row>
              <el-col :span="8" class="release_step">
                步骤一
              </el-col>
              <el-col :span="16" style="text-align: left;">
                执行器下载<br>
                <el-link type="primary" target="_blank" href="https://pan.baidu.com/s/10clPbT3nFGrCxEvMpKtnxg">点击下载</el-link> <br/>
                提取码：mn8x
              </el-col>
            </el-row>

              <el-row class="distance_top">
              <el-col :span="8" class="release_step">
                步骤二
              </el-col>
              <el-col :span="16"  style="text-align: left;">
                选中安装包，右键解压缩到安装目录
                <img src="@/assets/images/win_down_1.svg" class="distance_top" style="max-width:100%">
                <img src="@/assets/images/win_down_2.svg" class="distance_top" style="max-width:100%">
              </el-col>
            </el-row>
              <el-row class="distance_top">
              <el-col :span="8" class="release_step">
                步骤三
              </el-col>
              <el-col :span="16" style="text-align: left;">
                双击“双击我启动start.bat”文件启动执行器，启动窗口如下图表示执行器启动成功，完成执行器安装
                <img src="@/assets/images/win_down_3.png" class="distance_top" width="100%">
              </el-col>
            </el-row>
         </el-col>
          <el-col :span="12" style="text-align:center;">
            <el-row>
              <img src="@/assets/images/linux.svg" width="80px">
            </el-row>
            <el-row>
              <h2>Linux</h2>
            </el-row>
            <el-row>
              <el-col :span="7" class="release_step">
                步骤一
              </el-col>
              <el-col :span="16" style="text-align: left;">
                执行器下载<br>
                <el-link type="primary" target="_blank" href="https://pan.baidu.com/s/1I9Kte-bes_ygdi6HyV3eJg">点击下载</el-link> <br/>
                提取码：jwr3
              </el-col>
            </el-row>

              <el-row class="distance_top">
              <el-col :span="7" class="release_step">
                步骤二
              </el-col>
              <el-col :span="16" style="text-align: left;">
                拷贝安装文件到服务器目录，并输入解压缩命令解压安装文件<br/>
                解压缩命令：tar -xzvf  agent.tar.gz
                <img src="@/assets/images/linux_down_1.png" class="distance_top"  width="100%">
              </el-col>
            </el-row>
              <el-row class="distance_top">
              <el-col :span="7" class="release_step">
                步骤三
              </el-col>
              <el-col :span="16" style="text-align: left;">
                进入angnt命令，并执行./start.sh命令启动执行器，启动窗口如下图表示执行器启动成功，完成执行器安装
                <img src="@/assets/images/linux_down_2.png" class="distance_top"  width="100%">
              </el-col>
            </el-row>
          </el-col>

        </el-row>
    </div>
    <div v-if="steps==1">
    <el-row class="content" style="text-align:center;">
      执行器地址:<el-input v-model="exectorUrl" style="width:200px;" placeholder="执行器地址"/><el-button type="primary" style="margin-left:20px" @click="syncData">部署项目</el-button>

    </el-row>
    </div>
    <div v-if="steps==2">
      <el-row class="content" >
        <el-col :span="24">
          <dbConfig :exectorUrl="exectorUrl"/>
           <connect :exectorUrl="exectorUrl"/>
        </el-col>
      </el-row>
    </div>
    <div style="text-align: center;">
      <el-button style="margin-top: 12px;" @click="last" v-if="steps>0">上一步</el-button>
      <el-button style="margin-top: 12px;" type="primary" @click="next" v-if="steps<2">下一步</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from "vuex";
import dbConfig from "./dbconfig"
import connect from "./connect"
import {getProjectKeyService} from '@/api/project'
export default {
  components: {dbConfig,connect},
  data() {
    return {
      steps:0,
      menuActive:1,
      projectKey:"",
      exectorUrl:"",
      viewLoading:false,
    };
  },
  computed: {
    ...mapGetters(["projectId"]),
  },
  created() {
    this.projectType = this.$route.query.type;
    this.getProjectInfo();
  },
  methods: {
    handleSelect(index, indexPath) {
      this.menuActive = index;
      console.log("handle", index, indexPath,this.menuActive);
    },
    getProjectInfo(){
      getProjectKeyService({projectId:this.projectId}).then(res=>{
        this.projectKey = res.data.projectKey;
      });
    },
    last(){
      this.steps--
    },
    next(){
      this.steps++;
    },
    syncData(){
       if(this.exectorUrl){
          axios.get(
            this.exectorUrl+"/sync/v1/config?appKey="+this.projectKey
          )
          .then(function(res){
             console.log(e);
          })
        }

    }
  },
};
</script>
<style lang="scss" scoped>
.release-container{
  height: calc(100vh - 50px);
  background: #fff;
  margin-left: 16px;
  overflow-y: auto;
  /deep/.el-step__head.is-finish{
  color:#037AFE;
  border-color: #037AFE;
}
/deep/.el-step__title.is-finish{
    color:#037AFE;
}
/deep/.el-step__description.is-finish{
    color:#037AFE;
}
/deep/.el-step__head.is-wait{
  color:#999999;
  border-color: #999999;
}
/deep/.el-step__title.is-wait{
   color:#999999;
}
/deep/.el-step__description.is-wait{
  color:#999999;
}
}
.step{
  margin:20px 0;
}
.distance_top{
  margin-top:10px;
}
.release_step{
  font-weight: bold;
}

</style>


