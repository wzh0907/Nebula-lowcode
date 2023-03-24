<template>
  <div>
    <div class="header-control">
      <div class="control-btn">
        <div class="input-wrap">
          <el-input v-model="searchFormData" size="small" :placeholder="`共${listTotal}个文件`" class="input-with-select" clearable @keyup.enter.native="queryList">
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
        </div>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="addItem"
        >新增参数</el-button>
      </div>
    </div>

    <main-container>
      <el-table
        v-loading="listLoading"
        :data="systemParamsList"
        element-loading-text="Loading"
        highlight-current-row
        stripe
        style="width: 100%;"
      >
        <el-table-column align="left" label="名称" prop="paramName">
          <template slot-scope="scope">
            <div>
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="参数值" align="center" prop="paramValue">
          <template slot-scope="scope">
            <div class="business-value">
              {{ scope.row.value }}
            </div>
          </template>
        </el-table-column>      
         <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            <div>
              {{ scope.row.type==1?'文本':scope.row.type==2?'数值':'日期' }}
            </div>
          </template>
        </el-table-column>      
         <el-table-column label="备注" align="center" prop="remark">
          <template slot-scope="scope">
            <div>
              {{ scope.row.remark }}
            </div>
          </template>
        </el-table-column>      
        <el-table-column label="修改时间" align="left" width="180" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              <p>{{ scope.row.updateTime }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" fixed="right" width="200">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="text" @click="editItem(scope.row.id, scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="delItem(scope.row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="pagination.totalNumber && pagination.totalNumber !== 0"
        :current-page="pagination.pageIndex"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.totalNumber"
        @current-change="handleCurrentChange"
      />
    </main-container>
    <!-- add pop -->
    <add-dialog :id="chooseEditId" :detailData="chooseDataRow" :dialog-visible.sync="dialogVisible" title="系统参数" @reload="queryList" />
  </div>
</template>

<script>
import { getBusinessParamsListService, deleteBusinessParamsService } from '@/api/business'

export default {
  name: "business",
  components: {
    'add-dialog': () => import('./module/add.vue')
  },
  data() {
    return {
      chooseDataRow: {},
      chooseEditId: '',
      searchFormData: '',
      listTotal: 0,
      searchType: 0,
      searchTypes: [
        {
          label: '名称',
          value: 0
        }
      ],
      navList: [
        {
          title: '根目录',
          id: 0
        }
      ],
      pagination: {
        totalNumber: 1
      },
      currentPage: 1,
      pageSize: 10,
      queryType: 'all',
      currentDirId: 0,
      systemParamsList: [],
      listLoading: true,
      dialogVisible: false,
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    addItem(){
      this.dialogVisible = true;
      this.chooseEditId = ''
    },
    editItem(id, item){
      this.chooseEditId = id
      this.chooseDataRow = item || {}
      this.dialogVisible = true

    },
    queryList() {
      this.listLoading = true
      const params = {
        page: this.currentPage,
        size: this.pageSize
      }
      if (this.searchType === 0 && this.searchFormData) {
        params.name = this.searchFormData
      } 
      getBusinessParamsListService(params).then(res => {
        const listData = res.dataList || []
        this.systemParamsList = listData
        this.listTotal = res.totalNumber
        this.pagination = {
          totalPage: res.totalPage,
          totalNumber: res.totalNumber,
          pageIndex: res.pageIndex,
          pageSize: res.pageSize
        }
        this.listLoading = false
      })
    },
    del(id) {
      deleteBusinessParamsService({
        businessParamId: id
      }).then(res => {
        this.queryList()
      })
    },
    delItem(id) {
      const h = this.$createElement
      this.$msgbox({
        title: '删除',
        message: h(
          'p',
          { style: 'font-size: 16px; padding: 60px 0px; text-align: center;' },
          [
            h('span', null, '请确认是否删除？'),
            h('br', null, ''),
            h(
              'span',
              { style: 'font-size: 12px; color: red' },
              '删除后将会影响已有数据，请认真确认；'
            )
          ]
        ),
        showCancelButton: true,
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.del(id)
        })
        .catch(() => {})
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.queryList()
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.input-wrap {
  display: inline-block;
  margin-right: 10px;
}
.header-control {
  width: 100%;
  height: 50px;
  .control-btn {
    float: right;
  }
}
// 重写el input样式
/deep/ .input-wrap .el-select .el-input {
  width: 110px;
}
/deep/ .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.business-value{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
