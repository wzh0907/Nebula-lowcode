<template>
  <el-dialog
    title="自定义代码上传"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :width="width"
    @open="dialogOpen"
  >
    <div class="add-data-wrap">
      <el-input type="textarea"
      :rows="20"
      placeholder="请输入内容"
      v-model="customValue"/>  
    </div>
    <div style="position: absolute; right: 15px; bottom: 15px;">
          <el-button @click="onClose" size="small">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="small">确 定</el-button>
        </div>
  </el-dialog>
</template>

<script>
import { saveCustomService, getCustomInfoService } from "@/api/reportCustom";
import { mapGetters } from "vuex";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "900px",
    },
    config:{
      type:Object,
      default:{}
    }
  },
  data() {
    return {
      customValue: "",
      customId: 0,
    };
  },
  computed: {
    ...mapGetters(["reportId"]),
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },

  created() {},
  mounted() {},
  methods: {
    dialogOpen() {
      let params = {
        reportId: this.reportId,
      };
      getCustomInfoService(params).then((res) => {
        if (res.code == 0 && res.data.id) {
          this.customId = res.data.id;
          this.config.options.customId=this.customId
          this.customValue = res.data.vueValue;
        }
      });
    },
    onClose() {
      this.isShowDialog = false;
    },
    onSubmit() {
      console.log("reportId=", this.reportId);
      let params = {    
        reportId: this.reportId,
        vueValue: this.customValue,
      };
      if(this.customId){
        params.id=this.customId
      }
      saveCustomService(params).then((res) => {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        this.isShowDialog = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
p {
  margin: 0;
  padding: 0;
}
.add-data-wrap {
  display: flex;
  min-height: 500px;
  .silder-menu {
    width: 180px;
    border-right: 1px solid #ccc;
    text-align: center;
    p {
      padding: 20px 0px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
    .active {
      color: #409eff;
    }
  }
  .data-content {
    flex: 1;
    padding-bottom: 50px;
    ul {
      li {
        cursor: pointer;
      }
    }
    .active {
      color: #409eff;
    }
  }
  .table-content {
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>
