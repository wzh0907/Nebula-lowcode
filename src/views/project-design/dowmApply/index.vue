<template>
  <div class="downComment_main">
    <div class="downCommentDetail">
      <div class="detail_base">
        <div class="detail_base_left">
          <img
            v-if="
              appDetail.appLogo !== '' &&
              appDetail.appLogo !== null &&
              appDetail.appLogo !== undefined
            "
            :src="appDetail.appLogo"
            alt=""
          />
          <img v-else src="../../../assets/noImg.png" alt="" />
        </div>
        <div class="detail_base_right">
          <div class="detail_base_right_line">
            <div class="detail_base_title">{{ appDetail.appName }}</div>
            <div
              class="detail_base_right_type"
              v-if="this.$route.query.type !== 'mine'"
            >
              <!-- <el-button>体验一下</el-button> -->
              <el-button type="primary" @click="downApply">下载</el-button>
              <el-button type="primary" @click="quoteApp">引用</el-button>
            </div>
            <div v-else>
              <el-button
                type="primary"
                @click.stop="OffShelf"
                v-if="appDetail.status === 1"
                >下架</el-button
              >
              <el-button type="primary" @click.stop="putShelf" v-else
                >上架</el-button
              >
              <el-button type="primary" @click="downApply">下载</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="detail_more">
        <div class="detail_extend">
          <el-carousel height="420px">
            <el-carousel-item v-for="item in appDescPicList" :key="item">
              <img :src="item" alt="img" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="detail_spread">
          <ul>
            <li>
              <div>
                管理者: <label>{{ appDetail.createdBy }}</label>
              </div>
            </li>
            <li>
              <div>
                发布时间: <label>{{ appDetail.createTime }}</label>
              </div>
            </li>
            <li>
              <div>
                当前版本: <label>{{ appDetail.appVersion }}</label>
              </div>
            </li>
            <li>
              <div>
                版本说明: <label>{{ appDetail.appVersionDesc }}</label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mktApplyAppDown,
  checkMktAppDetail,
  mktAppreference,
  mktAppPullOff,
  mktAppputOn,
} from "@/api/componentApply";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "downCommentDetail",
  components: {},
  data() {
    return {
      appDetail: {},
      appDescPicList: [],
      defaultImg: require("../../../assets/lunbo.png"),
    };
  },
  computed: {},
  created() {
    this.getMktAppDetail();
  },
  mounted() {},
  methods: {
    // 下架
    OffShelf() {
      let obj = {
        id: this.$route.query.id,
      };
      mktAppPullOff(obj).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: "下架成功",
            type: "success",
          });
          this.getMktAppDetail();
        }
      });
    },
    //上架
    putShelf() {
      let obj = {
        id: this.$route.query.id,
      };
      mktAppputOn(obj).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: "上架成功",
            type: "success",
          });
          this.getMktAppDetail();
        }
      });
    },
    downApply() {
      let obj = {
        id: this.$route.query.id,
        workMode: getStorage("workMode"),
      };
      const loading = this.$loading({
        lock: true,
        text: "下载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      mktApplyAppDown(obj)
        .then((res) => {
          if (res.code === 0) {
            loading.close();
            this.$message({
              message: "下载成功",
              type: "success",
            });
          } else {
            loading.close();
          }
        })
        .catch((err) => {
          loading.close();
        });
    },
    quoteApp() {
      let obj = {
        id: this.$route.query.id,
        workMode: getStorage("workMode"),
      };
      const loading = this.$loading({
        lock: true,
        text: "引用中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      mktAppreference(obj)
        .then((res) => {
          if (res.code === 0) {
            loading.close();
            this.$message({
              message: "引用成功",
              type: "success",
            });
          } else {
            loading.close();
          }
        })
        .catch((err) => {
          loading.close();
        });
    },
    //获取我的全部应用市场详情
    getMktAppDetail() {
      let obj = {
        id: this.$route.query.id,
      };
      checkMktAppDetail(obj).then((res) => {
        this.appDetail = res.data;
        if (
          res.data.appDescPic !== "" &&
          res.data.appDescPic !== null &&
          res.data.appDescPic !== undefined
        ) {
          this.appDescPicList = res.data.appDescPic.split(",");
        } else {
          this.appDescPicList.push(this.defaultImg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.downComment_main {
  width: 100%;
  height: 100%;
  padding-top: 62px;
  padding-bottom: 20px;
  overflow: auto;
  .downCommentDetail {
    max-width: 1180px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 34px 40px 60px;
    min-height: 350px;
    background: #fff;
    .detail_base {
      display: flex;
      .detail_base_left {
        img {
          width: 80px;
          height: 80px;
          border-radius: 4px;
        }
      }
      .detail_base_right {
        flex: 1;
        .detail_base_right_line {
          display: flex;
          flex: 1;
          .detail_base_title {
            flex: 1;
            margin-left: 20px;
            font-size: 20px;
            color: #333;
          }
        }
      }
    }
    .detail_more {
      display: flex;
      width: 100%;
      .detail_extend {
        float: left;
        width: 756px;
        margin-left: 100px;
        margin-right: 24px;
        padding-top: 40px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .detail_spread {
        float: left;
        padding-top: 40px;
        max-width: 180px;
        ul {
          li {
            margin: 10px 0;
            div {
              font-size: 12px;
              color: rgba(0, 0, 0, 0.6);
            }
          }
        }
      }
    }
  }
}
</style>
