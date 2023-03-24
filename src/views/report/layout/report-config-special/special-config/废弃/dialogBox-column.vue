<template>
  <div>
      <el-form>
          <el-form-item label="名称">
            <el-input
              v-model="dialogBoxValueConfig.options.commonConfigAssignName"
              placeholder="请输入状态值"
              size="mini"
              style="width: 120px"
            />
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  props: ["dialogBoxValueConfig"],
  data() {
    return {
    };
  },
  watch: {
    // 'dialogBoxValueConfig': {
    //   deep: true,
    //   handler(val) {
    //   }
    // }
  },
  computed: {
  },
  created() {

  },
  methods: {

  }
};
</script>
<style scoped lang="scss">
</style>
