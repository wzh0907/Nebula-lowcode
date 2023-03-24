<template>
  <div v-loading="viewLoading">
    <div class="project-detail-wrap">
      <div class="content">
        <!-- <div class="content-info" v-show="!isEdit">
          <p class="project-name">{{projectDetail.projectName || '项目名称'}}</p>
          <p class="project-describe">{{projectDetail.remark || '暂无描述'}}</p>
        </div>-->
        <!-- <div class="edit-info">
        </div>-->

        <!-- <ul class="project-info">
          <li class="edit-project-name">
            <p>项目名称：</p>
            <el-input maxlength="50" v-model="projectDetail.projectName" placeholder="请输入内容" size="mini" style="width: 200px;"></el-input>
          </li>
          <li>
            <p>AppKey：</p>
            <span>{{projectDetail.appKey || 'yvbmmsdfasdfsdfasdf'}}</span>
          </li>
          <li>
            <p>AppSecret：</p>
            <span>{{projectDetail.appSecret || 'xcvueworudfjlsdf'}}</span>
          </li>
          <li class="edit-project-describe">
            <p>项目描述：</p>
            <el-input type="textarea" :rows="5" style="width: 500px;" maxlength="100" v-model="projectDetail.remark" placeholder="请输入内容"></el-input>
          </li>
        </ul>-->
        <el-row>
          <el-col :span="12">
            <el-form ref="form" :model="projectDetail" label-width="100px">
              <el-form-item label="项目名称">
                <el-input v-model="projectDetail.projectName" style="width:80%" />
              </el-form-item>
                           <el-form-item label="执行器地址">
                <el-input v-model="projectDetail.executorUrl" style="width:80%"></el-input>
              </el-form-item>
              <el-form-item label="AppKey">
                <span>{{projectDetail.appKey || 'yvbmmsdfasdfsdfasdf'}}</span>
              </el-form-item>
              <el-form-item label="AppSecret">
                <span>{{projectDetail.appSecret || 'xcvueworudfjlsdf'}}</span>
              </el-form-item>
              <el-form-item label="执行器下载">
                <el-link type="primary" style="margin-right: 20px;">下载地址1</el-link>
                <el-link type="primary">下载地址2</el-link>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" />
        </el-row>
        <el-row>
          <el-form ref="form" :model="projectDetail" label-width="100px">
            <el-form-item label="项目描述">
              <el-input
                v-model="projectDetail.remark"
                type="textarea"
                :rows="5"
                style="width: 100%;"
                maxlength="100"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-form>
        </el-row>
        <div class="btn-wrap">
          <el-button size="medium" @click="confirmDel">删除</el-button>
          <!-- <el-button type="primary" size="medium" @click="isEdit = false" v-else>取消</el-button> -->
          <el-button type="danger" size="medium" @click="editProject">保 存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getProjectListService,
  getProjectInfoService,
  addProjectService,
  deleteProjectService
} from '@/api/project'
export default {
  name: 'Info',
  data() {
    return {
      viewLoading: false,
      projectDetail: {},
      isEdit: false
    }
  },
  computed: {
    ...mapGetters(['projectId', 'projectList'])
  },
  created() {
    this.queryProjectList()
    this.queryProjectInfo()
  },
  methods: {
    queryProjectList() {
      getProjectListService().then(res => {})
    },
    queryProjectInfo() {
      getProjectInfoService({
        projectId: this.projectId
      }).then(res => {
        const data = res.data || {}
        this.projectDetail = data
      })
    },
    confirmData() {
      // if (this.isEdit) {
      //   this.editProject()
      // }
      // this.isEdit = !this.isEdit
    },
    confirmDel() {
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
          this.del()
        })
        .catch(() => {})
    },
    del() {
      this.viewLoading = true
      deleteProjectService({
        projectId: this.projectId
      })
        .then(() => {
          this.viewLoading = false
          this.$message.success('删除成功')
          this.$store.dispatch('project/removeProjectId')
          this.$store.dispatch('project/getProjectList').then(() => {
            // location.reload();
            // window.close();
            this.$router.replace('/')
          })
        })
        .catch(() => {
          this.viewLoading = false
        })
    },
    editProject() {
      this.viewLoading = true
      addProjectService({
        id: this.projectId,
        projectName: this.projectDetail.projectName,
        executorUrl: this.projectDetail.executorUrl,
        remark: this.projectDetail.remark
      })
        .then(() => {
          this.viewLoading = false
          this.$message.success('修改成功')
        })
        .catch(() => {
          this.viewLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
ul,
li {
  margin: 0;
  padding: 0;
}

.project-detail-wrap {
  // min-height: 100%;
  padding-bottom: 20px;
  // border: 1px solid #e1e1e1;
  background-color: #fff;
  .el-form-item{
    margin-bottom: 22px;
  }
}
.header {
  padding: 20px 40px 50px;
  text-align: center;
  span {
    font-size: 18px;
    font-weight: 600;
  }
}
.content {
  padding: 20px;
  .btn-wrap {
    padding-right: 20px;
    text-align: center;
  }
}
.content-info {
  margin-bottom: 20px;
  .project-name {
    margin-bottom: 6px;
    font-size: 16px;
    font-weight: bold;
    color: #4a4a4a;
  }
  .project-describe {
    font-size: 14px;
    color: #9c9c9c;
  }
}
// .edit-info {
//   margin-bottom: 20px;
//   .edit-project-name {
//     margin-bottom: 20px;
//   }
// }
.project-info {
  font-size: 14px;
  color: #4a4a4a;
  margin-bottom: 100px;
  li {
    overflow: hidden;
    margin-bottom: 15px;
    p {
      width: 70px;
      float: left;
      margin-right: 20px;
    }
  }
  .edit-project-name {
    p {
      height: 28px;
      line-height: 28px;
    }
  }
  .edit-project-describe {
    // span {
    //   vertical-align: top;
    // }
  }
}
</style>
