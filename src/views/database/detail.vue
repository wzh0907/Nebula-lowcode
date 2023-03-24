<template>
  <el-dialog :title="title" width="680px" :visible.sync="isShowDialog" @open="dialogOpen">
    <div v-loading="listLoading">
      <p>表名称：{{ tableName }}</p>
      <p>表描述：</p>
      <ul class="table-info">
        <li>
          <p>字段名称</p>
          <p>字段类型</p>
          <p>字段描述</p>
        </li>
        <li v-for="(item, key) in dataList" :key="key">
          <p>{{ item.name }}</p>
          <p>{{ item.type }}</p>
          <p>{{ item.remarks }}</p>
        </li>
      </ul>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getTableFieldService
} from '@/api/database'
export default {
  name: 'Add',
  props: {
    id: {
      type: String | Number,
      default: ''
    },
    tableName: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: '表详情',
      listLoading: false,
      dataList: []
    }
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    dialogOpen() {
      this.dataList = []
      this.$refs.dbForm && this.$refs.dbForm.resetFields()
      this.getDetail()
    },
    getDetail() {
      if (!this.id) return
      this.listLoading = true
      getTableFieldService({
        dbConfigId: this.id,
        tableName: this.tableName
      }).then(res => {
        this.listLoading = false
        this.dataList = res.dataList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
ul, li, p {
  margin: 0;
  padding: 0;
}
.table-info {
  li {
    display: flex;
    line-height: 50px;
    text-align: left;
    border-bottom: 1px solid #ccc;
    p {
      flex: 1;
    }
  }
}
</style>
