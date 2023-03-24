<template>
  <div>
    <el-cascader
      v-model="actionItem.operateApiId"
      :props="props"
      :options="options"
      @change="handleChange">
    </el-cascader>
    <!-- 参数配置 -->
    <el-form v-if="actionItem.interfaceDataConfig.paramsConfigs.length > 0" size="small" label-width="70px" class="label-left">
      <div style="padding: 10px 0 0">入参</div>
      <el-form-item
        :label="item.param_name"
        v-for="(item, index) in actionItem.interfaceDataConfig.paramsConfigs"
        :key="index"
      >
        <valueSelect
          :paramItem="item"
          :isBind="true"
          @handleChange="handleParamChange"
          style="padding: 10px 0px"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import valueSelect from "@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue";
import {
  getFunctionList,
  getFunctionDetail
} from "@/api/function.js";

export default {
  name: "action-function",
  components: {
    valueSelect
  },
  data() {
    return {
      params: [],   //函数入参列表
      scriptList: [], //脚本列表
      functionList: [], //函数列表
      options: [
        {
          queryId: 'function',
          name: '函数',
          children: []
        },
        {
          queryId: 'script',
          name: '脚本',
          children: []
        }
      ],
      props: {
        // lazy: true,
        emitPath: false,
        value: 'queryId',
        label: 'name',
        // lazyLoad(node, resolve) {
        //   const {level} = node;
        //   console.log('node===', node)
        //   const nodes = []
        //   if (node.level === 1) {
        //     getFunctionList({
        //       dataType: 'report',
        //       functionType: node.value
        //     }).then(res => {
        //       res.dataList.map(item => {
        //         nodes.push({
        //           value: item.queryId,
        //           label: item.name,
        //           children: item.children,
        //           leaf: item.dataType === 'report'
        //         })
        //       })
        //       resolve(nodes);
        //     })
        //   } else {
        //     // console.log('node dataType=', node.data.dataType)
        //     // if (node.data.dataType === 'report') {
        //     //   const nodes = []
        //     //   getFunctionDetail({
        //     //     businessId: node.value
        //     //   }).then(res => {
        //     //     //returnObj,将其中所有的key解析出来
        //     //     let returnObj = JSON.parse(res.data.functionOutput)
        //     //     for (let key in returnObj) {
        //     //       console.log('key=', key)
        //     //       console.log('value=', returnObj[key])
        //     //       nodes.push({
        //     //         queryId: key,
        //     //         name: key,
        //     //         children: undefined
        //     //       })
        //     //     }
        //     //     console.log('nodes=', JSON.stringify(nodes))
        //     //   })
        //     //   resolve(nodes)
        //     // } else {
        //       resolve(node)
        //     // }
        //   }
        //
        //   // setTimeout(() => {
        //   //   const nodes = Array.from({length: level + 1})
        //   //     .map(item => ({
        //   //       value: ++id,
        //   //       label: `选项${id}`,
        //   //       leaf: level >= 2
        //   //     }));
        //   //   // 通过调用resolve将子节点数据返回，通知组件数据加载完成
        //   //   resolve(nodes);
        //   // }, 1000);
        // }
      }
    };
  },
  props: {
    actionItem: {
      type: Object,
      default: () => {
      },
    },
  },
  watch: {
    actionItem: {
      handler(newVal, oldVal) {
        this.singleInterfaceDataConfig = newVal.interfaceDataConfig;
      },
      deep: true,
    },
  },
  mounted() {
    console.log('actionItem===', JSON.stringify(this.actionItem))
    this.getScriptList()
    this.getFunctionList()
  },
  methods: {
    handleChange(value) {
      console.log('handleChange===', value);
      getFunctionDetail({
        businessId: value
      }).then(res => {
        console.log('scheme=', res.data.scheme)
        //解析函数的入参
        let scheme = res.data.scheme
        this.parseParams(scheme)
        // let returnObj = JSON.parse(res.data.functionOutput)
        // for (let key in returnObj) {
        //   console.log('key=', key)
        //   console.log('value=', returnObj[key])
        //   nodes.push({
        //     queryId: key,
        //     name: key,
        //     children: undefined
        //   })
        // }
      })
    },
    handleParamChange(data, paramItem) {
      paramItem.relevanceComponentUuid = data[1].id;
      if (data.length === 3) {
        paramItem.param_v_key = data[2].data.value;
      }
      console.log('paramItem====', JSON.stringify(paramItem))
    },
    parseParams(script) {
      this.params = []
      //解析参数,从括号中取出参数名
      let startIndex = script.indexOf('(')
      let endIndex = script.indexOf(')')
      //取出参数并去空格
      let paramString = script.slice(startIndex + 1, endIndex).replace(/\s*/g,"")
      this.params = paramString.split(',')
      this.actionItem.interfaceDataConfig.paramsConfigs = []
      this.params.map(param => {
        this.actionItem.interfaceDataConfig.paramsConfigs.push({
          param_name: param,
          param_value_type: 'T',
        })
      })
    },
    getFunctionList() {
      getFunctionList({
        dataType: 'report',
        functionType: 'function'
      }).then(res => {
        this.options[0].children = res.dataList || []
      })
    },
    getScriptList() {
      getFunctionList({
        dataType: 'report',
        functionType: 'script'
      }).then(res => {
        this.options[1].children = res.dataList || []
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.panel-del-btn {
  position: absolute;
  right: 5px;
  padding: 4px;
}

/deep/ .el-collapse-item__header {
  padding-left: 20px;
}

/deep/ .el-collapse-item__arrow {
  position: absolute;
  margin: 0;
  left: 0;
}

// 覆写el-label
.label-left /deep/ .el-form-item__label {
  float: left;
  line-height: 52px;
}
</style>
