<template>
  <div class="value-config" style="padding: 10px 0px">
    <el-form size="small" label-width="70px">
      <el-form-item label="选项数据" v-if="containInputFormBase">
        <el-radio-group v-model="options.contentDataSource">
          <el-radio-button label="radio-button-interface"
            >关联数据</el-radio-button
          >
          <el-radio-button label="radio-button-default"
            >选项定义</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <div
        v-if="
          containInputFormBase &&
          options.contentDataSource == 'radio-button-interface'
        "
      >
        <valuesConfig
          :componentConfig="componentConfig"
          @onUpdateOptionsConfig="onUpdateOptionsConfig"
          @onChangeValuesConfig="onChangeValuesConfig"
        />
        <div class="value-select-div">
          <el-select
            v-model="options.imgKey"
            size="mini"
            placeholder="请选择图片地址"
            clearable
          >
            <el-option
              v-for="item in valuesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="options.linkKey"
            size="mini"
            placeholder="请选择跳转地址"
            clearable
          >
            <el-option
              v-for="item in valuesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div
        v-if="
          containInputFormBase &&
          options.contentDataSource == 'radio-button-default'
        "
      >
        <el-checkbox-group>
          <draggable
            tag="ul"
            v-bind="{
              group: { name: 'options' },
              ghostClass: 'ghost',
              handle: '.drag-item',
            }"
            handle=".drag-item"
          >
            <li
              v-for="(item, index) in options.swipeImgList"
              :key="index"
              style="display: flex; margin-bottom: 10px; align-items: center"
            >
              <!-- <el-input
                v-model="item.value"
                style="width: 90px"
                size="mini"
                placeholder="名称"
              /> -->
              <div style="display: inline-block; margin: 0 20px 0 0">
                <imgUpload
                  :imgSrc="item.value"
                  @changeConfigValue="changeConfigValue"
                  :configOptions="options.swipeImgList"
                  :configKey="index"
                />
              </div>

              <el-input
                v-model="item.link"
                :style="{ width: '90px' }"
                size="mini"
                placeholder="跳转地址"
              />

              <i class="iconfont iconbar columns-icon drag-item" />

              <i
                class="iconfont icontrash columns-icon"
                @click="handleOptionsRemove(index)"
              />
            </li>
          </draggable>
        </el-checkbox-group>
        <div style="margin-left: 22px">
          <el-button type="text" @click="handleAddColumn">{{
            addBtnText || "添加列"
          }}</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import valuesConfig from "./values-config.vue";
import columnsValuesConfig from "@/views/report/layout/report-config-basics/basics-config/columns-values-config.vue";

import imgUpload from "@/views/report/layout/report-config-basics/basics-config/img-upload.vue";
import { inputFormBaseComponent } from "@/views/report/utils/common-const.js";
import Draggable from 'vuedraggable'
// modules
export default {
  components: { valuesConfig, columnsValuesConfig, imgUpload,Draggable },
  props: {
    componentConfig: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      addColumnConfig: {
        label: "",
        value: "",
      },
      addBtnText: "添加选项",
      valuesList: [],
    };
  },
  watch: {},
  computed: {
    options() {
      console.log("componentConfig", this.componentConfig);
      return this.componentConfig.options;
    },
    containInputFormBase() {
      return inputFormBaseComponent.indexOf(this.componentConfig.type) == -1;
      //  return false;
    },
    echoConfig() {
      // input 组件的设置  不是回显 ，直接放在interfaceDataConfig
      if (
        this.componentConfig.type == "van-design-field" ||
        this.componentConfig.type == "van-design-calendar" ||
        this.componentConfig.type == "van-design-datetime-picker"
      ) {
        return false;
      }
      return true;
    },
  },

  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    handleAddColumn() {
      let obj = (!this.isEmptyObject(this.addColumnConfig) &&
        JSON.parse(JSON.stringify(this.addColumnConfig))) || {
        value: "",
      };
      if (this.options.swipeImgList[0] && this.options.swipeImgList[0].componentList)
        obj.componentList = []; // TODO: 临时解决方法，待优化
      this.options.swipeImgList.push(obj);
    },
    changeConfigValue(configOptions, configKey, value) {
      configOptions[configKey].value = value;
    },

    onUpdateOptionsConfig() {
      this.$emit("onUpdateOptionsConfig");
    },
    handleOptionsRemove(index) {
      if (this.options.swipeImgList.length <= 1) return false;
      this.options.swipeImgList.splice(index, 1)
    },
    onChangeValuesConfig(data) {
      this.valuesList = [];
      if (data.length > 1) {
        if (data[1].data.value && data[1].data.value.length > 0) {
          let vallist = data[1].data.value[0];
          for (var key in vallist) {
            this.valuesList.push({ label: key, value: key });
          }
        }
      }
    },
    isEmptyObject(obj) {
      for (let key in obj) {
        return false;
      }
      return true;
    }
  },
};
</script>
<style scoped lang="scss">
/deep/.el-cascader .el-input .el-input__inner::-webkit-input-placeholder {
  color: #333;
}
/deep/.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
.value-select-div {
  display: flex;
}
.form-set {
  /deep/.el-form-item__label {
    line-height: 52px;
  }
}
</style>
