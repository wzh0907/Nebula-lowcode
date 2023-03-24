<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="yAxis">
        <template slot="title">
          <div class="title-text">坐标Y轴</div>
        </template>
        <div style="margin-left: 20px">
          <div style="display: flex">
            <div class="subtitle-text">标题</div>
            <el-input v-model="componentConfig.options[config.key].name" placeholder="请输入标题"></el-input>
          </div>
          <div style="display: flex; margin-top: 4px">
            <div class="subtitle-text">最大值</div>
            <el-input
              style="width: 200px; margin-right: 8px"
              :disabled="componentConfig.options[config.key].autoMax"
              v-model="componentConfig.options[config.key].max"
              placeholder="请输入最大值">
            </el-input>
            <el-checkbox v-model="componentConfig.options[config.key].autoMax">自动</el-checkbox>
          </div>
          <div style="display: flex; margin-top: 4px">
            <div class="subtitle-text">最小值</div>
            <el-input
              style="width: 200px; margin-right: 8px"
              :disabled="componentConfig.options[config.key].autoMin"
              v-model="componentConfig.options[config.key].min"
              placeholder="请输入最小值">
            </el-input>
            <el-checkbox v-model="componentConfig.options[config.key].autoMin">自动</el-checkbox>
          </div>
        </div>
        <div style="margin-left: 20px">
          <el-checkbox v-model="componentConfig.options[config.key].axisLine.show">显示坐标轴</el-checkbox>
        </div>
        <div style="margin-left: 45px; display: flex">
          <el-select
            size="mini"
            v-model="componentConfig.options[config.key].axisLine.lineStyle.type"
            placeholder="请选择"
            style="width: 90px; margin-top: 4px"
            :disabled="!componentConfig.options[config.key].axisLine.show"
          >
            <el-option
              v-for="item in borderTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            size="mini"
            v-model="componentConfig.options[config.key].axisLine.lineStyle.width"
            placeholder="请选择"
            style="width: 90px; margin: 4px 8px 0px 8px"
            :disabled="!componentConfig.options[config.key].axisLine.show"
          >
            <el-option
              v-for="item in borderWidthOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <colorConfig
            :colorStyle="componentConfig.options[config.key].axisLine.lineStyle.color"
            @changeConfigValue="changeLineColor"
            :configOptions="componentConfig.options"
            :configKey="config.key"
            offset="-60"
          />
        </div>
        <div style="margin-left: 20px; margin-top: 8px">
          <el-checkbox v-model="componentConfig.options[config.key].nameShow">显示标题</el-checkbox>
        </div>
        <div>
          <div style="margin-left: 45px; display: flex; align-items: center">
            <el-select
              size="mini"
              v-model="componentConfig.options[config.key].nameTextStyle.fontFamily"
              placeholder="请选择"
              style="width: 90px;"
              :disabled="!componentConfig.options[config.key].nameShow"
            >
              <el-option
                v-for="item in fontFamilyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              size="mini"
              v-model="componentConfig.options[config.key].nameTextStyle.fontSize"
              placeholder="请选择"
              style="width: 90px; margin: 0 8px"
              :disabled="!componentConfig.options[config.key].nameShow"
            >
              <el-option
                v-for="item in fontSizeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <colorConfig
              :colorStyle="componentConfig.options[config.key].nameTextStyle.color"
              @changeConfigValue="changeNameColor"
              :configOptions="componentConfig.options"
              :configKey="config.key"
              offset="-60"
            />
          </div>
        </div>
        <div style="margin-left: 20px; margin-top: 8px">
          <el-checkbox v-model="componentConfig.options[config.key].axisLabel.show">显示标签</el-checkbox>
        </div>
        <div>
          <div style="margin-left: 45px; display: flex; align-items: center">
            <el-select
              size="mini"
              v-model="componentConfig.options[config.key].axisLabel.fontFamily"
              placeholder="请选择"
              style="width: 90px;"
              :disabled="!componentConfig.options[config.key].axisLabel.show"
            >
              <el-option
                v-for="item in fontFamilyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              size="mini"
              v-model="componentConfig.options[config.key].axisLabel.fontSize"
              placeholder="请选择"
              style="width: 90px; margin: 0 8px"
              :disabled="!componentConfig.options[config.key].axisLabel.show"
            >
              <el-option
                v-for="item in fontSizeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <colorConfig
              :colorStyle="componentConfig.options[config.key].axisLabel.color"
              @changeConfigValue="changeLabelColor"
              :configOptions="componentConfig.options"
              :configKey="config.key"
              offset="-60"
            />
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import colorConfig from "./color-config"
export default {
  name: "y-axis-config",
  components: {
    colorConfig
  },
  props: ['componentConfig','componentConfigKey', 'config'],
  data() {
    return {
      activeNames: ['yAxis'],
      borderTypeOptions: [
        {label: '实线', value: 'solid'},
        {label: '点线', value: 'dotted'},
        {label: '虚线', value: 'dashed'},
      ],
      borderWidthOptions: [
        {label: '1px', value: 1},
        {label: '2px', value: 2},
        {label: '3px', value: 3},
        {label: '4px', value: 4},
        {label: '5px', value: 5},
        {label: '6px', value: 6},
        {label: '7px', value: 7},
        {label: '8px', value: 8},
        {label: '9px', value: 9},
      ],
      rotateOptions: [
        {label: '横向', value: 0},
        {label: '竖向', value: -90},
        {label: '左倾斜45', value: 45},
        {label: '右倾斜45', value: -45},
      ],
      fontSizeOptions: [
        {label: '默认', value: undefined},
        {label: '10px', value: 10},
        {label: '11px', value: 11},
        {label: '12px', value: 12},
        {label: '13px', value: 13},
        {label: '14px', value: 14},
        {label: '15px', value: 15},
        {label: '16px', value: 16},
        {label: '18px', value: 18},
        {label: '20px', value: 20},
        {label: '24px', value: 24},
        {label: '32px', value: 32},
        {label: '36px', value: 36},
        {label: '48px', value: 48},
        {label: '64px', value: 64},
      ],
      fontFamilyOptions: [
        {label: '默认', value: undefined},
        {label: '微软雅黑', value: 'Microsoft YaHei'},
        {label: '宋体', value: 'SimSun'},
        {label: '黑体', value: 'Heiti'},
        {label: '华文细黑', value: 'STXihei'},
        {label: '楷体', value: 'KaiTi'},
        {label: '仿宋', value: 'FangSong'},
        {label: '新宋体', value: 'NSimSun'},
        {label: '华文仿宋', value: 'STFangsong'},
        {label: '华文黑体', value: 'STHeiti'},
        {label: '华文琥珀', value: 'STHupo'},
        {label: '华文楷体', value: 'STKaiti'},
        {label: '华文隶书', value: 'STLiti'},
        {label: '华文宋体', value: 'STSong'},
        {label: '华文新魏', value: 'STXinwei'},
        {label: '华文行楷', value: 'STXingkai'},
        {label: '华文中宋', value: 'STZhongsong'},
        {label: '苹方', value: 'PingFang SC'},
        {label: 'Verdana', value: 'Verdana'},
        {label: 'Arial', value: 'Arial'},
        {label: 'Times New Roman', value: 'Times New Roman'},
        {label: 'Times', value: 'Times'},
        {label: 'MS Sans Serif', value: 'MS Sans Serif'},
      ]
    };
  },
  mounted() {
  },
  methods: {
    changeLineColor(configOptions, configKey, color) {
      this.componentConfig.options[this.config.key].axisLine.lineStyle.color = color
    },
    changeLabelColor(configOptions, configKey, color) {
      this.componentConfig.options[this.config.key].axisLabel.color = color
    },
    changeNameColor(configOptions, configKey, color) {
      this.componentConfig.options[this.config.key].nameTextStyle.color = color
    },
  },
}
</script>

<style lang="less" scoped>
/deep/.el-collapse {
  border-top: none;
}
/deep/.el-collapse-item__wrap {
  overflow: visible;
}
.title-text {
  width: 80px;
  text-align: right;
  padding-right: 12px;
  font-weight: 500;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
}

.subtitle-text {
  color: rgba(10, 18, 32, 0.46);
  font-size: 12px;
  font-weight: 700;
  line-height: 32px;
  width: 80px;
}
</style>
