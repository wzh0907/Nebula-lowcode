<template>
  <div class="antd_upload_img">
    <template v-if="options.showUploadList">
      <a-upload
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :headers="headersImg"
        :action="actionImg"
        @change="handleChangeImg"
      >
        <img
          v-if="options.imageUrl"
          style="width: 100%"
          :src="options.imageUrl"
          alt="avatar"
        />
        <div v-else>
          <!-- <a-icon type="plus" /> -->
          <i v-if="options.icon.fontClass" :class="options.icon.fontClass" />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
    </template>
    <template v-else>
      <a-upload
        accept="image/*"
        :action="action"
        list-type="picture-card"
        :file-list="options.fileList"
        :headers="headers"
        :multiple="options.isMultiple"
        @preview="handlePreview"
        :on-success="handlePicSuccess"
        @change="handleChange"
      >
        <div v-if="options.fileList.length < options.size">
          <!-- <img :src="options.src" v-if="options.src" style="width:100%" alt=""> -->
          <i v-if="options.icon.fontClass" :class="options.icon.fontClass" />
          <template v-else>
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </template>
        </div>
      </a-upload>
      <a-modal
        :visible="options.previewVisible"
        :footer="null"
        @cancel="handleCancel"
      >
        <img alt="example" style="width: 100%" :src="options.previewImage" />
      </a-modal>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import optionsConfig from "./options-config";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "antdUploadImgTemplate",
  data() {
    return {
      options: optionsConfig,
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
        "X-AUTH-KEY": getStorage("phoneNumber"),
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
    headersImg() {
      return {
        "X-AUTH-TOKEN": getStorage("token"),
        "X-AUTH-KEY": getStorage("phoneNumber"),
      };
    },
    actionImg() {
      return (
        `${process.env.VUE_APP_BASE_API}/file/v2/upload?type=custom&merchantId=` +
        this.merchantId +
        `&projectId=` +
        this.projectId
      );
    },
  },
  watch: {
    options: {
      deep: true,
      handler(val) {
        let arr = [
          "ant-upload-list-picture-card-container",
          "ant-upload-list-item-list-type-picture-card",
          "ant-upload-select-picture-card",
          "ant-upload-list-item",
          "ant-upload.ant-upload-select-picture-card",
        ];
        arr.forEach((item) => {
          this.setImgSize(item, val);
        });
        // if (val.isMultiple) {
        //    this.$set(val,"size",val.fileList.length+1)
        // }
      },
    },
  },
  created() {},
  mounted() {
    let arr = [
      "ant-upload-list-picture-card-container",
      "ant-upload-list-item-list-type-picture-card",
      "ant-upload-select-picture-card",
      "ant-upload-list-item",
      "ant-upload.ant-upload-select-picture-card",
    ];
    arr.forEach((item) => {
      this.setImgSize(item, this.options);
    });
  },
  methods: {
    //设置上传图片的大小
    setImgSize(className, data) {
      let containerCardImg = document.getElementsByClassName(className);
      for (var i = 0; i < containerCardImg.length; i++) {
        containerCardImg[i].style.width = data.width + "px";
        containerCardImg[i].style.height = data.height + "px";
      }
    },
    handleCancel() {
      this.options.previewVisible = false;
    },
    async handlePreview(file) {
      this.options.previewImage = file.response.data.url;
      this.options.previewVisible = true;
    },
    handlePicSuccess(res, file) {
      // this.options.fileList.push({
      //   name: res.data.fileName,
      //   url: res.data.url,
      //   fileId: res.data.fileId,
      // });
    },
    handleChange({ fileList }) {
      if (fileList.length > this.options.size) {
        this.options.checked += 1;
        if (this.options.checked == this.options.size) {
          this.$antdMessage.error("最多上传" + this.options.size + "张");
          this.options.checked = 0;
          return false;
        }
      } else {
        this.options.fileList = fileList;
      }
    },
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    },
    handleChangeImg(info) {
      if (info.file.status === "done") {
        this.options.imageUrl = info.file.response.data.url;
        // this.getBase64(info.file.originFileObj, imageUrl => {
        //   this.options.imageUrl = imageUrl;
        // });
      }
    },
  },
};
</script>

<style lang="scss">
</style>
