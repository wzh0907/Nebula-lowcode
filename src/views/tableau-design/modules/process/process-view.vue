<template>
  <div class="process-view">
    <el-form size="mini" ref="dbForm" v-loading="listLoading" :model="dataForm">
      <el-form-item>
        <div class="add-list">
          <ul>
            <li
              v-for="(item, index) in processSelectedList"
              :key="index"
              :class="{selected: selectedCollectItemId === item.id}"
              @click="selectedCollectItemId = item.id"
            >
              <p>
                {{ item.directory ? `${item.processName} ( ${item.directory} )` : item.processName }}
              </p>
            </li>
          </ul>
        </div>
      </el-form-item>
      <el-form-item>
        <el-form size="mini" :inline="true">
          <el-form-item>
            <el-button @click="addList">添 加</el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button @click="editItem">编 辑</el-button>
          </el-form-item> -->
          <el-form-item>
            <el-button @click="deleteItem">移 除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="changePosition('up')">上 移</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="changePosition('down')">下 移</el-button>
          </el-form-item>
        </el-form>
      </el-form-item>
    </el-form>
    <process-select-dialog
      @addProcess="addProcess"
      :dialog-visible.sync="processSelectDialogVisible"
      :processList="processAllList"
    />
    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div> -->
  </div>
</template>

<script lang="ts">
import { getProcessListAllService } from "@/api/process.js";
import processSelectDialog from "./process-select-dialog.vue";
import { Vue, Prop, Component } from "vue-property-decorator";

@Component({
  components: {
    processSelectDialog
  }
})
export default class Process extends Vue {
  // @Prop({
  //   type: Boolean,
  //   default: false
  // })
  // dialogVisible?: boolean;
  @Prop({
    type: String,
    default: ""
  })
  id?: any;
  @Prop({
    type: String,
    default: ""
  })
  parentId?: any;
  @Prop({
    type: Array,
    default: []
  })
  processListData?: any

  processSelectDialogVisible = false;
  listLoading = false;
  formLabelWidth = "70px";
  dataForm = {};
  selectedCollectItemId = 1;
  processAllList = [];
  processSelectedList: any = [];

  // get isShowDialog() {
  //   return this.dialogVisible;
  // }
  // set isShowDialog(val) {
  //   this.$emit("update:dialogVisible", val);
  // }

  created() {
    this.queryProcessListService();
  }
  mounted() {
    this.dialogOpen()
  }
  addList() {
    this.processSelectDialogVisible = true;
  }
  editList() {}
  deleteItem() {
    let currentIndex = -1;
    let fieldItemList = [];
    fieldItemList = this.processSelectedList;
    this.processSelectedList.forEach((item: any, index: number) => {
      if (item.id === this.selectedCollectItemId) currentIndex = index;
    });
    if (currentIndex === -1) return this.$message("请选择数据!");
    fieldItemList.splice(currentIndex, 1);
    this.save()
  }
  changePosition(direction: any) {
    let currentIndex = -1;
    let fieldItemList = [];
    fieldItemList = this.processSelectedList;
    this.processSelectedList.forEach((item: any, index: number) => {
      if (item.id === this.selectedCollectItemId) currentIndex = index;
    });
    if (currentIndex === -1) return this.$message.warning("请选择数据!");
    if (direction === "up") {
      if (currentIndex === 0) {
        this.$message.warning("已到顶!");
      } else {
        const temp = fieldItemList.splice(currentIndex, 1);
        fieldItemList.splice(currentIndex - 1, 0, temp[0]);
        currentIndex -= 1;
      }
    } else {
      if (currentIndex === fieldItemList.length - 1) {
        this.$message.warning("已到底!");
      } else {
        const temp = fieldItemList.splice(currentIndex, 1);
        fieldItemList.splice(currentIndex + 1, 0, temp[0]);
        currentIndex += 1;
      }
    }
    this.save()
  }
  save() {
    this.$emit('onProcessData', this.processSelectedList)
    // this.isShowDialog = false
  }
  addProcess(processItem: any) {
    let isExist = false
    this.processSelectedList.forEach((item: any) => {
      if (item.id === processItem.id) {
        isExist = true
        this.$message.warning("该条数据已存在");
      }
    })
    if (!isExist) this.processSelectedList.push(processItem);
    this.save()
  }
  queryProcessListService() {
    this.listLoading = true;
    let params = {
      // queryType: "mine"
    };
    getProcessListAllService(params)
      .then((res: any) => {
        this.processAllList = res.dataList || [];
        this.listLoading = false;
      })
      .catch(() => {
        this.listLoading = false;
      });
  }
  dialogOpen() {
    this.dataForm = {};
    // @ts-ignore
    this.$refs.dbForm && this.$refs.dbForm.resetFields();

    if (this.processListData && this.processListData.length) {
      this.processSelectedList = this.processListData || []
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-form-item__content {
  margin-bottom: 10px;
}
/deep/.el-dialog__title {
  font-size: 16px;
}
.process-view {
  padding: 20px 0px 0px 40px;
}
.config-setting {
  width: 600px;
  ul {
    width: 100%;
    // margin-left: -45px;
    li {
      float: left;
      padding: 0 10px;
      i {
        cursor: pointer;
      }
      .common-style {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
.add-list {
  border: 1px solid #d6d6d6;
  border-radius: 4px;
  width: 600px;
  height: 260px;
  overflow-y: auto;
  ul {
    margin-left: -41px;
    .list-header {
      height: 35px;
      line-height: 35px;
    }
    li {
      height: 30px;
      line-height: 30px;
      padding: 0px 16px;
      cursor: pointer;
      border-bottom: 1px solid #ebeef5;
      font-size: 12px;
      p {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .selected {
      background: #409eff;
      color: #fff;
    }
  }
}
</style>

