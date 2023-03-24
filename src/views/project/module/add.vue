<template>
  <div>
    <el-dialog
      :title="title"
      width="600px"
      append-to-body
      :visible.sync="isShowDialog"
      @open="dialogOpen"
    >
      <el-form ref="processForm" :rules="rules" :model="dataForm">
        <!-- <el-form-item></el-form-item> -->
        <!--        <div class="device-type-select">-->
        <!--          <p-->
        <!--            class="device-wrap"-->
        <!--            :class="{ active: isActiveType === 'MOBILE' }"-->
        <!--            style="margin-right: 30px"-->
        <!--            @click="isActiveType = 'MOBILE'"-->
        <!--          >-->
        <!--            <i class="iconfont iconshoujidiannao"></i>-->
        <!--            <span>项目</span>-->
        <!--          </p>-->
        <!-- <p class="device-wrap" :class="{active: isActiveType === 'PC'}" @click="isActiveType = 'PC'">
          <i class="iconfont iconPC-"></i>
          <span>电脑</span>
        </p>
        <p class="device-wrap" :class="{active: isActiveType === 'MOBILE'}" style="margin-right: 30px" @click="isActiveType = 'MOBILE'">
          <i class="iconfont iconshouji"></i>
           <span>手机项目</span>
        </p> -->
        <!-- <p class="device-wrap" :class="{active: isActiveType === 'PC'}" @click="isActiveType = 'PC'">
          <i class="iconfont iconPC-"></i>
          <span>电脑</span>
        </p> -->
        <!--        </div>-->

        <el-form-item
          style="margin: 80px"
          label-width="0"
          prop="projectName"
          size="small"
        >
          <el-input
            placeholder="请输入项目名称"
            v-model="dataForm.projectName"
            maxlength="50"
          />
          <el-checkbox style="margin-top: 8px" v-model="isTemplateProject"
            >项目实例</el-checkbox
          >
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-bottom: 20px" class="dialog-footer">
        <el-button @click="cancal">取 消</el-button>
        <el-button type="primary" :disabled="btnLoading" @click="save"
          >保 存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addProjectService } from "@/api/project";
import { mapGetters } from "vuex";
import QRCode from "qrcodejs2";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "addProject",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    detailData: {},
  },
  data() {
    return {
      isActiveType: "MOBILE",
      isTemplateProject: false,
      btnLoading: false,
      dataForm: {
        projectName: "",
        fromProjectId: null,
      },
      rules: {
        projectName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["projectList"]),
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
    cancal() {
      this.isShowDialog = false;
      this.dataForm = {
        projectName: "",
        fromProjectId: null,
      };
    },
    save() {
      this.add();
    },
    add() {
      this.$refs.processForm.validate(async (valid) => {
        if (valid) {
          let params = {
            // type: this.isActiveType,
            projectName: this.dataForm.projectName,
            type: "ALL",
            workMode: getStorage("workMode"),
            copyFromTemplate: this.isTemplateProject,
          };
          if (this.dataForm.fromProjectId) {
            params.fromProjectId = this.dataForm.fromProjectId;
          }
          this.btnLoading = true;
          addProjectService(params)
            .then((res) => {
              this.$message.success("添加成功");
              this.$store.dispatch("project/getProjectList", true).then(() => {
                // location.reload();
                this.cancal();

                this.btnLoading = false;
              });
            })
            .catch(() => {
              this.btnLoading = false;
            });
        }
      });
    },

    dialogOpen() {
      this.dataForm = {
        projectName: "",
        fromProjectId: null,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.device-type-select {
  overflow: hidden;
  text-align: center;

  .device-wrap {
    display: inline-block;
    border: 1px solid #ccc;
    padding: 20px 30px;
    border-radius: 10px;
    margin: 30px 0;
    &.active {
      color: #006440;
      border: 1px solid #006440;
    }
    cursor: pointer;
    .iconfont {
      font-size: 42px;
    }
    span {
      display: block;
    }
  }
}
</style>
