<template>
  <div class="imgDialogCustom">
    <el-dialog
      :before-close="handleClose"
      :title="title"
      :visible.sync="isShowDialog"
      width="560px"
      @open="dialogOpen"
    >
      <el-input v-model="iconName" placeholder="请输入图标名称搜索" style="width: 400px; margin-left: 50px;margin-bottom: 20px">
        <el-button slot="append" icon="el-icon-search" @click="searchIcon"></el-button>
      </el-input>
      <el-form ref="imgDialogForm" :inline="true" label-position="center" label-width="120px">
        <el-col v-if="!isShowLineEntityIcon">
          <el-form-item
            ref="uploadElement"
            class="iconList"
            style="margin-bottom: 20px !important;"
          >
            <ul style="height: 450px; overflow: auto">
              <!--              <li><i class="iconfont check-circle"></i></li>-->

              <li
                v-for="(item, idx) in listData"
                :key="idx"
                @click="selectCurrentIcon(item,idx)"
              >
                <i :class="item.fontClass" class="avatar-uploader-icon"></i>
                <div style="width: 75px;margin-left: 5px; text-align: center;font-size: 12px;line-height: 18px">
                  {{ item.name }}
                </div>
                <span v-show="idx === index" :class="idx === index?'select_current_main':''">
                      <i
                        :class="idx==index?'el-icon-current-check':''"
                        class="el-icon-upload-success el-icon-check"
                      />
                    </span>
              </li>
            </ul>
          </el-form-item>
        </el-col>
        <el-col v-if="isShowLineEntityIcon">
          <el-form-item
            ref="uploadElement"
            class="iconList"
            style="margin-bottom: 20px !important;"
          >
            <ul>
              <li
                v-for="(item, idx) in entityIconList"
                :key="idx"
                @click="selectCurrentIcon(item,idx)"
              >
                <van-icon :name="item" class="avatar-uploader-icon"/>
                <span v-show="idx === index" :class="idx === index?'select_current_main':''">
                      <i
                        :class="idx==index?'el-icon-current-check':''"
                        class="el-icon-upload-success el-icon-check"
                      />
                    </span>
              </li>
            </ul>
          </el-form-item>
        </el-col>
      </el-form>
      <span v-show="isChoose" slot="footer" class="dialog-footer">
        <el-button @click="makeTaxCodeData">确定</el-button>
        <el-button @click="close">取消</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog :visible.sync="imgDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog> -->
  </div>
</template>

<script>
// import { getStorage } from '@/utils/storage'
// import { mapState } from "vuex";
// import { commonlyiconList, deleUploadImg } from "@/api/chartsData";
import {iconList} from "@/api/icon";
import {loadCss} from "@/util/index.js";

export default {
  name: "iconDialog",
  props: {
    // listData: {
    //   default: () => [],
    // },
    isChoose: {
      type: Boolean,
      default: true,
    },
    title: String,
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    isShowLineEntityIcon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeType: "custom",
      listData: [],
      index: -1,
      indexs: -1,
      iconName: '',
      iconList: [],
      // userName: '',
      // token: '',
      // imgDialogVisible: false,
      dialogImageUrl: "", // 查看大图
      selectImg: "",
      selectCustomImg: "",
      // listData: []
      // 新属性
      selectIcon: "",
      // basicsIconList: ["success", "plus", "cross", "fail", "arrow"],
      // lineIconList: ["location-o", "like-o", "star-o", "phone-o", "setting-o"],
      entityIconList: ["location", "like", "star", "phone", "setting"],
    };
  },
  computed: {
    // ...mapState({
    //   token: (state) => state.user.token,
    //   userName: (state) => state.user.phoneNumber,
    // }),
    // headers() {
    //   return {
    //     "X-AUTH-TOKEN": this.token,
    //     "X-AUTH-KEY": this.userName,
    //   };
    // },
    // action() {
    //   return `${process.env.VUE_APP_BASE_API}/file/v1/upload?type=custom`;
    // },
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  watch: {
    orderPosInfos: {
      handler(val) {
      },
    },
  },
  created() {
    this.activeType = this.isShowLineEntityIcon ? "entity" : "custom";
    // getStorage('username').then(res => {
    //     this.userName = res
    // })
    // getStorage('token').then(res => {
    //     this.token = res
    // })
  },
  methods: {
    selectImgType(value) {
      // this.index = -1
      // if (value.name === "upload") {
      //   this.getDefaultImg("custom");
      // }
    },
    // getDefaultImg(value, type) {
    //   commonlyiconList({ type: value }).then((res) => {
    //     if (res.code === 0) {
    //       this.iconList = res.dataList;
    //       if (type === "1") {
    //         this.indexs = -1;
    //         this.selectCustomImg.url = "";
    //         this.selectCustomImg.fileId = "";
    //       }
    //     } else {
    //       this.$message.error(res.message);
    //     }
    //   });
    // },
    // handlePicSuccess(res, file) {
    //   this.iconList.push({
    //     name: res.data.fileName,
    //     url: res.data.url,
    //     fileId: res.data.fileId,
    //   });
    // },
    // handlePictureCardPreview(item, idx) {
    //   this.imgDialogVisible = true;
    //   this.dialogImageUrl = item.url;
    // },
    // handleRemove(item, idx) {
    //   deleUploadImg({ fileId: item.fileId }).then((res) => {
    //     if (res.code === 0) {
    //       this.getDefaultImg("custom", "1");
    //     } else {
    //       this.$message.error(res.message);
    //     }
    //   });
    // },
    selectCurrentIcon(item, idx) {
      if (!this.isChoose) return false;
      this.index = idx;
      this.selectIcon = item;
    },
    searchIcon() {
      let param = {
        type: "custom",
        name: this.iconName
      };
      iconList(param).then((res) => {
        this.listData = res.data.iconList;
      });
    },
    // selectCurrentImg(item, idx) {
    //   if (!this.isChoose) return false
    //   this.index = idx;
    //   this.selectIcon = item;
    //   // if (this.activeType === "all") {
    //   //   this.index = idx;
    //   //   this.selectIcon = item;
    //   // } else {
    //   //   this.indexs = idx;
    //   //   this.selectCustomImg = item;
    //   // }
    // },
    makeTaxCodeData() {
      // let customtimageUrl = ''
      // let customtimageFiled = ''
      // if (this.activeType === "all") {
      //   customtimageUrl = this.selectImg.url;
      //   customtimageFiled = this.selectImg.fileId;
      // } else {
      //   customtimageUrl = this.selectCustomImg.url;
      //   customtimageFiled = this.selectCustomImg.fileId;
      // }
      if (!this.selectIcon) {
        this.$message({
          message: "请选择图标",
          type: "warning",
        });
      } else {
        this.isShowDialog = false;
        this.$emit("changeImg", this.selectIcon);
      }
    },
    close() {
      this.isShowDialog = false;
    },

    handleClose() {
      this.isShowDialog = false;
    },
    dialogOpen() {
      let param = {
        type: "custom",
      };
      iconList(param).then((res) => {
        console.log("dialogOpen", res);
        this.listData = res.data.iconList;
        let cssUrl = res.data.cssUrl;
        loadCss(cssUrl);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader-icon {
  margin-top: 10px;
  display: inline-block;
  font-size: 28px;
  color: #8c939d;
  width: 85px;
  height: 35px;
  line-height: 35px;
  text-align: center;
}

.imgDialogCustom {
  .el-form-item__content {
    width: 100%;
  }

  /deep/ .el-tabs__content {
    margin-top: 0px !important;
  }

  .dialogImg {
    height: 400px;
    overflow: auto;
  }

  .avatar-uploader {
    width: 80px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    margin-top: 10px;
    margin-right: 10px;
    float: left;
  }

  .iconList {
    width: 100%;

    ul {
      width: 100%;

      li {
        margin: 10px 10px 10px 5px;
        overflow: hidden;
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        width: 85px;
        height: 85px;
        float: left;
        // margin: 0 8px 8px 0;
        display: inline-block;
        position: relative;

        .select_current_main {
          position: absolute;
          right: -15px;
          top: -6px;
          width: 40px;
          height: 24px;
          background: #13ce66;
          text-align: center;
          transform: rotate(45deg);
          box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);

          .el-icon-current-check {
            color: #fff;
            font-size: 12px;
            margin-top: 11px;
            transform: rotate(-45deg);
          }
        }

        img {
          width: 80px;
          height: 80px;
          display: inline-block;
        }

        .el-upload-list_item-actions:hover {
          opacity: 1;
        }

        .el-upload-list_item-actions:hover span {
          display: inline-block;
        }

        .el-upload-list_item-actions {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          cursor: default;
          text-align: center;
          color: #fff;
          opacity: 0;
          font-size: 20px;
          background-color: rgba(0, 0, 0, 0.5);
          transition: opacity 0.3s;
        }

        .el-upload-list_item-actions span {
          cursor: pointer;
          position: relative;
          top: 28%;
          padding: 0 5px;
        }
      }
    }
  }

  .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
}
</style>
