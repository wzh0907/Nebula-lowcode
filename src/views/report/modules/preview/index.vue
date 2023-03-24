<template>
  <div class="uploadComment">
    <el-dialog
      :title="title"
      width="800px"
      append-to-body
      :before-close="handleClose"
      :visible.sync="isShowDialog"
      @open="dialogOpen"
    >
<!--      <div class="preview-div">-->
<!--        <div>-->
<!--          <i-->
<!--            class="iconfont icondrgs26"-->
<!--            style="font-size: 200px; cursor: pointer"-->
<!--            @click="toPcDoor"-->
<!--          />-->
<!--          <div class="preview-in">-->
<!--            <el-link type="primary" @click="toPcDoor">点击进入</el-link>-->
<!--          </div>-->

<!--          <div-->
<!--            style="-->
<!--              text-align: center;-->
<!--              font-size: 24px;-->
<!--              font-weight: bold;-->
<!--              margin-top: 10px;-->
<!--            "-->
<!--            width="300px"-->
<!--          >-->
<!--            PC端-->
<!--          </div>-->
<!--        </div>-->
<!--        <previewContent env="dev" :projectId="projectId"></previewContent>-->
<!--      </div>-->
      <previewContent env="dev" :projectId="projectId"></previewContent>

      <span slot="footer" class="dialog-footer" style="padding: 0px"> </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogImgVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import QRCode from "qrcodejs2";
import { getQrcodeService } from "@/api/qrcode";
import previewContent from "./preview-content.vue";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "preview",
  props: {
    title: String,
    // projectId:Number | String,
    previewUrl: String,
    projectName: String,
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    previewContent,
  },
  data() {
    return {
      uploadDialogForm: {
        appName: "",
        appLogo: "",
      },
      isLoading: false,
      btnText: "确定",
      cpntDescPic: [], // 图片集
      businessType: [],
      dynamicTags: [],
      cpntType: [], // 标签
      businessTag: "",
      inputTagVisible: false,
      dialogImageUrl: "",
      dialogImgVisible: false,
      miniqrcode: "",
      imgQcode: "",
      qrcode: {}, // 预览二维码
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
      return (
        `${process.env.VUE_APP_BASE_API}/file/v2/upload?type=bgImg&merchantId=` +
        this.merchantId +
        `&projectId=` +
        this.projectId
      );
    },
    listAction() {
      return (
        `${process.env.VUE_APP_BASE_API}/file/v2/upload?type=bgImg&merchantId=` +
        this.merchantId +
        `&projectId=` +
        this.projectId
      );
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
  created() {},
  methods: {
    dialogOpen() {
      // getQrcodeService().then(res=>{
      //   if(res.code==0){
      //     this.miniqrcode = res.data.qrCode;
      //   }
      // });
      // var _this = this;
      // setTimeout(function(){
      //   console.log("dialogOpen",_this.$refs.qrCodeUrl);
      //       if(_this.$refs.qrCodeUrl){
      //         _this.$refs.qrCodeUrl.innerHTML = ''
      //       }
      //       _this.qrcode = new QRCode(_this.$refs.qrCodeUrl, {
      //         text: _this.previewUrl,
      //         width: 250,
      //         height: 250,
      //         colorDark: '#000000',
      //         colorLight: '#ffffff',
      //         correctLevel: QRCode.CorrectLevel.H
      //   })
      // },100);
    },
    // 获取业务分类
    getCommentMktCpntType() {
      getMktAppType().then((res) => {
        this.businessType = res.dataList;
      });
    },
    change() {
      this.$forceUpdate(); // 偶尔输入不了
    },
    selectLabel(i) {
      this.$set(this.businessType[i], "checked", !this.businessType[i].checked);
      this.filterData(this.businessType);
    },
    filterData(data) {
      this.cpntType = [];
      data.forEach((item) => {
        if (item.checked) {
          this.cpntType.push(item.dictCode);
        }
      });
    },
    // 添加标签
    handleTagClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputTagVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let businessTag = this.businessTag;
      if (businessTag) {
        this.dynamicTags.push(businessTag);
      }
      this.inputTagVisible = false;
      this.businessTag = "";
    },
    handleClose() {
      this.isShowDialog = false;
    },
    handleChangeImg(info) {
      if (info.file.status === "done") {
        this.uploadDialogForm.appLogo = info.file.response.data.url;
      }
    },
    beforeImgUpload(file) {
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
      }
      return isLt3M;
    },
    handleRemove(file, fileList) {
      this.cpntDescPic.forEach((item, index) => {
        if (item.fileId === file.response.data.fileId) {
          this.cpntDescPic.splice(index, 1);
        }
      });
    },
    handleAvatarSuccess(res, fileList) {
      this.cpntDescPic.push(res.data.url);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImgVisible = true;
    },
    save() {},
    close() {
      this.isShowDialog = false;
    },
    toPcDoor() {
      const phoneNumber = getStorage("phoneNumber");
      const username = getStorage("username");
      const token = getStorage("token");

      // window.open(
      //   "https://pc.dipaas.com/#/authPage?projectId=" +
      //     // "http://localhost:8889/#/authPage?projectId=" +
      //     this.projectId +
      //     "&merchantId=" +
      //     this.merchantId +
      //     "&phoneNumber=" +
      //     phoneNumber +
      //     "&username=" +
      //     username +
      //     "&token=" +
      //     token +
      //     "&projectName=" +
      //     this.projectName +
      //     "&type=viewLook",
      //   "_blank"
      // );

     
    },
  },
};
</script>

<style lang="scss" scoped>
.uploadComment {
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
  /deep/.el-dialog {
    margin-top: 62px !important;
  }
  /deep/.el-form-item {
    margin-bottom: 20px;
  }
  .businessLabelList {
    display: flex;
    align-items: center;
    li {
      padding-right: 15px;
      cursor: pointer;
    }
    .checkedBtnStyle {
      color: #429cfd;
    }
  }
  .labelTagAll {
    display: flex;
    .businessLabelTag {
      width: 100%;
      flex: 1;
      .hasLabel {
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
        .yl-title {
          height: 24px;
          line-height: 24px;
        }
      }
    }
    .newTag {
      padding: 0 10px;
      border-radius: 10px;
      height: 25px;
      line-height: 25px;
      border: 1px solid #e6e0e0;
      cursor: pointer;
      margin-top: 8px;
      &:hover {
        background: #429cfd;
        color: #fff;
        // border:none
      }
    }
  }
}

.preview-div {
  display: flex;
  justify-content: space-around;
  position: relative;
}
.preview-in {
  position: absolute;
  top: 260px;
  width: 200px;
  text-align: center;
}
</style>
