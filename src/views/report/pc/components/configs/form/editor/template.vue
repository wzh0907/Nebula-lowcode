<template>
  <div class="custom_total_form_component">
    <label
      :class="options.required ? 'required' : ''"
      :style="{
            display: options.labelShow ? '' : 'none',
            width: options.labelAlign == 'top' ? '100%' : options.width + 'px',
            textAlign: options.labelAlign == 'top' ? 'left': options.labelAlign,
            lineHeight: options.size == 'large'?'40px': options.size == 'small' ? '24px' : '32px'
          }"
    >{{label}}</label>
    <div
      :style="{ marginLeft: (options.labelAlign == 'top' || !options.labelShow) ? '' : options.width + 'px'}"
    >
      <vue-editor
        v-model="options.value"
        :placeholder="options.placeholder"
        :disabled="options.disabled"
      ></vue-editor>
    </div>
  </div>
</template>

<script>
import optionsConfig from './options-config'
export default {
  name: 'antdInputTemplate',
  components: {},
  data() {
    return {
      options: optionsConfig,
      value: options.value
    }
  },
  watch: {
    'options.interfaceDataConfig': {
      deep: true,
      handler(vals) {
        if (vals.value) {
          this.options.value = vals.value
        }
      }
    },
    inputValue: {
      deep: true,
      handler(val, oldVal) {
        this.options.value = val
      }
    }
  },
  computed: {
    inputValue: {
      get() {
        if (
          this.options.interfaceDataConfig.uuid &&
          this.options.interfaceDataConfig.uuid != ''
        ) {
          this.options.value = this.options.interfaceDataConfig.value
          return this.options.interfaceDataConfig.value
        }
        return this.options.value
      },
      set(val) {
        this.options.interfaceDataConfig.uuid = ''
        this.options.value = val
      }
    },
    placeholder() {
      const language = navigator.language.substr(0, 2)
      if (language == 'zh') {
        return this.options.placeholder || this.options.enPlaceHolder
      } else {
        return this.options.enPlaceHolder || this.options.placeholder
      }
    },
    label() {
      const language = navigator.language.substr(0, 2)
      if (language == 'zh') {
        return this.options.label || this.options.enLabel
      } else {
        return this.options.enLabel || this.options.label
      }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
