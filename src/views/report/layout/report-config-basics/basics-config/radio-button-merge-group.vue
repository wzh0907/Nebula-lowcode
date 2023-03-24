<script>
/**
 * xxxxxxxxxxx
 */
export default {
  name: 'RadioButtonGroup',
  props: ['componentConfig', 'componentConfigKey', 'config'],
  data() {
    return {
      formType: '',
      formKey: '',
      formTypeConfigs: [],
      formSelectMultiple: false
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    changeIsShowLabel() {
      this.$emit('changeIsShowLabel', this.componentConfig.options)
    },
    changeRadioValue(value) {
      let isThePick = false
      this.config.typeConfigs.forEach(item => {
        if (item.value === value && item.formType) {
          isThePick = true
          this.formType = item.formType
          this.formKey = item.key
          this.formTypeConfigs = item.typeConfigs
          this.formSelectMultiple = item.isSelectMultiple
        }
      })
      if (!isThePick) {
        this.formType = ''
        this.formKey = ''
        this.formTypeConfigs = []
        this.formSelectMultiple = false
      }
    }
  }
}
</script>

<template>
  <!-- 方块单选 -->
  <el-radio-group v-model="componentConfig.options[config.key]" size="small" style="padding-bottom: 10px;" @change="changeRadioValue">
    <template v-if="componentConfigKey ==='labelAlign' || componentConfigKey ==='contentPosition' || componentConfigKey === 'orientation'">
      <div class="set_custom_style">
        <el-radio-button v-for="(item, key) in config.typeConfigs" :key="key" :label="item.value">
          <i :title="item.label" :class="item.icon" style="fontSize:10px" class="iconfont" />
        </el-radio-button>
        <el-input v-model="componentConfig.options[config.setData.width]" type="number" :min="0" :step="1" />
        <i style="fontSize:32px" :class="componentConfig.options.labelShow?'iconfont iconkejian':'iconfont iconbukejian'" @click="changeIsShowLabel" />
      </div>
      <!-- <el-switch
          v-model="componentConfig.options[config.setData.labelShow]"
        >
        </el-switch> -->
    </template>
    <template v-else>
      <el-radio-button v-for="(item, key) in config.typeConfigs" :key="key" :label="item.value">
        {{ item.label }}
      </el-radio-button>
    </template>
    <!-- 测试使用 -->
    <!-- <div style="padding-top: 10px;" v-if="formType === 'event-event'">
      <el-input v-model="componentConfig.options.operateCallApi" placeholder="请输入API地址"></el-input>
    </div>
    <div style="padding-top: 10px;" v-if="formType === 'event-event'">
      <columns-config :columnsConfigs="componentConfig.options.operateTest" :placeholderText="'输入标识'" addBtnText="添加标识" columnsConfigType="input" />
    </div> -->
    <!-- 第二值 -->
    <div v-if="formType === 'input'" style="padding-top: 10px;">
      <el-input v-model="componentConfig.options[formKey]" />
    </div>
    <div v-if="formType === 'select'" style="padding-top: 10px;">
      <el-select v-model="componentConfig.options[formKey]" :multiple="formSelectMultiple" placeholder="请选择">
        <el-option
          v-for="(item, key) in formTypeConfigs"
          :key="key"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </el-radio-group>
</template>

<style lang="scss" scoped>
.set_custom_style{
  display: flex;
  /deep/.el-input-number--small{
      width: 110px;
  }
  /deep/.el-radio-button--small .el-radio-button__inner{
    padding: 9px 6px;
  }
  .iconShow{
    color: #197aff;
  }
}
</style>
