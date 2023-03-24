<template>
  <div class="filter-expr-view">
    <div class="filter-sider">
      <el-tabs v-model="tabHeaderView">
        <el-tab-pane label="字段" name="field">
          <ul class="field-wrap">
            <el-menu>
              <el-submenu v-for="(value, key) in dataTableInfoMap" :key="key" :index="String(key)">
                <template slot="title">
                  <div class="sider-table-title" :title="value[0] && value[0].tableName">
                    {{ value[0] && value[0].tableName }}
                  </div>
                </template>
                <el-menu-item v-for="(item, index) in value" :key="index" :index="String(key) + '-' + String(index)">
                  <div class="sider-field-item" :title="item.name" @click="insertText(`[${item.name}]`)">
                    {{ item.name }}
                  </div>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="函数" name="func">
          <ul class="func-wrap">
            <li v-for="(item, key) in funcTypeList" :key="key" @click="insertText(`${item}()`)">{{ item }}</li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="filter-sql-wrap">
      <div class="filter-sql-editor">
        <code-editor v-model="execSqlText" height="240px" :insertValue="insertValue" :mode="codeEditorMode" :editorOptions="editorOptions" v-if="isRenderCodeEditor" />
      </div>
      <div class="filter-sql-params">
        <sql-params-module :sqlParamList="sqlParamList" @onSetSqlParams="onGetSqlParams" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import codeEditor from '@/components/CodeEditor/index.vue'
import sqlParamsModule from '@/views/tableau-design/modules/common/sql-params-module.vue'

@Component({
  components: {
    codeEditor,
    sqlParamsModule
  }
})
export default class Process extends Vue {
  @Prop({
    type: String,
    default: ""
  })
  id?: any;
  @Prop({
    type: Object,
    default: {}
  })
  dataTableInfoMap?: any;

  funcTypeList = [
    'MAX',
    'MIN',
    'SUM',
    'AVE'
  ];
  tabHeaderView = 'field';
  codeEditorMode = 'sql';
  editorOptions = {
    showGutter: false
  };
  execSqlText = '';
  isRenderCodeEditor = true;
  insertValue = '';
  sqlParamList = [];

  created() {}
  mounted() {
    console.log(this.tabHeaderView)
  }
  insertText(text: any){
    this.insertValue = text
    this.$nextTick(() =>{
      this.insertValue = ''
    })
  }
  onGetSqlParams(){
    console.log('get sql params')
  }
}
</script>

<style lang="scss" scoped>
.fl {
  float: left;
}
/deep/.el-menu {
  border-right: none;
}
/deep/.el-submenu__title {
  padding-left: 0px !important;
  height: 32px;
  line-height: 32px;
}
/deep/.el-submenu__icon-arrow {
  left: 0px;
  right: initial;
}
/deep/.el-submenu .el-menu-item {
  height: auto;
  padding-left: 30px !important;
}
ul, li {
  margin: 0;
  padding: 0;
}
.filter-expr-view .filter-sider {
  /deep/.el-tabs__item {
    width: 110px;
    text-align: center;
  }
}
.filter-sider {
  position: absolute;
  width: 225px;
  height: 100%;
  overflow: auto;
  padding-bottom: 40px;
  border-right: 1px solid #E4E7ED;
  .sider-table-title {
    padding-left: 20px;
  }
  .sider-field-item {
    height: 32px;
    line-height: 32px;
  }
}
.filter-sql-wrap {
  display: flex;
  margin-left: 230px;
}
.filter-sql-editor {
  flex: 2;
  .func-wrap{
    li {
      padding-left: 10px;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      &:hover {
        background-color: #E8EBED;
      }
    }
  }
}
.filter-sql-params {
  flex: 1;
  // width: 600px;
  margin-top: -40px;
  margin-left: 20px;
}
</style>

