<template>
  <div class="icon-inserter">
    <div class="avatar-uploader" @click="getUploadImg">
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

<script>


export default {
  name: 'IconInserter',
  components: {
    "icon-dialog": () => import("@/views/report/modules/icon-select-dialog"),
  },
  data() {
    return {
      iconListData: [],
    };
  },
  props: ['iconSrc', 'configOptions', 'configKey', 'isShowLineEntityIcon'],
  methods: {
    getUploadImg() {
      this.imgVisible = true;
      this.imgTitle = "图标";
      this.getDefaultIcon();
    },
    getDefaultIcon() {
    
    },
  }
}
</script>

<style scoped>
.icon-inserter {
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
}
</style>
