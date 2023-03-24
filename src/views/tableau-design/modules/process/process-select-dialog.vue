<template>
  <el-dialog title="选择加工流程" width="600px" append-to-body :visible.sync="isShowDialog">
    <el-form ref="dbForm" v-loading="listLoading">
      <el-form-item size="medium">
        <el-input
          v-model="searchFieldKey"
          placeholder="输入搜索文本"
          width="30"
          size="small"
          @input="searchField"
        >
          <el-button slot="append" @click="newProcess">
            <span style="color: #409EFF;">新建</span>
          </el-button>
        </el-input>
        <ul class="field-list-wrap">
          <li
            v-for="(item, index) in processList"
            :key="index"
            v-show="!item.isHide"
            :class="{selected: selectedFieldId === item.id}"
            @click="chooseProcess(item)"
          >{{ item.directory ? `${item.processName} ( ${item.directory} )` : item.processName }}</li>
        </ul>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class ProcessSelect extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  dialogVisible?: boolean;
  @Prop({
    type: Array,
    default: []
  })
  processList?: any;

  listLoading = false;
  formLabelWidth = "85px";
  searchFieldKey = "";
  selectedFieldId = "";
  selectedProcessItem = {};

  get isShowDialog() {
    return this.dialogVisible;
  }
  set isShowDialog(val) {
    this.$emit("update:dialogVisible", val);
  }

  created() {}
  mounted() {}
  // methods: {
  searchField(val: any) {
    this.processList.forEach((item: any) => {
      if (item.processName.indexOf(val) === -1) {
        item.isHide = true;
      } else {
        item.isHide = false;
      }
    });
  }
  chooseProcess(item: any) {
    this.selectedFieldId = item.id;
    this.selectedProcessItem = item;
  }
  save() {
    this.isShowDialog = false;
    this.$emit("addProcess", this.selectedProcessItem);
  }
  newProcess() {
    const routeUrl = this.$router.resolve({
      path: "/codeEdit",
      query: { id: null, currentDirId: 0 }
    } as any);
    window.open(routeUrl.href, "_blank");
  }
  // }
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
}
.field-list-wrap {
  height: 260px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  li {
    padding-left: 15px;
    height: 26px;
    line-height: 26px;
    cursor: pointer;
    &:hover {
      background-color: #e0dede;
    }
    &.selected {
      background-color: #e0dede;
    }
  }
}
</style>
