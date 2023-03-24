<template>
  <div style="height: 100%;">
    <FlowPanel
      ref="flowPanel"
      :eventList="eventList"
      :chooseEventType="chooseEventType"
      @foldUp="data => {this.$emit('foldUp', data)}"
      @onClickNode="data => {this.$emit('onClickNode', data)}"
      @onClickLine="data => {this.$emit('onClickLine', data)}"
    />
  </div>
</template>

<script>
import './flow-components/index.css'
import FlowPanel from './flow-components/index.vue'
export default {
  name: "new-event-demo",
  components: {
    FlowPanel
  },
  props: {
    eventList: {
      type: Array,
      default: () => []
    },
    chooseEventType:{
      type: String,
    }
  },
  data() {
    return {

    };
  },
  methods: {
    updateFlowPanel(data){
      this.$refs.flowPanel.updateFlowPanel(data)
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
