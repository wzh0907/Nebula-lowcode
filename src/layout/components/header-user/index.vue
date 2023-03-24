<template>
  <el-dropdown size="small" placement="bottom" class="avatar-container">
    <div class="avatar-wrapper">
      <img :src="avatar" class="avatar">
      <div class="userName">
        <span>{{ username || ' ' }}</span>
      </div>
      <i class="el-icon-caret-bottom" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logout">
        <i class="fas fa-power-off u-mr-5" />
        退出
      </el-dropdown-item>
      <el-dropdown-item @click.native="guidance">
        新手引导
      </el-dropdown-item>
    </el-dropdown-menu>
   
  </el-dropdown>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import avatar from './pic-head.png'
import config from '@/utils/configUrl'
import { EventBus } from "@/util/event-bus.js";
// import { getStorage } from '@/utils/storage'

export default {
  data() {
    return {
      avatar,
      showGuidance:false,
      // username: ''
    }
  },
  computed: {
    ...mapState({
        username: state => state.user.username
    })
    // ...mapGetters(['username'])
  },
  created() {
    // console.log(this.username)
    // getStorage('username').then(res => {
    //     this.username = res
    // })
  },
  methods: {
    ...mapActions(['logout']),
    /**
     * @description 登出
     */
    logOff() {
      this.logout({
        vm: this
      })
    },
    guidance(){
      EventBus.$emit('onShowGuide');
    },
    async logout() {
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      // window.location.href = config.host
      try {
        await this.$store.dispatch('user/logout')
      } catch {
      } finally {
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    }
  }
}
</script>
<style lang="scss">
.avatar-container {
  position: absolute;
  right: 5px;top: 0px;
  bottom: 0px;
  line-height: 50px;
  // color: #fff;
  .avatar-wrapper {
    height: 100%;
    line-height: 50px;
    // @extend %unable-select;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    user-select: none;
    cursor: pointer;
  }
  .avatar {
    height: 25px;
    width: 25px;
  }
  .userName {
    margin: 0 10px;
  }
}
</style>
