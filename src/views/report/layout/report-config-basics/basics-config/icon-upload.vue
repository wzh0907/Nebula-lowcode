<script>
/**
 * 使用说明：图标选择配置（该组件支持插槽功能）
 *
 * 插槽功能：插入slot="content"重写icon预览的样式
 *
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
    <div @click="getUploadImg" v-if="$slots.content">
      <slot name="content" />
    </div>
    <div class="avatar-uploader" @click="getUploadImg" v-else>
      <div class="avatar-uploader-icon" v-if="iconSrc && iconSrc.fontClass">
        <i :class="iconSrc.fontClass" style="font-size: 28px;" />
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
    width: 88px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 88px;
    height: 88px;
    line-height: 88px;
    text-align: center;
  }
  .avatar-uploader img {
    width: 88px;
    height: 88px;
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
