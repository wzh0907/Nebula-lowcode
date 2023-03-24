<template>
  <div style="padding: 20px; background-color: white; height: 100%; display: flex">
    <el-tabs v-model="activeSettingName" @tab-click="handleClick" style="flex: 1">
      <el-tab-pane label="系统设置" name="first">
        <div style="display: flex; margin-top: 10px; align-items: center">
          <div style="flex: 1;">
            系统名称
          </div>
          <el-button
            type="primary"
            @click="saveProjectSetting">
            保 存
          </el-button>
          <el-button
            @click="deleteProject"
          >
            删 除
          </el-button>
        </div>

        <el-input style="width: 40%"
                  v-model="connectDetail.dataSourceName"
                  size="small" placeholder="请输入系统名称">
        </el-input>
        <div style="margin-top: 50px; display: flex">
          <div style="width: 40%">
            <div style="margin-top: 10px; margin-bottom: 10px">测试环境地址</div>
            <el-input
              v-model="connectDetail.dbHost"
              size="small"
              placeholder="请输入测试环境地址">
            </el-input>
          </div>
          <div style="margin-left: 10%; width: 40%">
            <div style="margin-top: 10px; margin-bottom: 10px">生产环境地址</div>
            <el-input
              v-model="connectDetail.dbHostProd"
              size="small"
              placeholder="请输入生产环境地址">
            </el-input>
          </div>
        </div>
        <div style="margin-top: 50px">
          <div style="margin-top: 10px; margin-bottom: 10px">备注</div>
          <el-input style="width: 100%"
                    v-model="connectDetail.remark"
                    :rows="10"
                    type="textarea"
                    placeholder="请输入备注">
          </el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane label="公共脚本" name="second">
        <el-collapse v-model="beforeCollapse">
          <el-collapse-item v-for="(item, key) in scriptList" :name="key" :key="key">
            <template slot="title">
              <div style="flex: 1">
                {{ item.preName }}
              </div>
              <el-button
                size="small"
                type="primary"
                style="margin-right: 10px"
                @click.stop="saveScript(item)">
                保 存
              </el-button>
              <el-button
                size="small"
                type="danger"
                style="margin-right: 10px"
                @click.stop="deleteScript(item)">
                删 除
              </el-button>
            </template>
            <div style="display:flex;">
              <CodeEditor
                v-model="item.beforeCalling"
                :insertValue="item.insertValue"
                height="280px"
                width="70%"
                mode="groovy"
                :editor-options="{showGutter: false}"
              />
              <div style="background-color: #f8f8f8; width: 30%; padding: 10px">
                <div class="codeSnippetTitle">
                  代码片段：
                </div>
                <ul>
                  <li class="codeSnippet" @click="snippetHandler(0, key)">获取环境变量</li>
                  <li class="codeSnippet" @click="snippetHandler(1, key)">设置环境变量</li>
                  <li class="codeSnippet" @click="snippetHandler(2, key)">获取临时变量</li>
                  <li class="codeSnippet" @click="snippetHandler(3, key)">设置临时变量</li>
                  <li class="codeSnippet" @click="snippetHandler(4, key)">请求接口</li>
                </ul>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-button style="margin: 10px auto; display: block" @click="addScript">
          添加公共脚本
        </el-button>
      </el-tab-pane>
    </el-tabs>
    <connectPreDialog
      :dialog-visible.sync="connectPreVisible"
      :name="chosenConnectPre.preName"
      @onSave="saveConnectPre"
    />
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor";
import connectPreDialog from "./module/connectPre.vue";
import {getdeitalService} from "@/api/database";
import {getConnectPreListService, saveConnectPreService, deleteConnectPreService} from "@/api/connect-pre";
import {delDatabaseV4, updateDatabaseV4} from "@/api/v4";

export default {
  name: "project-setting",
  components: {
    CodeEditor,
    connectPreDialog
  },
  props: {
    id: Number
  },
  data() {
    return {
      activeSettingName: 'first',
      connectDetail: {},
      systemName: '',
      devUrl: '',
      prodUrl: '',
      connectPreVisible: false,
      chosenConnectPre: {},
      beforeCollapse: [0],
      afterCollapse: [0],
      insertValue: '',
      scriptList: [],
      snippetList: [
        "pm.environment.get(\"variable_key\");",
        "pm.environment.set(\"variable_key\", \"variable_value\");",
        "pm.variables.get(\"variable_key\");",
        "pm.variables.set(\"variable_key\", \"variable_value\");",
        "pm.sendRequest(\"https://www.api.com/xxx\", function (err, response) {\n" +
        "    console.log(response.json());\n" +
        "});"
      ],
      // scriptList: [{
      //   beforeCalling:
      //     "def prepost(String url, String method, Map<String, String> headers, Map<String, String> params) {" +
      //     "\n\n" +
      //     "}",
      //   afterCalling:
      //     "def afterpost(Map<String, Object> response) {" + "\n\n" + "}",
      // },{
      //   beforeCalling:
      //     "def prepost(String url, String method, Map<String, String> headers, Map<String, String> params) {" +
      //     "\n\n" +
      //     "}",
      //   afterCalling:
      //     "def afterpost(Map<String, Object> response) {" + "\n\n" + "}",
      // }],
      // connectScript:
    }
  },
  watch: {
    id(val) {
      this.getDetail()
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    deleteScript(item) {
      this.$confirm("确认删除？")
        .then((_) => {
          deleteConnectPreService({
            businessConnectId: item.id,
          }).then((res) => {
            this.getConnectPreList()
          });
        })
        .catch((_) => {});
    },
    saveScript(item) {
      this.chosenConnectPre = item
      this.connectPreVisible = true
    },
    saveConnectPre(preName) {
      this.connectPreVisible = false
      this.chosenConnectPre.preName = preName;
      if (!this.chosenConnectPre.id) {
        delete this.chosenConnectPre.id;
      }
      this.chosenConnectPre.connectId = this.id;
      saveConnectPreService(this.chosenConnectPre).then((res) => {
        this.$message.success("保存成功");
        this.getConnectPreList();
      });
    },
    getDetail() {
      if (!this.id) return
      this.listLoading = true
      getdeitalService({
        configId: this.id
      }).then(res => {
        this.listLoading = false
        this.connectDetail = res.data
        // if (this.dataForm.productInfoId) this.queryProductVersion(this.dataForm.productInfoId)
      })
    },
    addScript() {
      this.scriptList.push(
        {
          beforeCalling:
            "def prepost(String url, String method, Map<String, String> headers, Map<String, String> params) {" +
            "\n\n" +
            "}",
          afterCalling:
            "def afterpost(Map<String, Object> response) {" + "\n\n" + "}",
        }
      )
      this.beforeCollapse = [this.scriptList.length - 1]
    },
    handleClick(tab) {
      //前置和后置操作
      if (tab.index == 1 || tab.index == 2) {
        this.getConnectPreList()
      }
    },
    onDragMoveEnd(item) {
      this.swapArray(this.scriptList, item.newIndex, item.oldIndex)
    },
    snippetHandler(index, collapseIndex) {
      //TODO: 连续点击两次一样的代码片段时，不会触发编辑器刷新，暂时不知如何解决
      this.scriptList[collapseIndex].insertValue = "\n" + this.snippetList[index]
      this.$forceUpdate()
    },
    swapArray(array, index1, index2) {
      let temp = array[index1];
      array[index1] = array[index2];
      array[index2] = temp;
    },
    getConnectPreList() {
      let param = {
        connectId: this.id,
      };
      getConnectPreListService(param).then((res) => {
        this.scriptList = res.dataList;
      });
    },
    saveProjectSetting() {
      const params = {
        dataSourceName: this.connectDetail.dataSourceName,
        dbHost: this.connectDetail.dbHost,
        dbHostProd: this.connectDetail.dbHostProd,
        remark: this.connectDetail.remark
      }
      params.id = this.id
      params.type = 'connect'
      updateDatabaseV4(params).then(res => {
        this.$emit('saveProject', this.connectDetail.dataSourceName)
      })
    },
    deleteProject() {
      this.$confirm("确认删除本项目？")
        .then((_) => {
          delDatabaseV4({
            configId: this.id,
          }).then((res) => {
            this.$emit('deleteProject')
          });
        })
        .catch((_) => {});
    }
  }
}
</script>

<style scoped>
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
