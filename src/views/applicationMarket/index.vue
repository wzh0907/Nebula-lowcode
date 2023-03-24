<template>
    <div class="downComment">
          <el-form
              :rules="rules"
              ref="downDialogForm"
              label-width="40px"
              :model="downDialogForm">
                  <el-col :span="6">
                      <el-form-item>
                        <el-input
                            clearable
                            placeholder="请输入关键字"
                            v-model="downDialogForm.appName">
                            <i slot="suffix" class="el-icon-search" @click="checkList"></i>
                          </el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="22">
                      <el-form-item>
                        <el-tabs type="border-card" v-model="activeTotalType" @tab-click="handleTotalClick">
                          <el-tab-pane label="全部应用" name="all">
                              <el-tabs v-model="activeType" @tab-click="handleClick">
                                <el-tab-pane :label="item.dictName" v-for="(item,index) in appMartTypeList" :key="index" :name="item.dictCode">
                                  <downCommentList :appList="appList" type="all" />
                                </el-tab-pane>
                              </el-tabs>
                          </el-tab-pane>
                          <el-tab-pane label="我发布的" name="mine">
                              <el-tabs v-model="activeType" @tab-click="handleClick">
                                  <el-tab-pane :label="item.dictName" v-for="(item,ids) in appMartTypeList" :key="ids" :name="item.dictCode">
                                    <downCommentList :appList="appList" type="mine" @uplateList="uplateList"/>
                                  </el-tab-pane>
                                </el-tabs>
                          </el-tab-pane>
                        </el-tabs>
                      </el-form-item>
                  </el-col>
          </el-form>
    </div>
</template>

<script>
import { checkMktAppList,getMktAppType,checkMktMineAppList } from "@/api/componentApply";
import downCommentList from "./downCommentList";
export default {
  name: "downComment",
  data() {
    return {
      appList:[],
      appMartTypeList:[],
      activeType:'',
      activeMineType:'',
      appMartTypeList:[],
      activeTotalType:"all",
      downDialogForm:{},
      rules: {
            name: [
                { required: true, message: '请输入组件名称', trigger: 'blur' }
            ]
      }
    };
  },
  computed: {

  },
  components: {
    downCommentList
  },
  watch: {},
  created() {
    this.getCommentMktCpntType()
  },
  methods: {
    checkList() {
      this.getMktAppList(this.activeType)
    },
    handleClick(value) {
      if (this.activeTotalType === 'all') {
        this.getMktAppList(value.name)
      } else {
        this.getMktMineAppList(value.name)
      }
    },
    uplateList() {
      this.getMktMineAppList(this.activeType)
    },
    handleTotalClick(type) {
      if (type.name === 'all') {
        this.activeType = this.appMartTypeList[0].dictCode
        this.getMktAppList(this.activeType)
      } else {
        this.activeType = this.appMartTypeList[0].dictCode
        this.getMktMineAppList(this.activeType)
      }
    },  
    //获取我的全部应用市场列表
    getMktAppList(type) {
      let obj =  {
        appName:this.downDialogForm.appName,
        appType:type
      }
      checkMktAppList(obj).then(res => {
          this.appList = res.dataList
      })
    },
    //获取我的我的应用市场列表
    getMktMineAppList(type) {
      let obj =  {
        appName:this.downDialogForm.appName,
        appType:type
      }
      checkMktMineAppList(obj).then(res => {
          this.appList = res.dataList
      })
    },
    // 获取业务分类
    getCommentMktCpntType() {
      getMktAppType().then(res => {
        this.appMartTypeList = res.dataList
        this.activeType = this.appMartTypeList[0].dictCode
        if (this.activeTotalType === 'all') {
            this.getMktAppList(this.activeType)
        } else {
           this.getMktMineAppList(this.activeType)
        }
      })
    }
  },
};
</script>

<style lang="scss">
.downComment{
/deep/.el-form-item{
    margin-bottom: 20px;
  }
  \deep\.el-input-group__append, .el-input-group__prepend {
    width: 80px;
  }
  .input-with-select \deep\.el-input-group__append, .el-input-group__prepend {
    background-color: #fff;
  }
}

</style>
