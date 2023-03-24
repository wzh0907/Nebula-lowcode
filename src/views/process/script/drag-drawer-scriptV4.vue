<template>
  <!--  数据连接器  -->
  <div class="group-wrap connector-warp">
    <div class="group-content">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="节点名称">
          <el-input v-model="title" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <h3>自定义代码块</h3>
      <div style="display: flex">
        <CodeEditor
          v-model="script"
          :insertValue="insertValue"
          :editorOptions="editorOptions"
          :height="editorHeight"
          mode="js"
          width="100%"
        />
        <div style="background-color: #f8f8f8; width: 30%; padding: 10px">
          <div class="codeSnippetTitle">代码片段：</div>
          <ul>
            <li class="codeSnippet" @click="snippetHandler('getVar')">
              获得变量
            </li>
            <li class="codeSnippet" @click="snippetHandler('setVar')">
              设置变量
            </li>
            <li class="codeSnippet" @click="snippetHandler('dateFunction')">
              日期函数
            </li>
          </ul>
        </div>
      </div>

      <!-- <el-input v-model="script" type="textarea" :autosize="{minRows: 5,maxRows: 15}" placeholder="Enter something..." /> -->
    </div>
    <!-- <div class="group-btns">
      <el-row class="row-btns">
        <el-button class="btn btns-delete" type="error" @click="deleteItem">删除</el-button>
        <el-button class="btn btns-save" type="primary" @click="saveConfig('connectorForm')">保存</el-button>
      </el-row >
    </div> -->
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor";
const getVarCodeSnippet = `
def env = input.getEnv()
// 第一个参数为输入参数，输出参数，变量 等，第二个参数为自定义的变量名称
def params = env.getVar("变量","参数名").value[0]
`;
const setVarCodeSnippet = `
def env = input.getEnv()
// 第一个参数为输入参数，输出参数，变量 等，第二个参数为自定义的变量名称
env.assign("参数1.参数2", "你的值")
`;
const dateFunctionCodeSnippet = `
/**
  * 返回一个绝对值
  *
  * @param a    yyyy-MM-dd HH:mm:ss
  * @param b    yyyy-MM-dd HH:mm:ss
  * @param unit 默认day [day,hour,minute,second]
  * @return
  */
def diff = SYS_DATE_DIFF(a,b,unit)
SYS_DATE_ADD(a,b,unit)
SYS_DATE_SUB(a,b,unit)
SYS_DATE_NOW();
SYS_DATE_NOWTIME();
SYS_DATE_FORMAT(a,format)
SYS_DATE_FIRSTDAYOFLASTMONTH();
SYS_DATE_LASTDAYOFLASTMONTH();
SYS_DATE_1DAYOFWEEK();
SYS_DATE_7DAYOFWEEK();
SYS_DATE_FIRSTDAYOFMONTH();
SYS_DATE_LASTDAYOFMONTH();
SYS_DATE_FIRSTDAYOFYEAR();
SYS_DATE_LASTDAYOFYEAR();
`;

export default {
  name: "drag-drawer-scriptV4",
  components: { CodeEditor },
  props: {
    curDiagram: {
      type: Object,
    },
    processId: {
      type: Number,
      default: 0,
    },
    subType: {
      type: String,
      default: "connector-query",
    },
  },
  data() {
    return {
      script: "",
      insertValue: "",
      title: "",
      showName: "",
      editorHeight: "500px",
      editorOptions: {
        showGutter: true,
      },
    };
  },
  mounted() {
    var self = this;

    var properties = JSON.parse(
      JSON.stringify(this.curDiagram.getProperties())
    );
    console.log(properties, "properties");
    this.title = this.curDiagram.title;
    this.script = properties.script;
  },
  methods: {
    snippetHandler(key) {
      //TODO: 连续点击两次一样的代码片段时，不会触发编辑器刷新，暂时不知如何解决
      const codeSnippetDict = {
        getVar: getVarCodeSnippet,
        setVar: setVarCodeSnippet,
        dateFunction:dateFunctionCodeSnippet
      };
      // console.log(key, this.curDiagram.properties)

      this.insertValue = `\n${codeSnippetDict[key]}`;
    },
    saveConfig() {
      let configJson = {
        title: this.title,
        script: this.script,
      };
      console.log(configJson, "configJson");

      this.$emit("arguments", configJson);
    },

    deleteItem() {
      this.$emit("delete");
      this.$emit("cancel");
    },
  },

  watch: {},
};
</script>
<style lang='less' scoped>
.connector-warp {
  /deep/ .el-input {
    width: 180px;
  }

  /deep/ .el-input--suffix {
    width: 180px;
  }

  /deep/ .el-select {
    width: 180px;
  }

  /deep/ .menu-item-select-middle {
    width: 90px;
  }

  .menu-item-select-middle {
    /deep/ .el-input {
      width: 100%;
    }
  }
}

.mt10 {
  margin-top: 10px;
}

ul li {
  list-style-type: none;
}

.spp-box-list {
  border: 1px solid #d6d6d6;
  /*padding: 10px;*/
  border-radius: 5px;
  margin-top: 10px;
  min-height: 100px;
}

.spp-box-list li.atrItem:hover {
  background-color: #f6f6f6;
}

.spp-box-list li {
  cursor: pointer;
  line-height: 24px;
  padding: 0 5px;
}

.activeRow {
  background: #e5e5e5;
}

.group-wrap {
  position: relative;
  height: 100%;
}

.group-btns {
  border-top: 1px solid #dadada;
  background-color: white;
  position: absolute;
  padding-left: 15px;
  bottom: 0;
  left: 0;
  width: 100%;
}

.group-content {
  /*margin-bottom: 10px;*/
  height: calc(100% - 30px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
}

.param-btns {
  margin-top: 10px;
}

.param-btns .icon {
  margin-right: 10px;
}

.group-btns .btn {
  margin-right: 15px;
}

.data-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-option-name {
  font-weight: bold;
}

.data-option-dir {
  margin-top: 5px;
}

.condition-type-div {
  display: flex;
}

.condition-type-div div {
  border: 1px solid #000;
  border-radius: 5px;
  padding: 0px 15px;
  margin-right: 15px;
  cursor: pointer;
}

.condition-list-div {
  display: flex;
  margin: 5px 0;
}

.condition-list-span {
  margin: 10px 10px 0 10px;
}

.chosen-type {
  background-color: #0862ea;
  border: 1px solid #0862ea;
  color: #fff;
}

.menu-item-wrap {
  position: relative;

  ul {
    width: 90%;
    margin: auto;
    display: flex;
    background-color: #fff;
    box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    padding: 10px;
    z-index: 1;
  }

  ul li {
    position: relative;
    list-style-type: none;
    display: flex;
  }
}

.menu-item-li {
  margin: 5px 0px 0px 0px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 5px 10px;
  z-index: 2;
  position: relative;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  height: 50px;

  .tree-item-operator {
    font-size: 28px;
    line-height: 40px;
    padding: 0px 5px;
  }
}

.tree-item-text {
  white-space: nowrap;
  font-size: 16px;
  line-height: 40px;
  padding: 0px 5px;
}

.menu-item-select {
  /deep/ .el-cascader .el-input .el-input__inner {
    height: 30px;
  }

  /deep/ .el-input--suffix .el-input__inner {
    margin-top: 5px;
    height: 30px;
  }

  /deep/ .el-input__icon {
    line-height: 30px;
  }
}
codeSnippetTitle {
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
</style>
