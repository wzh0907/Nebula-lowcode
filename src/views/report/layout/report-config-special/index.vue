<template>
  <div style="margin-top: 8px">
    <!-- 主页面配置 -->
    <el-collapse v-model="activeNames">
      <el-collapse-item name="padding">
        <template slot="title">
          <div style="display: flex; flex-direction: row">
            <div style="width: 75px">页面边距</div>
            <el-select
              size="small"
              v-model="paddingInfo.center"
              placeholder="请选择"
              @change="paddingType = 'center'">
              <el-option
                v-for="item in paddingCenterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </template>
        <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 4px">
          <div style="width: 75px">
            上间距
          </div>
          <el-select size="small" v-model="paddingInfo.top" placeholder="请选择" @change="paddingType = 'all'">
            <el-option
              v-for="item in paddingOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 4px">
          <div style="width: 75px">
            右间距
          </div>
          <el-select size="small" v-model="paddingInfo.right" placeholder="请选择" @change="paddingType = 'all'">
            <el-option
              v-for="item in paddingOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 4px">
          <div style="width: 75px">
            下间距
          </div>
          <el-select size="small" v-model="paddingInfo.bottom" placeholder="请选择" @change="paddingType = 'all'">
            <el-option
              v-for="item in paddingOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center">
          <div style="width: 75px">
            左间距
          </div>
          <el-select size="small" v-model="paddingInfo.left" placeholder="请选择" @change="paddingType = 'all'">
            <el-option
              v-for="item in paddingOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-form
      label-position="right"
      label-width="90px"
      size="small"
      v-if="deviceDesignType == 'MOBILE'"
    >
      <el-form-item label="状态栏">
        <el-switch
          v-model="globalConfig.adaptiveStatusBar"
          style="margin-bottom: 20px; margin-right: 8px"
        >
        </el-switch>
        <div
          style="display: inline-block; height: 26px; margin-top: 5px"
          @click.stop="showStatusColorPicker = true"
          @mouseleave="showStatusColorPicker = false"
        >
          <div
            class="bgColorStyle"
            :style="{
              background: globalConfig.statusBarColor,
            }"
          />
          <colorPicker
            v-model="globalConfig.statusBarColor"
            style="visibility: hidden"
            @change="showStatusColorPicker = false"
            :openStatus="showStatusColorPicker"
          />
        </div>
        <!-- <el-color-picker v-model="globalConfig.statusBarColor" style="vertical-align: middle; margin-left: 10px;" /> -->
      </el-form-item>
      <el-form-item label="下拉刷新">
        <el-switch v-model="globalConfig.pullRefresh"> </el-switch>
      </el-form-item>
    </el-form>
    <!-- 子页面配置 -->
    <!-- <el-form label-position="right" label-width="85px" size="small" v-else>
      <el-form-item label="名称">
        <el-input size="mini" v-model="subpageConfig.name"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 10px; height: 45px" label="背景">
        <span
          @click.stop="showBGColorPicker = true"
          @mouseleave="showBGColorPicker = false"
        >
          <div
            class="bgColorStyle"
            style="margin-bottom: 10px"
            :style="{
              background: subpageConfig.backgroundColor,
            }"
          />
          <colorPicker
            v-model="subpageConfig.backgroundColor"
            style="visibility: hidden; margin-left: 10px"
            @change="showBGColorPicker = false"
            :openStatus="showBGColorPicker"
          />
        </span>
        <el-slider
          v-model="subpageConfig.backgroundOpacity"
          :min="1"
          :max="10"
          style="display: inline-block; width: 150px; margin-bottom: 5px"
        ></el-slider>
      </el-form-item>
      <el-form-item label="状态栏">
        <el-switch
          v-model="subpageConfig.adaptiveStatusBar"
          style="margin-bottom: 20px; margin-right: 8px"
        >
        </el-switch>
        <div
          style="display: inline-block; height: 26px; margin-top: 5px"
          @click.stop="showSubStatusColorPicker = true"
          @mouseleave="showSubStatusColorPicker = false"
        >
          <div
            class="bgColorStyle"
            :style="{
              background: subpageConfig.statusBarColor,
            }"
          />
          <colorPicker
            v-model="subpageConfig.statusBarColor"
            style="visibility: hidden"
            @change="showSubStatusColorPicker = false"
            :openStatus="showSubStatusColorPicker"
          />
        </div>
      </el-form-item>
      <el-form-item label="下拉刷新">
        <el-switch v-model="subpageConfig.pullRefresh"> </el-switch>
      </el-form-item>
    </el-form> -->
    <!-- 通用 -->
    <bgImageConfig
      :componentConfigOptions="globalConfig"
      :deviceDesignType="deviceDesignType"
    />
    <el-form>
      <el-form-item>
        <el-collapse v-model="paramsActiveNames">
          <el-collapse-item name="1" title="页面入参">
            <el-form size="small" style="padding-left: 20px">
              <el-form-item
                v-for="(item, index) in pageParamsList"
                :key="index"
              >
                <el-input
                  placeholder="请输入参数名"
                  v-if="item.linkPageIndex == chooseSubpageIndex"
                  v-model="item.operateHrefPageParamName"
                  style="width: 200px"
                  size="mini"
                  @change="onSavePageParamsList"
                ></el-input>
                <el-button
                  type="text"
                  size="mini"
                  icon="iconfont icontrash"
                  v-if="item.linkPageIndex == chooseSubpageIndex"
                  @click="
                    handleOptionsRemoveInterfaceConfig(index, pageParamsList)
                  "
                  style="margin-left: 20px; color: #666666"
                />
              </el-form-item>
              <el-button
                type="text"
                size="mini"
                @click="handleAddColumnInterfaceConfig(pageParamsList)"
                >添加入参</el-button
              >
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>
      <!-- <el-form-item label="描述">
        <el-input
          type="textarea"
          :rows="5"
          v-model="subpageConfig.remark"
        ></el-input>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import bgImageConfig from "@/views/report/layout/report-config-basics/component-config/common/layout-config/bg-image.vue";
import imgUpload from "@/views/report/layout/report-config-basics/basics-config/img-upload.vue";
import Vue from "vue";

export default {
  components: {
    bgImageConfig,
    imgUpload,
  },
  props: [
    "globalConfig",
    "subpageList",
    "isSubpage",
    "chooseSubpageIndex",
    "imgFileUrl",
    "chosenFileUrl",
    "deviceDesignType",
  ],
  data() {
    return {
      paddingCenterOptions: [
        {value: 24, label: '超大(24px)'},
        {value: 20, label: '大(20px)'},
        {value: 16, label: '中(16px)'},
        {value: 12, label: '小(12px)'},
        {value: 8, label: '超小(8px)'},
        {value: 4, label: '极小(4px)'},
        {value: 0, label: '无(0px)'},
        {value: 'custom', label: '自定义'}
      ],
      paddingOptions: [
        {value: 24, label: '超大(24px)'},
        {value: 20, label: '大(20px)'},
        {value: 16, label: '中(16px)'},
        {value: 12, label: '小(12px)'},
        {value: 8, label: '超小(8px)'},
        {value: 4, label: '极小(4px)'},
        {value: 0, label: '无(0px)'},
      ],
      paddingInfo: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        center: 0,
      },
      paddingType: "",
      activeNames: [],
      subpageConfig: {},
      paramsActiveNames: "1",
      pageParamsList: [],
      imgVisible: false,
      imgTitle: "",
      listData: [],
      imgUrla: "",
      imgUrlb: "",
      // deviceDesignType: "",
      showStatusColorPicker: false,
      showBGColorPicker: false,
      showSubStatusColorPicker: false,
      pageInfo: {},
    };
  },
  computed: {
    getPageInfo() {
      return this.$store.getters.pageInfo;
    },
  },

  watch: {
    paddingInfo: {
      deep: true,
      handler(val) {
        if (this.paddingType === "all") {
          if ((val.left == val.right) && (val.left == val.top) && (val.left == val.bottom)) {
            this.paddingInfo.center = val.left
          } else {
            this.paddingInfo.center = 'custom'
          }
          this.globalConfig.leftPaddingDistance = val.left;
          this.globalConfig.rightPaddingDistance = val.right;
          this.globalConfig.bottomPaddingDistance = val.bottom;
          this.globalConfig.topPaddingDistance = val.top;
        } else if (this.paddingType === "center") {
          if (val.center == 'custom') {
            if (!this.activeNames.includes('padding')) {
              this.activeNames.push('padding')
            }
          } else {
            this.globalConfig.leftPaddingDistance =
              this.globalConfig.rightPaddingDistance =
                this.globalConfig.bottomPaddingDistance =
                  this.globalConfig.topPaddingDistance =
                    val.center;
            this.paddingInfo.center =
              this.paddingInfo.top =
                this.paddingInfo.right =
                  this.paddingInfo.bottom =
                    this.paddingInfo.left =
                      val.center;
          }
        }
      },
    },
    getPageInfo(newValue) {
      if (newValue) {
        this.pageInfo = newValue;
      }
    },
    chooseSubpageIndex: {
      immediate: true,
      handler(index) {
        if (index !== 0) {
          this.subpageConfig =
            this.subpageList[index - 1] && this.subpageList[index - 1].config;
        }
      },
    },
    globalConfig: {
      immediate: true,
      handler(val) {
        if (val.pageParamsList) {
          this.pageParamsList = val.pageParamsList;
        } else {
          val.pageParamsList = this.pageParamsList;
        }
      },
    },
  },
  created() {
    //iconfont iconxiaolian
    this.initPageConfig()
  },
  mounted(){
     this.initPageConfig()
  },
  methods: {
    change() {
      this.$forceUpdate(); // 偶尔输入不了
    },
    initPageConfig(){
      this.imgUrla = this.imgFileUrl;
      this.imgUrlb = this.chosenFileUrl;
      // this.deviceDesignType = this.deviceDesignType;
      this.pageInfo=this.$store.getters.pageInfo;

      this.paddingType = "all";
      this.paddingInfo.left = this.globalConfig.leftPaddingDistance || 0;
      this.paddingInfo.right = this.globalConfig.rightPaddingDistance || 0;
      this.paddingInfo.bottom = this.globalConfig.bottomPaddingDistance || 0;
      this.paddingInfo.top = this.globalConfig.topPaddingDistance || 0;
    },
    changeConfigValue(configOptions, configKey, value, fileId) {
      // configOptions[configKey] = value
      this.imgUrla = value;
      this.$emit("changeImg", "icon", value, fileId);
    },
    changeChosenConfigValue(configOptions, configKey, value, fileId) {
      this.imgUrlb = value;
      this.$emit("changeImg", "chosenIcon", value, fileId);
    },
    onSavePageParamsList() {
      this.$pageDataModelEngine.clearCustomDatePage();
      this.pageParamsList &&
        this.pageParamsList.forEach((item) => {
          //2020-07-01 在保存本地变量的时候 需要将 type linkPage  都进行保存 区别
          let dateType = {
            type: "pageParam",
            linkPageIndex: item.linkPageIndex,
            value: "",
            key: item.operateHrefPageParamName,
          };
          this.$pageDataModelEngine.saveCustomData(
            item.operateHrefPageParamName,
            "",
            dateType
          );
          // let dataTemp = this.$pageDataModelEngine.getCustomData(item.operateHrefPageParamName,dateType)
          // let dataTemp = getLocalDataByKey(item.operateHrefPageParamName)
          // saveAndUpdateLocalData(item.operateHrefPageParamName, dataTemp || '')
          // saveAndUpdatePageLocalData(item.operateHrefPageParamName,dataTemp || '','input')
        });
    },
    handleOptionsRemoveInterfaceConfig(index, paramList) {
      paramList.splice(index, 1);
      this.onSavePageParamsList();
    },
    handleAddColumnInterfaceConfig(paramList) {
      //2021-07-01 页面入参要关联页面 不能作为全局的存在
      if (!paramList) return false;
      paramList.push({
        operateHrefPageParamName: "",
        operateHrefPageParamValue: "",
        linkPageIndex: this.chooseSubpageIndex,
      });
    },
  },
};
</script>
<style scoped lang="scss">
.bgColorStyle {
  display: inline-block;
  border-radius: 4px;
  width: 26px;
  height: 26px;
  border: 1px solid #dcdfe6;
}

.border-padding {
  margin-top: 10px;

  /deep/.el-input-group__prepend {
    padding: 0 5px;
  }
}
</style>
