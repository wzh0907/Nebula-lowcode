<script>
/**
 * xxxxxxxxxxx
 */
export default {
  name: 'CommonConfigSize',
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
  <div style="display: flex; flex-direction: row">
    <el-select
      style="flex: 2"
      v-model="componentConfig.options[config.key]"
      placeholder="请选择"
    >
      <el-option
        v-for="item in config.typeConfigs"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-input :disabled="componentConfig.options[config.key] === 'auto'"
              style="flex: 3; margin-left: 8px"
              v-model="componentConfig.options[config.setData.size]"/>
  </div>
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
