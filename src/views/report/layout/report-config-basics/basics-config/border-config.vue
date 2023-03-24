<script>
/**
 * 功能说明：主要是边框的配置
 * 
 * 1、配置边框的颜色、粗细、线条形状
 * 
 */
export default {
  name: "columns-config",
  props: ["borderStyle"],
  data() {
    return {
      dirverTypeList: [
        {
          label: '实线',
          value: 'solid'
        }, {
          label: '点线',
          value: 'dotted'
        }, {
          label: '虚线',
          value: 'dashed'
        }
      ]
    };
  },
  methods: {},
};
</script>

<template>
  <div class="border-config">
    <span>
      <el-color-picker v-model="borderStyle.color" class="dirverColorPick" style="padding-top: 1px;" />
    </span>
    <span>
      <el-input-number v-model="borderStyle.size" class="space_border_size" :min="0" :step="0.5" controls-position="right" />
    </span>
    <span>
      <el-select v-model="borderStyle.style" style="width: 85px">
        <el-option v-for="item in dirverTypeList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.border-config {
  width: 100%;
  display: flex;
  margin-bottom: 5px;
  .space_border_size {
    width: 85px;
    // border: none;
    // border-bottom: 1px solid #ccc;
    // height: 28px;
    margin: 0 4px;
  }
}
</style>
