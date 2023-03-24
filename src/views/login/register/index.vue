<template>
  <el-dialog
    :title="title"
    width="450px"
    class="register-dialog"
    v-loading="listLoading"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-form ref="userInfo" :rules="rules" :model="userInfo">
    手机号注册：
        <el-form-item  prop="phoneNumber" >
            <el-input type="text" placeholder="请输入手机号" maxlength="11" v-model="userInfo.phoneNumber" />
        </el-form-item>
        <el-form-item  prop="password" >
            <el-input placeholder="输入密码" maxlength="20" show-password v-model="userInfo.password"/>
        </el-form-item>
        <el-form-item  prop="verifyCode" >
            <el-input type="number" placeholder="输入验证码："  maxlength="4"  oninput="if(value.length > 4) value=value.slice(0, 4)" v-model="userInfo.verifyCode" style="width:60%" />
            <el-button :type="userInfo.type" plain  @click="sendVerifyCode" :disabled="userInfo.disabled">
                {{userInfo.disabled?'再次发送'+userInfo.time:'发送验证码'}}
            </el-button>
        </el-form-item>
   
      
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { sendVerifyCodeService } from "@/api/verifyCode";
import { register } from "@/api/user";
export default {
  name: "addRole",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      listLoading: false,
      userInfo: {
        phoneNumber:"",
        password:"",
        verifyCode:""
      },
      rules: {
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
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
  created() {},
  mounted() {},
  methods: {
    dialogOpen() {
      this.userInfo.phoneNumber = "";
      this.userInfo.password = "";
      this.userInfo.verifyCode = "";
      this.userInfo.disabled = false;
      this.userInfo.type = "primary";
      this.$forceUpdate();
    },
    save() {
      this.$refs.userInfo.validate(async (valid) => {
        if (valid) {
          let params = {
            phoneNumber: this.userInfo.phoneNumber,
            password: this.userInfo.password,
            verifyCode: this.userInfo.verifyCode,
          };
          register(params).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: "注册成功",
                type: "success",
              });
              this.isShowDialog = false;
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
            }
          });
        }
      });
    },
    sendVerifyCode() {
      let params = {
        phoneNumber: this.userInfo.phoneNumber,
        type: 1, //注册
      };

      sendVerifyCodeService(params).then((res) => {
        this.userInfo.disabled = true;
        this.userInfo.type = "info";
        let that = this;
        that.userInfo.time = 60;
        let clearTime = setInterval(() => {
          if (that.userInfo.time <= 0) {
            clearInterval(clearTime);
            this.userInfo.disabled = false;
            this.userInfo.type = "primary";
            this.$forceUpdate();
          }
          that.userInfo.time--;
          this.$forceUpdate();
        }, 1000);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-button {
  height: 45px;
  font-size: 16px;
}
</style>
