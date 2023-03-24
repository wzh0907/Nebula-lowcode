<template>
  <div class="process-bar">
    <div class="processContainer" :style="{height: options.height + 'px', backgroundColor: options.backgroundColor}">
      <ul class="processTypes">
        <li
          v-for="(item, key) in options.proportionDataList"
          :key="key"
          :style="{
            width: options.totalProportData ? parseInt(item.value / options.totalProportData * 100) + '%' : '',
            background: item.color
          }"
        />
      </ul>
    </div>
    <div class="processTipInfo">
      <ul>
        <li v-for="(item, key) in options.proportionDataList" :key="key">
          <span class="processTip" :style="{background: item.color}" />
          <span class="processTitle">
            {{ item.name }}
            <span>{{ options.totalProportData ? parseInt(item.value / options.totalProportData * 100) + '%' : '' }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import optionsConfig from './options-config'
export default {
  name: "ProcessBarTemplate",
  data() {
    return {
      options: optionsConfig
    };
  },
  computed: {},
  watch: {
    'options.interfaceDataConfig': {
      deep: true,
      handler(val) {
        this.initData()
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData(){
      let chartSettingsDimension = this.options.interfaceDataConfig.chartSettings.dimension
      let chartSettingsMetrics = this.options.interfaceDataConfig.chartSettings.metrics
      let dimensionKey = (typeof chartSettingsDimension === 'object') ? (chartSettingsDimension[0] || '') : chartSettingsDimension
      let columnsKey = (typeof chartSettingsMetrics === 'object') ? (chartSettingsMetrics[0] || '') : chartSettingsMetrics
      let rows = this.options.interfaceDataConfig.chartData.rows
      let list = []
      let totalProportData = 0
      let processColorDict = ['#5ab1ef', '#19d4ae', '#fa6e86', '#ffb980', '#0071b6', '#c4b4e4', '#ffdf33', '#8f9bcc', '#7ba3a8', '#ca605d', '#00da3c', '#4600ff']
      rows.forEach(item => {
        let dimension = item[dimensionKey]
        let columns = item[columnsKey]
        totalProportData += columns
        list.push({
          name: dimension,
          value: columns,
          color: '#fff'
        })
      })
      list.forEach((item, index) => {
        item.color = processColorDict[index] || '#fff'
      })
      this.options.proportionDataList = list
      this.options.totalProportData = totalProportData
    }
  },
};
</script>

<style lang="scss" scoped>
.process-bar {
  ul {
    padding-inline-start: 0;
    margin-block-end: 0;
  }
}
.processContainer {
  height: 10px;
  width: 100%;
  // background-color: #aaa;
  border-radius: 5px;
  ul {
    margin-block-start: 0;
    padding-inline-start: 0;
  }
  .processTypes {
    height: 100%;
    li {
      list-style: none;
      float: left;
      // height: 10px;
      height: 100%;
      position: relative;
      /* border-radius: 5px; */
    }
    li:first-child {
      // background: #5ab1ef;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    li:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
  // .processItem {
  //   position: absolute;
  //   height: 10px;
  //   width: 100%;
  //   border-radius: 5px;
  // }
  // .processItem .processItem2 {
  //   width: 80%;
  //   background: rgb(255, 0, 0);
  //   position: absolute;
  //   margin-left: 20%;
  // }
}
.processTipInfo {
  ul {
    li {
      float: left;
      margin-right: 20px;
    }
  }
  .processTip {
    width: 8px;
    height: 8px;
    margin-right: 6px;
    display: inline-block;
    // background: #ff0000;
  }
  span:last-child {
    font-size: 12px;
    color: #969696;
  }
}
</style>
