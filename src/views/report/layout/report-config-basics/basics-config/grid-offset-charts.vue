<template>
  <div class="custom_text-content">
    <div style="">
      <el-input style="width: 100px; margin-left: 52px" v-model="componentConfig.options[config.key].top">
        <template slot="suffix">px</template>
      </el-input>
    </div>
    <div style="align-items: center; margin-bottom: 4px; margin-top: 4px;">
      <el-input style="width: 100px; margin-right: 8px"  v-model="componentConfig.options[config.key].left">
        <template slot="suffix">px</template>
      </el-input>
      <el-input style="width: 100px"  v-model="componentConfig.options[config.key].right">
        <template slot="suffix">px</template>
      </el-input>
    </div>
    <div style="">
      <el-input style="width: 100px; margin-left: 52px"  v-model="componentConfig.options[config.key].bottom">
        <template slot="suffix">px</template>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "grid-offset-charts",
  components: {},
  props: ['componentConfig','componentConfigKey', 'config'],
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
</style>
