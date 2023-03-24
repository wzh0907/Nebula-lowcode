<template>
  <div>
    <el-dialog
      title="项目续费"
      width="650px"
      append-to-body
      :visible.sync="isShowDialog"
      @open="dialogOpen"
    >
      <span
        >公司/组织的项目需要授权才能开通使用，请联系渠道代理商购买授权。把以下项目编号和二维码发送给渠道代理商开通授权</span
      >
      <el-row>
        <el-col :span="12" style="text-align: right">项目名称：</el-col>
        <el-col :span="12">{{ projectName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12" style="text-align: right">项目编号：</el-col>
        <el-col :span="12">{{ authKey }}</el-col>
      </el-row>

      <div class="auth-code">
           <img :src="miniqrcode" v-if="miniqrcode" width="200px"/>

        <!-- <div class="qrcode" ref="qrCodeUrl"></div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  name: "authProject",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    projectName: {
      type: String,
      default: "",
    },
    authKey: {
      type: String,
      default: "",
    },
    miniqrcode:{
       type: String,
      default: "",
    },
  },
  data() {
    return {
      isShowAuthDialog: false,
      authInfo: {
        projectName: "",
        authKey: "",
      },
      qrcode: {}, // 预览二维码
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
    console.log("miniqrcode",this.miniqrcode)
  },
  mounted() {},
  methods: {
    cancal() {
      this.isShowDialog = false;
     
    },
    initAuth() {
      var _this = this;
      setTimeout(function () {
        if (_this.$refs.qrCodeUrl) {
          _this.$refs.qrCodeUrl.innerHTML = "";
        }
        _this.qrcode = new QRCode(_this.$refs.qrCodeUrl, {
          text: _this.authKey,
          width: 250,
          height: 250,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
      }, 100);
    },
    dialogOpen() {
      this.initAuth();
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-code {
  margin: 20px auto;
  width: 200px;
}
</style>
