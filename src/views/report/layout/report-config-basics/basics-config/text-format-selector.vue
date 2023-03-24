<template>
  <div class="text-format-selector">
    <el-select
      v-model="value"
      @change="formatTypeChangeHandler"
    >
      <el-option
        v-for="item in formatTypeList"
        :key="item.type"
        :label="item.name"
        :value="item.type"
      />
    </el-select>
  </div>
</template>

<script>
import { formatTypeList, FormatType } from '@/views/report/utils/deal-text-format/format-def'

export default {
  name: 'text-format-selector',
  data() {
    return {
      curFormat: FormatType.NORMAL_TEXT,
      formatTypeList
    }
  },
  props: {
     value: {
      type: String,
      default: FormatType.NORMAL_TEXT,
    },
  },
  methods: {
    formatTypeChangeHandler(formatType) {
      this.$emit('input', formatType)
    }
  },
  created() {
    this.curFormat = this.value
    console.log('created:',this.value);
  }
}
</script>

<style scoped>

</style>
