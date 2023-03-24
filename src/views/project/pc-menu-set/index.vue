<template>
  <div v-loading="viewLoading">
    <div class="project-detail-wrap">
      <!-- <div class="header-control">
        <div class="range-tab">
          <p class="tab-item">
            <span :class="{active: queryType === 'MOBILE'}" @click="changeQueryType('MOBILE')">APP端</span>
          </p>
          <p class="tab-item">
            <span :class="{active: queryType === 'PC'}" @click="changeQueryType('PC')">PC端</span>
          </p>
        </div>
      </div>-->
      <div class="content">
        <!-- <div class="content-info" v-show="!isEdit">
          <p class="project-name">{{projectDetail.projectName || '项目名称'}}</p>
          <p class="project-describe">{{projectDetail.remark || '暂无描述'}}</p>
        </div>-->
        <!-- <div class="edit-info">
        </div>-->
        <el-row>
          <el-col :span="6">
            <div class="menu_container">
              <nested-draggable
                :menu-list="menuList"
                :chosen-id="chosenId"
                @menuChosen="menuChosen"
                @addSubMenu="addSubMenu"
                @endMove="endMove"
              />
            </div>
            <el-button type="primary" class="menu_button" @click="addMainMenu">添加主菜单</el-button>
          </el-col>
          <el-col :span="11">
            <div v-if="menuInfo.id" class="right_menu_info">
              <ul class="project-info">
                <li class="edit-project-name">
                  <p>菜单名称：</p>
                  <el-input
                    v-model="menuInfo.name"
                    maxlength="50"
                    placeholder="请输入内容"
                    style="width: 200px;"
                  />
                </li>
                <li class="edit-project-name">
                  <p>连接页面：</p>
                  <el-select v-model="menuInfo.queryId" placeholder="请选择" style="width: 200px;">
                    <el-option
                      v-for="item in reportOptions"
                      :key="item.id"
                      :label="item.reportName"
                      :value="item.id"
                    />
                  </el-select>
                  <el-button type="text" style="margin-left: 16px;" @click="openPage()">打开页面</el-button>
                </li>
                <li class="edit-project-name">
                  <p>菜单图标：</p>
                  <el-select
                    ref="select_icon"
                    v-model="icon"
                    placeholder="请选择菜单icon"
                    class="dialog-select"
                    style="width: 200px;"
                    @change="iconChange"
                  >
                    <div class="report-config-options-icon-wrap">
                      <el-option
                        v-for="item in iconList"
                        :key="item.fontClass"
                        :label="item.fontClass"
                        :value="item"
                      >
                        <!-- <svg-icon :icon-class="item.label" style="float: left;height:100%;" /> -->
                        <i :class="item.fontClass" />
                      </el-option>
                    </div>
                  </el-select>
                </li>

                <!--                <li class="edit-project-name">
                  <p>角色权限：</p>
                  <el-select
                    v-model="menuInfo.roleNameList"
                    multiple
                    placeholder="请选择"
                    style="width: 200px;"
                  >
                    <el-option
                      v-for="item in roleList"
                      :key="item.roleName"
                      :label="item.roleName"
                      :value="item.roleName"
                    ></el-option>
                  </el-select>
                </li> -->
                <!--                <li class="edit-project-name">
                  <p>菜单隐藏：</p>
                  <el-switch
                    v-model="menuInfo.visible"
                    :active-value="false"
                    :inactive-value="true"
                  ></el-switch>
                </li>
                <li class="edit-project-name">
                  <p>首页打开：</p>
                  <el-switch v-model="menuInfo.homePage"></el-switch>
                </li> -->
              </ul>
              <div class="btn-wrap">
                <el-button type="danger" size="medium" @click="confirmDel">删除</el-button>
                <!-- <el-button type="primary" size="medium" @click="isEdit = false" v-else>取消</el-button> -->
                <el-button type="primary" size="medium" @click="saveBtn">保 存</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getListAllV4,
  getMenuList,
  saveMenuService,
  updateMenuService,
  deleteMenuService,
  sortList
} from '@/api/report'
import { getProjectRoleListService } from '@/api/role'
export default {
  name: 'PcMenuSet',
  components: {
    nestedDraggable: () => import('./module/nest.vue')
  },
  props: {
    queryType: {
      type: String,
      default: 'PC'
    }
  },
  data() {
    return {
      viewLoading: false,
      projectDetail: {},
      isEdit: false,
      chosenId: 0,
      menuInfo: {},
      reportOptions: [],
      icon: '',
      iconList: [],
      options: [
        {
          value: 'iconfont icon-huangguan',
          label: 'iconfont icon-huangguan'
        },
        {
          value: 'iconfont icon-iconfont-me',
          label: 'iconfont icon-iconfont-me'
        },
        {
          value: 'iconfont icon-diqiu',
          label: 'iconfont icon-diqiu'
        },
        {
          value: 'iconfont icon-wenjian',
          label: 'iconfont icon-wenjian'
        },
        {
          value: 'iconfont icon-feiji',
          label: 'iconfont icon-feiji'
        },
        {
          value: 'iconfont icon-iconfonticon-baobia',
          label: 'iconfont icon-iconfonticon-baobia'
        },
        {
          value: 'iconfont icon-iconfonticon-baobia1',
          label: 'iconfont icon-iconfonticon-baobia1'
        },
        {
          value: 'iconfont icon-iconfonticon-ditu',
          label: 'iconfont icon-iconfonticon-ditu'
        },
        {
          value: 'iconfont icon-iconfonticon-shebei',
          label: 'iconfont icon-iconfonticon-shebei'
        },
        {
          value: 'iconfont icon-iconfonticon-shebei1',
          label: 'iconfont icon-iconfonticon-shebei1'
        },
        {
          value: 'iconfont icon-iconfonticon-shouye',
          label: 'iconfont icon-iconfonticon-shouye'
        },
        {
          value: 'iconfont icon-iconfonticon-gaojin',
          label: 'iconfont icon-iconfonticon-gaojin'
        },
        {
          value: 'iconfont icon-iconfonticon-xitong',
          label: 'iconfont icon-iconfonticon-xitong'
        },
        {
          value: 'iconfont icon-iconfonticon-xitong1',
          label: 'iconfont icon-iconfonticon-xitong1'
        },
        {
          value: 'iconfont icon-iconfonticon-xitong2',
          label: 'iconfont icon-iconfonticon-xitong2'
        },
        {
          value: 'iconfont icon-mingpian',
          label: 'iconfont icon-mingpian'
        },
        {
          value: 'iconfont icon-ziyuan',
          label: 'iconfont icon-ziyuan'
        },
        {
          value: 'iconfont icon-ziyuan1',
          label: 'iconfont icon-ziyuan1'
        },
        {
          value: 'iconfont icon-wendang',
          label: 'iconfont icon-wendang'
        }
      ],
      roleList: [
        {
          label: '店员',
          value: '店员'
        },
        {
          label: '店长',
          value: '店长'
        }
      ],
      visible: true,
      menuList: [
        {
          name: '测试',
          children: [
            {
              name: '测试2',
              children: [
                {
                  name: '测试3'
                }
              ]
            }
          ]
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        },
        {
          name: '会员列表'
        }
      ],
      role: []
    }
  },
  computed: {
    ...mapGetters([
      'getMenuList',
      'saveMenuService',
      'updateMenuService',
      'deleteMenuService',
      'sortList',
      'projectId'
    ])
  },
  watch: {
    queryType(newValue, oldValue) {
      this.fetchData()
      // this.queryProjectInfo();
      this.initReportList()
    }
  },
  mounted() {
    // this.fetchData();
    // this.queryProjectInfo();
    // this.initReportList();
  },
  created() {
    // this.queryProjectList();
    this.fetchData()
    // this.queryProjectInfo();
    this.initReportList()
    this.initRoleList()
    this.initIconList()
  },
  methods: {
    openPage() {
      this.$emit('openPage', this.menuInfo.queryId)
    },
     initIconList() {
      const params = {
        merchantId: 1
      }
    },
    menuChosen(id) {
      console.log(id)
      this.chosenId = id
      this.select(id)
    },
    change() {
      console.log('change', this.menuList)
    },
    endMove(mList) {
      console.log(mList, 'mlist')
      const queryList = []
      for (let i = 0; i < mList.length; i++) {
        const item = mList[i]
        // let parentId = 0;
        // if (item.parentId) {
        //   parentId = item.parentId;
        // }

        let query = {
          id: item.id,
          rank: i + 1,
          parentId: 0
        }
        query = this.getChildren(query, item)
        queryList.push(query)
      }
      console.log(queryList, 'queryList')
      sortList(queryList).then((res) => {
        // console.log(res);
        // this.fetchData();
      })
    },
    getChildren(query, item) {
      if (item.children) {
        query.children = []
        for (let j = 0; j < item.children.length; j++) {
          const itemj = item.children[j]
          let queryj = {
            id: itemj.id,
            rank: j + 1,
            parentId: item.id
          }
          queryj = this.getChildren(queryj, itemj)
          query.children.push(queryj)
        }
      }
      return query
    },
    start() {},
    // end(e) {
    //   this.menuList.splice(
    //     e.newIndex,
    //     0,
    //     this.menuList.splice(e.oldIndex, 1)[0]
    //   );
    //   var newArray = this.menuList.slice(0);
    //   this.menuList = [];
    //   // let arr = this.menuList; // 获取表数据
    //   // arr.splice(e.newIndex, 0, arr.splice(e.oldIndex, 1)[0]); // 数据处理
    //   this.$nextTick(function () {
    //     this.menuList = newArray;
    //     this.sort();
    //   });
    // },
    // sort() {
    //   let queryList = [];
    //   for (let i = 0; i < this.menuList.length; i++) {
    //     let item = this.menuList[i];
    //     let parentId = 0;
    //     if (item.parentId) {
    //       parentId = item.parentId;
    //     }
    //     let query = {
    //       id: item.id,
    //       rank: i + 1,
    //     };
    //     queryList.push(query);
    //   }
    //   sortList(queryList).then((res) => {
    //     // console.log(res);
    //     // this.fetchData();
    //   });
    // },
    move() {
      console.log('move', this.menuList)
    },
    changeQueryType(value) {
      this.queryType = value
      this.fetchData()
      this.initReportList()
    },
    select(id) {
      this.menuList.forEach((item) => {
        if (item.id == id) {
          this.menuInfo = item
          console.log(this.menuInfo, 'menuInfo')
          this.show(this.menuInfo)
        }
        item.children.forEach((subItem) => {
          console.log(subItem, 'subItem')
          if (subItem.id == id) {
            this.menuInfo = subItem
            this.show(this.menuInfo)
          }
          if (subItem.children) {
            subItem.children.forEach((lastItem) => {
              if (lastItem.id == id) {
                this.menuInfo = lastItem
                this.show(this.menuInfo)
              }
            })
          }
        })
      })
    },
    addSubMenu(id) {
      let existFlag = false
      this.menuList.forEach((item) => {
        if (item.id == 'newId') {
          existFlag = true
        }
        if (item.children) {
          item.children.forEach((subItem) => {
            if (subItem.id == 'newId') {
              existFlag = true
            }
            if (subItem.children) {
              subItem.children.forEach((lastItem) => {
                if (lastItem.id == 'newId') {
                  existFlag = true
                }
              })
            }
          })
        }
      })
      if (existFlag) {
        this.$message.error('一次只能添加一个菜单')
      } else {
        for (let i = 0; i < this.menuList.length; i++) {
          if (this.menuList[i].id == id) {
            this.menuList[i].children.push({
              id: 'newId',
              parentId: id,
              name: '新增子菜单',
              visible: true
            })
          }
          for (let j = 0; j < this.menuList[i].children.length; j++) {
            if (this.menuList[i].children[j].id == id) {
              this.menuList[i].children[j].children.push({
                id: 'newId',
                parentId: id,
                name: '新增子菜单',
                 visible: true
              })
            }
          }
        }
      }
    },
    show(menuInfo) {
      if (menuInfo.fontClass) {
        this.$nextTick(() => {
          this.iconChange(menuInfo)
        })
      } else {
        this.clearIcon()
      }
    },
    clearIcon() {
      this.icon = ''
      const dom = this.$refs['select_icon'].$el
      if (document.getElementsByClassName('choose_icon')[0]) {
        dom.childNodes[1].removeChild(
          document.getElementsByClassName('choose_icon')[0]
        )
      }
    },
    // queryProjectList() {
    //   getProjectListService().then(res => {});
    // },
    // queryProjectInfo() {
    //   getProjectInfoService({
    //     projectId: this.projectId
    //   }).then(res => {
    //     let data = res.data || {};
    //     this.projectDetail = data;
    //   });
    // },
    confirmDel() {
       if (this.menuInfo.id == 'newId') {
        let mindex = -1
        for (let i = 0; i < this.menuList.length; i++) {
          const minfo = this.menuList[i]
          if (minfo.id == 'newId') {
            mindex = i
          }
        }
        this.menuList.splice(mindex, 1)
      } else {
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
          this.deleteMenu()
        })
        .catch(() => {})
      }
    },
    saveBtn() {
      console.log(this.menuInfo.visible)
      if (!this.menuInfo.name) {
        this.$message.error('菜单名称不能为空')
      } else {
        if (this.menuInfo.id && this.menuInfo.id != 'newId') {
          this.updateMenu()
        } else {
          this.saveMenu()
        }
      }
    },
    saveMenu() {
      const params = {
        queryId: this.menuInfo.queryId,
        queryType: this.queryType,
        name: this.menuInfo.name,
        dataType: 'report',
        visible: this.menuInfo.visible,
        parentId: this.menuInfo.parentId,
       iconFontClass: this.menuInfo.iconFontClass,
        iconUnicode: this.menuInfo.iconUnicode,
        homePage: this.menuInfo.homePage
      }
      if (this.menuInfo.roleNameList) {
        params.roleNameList = this.menuInfo.roleNameList
      }
      this.viewLoading = true
      saveMenuService(params).then((res) => {
        if (res.code == 0) {
          this.$message.success('保存成功')
          this.fetchData()
        }
         this.viewLoading = false
      })
    },
    updateMenu() {
      console.log(this.menuInfo.role)
      const params = {
        id: this.menuInfo.id,
        queryId: this.menuInfo.queryId,
        queryType: this.queryType,
        name: this.menuInfo.name,
        dataType: 'report',
        visible: this.menuInfo.visible,
        parentId: this.menuInfo.parentId,
        iconFontClass: this.menuInfo.iconFontClass,
        iconUnicode: this.menuInfo.iconUnicode,
        homePage: this.menuInfo.homePage,
        roleNameList: this.menuInfo.roleNameList
      }
      updateMenuService(params).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功')
          this.fetchData()
        }
      })
    },
    deleteMenu() {
      const params = {
        id: this.menuInfo.id
      }
      deleteMenuService(params).then((res) => {
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.fetchData()
          this.menuInfo = {}
        }
      })
    },
    fetchData() {
      this.menuList = []
      const params = {
        queryType: this.queryType
      }
      getMenuList(params).then((res) => {
        this.menuList = res.dataList || {}
        if (this.menuList) {
          this.menuChosen(this.menuList[0].id)
        }
      })
    },
    initReportList() {
      const params = {
        parentId: 0,
        queryType: this.queryType
      }
      // Object.assign(params, this.searchForm)
      getListAllV4(params).then((res) => {
        this.reportOptions = res.dataList || {}
      })
    },
    iconChange(val) {
      // el-select实际上是两层div包裹的input
      this.icon = ' '
      this.menuInfo.iconFontClass = val.fontClass
      this.menuInfo.iconUnicode = val.unicode
      // 获取当前el-select标签第一层div
      const dom = this.$refs['select_icon'].$el
      if (document.getElementsByClassName('choose_icon')[0]) {
        dom.childNodes[1].removeChild(
          document.getElementsByClassName('choose_icon')[0]
        )
      }
      // document.getElementsByClassName('el-input__prefix').remove()
      // 创建需要添加到其中的标签 并填充内容
      const svgDom = document.createElement('i') // ('<svg-icon ref="iconRef" icon-class="' + val + '" style="float: left;width: 3%;height: 30px;border: 1px solid #dcdfe6;border-right:none;" />');
      svgDom.setAttribute('class', 'el-input__prefix choose_icon')
      svgDom.innerHTML =
        '<span class="el-input__prefix-inner report_config_select_icon_p">已选：<i class="' +
        val.fontClass +
        ' report_config_select_icon_p"></i></span>'
      // 将创建的标签添加到父节点(第二层div)
      dom.children[0].appendChild(svgDom)
      // 得到el-select中的input标签
      const inputDom = dom.children[0].children[0]
      inputDom.setAttribute('style', 'padding-left: 30px;')
      // 将添加的标签放到input前面
      dom.children[0].insertBefore(svgDom, inputDom)
    },
    addMainMenu() {
      console.log('menuMain')
      let existFlag = false
      this.menuList.forEach((item) => {
        if (item.id == 'newId') {
          existFlag = true
        }
        if (item.children) {
          item.children.forEach((subItem) => {
            if (subItem.id == 'newId') {
              existFlag = true
            }
            if (subItem.children) {
              subItem.children.forEach((lastItem) => {
                if (lastItem.id == 'newId') {
                  existFlag = true
                }
              })
            }
          })
        }
      })
      if (existFlag) {
        this.$message.error('一次只能添加一个菜单')
      } else {
        this.menuList.push({ id: 'newId', name: '新增菜单', visible: true })
        this.menuChosen('newId')
      }
    },
    initRoleList() {
      this.listLoading = true
      getProjectRoleListService({
        projectId: this.projectId
      }).then((res) => {
        const listData = res.dataList || []
        this.roleList = listData
        this.listLoading = false
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
li {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  position: relative;
}

.project-detail-wrap {
  // min-height: 100%;
  padding-bottom: 20px;
  border: 1px solid #e1e1e1;
  background-color: #fff;
}
.header {
  padding: 20px;
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
    display: flex;
    align-items: center;
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
.menu_container {
  height: 350px;
  border: 2px solid #dddfe6;
  position: relative;
  overflow-y: auto;
  border-radius: 5px;
}
.menu_button {
  width: 100%;
  margin-top: 10px;
}
.menu_li {
  padding-left: 5px;
}
.menu_children {
  padding-left: 20px;
}
.menu_sub_children {
  padding-left: 40px;
}
.chosen_li {
  background-color: #5a6268;
  color: white;
}
.report-config-options-icon-wrap {
  /* background: red; */
  display: flex;
  flex-wrap: wrap;
  width: 230px;
}

.right_menu_info {
  padding-left: 10px;
}
.report_config_select_icon_p {
  color: #000;
}
.plus_sub {
  position: absolute;
  right: 5px;
  top: 9px;
  color: #000;
  cursor: pointer;
}
.chosen_plus {
  color: #fff;
}
/deep/.el-input__prefix {
  left: 5px;
  color: #000;
  top: 7px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
</style>
