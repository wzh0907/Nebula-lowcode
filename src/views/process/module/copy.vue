<template>
  <el-dialog title="复制" width="600px" :visible.sync="isShowDialog" @open="dialogOpen">
    <el-form ref="dbForm" v-loading="listLoading" :model="dataForm">
      <el-form-item label="接口名称" :label-width="formLabelWidth" prop="pageName">
        <el-input v-model="pageName" :placeholder="'请输入复制接口名称'" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { copyProcess } from "@/api/process";
export default {
  name: "Config",
  props: {
    queryId: {
      type: String | Number,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listLoading: false,
      formLabelWidth: "120px",
      dataForm: {
        // icon: this.eicon,
        visible: 1,
      },
      pageName: "",
    };
  },
  computed: {
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
    show(info) {
      console.log(info);
      if (info.eicon) {
        console.log(111);
        this.$nextTick(() => {
          this.iconChange(info.eicon);
        });
      } else {
        this.clearIcon();
      }
    },
    save() {
      this.copy();
    },
    copy() {
      const params = {
        processId: this.queryId,
        processName: this.pageName,
      };
      copyProcess(params).then((res) => {
        this.listLoading = false;
        this.isShowDialog = false;
        this.$emit("reload");
      });
    },
    dialogOpen() {
      this.dataForm = {};
      this.$refs.dbForm && this.$refs.dbForm.resetFields();
      // this.getDetail()
    },
    clearIcon() {
      this.icon = "";
      const dom = this.$refs["select_icon"].$el;
      if (document.getElementsByClassName("choose_icon")[0]) {
        dom.childNodes[1].removeChild(
          document.getElementsByClassName("choose_icon")[0]
        );
      }
    },
    iconChange(val) {
      // el-select实际上是两层div包裹的input
      this.icon = " ";
      this.dataForm.icon = val;
      // 获取当前el-select标签第一层div
      const dom = this.$refs["select_icon"].$el;
      if (document.getElementsByClassName("choose_icon")[0]) {
        dom.childNodes[1].removeChild(
          document.getElementsByClassName("choose_icon")[0]
        );
      }
      // document.getElementsByClassName('el-input__prefix').remove()
      // 创建需要添加到其中的标签 并填充内容
      const svgDom = document.createElement("i"); // ('<svg-icon ref="iconRef" icon-class="' + val + '" style="float: left;width: 3%;height: 30px;border: 1px solid #dcdfe6;border-right:none;" />');
      svgDom.setAttribute("class", "el-input__prefix choose_icon");
      svgDom.innerHTML =
        '<span class="el-input__prefix-inner report_config_select_icon_p">已选：<i class="' +
        val +
        ' report_config_select_icon_p"></i></span>';
      // 将创建的标签添加到父节点(第二层div)
      dom.children[0].appendChild(svgDom);
      // 得到el-select中的input标签
      const inputDom = dom.children[0].children[0];
      inputDom.setAttribute("style", "padding-left: 30px;");
      // 将添加的标签放到input前面
      dom.children[0].insertBefore(svgDom, inputDom);
    },
  },
};
</script>

<style scoped>
.report-config-options-icon-wrap {
  /* background: red; */
  display: flex;
  flex-wrap: wrap;
  width: 230px;
}

.report_config_select_icon_p {
  font-weight: bold;
  font-size: 22px;
  color: #000;
}
</style>
