<template>
  <div v-loading="viewLoading">
    <div class="project-detail-wrap">
      <div class="header">
        <span>首页设置</span>
      </div>
      <!-- <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first">APP端</el-tab-pane>
          <el-tab-pane label="配置管理" name="second">PC端</el-tab-pane>
        </el-tabs>
      </div>-->
      <div class="header-control">
        <div class="range-tab">
          <p class="tab-item">
            <span :class="{active: queryType === 'MOBILE'}" @click="changeQueryType('MOBILE')">APP端</span>
          </p>
          <p class="tab-item">
            <span :class="{active: queryType === 'PC'}" @click="changeQueryType('PC')">PC端</span>
          </p>
        </div>
      </div>

      <div class="content">
        <!-- <div class="content-info" v-show="!isEdit">
          <p class="project-name">{{projectDetail.projectName || '项目名称'}}</p>
          <p class="project-describe">{{projectDetail.remark || '暂无描述'}}</p>
        </div>-->
        <!-- <div class="edit-info">
        </div>-->
        <ul class="project-info">
          <li class="edit-project-name">
            <p>首页显示：</p>
            <el-select v-model="homePageId" filterable placeholder="请选择">
              <el-option
                v-for="item in dbList"
                :key="item.id"
                :label="item.reportName"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
        </ul>
        <div class="btn-wrap">
          <!-- <el-button type="primary" size="medium" @click="isEdit = false" v-else>取消</el-button> -->
          <el-button type="primary" size="medium" @click="saveHomePage">保 存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getListServiceV3,
  homePageGetService,
  homePageSetService
} from "@/api/report";
export default {
  name: 'homePageSet',
  data() {
    return {
      viewLoading: false,
      projectDetail: {},
      isEdit: false,
      queryType: "PC",
      dbList: [],
      homePageId: ""
    };
  },
  computed: {
    ...mapGetters(["projectId", "projectList"])
  },
  created() {
    this.fetchData();
  },
  methods: {
    changeQueryType(value) {
      this.queryType = value;
      this.fetchData();
    },
    fetchData() {
      this.viewLoading = true;
      const params = {
        parentId: "",
        queryType: this.queryType
      };
      // Object.assign(params, this.searchForm)
      getListServiceV3(params).then(res => {
        const listData = res.data || {};
        const reportList = listData.reportList || [];
        this.dbList = reportList;
        this.viewLoading = false;
        this.selectHomePage();
      });
    },
    selectHomePage() {
      const params = {
        type: this.queryType
      };
      homePageGetService(params).then(res => {
        this.homePageId = res.data.reportId;
      });
    },
    saveHomePage() {
      const params = {
        reportId: this.homePageId,
        type: this.queryType
      };
      homePageSetService(params).then(res => {
        this.homePageId = res.data.reportId;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
ul,
li {
  margin: 0;
}

.project-detail-wrap {
  // min-height: 100%;
  padding-bottom: 20px;
  border: 1px solid #e1e1e1;
  background-color: #fff;
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
  margin-left: 100px;
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
.header-control {
  width: 100%;
  height: 50px;
  // margin: 0px 15px;
  // background-color: #fff;
  .control-btn {
    float: right;
  }
}
.range-tab {
  display: flex;
  float: left;
  width: 200px;
  height: 32px;
  padding-left: 30px;
  line-height: 32px;
  p {
    flex: 1;
    // border-bottom: 2px solid #ccc;
    // line-height: 30px;
    span {
      padding-bottom: 8px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      &.active {
        border-bottom: 2px solid #409eff;
        transition: border 0.8s;
      }
    }
  }
}
</style>
