<template>
  <div class="filter-expr-view" v-show="filterType === 'expr'">
    <div class="filter-sider">
      <el-tabs v-model="tabHeaderView">
        <el-tab-pane label="字段" name="field">
          <ul class="field-wrap" :style="{height: siderListHeight}">
            <el-menu>
              <el-submenu v-for="(value, key) in dataTableInfoMap" :key="key" :index="String(key)">
                <template slot="title">
                  <div class="sider-table-title" :title="value[0] && value[0].tableName">
                    {{ value[0] && value[0].tableName }}
                  </div>
                </template>
                <el-menu-item v-for="(item, index) in value" :key="index" :index="String(key) + '-' + String(index)">
                  <div class="sider-field-item" :title="item.name" @click="insertText(`[${item.tableName}.${item.name}]`)">
                    {{ item.name }}
                  </div>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="函数" name="func">
          <ul class="func-wrap" :style="{height: siderListHeight}">
            <li v-for="(item, key) in funcTypeList" :key="key" @click="insertText(`${item}()`)">
              <span>
                <i class="iconfont iconhanshu"></i>
              </span>
              {{ item }}
            </li>
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
import sqlParamsModule from '../common/sql-params-module.vue'

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
  @Prop({
    type: String,
    default: ''
  })
  filterType!: any;
  @Prop({
    type: Object,
    default: {}
  })
  exprData?: any;

  funcTypeList = [
    // 字符串函数
    'ASCII',
    'CHAR_LENGTH',
    'CHARACTER_LENGTH',
    'CONCAT',
    'CONCAT_WS',
    'FIELD',
    'FIND_IN_SET',
    'FORMAT',
    'INSERT',
    'LOCATE',
    'LCASE',
    'LEFT',
    'LOWER',
    'LPAD',
    'LTRIM',
    'MID',
    'POSITION',
    'REPEAT',
    'REPLACE',
    'REVERSE',
    'RIGHT',
    'RPAD',
    'RTRIM',
    'SPACE',
    'STRCMP',
    'SUBSTR',
    'SUBSTRING',
    'SUBSTRING_INDEX',
    'TRIM',
    'UCASE',
    'UPPER',
    // 数字函数
    'ABS',
    'ACOS',
    'ASIN',
    'ATAN',
    'ATAN2',
    'AVG',
    'CEIL',
    'CEILING',
    'COS',
    'COT',
    'COUNT',
    'DEGREES',
    'EXP',
    'FLOOR',
    'GREATEST',
    'LEAST',
    'LOG',
    'LOG10',
    'LOG2',
    'MAX',
    'MIN',
    'MOD',
    'PI',
    'POW',
    'POWER',
    'RADIANS',
    'RAND',
    'ROUND',
    'SIGN',
    'SIN',
    'SQRT',
    'SUM',
    'TAN',
    'TRUNCATE',
    // 日期函数
    'ADDDATE',
    'ADDTIME',
    'CURDATE',
    'CURRENT_DATE',
    'CURRENT_TIME',
    'CURRENT_TIMESTAMP',
    'CURTIME',
    'DATE',
    'DATEDIFF',
    'DATE_ADD',
    'DATE_FORMAT',
    'DATE_SUB',
    'DAY',
    'DAYNAME',
    'DAYOFMONTH',
    'DAYOFWEEK',
    'DAYOFYEAR',
    'EXTRACT',
    'FROM_DAYS',
    'HOUR',
    'LAST_DAY',
    'LOCALTIME',
    'LOCALTIMESTAMP',
    'MAKEDATE',
    'NOW',
    'SECOND',
    'TO_DAYS',
    'WEEK',
    'WEEKDAY',
    'WEEKOFYEAR',
    'YEAR',
    'YEARWEEK'
  ];
  tabHeaderView = 'field';
  codeEditorMode = 'sql';
  editorOptions = {
    showGutter: false
  };
  execSqlText = '';
  isRenderCodeEditor = false;
  insertValue = '';
  sqlParamList = [];
  siderListHeight = '';

  created() {}
  mounted() {
    let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - 55
    this.siderListHeight = height - 220 + 'px';

    window.addEventListener('previewDataButtonEvent', () => {
      this.$emit('onExprData', {
        execSqlText: this.execSqlText,
        sqlParamList: this.sqlParamList
      })
    })
    window.addEventListener('saveDataButtonEvent', () => {
      this.$emit('onSaveDataExpr', {
        execSqlText: this.execSqlText,
        sqlParamList: this.sqlParamList
      })
    })
    setTimeout(() => {
      let sqlParamList = this.exprData.sqlParamList
      this.execSqlText = this.exprData.execSqlText
      if (sqlParamList && (typeof sqlParamList === 'object')) this.sqlParamList = sqlParamList
      this.isRenderCodeEditor = true; // 加载sql text
    }, 0)
  }
  insertText(text: any){
    this.insertValue = text
    this.$nextTick(() =>{
      this.insertValue = ''
    })
  }
  onGetSqlParams(val: any){}
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
  .field-wrap {
    overflow-y: auto;
    .sider-table-title, .sider-field-item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /deep/.el-submenu .el-menu-item {
      padding-right: 5px;
    }
  }
  .func-wrap{
    overflow-y: auto;
    li {
      padding-left: 10px;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      // 文本超出省略号
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        background-color: #E8EBED;
      }
      span {
        margin-right: 8px;
        .iconfont {
          color: #409eff;
        }
      }
    }
  }
}
.filter-sql-wrap {
  display: flex;
  margin-left: 230px;
}
.filter-sql-editor {
  flex: 2;
}
.filter-sql-params {
  flex: 1;
  // width: 600px;
  margin-top: -40px;
  margin-left: 20px;
}
</style>

