<template>
  <div>
    <div class="custom_header">
      <div class="header_left">
        <span v-if="isCustomBackHandle" class="goBack" @click="backHandle">
          <i class="el-icon-arrow-left" />
        </span>
        <span class="header_contain">
          <!-- <span>
            <i :class="['iconfont',$route.meta.icon]" />
          </span> -->
          <!-- <span>
          <slot name="titleIcon" />
        </span>-->
          <slot name="title" />
        </span>
      </div>
      <div class="header_right">
        <slot name="opertBtn" />
      </div>
      <div style="width: 200px">
        <slot name="right"></slot>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>您要保存对页面所做的更改吗?如果不保存,你更改的内容将丢失！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="backRouter">不保存</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'CustomHeader',
  props: {
    isCustomBackHandle: {
      type: Boolean,
      default: false
    },
    routerBackPath: {
      type: String,
      default: '/'
    },
    configSave: {
        type: Boolean,
        default: false
    },
    widgetForm: {
       default: () => {}
    },
    componentList: {
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    backHandle() {
      if (this.isCustomBackHandle) {
        return this.$emit('onHeaderBackEvent')
      }
      this.$router.push({ path: this.routerBackPath })
      // if (this.configSave) {
      //   if (!this.widgetForm?.list?.length && !this.componentList?.length) {
      //     this.backRouter()
      //   } else {
      //     this.warnDialog()
      //   }
      // } else {
      //   this.$router.push({ path: this.routerBackPath })
      // }
    },
    warnDialog() {
      this.dialogVisible = true
      // this.$confirm('请确认是否已保存?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.backRouter()
      //   })
      //   .catch(() => {})
    },
    save() {
      this.$emit('dialogSave', 3)
    },
    handleClose() {
      this.dialogVisible = false
    },
    backRouter() {
      this.$router.push({
        path: '/',
        query: { parentId: this.$route.query.parentId, queryType: this.$route.query.queryType, currentDirNmae: this.$route.query.currentDirNmae }
      })
    }
  }
}
</script>

<style lang="scss">
.custom_header {
  z-index: 100;
  position: relative;
  display: flex;
  // color: #fff;
  min-width: 100%;
  height: 40px;
  color: rgba(10,18,32,.64);
  //background: #f5f5f5;
  background-color: white;
  border-bottom: 1px solid #EBEEF5;

  // box-shadow:0 0 6px 0 rgba(0,0,0,.12), 0 10px 12px 0 rgba(170,182,206,.2), inset 0 -1px 0 0 rgba(255,255,255,.3);
  // box-shadow: 0px 3px 2px rgba(150, 150, 150, 0.3);
  .el-input--small .el-input__inner {
    height: 28px;
    line-height: 28px;
    // background: #004ea2;
     color: rgba(10,18,32,.64);
    border-radius: 5px;
    border-color: transparent;
    &:focus {
      border: 1px solid #409eff;
    }
  }
  .header_left {
    height: 100%;
    line-height: 40px;
    flex: 2;
    //background-color: #f5f5f5;
    background-color: white;
    .goBack {
      margin-left: 20px;
      font-size: 20px;
      cursor: pointer;
      font-weight: bold;
    }
    .header_title {
      width: 200px;
    }
    .header_contain {
      vertical-align: top;
      span:nth-child(1) i {
        font-size: 20px;
      }
      span:nth-child(2) {
        position: absolute;
        line-height: 40px;
      }
      span {
        margin-top: 2px;
      }
    }
  }
  .header_right {
    float: right;
    height: 100%;
    line-height: 40px;
    margin-right: 0px;
    .el-button-opert-text .el-button--text {
      // color: #0a1220a3;
      color: rgba(10,18,32,.64);
      &:first-child{
        margin-left: 14px;
      }
      &:hover {
        color: #409eff;
      }
    }
  }
}

</style>
