<template>
  <div>
    <div class="app-container">
      <div class="left-container">
        <a-tabs v-model="tabKey" @change="tabClick">
          <a-tab-pane key="function" tab="函数">
            <div>
              <a-button style="" type="link" size="small">
                新建函数
              </a-button>
              <a-button style="float: right" type="link" size="small">
                新建分组
              </a-button>
            </div>
          </a-tab-pane>
          <a-tab-pane key="script" tab="脚本" force-render>
            <div>
              <a-button style="" type="link" size="small" @click="addScript">
                新建脚本
              </a-button>

              <a-button type="link" style="float:right;" size="small" @click="showAddGroupDialog = true">
                新建分组
              </a-button>
              <a-tree
                :tree-data="scriptList"
                :replaceFields="{title: 'name', key: 'treeId', children:'children'}"
                @select="onSelectTreeNode"
              >
                <template slot="custom" slot-scope="item">
                  <a-popover placement="right">
                    <template slot="content">
                      <ul class="file-popover-menu">
                        <li v-if="item.dataType == 'scope'" @click="addScriptInGroup(item)">
                          新建脚本
                        </li>
                        <li v-if="item.dataType == 'scope'" @click="deleteScriptGroup(item)">
                          删除分组
                        </li>
                        <li v-if="item.dataType != 'scope'" @click="deleteScript(item)">
                          删除脚本
                        </li>
                      </ul>
                    </template>
                    <div style="width: 160px">{{ item.name }}</div>
                  </a-popover>
                </template>
              </a-tree>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="right-container">
        <EditScript v-show="showEditScript"
                    ref="editScript"
                    :type="type"
                    @saveScript="saveScript"
                    @deleteScript="deleteScript">
        </EditScript>
      </div>
    </div>
    <a-modal v-model="showAddGroupDialog" title="添加分组" @ok="addScriptGroup">
      <a-form :form="form" autoComplete="off">
        <a-form-item :required="true">
          <a-input @change="groupNameChanged" placeholder="请输入分组名称"
                   v-decorator="['note', { rules: [{ required: true, message: '分组名称不能为空!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import EditScript from './edit-script.vue'
import {
  addFunctionGroup,
  getFunctionList,
  deleteFunction,
  deleteFunctionGroup
} from "@/api/function.js";

export default {
  name: "index",
  components: {
    EditScript
  },
  props: {
    //类型:  report:前端  process:后端
    type: {
      type: String,
      default: 'report'
    },
  },
  data() {
    return {
      tabKey: 'script',
      groupName: '',
      showEditScript: false,
      showAddGroupDialog: false,
      functionList: [],
      scriptList: [],
      currentScriptId: '',
      form: this.$form.createForm(this, {name: 'dynamic_rule'}),
    }
  },
  mounted() {
    this.getFunctionList()
  },
  methods: {
    groupNameChanged(value) {
      this.groupName = value.target.value
    },
    getFunctionList() {
      getFunctionList({
        dataType: this.type,
        functionType: this.tabKey
      }).then(res => {
        this.scriptList = res['dataList'] || []
        //因为最多嵌套一层(分组->脚本),就不用递归了
        for (const scriptListElement of this.scriptList) {
          scriptListElement.scopedSlots = {
            title: 'custom'
          }
          if (scriptListElement.children != undefined && scriptListElement.children.length > 0) {
            for (const scriptListElementElement of scriptListElement.children) {
              scriptListElementElement.scopedSlots = {
                title: 'custom'
              }
            }
          }
        }
      })
    },
    tabClick(key) {

    },
    addScript() {
      this.showEditScript = true
      this.$refs.editScript.openScriptEdit()
    },
    addScriptInGroup(item) {
      this.showEditScript = true
      this.$refs.editScript.openScriptEdit(item.queryId)
    },
    addScriptGroup() {
      this.form.validateFields(err => {
        if (!err) {
          this.showAddGroupDialog = false
          addFunctionGroup({
            functionType: this.tabKey,
            scopeName: this.groupName,
            type: this.type
          }).then(res => {
            this.getFunctionList()
          })
        }
      });
    },
    saveScript() {
      this.getFunctionList()
    },
    deleteScript(item) {
      this.$confirm("请确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteFunction({
            businessId: item.queryId
          }).then(res => {
              this.getFunctionList()
              if (this.currentScriptId === item.queryId) {
                this.showEditScript = false
              }
            }
          )
        })
    },
    deleteScriptGroup(item) {
      this.$confirm("请确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteFunctionGroup({
            businessScopeId: item.queryId
          }).then(res => {
              this.getFunctionList()
            }
          )
        })
    },
    onSelectTreeNode(keys) {
      let li = this.tree2list(this.scriptList)
      let scriptObj = li.find(element => element.treeId == keys[0])
      //scope代表分组
      if (scriptObj != undefined && scriptObj.dataType != 'scope') {
        this.showEditScript = true
        this.currentScriptId = scriptObj.queryId
        this.$refs.editScript.getFunctionDetail(scriptObj.queryId)
      }
    },

    tree2list(tree) {
      const list = []
      const queue = [...tree]
      while (queue.length) {
        const node = queue.shift()
        const children = node.children
        if (children) {
          queue.push(...children)
        }
        list.push(node)
      }
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  height: 100vh;
  background-color: white;
  border-radius: 0;
}

.left-container {
  float: left;
  font-size: 18px;
  width: 240px;
  padding: 10px;
  background-color: white;
  border-right: 1px solid #e4e5e6;
  overflow-y: auto;
  height: 100%;
}

.right-container {
  height: 100%;
  flex: 1;
  padding: 16px;
}

.file-popover-menu {
  margin: 0;
  padding: 0;
  font-size: 13px;

  li {
    padding: 5px 10px 5px 5px;
    cursor: pointer;
  }

  li:hover {
    color: #409eff;
    background-color: #f5f5f5;
  }
}
</style>
