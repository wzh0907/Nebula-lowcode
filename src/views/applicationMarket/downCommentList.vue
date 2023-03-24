<template>
  <div class="downComment_lists_app">
    <ul class="downComment_list" v-if="appList.length > 0">
      <li
        class="downComment_main"
        v-for="(item, index) in appList"
        :key="index"
        @click="goCommentDetail(item)"
      >
        <div class="downComment_list_top">
          <div class="list_left">
            <img
              v-if="
                item.appLogo !== '' &&
                item.appLogo !== null &&
                item.appLogo !== undefined
              "
              :src="item.appLogo"
              alt=""
            />
            <img v-else src="../../assets/noImg.png" alt="" />
          </div>
          <div class="list_right">
            <label>{{ item.appName }}</label>
            <div :title="item.appDesc">{{ item.appDesc }}</div>
          </div>
        </div>
        <div class="downComment_opert">
          <ul v-if="type === 'all'">
            <!-- <li>
                  <span>体验</span>
                </li> -->
            <li @click.stop="downApply(item)">
              <span>下载</span>
            </li>
            <li @click.stop="quoteApp(item)">
              <span>引用</span>
            </li>
          </ul>
          <ul v-else>
            <li @click.stop="OffShelf(item)" v-if="item.status === 1">下架</li>
            <li @click.stop="putShelf(item)" v-else>上架</li>
            <li @click.stop="downApply(item)">下载</li>
          </ul>
        </div>
      </li>
    </ul>
    <div v-else>暂无数据</div>
    <div style="clear: both"></div>
  </div>
</template>

<script>
import {getStorage,setStorage} from "@/util/storageUtil.js";
import {
  mktApplyAppDown,
  mktAppputOn,
  mktAppPullOff,
  mktAppreference,
} from "@/api/componentApply";
export default {
  name: "downComment_list",
  props: {
    appList: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    downApply(item) {
      let obj = {
        id: item.id,
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
    quoteApp(item) {
      let obj = {
        id: item.id,
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
    // 下架
    OffShelf(item) {
      let obj = {
        id: item.id,
      };
      mktAppPullOff(obj).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: "下架成功",
            type: "success",
          });
          this.$emit("uplateList");
        }
      });
    },
    //上架
    putShelf(item) {
      let obj = {
        id: item.id,
      };
      mktAppputOn(obj).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: "上架成功",
            type: "success",
          });
          this.$emit("uplateList");
        }
      });
    },
    goCommentDetail(item) {
      let routeUrl = this.$router.resolve({
        path: "/downApplyDetail",
        query: { id: item.id, type: this.type },
      });
      window.open(routeUrl.href, "_blank");
    },
  },
};
</script>

<style lang="scss">
.downComment_lists_app {
  max-height: 640px;
  overflow: auto;
  .list_left {
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 16px;
    }
  }
  .downComment_list {
    width: 100%;
    .downComment_main {
      width: 23.5%;
      float: left;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      margin: 10px 10px 10px 8px;
      cursor: pointer;
      height: 185px;
      position: relative;
    }
  }
  .downComment_list_top {
    width: 100%;
    display: flex;
    padding: 10px;
    line-height: 1.8;
    .list_right {
      width: 100%;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      label {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }
      div {
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
  .downComment_opert {
    background: #fafafa;
    text-align: center;
    cursor: pointer;
    position: absolute;
    width: 100%;
    bottom: 0;
    ul {
      display: flex;
      align-items: center;
      li {
        flex: 1;
        height: 22px;
        line-height: 22px;
        margin: 10px 0;
        &:not(:last-child) {
          border-right: 1px solid #e9e9e9;
        }
        &:hover {
          color: #429cfd;
        }
      }
    }
  }
}
</style>
