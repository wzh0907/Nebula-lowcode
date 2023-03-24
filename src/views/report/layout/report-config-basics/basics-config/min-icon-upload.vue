<script>
/**
 * xxxxxxxx
 */
import { mapGetters } from "vuex";


export default {
  components: {
    "icon-dialog": () => import("@/views/report/modules/icon-select-dialog"),
  },
  props: ['iconSrc', 'configOptions', 'configKey', 'isShowLineEntityIcon'],
  data() {
    return {
      imgVisible: false,
      imgTitle: "",
      iconListData: [],
    };
  },
  watch: {},
  computed: {
    ...mapGetters(['merchantList']),
  },
  created() {},
  methods: {
    getUploadImg() {
      this.imgVisible = true;
      this.imgTitle = "图标";
      this.getDefaultIcon();
    },
    getDefaultIcon() {
    
    },
    // getDefaultImg() {
    //   commonlyImgList({ type: "default" }).then((res) => {
    //     if (res.code === 0) {
    //       this.listData = res.dataList;
    //     } else {
    //       this.$message.error(res.message);
    //     }
    //   });
    // },
    // 上传图标
    changeImg(iconSrc){
      this.$emit('changeConfigValue', this.configOptions, this.configKey, iconSrc)
    },
    beforeAvatarUpload() {},
  },
};
</script>

<template>
  <div class="img-custom-component">
    <div class="avatar-uploader" @click="getUploadImg">
      <div class="avatar-uploader-icon" v-if="iconSrc && iconSrc.fontClass">
        <i :class="iconSrc.fontClass" style="font-size: 22px;" />
      </div>
      <van-icon v-else :name="iconSrc" class="avatar-uploader-icon" />
    </div>
    <!-- 弹框 -->
    <icon-dialog
      :isShowLineEntityIcon="isShowLineEntityIcon"
      :dialog-visible.sync="imgVisible"
      :title="imgTitle"
      :list-data="iconListData"
      @changeImg="changeImg"
    />
  </div>
</template>

<style lang="scss" scoped>
.img-custom-component {
  .avatar-uploader {
    width: 26px;
    border-radius: 6px;
    // border: 1px dashed #d9d9d9;
  }
  .avatar-uploader-icon {
    font-size: 22px;
    color: #8c939d;
    width: 26px;
    height: 26px;
    // line-height: 26px;
    text-align: center;
  }
  .avatar-uploader img {
    width: 26px;
    height: 26px;
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
