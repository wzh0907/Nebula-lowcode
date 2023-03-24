<template>
  <div v-loading="viewLoading" class="setting-container">
    <el-form ref="dataForm" label-width="100px" :model="dataForm">
      <el-form-item label="组织数据库" prop="">
        <el-select v-model="dataForm.dbConfigId">
          <el-option :label="dataDb.name" :value="dataDb.businessId" v-for="dataDb in dataDbList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门信息" prop="部门信息">
        <el-input v-model="dataForm.deptSql" type="textarea" placeholder="部门信息" />
      </el-form-item>
      <el-form-item label="员工信息" prop="员工信息">
        <el-input v-model="dataForm.userSql" type="textarea" placeholder="员工信息" />
      </el-form-item>
      <el-form-item label="职位信息" prop="职位信息">
        <el-input v-model="dataForm.jobSql" type="textarea" placeholder="职位信息" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import imgUpload from "@/views/report/layout/report-config-basics/basics-config/img-upload.vue";
import { getProjectLogoService, updateLogoService } from "@/api/project.js";

import {
  getDbSrclist,
} from "@/api/database-command/index.js";
export default {
  components: { imgUpload },
  data() {
    return {
      viewLoading: false,
      dataForm: {
        dbConfigId: "",
        deptSql: "",
        userSql: "",
        jobSql: "",
      },
      dataDbList:[],
    };
  },
  computed: {
    ...mapGetters(["projectId", "projectList"]),
  },
  created() {
    this.queryDbSrclist();
  },
  methods: {
    queryDbSrclist() {
      this.dataDbList = [];
      getDbSrclist().then((res) => {
        const dataList = res.dataList || [];
        dataList.forEach((item) => {
          // if (item.dbType === 'SQLSERVER' || item.type === 'connect') return false
          if (item.type === "connect") return false;
          
          this.dataDbList.push({
            name: item.dataSourceName,
            businessId: item.businessId,
            dbConfigId: item.businessId,
            dataType: "database",
            
          });
        });
        
      });
    },
    changeConfigValue(configOptions, configKey, value) {
      this.dataForm.projectLogoUrl = value;
    },
    getBase64(url, callback) {
      var Img = new Image(),
        dataURL = "";
      Img.src = url + "?v=" + Math.random();
      Img.setAttribute("crossOrigin", "Anonymous");
      Img.onload = function () {
        var canvas = document.createElement("canvas"),
          width = Img.width,
          height = Img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img, 0, 0, width, height);
        dataURL = canvas.toDataURL("image/jpeg");
        callback ? callback(dataURL) : null;
      };
    },
    save() {
      if (this.dataForm.projectLogoUrl) {
      }else{
      }
      
    },
    saveLogo(){
        let params={
       
      }
      // updateLogoService(params).then(res=>{
      //    this.$message.success("保存成功");
      // })
    },
  
  },
};
</script>

<style lang="scss" scoped>
.setting-container {
  width: 90%;
  padding:20px;
  margin: auto;
}
.dialog-footer{
    text-align: center;
}
</style>
