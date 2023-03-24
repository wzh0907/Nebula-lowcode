<template>
  <el-dialog
    title="高级设置"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
     @open="dialogOpen"
  >
    <div class="add-data-wrap">
      <el-form style="width:100%">
        <el-form-item label="增量字段">
          <el-select  v-model="trigger.name" @change="chosetrigger">
            <el-option :label="source.columnName" :value="source.columnName" v-for="(source,key) in columns" :key="key" ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="起始位置">
            <el-input v-model="startCondition" style="width:80%"/>
              <el-tooltip effect="dark" content="起始位置 demo：id>10086" placement="top">
                <i class="el-icon-info" style="cursor: pointer;"></i>
              </el-tooltip>
         </el-form-item>
      </el-form>
    </div>
     <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import DragDialog from '@/directive/drag-dialog'

export default {
  props: {
    visible: Boolean,
    loadingText: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "高级设置",
    },

    form: {
      type: Boolean,
      default: true,
    },
    action: {
      type: Boolean,
      default: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    showInterface: {
      type: Boolean,
      default: true,
    },
    sourceTable: {
      type: Array,
    },
    settingInfo: {
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: this.visible,
      dataDbList: [],
      trigger: {},
      startCondition: "",
      columns: this.sourceTable,
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    sourceTable(val) {
      this.columns = val;
    },
    settingInfo(val) {
      this.trigger = val.trigger;
      this.startCondition = val.start;
    },
  },
  created() {},
  mounted() {},
  methods: {
    dialogOpen() {
      this.trigger = {
       
      };
      this.startCondition = "";
      if (this.settingInfo.trigger) {
        this.trigger = this.settingInfo.trigger;
      }
      if(this.settingInfo.start){
        this.startCondition = this.settingInfo.start;
      }
    },
    save() {
      this.$emit("onSave", {
        trigger: this.trigger,
        start: this.startCondition,
      });
    },
    onClose() {
      this.$emit("onClose");
    },
    onSubmit() {
      if (this.selectedType === "radio-button-database") {
        if (this.selectedSubType === "table") {
          this.selectedData.type = "radio-button-tables";
        } else if (this.selectedSubType === "view") {
          this.selectedData.type = "radio-button-view";
        } else if (this.selectedSubType === "sql") {
          this.selectedData.type = "radio-button-sql";
        }
      } else {
        this.selectedData.type = "radio-button-interface";
      }
      this.$emit("onSubmit", {
        type: this.selectedData.type,
        id: generateUUID("data-interface-"), // this.selectedId,
        data: this.selectedData,
      });
    },
    chosetrigger(val) {
      this.columns.forEach((col) => {
        if (col.columnName === val) {
          if (col.columnType != "timestamp") {
            this.trigger.name = "";
            this.$message.error("目前增量字段必须为timestamp");
          } else {
            this.trigger.type = "timestamp";
          }
        }
      });
      // trigger type 有2中 key  和 timestamp
      // if(this.columns[index].columnType!='timestamp'){
      //   this.trigger.name="";
      //   this.$message.error("目前增量字段必须为timestamp");
      // }else{
      //   this.trigger.type="timestamp";
      // }
    },
    // on
  },
};
</script>

<style scoped lang="scss">
p {
  margin: 0;
  padding: 0;
}
.add-data-wrap {
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
/deep/.el-dialog__header {
}
/deep/.el-dialog__body {
  padding-bottom: 0px;
}
</style>
