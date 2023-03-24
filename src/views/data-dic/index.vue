<template>
  <div v-loading="viewLoading" class="container">
    <el-row class="title" >
      <el-col :span="6">
        <el-row :gutter="20">

            <el-col :span="12"><div>字典分类</div></el-col>
   
            <el-col :span="10" style="text-align: right;" >
              <el-button type="primary" size="small" @click="dicDlgVisible = true; dataDicId=''; dataDicName=''; dicDlgTitle='添加字典'"
            >添加字典</el-button >
            </el-col>

          
          </el-row>

        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item
            :index="index.toString()"
            :key="index"
            v-for="(item, index) in dataList"
            @click="viewDicEntries(item)"
          >
            <span slot="title">
              {{ item.dicName }}
              <i
                class="el-icon-delete setting-delete"
                style="cursor: pointer"
                @click.stop="delDic(item, index)"
              ></i>

              <i
                class="iconfont iconbianji setting-edit"
                style="cursor: pointer"
                @click.stop="editDic(item)"
              ></i>
            </span>
          </el-menu-item>
        </el-menu>
      </el-col>


      <el-col :span="18">
      
        <el-row >
          <el-col :span="12" ><p style="margin-left:20px">字典项目</p></el-col>
          <el-col :span="12" style="text-align: right;">
            <el-form :inline="true"  :model="searchForm" class="demo-form-inline">
                              <el-form-item  prop="term">
                                  <el-input size="small" v-model="searchForm.term" placeholder="请输入查询关键字" :clearable="true"></el-input>
                              </el-form-item>
                              <el-form-item>
                                  <el-button  type="primary" size="small" @click="search">查询</el-button>
                              </el-form-item>
                              <el-form-item>
                                <el-button type="primary" @click="addDicEntry" size="small">添加字典项</el-button>
                              </el-form-item>
                  </el-form>
          </el-col>
        </el-row>

        <el-table :data="entryList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80"> </el-table-column>
          <el-table-column prop="entryParent" label="父级" width="80">
          </el-table-column>
          <el-table-column prop="entryCode" label="编码" >
          </el-table-column>
          <el-table-column prop="entryName" label="名称" >
          </el-table-column>
          <el-table-column prop="seq" label="排序" width="80">
          </el-table-column>
          <el-table-column prop="entryStatus" label="状态" width="80" >
            <template slot-scope="scope">
              <i v-show="scope.row.entryStatus == 1" class="el-icon-success" style="font-size: 18px; color:green"></i>
              <i v-show="scope.row.entryStatus == 0" class="el-icon-error" style="font-size: 18px; color:red"></i>
            </template>
          </el-table-column>
          <el-table-column prop="entryRemark" label="备注"> </el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="editDicEntry(scope.row)" type="text" size="small">修改</el-button>

              <el-button
                @click="deleteDicEntry(scope.row)"
                type="text"
                size="small">删除</el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
 <addDicDialog
      :dialog-visible.sync="dicDlgVisible"
      :id="dataDicId"
      :dicName="dataDicName"
      :title="dicDlgTitle"
      @initData="initDataDicList"
    />
       <addDicEntryDialog
      :dialog-visible.sync="dicEntryVisible"
      :id="dicEntryId"
      :param="dicEntryParam"
      :title="dicDlgEntryTitle"
      @initData="refreshDicEntryList"
    />


  </div>
</template>

<script>
import { mapGetters } from "vuex"; 
import {
  getDataDicListService,
  deleteDataDicService,
  getDataDicEntryListService,
  deleteDataDicEntryService,
} from "@/api/data-dic";

import workFlowEdit from "@/views/workflow/edit/index.vue";

import addDicDialog from "./module/add-dic.vue";
import addDicEntryDialog from "./module/add-dic-entry.vue";

export default {
  components: { workFlowEdit, 
    addDicDialog, 
    addDicEntryDialog
   },
  data() {
    return {
      viewLoading: false,

      dicDlgTitle: '',
      dicDlgEntryTitle:'',

      dataList: [],
      dataDicId:'',
      dataDicName:'',

      dicEntryId:'',
      dicEntryParam:{},

      entryList: [],


      dicDlgVisible: false,
      dicEntryVisible: false,


      selectDataDicId: null,
 
 
      selectFlowName:null,
      searchForm:{
        term:''
      }
    };
  },
  computed: {
    ...mapGetters(["projectId", "projectList"]),
  },
  created() {
    this.initDataDicList();
  },
  methods: {
    initDataDicList() {
      getDataDicListService().then((res) => {
        this.dataList = res.dataList;
      });
    },
//////////////////////////////////////////////
    editDic(item) {
        this.dicDlgVisible = true
        this.dicDlgTitle = '编辑字典'
        this.dataDicId=item.id
        this.dataDicName = item.dicName
    },

    delDic(item, idx) {
      // console.log(idx)
      this.$confirm("确认删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
              deleteDataDicService({id:item.id}).then((res) => {
                  this.$antdMessage.success("删除成功");
                  //reset active index
                  if(idx == this.dataList.length-1) { //删除最后一个
                    if(this.dataList.length > 1 ) {
                      this.selectDataDicId = this.dataList[ this.dataList.length -2 ].id
                    } else if(this.dataList.length == 1 ) {
                      this.selectDataDicId == null
                    }
                  }else { //选中下一个
                    this.selectDataDicId = this.dataList[idx + 1].id
                  }

                  this.initDataDicList();
                  this.loadDicEntryList()
              })
        }).catch( (e)=>{});
    },
///////////////////////////////////////////////

   viewDicEntries(dataDic) {
      this.selectDataDicId=dataDic.id
      this.loadDicEntryList(dataDic)
    },


    refreshDicEntryList(){
      this.loadDicEntryList()
    },


/////////////////////////////////////////////////////
    loadDicEntryList(dataDic){
      let dicId = null 
      if(dataDic == undefined || dataDic == null) {
        dicId = this.selectDataDicId
      } else {
        dicId = dataDic.id
      }
      getDataDicEntryListService({
            dicId: dicId,
          }).then((res) => {
        this.entryList = res.dataList;
      });
    },


    addDicEntry(){
      // 校验
      if(this.selectDataDicId == null) {
        let msg = '请先选中字典.'
        if(this.dataList == null || this.dataList.length == 0) {
          msg = '请先创建字典.'
        }
        this.$alert(msg, '警告', {
          confirmButtonText: '确定',
        });
        return
      }


        this.dicEntryId = null
        this.dicEntryVisible = true
        this.dicDlgEntryTitle = '添加字典项'
    },

    editDicEntry(row) {
      this.dicEntryId = row.id;
      this.dicEntryParam = row
      this.dicEntryVisible = true
      this.dicDlgEntryTitle = '编辑字典项'
    },

    deleteDicEntry(row) {
      let param = {
        id: row.id,
      };

      this.$confirm("确认删除该字典项吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDataDicEntryService(param).then((res) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.loadDicEntryList();
          });
        }).catch( (e)=>{});



    },
/////////////////////////////////////////////////////////////


search() {
      // 校验
      if(this.selectDataDicId == null) {
        let msg = '请先选中字典.'
        if(this.dataList == null || this.dataList.length == 0) {
          msg = '请先创建字典.'
        }
        this.$alert(msg, '警告', {
          confirmButtonText: '确定',
        });
        return
      }


      let param = {
        entryName: this.searchForm.term,
        dicId: this.selectDataDicId,
      };

      getDataDicEntryListService(param).then(res=>{
            if(res.code==0){
              this.entryList = res.dataList;
            }
        });
    },
/////////////////////////////////////////////////////////////

  },
};
</script>

<style lang="scss" scoped>
.container {
  .title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }
}
.setting-edit {
  float: right;
}
.setting-delete {
  float: right;
  margin-right: 10px;
  margin-top: 20px;
}
</style>



