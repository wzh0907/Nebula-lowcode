<template>
  <div class="test-container">
    <div class="run-container">
      <i class="iconfont iconcaret-right run-button" @click="runScript"></i>
      <i class="iconfont iconshanchu close-button" @click="closeScript"></i>
    </div>
    <div class="test-column-container" style="flex: 1">
      <div class="title-text">入参</div>
      <div v-for="item in params" class="param-view">
        <div style="width: 80px; flex-shrink: 0">
          {{item.name}}
        </div>
        <a-input style="margin-left: 8px" v-model="item.value"/>
      </div>
    </div>
    <div class="test-column-container" style="flex: 2">
      <div class="title-text">出参</div>
      <div v-if="isMap">
        <div v-for="item in returnParams" class="param-view">
          <div style="width: 80px; flex-shrink: 0">
            {{item.key}}:
          </div>
          <div>
            {{item.value}}
          </div>
        </div>
      </div>
      <div v-else class="param-view" style="color: red">
        {{errorResult}}
      </div>
    </div>
    <div v-if="type != 'report'" class="test-column-container" style="border-right: none; flex: 2;">
      <div class="title-text">日志</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "test-script",
  props: {
    //类型:  report:前端  process:后端
    type: {
      type: String,
      default: 'report'
    },
  },
  data() {
    return {
      script: '',
      params: [],
      returnParams: [],
      isMap: true,
      result: '',
      errorResult: ''
    }
  },
  mounted() {
    this.parseParams()
  },
  methods: {
    parseParams(script) {
      this.script = script
      this.params = []
      //解析参数,从括号中取出参数名
      let startIndex = script.indexOf('(')
      let endIndex = script.indexOf(')')
      //取出参数并去空格
      let paramString = script.slice(startIndex + 1, endIndex).replace(/\s*/g,"")
      let paramArray = paramString.split(',')
      for (const paramArrayElement of paramArray) {
        this.params.push({
          name: paramArrayElement,
          value: ''
        })
      }
    },
    runScript() {
      //取出参数的值
      let values = []
      for (const param of this.params) {
        values.push(param.value)
      }
      let func = new Function('return ' + this.script)
      this.result = func()(...values)
      if (this.result instanceof Map) {
        this.returnParams = []
        this.isMap = true
        this.errorResult = ''
        let obj = Object.create(null)
        for (let [returnKey, returnValue] of this.result) {
          this.returnParams.push({
            key: returnKey,
            value: returnValue
          })
          obj[returnKey] = returnValue
        }
        this.$emit('runTest', JSON.stringify(obj))
      } else {
        this.isMap = false
        this.errorResult = '返回值必须是Map类型'
        this.$emit('runTest', '')
      }
    },
    closeScript() {
      this.$emit('closeTest')
    }
  }
}
</script>

<style scoped>
.run-container {
  display: flex;
  flex-direction: column;
  /*justify-content: space-around;*/
  border-right: 1px solid #cccccc;
  width: 35px;
  align-items: center;
}

.run-button {
  cursor: pointer;
  color: #139f3b;
  font-size: 30px;
}

.close-button {
  cursor: pointer;
  color: #333333;
  font-size: 30px;
}

.test-container {
  display: flex;
  height: 300px;
  /*box-sizing: border-box;*/
  /*margin: 8px;*/
  /*border: 1px solid #cccccc;*/
}

.test-column-container {
  /*height: 100%;*/
  flex: 1;
  border-right: 1px solid #cccccc;
  padding: 8px;
  overflow-y: scroll;
}

.title-text {
  font-size: 14px;
  font-weight: bold;
}

.param-view {
  display: flex;
  height: 40px;
  align-items: center;
}
</style>
