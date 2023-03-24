<template>
  <div class="">
    <div
      style="
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        position: relative;
        flex-wrap: nowrap;
      "
    >
      <img :src="miniqrcode" v-if="miniqrcode" :width="width" />
      <div class="preview-h5">
        <div class="qrcode" ref="qrCodeUrl"></div>
        <div class="preview_url">{{ previewUrl }}</div>
      </div>
    </div>
    <div
      style="
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
        margin-top: 10px;
      "
    >
      <div :width="width">微信端</div>
      <div>H5端</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import QRCode from "qrcodejs2";
import { getQrcodeService, getSceneService } from "@/api/qrcode";
export default {
  name: "preview",
  props: {
    env: {
      type: String,
      default: "dev",
    },
    projectId: {
      type: Number,
      default: 0,
    },
    width: {
      type: String,
      default: "300px",
    },
    reportId: {
      type: String,
    },
  },
  data() {
    return {
      uploadDialogForm: {
        appName: "",
        appLogo: "",
      },
      previewUrl: "",
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
    }),
  },
  watch: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      let params = {
        projectId: this.projectId,
        env: this.env,
      };
      if (this.reportId) {
        params.reportId = this.reportId;
      }
      getQrcodeService(params).then((res) => {
        if (res.code == 0) {
          this.miniqrcode = res.data.qrCode;
        }
      });
      getSceneService(params).then((res) => {
        if (res.code == 0) {
          this.previewUrl = "" + res.data.scene;
          var _this = this;
          setTimeout(function () {
            console.log("dialogOpen", _this.$refs.qrCodeUrl);
            if (_this.$refs.qrCodeUrl) {
              _this.$refs.qrCodeUrl.innerHTML = "";
            }
            _this.qrcode = new QRCode(_this.$refs.qrCodeUrl, {

              text: _this.previewUrl,
              width: 250,
              height: 250,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H,
            });
          }, 100);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.preview-h5 {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
//.uploadComment {
//  position: relative;
//  .el-tag {
//    margin-right: 10px;
//  }
//  .button-new-tag {
//    margin-right: 10px;
//    height: 32px;
//    line-height: 30px;
//    padding-top: 0;
//    padding-bottom: 0;
//  }
//  .input-new-tag {
//    width: 90px;
//    margin-right: 10px;
//    vertical-align: bottom;
//  }
//  /deep/.el-dialog {
//    margin-top: 62px !important;
//  }
//  /deep/.el-form-item {
//    margin-bottom: 20px;
//  }
//  .businessLabelList {
//    display: flex;
//    align-items: center;
//    li {
//      padding-right: 15px;
//      cursor: pointer;
//    }
//    .checkedBtnStyle {
//      color: #429cfd;
//    }
//  }
//  .labelTagAll {
//    display: flex;
//    .businessLabelTag {
//      width: 100%;
//      flex: 1;
//      .hasLabel {
//        float: left;
//        background: #e9f5fe;
//        color: #429cfd;
//        border-radius: 4px;
//        margin-right: 10px;
//        height: 25px;
//        line-height: 25px;
//        padding: 0 10px;
//        margin-top: 8px;
//        cursor: pointer;
//        .yl-title {
//          height: 24px;
//          line-height: 24px;
//        }
//      }
//    }
//    .newTag {
//      padding: 0 10px;
//      border-radius: 10px;
//      height: 25px;
//      line-height: 25px;
//      border: 1px solid #e6e0e0;
//      cursor: pointer;
//      margin-top: 8px;
//      &:hover {
//        background: #429cfd;
//        color: #fff;
//        // border:none
//      }
//    }
//  }
//}
</style>
