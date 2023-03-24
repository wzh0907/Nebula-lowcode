<template>
  <div
    class="tab ant-progress ant-progress-line ant-progress-status-normal ant-progress-show-info ant-progress-default"
  >
    <div>
      <div class="ant-progress-outer-new">
        <div class="ant-progress-inner-new">
          <div
            class="ant-progress-bg-new"
            :style="{
              width:
                (options.contentDataSource === 'radio-button-default'
                  ? Math.ceil((options.rateValue * 100) / options.maxValue)
                  : options.interfaceDataConfig.rateValue
                  ? Math.ceil(
                      (options.interfaceDataConfig.rateValue * 100) /
                        options.interfaceDataConfig.maxValue
                    )
                  : 0) + '%',
              height: options.strokeWidth + 'px',
              background: options.color,
            }"
            :title="
              (options.contentDataSource === 'radio-button-default'
                ? options.rateValue
                : options.interfaceDataConfig.rateValue) + '%'
            "
          ></div>
        </div>
        <span
          v-if="
            options.contentDataSource === 'radio-button-default' &&
            options.numberShow
          "
          class="ant-progress-text-new"
          >{{ options.rateValue }}/{{ options.maxValue }}</span
        >
        <span
          v-if="
            options.contentDataSource !== 'radio-button-default' &&
            options.numberShow
          "
          title="2%"
          class="ant-progress-text-new"
          >{{
            options.interfaceDataConfig.rateValue
              ? options.interfaceDataConfig.rateValue
              : 0
          }}/
          {{
            options.interfaceDataConfig.maxValue
              ? options.interfaceDataConfig.maxValue
              : 0
          }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProcessCommonTemplate",
  data() {
    return {};
  },
  props: ["options"],
  computed: {},
  watch: {},
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.ant-progress-outer {
  display: flex;
  height: 100%;
}
.ant-progress-inner-new {
  height: 100%;
  position: relative;
  display: inline-block;
  width: 100%;
  overflow: hidden;
  vertical-align: middle;
  background-color: #f5f5f5;
  border-radius: 100px;
}
.ant-progress-text-new {
  width: auto;
  display: inline-block;
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 1em;
  line-height: 1;
  white-space: nowrap;
  text-align: left;
  vertical-align: middle;
  word-break: normal;
}
.ant-progress-outer-new {
  margin-right: 0;
  padding-right: 0;
  display: flex;
  height: 100%;
}
.ant-progress-bg-new {
  position: relative;
  background-color: #1890ff;
  border-radius: 100px;
  -webkit-transition: all 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
  transition: all 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
}
</style>
