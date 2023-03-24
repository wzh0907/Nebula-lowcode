<template>
  <!--  <div-->
  <!--    class="com-text"-->
  <!--    :style="{-->
  <!--   'color': options.styleEditorConfig.textColor,-->
  <!--     'background': options.styleEditorConfig.textBgColor,-->
  <!--    'fontSize': options.styleEditorConfig.textHtmlSize +'px',-->
  <!--     'textAlign': options.styleEditorConfig.textHtmlPosit || (options.commonConfig && options.commonConfig.textAlign),-->
  <!--     'fontWeight': options.styleEditorConfig.textHtmlBlod,-->
  <!--     'fontStyle': options.styleEditorConfig.textHtmlTilt,-->
  <!--     'textDecoration': options.styleEditorConfig.textHtmlUnder-->
  <!--   }"-->
  <!--  >-->
  <!--   <span style="width:100%">-->
  <!--   {{ formatFunction(getDisplayText()) }}-->
  <!-- </span>-->
  <!--  </div>-->
  <van-count-down :auto-start="false" :time="options.value*1000">
    <template #default="timeData">
      <span :style="customStyle">{{ timeData.days.toString().padStart(2, '0') }}</span>
      <span :style="colonStyle">天</span>
      <span :style="customStyle">{{ timeData.hours.toString().padStart(2, '0') }}</span>
      <span :style="colonStyle">:</span>
      <span :style="customStyle">{{timeData.minutes.toString().padStart(2, '0') }}</span>
      <span :style="colonStyle">:</span>
      <span :style="customStyle">{{timeData.seconds.toString().padStart(2, '0') }}</span>
    </template>
  </van-count-down>
  <!--  <van-count-down-->
  <!--    ref="countDown"-->
  <!--    :time="options.time*1000"-->
  <!--    :auto-start="false"-->
  <!--    format="HH:mm:ss"-->
  <!--    @finish="onFinish"-->
  <!--  />-->
</template>

<script>
import optionsConfig from './options-config'

export default {
  name: 'sliderTemplate',
  components: {},
  data() {
    return {
      options: optionsConfig
    }
  },
  computed: {
    customStyle() {
      let style = {
        'display': 'inline-block',
        'padding': '5px',
        'borderRadius': '4px',
        'color': this.options.styleEditorConfig.textColor,
        'background': this.options.styleEditorConfig.textBgColor,
        'fontSize': this.options.styleEditorConfig.textHtmlSize + 'px',
        'textAlign': this.options.styleEditorConfig.textHtmlPosit || (this.options.commonConfig && this.options.commonConfig.textAlign),
        'fontWeight': this.options.styleEditorConfig.textHtmlBlod,
        'fontStyle': this.options.styleEditorConfig.textHtmlTilt,
        'textDecoration': this.options.styleEditorConfig.textHtmlUnder
      }
      return style
    },
    colonStyle() {
      let style = {
        'display': 'inline-block',
        'margin': '0 4px',
        'color': '#333',
        'fontSize': this.options.styleEditorConfig.textHtmlSize + 'px',
        'fontWeight': this.options.styleEditorConfig.textHtmlBlod
      }
      return style
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
