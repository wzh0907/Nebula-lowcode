<template>
  <el-dialog :title="title" width="600px" :visible.sync="isShowDialog" @open="dialogOpen">
    <div class="connect-type">
      <div
        class="connect-type-bolck"
        :class="{active: joinType === 'left'}"
        @click="joinType = 'left'"
      >
        <img src="../images/left.png" alt />
        <p>左侧</p>
      </div>
      <div
        class="connect-type-bolck"
        :class="{active: joinType === 'inner'}"
        @click="joinType = 'inner'"
      >
        <img src="../images/in.png" alt />
        <p>内部</p>
      </div>
      <div
        class="connect-type-bolck"
        :class="{active: joinType === 'right'}"
        @click="joinType = 'right'"
      >
        <img src="../images/right.png" alt />
        <p>右侧</p>
      </div>
    </div>
    <div class="connect-field-table">
      <el-table
        v-loading="listLoading"
        :data="connectFieldList"
        element-loading-text="Loading"
        highlight-current-row
        stripe
        style="width: 100%;"
      >
        <el-table-column
          :label="selectedLeftTableList[0] && selectedLeftTableList[0].tableName"
          width="180"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.dataSource"
              filterable
              placeholder="选择关联字段"
              size="mini"
              @change="checkConnectFiedl"
            >
              <el-option
                v-for="(item, key) in selectedLeftTableList"
                :key="key"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="180">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.connectType"
              filterable
              placeholder="请选择联接方式"
              size="mini"
              @change="checkConnectFiedl"
            >
              <el-option
                v-for="item in connectTypes"
                :key="item.label"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          :label="selectedRightTableList[0] && selectedRightTableList[0].tableName"
          width="180"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.tableField"
              filterable
              placeholder="选择关联字段"
              size="mini"
              @change="checkConnectFiedl"
            >
              <el-option
                v-for="(item, key) in selectedRightTableList"
                :key="key"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class ConnectionTable extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  dialogVisible?: boolean;
  @Prop({
    type: String,
    default: ''
  })
  title?: string;
  @Prop({
    type: Number,
    default: 0
  })
  parentId?: number;
  @Prop({
    type: Number,
    default: 0
  })
  rightId?: number;
  @Prop({
    type: String,
    default: ''
  })
  joinTypeProps?: string;
  @Prop({
    type: Array,
    default: []
  })
  connectFieldListProps?: any;
  @Prop({
    type: Array,
    default: []
  })
  selectedLeftTableList?: any;
  @Prop({
    type: Array,
    default: []
  })
  selectedRightTableList?: any;

  listLoading = false;
  formLabelWidth = "120px";
  dataForm = {};
  joinType = "inner";
  connectFieldList: any = [
    {
      connectType: "="
    }
  ];
  connectTypes = [
    {
      label: "="
    },
    {
      label: "<>"
    },
    {
      label: "<"
    },
    {
      label: "<="
    },
    {
      label: ">"
    },
    {
      label: ">="
    }
  ];

  get isShowDialog() {
    return this.dialogVisible;
  }
  set isShowDialog(val) {
    this.$emit("update:dialogVisible", val);
  }
  created() {}
  mounted() {}
  checkConnectFiedl() {
    const lastItem = this.connectFieldList[this.connectFieldList.length - 1];
    if (lastItem.dataSource && lastItem.connectType && lastItem.tableField) {
      this.connectFieldList.push({
        connectType: "="
      });
    }
  }
  save() {
    let lastItem = this.connectFieldList[this.connectFieldList.length - 1];
    if (!lastItem.dataSource || !lastItem.connectType || !lastItem.tableField)
      this.connectFieldList.pop();
    const parentConnectData = {
      parentNodeId: Number(this.parentId),
      rightId: this.rightId,
      joinType: this.joinType,
      connectFieldList: this.connectFieldList
    };
    this.$emit("getConnectData", parentConnectData);
    return (this.isShowDialog = false);
  }
  dialogOpen() {
    this.joinType = this.joinTypeProps || '';
    this.connectFieldList = this.connectFieldListProps;
    if (!this.connectFieldList.length)
      this.connectFieldList.push({
        connectType: "="
      });
    let lastItem = this.connectFieldList[this.connectFieldList.length - 1];
    if (lastItem.dataSource && lastItem.connectType && lastItem.tableField) {
      this.connectFieldList.push({
        connectType: "="
      });
    }
  }
}
</script>

<style lang="scss" scoped>
ul,
p {
  margin: 0;
  padding: 0;
}
.connect-type {
  display: flex;
  .connect-type-bolck {
    flex: 1;
    padding: 10px 0px;
    cursor: pointer;
    text-align: center;
    // &:hover {
    //   background-color: #ccc;
    // }
    &.active {
      background-color: #ccc;
    }
    img {
      width: 40px;
    }
  }
}
.connect-field-table {
  padding-top: 20px;
}
</style>
