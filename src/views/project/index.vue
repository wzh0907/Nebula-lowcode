<template>
  <div v-loading="viewLoading" class="app-container">
    <el-menu :default-active="projectType === 'MOBILE' ? 'menuSet' : '3'" mode="horizontal" style="padding-left: 32px;">
      <el-menu-item index="info" @click="menuClick('info')">
        基础信息
      </el-menu-item>
      <el-menu-item index="system" @click="menuClick('system')">
        系统参数
      </el-menu-item>
       <el-menu-item index="version" @click="menuClick('version')">
        项目发版
      </el-menu-item>
      <el-menu-item index="business" @click="menuClick('business')">
        项目参数
      </el-menu-item>
      <el-menu-item index="roleSet" @click="menuClick('role')">
        角色管理
      </el-menu-item>
    </el-menu>
    <!-- <br /> -->
    <info v-if="activeMenu == 'info'" />
    <homePageSet v-if="activeMenu == 'homePageSet'" />
    <menuSet v-if="projectType === 'MOBILE' && activeMenu == 'menuSet'" :query-type="queryType" @openPage="openPage" />
    <!-- <user v-if="activeMenu == 'user'"></user> -->
    <system v-if="activeMenu == 'system'" />
    <business v-if="activeMenu == 'business'" />
    <pcMenuSet v-if="projectType === 'PC' && activeMenu == 'pcMenuSet'" @openPage="openPage" />
    <roleSet v-if="activeMenu == 'role'" />
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
import info from './info'
import homePageSet from './home-page-set'
import menuSet from './mobile-menu-set'
import roleSet from '../role'
// import user from "./user/index";
import pcMenuSet from './pc-menu-set'
export default {
  components: { info, homePageSet, menuSet, pcMenuSet, roleSet },
  data() {
    return {
      viewLoading: false,
      projectDetail: {},
      isEdit: false,
      activeMenu: '',
      queryType: 'PC',
      projectType: ''
    }
  },
  computed: {
    ...mapGetters(['projectId', 'projectList'])
  },
  created() {
    this.projectType = this.$route.query.type
    this.queryProjectList()
    this.queryProjectInfo()
    // this.menuClick('info')
    if (this.projectType === 'MOBILE') {
      this.menuClick('menuSet', 'MOBILE')
    } else {
      this.menuClick('pcMenuSet')
    }
  },
  methods: {
    openPage(queryId) {
      const data = { queryId: queryId }
      this.$emit('openPage', 'report', data)
    },
    menuClick(activeMenu, queryType) {
      this.activeMenu = activeMenu
      this.queryType = queryType
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    queryProjectList() {
      getProjectListService().then((res) => {})
    },
    queryProjectInfo() {
      getProjectInfoService({
        projectId: this.projectId
      }).then((res) => {
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
            location.reload()
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
// p {
//   margin: 0;
//   padding: 0;
// }
// ul,
// li {
//   margin: 0;
//   padding: 0;
// }

// .project-detail-wrap {
//   // min-height: 100%;
//   margin: 26px 50px;
//   padding-bottom: 20px;
//   border: 1px solid #e1e1e1;
//   background-color: #fff;
// }
// .header {
//   padding: 20px 40px 50px;
//   text-align: center;
//   span {
//     font-size: 18px;
//     font-weight: 600;
//   }
// }
// .content {
//   margin-left: 100px;
//   .btn-wrap {
//     padding-right: 20px;
//     text-align: center;
//   }
// }
// .content-info {
//   margin-bottom: 20px;
//   .project-name {
//     margin-bottom: 6px;
//     font-size: 16px;
//     font-weight: bold;
//     color: #4a4a4a;
//   }
//   .project-describe {
//     font-size: 14px;
//     color: #9c9c9c;
//   }
// }
// // .edit-info {
// //   margin-bottom: 20px;
// //   .edit-project-name {
// //     margin-bottom: 20px;
// //   }
// // }
// .project-info {
//   font-size: 14px;
//   color: #4a4a4a;
//   margin-bottom: 100px;
//   li {
//     overflow: hidden;
//     margin-bottom: 15px;
//     p {
//       width: 70px;
//       float: left;
//       margin-right: 20px;
//     }
//   }
//   .edit-project-name {
//     p {
//       height: 28px;
//       line-height: 28px;
//     }
//   }
//   .edit-project-describe {
//     // span {
//     //   vertical-align: top;
//     // }
//   }
// }
// /deep/.el-menu-item,
// .el-submenu__title {
//   height: 44px;
//   line-height: 22px;
//   overflow-x: auto;
//   overflow-y: hidden;
//   color: #a5a5a5;
// }
// /deep/.el-menu-item.is-active {
//   color: #409eff;
// }

// .menu-des {
//   font-size: 12px;
// }

// .title {
//   font-weight: bold;
//   color: #606266;
// }
// /deep/.el-menu-item.is-active .title {
//   color: #409eff;
// }
</style>
