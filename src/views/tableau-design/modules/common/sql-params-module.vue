<template>
  <div class="sql-params-view">
    <el-form ref="dsForm" width="600px">
      <el-form-item>
        <el-form-item class="config_setting">
          <ul>
            <li>
              <i class="iconfont iconjia" @click="addList" />
            </li>
            <li>
              <i class="iconfont iconbi1" @click="editList" />
            </li>
            <li>
              <i class="iconfont iconx" @click="deleList" />
            </li>
            <li>
              <i class="iconfont iconshang commonStyle" @click="changePosit(1)" />
            </li>
            <li>
              <i class="iconfont iconxia commonStyle" @click="changePosit(2)" />
            </li>
          </ul>
        </el-form-item>
        <el-form-item ref="sqlParamVOList">
          <div class="add-list">
            <ul>
              <li class="list-header">
                <p>名称</p>
                <!-- <p class="detail-info">默认值</p> -->
              </li>

              <li
                v-for="(item, index) in sqlParamVOList"
                :key="index"
                :class="{ selected: index === current}"
                @click="selectConfig(item,index)"
              >
                <p :title="item.name">{{ item.name }}</p>
                <!-- <p class="detail-info" :title="item.defaultValue">{{ item.defaultValue }}</p> -->
              </li>
            </ul>
          </div>
        </el-form-item>
      </el-form-item>
    </el-form>
    <sql-params-dialog
      :dialog-visible.sync="configVisible"
      :title="configTitle"
      :config-infos="configInfo"
      @submitAddConfig="submitAddConfig"
      @submitEditConfig="submitEditConfig"
    />
  </div>
</template>

<script>
import sqlParamsDialog from "./sql-params-dialog.vue";
export default {
  name: "sql-params-module",
  components: {
    sqlParamsDialog
  },
  props: {
    sqlParamList: {
      default: () => []
    }
  },
  data() {
    return {
      configVisible: false,
      configTitle: "test",
      configInfo: {},
      current: -1
    };
  },
  computed: {
    sqlParamVOList: {
      get() {
        return this.sqlParamList;
      }
    }
  },
  created(){},
  methods: {
    submitAddConfig(value) {
      this.sqlParamVOList.push(value)
      this.sqlParamVOList.forEach((item, index) => {
        item.index = index + 1
      })
    },
    submitEditConfig(value) {
      this.sqlParamVOList.splice(
        this.sqlParamVOList.findIndex(
          item => item.index === value.index), 1, value
      )
    },
    // 添加配置信息
    addList() {
      this.configVisible = true;
      this.configTitle = "添加配置";
      this.configInfo = {};
      this.selectConfigData = {};
      this.current = -1;
    },
    editList() {
      if (JSON.stringify(this.selectConfigData) === "{}") {
        this.$message("请选择编辑数据!");
      } else {
        this.configVisible = true;
        this.configTitle = "编辑配置";
        this.selectConfigData = this.sqlParamVOList[this.current];
        this.configInfo = { ...this.selectConfigData };
      }
    },
    deleList() {
      if (
        JSON.stringify(this.selectConfigData) === "{}" ||
        this.selectConfigData === undefined
      ) {
        this.$message("请选择要删除数据!");
      } else {
        this.sqlParamVOList.splice(this.current, 1);
        // this.current -= 1
        this.selectConfigData = this.sqlParamVOList[this.current];
      }
    },
    selectConfig(item, index) {
      this.current = index;
      this.selectConfigData = item;
    },
    changePosit(type) {
      if (this.current === -1) {
        this.$message("请选择数据!");
      } else {
        if (type === 1) {
          if (this.current === 0) {
            this.$message("已到顶!");
          } else {
            this.sqlParamVOList.splice(this.current, 1);
            this.sqlParamVOList.splice(
              this.current - 1,
              0,
              this.selectConfigData
            );
            this.current -= 1;
            this.selectConfigData = this.sqlParamVOList[this.current];
          }
        } else {
          if (this.current === this.sqlParamVOList.length - 1) {
            this.$message("已到底!");
          } else {
            this.sqlParamVOList.splice(this.current, 1);
            this.sqlParamVOList.splice(
              this.current + 1,
              0,
              this.selectConfigData
            );
            this.current += 1;
            this.selectConfigData = this.sqlParamVOList[this.current];
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.sql-params-view {
  // overflow: hidden;
}
.config_setting {
  width: 100%;
  ul {
    width: 100%;
    // margin-left: -45px;
    li {
      float: left;
      padding: 0 10px;
      i {
        cursor: pointer;
      }
      .commonStyle {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}

.add-list {
  border: 1px solid #d6d6d6;
  border-radius: 4px;
  // height: 165px;
  height: 238px;
  overflow-y: auto;
  ul {
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
        width: 40%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.detail-info {
          width: 60%;
          height: 100%;
          padding-left: 16px;
          border-left: 1px solid #ebeef5;
        }
      }
    }
    .selected {
      background: #409eff;
      color: #fff;
      .detail-info {
        border-left: 1px solid #fff;
      }
    }
  }
}
</style>
