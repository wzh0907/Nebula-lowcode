<template>
  <div class="imgDialogTopCustom">
    <el-dialog
      :title="title"
      :before-close="handleClose"
      width="620px"
      :visible.sync="isShowDialog"
    >
      <el-form
        ref="imgTopDialogForm"
        :inline="true"
        label-position="center"
      >
        <el-tabs v-model="activeType" type="border-card" class="dialogImg" @tab-click="selectImgType">
          <el-tab-pane label="常用图片" name="all">
            <el-col>
              <el-form-item ref="uploadElement" style="margin-bottom: 20px !important;" class="imgList">
                <ul>
                  <li v-for="(item, idx) in listData" :key="idx" @click="selectCurrentImg(item,idx)">
                    <img :src="item.url" alt="">
                  </li>
                </ul>
              </el-form-item>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="自定义" name="upload">
            <el-col>
              <el-form-item ref="uploadElement" style="margin-bottom: 20px !important;" class="imgList">
                <el-upload
                  class="upload avatar-uploader"
                  accept="image/*"
                  :action="action"
                  :headers="headers"
                  :show-file-list="false"
                  list-type="picture-card"
                  :on-success="handlePicSuccess"
                >
                  <i class="el-icon-plus" />
                </el-upload>
                <ul>
                  <li v-for="(items, idxs) in imgList" :key="idxs" @click="selectCurrentImg(items,idxs)">
                    <img :src="items.url" alt="">
                    <span class="el-upload-list_item-actions">
                      <span class="el-upload-list_item-preview">
                        <i class="el-icon-zoom-in" @click="handlePictureCardPreview(items,idxs)" />
                      </span>
                      <span class="el-upload-list_item-delete">
                        <i class="el-icon-delete" @click="handleRemove(items,idxs)" />
                      </span>
                    </span>
                  </li>
                </ul>
                <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> //小图标 -->
              </el-form-item>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="imgDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
// import { getStorage } from '@/utils/storage'
import { mapState } from 'vuex'
import { commonlyImgList, deleUploadImg } from '@/api/chartsData'
export default {
    name: 'ImgDialog',
    props: {
        // orderPosInfos:{
        //         default: () => {}
        // },
        // eslint-disable-next-line vue/require-default-prop
        listData: {
           default: () => []
        },
        data: {
             default: () => {}
        },
        title: String,
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            activeType: 'all',
            index: -1,
            indexs: -1,
            imgList: [],
            // userName: '',
            // token: '',
            imgDialogVisible: false,
            dialogImageUrl: '', // 查看大图
            selectImg: '',
            selectCustomImg: ''
            // listData: []
        }
    },
    computed: {
        ...mapState({
            token: state => state.user.token,
            userName: state => state.user.phoneNumber,
            merchantId: (state) => state.user.merchantId,
            projectId: (state) => state.project.projectId,
        }),
        headers() {
            return {
                'X-AUTH-TOKEN': this.token,
                'X-AUTH-KEY': this.userName
            }
        },
        action() {
             return `${process.env.VUE_APP_BASE_API}/file/v2/upload?type=custom&merchantId=`+this.merchantId+`&projectId=`+this.projectId;
        },
        isShowDialog: {
            get() {
                return this.dialogVisible
            },
            set(val) {
                this.$emit('update:dialogVisible', val)
            }
        }
    },
    watch: {
        orderPosInfos: {
            handler(val) {

            }
        }
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
        selectImgType(value) {
          // this.index = -1
          if (value.name === 'upload') {
            this.getDefaultImg('custom')
          }
        },
      getDefaultImg(value, type) {
        commonlyImgList({ type: value }).then(res => {
          if (res.code === 0) {
            this.imgList = res.dataList
            if (type === '1') {
              this.indexs = -1
              this.selectCustomImg.url = ''
              this.selectCustomImg.fileId = ''
            }
          } else {
            this.$message.error(res.message)
          }
        })
      },
        handlePicSuccess(res, file) {
          this.imgList.push({ name: res.data.fileName, url: res.data.url, fileId: res.data.fileId })
        },
        handlePictureCardPreview(item, idx) {
          this.imgDialogVisible = true
          this.dialogImageUrl = item.url
        },
        handleRemove(item, idx) {
            deleUploadImg({ fileId: item.fileId }).then(res => {
              if (res.code === 0) {
              this.getDefaultImg('custom', '1')
              } else {
                this.$message.error(res.message)
              }
            })
        },
        selectCurrentImg(item, idx) {
              if (this.activeType === 'all') {
                 this.index = idx
                 this.selectImg = item
              } else {
                 this.indexs = idx
                 this.selectCustomImg = item
              }
        },
        close() {
            this.isShowDialog = false
        },

        handleClose() {
            this.isShowDialog = false
        }
    }
}
</script>

<style lang="scss">
.imgDialogTopCustom{
  .el-form-item__content{
      // margin-left: -40px;
      width: 100%;
    }
    /deep/.el-tabs__content{
      margin-top: 0px !important;
    }
    .dialogImg{
      height: 500PX;
      overflow: auto;
    }
    .avatar-uploader {
        width: 80px;
        border-radius: 6px;
        border: 1px dashed #d9d9d9;
        margin-top: 10px;
        margin-right: 10px;
        float: left;
        margin-left: 44px;
        ul {
          margin-left: 40px;
        }
    }
    .imgList{
        width: 100%;
        ul {
          width: 100%;
          margin-left: 40px;
            li{
                margin: 10px 10px 10px 5px;
                overflow: hidden;
                background-color: #fff;
                border: 1px solid #c0ccda;
                border-radius: 6px;
                box-sizing: border-box;
                width: 80px;
                height: 80px;
                float: left;
                // margin: 0 8px 8px 0;
                display: inline-block;
                position: relative;
                img{
                    width: 80px;
                    height: 80px;
                    display: inline-block;
                }
                .el-upload-list_item-actions:hover{
                  opacity: 1;
                }
                .el-upload-list_item-actions:hover span{
                  display: inline-block;
                }
                .el-upload-list_item-actions{
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
                    background-color: rgba(0,0,0,.5);
                    transition: opacity .3s;
                }
                .el-upload-list_item-actions span{
                  cursor: pointer;
                  position: relative;
                  top: 28%;
                  padding: 0 5px;
                }
            }
        }
    }
    .el-upload--picture-card{
        width: 80px;
        height: 80px;
        line-height: 80px;
    }
}
</style>
