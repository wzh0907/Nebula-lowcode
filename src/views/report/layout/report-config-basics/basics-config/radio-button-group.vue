<script>
/**
 * 功能说明：方块按钮组的值选择
 */
export default {
  name: "radio-button-group",
  props: ["componentConfig", "componentConfigKey", "config"],
  data() {
    return {
      formType: "",
      formKey: "",
      formTypeConfigs: [],
      formSelectMultiple: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    changeRadioValue(value) {
      let isThePick = false;
      this.config.typeConfigs.forEach(item => {
        if (item.value === value && item.formType) {
          isThePick = true;
          this.formType = item.formType;
          this.formKey = item.key;
          this.formTypeConfigs = item.typeConfigs;
          this.formSelectMultiple = item.isSelectMultiple;
        }
        //2021-11-28 特殊处理 部分组件css 样式
        if (item.value === value && item.commonConfig) {
          this.componentConfig.options.commonConfig = item.commonConfig;
        }
        if (item.value === value && item.styleEditorConfig) {
          this.componentConfig.options.styleEditorConfig =
            item.styleEditorConfig;
        }
      });
      if (!isThePick) {
        this.formType = "";
        this.formKey = "";
        this.formTypeConfigs = [];
        this.formSelectMultiple = false;
      }

      if(this.componentConfigKey=='layoutMargin'){
        this.componentConfig.options.commonConfig.topSpaceDistance=value
        this.componentConfig.options.commonConfig.bottomSpaceDistance=
        this.componentConfig.options.commonConfig.leftSpaceDistance=
        this.componentConfig.options.commonConfig.rightSpaceDistance=
        this.componentConfig.options.commonConfig.topPaddingDistance=
        this.componentConfig.options.commonConfig.bottomPaddingDistance=
        this.componentConfig.options.commonConfig.leftPaddingDistance=
        this.componentConfig.options.commonConfig.rightPaddingDistance=value
      }
      if(this.componentConfigKey=='layoutBorder'){
        this.componentConfig.options.commonConfig.borderBottomRightRadius=
        this.componentConfig.options.commonConfig.borderBottomLeftRadius=
        this.componentConfig.options.commonConfig.borderTopRightRadius=
        this.componentConfig.options.commonConfig.borderTopLeftRadius=value
      }
    }
  }
};
</script>

<template>
  <!-- 方块单选 -->
  <el-radio-group
    v-model="componentConfig.options[config.key]"
    size="small"
    style="padding-bottom: 10px;"
    @change="changeRadioValue"
  >
    <template
      v-if="
        componentConfigKey === 'labelAlign' ||
        componentConfigKey === 'valueAlign' ||
          componentConfigKey === 'contentPosition' ||
          componentConfigKey === 'orientation' ||
          componentConfigKey === 'labelVerticalAlign'
      "
    >
      <el-radio-button
        :label="item.value"
        v-for="(item, key) in config.typeConfigs"
        :key="key"
      >
        <i
          :title="item.label"
          :class="item.icon"
          style="fontSize:10px"
          class="iconfont"
        ></i>
      </el-radio-button>
    </template>
    <template v-else>
      <el-radio-button
        :label="item.value"
        v-for="(item, key) in config.typeConfigs"
        :key="key"
      >
        {{ item.label }}
      </el-radio-button>
    </template>
    <!-- 第二值 -->
    <div v-if="formType === 'input'">
      <el-input v-model="componentConfig.options[formKey]"></el-input>
    </div>
    <div v-if="formType === 'select'">
      <el-select
        :multiple="formSelectMultiple"
        v-model="componentConfig.options[formKey]"
        placeholder="请选择"
      >
        <el-option
          v-for="(item, key) in formTypeConfigs"
          :key="key"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
  </el-radio-group>
</template>

<style lang="scss" scoped></style>
