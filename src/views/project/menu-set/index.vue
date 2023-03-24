<template>
  <div v-loading="viewLoading">
    <div class="project-detail-wrap">
      <div class="content">
        <el-row>
          <el-col>
            <div class="right_menu_info" v-if="menuInfo.id">
              <ul class="project-info">
                <li class="edit-project-name">
                  <p>菜单名称：</p>
                  <el-input
                    maxlength="50"
                    v-model="menuInfo.name"
                    placeholder="请输入内容"
                    style="width: 200px"
                  ></el-input>
                </li>
                <li class="edit-project-name">
                  <p>连接页面：</p>
                  <el-select
                    v-model="menuInfo.queryId"
                    placeholder="请选择"
                    style="width: 200px"
                  >
                    <el-option
                      v-for="item in reportOptions"
                      :key="item.id"
                      :label="item.reportName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </li>

                <li class="edit-project-name">
                  <p>菜单图标：</p>
                  <el-select
                    ref="select_icon"
                    v-model="icon"
                    placeholder="请选择菜单icon"
                    class="dialog-select"
                    @change="iconChange"
                    style="width: 200px"
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
                <li class="edit-project-name">
                  <p>菜单选中图标：</p>
                  <el-select
                    ref="select_chosen_icon"
                    v-model="chosenIcon"
                    placeholder="请选择菜单选中icon"
                    class="dialog-select"
                    @change="chosenIconChange"
                    style="width: 200px"
                  >
                    <div class="report-config-options-icon-wrap">
                      <el-option
                        v-for="item in iconList"
                        :key="item.fontClass"
                        :label="item.fontClass"
                        :value="item"
                      >
                        <i :class="item.fontClass" />
                      </el-option>
                    </div>
                  </el-select>
                </li>
                <li class="edit-project-name">
                  <p>角色权限：</p>
                  <el-select
                    v-model="menuInfo.roleIdList"
                    multiple
                    placeholder="请选择"
                    style="width: 200px"
                  >
                    <el-option
                      v-for="item in roleList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </li>
                <li class="edit-project-name">
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
                </li>
              </ul>
              <div class="btn-wrap">
                <!-- <el-button type="danger" size="medium" @click="confirmDel"
                  >删除</el-button
                > -->
                <el-button type="primary" size="medium" @click="saveBtn"
                  >保 存</el-button
                >
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getMenuList,
  saveMenuService,
  updateMenuService,
  deleteMenuService,
  sortList,
} from "@/api/report";
import draggable from "vuedraggable";
import Sortable from "sortablejs";
import generateUUID from "@/utils/index";
export default {
  name: "menuSet",
  props: {
    queryType: {
      type: String,
    },
    currentFileData: {
      type: Object,
    },
  },
  components: {
    draggable,
    Sortable,
  },
  data() {
    return {
      viewLoading: false,
      projectDetail: {},
      isEdit: false,
      chosenId: 0,
      menuInfo: {},
      reportOptions: [],
      icon: "",
      chosenIcon: "",
      iconList: [],
      options: [
        {
          value: "iconfont icon-huangguan",
          label: "iconfont icon-huangguan",
        },
        {
          value: "iconfont icon-iconfont-me",
          label: "iconfont icon-iconfont-me",
        },
        {
          value: "iconfont icon-diqiu",
          label: "iconfont icon-diqiu",
        },
        {
          value: "iconfont icon-wenjian",
          label: "iconfont icon-wenjian",
        },
        {
          value: "iconfont icon-feiji",
          label: "iconfont icon-feiji",
        },
        {
          value: "iconfont icon-iconfonticon-baobia",
          label: "iconfont icon-iconfonticon-baobia",
        },
        {
          value: "iconfont icon-iconfonticon-baobia1",
          label: "iconfont icon-iconfonticon-baobia1",
        },
        {
          value: "iconfont icon-iconfonticon-ditu",
          label: "iconfont icon-iconfonticon-ditu",
        },
        {
          value: "iconfont icon-iconfonticon-shebei",
          label: "iconfont icon-iconfonticon-shebei",
        },
        {
          value: "iconfont icon-iconfonticon-shebei1",
          label: "iconfont icon-iconfonticon-shebei1",
        },
        {
          value: "iconfont icon-iconfonticon-shouye",
          label: "iconfont icon-iconfonticon-shouye",
        },
        {
          value: "iconfont icon-iconfonticon-gaojin",
          label: "iconfont icon-iconfonticon-gaojin",
        },
        {
          value: "iconfont icon-iconfonticon-xitong",
          label: "iconfont icon-iconfonticon-xitong",
        },
        {
          value: "iconfont icon-iconfonticon-xitong1",
          label: "iconfont icon-iconfonticon-xitong1",
        },
        {
          value: "iconfont icon-iconfonticon-xitong2",
          label: "iconfont icon-iconfonticon-xitong2",
        },
        {
          value: "iconfont icon-mingpian",
          label: "iconfont icon-mingpian",
        },
        {
          value: "iconfont icon-ziyuan",
          label: "iconfont icon-ziyuan",
        },
        {
          value: "iconfont icon-ziyuan1",
          label: "iconfont icon-ziyuan1",
        },
        {
          value: "iconfont icon-wendang",
          label: "iconfont icon-wendang",
        },
      ],
      roleList: [
        {
          label: "店员",
          value: "店员",
        },
        {
          label: "店长",
          value: "店长",
        },
      ],
      visible: true,
      menuList: [
        {
          name: "测试",
          children: [
            {
              name: "测试2",
              children: [
                {
                  name: "测试3",
                },
              ],
            },
          ],
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
        {
          name: "会员列表",
        },
      ],
      role: [],
    };
  },
  computed: {
    ...mapGetters([
      "getMenuList",
      "saveMenuService",
      "updateMenuService",
      "deleteMenuService",
      "sortList",
    ]),
  },
  mounted() {
    // this.fetchData();
    // this.queryProjectInfo();
    // this.initReportList();
  },
  watch: {
    queryType(newValue, oldValue) {
      this.fetchData();
      // this.queryProjectInfo();
      this.initReportList();
    },
  },
  created() {
    // this.queryProjectList();
    this.fetchData();
    // this.queryProjectInfo();
    this.initReportList();
    this.initRoleList();
    this.initIconList();
  },
  methods: {
    initIconList() {
      let params = {
        merchantId: 1,
      };
     
    },
    change() {
      console.log("change", this.menuList);
    },
    start() {},
    end(e) {
      this.menuList.splice(
        e.newIndex,
        0,
        this.menuList.splice(e.oldIndex, 1)[0]
      );
      var newArray = this.menuList.slice(0);
      this.menuList = [];
      // let arr = this.menuList; // 获取表数据
      // arr.splice(e.newIndex, 0, arr.splice(e.oldIndex, 1)[0]); // 数据处理
      this.$nextTick(function () {
        this.menuList = newArray;
        this.sort();
      });
    },
    sort() {
      let queryList = [];
      for (let i = 0; i < this.menuList.length; i++) {
        let item = this.menuList[i];
        let parentId = 0;
        if (item.parentId) {
          parentId = item.parentId;
        }
        let query = {
          id: item.id,
          rank: i + 1,
        };
        queryList.push(query);
      }
      sortList(queryList).then((res) => {
        // console.log(res);
        // this.fetchData();
      });
    },
    move() {
      console.log("move", this.menuList);
    },
    changeQueryType(value) {
      this.queryType = value;
      this.fetchData();
      this.initReportList();
    },
    initReportList() {
      const params = {
        parentId: 0,
        queryType: this.queryType,
      };
    
    },
    select(id) {
      this.chosenId = id;
      this.menuList.forEach((item) => {
        if (item.id == id) {
          this.menuInfo = item;
          this.show(this.menuInfo);
        }
        if (item.children) {
          item.children.forEach((subItem) => {
            if (subItem.id == id) {
              this.menuInfo = subItem;
              this.show(this.menuInfo);
            }
          });
        }
      });
    },
    show(menuInfo) {
      if (menuInfo.fontClass) {
        this.$nextTick(() => {
          this.iconChange(menuInfo);
          let param = {
            fontClass: menuInfo.chosenFontClass,
            unicode: menuInfo.chosenUnicode,
          };
          this.chosenIconChange(param);
        });
      } else {
        this.clearIcon();
      }
    },
    clearIcon() {
      this.icon = "";
      if (this.$refs["select_icon"]) {
        const dom = this.$refs["select_icon"].$el;
        const cdom = this.$refs["select_chosen_icon"].$el;
        // const dom = this.$refs["select_chosen_icon"].$el;
        if (document.getElementsByClassName("choose_icon")[0]) {
          dom.childNodes[1].removeChild(
            document.getElementsByClassName("choose_icon")[0]
          );
        }
        if (document.getElementsByClassName("s_choose_icon")[0]) {
          cdom.childNodes[1].removeChild(
            document.getElementsByClassName("s_choose_icon")[0]
          );
        }
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
      if (this.menuInfo.id == "newId") {
        let mindex = -1;
        for (let i = 0; i < this.menuList.length; i++) {
          let minfo = this.menuList[i];
          if (minfo.id == "newId") {
            mindex = i;
          }
        }
        this.menuList.splice(mindex, 1);
      } else {
        const h = this.$createElement;
        this.$msgbox({
          title: "删除",
          message: h(
            "p",
            {
              style: "font-size: 16px; padding: 60px 0px; text-align: center;",
            },
            [
              h("span", null, "请确认是否删除？"),
              h("br", null, ""),
              h(
                "span",
                { style: "font-size: 12px; color: red" },
                "删除后将会影响已有数据，请认真确认；"
              ),
            ]
          ),
          showCancelButton: true,
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
        })
          .then(() => {
            this.deleteMenu();
          })
          .catch(() => {});
      }
    },
    saveBtn() {
      console.log(this.menuInfo.id);
      if (!this.menuInfo.name) {
        this.$message.error("菜单名称不能为空");
      } else {
        if (this.menuInfo.id) {
          this.updateMenu();
        } else {
          this.saveMenu();
        }
      }
    },
    saveMenu() {
      const params = {
        queryId: this.menuInfo.queryId,
        queryType: this.queryType,
        name: this.menuInfo.name,
        dataType: "report",
        visible: this.menuInfo.visible,
        permissions: this.menuInfo.permissions,
        parentId: this.menuInfo.parentId,
        iconFontClass: this.menuInfo.iconFontClass,
        iconUnicode: this.menuInfo.iconUnicode,
        chosenIconFontClass: this.menuInfo.chosenIconFontClass,
        chosenIconUnicode: this.menuInfo.chosenIconUnicode,
        homePage: this.menuInfo.homePage,
      };
      if (this.menuInfo.roleIdList) {
        params.roleIdList = encodeURI(this.menuInfo.roleIdList);
      }
      this.viewLoading = true;
      saveMenuService(params).then((res) => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.fetchData();
        }
        this.viewLoading = false;
      });
    },
    updateMenu() {
      const params = {
        id: this.menuInfo.id,
        queryId: this.menuInfo.queryId,
        queryType: this.queryType,
        name: this.menuInfo.name,
        dataType: "report",
        permissions: this.menuInfo.permissions,
        visible: this.menuInfo.visible,
        parentId: this.menuInfo.parentId,
        iconFontClass: this.menuInfo.iconFontClass,
        iconUnicode: this.menuInfo.iconUnicode,
        chosenIconFontClass: this.menuInfo.chosenIconFontClass,
        chosenIconUnicode: this.menuInfo.chosenIconUnicode,
        homePage: this.menuInfo.homePage,
        roleIdList: encodeURI(this.menuInfo.roleIdList),
      };
      updateMenuService(params).then((res) => {
        if (res.code == 0) {
          this.$message.success("修改成功");
          this.fetchData();
        }
      });
    },
    deleteMenu() {
      const params = {
        id: this.menuInfo.id,
      };
      deleteMenuService(params).then((res) => {
        if (res.code == 0) {
          this.$message.success("删除成功");
          this.fetchData();
          this.menuInfo = {};
        }
      });
    },
    fetchData() {
      // this.menuList = [];
      // let params = {
      //   queryType: this.queryType,
      // };
      // getMenuList(params).then((res) => {
      //   this.menuList = res.dataList || {};
      //   console.log(res, "fetchDate");
      //   if (this.menuList) {
      //     this.select(this.menuList[0].id);
      //   }
      // });
      this.menuInfo = this.currentFileData;
      this.show(this.currentFileData);
    },
    eportList() {
      const params = {
        parentId: 0,
        queryType: this.queryType,
      };
      // Object.assign(params, this.searchForm)
  
    },
    iconChange(val) {
      // el-select实际上是两层div包裹的input
      this.icon = " ";
      this.menuInfo.iconFontClass = val.fontClass;
      this.menuInfo.iconUnicode = val.unicode;
      // 获取当前el-select标签第一层div
      const dom = this.$refs["select_icon"].$el;
      if (document.getElementsByClassName("choose_icon")[0]) {
        dom.childNodes[1].removeChild(
          document.getElementsByClassName("choose_icon")[0]
        );
      }
      // document.getElementsByClassName('el-input__prefix').remove()
      // 创建需要添加到其中的标签 并填充内容
      const svgDom = document.createElement("i"); // ('<svg-icon ref="iconRef" icon-class="' + val + '" style="float: left;width: 3%;height: 30px;border: 1px solid #dcdfe6;border-right:none;" />');
      svgDom.setAttribute("class", "el-input__prefix choose_icon");
      svgDom.innerHTML =
        '<span class="el-input__prefix-inner report_config_select_icon_p">已选：<i class="' +
        val.fontClass +
        ' report_config_select_icon_p"></i></span>';
      // 将创建的标签添加到父节点(第二层div)
      dom.children[0].appendChild(svgDom);
      // 得到el-select中的input标签
      const inputDom = dom.children[0].children[0];
      inputDom.setAttribute("style", "padding-left: 30px;");
      // 将添加的标签放到input前面
      dom.children[0].insertBefore(svgDom, inputDom);
    },
    chosenIconChange(val) {
      // el-select实际上是两层div包裹的input
      this.chosenIcon = " ";
      console.log(val, "chosenIconChange");
      this.menuInfo.chosenIconFontClass = val.fontClass;
      this.menuInfo.chosenIconUnicode = val.unicode;
      // 获取当前el-select标签第一层div
      const dom = this.$refs["select_chosen_icon"].$el;
      if (document.getElementsByClassName("s_choose_icon")[0]) {
        dom.childNodes[1].removeChild(
          document.getElementsByClassName("s_choose_icon")[0]
        );
      }
      // document.getElementsByClassName('el-input__prefix').remove()
      // 创建需要添加到其中的标签 并填充内容
      const svgDom = document.createElement("i"); // ('<svg-icon ref="iconRef" icon-class="' + val + '" style="float: left;width: 3%;height: 30px;border: 1px solid #dcdfe6;border-right:none;" />');
      svgDom.setAttribute("class", "el-input__prefix s_choose_icon");
      svgDom.innerHTML =
        '<span class="el-input__prefix-inner report_config_select_icon_p">已选：<i class="' +
        val.fontClass +
        ' report_config_select_icon_p"></i></span>';
      // 将创建的标签添加到父节点(第二层div)
      dom.children[0].appendChild(svgDom);
      // 得到el-select中的input标签
      const inputDom = dom.children[0].children[0];
      inputDom.setAttribute("style", "padding-left: 30px;");
      // 将添加的标签放到input前面
      dom.children[0].insertBefore(svgDom, inputDom);
    },
    addMainMenu() {
      // 判断 如果 有new id 则不能添加
      let existFlag = false;
      this.menuList.forEach((item) => {
        if (item.id == "newId") {
          existFlag = true;
        }
      });
      if (existFlag) {
        this.$message.error("一次只能添加一个菜单");
      } else {
        this.menuList.push({ id: "newId", name: "新增菜单", visible: true });
        this.select("newId");
      }
    },
    initRoleList() {
      this.listLoading = true;
    },
  },
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
      width: 100px;
      float: left;
      // margin-right: 20px;
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
