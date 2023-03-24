
<template>
  <div class="van-design-table">
    <table cellspacing="0" :style="options.bgcolor" style="width:100%" class="table" v-if="options.optionColumn.length">
      <tr class="tr">
        <th class="th" v-for="(item, index) in options.optionColumn" :key="index">{{ item.label }}</th>
      </tr>
      <tr class="tr list-tr" v-for="(item, index) in options.interfaceDataConfig.tableData" :key="index">
        <td class="td" v-for="(context, i) in options.optionColumn" :key="i">{{ item[context.prop] }}</td>
      </tr>
    </table>
    <div style="height: 50px; background-color: #f2f3f5;"></div>
  </div>
</template>
<script>
import optionsConfig from "./options-config";
export default {
  data() {
    return {
      options: optionsConfig
    };
  },
  computed: {},
  // watch: {
  //   "options.interfaceDataConfig": {
  //     deep: true,
  //     handler(val) {
  //       this.initData();
  //     },
  //   },
  // },
  created(){
    this.onListenerEvent()
  },
  methods: {
    onListenerEvent(){
      // console.log('create popup', this.options.commonConfigAssignSign)
      window.addEventListener(`${this.options.triggerComponentId}-on-confirm-sidebar-popup`, this.handleEventFunc)
    },
    handleEventFunc(resData){
      if (!this.options.generateComponentsUUID) return false
      let eventHandle = new CustomEvent(`${this.options.generateComponentsUUID}-on-preload-handle-btn-confirm`, {
        detail: {
          eventType: 'click',
          data: {
            actionList: [
              {
                actionType: 'event-operate-refresh',
                operateRefresh: [this.options.commonConfigAssignSign],
              }
            ]
          }
        }
      })
      window.dispatchEvent(eventHandle)
    }
  }
};
</script>

<style lang="scss" scoped>
.van-design-table {
  min-height: 50px;
  .table {
    border-radius: 1.8px;
    text-align: center;
    .tr {
      display: flex;
      .th, .td {
        flex: 1;
      }
    }
    .th {
      padding: 14px 0;
      border-top-left-radius: 1.8px;
      border-top-right-radius: 1.8px;
    }
    .list-tr {
      padding: 6px 0;
    }
    .list-tr:nth-child(2n) {
      background-color: #f5f5f5;
    }
  }
}
</style>