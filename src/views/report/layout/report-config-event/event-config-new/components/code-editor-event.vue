<template>
    <div class="code-editor-event" style="display: flex;">
      <CodeEditor
        v-model="beforeCalling"
        :insertValue="insertValue"
        height="350px"
        width="100%"
        mode="js"
        :editor-options="{showGutter: false}"
        @input="onCodeInput"
      />

      <div style="background-color: #f8f8f8; width: 165px; padding: 10px">
        <div class="codeSnippetTitle">
          代码片段：
        </div>
        <ul>
          <li class="codeSnippet" @click="snippetHandler('getComponents')">
            获取组件
            <el-tooltip class="item" effect="dark" content="通过组件名获取匹配的组件列表" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="snippetHandler('getComponentValue')">
            获取组件值
            <el-tooltip class="item" effect="dark" content="通过获取到的组件获取组件值" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="snippetHandler('setComponentValue')">
            设置组件值
            <el-tooltip class="item" effect="dark" content="通过获取到的组件设置组件值" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="snippetHandler('toggleComponentDisplay')">
            显隐组件
            <el-tooltip class="item" effect="dark" content="控制组件的显示隐藏" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="snippetHandler('showComponentDisplay')">
            显示组件
            <el-tooltip class="item" effect="dark" content="显示组件" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="snippetHandler('hideComponentDisplay')">
            隐藏组件
            <el-tooltip class="item" effect="dark" content="隐藏组件" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="snippetHandler('refreshComponentData')">
            组件刷新
            <el-tooltip class="item" effect="dark" content="传入获取到的组件引用刷新该组件的数据" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="codeSnippet" @click="snippetHandler('getPageParamsData')">
            页面入参
            <el-tooltip class="item" effect="dark" content="页面入参" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
           <li class="codeSnippet" @click="snippetHandler('getGloableParamsData')">
            全局变量
            <el-tooltip class="item" effect="dark" content="全局变量" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor";

const getComponentsCodeSnippet = 
`// 返回页面所有名称为【component_name】的组件数组，
var coms = pm.components.get('component_name');`

const getPageParamsDataCodeSnippet = 
`// 返回页面的所有参数，使用【params.参数名】获得单一参数值
var params = pm.page.getParams();
var value=params.参数名;`

const getGlobalParamsDataCodeSnippet = 
`// 返回全局变量的所有参数，使用pm.global.getParamByName 获取单个范围里的单一参数值，使用pm.global.saveParamByName 保存全局变量
var params = pm.global.getParams();
var param = pm.global.getParamByName('scopeName', 'variableKey');
pm.global.saveParamByName('scopeName', 'variableKey','value');`
export default {
  name: 'CodeEditorEvent',
  components: {
    CodeEditor
  },
  props: {
    curDiagram: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      beforeCalling: '',
      insertValue: ''
    }
  },
  created() {
    this.beforeCalling = this.curDiagram.properties.sourceCodeStr
  },
  methods: {
    onCodeInput(value) {
      this.curDiagram.properties.sourceCodeStr = value
    },
    snippetHandler (key) {
      const codeSnippetDict = {
        getComponents: getComponentsCodeSnippet,
        getComponentValue: `pm.components.getValue(component);`,
        setComponentValue: `pm.components.setValue(component, 'value');`,
        toggleComponentDisplay: `pm.components.toggle(component);`,
        showComponentDisplay: `pm.components.show(component);`,
        hideComponentDisplay: `pm.components.hide(component);`,
        refreshComponentData: `pm.components.refreshData(component);`,
        getPageParamsData: getPageParamsDataCodeSnippet,
        getGloableParamsData:getGlobalParamsDataCodeSnippet,
      }
      // console.log(key, this.curDiagram.properties)

      this.insertValue = `\n${codeSnippetDict[key]}`
    }
  }
}
</script>

<style lang="scss" scoped>
.code-editor-event {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 360px;
  padding: 0px 10px;

  background-color: #fff;
}

.codeSnippetTitle {
  height: 30px;
  line-height: 30px;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 500;
}

.codeSnippet {
  cursor: pointer;
  padding-left: 10px;
  height: 30px;
  line-height: 30px;
  color: #1890ff;
}

.codeSnippet:hover {
  background-color: #ede9f9;
}
</style>
