<template>
  <div
    class="m-colorPicker"
    ref="colorPicker"
    v-on:click="
      (event) => {
        event.stopPropagation();
      }
    "
  >
    <!-- 颜色显示小方块 -->
    <!-- <div
      class="colorBtn"
      :class="{ disabled: disabled }"
      :style="`background-color: ${showColor}`"
    ></div> -->
    <!-- 颜色色盘 -->
    <div class="box" :class="{ open: openStatus }">
      <div class="color-input-view">
        <div
          class="colorView"
          :style="`background-color: ${showPanelColor}`"
        ></div>

        <input
          class="color-input"
          type="text"
          v-model="inputColor"
          placeholder="#FF0000"
          @keydown.enter="updateValue(inputColor)"
        />
        <input
          v-if="opacity || opacity == 0"
          class="opacity-input"
          type="number"
          v-model="colorOpacity"
          max="100"
          min="0"
          placeholder="0-100"
        />
        <!-- <div class="defaultColor"
          v-on:click="handleDefaultColor"
          v-on:mouseover="hoveColor = defaultColor"
          v-on:mouseout="hoveColor = null"
        >默认颜色</div> -->
      </div>
      <div class="bd">
        <h3>最近颜色</h3>
        <ul class="tColor">
          <li
            v-for="(color, index) of usedColor"
            :key="index"
            v-bind:style="{ backgroundColor: color }"
            v-on:mouseover="hoveColor = color"
            v-on:mouseout="hoveColor = null"
            v-on:click="updateValue(color)"
          ></li>
        </ul>
        <h3 style="display: inline">自助配色</h3>
        <i
          @click="colorHandler"
          style="float: right; height: 15px"
          class="iconfont iconseban"
        ></i>
        <ul class="tColor">
          <li
            v-for="(color, index) of customColor"
            :key="index"
            v-bind:style="{ backgroundColor: color }"
            v-on:mouseover="hoveColor = color"
            v-on:mouseout="hoveColor = null"
            v-on:click="updateValue(color)"
          ></li>
        </ul>
        <h3 style="display: inline">颜色方案</h3>
        <i
          @click="moreColorHandler"
          style="float: right; height: 15px"
          class="iconfont icongengduo"
        ></i>
        <ul class="tColor">
          <li
            v-for="(color, index) of tColor"
            :key="index"
            :style="{
              backgroundColor: color,
              marginLeft: colorMarginLeft(index),
            }"
            v-on:mouseover="hoveColor = color"
            v-on:mouseout="hoveColor = null"
            v-on:click="updateValue(color)"
          ></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "colorPicker",
  props: {
    // 面板打开状态
    openStatus: false,

    // 当前颜色值
    value: {
      type: String,
      required: true,
    },
    opacity: {
      type: Number,
    },
    // 默认颜色
    defaultColor: {
      type: String,
      default: "#000000",
    },
    // 禁用状态
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    this.usedColor = JSON.parse(getStorage("usedColor")) || [];
    this.customColor = JSON.parse(getStorage("customColor")) || [];
  },

  data() {
    return {
      // 鼠标经过的颜色块
      hoveColor: null,
      // 输入的颜色
      inputColor: null,
      // 最近颜色
      usedColor: [],
      // 自助配色
      customColor: [],
      // 主题颜色
      tColor: [
        "#FFFFFF",
        "#F8F8F8",
        "#EEEEEE",
        "#CCCCCC",

        "#DDDDDD",
        "#999999",
        "#666666",
        "#333333",

        "#E7233B",
        "#108EE9",
        "#FF3B30",
        "#F24724",

        "#0BA194",
        "#5FB55F",
        "#F7BA2A",
        "#564E5F",

        "#FF6464",
        "#FF8264",
        "#FFAA64",
        "#FFF5A5",

        "#F0F5F9",
        "#C9D6DF",
        "#52616B",
        "#1E2022",

        "#00BCD4",
        "#B2EBF2",
        "#FF5722",
        "#DD2C00",

        "#E8E8E8",
        "#F05454",
        "#30475E",
        "#222831",

        "#FF4646",
        "#FF8585",
        "#FFB396",
        "#FFF5C0",

        "#018383",
        "#02A8A8",
        "#42E6A4",
        "#F5DEA3",

        "#206A5D",
        "#81B214",
        "#BFDCAE",
        "#F1F1E8",

        "#00AF91",
        "#007965",
        "#F58634",
        "#FFCC29",

        "#118DF0",
        "#0E2F56",
        "#FF304F",
        "#ECECDA",

        "#033FFF",
        "#4A9FF5",
        "#5FF4EE",
        "#C2FCF6",

        "#064ACB",
        "#366ED8",
        "#F3A953",
        "#F2F3F3",

        "#0A1931",
        "#185ADB",
        "#FFC947",
        "#EFEFEF",
      ],

      // 标准颜色
      bColor: [
        "#c21401",
        "#ff1e02",
        "#ffc12a",
        "#ffff3a",
        "#90cf5b",
        "#00af57",
        "#00afee",
        "#0071be",
        "#00215f",
        "#72349d",
      ],
      html5Color: this.value,
      colorOpacity: this.opacity,
    };
  },
  computed: {
    // 显示面板颜色
    showPanelColor() {
      if (this.inputColor) {
        return this.inputColor;
      } else {
        return "#000000";
      }
    },
    // 显示颜色
    showColor() {
      if (this.value) {
        return this.value;
      } else {
        return this.defaultColor;
      }
    },
  },

  watch: {
    openStatus: function (val) {
      this.usedColor = JSON.parse(getStorage("usedColor")) || [];
      this.customColor = JSON.parse(getStorage("customColor")) || [];
    },
    colorOpacity() {
      this.$emit("changeOpacity", Number(this.colorOpacity));
    },
  },

  beforeUpdate() {},

  methods: {
    // openPanel() {
    //   this.openStatus = !this.disabled;
    // },
    // closePanel() {
    //   this.openStatus = false;
    // },
    triggerHtml5Color() {
      this.$refs.html5Color.click();
    },

    colorMarginLeft(index) {
      //每4个色值为一组
      let margin = (index - 4) % 8 == 0 ? 16 : 2;
      return margin + "px";
    },

    //获取配色方案
    colorHandler() {
      let that = this;
      var url = "http://colormind.io/api/";
      let color = this.hexToRgb(this.showPanelColor);
      var data = {
        model: "default",
        input: [color, "N", "N", "N", "N"],
      };

      var http = new XMLHttpRequest();

      http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          var palette = JSON.parse(http.responseText).result;
          that.customColor = [];
          for (const color of palette) {
            that.customColor.push(that.rgbToHex(color[0], color[1], color[2]));
          }
          setStorage("customColor", JSON.stringify(that.customColor));
        }
      };

      http.open("POST", url, true);
      http.send(JSON.stringify(data));
    },

    //跳转到配色网站
    moreColorHandler() {
      window.open("https://www.sj520.cn/tools/peiseban/", "_blank");
    },

    // 更新组件的值 value
    updateValue(value) {
      //将颜色加入最近使用颜色，最多8种
      if (!this.usedColor.includes(value)) {
        this.usedColor.unshift(value);
        if (this.usedColor.length > 8) {
          this.usedColor = this.usedColor.slice(0, 8);
        }
      }
      setStorage("usedColor", JSON.stringify(this.usedColor));

      this.$emit("input", value);
      this.$emit("change", value);
    },
    // 设置默认颜色
    handleDefaultColor() {
      this.updateValue(this.defaultColor);
    },
    // 格式化 hex 颜色值
    parseColor(hexStr) {
      if (hexStr.length === 4) {
        let hexColor =
          "#" +
          hexStr[1] +
          hexStr[1] +
          hexStr[2] +
          hexStr[2] +
          hexStr[3] +
          hexStr[3];
        return hexColor;
      } else {
        return hexStr;
      }
    },
    // RGB 颜色 转 HEX 颜色
    rgbToHex(r, g, b) {
      let hex = ((r << 16) | (g << 8) | b).toString(16);
      return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
    },
    // HEX 转 RGB 颜色
    hexToRgb(hex) {
      console.log("-----hexToRgb------", hex);
      let hexColor = this.parseColor(hex);
      let rgb = [];
      for (let i = 1; i < 7; i += 2) {
        rgb.push(parseInt("0x" + hexColor.slice(i, i + 2)));
      }
      return rgb;
    },
  },
};
</script>

<style lang="scss" scoped>
input::placeholder {
  font-size: 12px;
  color: #ccc;
}
.m-colorPicker {
  position: relative;
  left: 10px;
  top: -10px;
  text-align: left;
  font-size: 14px;
  display: inline-block;
  outline: none;
  ul,
  li,
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .colorBtn {
    width: 15px;
    height: 15px;
  }
  .colorBtn.disabled {
    cursor: no-drop;
  }
  .box {
    position: absolute;
    width: 190px;
    background: white;
    border: 1px solid #ddd;
    visibility: hidden;
    border-radius: 2px;
    margin-top: 2px;
    padding: 10px;
    padding-bottom: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    opacity: 0;
    transition: all 0.3s ease;
    box-sizing: content-box;
    h3 {
      margin: 0;
      font-size: 14px;
      font-weight: normal;
      margin-top: 10px;
      margin-bottom: 5px;
      line-height: 1;
      color: #333;
    }
    // input {
    //   visibility: hidden;
    //   position: absolute;
    //   left: 0;
    //   bottom: 0;
    // }
  }
  .box.open {
    visibility: visible;
    opacity: 1;
    z-index: 1;
  }
  .color-input-view {
    overflow: hidden;
    line-height: 29px;
    .colorView {
      width: 25px;
      height: 25px;
      float: left;
      transition: background-color 0.3s ease;
    }

    .color-input {
      display: inline-block;
      width: 85px;
      height: 25px;
      margin-left: 8px;
      border: 1px solid #ddd;
    }

    .opacity-input {
      display: inline-block;
      width: 40px;
      height: 25px;
      margin-left: 8px;
      border: 1px solid #ddd;
    }

    // .defaultColor {
    //   width: 80px;
    //   float: right;
    //   text-align: center;
    //   border: 1px solid #ddd;
    //   cursor: pointer;
    //   color: #333;
    // }
  }
  .tColor {
    li {
      width: 15px;
      height: 15px;
      display: inline-block;
      margin: 0 2px;
      transition: all 0.3s ease;
    }
    li:hover {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
      transform: scale(1.3);
    }
  }
  .bColor {
    li {
      width: 15px;
      display: inline-block;
      margin: 0 2px;
      li {
        display: block;
        width: 15px;
        height: 15px;
        transition: all 0.3s ease;
        margin: 0;
      }
      li:hover {
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
        transform: scale(1.3);
      }
    }
  }
}
</style>
