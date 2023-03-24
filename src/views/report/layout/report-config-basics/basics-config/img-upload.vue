<script>
/**
 * 图片配置组件
 */
import { commonlyV2ImgList } from "@/api/chartsData";

export default {
  components: {
    "img-dialog": () => import("@/views/report/modules/imgUpload/imgDialog"),
  },
  props: ['imgSrc', 'configOptions', 'configKey'],
  data() {
    return {
      imgVisible: false,
      imgTitle: "",
      listData: [],
    };
  },
  watch: {},
  created() {},
  methods: {
    getUploadImg() {
      this.imgVisible = true;
      this.imgTitle = "图片";
      this.getDefaultImg();
    },
    getDefaultImg() {
      commonlyV2ImgList({ type: "custom" }).then((res) => {
        if (res.code === 0) {
          this.listData = res.dataList;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 上传图片
    changeImg(imgSrc,fileId){
      this.$emit('changeConfigValue', this.configOptions, this.configKey, imgSrc,fileId)
    },
    // handleAvatarSuccess(res, file) {
    //   this.$emit('changeImgSrc', this.configOptions, this.configKey, URL.createObjectURL(file.raw))
    // },
    beforeAvatarUpload() {},
  },
};
</script>

<template>
  <div class="img-custom-component">
    <div @click="getUploadImg" v-if="$slots.content">
      <slot name="content" />
    </div>
    <div class="avatar-uploader" @click="getUploadImg" v-else>
      <img v-if="imgSrc" :src="imgSrc" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </div>
    <!-- 弹框 -->
    <img-dialog
      :dialog-visible.sync="imgVisible"
      :title="imgTitle"
      :list-data="listData"
      @changeImg="changeImg"
    />
  </div>
</template>

<style lang="scss" scoped>
.img-custom-component {
  .avatar-uploader {
    width: 40px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .avatar-uploader img {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
  .img_setting_size {
    display: flex;
    .el-form-item {
      padding-right: 10px;
    }
  }
}
</style>
