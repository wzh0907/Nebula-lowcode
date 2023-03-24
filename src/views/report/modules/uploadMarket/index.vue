<template>
  <div class="uploadComment">
    <el-dialog
      :title="title"
      width="620px"
      :before-close="handleClose"
      :visible.sync="isShowDialog"
       @open="dialogOpen"
    >
        <el-form
            :rules="rules"
            ref="uploadDialogForm"
            label-width="120px"
            :model="uploadDialogForm">
                <el-col>
                    <el-form-item label='应用名称'  prop="appName">
                        <el-input
                            clearable
                            size="small"
                            @input="change($event)"
                            v-model="uploadDialogForm.appName"
                            placeholder="请输入应用名称"/>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label='应用类型'>
                        <ul class="businessLabelList">
                          <li v-for="(item,index) in businessType" :key="index"  
                              :class="{'checkedBtnStyle':item.checked}" 
                              @click="selectLabel(index)">
                              <span v-if="item.dictCode !== 'all'">{{item.dictName}}</span>
                          </li>
                        </ul>
                    </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label='标签'>
                      <el-tag
                        :key="tag"
                        v-for="tag in dynamicTags"
                        closable
                        :disable-transitions="false"
                        @close="handleTagClose(tag)">
                        {{tag}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="inputTagVisible"
                        v-model="businessTag"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                  </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label='应用介绍' prop="appDesc">
                        <el-input
                            clearable
                            size="small"
                            type="textarea"
                            :rows="2"
                            v-model="uploadDialogForm.appDesc"
                            placeholder="请输入应用介绍"/>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label='应用版本' prop="appVersion">
                        <el-input
                            clearable
                            size="small"
                            v-model="uploadDialogForm.appVersion"
                            placeholder="请输入应用版本"/>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label='版本介绍' prop="appVersionDesc">
                        <el-input
                            clearable
                            size="small"
                            type="textarea"
                            :rows="2"
                            v-model="uploadDialogForm.appVersionDesc"
                            placeholder="请输入版本介绍"/>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label='封面' prop="appLogo">
                      <a-upload
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        accept="image/*"
                        :headers="headers"
                        :action="action"
                        @change="handleChangeImg"
                        :before-upload="beforeImgUpload"
                      >
                      <img v-if="uploadDialogForm.appLogo" style="width: 100%" :src="uploadDialogForm.appLogo" alt="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </a-upload>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label='图片'>
                      <el-upload
                         ref="my-upload"
                        :action="listAction"
                        accept="image/*"
                        :headers="headers"
                        :on-success="handleAvatarSuccess"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :before-upload="beforeImgUpload"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                      </el-upload>
                    </el-form-item>
                </el-col>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="isLoading" @click="save">{{btnText}}</el-button>
        <el-button @click="close">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogImgVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { uploadMktAddAPP, getMktAppType } from "@/api/componentApply";

export default {
  name: "uploadComment",
  props: {
    title: String,
    // projectId:Number | String,
    projectObj:{
      type: Object,
      default: ()=> {},
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      uploadDialogForm:{
        appName:'',
        appLogo:''
      },
      isLoading:false,
      btnText:'确定',
      cpntDescPic:[],// 图片集
      businessType:[],
      dynamicTags: [],
      cpntType:[], // 标签
      businessTag:'',
      inputTagVisible:false,
      dialogImageUrl:'',
      dialogImgVisible:false,
      rules: {
            appName: [
                { required: true, message: '请输入应用名称', trigger: 'blur' }
            ]
      }
    };
  },
  computed: {
    ...mapState({
      token: (state) => state.user.token,
      userName: (state) => state.user.phoneNumber,
      merchantId: (state) => state.user.merchantId,
      projectId: (state) => state.project.projectId,
    }),
    headers() {
      return {
        "X-AUTH-TOKEN": this.token,
        "X-AUTH-KEY": this.userName,
      };
    },
    action() {
      return `${process.env.VUE_APP_BASE_API}/file/v2/upload?type=bgImg&merchantId=`+this.merchantId+`&projectId=`+this.projectId;
    },
    listAction() {
      return `${process.env.VUE_APP_BASE_API}/file/v2/upload?type=bgImg&merchantId=`+this.merchantId+`&projectId=`+this.projectId;
    },
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  watch: {},
  created() {
  },
  methods: {
    dialogOpen() {
      this.getCommentMktCpntType()
    },
    // 获取业务分类
    getCommentMktCpntType() {
      getMktAppType().then(res => {
        this.businessType = res.dataList
      })
    },
    change() {
      this.$forceUpdate() // 偶尔输入不了
    },
    selectLabel(i) {
       this.$set(this.businessType[i],'checked',!this.businessType[i].checked)
       this.filterData(this.businessType)
    },
    filterData(data) {
      this.cpntType = []
      data.forEach(item => {
          if (item.checked) {
            this.cpntType.push(item.dictCode)
          }
      })
    },
    // 添加标签
      handleTagClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      showInput() {
        this.inputTagVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let businessTag = this.businessTag;
        if (businessTag) {
          this.dynamicTags.push(businessTag);
        }
        this.inputTagVisible = false;
        this.businessTag = '';
      },
    handleClose() {
      this.$refs['uploadDialogForm'].resetFields()
      this.businessType.forEach(item => {
        item.checked = false
      })
      this.$refs['my-upload'].clearFiles();
      this.isShowDialog = false;
    },
    handleChangeImg(info) {
      if (info.file.status === 'done') {
         this.uploadDialogForm.appLogo =  info.file.response.data.url;
      }
    },
    beforeImgUpload(file) {
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isLt3M) {
            this.$message.error('上传图片大小不能超过 3MB!');
        }
        return isLt3M;
    },
    handleRemove(file, fileList) {
      this.cpntDescPic.forEach((item,index) => {
        if (item.fileId === file.response.data.fileId) {
          this.cpntDescPic.splice(index,1)
        }
      })
    },
    handleAvatarSuccess(res, fileList) {
      this.cpntDescPic.push(res.data.url);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImgVisible = true;
    },
    save() {
     this.$refs.uploadDialogForm.validate(async valid => {
        if (valid) {
          let obj = {
            ...this.uploadDialogForm,
            appTag:this.dynamicTags.toString(),
            appType:this.cpntType.toString(),
            appDescPic:this.cpntDescPic.toString(),
            projectId:this.projectObj.id,
            projectType:this.projectObj.type
          }
          this.isLoading = true
          this.btnText = '上传中'
          const loading = this.$loading({
            lock: true,
            text: '上传中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          uploadMktAddAPP(obj).then((res) => {
              if (res.code === 0) {
                loading.close();
                this.isLoading = false
                this.$message({
                  message: '应用上传成功',
                  type: 'success'
                });
                this.$refs['uploadDialogForm'].resetFields()
                this.businessType=[]
                this.$refs['my-upload'].clearFiles();
                this.isShowDialog = false;
                this.btnText = '确定'
              } else {
                this.isLoading = false
                this.btnText = '确定'
                loading.close();
                this.$message.error(res.message);
              }
            }).catch(err => {
              loading.close();
            });
        }
      });
    },
    close() {
      this.$refs['uploadDialogForm'].resetFields()
      this.businessType.forEach(item => {
        item.checked = false
      })
      this.$refs['my-upload'].clearFiles();
      this.isShowDialog = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.uploadComment{
  .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
  }
  /deep/.el-dialog{
    margin-top: 62px !important;
  }
  /deep/.el-form-item{
    margin-bottom: 20px;
  }
  .businessLabelList{
    display: flex;
    align-items: center;
    li{
      padding-right: 15px;
      cursor: pointer;
    }
    .checkedBtnStyle{
      color: #429cfd;
    }
  }
  .labelTagAll{
    display: flex;
    .businessLabelTag{
      width: 100%;
      flex:1;
      .hasLabel{
        float: left;
        background: #e9f5fe;
        color: #429cfd;
        border-radius: 4px;
        margin-right: 10px;
        height: 25px;
        line-height: 25px;
        padding: 0 10px;
        margin-top: 8px;
        cursor: pointer;
        .yl-title{
          height: 24px;
          line-height: 24px;
        }
      }
    }
    .newTag{
      padding: 0 10px;
      border-radius: 10px;
      height: 25px;
      line-height: 25px;
      border: 1px solid #e6e0e0;
      cursor: pointer;
      margin-top: 8px;
      &:hover{
        background: #429cfd;
        color: #fff;
        // border:none
      }
    }
  }
}

</style>
