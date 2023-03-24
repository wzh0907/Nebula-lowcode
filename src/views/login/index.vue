<template>
  <div class="login-container">
    <div class="left-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >

        <div class="title-container">
          欢迎登录
          <p style="font-size: 40px;display: inline;">星云座</p>
        </div>

        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="手机号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
            prefix-icon="iconfont icontel"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            prefix-icon="iconfont iconpassword"
            @keyup.enter.native="handleLogin"
          />

        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >登录</el-button>
        <div style="width:100%;text-align:center">
          <!-- <el-link @click="dialogVisible=true" targ>注册</el-link> -->

        </div>

      

        <!-- <div class="tips">
            <span style="margin-right:20px;">username: admin</span>
            <span> password: any</span>
          </div> -->

      </el-form>
    </div>
    <div class="right-container" />
    <registerDialog  title="注册" :dialog-visible.sync="dialogVisible"></registerDialog>
  </div>
</template>

<script>
  import {
    validUsername
  } from '@/utils/validate'
  import registerDialog from "./register/index.vue"

  export default {
    name: 'Login',
    components:{registerDialog},
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('请输入账号'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 1) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      return {
        dialogVisible:false,
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            // this.$router.push({ path: this.redirect || '/' })
            this.loading = true
            const params = {
              phoneNumber: this.loginForm.username,
              password: this.loginForm.password,
              source: 'PAAS'
            }
            this.$store.dispatch('user/login', params).then(() => {
              this.$router.push({
                path: this.redirect || '/'
              })
              this.loading = false
              this.$store.dispatch('project/getProjectList')
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    display: flex;

    .el-input {
      display: inline-block;
      height: 47px;
      width: 100%;

      input {
        // background: rgba(234, 234, 234, 0.5);
        border: 0;
        border-bottom: 1px solid rgba(213, 213, 213, 1);
        border-radius: 0;
        -webkit-appearance: none;
        // padding: 12px 6px 12px 15px;
        color: #000;
        height: 50px;
        // caret-color: $cursor;
        font-size: 16px;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px white inset !important;
          // -webkit-text-fill-color: white !important;
        }
      }
    }

    .el-form-item {

      // color: #454545;
    }

   
  }

  .left-container {
    width: 50%;
    // height: 100%;
  }

  .right-container {
    background-image: url(../../assets/images/bg-login.png);
    background-size: 550px;
    background-repeat: no-repeat;
    background-position-x: 0px;
    background-position-y: 92px;
    width: 50%;
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

 .el-button {
      // background-color: red;
      background-color: #0962EA;
      height: 45px;
      margin-top: 20px;
      font-size: 16px;
    }
  .login-container {
    min-height: 100%;
    width: 100%;
    overflow: hidden;
    background: #fff;

    .login-form {
      position: relative;
      width: 500px;
      max-width: 100%;
      padding: 92px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;
      font-size: 26px;
      color: rgba(51, 51, 51, 1);
      margin: 0px auto 40px auto;
      text-align: left;
      font-weight: bold;
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    /deep/.el-form-item__content {
      border: 1px solid #fff;
    }
  }
</style>
