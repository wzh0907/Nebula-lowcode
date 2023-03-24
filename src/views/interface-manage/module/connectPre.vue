<template>
  <el-dialog
    :title="title"
    width="450px"
    v-loading="listLoading"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-form ref="roleInfo"  label-width="120px" :model="roleInfo">
      <el-form-item label="名称：" >
        <el-input maxlength="20" v-model="preName" />
      </el-form-item>
      
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "addRole",
  props: {
    id: {
      type: String | Number,
      default: ""
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    name:{
      type:String,
      default:"",
    },
   detailData: {}
  },
  data() {
    return {
      listLoading: false,
      authorityAllList: [],
      preName:this.name,
      roleInfo: {
        roleName: "",
        roleExplain: "",
        authIdList: []
      },
      roleList: [],
      rules: {
        roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        roleExplain: [
          { required: false, message: "请输入角色说明", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    name(val) {
      this.preName = val;
    },
  
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    },
    ...mapGetters(["projectId"]),
  },
  created() {},
  mounted() {},
  methods: {
    save() {
      this.$emit("onSave",this.preName);
    }, 
 
    dialogOpen() {
      console.log("open",this.preName)
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item{
  margin-bottom: 20px;
}
.new-role{
  float: right;
}
</style>
