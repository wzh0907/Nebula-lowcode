<template>
  <div class="custom_text-content">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="margin">
        <template slot="title">
          <div style="display: flex; flex-direction: row">
            <div style="width: 75px">Margin</div>
            <el-select v-model="marginInfo.center" placeholder="请选择" @change="marginType = 'center'">
              <el-option
                v-for="item in marginCenterOptions"
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
          <el-select v-model="marginInfo.top" placeholder="请选择" @change="marginType = 'all'">
            <el-option
              v-for="item in marginOptions"
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
          <el-select v-model="marginInfo.right" placeholder="请选择" @change="marginType = 'all'">
            <el-option
              v-for="item in marginOptions"
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
          <el-select v-model="marginInfo.bottom" placeholder="请选择" @change="marginType = 'all'">
            <el-option
              v-for="item in marginOptions"
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
          <el-select v-model="marginInfo.left" placeholder="请选择" @change="marginType = 'all'">
            <el-option
              v-for="item in marginOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-collapse-item>
      <el-collapse-item name="padding">
        <template slot="title">
          <div style="display: flex; flex-direction: row">
            <div style="width: 75px">Padding</div>
            <el-select v-model="paddingInfo.center" placeholder="请选择" @change="paddingType = 'center'">
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
          <el-select v-model="paddingInfo.top" placeholder="请选择" @change="paddingType = 'all'">
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
          <el-select v-model="paddingInfo.right" placeholder="请选择" @change="paddingType = 'all'">
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
          <el-select v-model="paddingInfo.bottom" placeholder="请选择" @change="paddingType = 'all'">
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
          <el-select v-model="paddingInfo.left" placeholder="请选择" @change="paddingType = 'all'">
            <el-option
              v-for="item in paddingOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-collapse-item>
      <el-collapse-item name="borderRadius">
        <template slot="title">
          <div style="display: flex; flex-direction: row; align-items: center">
            <div style="width: 75px">圆角</div>
            <div @click.stop="">
              <el-input-number
                size="mini"
                :min="0"
                v-model="rInfo.center"
                style="width: 190px"
                @change="radiusType = 'center'"
              ></el-input-number>
            </div>
          </div>
        </template>
        <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 4px">
          <div style="width: 75px">
            上右
          </div>
          <el-input-number
            size="mini"
            :min="0"
            v-model="rInfo.topRight"
            style="width: 190px"
            @change="radiusType = 'all'"
          ></el-input-number>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 4px">
          <div style="width: 75px">
            下右
          </div>
          <el-input-number
            size="mini"
            :min="0"
            v-model="rInfo.bottomRight"
            style="width: 190px"
            @change="radiusType = 'all'"
          ></el-input-number>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 4px">
          <div style="width: 75px">
            下左
          </div>
          <el-input-number
            size="mini"
            :min="0"
            v-model="rInfo.bottomLeft"
            style="width: 190px"
            @change="radiusType = 'all'"
          ></el-input-number>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center">
          <div style="width: 75px">
            上左
          </div>
          <el-input-number
            size="mini"
            :min="0"
            v-model="rInfo.topLeft"
            style="width: 190px"
            @change="radiusType = 'all'"
          ></el-input-number>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div style="display: flex; flex-direction: row; align-items: center; height: 48px">
      <div style="width: 75px; font-size: 13px; font-weight: 500">边框</div>
      <div class="set-item set-long-item">
        <div
          class="set-all"
          :class="{
                    active: borderType === 'center',
                  }"
          @click="onChangeBorderType('center')"
        >
          <i class="iconfont iconbiankuang"></i>
        </div>
        <div
          class="set-seperately"
          :class="{
                    active: borderType === 'top',
                  }"
          @click="onChangeBorderType('top')"
        >
          <i class="iconfont iconborder-top"></i>
        </div>
        <div
          class="set-seperately"
          :class="{
                    active: borderType === 'right',
                  }"
          @click="onChangeBorderType('right')"
        >
          <i class="iconfont iconborder-right"></i>
        </div>
        <div
          class="set-seperately"
          :class="{
                    active: borderType === 'bottom',
                  }"
          @click="onChangeBorderType('bottom')"
        >
          <i class="iconfont iconborder-bottom"></i>
        </div>
        <div
          class="set-seperately"
          :class="{
                    active: borderType === 'left',
                  }"
          @click="onChangeBorderType('left')"
        >
          <i class="iconfont iconborder-left"></i>
        </div>
      </div>

    </div>
    <div
      class="border-input-number"
      style="display: flex; align-items: center"
      v-if="borderType"
    >
      <div class="colorSetting" @click.stop="showColorPicker = !showColorPicker" style="height: 26px;">
                  <span class="colorStyle">
                    <div
                      class="iconStyle"
                      :style="{
                        background: borderStyleObj.borderStyleColor,
                      }"
                    />
                    <colorPicker
                      :key="1"
                      :value="borderStyleObj.borderStyleColor"
                      style="visibility: hidden"
                      @change="onChangeBorderColor"
                      :openStatus="showColorPicker"
                    />
                  </span>
        <span></span>
      </div>
      <div style="margin: 0 5px">
        <el-select
          size="mini"
          :value="borderStyleObj.borderStyleType"
          @change="onChangeBorderStyleType"
          placeholder="请选择"
          style="width: 90px"
          clearable
        >
          <el-option
            v-for="item in borderTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-input-number
        size="mini"
        :min="0"
        :value="borderStyleObj.borderStyleSize"
        @change="onChangeBorderSize"
        style="width: 150px"
      ></el-input-number>


    </div>
  </div>
</template>

<script>
export default {
  name: "common-style-config",
  components: {},
  props: ["componentConfig"],
  data() {
    return {
      marginCenterOptions: [
        {value: 24, label: '超大(24px)'},
        {value: 20, label: '大(20px)'},
        {value: 16, label: '中(16px)'},
        {value: 12, label: '小(12px)'},
        {value: 8, label: '超小(8px)'},
        {value: 4, label: '极小(4px)'},
        {value: 0, label: '无(0px)'},
        {value: 'custom', label: '自定义'}
      ],
      marginOptions: [
        {value: 24, label: '超大(24px)'},
        {value: 20, label: '大(20px)'},
        {value: 16, label: '中(16px)'},
        {value: 12, label: '小(12px)'},
        {value: 8, label: '超小(8px)'},
        {value: 4, label: '极小(4px)'},
        {value: 0, label: '无(0px)'},
      ],
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
      radiusCenterOptions: [
        {value: 24, label: '超大(24px)'},
        {value: 20, label: '大(20px)'},
        {value: 16, label: '中(16px)'},
        {value: 12, label: '小(12px)'},
        {value: 8, label: '超小(8px)'},
        {value: 4, label: '极小(4px)'},
        {value: 0, label: '无(0px)'},
        {value: 'custom', label: '自定义'}
      ],
      radiusOptions: [
        {value: 24, label: '超大(24px)'},
        {value: 20, label: '大(20px)'},
        {value: 16, label: '中(16px)'},
        {value: 12, label: '小(12px)'},
        {value: 8, label: '超小(8px)'},
        {value: 4, label: '极小(4px)'},
        {value: 0, label: '无(0px)'},
      ],
      borderTypeOptions: [
        {label: '实线', value: 'solid'},
        {label: '点线', value: 'dotted'},
        {label: '虚线', value: 'dashed'},
      ],
      value: '',
      noBackgroundColorComponentList: ["van-design-notice-bar"],
      isFirstInit: true,
      showColorPicker: false,
      commonConfig: {},
      roundBlockType: "",
      activeNames: [],
      // 样式临时变量
      borderStyleObj: {
        borderStyleType: "",
        borderStyleSize: "",
        borderStyleColor: "",
      },
      radiusType: "",
      // 圆角
      borderRadius: 0,

      rInfo: {
        topLeft: 0,
        topRight: 0,
        bottomLeft: 0,
        bottomRight: 0,
        center: 0
      },
      paddingInfo: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        center: 0,
      },
      paddingDistance: 0,
      paddingType: "",
      marginInfo: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        center: 0,
      },
      marginType: "",
      borderType: "center",
      borderInfo: {},
      marginDistance: 0,
    };
  },
  watch: {
    componentConfig: {
      immediate: true,
      handler(val) {
        if (!val || !val.options || !val.options.commonConfig) return false;
        this.commonConfig = this.componentConfig.options.commonConfig;
        console.log('commonConfig=', this.commonConfig.borderStyle.topSize);
      },
    },
    marginInfo: {
      deep: true,
      handler(val) {
        if (this.marginType == "all") {
          if ((val.left == val.right) && (val.left == val.top) && (val.left == val.bottom)) {
            this.marginInfo.center = val.left
          } else {
            this.marginInfo.center = 'custom'
          }
          this.commonConfig.leftSpaceDistance = val.left;
          this.commonConfig.rightSpaceDistance = val.right;
          this.commonConfig.bottomSpaceDistance = val.bottom;
          this.commonConfig.topSpaceDistance = val.top;
        } else if (this.marginType == "center") {
          if (val.center == 'custom') {
            if (!this.activeNames.includes('margin')) {
              this.activeNames.push('margin')
            }
          } else {
            this.commonConfig.leftSpaceDistance =
              this.commonConfig.rightSpaceDistance =
                this.commonConfig.bottomSpaceDistance =
                  this.commonConfig.topSpaceDistance =
                    val.center;
            this.marginInfo.center =
              this.marginInfo.top =
                this.marginInfo.right =
                  this.marginInfo.bottom =
                    this.marginInfo.left =
                      val.center;
          }
        }
      },
    },
    paddingInfo: {
      deep: true,
      handler(val) {
        if (this.paddingType === "all") {
          if ((val.left == val.right) && (val.left == val.top) && (val.left == val.bottom)) {
            this.paddingInfo.center = val.left
          } else {
            this.paddingInfo.center = 'custom'
          }
          this.commonConfig.leftPaddingDistance = val.left;
          this.commonConfig.rightPaddingDistance = val.right;
          this.commonConfig.bottomPaddingDistance = val.bottom;
          this.commonConfig.topPaddingDistance = val.top;
        } else if (this.paddingType === "center") {
          if (val.center == 'custom') {
            if (!this.activeNames.includes('padding')) {
              this.activeNames.push('padding')
            }
          } else {
            this.commonConfig.leftPaddingDistance =
              this.commonConfig.rightPaddingDistance =
                this.commonConfig.bottomPaddingDistance =
                  this.commonConfig.topPaddingDistance =
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
    rInfo: {
      deep: true,
      handler(val) {
        if (this.radiusType == "all") {
          if ((val.topLeft == val.topRight) && (val.topLeft == val.bottomLeft) && (val.topLeft == val.bottomRight)) {
            this.rInfo.center = val.topLeft
          } else {
            this.rInfo.center = undefined
          }
          this.commonConfig.borderTopLeftRadius = val.topLeft
          this.commonConfig.borderTopRightRadius = val.topRight
          this.commonConfig.borderBottomLeftRadius = val.bottomLeft
          this.commonConfig.borderBottomRightRadius = val.bottomRight
        } else if (this.radiusType == "center") {
          this.commonConfig.borderTopLeftRadius =
            this.commonConfig.borderTopRightRadius =
              this.commonConfig.borderBottomLeftRadius =
                this.commonConfig.borderBottomRightRadius =
                  val.center;
          this.rInfo.center =
            this.rInfo.topLeft =
              this.rInfo.topRight =
                this.rInfo.bottomLeft =
                  this.rInfo.bottomRight =
                    val.center;
        }
      },
    },
  },
  created() {
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      // 解决组件初始化数据置空问题
      // this.isFirstInit = false;
      this.verifyStyleType();
      this.verifyStyleTypeRadius();
    });
  },
  methods: {
    verifyStyleType() {
      // 特殊处理
      let borderStyle = this.commonConfig.borderStyle;
      if (
        this.verifyIsEqual([
          borderStyle.leftDirveType,
          borderStyle.bottomDirveType,
          borderStyle.rightDirveType,
          borderStyle.topDirveType,
        ])) {
        this.borderStyleObj.borderStyleType = borderStyle.leftDirveType;
      }
      if (
        this.verifyIsEqual([
          borderStyle.leftSize,
          borderStyle.bottomSize,
          borderStyle.rightSize,
          borderStyle.topSize,
        ])) {
        this.borderStyleObj.borderStyleSize = borderStyle.leftSize;
      }
      if (
        this.verifyIsEqual([
          borderStyle.leftDirveColor,
          borderStyle.bottomDirveColor,
          borderStyle.rightDirveColor,
          borderStyle.topDirveColor,
        ])) {
        this.borderStyleObj.borderStyleColor = borderStyle.leftDirveColor;
      }
    },
    verifyStyleTypeRadius() {
      // 特殊处理
      if (
        this.verifyIsEqual([
          this.commonConfig.borderTopLeftRadius,
          this.commonConfig.borderTopRightRadius,
          this.commonConfig.borderBottomLeftRadius,
          this.commonConfig.borderBottomRightRadius,
        ])
      ) {
        this.borderRadius = this.commonConfig.borderTopLeftRadius;
      }
    },
    verifyIsEqual(arr) {
      let isEqual = true;
      arr.forEach((a) => {
        arr.forEach((b) => {
          if (a !== b) {
            isEqual = false;
          }
        });
        // if (arr.indexOf(a) === -1) {
        //   isEqual = false
        // }
      });
      return isEqual;
    },
    onChangePaddingType(type) {
      if (type !== "center") {
        // 禁止编辑圆角
        this.paddingType = "";
      }
      this.paddingType = type;
    },
    onChangeMarginType(type) {
      if (type !== "center") {
        // 禁止编辑圆角
        this.marginType = "";
      }
      this.marginType = type;
    },
    onChangeBorderColor(color) {
      this.showColorPicker = false
      let borderStyle = this.commonConfig.borderStyle;
      let type = this.borderType;
      this.borderStyleObj.borderStyleColor = color
      if (type === "top") {
        borderStyle.topDirveColor = color
      } else if (type === "right") {
        borderStyle.rightDirveColor = color
      } else if (type === "bottom") {
        borderStyle.bottomDirveColor = color
      } else if (type === "left") {
        borderStyle.leftDirveColor = color
      } else if (type === "center") {
        borderStyle.leftDirveColor =
          borderStyle.bottomDirveColor =
            borderStyle.rightDirveColor =
              borderStyle.topDirveColor = color
      }
    },
    onChangeBorderStyleType(style) {
      let borderStyle = this.commonConfig.borderStyle;
      let type = this.borderType;
      this.borderStyleObj.borderStyleType = style
      if (type === "top") {
        borderStyle.topDirveType = style
      } else if (type === "right") {
        borderStyle.rightDirveType = style
      } else if (type === "bottom") {
        borderStyle.bottomDirveType = style
      } else if (type === "left") {
        borderStyle.leftDirveType = style
      } else if (type === "center") {
        borderStyle.leftDirveType =
          borderStyle.bottomDirveType =
            borderStyle.rightDirveType =
              borderStyle.topDirveType = style
      }
    },
    onChangeBorderSize(size) {
      let borderStyle = this.commonConfig.borderStyle;
      let type = this.borderType;
      this.borderStyleObj.borderStyleSize = size
      if (type === "top") {
        borderStyle.topSize = size
      } else if (type === "right") {
        borderStyle.rightSize = size
      } else if (type === "bottom") {
        borderStyle.bottomSize = size
      } else if (type === "left") {
        borderStyle.leftSize = size
      } else if (type === "center") {
        borderStyle.leftSize =
          borderStyle.bottomSize =
            borderStyle.rightSize =
              borderStyle.topSize = size
      }
    },
    onChangeBorderType(type) {
      let borderStyle = this.commonConfig.borderStyle;
      this.borderType = type;
      if (type === "top") {
        this.borderStyleObj.borderStyleType = borderStyle.topDirveType;
        this.borderStyleObj.borderStyleSize = borderStyle.topSize;
        this.borderStyleObj.borderStyleColor = borderStyle.topDirveColor;
      } else if (type === "right") {
        this.borderStyleObj.borderStyleType = borderStyle.rightDirveType;
        this.borderStyleObj.borderStyleSize = borderStyle.rightSize;
        this.borderStyleObj.borderStyleColor = borderStyle.rightDirveColor;
      } else if (type === "bottom") {
        this.borderStyleObj.borderStyleType = borderStyle.bottomDirveType;
        this.borderStyleObj.borderStyleSize = borderStyle.bottomSize;
        this.borderStyleObj.borderStyleColor = borderStyle.bottomDirveColor;
      } else if (type === "left") {
        this.borderStyleObj.borderStyleType = borderStyle.leftDirveType;
        this.borderStyleObj.borderStyleSize = borderStyle.leftSize;
        this.borderStyleObj.borderStyleColor = borderStyle.leftDirveColor;
      } else if (type === "center") {
        this.isFirstInit = true;
        this.borderStyleObj.borderStyleType = "";
        this.borderStyleObj.borderStyleSize = "";
        this.borderStyleObj.borderStyleColor = "";

        this.$nextTick(() => {
          // 解决组件初始化数据置空问题
          this.isFirstInit = false;
          this.verifyStyleType();
        });
      }
    },

    //圆角
    onChangeRadiusType(type) {
      this.radiusType = type;
    },
    init() {
      this.radiusType = "all";
      this.rInfo.topLeft = this.commonConfig.borderTopLeftRadius || 0;
      this.rInfo.topRight = this.commonConfig.borderTopRightRadius || 0;
      this.rInfo.bottomLeft = this.commonConfig.borderBottomLeftRadius || 0;
      this.rInfo.bottomRight = this.commonConfig.borderBottomRightRadius || 0;

      this.paddingType = "all";
      this.paddingInfo.left = this.commonConfig.leftPaddingDistance || 0;
      this.paddingInfo.right = this.commonConfig.rightPaddingDistance || 0;
      this.paddingInfo.bottom = this.commonConfig.bottomPaddingDistance || 0;
      this.paddingInfo.top = this.commonConfig.topPaddingDistance || 0;


      this.marginType = "all";
      this.marginInfo.left = this.commonConfig.leftSpaceDistance || 0;
      this.marginInfo.right = this.commonConfig.rightSpaceDistance || 0;
      this.marginInfo.bottom = this.commonConfig.bottomSpaceDistance || 0;
      this.marginInfo.top = this.commonConfig.topSpaceDistance || 0;
    },

    // changeStatus(data,value) {
    //   this.config.collapsePanelColumnsConfigs.forEach(() => {
    //       this.componentConfig.options[data.type]=value
    //   })
    // }
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-input-number--mini {
  width: 100px;
}

p {
  margin: 0;
  padding: 0;
}

.iconStyle {
  display: inline-block;
  border-radius: 4px;
  width: 26px;
  height: 26px;
  border: 1px solid #dcdfe6;
}

.config-item-block {
  // background-color: #f6f7f8;
  margin-bottom: 10px;
  overflow: auto;

  .block-left {
    // float: left;
    // width: 45%;
    padding: 10px 30px 10px 40px;

    .block-left-item {
      text-align: center;

      p {
        display: inline-block;
        cursor: pointer;
        line-height: 1;

        .iconfont {
          font-size: 38px;
        }
      }

      .active {
        color: #197aff;
      }
    }
  }

  .block-right {
    // float: right;
    // width: 55%;
    padding: 10px 30px;
    // overflow: visible;
  }

  .round-wrap {
    display: flex;
    text-align: center;
    align-items: center;

    .round-item {
      flex: 1;

      p {
        cursor: pointer;
      }

      .active {
        color: #197aff;
      }
    }
  }
}

.config-item-block::-webkit-scrollbar {
  display: none;
}

.custom-config-item {
  display: flex;
  line-height: 20px;

  p {
    margin: 0px 5px;
    cursor: pointer;

    .iconfont {
      font-size: 16px;
    }
  }

  .active {
    color: #197aff;
  }
}

.set-item {
  display: flex;
  height: 22px;
  width: 50px;
  border-radius: 2px;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(237, 237, 237);
  margin-right: 8px;
  position: relative;

  .set-all {
    display: flex;
    width: 36px;
    justify-content: space-around;
    -webkit-box-align: center;
    align-items: center;
    cursor: pointer;
    border-right: 1px solid rgb(237, 237, 237);
    transition: all 0.2s ease-in-out 0s;
  }

  .iconfont {
    font-size: 14px;
  }

  .set-seperately {
    display: inline-flex;
    width: 24px;
    vertical-align: middle;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    transition: all 0.2s ease-in-out 0s;
    cursor: pointer;
    padding: 0px 5px;
  }

  .active {
    background-color: rgb(237, 237, 237);
  }

  .chosenActive {
    color: #197aff;
  }

  .mutity-item {
  }
}

/deep/ .el-input-number.is-controls-right .el-input__inner {
  padding-left: 1px;
  padding-right: 20px;
}

.set-long-item {
  width: 125px;
}

.set-value-item {
  display: flex;
}

.set-item-desc-first {
  display: inline-block;
  margin-left: 10px;

  span {
    margin-left: 30px;
  }
}

.set-item-desc {
  display: inline-block;

  span {
    margin-left: 40px;
  }
}

.border-input-number {
  /deep/ .el-input-number.is-controls-right .el-input-number__decrease {
    bottom: 6px;
  }

  .m-colorPicker {
    width: 0;
  }

  /deep/ .m-colorPicker .box.open {
    left: -40px;
  }

  i {
    display: inline;
  }

  i.active,
  .activeBlod,
  .activeTilt,
  .activeUnder {
    background: #ff9966;
    padding: 2px;
  }

  .colorSetting {
    display: flex;
    position: relative;
    margin-left: 5px;

    span {
      flex: 1;

      .iconStyle {
        font-size: 26px;
      }

      .iconStyles {
        font-size: 24px;
      }

      .iconbottom {
        font-weight: bold;
        font-size: 12px;
      }
    }

    span:nth-child(2) {
      margin-top: -7px;
    }

    .doit {
      visibility: visible !important;
      opacity: 1 !important;
    }
  }
}

.custom_text-content {
  /deep/ .el-collapse-item__wrap {
    overflow: initial;
  }

  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
  }

  /deep/ .el-collapse-item__wrap {
    border-bottom: 0;
  }
}
</style>
