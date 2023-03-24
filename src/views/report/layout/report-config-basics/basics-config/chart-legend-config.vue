<script>
/**
 * xxxxxxxxxxx
 */
export default {
  name: 'chart-legend-config',
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
  <el-radio-group v-model="componentConfig.options[config.key]"
                  size="small"
                  style="padding-bottom: 10px; display: flex"
                  @change="changeRadioValue">
    <div class="set_custom_style">
      <el-radio-button v-for="(item, key) in config.typeConfigs" :key="key" :label="item.value">
        {{ item.label }}
      </el-radio-button>
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
