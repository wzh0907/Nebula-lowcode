<template>
  <div>
    <el-input v-model="options[config.key]" type="textarea">
    </el-input>
    <el-popover
      v-model="visible"
      placement="bottom"
      width="300"
      trigger="click">
      <i :style="style" style="cursor: pointer" slot="reference" @click="globalHandler" class="iconfont iconglobal global"></i>
      <div>
        <div class="row">
          <div class="title">中文</div>
          <el-input v-model="options[config.key]" placeholder="请输入中文"></el-input>
        </div>
        <div class="row" style="margin-top: 16px">
          <div class="title">英文</div>
          <el-input v-model="options[config.enKey]" placeholder="请输入英文"></el-input>
        </div>
        <el-button @click="visible = false" type="primary" class="confirm-button">确定</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script>

export default {
  name: 'i18n-input',
  props: {
    options: Object,
    config: Object,
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    style() {
      const hasI18N = (this.options[this.config.key] != null && this.options[this.config.key].length > 0) && (this.options[this.config.enKey] != null && this.options[this.config.enKey].length > 0)
      if (hasI18N) {
        return {
          backgroundColor: '#409EFF',
          color: 'white'
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    globalHandler() {
    }
  }
}
</script>

<style scoped>
.global {
  font-size: 20px;
  padding: 2px;
  border-top-right-radius: 4px;
  position: absolute;
  right: 0;
  top: 0;
}

.row{
  display: flex;
  align-items: center;
}

.title {
  width: 50px;
}

.confirm-button {
  width: 100%;
  margin-top: 16px;
}
</style>
