<template>
  <div class="imgDialogCustom">
    <el-dialog
      :title="title"
      width="840px"
      :before-close="handleClose"
      :append-to-body="true"
      :visible.sync="isShowDialog"
      @open="dialogOpen"
    >
      <el-form
        ref="imgDialogForm"
        :inline="true"
        label-position="center"
        label-width="120px"
      >
        <el-upload
          accept="image/*"
          :action="action"
          :headers="headers"
          :show-file-list="false"
          :on-success="handlePicSuccess"
        >
          <el-button
            style="
              margin-left: 140px;
              background-color: white;
              border: 1px solid #d9d9d9;
              color: #333;
              width: 500px
            "
            type="primary"
            ><i class="el-icon-upload"></i> 上传新图片</el-button
          >
        </el-upload>
        <el-col
          style="
            height: 400px;
            overflow-y: auto;
            overflow-x: hidden;
            float: none;
          "
        >
          <el-form-item
            ref="uploadElement"
            style="margin-bottom: 20px !important"
            class="imgList"
          >
            <ul>
              <li
                v-for="(items, index) in imgList"
                :key="index"
                @click="selectCurrentImg(items, index)"
              >
<!--                <div :class="index == selectedIndex ? 'selected-image' : ''">-->
<!--                  <img :src="items.url" alt />-->
<!--                </div>-->
                <img :src="items.url" alt />
                <span v-show="index === selectedIndex" :class="index === selectedIndex?'select_current_main':''">
                      <i
                        :class="index === selectedIndex?'el-icon-current-check':''"
                        class="el-icon-upload-success el-icon-check"
                      />
                    </span>
                <span class="image-cover">
                  <span>
                    <i
                      class="el-icon-delete"
                      @click.stop="handleRemove(items, index)"
                    />
                  </span>
                </span>
              </li>
            </ul>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="large" @click="makeTaxCodeData">确定</el-button>
        <el-button size="large" @click="close">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getStorage } from '@/utils/storage'
import { mapState } from "vuex";
import { commonlyV2ImgList, deleUploadImg } from "@/api/chartsData";
export default {
  name: "ImgDialog",
  props: {
    listData: {
      default: () => [],
    },
    title: String,
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedIndex: -1,
      imgList: [],
      selectImg: "",
      selectCustomImg: "",
    };
  },
  computed: {
    ...mapState({
      token: (state) => state.user.token,
      userName: (state) => state.user.phoneNumber,
      merchantId: (state) => state.user.merchantId,
      projectId: (state) => state.project.projectId,
    }),
    headers() {
      return {
        "X-AUTH-TOKEN": this.token,
        "X-AUTH-KEY": this.userName,
      };
    },
    action() {
      return (
        `${process.env.VUE_APP_BASE_API}/file/v2/upload?type=custom&merchantId=` +
        this.merchantId +
        `&projectId=` +
        this.projectId
      );
    },
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
      handler(val) {},
    },
  },
  created() {

    // getStorage('username').then(res => {
    //     this.userName = res
    // })
    // getStorage('token').then(res => {
    //     this.token = res
    // })
  },
  methods: {
    dialogOpen(){
      this.getDefaultImg("custom");
    },
    selectImgType(value) {
      // this.index = -1
      if (value.name === "upload") {
        this.getDefaultImg("custom");
      }
    },
    getDefaultImg(value, type) {
      commonlyV2ImgList({ type: value }).then((res) => {
        if (res.code === 0) {
          this.imgList = res.dataList;
          if (type === "1") {
            this.selectedIndex = -1;
            this.selectCustomImg.url = "";
            this.selectCustomImg.fileId = "";
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handlePicSuccess(res, file) {
      this.imgList.push({
        name: res.data.fileName,
        url: res.data.url,
        fileId: res.data.fileId,
      });
    },
    handleRemove(item, idx) {
      deleUploadImg({ fileId: item.fileId }).then((res) => {
        if (res.code === 0) {
          this.getDefaultImg("custom", "1");
        } else {
          this.$message.error(res.message);
        }
      });
    },
    selectCurrentImg(item, idx) {
      this.selectedIndex = idx;
      this.selectCustomImg = item;
    },
    makeTaxCodeData() {
      let customtimageUrl = "";
      let customtimageFiled = "";
      customtimageUrl = this.selectCustomImg.url;
      customtimageFiled = this.selectCustomImg.fileId;
      // }
      if (!customtimageFiled) {
        this.$message({
          message: "请选择图片",
          type: "warning",
        });
      } else {
        this.isShowDialog = false;
        this.$emit("changeImg", customtimageUrl, customtimageFiled);
      }
    },
    close() {
      this.isShowDialog = false;
    },

    handleClose() {
      this.isShowDialog = false;
    },
  },
};
</script>

<style lang="scss">
.imgDialogCustom {
  .el-form-item__content {
    width: 100%;
  }
  /deep/.el-tabs__content {
    margin-top: 0px !important;
  }
  .dialogImg {
    height: 400px;
    overflow: auto;
  }
}

.imgList {
  width: 100%;
  ul {
    width: 100%;
    li {
      margin: 10px 10px 10px 5px;
      overflow: hidden;
      background-color: #fff;
      border-radius: 6px;
      width: 245px;
      height: 140px;
      float: left;
      position: relative;

      .select_current_main {
        position: absolute;
        right: -15px;
        top: -10px;
        width: 40px;
        height: 28px;
        background: #13ce66;
        text-align: center;
        transform: rotate(45deg);
        box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);

        .el-icon-current-check {
          color: #fff;
          font-size: 12px;
          margin-top: 0px;
          transform: rotate(-45deg);
        }
      }

      //.selected-image {
      //  background-color: rgb(54, 173, 54);
      //  // padding: 2px;
      //}
      img {
        //margin: 2px;
        width: 245px;
        height: 140px;
        display: inline-block;
        border-radius: 6px;
      }
      .image-cover:hover {
        opacity: 1;
      }
      .image-cover:hover span {
        display: inline-block;
      }
      .image-cover {
        position: absolute;
        width: 100%;
        height: 100%;
        right: 0;
        top: 0;
        cursor: default;
        text-align: left;
        color: #fff;
        opacity: 0;
        font-size: 20px;

      }
      .image-cover span {
        background-color: rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s;
        cursor: pointer;
        position: relative;
        top: 0;
        left: 0;
        padding: 0 10px;
        border-top-left-radius: 6px;
      }
    }
  }
}

.dialog-footer {
  padding-top: 0px;
}
</style>
