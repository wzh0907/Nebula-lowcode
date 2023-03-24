<template>
  <div class="input_pre_total">
    <div class="input_pre_total_left">
      <!-- 图标选择 -->
      <div class="input_pre_coloumns">
        <minIconUpload :is-show-line-entity-icon="isShowLineEntityIcon || false" :icon-src="iconSrc" :config-options="configOptions" :config-key="configKey" @changeConfigValue="changeConfigValue" />
        <i v-if="type=='1'" style="fontSize:32px" :class="options.iconPreShow?'iconfont iconkejian':'iconfont iconbukejian'" @click="changeIconPreShow" />
        <i v-else style="fontSize:32px" :class="options.iconPosShow?'iconfont iconkejian':'iconfont iconbukejian'" @click="changeIconPreShow" />
      </div>
      <div class="input_pre_coloumns" v-if="!config.noInput">
        <el-input v-if="type=='1'" v-model="options.addonBefore" />
        <el-input v-else v-model="options.addonAfter" />
      </div>
    </div>

  </div>
</template>

<script>
import minIconUpload from '../../../basics-config/min-icon-upload.vue'
export default {
  name: 'ColumnsConfig',
  components: {
    minIconUpload
  },
  props: ['iconSrc', 'configOptions', 'configKey', 'isShowLineEntityIcon', 'options', 'type', 'config'],
  data() {
    return {
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    changeConfigValue(configOptions, configKey, value) {
      const that = this
      const obj = {
        configOptions: configOptions,
        configKey: configKey,
        value: value
      }
      that.$emit('changeConfigValue', obj)
    },
    // 是否显示icon
    changeIconPreShow() {
      this.$emit('changeIconPreShow', this.options)
    }

  }
}
</script>

<style lang="scss" scoped>
.input_pre_total{
  .input_pre_total_left{
    display: flex;
    margin: 5px 0;
    .input_pre_coloumns:nth-child(1){
        border: 1px dashed #d9d9d9;
        display: flex;
        margin-right: 5px;
        padding: 0 5px;
        i{
          padding-left: 10px;
        }
    }
  }
  .iconShow{
    color: #197aff;
  }
}

</style>
