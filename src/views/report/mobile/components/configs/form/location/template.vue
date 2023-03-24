<template>
  <div :style="{
          'color': options.locationEditorConfig.textColor,
          'background': options.locationEditorConfig.textBgColor,
          'fontSize': options.locationEditorConfig.textHtmlSize +'px',
          'textAlign': options.locationEditorConfig.textHtmlPosit || (options.commonConfig && options.commonConfig.textAlign),
          'fontWeight': options.locationEditorConfig.textHtmlBlod,
          'fontStyle': options.locationEditorConfig.textHtmlTilt,
          'textDecoration': options.locationEditorConfig.textHtmlUnder,
          'lineHeight':'32px'
        }">{{options.value}}</div>
</template>

<script>
import optionsConfig from './options-config'

export default {
  name: "locationTemplate",
  components: {
  },
  data() {
    return {
      options: optionsConfig
    };
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>

</style>
