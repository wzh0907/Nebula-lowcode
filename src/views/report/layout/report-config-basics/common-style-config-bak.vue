<template>
  <div class="custom_collapse_panel">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="边框" name="1">
        <div class="config-item-block">
          <!-- <div class="block-left" style="padding-top: 30px;">
            <div class="block-left-item">
              <p :class="{'active': blockType === 'top'}" @click="onChangeBlockType('top')" title="上">┳</p>
            </div>
            <div class="block-left-item">
              <p :class="{'active': blockType === 'left'}" @click="onChangeBlockType('left')" title="左">┣</p>
              <p :class="{'active': blockType === 'center'}" @click="onChangeBlockType('center')" style="margin: 20px;" title="全部">╋</p>
              <p :class="{'active': blockType === 'right'}" @click="onChangeBlockType('right')" title="右">┫</p>
            </div>
            <div class="block-left-item">
              <p :class="{'active': blockType === 'bottom'}" @click="onChangeBlockType('bottom')" title="下">┻</p>
            </div>
          </div> -->
          <div class="block-left" style="padding-top: 30px">
            <div class="block-left-item">
              <p
                :class="{ active: roundBlockType === 'leftTop' }"
                @click="onChangeRoundBlockType('leftTop')"
                title="左上角"
              >
                <i class="iconfont iconradius-upleft"></i>
              </p>
              <p
                :class="{ active: blockType === 'top' }"
                @click="onChangeBlockType('top')"
                title="上边框"
                style="margin: 0px 5px"
              >
                <i class="iconfont iconborder-top"></i>
              </p>
              <p
                :class="{ active: roundBlockType === 'rightTop' }"
                @click="onChangeRoundBlockType('rightTop')"
                title="右上角"
              >
                <i class="iconfont iconradius-upright"></i>
              </p>
            </div>
            <div class="block-left-item">
              <p
                :class="{ active: blockType === 'left' }"
                @click="onChangeBlockType('left')"
                title="左边框"
              >
                <i class="iconfont iconborder-left"></i>
              </p>
              <p
                :class="{
                  active: blockType === 'center' && roundBlockType === 'center',
                }"
                @click="onChangeBlockAndRoundType('center')"
                title="全部"
                style="margin: 5px"
              >
                <i class="iconfont iconborder"></i>
              </p>
              <p
                :class="{ active: blockType === 'right' }"
                @click="onChangeBlockType('right')"
                title="右边框"
              >
                <i class="iconfont iconborder-right"></i>
              </p>
            </div>
            <div class="block-left-item">
              <p
                :class="{ active: roundBlockType === 'leftBottom' }"
                @click="onChangeRoundBlockType('leftBottom')"
                title="左下角"
              >
                <i class="iconfont iconradius-bottomleft"></i>
              </p>
              <p
                :class="{ active: blockType === 'bottom' }"
                @click="onChangeBlockType('bottom')"
                title="下边框"
                style="margin: 0px 5px"
              >
                <i class="iconfont iconborder-bottom"></i>
              </p>
              <p
                :class="{ active: roundBlockType === 'rightBottom' }"
                @click="onChangeRoundBlockType('rightBottom')"
                title="右下角"
              >
                <i class="iconfont iconradius-bottomright"></i>
              </p>
            </div>
          </div>
          <div
            class="block-right"
            style="padding-bottom: 7px"
            v-if="roundBlockType"
          >
            <el-form-item label="圆角" label-position="left" label-width="60px">
              <el-input-number
                controls-position="right"
                size="mini"
                v-model="borderRadius"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="block-right" v-if="blockType">
            <el-form-item label="线形" label-position="left" label-width="60px">
              <el-select
                size="mini"
                v-model="inputStyleObj.borderStyleType"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in [
                    { label: '实线', value: 'solid' },
                    { label: '点线', value: 'dotted' },
                    { label: '虚线', value: 'dashed' },
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="宽" label-position="left" label-width="60px">
              <el-input-number
                controls-position="right"
                size="mini"
                v-model="inputStyleObj.borderStyleSize"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="颜色" label-position="left" label-width="60px">
              <span
                @click.stop="showColorPicker = true"
                @mouseleave="showColorPicker = false"
              >
                <div
                  class="iconStyle"
                  :style="{
                    background: inputStyleObj.borderStyleColor,
                  }"
                />
                <colorPicker
                  v-if="showColorPicker"
                  ref="colorPicker"
                  v-model="inputStyleObj.borderStyleColor"
                  style="visibility: hidden"
                  @change="showColorPicker = false"
                  :openStatus="showColorPicker"
                />
              </span>
              <!-- <el-color-picker size="mini" v-model="inputStyleObj.borderStyleColor" style="vertical-align: middle;" /> -->
            </el-form-item>
            <el-form-item
              label="内边距"
              label-position="left"
              label-width="60px"
            >
              <el-input-number
                controls-position="right"
                size="mini"
                v-model="inputStyleObj.paddingDistance"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              label="外边距"
              label-position="left"
              label-width="60px"
            >
              <el-input-number
                controls-position="right"
                size="mini"
                v-model="inputStyleObj.marginDistance"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </div>
        </div>
        <!-- <div class="config-item-block"> -->
          <!-- <div class="block-left round-wrap">
            <div class="round-item">
              <p :class="{'active': roundBlockType === 'leftTop'}" @click="onChangeRoundBlockType('leftTop')" title="左上角">┏</p>
              <p :class="{'active': roundBlockType === 'leftBottom'}" @click="onChangeRoundBlockType('leftBottom')" title="左下角">┗</p>
            </div>
            <div class="round-item">
              <p :class="{'active': roundBlockType === 'center'}" @click="onChangeRoundBlockType('center')" title="全部">╋</p>
            </div>
            <div class="round-item">
              <p :class="{'active': roundBlockType === 'rightTop'}" @click="onChangeRoundBlockType('rightTop')" title="右上角">┓</p>
              <p :class="{'active': roundBlockType === 'rightBottom'}" @click="onChangeRoundBlockType('rightBottom')" title="右下角">┛</p>
            </div>
          </div> -->
          <!-- <div class="block-right" style="padding-top: 7px;">
            <el-form-item label="圆角" label-position="left" label-width="60px">
              <el-input-number controls-position="right" size="mini" v-model="borderRadius" style="width: 100%;"></el-input-number>
            </el-form-item>
          </div> -->
        <!-- </div> -->
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "common-style-config",
  components: {},
  props: ["componentConfig"],
  data() {
    return {
      noBackgroundColorComponentList: ["van-design-notice-bar"],
      isFirstInit: true,
      showColorPicker: false,
      commonConfig: {},
      blockType: "center",
      roundBlockType: "center",
      activeNames: [],
      // 样式临时变量
      inputStyleObj: {
        borderStyleType: "",
        borderStyleSize: "",
        borderStyleColor: "",
        paddingDistance: 0,
        marginDistance: 0,
      },
      // 圆角
      borderRadius: 0,
    };
  },
  watch: {
    componentConfig: {
      immediate: true,
      handler(val) {
        if (!val || !val.options || !val.options.commonConfig) return false;
        this.commonConfig = this.componentConfig.options.commonConfig;
      },
    },
    inputStyleObj: {
      deep: true,
      handler(val) {
        if (this.isFirstInit) return;
        let borderStyle = this.commonConfig.borderStyle;
        let type = this.blockType;
        if (type === "top") {
          borderStyle.topDirveType = this.inputStyleObj.borderStyleType;
          borderStyle.topSize = this.inputStyleObj.borderStyleSize;
          borderStyle.topDirveColor = this.inputStyleObj.borderStyleColor;
          this.commonConfig.topPaddingDistance =
            this.inputStyleObj.paddingDistance;
          this.commonConfig.topSpaceDistance =
            this.inputStyleObj.marginDistance;
        } else if (type === "right") {
          borderStyle.rightDirveType = this.inputStyleObj.borderStyleType;
          borderStyle.rightSize = this.inputStyleObj.borderStyleSize;
          borderStyle.rightDirveColor = this.inputStyleObj.borderStyleColor;
          this.commonConfig.rightPaddingDistance =
            this.inputStyleObj.paddingDistance;
          this.commonConfig.rightSpaceDistance =
            this.inputStyleObj.marginDistance;
        } else if (type === "bottom") {
          borderStyle.bottomDirveType = this.inputStyleObj.borderStyleType;
          borderStyle.bottomSize = this.inputStyleObj.borderStyleSize;
          borderStyle.bottomDirveColor = this.inputStyleObj.borderStyleColor;
          this.commonConfig.bottomPaddingDistance =
            this.inputStyleObj.paddingDistance;
          this.commonConfig.bottomSpaceDistance =
            this.inputStyleObj.marginDistance;
        } else if (type === "left") {
          borderStyle.leftDirveType = this.inputStyleObj.borderStyleType;
          borderStyle.leftSize = this.inputStyleObj.borderStyleSize;
          borderStyle.leftDirveColor = this.inputStyleObj.borderStyleColor;
          this.commonConfig.leftPaddingDistance =
            this.inputStyleObj.paddingDistance;
          this.commonConfig.leftSpaceDistance =
            this.inputStyleObj.marginDistance;
        } else if (type === "center") {
          borderStyle.leftDirveType =
            borderStyle.bottomDirveType =
            borderStyle.rightDirveType =
            borderStyle.topDirveType =
              this.inputStyleObj.borderStyleType;
          borderStyle.leftSize =
            borderStyle.bottomSize =
            borderStyle.rightSize =
            borderStyle.topSize =
              this.inputStyleObj.borderStyleSize;
          borderStyle.leftDirveColor =
            borderStyle.bottomDirveColor =
            borderStyle.rightDirveColor =
            borderStyle.topDirveColor =
              this.inputStyleObj.borderStyleColor;
          this.commonConfig.leftPaddingDistance =
            this.commonConfig.bottomPaddingDistance =
            this.commonConfig.rightPaddingDistance =
            this.commonConfig.topPaddingDistance =
              this.inputStyleObj.paddingDistance;
          this.commonConfig.leftSpaceDistance =
            this.commonConfig.bottomSpaceDistance =
            this.commonConfig.rightSpaceDistance =
            this.commonConfig.topSpaceDistance =
              this.inputStyleObj.marginDistance;
        }
      },
    },
    borderRadius: {
      handler(val) {
        let type = this.roundBlockType;
        if (type === "leftTop") {
          this.commonConfig.borderTopLeftRadius = this.borderRadius;
        } else if (type === "rightTop") {
          this.commonConfig.borderTopRightRadius = this.borderRadius;
        } else if (type === "leftBottom") {
          this.commonConfig.borderBottomLeftRadius = this.borderRadius;
        } else if (type === "rightBottom") {
          this.commonConfig.borderBottomRightRadius = this.borderRadius;
        } else if (type === "center") {
          this.commonConfig.borderTopLeftRadius =
            this.commonConfig.borderTopRightRadius =
            this.commonConfig.borderBottomLeftRadius =
            this.commonConfig.borderBottomRightRadius =
              this.borderRadius;
          this.commonConfig.borderRadius =
            this.commonConfig.borderTopLeftRadius; // 兼容老配置
        }
      },
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      // 解决组件初始化数据置空问题
      this.isFirstInit = false;
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
        ]) &&
        this.verifyIsEqual([
          borderStyle.leftSize,
          borderStyle.bottomSize,
          borderStyle.rightSize,
          borderStyle.topSize,
        ]) &&
        this.verifyIsEqual([
          borderStyle.leftDirveColor,
          borderStyle.bottomDirveColor,
          borderStyle.rightDirveColor,
          borderStyle.topDirveColor,
        ]) &&
        this.verifyIsEqual([
          this.commonConfig.leftPaddingDistance,
          this.commonConfig.bottomPaddingDistance,
          this.commonConfig.rightPaddingDistance,
          this.commonConfig.topPaddingDistance,
        ]) &&
        this.verifyIsEqual([
          this.commonConfig.leftSpaceDistance,
          this.commonConfig.bottomSpaceDistance,
          this.commonConfig.rightSpaceDistance,
          this.commonConfig.topSpaceDistance,
        ])
        // (borderStyle.leftDirveType === borderStyle.bottomDirveType === borderStyle.rightDirveType === borderStyle.topDirveType) &&
        // (borderStyle.leftSize === borderStyle.bottomSize === borderStyle.rightSize === borderStyle.topSize) &&
        // (borderStyle.leftDirveColor === borderStyle.bottomDirveColor === borderStyle.rightDirveColor === borderStyle.topDirveColor) &&
        // (this.commonConfig.leftPaddingDistance === this.commonConfig.bottomPaddingDistance === this.commonConfig.rightPaddingDistance === this.commonConfig.topPaddingDistance) &&
        // (this.commonConfig.leftSpaceDistance === this.commonConfig.bottomSpaceDistance === this.commonConfig.rightSpaceDistance === this.commonConfig.topSpaceDistance)
      ) {
        this.inputStyleObj.borderStyleType = borderStyle.leftDirveType;
        this.inputStyleObj.borderStyleSize = borderStyle.leftSize;
        this.inputStyleObj.borderStyleColor = borderStyle.leftDirveColor;
        this.inputStyleObj.paddingDistance =
          this.commonConfig.leftPaddingDistance;
        this.inputStyleObj.marginDistance = this.commonConfig.leftSpaceDistance;
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
    onChangeBlockType(type) {
      if (type !== "center") {
        // 禁止编辑圆角
        this.roundBlockType = "";
      }
      let borderStyle = this.commonConfig.borderStyle;
      this.blockType = type;
      if (type === "top") {
        this.inputStyleObj.borderStyleType = borderStyle.topDirveType;
        this.inputStyleObj.borderStyleSize = borderStyle.topSize;
        this.inputStyleObj.borderStyleColor = borderStyle.topDirveColor;
        this.inputStyleObj.paddingDistance =
          this.commonConfig.topPaddingDistance;
        this.inputStyleObj.marginDistance = this.commonConfig.topSpaceDistance;
      } else if (type === "right") {
        this.inputStyleObj.borderStyleType = borderStyle.rightDirveType;
        this.inputStyleObj.borderStyleSize = borderStyle.rightSize;
        this.inputStyleObj.borderStyleColor = borderStyle.rightDirveColor;
        this.inputStyleObj.paddingDistance =
          this.commonConfig.rightPaddingDistance;
        this.inputStyleObj.marginDistance =
          this.commonConfig.rightSpaceDistance;
      } else if (type === "bottom") {
        this.inputStyleObj.borderStyleType = borderStyle.bottomDirveType;
        this.inputStyleObj.borderStyleSize = borderStyle.bottomSize;
        this.inputStyleObj.borderStyleColor = borderStyle.bottomDirveColor;
        this.inputStyleObj.paddingDistance =
          this.commonConfig.bottomPaddingDistance;
        this.inputStyleObj.marginDistance =
          this.commonConfig.bottomSpaceDistance;
      } else if (type === "left") {
        this.inputStyleObj.borderStyleType = borderStyle.leftDirveType;
        this.inputStyleObj.borderStyleSize = borderStyle.leftSize;
        this.inputStyleObj.borderStyleColor = borderStyle.leftDirveColor;
        this.inputStyleObj.paddingDistance =
          this.commonConfig.leftPaddingDistance;
        this.inputStyleObj.marginDistance = this.commonConfig.leftSpaceDistance;
      } else if (type === "center") {
        this.isFirstInit = true;
        this.inputStyleObj.borderStyleType = "";
        this.inputStyleObj.borderStyleSize = "";
        this.inputStyleObj.borderStyleColor = "";
        this.inputStyleObj.paddingDistance = "";
        this.inputStyleObj.marginDistance = "";
        this.$nextTick(() => {
          // 解决组件初始化数据置空问题
          this.isFirstInit = false;
          this.verifyStyleType();
        });
      }
    },
    onChangeRoundBlockType(type) {
      if (type !== "center") {
        // 禁止编辑边框
        this.blockType = "";
      }
      this.roundBlockType = type;
      if (type === "leftTop") {
        this.borderRadius = this.commonConfig.borderTopLeftRadius;
      } else if (type === "rightTop") {
        this.borderRadius = this.commonConfig.borderTopRightRadius;
      } else if (type === "leftBottom") {
        this.borderRadius = this.commonConfig.borderBottomLeftRadius;
      } else if (type === "rightBottom") {
        this.borderRadius = this.commonConfig.borderBottomRightRadius;
      } else if (type === "center") {
        this.borderRadius = "";
        this.verifyStyleTypeRadius();
      }
    },
    // 圆角及边框全部
    onChangeBlockAndRoundType() {
      this.onChangeBlockType("center");
      this.onChangeRoundBlockType("center");
    },
    // changeStatus(data,value) {
    //   this.config.collapsePanelColumnsConfigs.forEach(() => {
    //       this.componentConfig.options[data.type]=value
    //   })
    // }
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input-number--mini {
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
  margin-top: 5px;
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
</style>
