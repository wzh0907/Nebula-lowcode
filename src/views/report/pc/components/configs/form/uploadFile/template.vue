<template>
  <div class="antd_upload_img">
    <template>
      <!-- <a-upload
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
          <i v-if="options.icon.fontClass" :class="options.icon.fontClass" />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload> -->
      <a-upload
        name="file"
        :multiple="true"
        :action="actionFile"
        :headers="headers"
        @change="handleChange"
      >
        <a-button> <a-icon type="upload" /> 点击上传 </a-button>
      </a-upload>
    </template>
  </div>
</template>

<script>
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
    token() {
      return getStorage("token");
    },
    userName() {
      return getStorage("phoneNumber");
    },
    merchantId() {
      return getStorage("merchantId");
    },
    projectId() {
      return getStorage("projectId");
    },
    baseUrl() {
      // return `${process.env.VUE_APP_BASE_API}`;
      return `https://localhost:40518/platform/api`;
    },
    headers() {
      return {
        "X-AUTH-TOKEN": this.token,
        "X-AUTH-KEY": this.userName,
        "X-PROJECT-ID": this.projectId,
        "X-MERCHANT-ID": this.merchantId,
        "X-AUTH-SOURCE": "PORTAL_PC",
      };
    },
    action() {
      return (
        this.baseUrl +
        `/file/v2/upload?type=custom&merchantId=` +
        this.merchantId +
        `&projectId=` +
        this.projectId
      );
    },
    headersImg() {
      return {
        "X-AUTH-TOKEN": this.token,
        "X-AUTH-KEY": this.userName,
        "X-PROJECT-ID": this.projectId,
        "X-MERCHANT-ID": this.merchantId,
        "X-AUTH-SOURCE": "PORTAL_PC",
      };
    },
    actionFile() {
      return (
        this.baseUrl +
        `/file/v2/upload?type=custom&merchantId=` +
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
          // this.setImgSize(item, val);
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
      // this.setImgSize(item, this.options);
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
      console.log("handleChange", fileList);
      if (fileList.length > this.options.size) {
        this.options.checked += 1;
        if (this.options.checked == this.options.size) {
          this.$antdMessage.error("最多上传" + this.options.size + "个附件");
          this.options.checked = 0;
          return false;
        }
      } else {
        this.options.fileList = fileList;
        let fileArray = [];
        fileList.forEach((info) => {
          if (info.status === "done" && info.response.code == 0) {
            let fileItem = {
              type: info.type,
              url: info.response.data.url,
              fileName: info.response.data.fileName,
              fileId: info.response.data.fileId,
              size: info.size, //字节
            };
            fileArray.push(fileItem);
          }
        });
        this.options.value = JSON.stringify(fileArray);
      }
    },
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    },
    // handleChange(info) {

    //   if (info.file.status === "done") {
    //     this.options.imageUrl = info.file.response.data.url;
    //     // this.getBase64(info.file.originFileObj, imageUrl => {
    //     //   this.options.imageUrl = imageUrl;
    //     // });
    //   }
    // },
  },
};
</script>

<style lang="scss">
</style>
