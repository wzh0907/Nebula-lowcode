<template>
  <div class="downComment_lists">
    <ul class="downComment_list" v-if="mktCommentList.length > 0">
      <li
        class="downComment_main"
        v-for="(item, index) in mktCommentList"
        :key="index"
        @click="goCommentDetail(item)"
      >
        <div class="report-image">
          <img
            v-if="
              item.cpntLogo !== '' &&
              item.cpntLogo !== null &&
              item.cpntLogo !== undefined
            "
            :src="item.cpntLogo"
            alt=""
            style="object-fit: cover; object-position: top center"
          />
          <img
            v-else
            src="../../../../assets/noImg.png"
            alt=""
            style="object-fit: contain"
          />
        </div>
        <div class="downComponentOperate">
          <div class="cpn-name-text">{{ item.cpntName }}</div>
          <div class="download-text" @click.stop="downApply(item)">下载</div>
          <div class="download-text" v-has="'mktcpnt:delete'" @click.stop="deleteApply(item)">删除</div>
        </div>
      </li>
    </ul>
    <div v-else>暂无数据</div>
    <div style="clear: both"></div>
  </div>
</template>

<script>
import { mktApplyCpntDown,mktApplyCpntDelete } from "@/api/componentApply";
export default {
  name: "downComment_list",
  props: {
    //0:从页面设计器打开 1:从侧边栏打开
    openType: {
      type: String,
      default: "0",
    },
    mktCommentList: {
      type: Array,
      default: () => [],
    },
    dirId: {
      type: Number,
      default: 0,
    },
    dataType: {
      type: String,
      default: "report",
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
        dirParentId: this.dirId,
      };
      const loading = this.$loading({
        lock: true,
        text: "下载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      mktApplyCpntDown(obj)
        .then((res) => {
          if (res.code === 0) {
            loading.close();
            this.$message({
              message: "下载成功",
              type: "success",
            });
            this.$emit("uploadDirTree");
            this.$emit("refreshGroupComponentList");
            if (this.openType == "0") {
              if (this.dataType == "process") {
                this.$emit("refreshProcessDetail", res.data);
              } else {
                this.$emit(
                  "refreshConfigJson",
                  JSON.parse(res.data.configJson)
                );
              }

              this.$emit("close");
            }
          } else {
            loading.close();
          }
        })
        .catch((err) => {
          loading.close();
        });
    },
    deleteApply(item){
      let param = {
        id: item.id,
      };
      mktApplyCpntDelete(param).then(res=>{
         if (res.code === 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
           this.$emit("refreshCpntList");
         }else {
             this.$message({
              message: res.msg,
              type: "error",
            });
          }
      })

    },
    goCommentDetail(item) {
      let routeUrl = this.$router.resolve({
        path: "/downCommentDetail",
        query: { id: item.id },
      });
      window.open(routeUrl.href, "_blank");
    },
  },
};
</script>

<style lang="scss">
.downComment_lists {
  .report-image {
    img {
      width: 100%;
      height: 100px;
      // border-radius: 50%;
      // margin-right: 16px;
    }
  }
  .downComment_list {
    width: 100%;
    .downComment_main {
      width: 30%;
      float: left;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      margin: 10px 10px 10px 8px;
      cursor: pointer;
      height: 140px;
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
      -webkit-line-clamp: 3;
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

  .download-text {
    display: none;
  }
  .downComponentOperate:hover .download-text {
    display: inline-block;
    width: 50%;
  }
  .downComponentOperate:hover .cpn-name-text {
    display: none;
  }

  .downComponentOperate {
    background: #fafafa;
    text-align: center;
    cursor: pointer;
    position: absolute;
    width: 100%;
    bottom: 0;
    // ul {
    //   li {
    //     &:hover {
    //       color: #429cfd;
    //     }
    //   }
    // }
  }
}
</style>
