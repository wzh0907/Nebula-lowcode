<template>
  <el-dialog
    :title="title"
    width="680px"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <div v-loading="listLoading">
      <el-form ref="form" :model="formData" label-width="80px" label-position="top" size="small">
        <el-form-item label="签名规则名称">
          <el-input v-model="formData.name" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="签名参数">
          <el-radio-group v-model="formData.radio">
            <el-radio :label="'test'">部分参数</el-radio>
            <el-radio :label="6">全量参数正序</el-radio>
            <el-radio :label="9">全量参数倒序</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="即时配送">
          <el-switch v-model="formData.delivery"></el-switch>
        </el-form-item> -->
        <el-form-item v-if="formData.radio === 'test'">
          <!-- <el-input type="textarea" v-model="formData.desc"></el-input> -->
          <div class="selectTypesOpert">
            <el-checkbox-group>
              <draggable
                tag="ul"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in signParamsConfigs" :key="index">
                  <el-input v-model="item.key" style="width:90px;" size="mini" />
                  <div style="display: inline-block; padding: 0px 10px; font-size: 14px;">
                    =
                  </div>
                  <el-input v-model="item.value" :style="{'width': '90px' }" size="mini" />
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;">
                    <i class="iconfont iconbar" />
                  </i>
                  <el-button
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px;margin-left: 5px;"
                    @click="handleRemoveSignParams(index)"
                  />
                </li>
              </draggable>
            </el-checkbox-group>
            <div style="margin-left: 22px;">
              <el-button type="text" @click="handleAddSignParams">添加参数名</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="签名步骤">
          <!-- <el-input type="textarea" v-model="formData.desc"></el-input> -->
          <div class="selectTypesOpert">
            <el-checkbox-group>
              <draggable
                tag="ul"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in columnsConfigs" :key="index">
                  <el-select size="small" v-model="item.key" placeholder="请选择" style="width: 90px;">
                    <el-option
                      v-for="item in ['MD5', 'RSA']"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                  <div style="display: inline-block; padding-left: 10px; font-size: 14px;">
                    密钥：
                  </div>
                  <el-input v-model="item.value" :style="{'width': '90px' }" size="mini" />
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;">
                    <i class="iconfont iconbar" />
                  </i>
                  <el-button
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px;margin-left: 5px;"
                    @click="handleOptionsRemove(index)"
                  />
                </li>
              </draggable>
            </el-checkbox-group>
            <div style="margin-left: 22px;">
              <el-button type="text" @click="handleAddColumn">添加签名步骤</el-button>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary">保 存</el-button>
      <el-button type="danger" @click="isShowDialog = false">删 除</el-button>
      <el-button @click="isShowDialog = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTableFieldService } from "@/api/database";
import Draggable from 'vuedraggable'
export default {
  name: "Add",
  components: {
    Draggable
  },
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    tableName: {
      type: String,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: "签名规则定义",
      listLoading: false,
      formData: {
        radio: 'test'
      },
      columnsConfigs: [],
      signParamsConfigs: []
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    dialogOpen() {
      // this.dataList = []
      // this.$refs.dbForm && this.$refs.dbForm.resetFields()
      // this.getDetail()
    },
    getDetail() {
      if (!this.id) return;
      this.listLoading = true;
      getTableFieldService({
        dbConfigId: this.id,
        tableName: this.tableName,
      }).then((res) => {
        this.listLoading = false;
        this.dataList = res.dataList;
      });
    },
    // 双列输入框
    handleAddColumn() {
      // let obj = (!this.isEmptyObject(this.addColumnConfig) && JSON.parse(JSON.stringify(this.addColumnConfig))) || {
      //   value: "",
      // };
      let obj = {
        key: '',
        value: ''
      }
      // if (this.columnsConfigs[0] && this.columnsConfigs[0].componentList)
      //   obj.componentList = []; // TODO: 临时解决方法，待优化
      this.columnsConfigs.push(obj);
    },
    handleOptionsRemove(index) {
      this.columnsConfigs.splice(index, 1);
    },
    handleAddSignParams() {
      let obj = {
        key: '',
        value: ''
      }
      this.signParamsConfigs.push(obj);
    },
    handleRemoveSignParams(index) {
      this.signParamsConfigs.splice(index, 1);
    },
    // changeConfigValue(configOptions, configKey, value) {
    //   configOptions[configKey].value = value;
    // },
    // isEmptyObject(obj) {
    //   for (let key in obj) {
    //     return false;
    //   }
    //   return true;
    // }
  },
};
</script>

<style lang="scss" scoped>
ul,
li,
p {
  margin: 0;
  padding: 0;
}
.table-info {
  li {
    display: flex;
    line-height: 50px;
    text-align: left;
    border-bottom: 1px solid #ccc;
    p {
      flex: 1;
    }
  }
}
</style>
