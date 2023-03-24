<template>
  <!-- <el-select v-model="chosenMerchantId" @change="merchantChange" class="merchant-select">
      <el-option  v-for="item in merchantList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>-->
  <el-dropdown size="small" placement="bottom" class="merchant-container" @command="merchantChoose">
    <div class="avatar-wrapper">
      <div class="userName">
        <span>{{ merchantName || ' ' }}</span>
      </div>
      <i class="el-icon-caret-bottom" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in merchantList" :command="item.id">{{item.name}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from "vuex";
import { getMerchantList, merchantChoose } from "@/api/merchant";
// import { getStorage } from '@/utils/storage'

export default {
  data() {
    return {
      merchantList: [],
      merchantName: "",
      chosenMerchantId: 0,
    };
  },
  computed: {
    ...mapGetters(["merchantId"]),
  },

  created() {
    // console.log(this.username)
    // getStorage('username').then(res => {
    //     this.username = res
    // })
    this.init();
  },
  methods: {
    init() {
      this.chosenMerchantId = parseInt(this.merchantId);
      getMerchantList().then((res) => {
        if (res.code == 0) {
          this.merchantList = res.dataList;
          this.merchantList.forEach((item) => {
            if (this.chosenMerchantId === item.id) {
              this.merchantName = item.name;
            }
          });
        }
      });
    },
    /**
     * @description 切换商户
     */
    merchantChoose(command) {
      console.log(command, "command");
      var params = {
        merchantId: command,
      };
      merchantChoose(params).then((res) => {
        console.log(res, "merchantChange");
        if (res.code == 0) {
          this.$store.dispatch("user/setMerchantId", Number(command));
          location.reload();
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.merchant-container {
  height: 100%;
  line-height: 50px;
  color: #0a1220a3;
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
