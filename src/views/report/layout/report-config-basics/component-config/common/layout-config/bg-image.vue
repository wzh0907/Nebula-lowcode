<template>
  <div style="border-top: 1px solid #EBEEF5; margin-top: 20px; padding-top: 0">
    <div style="display: flex; align-items: center;height: 48px;">
      <div style="font-size: 13px; font-weight: 500; width: 50px">背景</div>
      <el-input
        placeholder="none"
        v-model="componentConfigOptions.backgroundImage"
        size="mini"
        style="width: 260px"
      >
        <template slot="append">
          <imgUpload
            :imgSrc="componentConfigOptions.backgroundImage"
            @changeConfigValue="changeConfigValue"
            :configOptions="componentConfigOptions"
            configKey="backgroundImage"
          >
            <i
              slot="content"
              class="el-icon-upload"
              style="font-size: 22px; cursor: pointer"
            ></i>
          </imgUpload>
        </template>
      </el-input>
      <div
        style="display: inline-block;width: 26px;height: 26px;margin-left: 5px"
        @click.stop="showColorPicker = true"
        @mouseleave="showColorPicker = false"
      >
        <div
          class="bgColorStyle"
          :style="{
                background: componentConfigOptions.backgroundColor,
              }"
        />
        <colorPicker
          v-model="componentConfigOptions.backgroundColor"
          :opacity="componentConfigOptions.backgroundOpacity"
          style="visibility: hidden; margin-left: -80px"
          @change="showColorPicker = false"
          @changeOpacity="changeOpacity"
          :openStatus="showColorPicker"
        />
      </div>
    </div>
    <div v-if="deviceDesignType === 'MOBILE'" style="display: flex; align-items: center;height: 48px;">
      <div style="font-size: 13px; font-weight: 500; width: 50px">导航栏</div>
      <div
        style="display: inline-block;width: 26px;  height: 26px; margin-bottom: 10px; margin-left: 10px"
        @click.stop="showNavColorPicker = false; showNavBGColorPicker = !showNavBGColorPicker"
      >
          <span>
            <i
              class="iconfont iconzitiyanse iconStyle"
              :style="{
                color: componentConfigOptions.navigatorColor,
                background: componentConfigOptions.navigatorBGColor,
              }"
            />
            <colorPicker
              :key="1"
              v-model="componentConfigOptions.navigatorBGColor"
              style="visibility: hidden; margin-left: 50px"
              @change="showNavBGColorPicker = false"
              :openStatus="showNavBGColorPicker"
            />
          </span>
        <span></span>
      </div>
      <div
        style="display: inline-block; height: 26px; margin-bottom: 10px; margin-left: 8px"
        @click.stop="showNavBGColorPicker = false; showNavColorPicker = !showNavColorPicker"
      >
          <span>
            <i
              class="iconfont iconzitiyanse iconStyles"
              :style="{ color: componentConfigOptions.navigatorColor }"
            />
            <colorPicker
              :key="2"
              v-model="componentConfigOptions.navigatorColor"
              style="visibility: hidden;"
              @change="showNavColorPicker = false"
              :openStatus="showNavColorPicker"
            />
          </span>
        <span></span>
      </div>
    </div>
    <div v-if="deviceDesignType === 'MOBILE'"  style="display: flex; align-items: center;height: 48px;">
      <div style="font-size: 13px; font-weight: 500; width: 80px">隐藏导航栏</div>
      <el-switch v-model="componentConfigOptions.hideNavigator"></el-switch>
    </div>
  </div>
</template>

<script>
import imgUpload from "@/views/report/layout/report-config-basics/basics-config/img-upload.vue";
export default {
  name: "bg-image-config",
  components: {
    imgUpload,
  },
  props: {
    componentConfigOptions: {
      type: Object,
      default: () => {},
    },
    deviceDesignType: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      activeNames: ["1"],
      bgImageUrl: "",
      backgroundSize: "",
      positionType: "",
      showColorPicker: false,
      showNavBGColorPicker: false,
      showNavColorPicker: false,
      // test333: '',
      // test444: '',
      // test555: '',
      // test666: '',
    };
  },
  computed: {
    showNavigator: {
      get: function () {
        let show
        if (this.componentConfigOptions.showNavigator == undefined) {
          show = true
        } else {
          show = this.componentConfigOptions.showNavigator
        }
        console.log('show=', show);
        return show
      },
      set: function (newVal) {
        console.log('newVal=', newVal)
        this.componentConfigOptions.showNavigator = newVal
        console.log('showNavigator=', this.componentConfigOptions.showNavigator)
      }
    }
  },
  watch: {},
  created() {

  },
  methods: {
    onChangePositionType(type) {
      this.positionType = type;
      if (type === "leftTop") {
        this.componentConfigOptions.backgroundPositionX = 0;
        this.componentConfigOptions.backgroundPositionY = 0;
      } else if (type === "top") {
        this.componentConfigOptions.backgroundPositionX = 50;
        this.componentConfigOptions.backgroundPositionY = 0;
      } else if (type === "rightTop") {
        this.componentConfigOptions.backgroundPositionX = 100;
        this.componentConfigOptions.backgroundPositionY = 0;
      } else if (type === "left") {
        this.componentConfigOptions.backgroundPositionX = 0;
        this.componentConfigOptions.backgroundPositionY = 50;
      } else if (type === "center") {
        this.componentConfigOptions.backgroundPositionX = 50;
        this.componentConfigOptions.backgroundPositionY = 50;
      } else if (type === "right") {
        this.componentConfigOptions.backgroundPositionX = 100;
        this.componentConfigOptions.backgroundPositionY = 50;
      } else if (type === "leftBottom") {
        this.componentConfigOptions.backgroundPositionX = 0;
        this.componentConfigOptions.backgroundPositionY = 100;
      } else if (type === "bottom") {
        this.componentConfigOptions.backgroundPositionX = 50;
        this.componentConfigOptions.backgroundPositionY = 100;
      } else if (type === "rightBottom") {
        this.componentConfigOptions.backgroundPositionX = 100;
        this.componentConfigOptions.backgroundPositionY = 100;
      }
    },
    onChangeBackgroundSize(type) {
      if (type === "auto") {
        this.componentConfigOptions.backgroundSizeWidth = "";
        this.componentConfigOptions.backgroundSizeHeight = "";
      } else if (type === "size") {
        this.componentConfigOptions.backgroundSize = "";
      }
    },
    changeConfigValue(configOptions, configKey, value) {
      configOptions[configKey] = value;
    },
    changeOpacity(opacity){
      this.componentConfigOptions.backgroundOpacity=opacity
    },
    onChangeShowNavigator() {
      console.log('onChangeShowNavigator');
      this.showNavigator = !this.showNavigator
    }
  },
};
</script>

<style lang="scss" scoped>
/ddep/.el-input-group__append,
.el-input-group__prepend {
  padding: 0px 8px;
}
p {
  margin: 0;
  padding: 0;
}
.unactive {
  color: #ccc;
}
.active {
  color: #409eff;
}
.bgColorStyle {
  display: inline-block;
  border-radius: 4px;

  width: 26px;
  height: 26px;
  border: 1px solid #dcdfe6;
}
.border-wrap {
  position: relative;
  padding: 15px 10px 15px 10px;
  border: 1px solid #ccc;
  .border-title {
    position: absolute;
    top: -11px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 12px;
  }
  .position-left {
    float: left;
  }
  .position-right {
    float: right;
  }
}
// 边框
.block-left {
  // float: left;
  // width: 45%;
  // padding: 10px 30px 10px 40px;
  color: #ccc;
  .block-left-item {
    text-align: center;
    p {
      display: inline-block;
      cursor: pointer;
      line-height: 1;
      .iconfont {
        font-size: 22px;
      }
    }
    .active {
      color: #197aff;
    }
  }
}

span {
  flex: 1;
  cursor: pointer;
  .iconStyle {
    font-size: 26px;
    border-radius: 4px;
  }
  .iconStyles {
    font-size: 26px;
    border-radius: 4px;
    border: 1px solid #E2E2E2;
  }
  .iconbottom {
    font-weight: bold;
    font-size: 12px;
  }
}
span:nth-child(2) {
  margin-top: -7px;
}

</style>
