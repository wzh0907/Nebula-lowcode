<template>
  <div v-loading="viewLoading" class="setting-container">
    <a-row class="setting-title">基本设置</a-row>
    <a-row type="flex" >
      <a-col :span="10" style="minWidth: 300px; maxWidth: 500px;">
        <a-form formLayout="vertical" ref="dataForm" label-width="100px" :model="dataForm">
          <a-form-item label="项目名称" prop="项目名称">
            <el-input v-model="dataForm.projectName" placeholder="项目名称" />
          </a-form-item>
<!--          <a-form-item label="运行模式" prop="运行模式">-->
<!--            <a-radio-group v-model="dataForm.runMode">-->
<!--              <a-radio value="RUN_MODE_PRODUCT">-->
<!--                生产模式-->
<!--              </a-radio>-->
<!--              <a-radio value="RUN_MODE_TEST">-->
<!--                测试模式-->
<!--              </a-radio>-->
<!--              <a-radio value="RUN_MODE_MOCK">-->
<!--                MOCK模式-->
<!--              </a-radio>-->
<!--            </a-radio-group>-->
<!--          </a-form-item>-->
          <a-form-item label="项目描述" prop="项目描述">
            <a-textarea placeholder="项目描述" v-model="dataForm.remark" rows="3" />
          </a-form-item>
        </a-form>
      </a-col>
      <a-col style="marginLeft: 120px">
        <a-form ref="dataForm" label-width="100px" :model="dataForm">
          <a-form-item label="项目图标" prop="项目图标">
            <a-avatar :src="dataForm.projectLogoUrl" :size="144" />
            <imgUpload @changeConfigValue="changeConfigValue" alt="logo">
              <template v-slot:content>
                <a-button class="upload-btn"><a-icon type="upload" />更换图标</a-button>
              </template>
            </imgUpload>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import imgUpload from "@/views/report/layout/report-config-basics/basics-config/img-upload.vue";
import { getProjectLogoService, updateLogoService } from "@/api/project.js";
import {getStorage, setStorage} from "@/util/storageUtil";
export default {
  components: { imgUpload },
  data() {
    return {
      viewLoading: false,
      dataForm: {
        projectName: "",
        remark: "",
        projectLogoUrl: "",
        projectLogo: "",
        runMode: "",
      },
    };
  },
  computed: {
    ...mapGetters(["projectId", "projectList"]),
  },
  created() {
    this.initLogo();
    this.initRunMode()
  },
  methods: {
    initRunMode() {
      this.dataForm.runMode = getStorage('runMode') || 'RUN_MODE_PRODUCT'
    },
    initLogo() {
      let param = {
        projectId: this.projectId,
      };
      getProjectLogoService(param).then((res) => {
        this.dataForm.projectName = res.data.projectName;
        this.dataForm.remark = res.data.remark;
        this.dataForm.projectLogoUrl = res.data.projectLogoUrl;
        this.dataForm.projectLogo = res.data.projectLogo;
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
      setStorage('runMode', this.dataForm.runMode)
      if (this.dataForm.projectLogoUrl) {
        this.getBase64(this.dataForm.projectLogoUrl, (data) => {
          // 将url图片转为了base64的data
          this.dataForm.projectLogo=data;
          this.saveLogo()
        });
      }else{
        this.saveLogo()
      }

    },
    saveLogo(){
        let params={
        id:this.projectId,
        projectName:this.dataForm.projectName,
        remark:this.dataForm.remark,
        projectLogoUrl:this.dataForm.projectLogoUrl,
        projectLogo:this.dataForm.projectLogo,
      }
      updateLogoService(params).then(res=>{
         this.$message.success("保存成功");
      })
    },

  },
};
</script>

<style lang="scss" scoped>
.setting-container {
  width: 100%;
  padding: 24px 0;

  .setting-title{
    margin-bottom: 12px;
    color: rgba(0,0,0,.85);
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }

  .ant-row{
    margin-bottom: 20px;
  }

  .upload-btn{
    margin: 15px 0 0 15px;
  }
}
</style>
