<template>
  <el-dialog
    :title="title"
    width="600px"
    :visible.sync="isShowDialog"
    :append-to-body="true"
    :close-on-click-modal="false"
    @open="dialogOpen"
  >

    <el-form
      ref="processForm"
      :rules="rules"
      label-width="80px"
      :model="dataForm"
      class="dlgContainer"
    >
      <el-form-item label="父级" prop="entryParent" size="small">
        <el-select v-model="dataForm.entryParent" placeholder="请选择">
            <el-option
              v-for="item in dicOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编码" prop="entryCode" size="small">
        <el-input v-model="dataForm.entryCode" maxlength="50" />
      </el-form-item>
      <el-form-item label="名称" prop="entryName" size="small">
        <el-input v-model="dataForm.entryName" maxlength="50" />
      </el-form-item>
      <el-form-item label="排序" prop="seq" size="small">
        <a-input-number id="inputNumber" v-model="dataForm.seq" :min="0" :max="100000"   style="width: 100%;"/>
      </el-form-item>
      <el-form-item label="状态" prop="entryStatus" size="small">
        <el-radio-group v-model="dataForm.entryStatus">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="entryRemark" size="small">
        <el-input v-model="dataForm.entryRemark" maxlength="50" />
      </el-form-item>

      <el-form-item />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>

      <el-button type="primary" :disabled="btnLoading" @click="saveNew"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { addDicEntry } from "@/api/data-dic";


export default {
  name: "dicEntry",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    param: {
      type: Object,
      default () {
        return {}
      }
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
      btnLoading: false,
      dataForm: {},
      dicOpts: [],
      rules: {
        entryCode: [
          { required: true, message: "请输入编码", trigger: "blur" },
        ],
        entryName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
      },
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
    getCopy(){
      return {
                id:"",
                dicId: this.$parent.selectDataDicId,
                entryParent: "",
                entryCode: "",
                entryName: "",
                entryRemark: "",
                entryStatus: 1,
                seq: 0,
          }
    },
    cancel() {
      this.isShowDialog = false;
      this.dataForm = this.getCopy()
    },

    saveNew() {
      this.$refs.processForm.validate(async (valid) => {
        if (valid) {
          var params = this.dataForm
          // console.log(this.dataForm)
          if(this.dataForm.seq == '') this.dataForm.seq = '0'

          addDicEntry(params).then((res) => {
            if (res.code === 0) {
              this.$emit("initData");
              this.isShowDialog = false;
            }
          });
        }
      });
    },

    dialogOpen() {
      let raw = this.$parent.entryList
      this.dicOpts = [{value:'', label:'请选择'}]
      raw.forEach(element => {
        this.dicOpts.push({
          value: element.id +'',
          label: element.entryName
        })
      });

      if(this.id == null) { //new
            this.dataForm = this.getCopy()
      }else{ //edit
        // console.log('fffffffffffffffffggggggggggggggggg')
        console.log(this._props.param)
        let existing = this._props.param
        this.dataForm = {
          id : existing.id,
          dicId: this.$parent.selectDataDicId,
          entryParent: existing.entryParent,
          entryCode: existing.entryCode,
          entryName: existing.entryName,
          entryRemark: existing.entryRemark,
          entryStatus:  existing.entryStatus,
          seq: existing.seq
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// .device-type-select {
//   overflow: hidden;
//   text-align: center;
//   margin-bottom: 20px;
//   .device-wrap {
//     display: inline-block;
//     &.active {
//       color: #f56c6c;
//     }
//     cursor: pointer;
//     .iconfont {
//       font-size: 42px;
//     }
//   }
// }
.dlgContainer{
  .el-form-item{
    margin-bottom: 20px !important;
  }
}
</style>
