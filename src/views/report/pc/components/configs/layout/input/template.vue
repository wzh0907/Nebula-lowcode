<template>
  <div class="custom_total_form_component">
        <label :class="options.required ? 'required' : ''"
          :style="{
            display:options.labelShow?'':'none',
            width:options.labelAlign=='top'?'100%':options.width+ 'px',textAlign:options.labelAlign=='top'?'left':options.labelAlign,
            lineHeight:options.size=='large'?'40px':options.size=='small'?'24px':'32px'
          }"
        >
        {{label}}
        </label>
        <div :style="{marginLeft:(options.labelAlign=='top' || !options.labelShow)?'':options.width+ 'px'}">
         <a-input-password
            v-if="options.isPassword"
            v-model="inputValue"
            :placeholder="placeholder"
            :size="options.size"
            :disabled="options.disabled"
            :addon-after="options.addonAfter"
            :addon-before="options.addonBefore"
            :max-length="options.maxlength"
            :allowClear="options.clearable"
          />
          <a-input
            v-else
            :placeholder="placeholder"
            v-model="inputValue"
            :size="options.size"
            :disabled="options.disabled"
            :addon-after="options.addonAfter"
            :addon-before="options.addonBefore"
            :max-length="options.maxlength"
            :allowClear="options.clearable"
            :type="options.inputType"
          >
          <span v-if="options.iconPreShow" slot="prefix">
             <i :class="options.customtimageIcon.fontClass"/>
          </span>
          <span v-if="options.iconPosShow" slot="suffix">
            <i :class="options.suffixIcon.fontClass" />
          </span>
        </a-input>
      </div>
  </div>
</template>

<script>
import optionsConfig from './options-config'
export default {
  name: "antdInputTemplate",
  components: {

  },
  data() {
    return {
      options:optionsConfig,
      value:options.value,
    };
  },
  watch: {
    // 'options.inputItoptionsemConfigs': {
    //   deep: true,
    //   handler(vals) {
    //     console.log(vals,"watch options.inputItoptionsemConfigs")
    //     vals && vals[0].componentList.forEach && this.initComponentConfig(vals[0].componentList)

    //   }
    // },
    "options.interfaceDataConfig": {
      deep: true,
      handler(vals) {
        if(vals.value){
          this.options.value = vals.value;
        }
      },
    },
    inputValue: {
				deep: true,
				handler(val, oldVal) {
					this.options.value=val
				},
			}
  },
  computed: {
    inputValue: {
        get() {
          if(this.options.interfaceDataConfig.uuid&&this.options.interfaceDataConfig.uuid!=''){
            this.options.value=this.options.interfaceDataConfig.value
            return this.options.interfaceDataConfig.value;
          }
          return this.options.value;
        },
        set(val) {
          this.options.interfaceDataConfig.uuid="";

          /**
           * Fix Bug：解决input第一次输入无反应的bug
           *
           * Bug原因：js微任务未执行完毕
           * 上面uuid赋值后，赋值options.value。这时候由于异步任务未执行结束 就执行get方法 uuid还是老数据不为空，if判断成立，代码执行逻辑不符合预期。
           *
           * 解决办法：异步问题
           * 等上面uuid赋值后，vue进行数据双向绑定，再赋值给options.value。这时候执行get方法uuid为空，if判断不成立，代码执行逻辑符合预期。
           */
          this.$nextTick(() => {
            this.options.value = val;
          })
        }
    },
    placeholder() {
      let language = navigator.language.substr(0, 2)
      if (language == 'zh') {
        return this.options.placeholder || this.options.enPlaceHolder
      } else {
        return this.options.enPlaceHolder || this.options.placeholder
      }
    },
    label() {
      let language = navigator.language.substr(0, 2)
      if (language == 'zh') {
        return this.options.label || this.options.enLabel
      } else {
        return this.options.enLabel || this.options.label
      }
    }
  },
  created() {},
  mounted() {

  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
