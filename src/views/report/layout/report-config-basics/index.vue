<template>
  <div style="margin-top: 16px">
    <el-form size="small" v-if="!componentConfig.isFullCustomConfig">
      <!-- relyOn为是否依赖某个条件进行显示，relyOnCondition为条件 -->
      <el-form-item
        label-position="left"
        :labelWidth="config.isSetConfigName ? '' : '80px'"
        :label="
          config.formType !== 'custom-collapse-panel' &&
          config.formType !== 'custom-text-content' &&
          config.formType !== 'x-axis-config' &&
          config.formType !== 'y-axis-config' &&
          config.key !== 'mix-custom-text-content'
            ? config.labelName
            : ''
        "
        v-for="(config, index) in componentConfig.configList"
        :key="index"
        v-show="
          !config.relyOn ||
            componentConfig.options[config.relyOn] === config.relyOnCondition
        "
      >
        <!-- 输入框 -->
        <el-input
          :disabled="config.isInputDisable"
          v-model="componentConfig.options[config.key]"
          :class="config.key === 'commonConfigAssignSign' ? 'copyStyle' : ''"
          v-if="
            config.formType === 'input' &&
              config.key !== 'commonConfigAssignSign'
          "
        ></el-input>
        <!-- 多行输入框输入框 -->

        <el-input
          :disabled="config.isInputDisable"
          type="textarea"
          v-model="componentConfig.options[config.key]"
          :class="config.key === 'commonConfigAssignSign' ? 'copyStyle' : ''"
          v-if="
            config.formType === 'textarea' &&
              config.key !== 'commonConfigAssignSign'
          "
        ></el-input>
        <!-- 多语言输入框 -->
        <i18nInput
          :config="config"
          :options="componentConfig.options"
          v-if="config.formType === 'i18nInput'"
        ></i18nInput>
        <i18nTextArea
          :config="config"
          :options="componentConfig.options"
          v-if="config.formType === 'i18nTextArea'"
        ></i18nTextArea>
        <customButtonStyle
          v-if="config.formType === 'custom-button-style'"
          :componentConfig="componentConfig"
          :config="config"
        >

        </customButtonStyle>
        <!-- 样式编辑 -->
        <el-input
          :disabled="config.isInputDisable"
          v-model="componentConfig.options.styleEditorConfig[config.key]"
          :class="config.key === 'commonConfigAssignSign' ? 'copyStyle' : ''"
          v-if="config.formType === 'styleEditorConfig'"
        ></el-input>

        <!-- 下拉框 childKey是可以支持obj[a][b]这种的赋值 -->
        <el-select
          :multiple="config.isSelectMultiple"
          v-model="componentConfig.options[config.key][config.childKey]"
          placeholder="请选择"
          v-if="config.formType === 'select' && config.childKey"
        >
          <el-option
            v-for="item in config.typeConfigs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          :multiple="config.isSelectMultiple"
          v-model="componentConfig.options[config.key]"
          placeholder="请选择"
          v-else-if="config.formType === 'select'"
        >
          <el-option
            v-for="item in config.typeConfigs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- 搜索下拉框 -->
        <template>
          <el-select
            :multiple="config.isSelectMultiple"
            v-model="componentConfig.options[config.key]"
            placeholder="请选择"
            v-if="config.formType === 'searchDataList'"
          >
            <el-option
              v-for="item in componentUuidList"
              :key="item.uuid"
              :label="item.options.commonConfigAssignName"
              :value="item.uuid"
            >
            </el-option>
          </el-select>
        </template>
        <!-- 多选框 -->
        <span v-if="config.formType === 'checkbox'">
          <el-checkbox
            v-model="componentConfig.options[item.key]"
            v-for="(item, key) in config.typeConfigs"
            :key="key"
            >{{ item.label }}</el-checkbox
          >
        </span>
        <!-- Slider 滑块 -->
        <!-- <el-slider
          v-model="componentConfig.options[config.key]"
          v-if="config.formType === 'slider'"
          :min="1"
          :max="24"
          :marks="{ 12: '' }"
          style="margin-right: 10px"
        ></el-slider> -->

        <sliderConfig
          v-if="config.formType === 'slider'"
          :componentConfig="componentConfig"
          :componentConfigKey="config.key"
          :config="config"
        />
        <!-- 方块单选 -->
        <radio-button-group
          :componentConfig="componentConfig"
          :componentConfigKey="config.key"
          :config="config"
          v-if="config.formType === 'radio-button'"
        />
        <!-- 接口配置 -->
        <dataSourceApiConfig
          :componentList="componentList"
          :componentConfig="componentConfig"
          :config="config"
          :interfaceDataConfig="
            componentConfig.options.interfaceDataConfig || {}
          "
          v-if="
            config.formType === 'data-source-api-config' &&
              reloadDataSourceApiConfig
          "
        >
          <template slot="default">
            <columnsValuesConfig
              :columnsConfigs="componentConfig.options.columns"
              addBtnText="添加"
              itemKey="label"
              :addColumnConfig="config.addColumnConfig"
            />
          </template>
        </dataSourceApiConfig>
        <!-- 滑块开关 -->
        <el-switch
          v-if="config.formType === 'switch'"
          v-model="componentConfig.options[config.key]"
          @change="changeStatus($event, componentConfig)"
        >
        </el-switch>
        <!-- 是否为密码 -->
        <el-switch
          v-if="config.formType === 'password'"
          v-model="componentConfig.options[config.key]"
          @change="changeStatus($event, componentConfig)"
        >
        </el-switch>
        <!-- 多个属性在一排 -->
        <!-- input前置设置 -->
        <template v-if="config.formType === 'custom-style-pre'">
          <inputCustomPreConfig
            :config="config"
            type="1"
            @changeIconPreShow="changeIconPreShow"
            :options="componentConfig.options"
            :isShowLineEntityIcon="config.isShowLineEntityIcon || false"
            :iconSrc="componentConfig.options[config.setData.key]"
            :configOptions="componentConfig.options"
            :configKey="config.setData.key"
            @changeConfigValue="changeSetConfigValue"
          />
        </template>
        <!-- input后缀设置 -->
        <template v-if="config.formType === 'custom-style-pos'">
          <inputCustomPreConfig
            :config="config"
            type="2"
            @changeIconPreShow="changeIconPosShow"
            :options="componentConfig.options"
            :isShowLineEntityIcon="config.isShowLineEntityIcon || false"
            :iconSrc="componentConfig.options[config.setData.key]"
            :configOptions="componentConfig.options"
            :configKey="config.setData.key"
            @changeConfigValue="changeSetConfigValue"
          />
        </template>
        <template v-if="config.formType === 'custom-style-label'">
          <radioButtonMergeGroup
            @changeIsShowLabel="changeIsShowLabel"
            :componentConfig="componentConfig"
            :componentConfigKey="config.key"
            :config="config"
          />
        </template>
        <template v-if="config.formType === 'custom-style-legend'">
          <chartLegendConfig
            :componentConfig="componentConfig"
            :componentConfigKey="config.key"
            :config="config"
          />
        </template>
        <template v-if="config.formType === 'common-config-size'">
          <commonConfigSize
            @changeIsShowLabel="changeIsShowLabel"
            :componentConfig="componentConfig"
            :componentConfigKey="config.key"
            :config="config"
          />
        </template>
        <template v-if="config.formType === 'custom-text-content'">
          <customTextContent
            :componentConfig="componentConfig"
            :componentList="componentList"
            :config="config"
            :componentConfigKey="config.key"
            :reloadDataSourceApiConfig="reloadDataSourceApiConfig"
          />
        </template>
        <template v-if="config.formType === 'custom-qrcode-content'">
          <customQrcodeContent
            :componentConfig="componentConfig"
            :componentList="componentList"
            :config="config"
            :componentConfigKey="config.key"
          />
        </template>
        <!-- 自定义其他配置 -->
        <!-- <template v-if="config.formType === 'custom-collapse-panel'">
          <commonOtherConfig :componentConfig="componentConfig" :componentList="componentList" :config="config" :componentConfigKey="config.key" :collectionPermissionListPool="collectionPermissionListPool" />
        </template> -->
        <!-- 倒计时 -->
        <template>
          <el-input
            v-model="componentConfig.options[config.key]"
            placeholder="请输入文本"
            v-if="config.formType === 'customText'"
          >
            <template slot="prepend">文本</template>
          </el-input>
          <el-input
            v-model="componentConfig.options[config.key]"
            style="margin-top: 5px"
            class="customTimeIconStyle"
            placeholder="请输入时长"
            type="number"
            v-if="config.formType === 'customTime'"
          >
            <template slot="prepend">时长(s)</template>
          </el-input>
        </template>
        <!-- 列名、列值配置项 -->
        <columnsValuesConfig
          v-if="config.formType === 'columns-values-config'"
          :columnsConfigs="componentConfig.options[config.key]"
          :addBtnText="config.addBtnText"
          :addColumnConfig="config.addColumnConfig"
        />
        <!-- 配置项 -->
        <columns-config
          v-if="config.formType === 'columns-config'"
          :columnsConfigs="componentConfig.options[config.key]"
          :addBtnText="config.addBtnText"
          :addColumnConfig="config.addColumnConfig"
          :columnsConfigType="config.columnsConfigType || 'input'"
          :inputValueKey="config.inputValueKey || 'value'"
        />
        <!-- 折叠配置面板 -->
        <collapsePanel
          v-if="config.formType === 'collapse-panel'"
          :columnsConfigs="componentConfig.options[config.key]"
          :addBtnText="config.addBtnText"
          :collapsePanelColumnsConfigs="config.collapsePanelColumnsConfigs"
          :addColumnConfig="config.addColumnConfig"
          :panelLabelPosition="config.panelLabelPosition"
          :panelLabelPositionWidth="config.panelLabelPositionWidth"
        />
        <!-- 边框配置 -->
        <border-config
          v-if="config.formType === 'border-config'"
          :borderStyle="componentConfig.options[config.key]"
        />
        <!-- 颜色挑选 -->
        <colorConfig
          v-if="config.formType === 'color-picker'"
          :colorStyle="componentConfig.options[config.key]"
          @changeConfigValue="changeConfigValue"
          :configOptions="componentConfig.options"
          :configKey="config.key"
        />
        <!-- 数值输入按钮 -->
        <el-input-number
          v-if="config.formType === 'input-number'"
          v-model="componentConfig.options[config.key]"
          :step="1"
        />
        <!-- 数值输入百分比 -->
        <inputPercent
          v-if="config.formType === 'input-percent'"
          :componentConfig="componentConfig"
          :componentConfigKey="config.key"
          :componentSecondKey="config.secondKey"/>
        <!-- 数值输入按钮上传图片 -->
        <el-input-number
          v-if="config.formType === 'upload-input-number'"
          v-model="componentConfig.options[config.key]"
          :min="1"
          :step="1"
        />
        <!-- textarea -->
        <el-input
          v-if="config.formType === 'input-textarea'"
          type="textarea"
          :autosize="{ minRows: 3 }"
          placeholder="请输入内容"
          v-model="componentConfig.options[config.key]"
        >
        </el-input>
        <!-- 图标选择 -->
        <iconUpload
          v-if="config.formType === 'icon-upload'"
          :isShowLineEntityIcon="config.isShowLineEntityIcon || false"
          :iconSrc="componentConfig.options[config.key]"
          @changeConfigValue="changeConfigValue"
          :configOptions="componentConfig.options"
          :configKey="config.key"
        />
        <!-- 图片上传 -->
        <imgUpload
          v-if="config.formType === 'img-upload'"
          :imgSrc="componentConfig.options[config.key]"
          @changeConfigValue="changeConfigValue"
          :configOptions="componentConfig.options"
          :configKey="config.key"
        />
        <!-- 文本编辑器 -->
        <textStyleEditor
          v-if="
            config.formType === 'text-style-editor' && reloadDataSourceApiConfig
          "
          :styleEditorConfig="componentConfig.options[config.key]"
        />
        <!-- 文本格式选择器 -->
        <text-format-selector
          v-if="config.formType === 'text-format-selector'"
          v-model="componentConfig.options[config.key]"
        />
        <!-- 图表配色方案-->
        <select-color-charts
          v-if="config.formType === 'chart-color-config'"
          :componentConfig="componentConfig"
          :componentConfigKey="config.key"
          :config="config"
        />
        <!-- 图表网格偏移设置-->
        <grid-offset-charts
          v-if="config.formType === 'grid-offset-config'"
          :componentConfig="componentConfig"
          :componentConfigKey="config.key"
          :config="config"
        />
        <!-- 回归统计-->
        <regression-charts
          v-if="config.formType === 'regression-charts'"
          :componentConfig="componentConfig"
          :componentConfigKey="config.key"
          :config="config"
        />
        <!-- X轴配置-->
        <x-axis-config
          v-if="config.formType === 'x-axis-config'"
          :componentConfig="componentConfig"
          :componentConfigKey="config.key"
          :config="config"
        />
        <!-- Y轴配置-->
        <y-axis-config
          v-if="config.formType === 'y-axis-config'"
          :componentConfig="componentConfig"
          :componentConfigKey="config.key"
          :config="config"
        />
        <valueSelect
           v-if="config.formType === 'value-select'"
           :paramItem="componentConfig.options[config.key]"
           @handleChange="handleChange"
        />
        <!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!! PC混合自定义配置 !!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
        <template
          v-if="
            deviceDesignType === 'PC' &&
              config.formType === 'custom-component-config' &&
              componentConfig.isMixinsCustomConfig
          "
        >
          <el-form-item v-if="componentConfig.type === 'van-design-cascade'">
            <cascadeCustomconfig
              :componentList="componentList"
              :componentConfig="componentConfig"
              :reloadDataSourceApiConfig="reloadDataSourceApiConfig"
            />
          </el-form-item>
          <!-- <el-form-item v-if="componentConfig.type === 'van-design-progress'">
            <progressConfig :componentList="componentList" :componentConfig="componentConfig" :reloadDataSourceApiConfig="reloadDataSourceApiConfig" />
          </el-form-item> -->
          <!-- <el-form-item v-if="componentConfig.type === 'van-design-layout'">
            <gridLayoutConfig :componentConfig="componentConfig" />
          </el-form-item> -->
          <el-form-item v-if="componentConfig.type === 'van-design-layout'">
            <layoutConfig :componentConfig="componentConfig" :config="config" />
          </el-form-item>
          <!-- input校验 -->
          <el-form-item v-if="componentConfig.type === 'van-design-field'
          || componentConfig.type === 'van-design-select'
          || componentConfig.type === 'van-design-calendar'" >
            <customTextContent
              :componentConfig="componentConfig"
              :componentList="componentList"
              :config="config"
              :componentConfigKey="config.key"
            />
          </el-form-item>
        </template>
        <!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!! MOBILE混合自定义配置 !!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
        <template
          v-if="
            deviceDesignType === 'MOBILE' &&
              config.formType === 'custom-component-config'
          "
        >
          <el-form-item
            v-if="
              componentConfig.type === 'van-design-checkbox' ||
                componentConfig.type === 'van-design-radio'
            "
          >
            <selectConfig
              :componentList="componentList"
              :componentConfig="componentConfig"
              :reloadDataSourceApiConfig="reloadDataSourceApiConfig"
            />
          </el-form-item>
          <el-form-item v-if="componentConfig.type === 'van-design-layout'">
            <layoutConfig :componentConfig="componentConfig" :config="config" />
          </el-form-item>
          <!-- <el-form-item v-if="componentConfig.type === 'van-design-layout'">
            <bgImageConfig :componentConfig="componentConfig" />
          </el-form-item> -->
          <el-form-item v-if="componentConfig.type === 'van-design-field'|| componentConfig.type === 'van-design-select'
          || componentConfig.type === 'van-design-calendar'">
            <customTextContent
              :componentConfig="componentConfig"
              :componentList="componentList"
              :config="config"
              :componentConfigKey="config.key"
            />
          </el-form-item>
          <template v-if="componentConfig.type === 'van-design-button'">
            <buttonConfig :componentConfig="componentConfig" :config="config" />
          </template>
          <template v-if="componentConfig.type === 'van-design-icon'">
            <iconConfig :componentConfig="componentConfig" :config="config" />
          </template>
          <template v-if="componentConfig.type === 'van-design-rate'">
            <rateConfig :componentConfig="componentConfig" :config="config" />
          </template>
        </template>
        <!-- 通用布局 -->
        <template
          v-if="
            config.formType === 'custom-collapse-panel' &&
              componentConfig &&
              componentConfig.options &&
              componentConfig.options.commonConfig
          "
        >
          <commonStyleConfig
            :componentConfig="componentConfig"
            v-if="reloadDataSourceApiConfig"
          />
        </template>
        <!-- 自定义其他配置 -->
        <template v-if="config.formType === 'custom-collapse-panel'">
          <commonOtherConfig
            :componentConfig="componentConfig"
            :componentList="componentList"
            :config="config"
            :componentConfigKey="config.key"
            :collectionPermissionListPool="collectionPermissionListPool"
          />
        </template>
      </el-form-item>
      <!-- 通用布局 -->
      <!-- <el-form-item v-if="componentConfig && componentConfig.options && componentConfig.options.commonConfig">
        <commonStyleConfig :componentConfig="componentConfig" v-if="reloadDataSourceApiConfig" />

      </el-form-item> -->
    </el-form>
    <!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!! 独立自定义配置 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
    <el-form size="small" v-else>
      <template v-for="(config, index) in componentConfig.configList">
        <el-form-item
          label-position="left"
          :labelWidth="config.isSetConfigName ? '' : '80px'"
          :label="config.labelName"
          :key="index"
          v-if="config.formType === 'slider' || config.formType === 'input'"
        >
          <el-slider
            v-if="config.formType === 'slider'"
            v-model="componentConfig.options[config.key]"
            :min="1"
            :max="24"
            :marks="{ 12: '' }"
          ></el-slider>
          <el-input
            v-if="
              config.formType === 'input' &&
                config.key !== 'commonConfigAssignSign'
            "
            :disabled="config.isInputDisable"
            v-model="componentConfig.options[config.key]"
            :class="config.key === 'commonConfigAssignSign' ? 'copyStyle' : ''"
          ></el-input>
        </el-form-item>
      </template>
      <!-- 表单配置 -->
      <template v-if="deviceDesignType === 'MOBILE'">
        <formConfigMobile
          :componentConfig="componentConfig"
          v-if="componentConfig.type === 'van-design-form'"
        />
      </template>
      <template v-if="deviceDesignType === 'PC'">
        <formConfigPc
          :componentConfig="componentConfig"
          v-if="componentConfig.type === 'van-design-form'"
        />
      </template>
      <!-- 自定义其他配置 -->
      <!-- <el-form-item v-if="config.formType === 'custom-collapse-panel'">
        <commonOtherConfig :componentConfig="componentConfig" :componentList="componentList" :config="config" :componentConfigKey="config.key" :collectionPermissionListPool="collectionPermissionListPool" />
      </el-form-item> -->
      <!-- 通用布局 -->
      <el-form-item
        v-if="
          componentConfig &&
            componentConfig.options &&
            componentConfig.options.commonConfig
        "
      >
        <commonStyleConfig
          :componentConfig="componentConfig"
          v-if="reloadDataSourceApiConfig"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/**
 * 三种配置：configList、mixinsCustomConfigList、isFullCustomConfig
 * configList：通用配置
 * isMixinsCustomConfig：在通用配置的基础上混入自定义配置
 * isFullCustomConfig：不使用上面两种配置，直接使用自己自定义的配置
 */
// 接口
// import { getRoleListService } from "@/api/role";
import { pickInputComponentList } from "@/views/report/utils/deal-component-data/transform-component-list";
// 基础配置
import radioButtonGroup from "./basics-config/radio-button-group.vue";
import radioButtonMergeGroup from "./basics-config/radio-button-merge-group.vue";
import commonConfigSize from "./basics-config/common-config-size.vue";
import dataSourceApiConfig from "./basics-config/data-source-api-config.vue";
import imgUpload from "./basics-config/img-upload.vue";
import iconUpload from "./basics-config/icon-upload.vue";
import columnsConfig from "./basics-config/columns-config.vue";
import columnsValuesConfig from "./basics-config/columns-values-config.vue";
import collapsePanel from "./basics-config/collapse-panel";
import customTextContent from "./basics-config/custom-text-content";
import customQrcodeContent from "./basics-config/custom-qrcode-content";
import borderConfig from "./basics-config/border-config";
import textStyleEditor from "./basics-config/text-style-editor.vue";
import selectColorCharts from "./basics-config/select-color-charts.vue";
import gridOffsetCharts from "./basics-config/grid-offset-charts.vue";
import regressionCharts from "./basics-config/regression-charts.vue";
import xAxisConfig from "./basics-config/xaxis-config.vue";
import yAxisConfig from "./basics-config/yaxis-config.vue";
import colorConfig from "./basics-config/color-config.vue";
import inputPercent from "./basics-config/input-percent.vue";
import chartLegendConfig from './basics-config/chart-legend-config.vue';

import sliderConfig from "./basics-config/slider-config.vue";
//文本样式
import textFormatSelector from "./basics-config/text-format-selector.vue";
// 两个固定配置（其他与样式）
import commonOtherConfig from "./common-other-config.vue";
import commonStyleConfig from "./common-style-config.vue";
// 组件自定义配置
import inputMixinsCustomConfig from "./component-config/mobile/input-config/index.vue";
import layoutConfig from "./component-config/common/layout-config/index.vue";

// import gridLayoutConfig from './component-config/common/layout-config/grid-layout.vue'
// import bgImageConfig from './component-config/common/layout-config/bg-image.vue'
// import tableColumnMixinsCustomConfig from './component-config/pc/table-column-config.vue'
// import dialogContentConfig from './component-config/common/dialog-content-config.vue'
// import progressConfig from './component-config/pc/progress-config/index.vue'
// import subpageComponentConnectConfig from './component-config/common/subpage-component-connect.vue'
import buttonConfig from "./component-config/common/button-config/index.vue";
import iconConfig from "./component-config/common/icon-config/index.vue";
import rateConfig from "./component-config/mobile/rate-config/index.vue";
// 自定义配置
import formConfigPc from "./full-custom-config/pc/form-config/index.vue";
import formConfigMobile from "./full-custom-config/mobile/form-config/index.vue";
import cascadeCustomconfig from "./full-custom-config/pc/cascade-config/index.vue";
import inputCustomPreConfig from "./full-custom-config/pc/input-pre-config/index.vue";
import selectConfig from "./full-custom-config/mobile/select-config/index.vue";

import valueSelect from "@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue";
import GridOffsetCharts from "@/views/report/layout/report-config-basics/basics-config/grid-offset-charts";
import XAxisConfig from "@/views/report/layout/report-config-basics/basics-config/xaxis-config";
import YAxisConfig from "@/views/report/layout/report-config-basics/basics-config/yaxis-config";
import i18nInput from "@/views/report/layout/report-config-basics/basics-config/i18n-input";
import i18nTextArea from "@/views/report/layout/report-config-basics/basics-config/i18n-textarea";
import customButtonStyle from "@/views/report/layout/report-config-basics/basics-config/custom-button-style";

export default {
  name: "widgetConfig",
  components: {
    YAxisConfig,
    XAxisConfig,
    GridOffsetCharts,
    radioButtonGroup,
    radioButtonMergeGroup,
    chartLegendConfig,
    commonConfigSize,
    dataSourceApiConfig,
    imgUpload,
    iconUpload,
    columnsConfig,
    columnsValuesConfig,
    collapsePanel,
    customTextContent,
    customQrcodeContent,
    colorConfig,
    inputPercent,
    sliderConfig,
    // customCollapsePanel,
    commonOtherConfig,
    commonStyleConfig,
    formConfigPc,
    formConfigMobile,
    borderConfig,
    textStyleEditor,
    selectColorCharts,
    gridOffsetCharts,
    regressionCharts,
    i18nInput,
    i18nTextArea,
    customButtonStyle,
    // 混合自定义配置
    inputMixinsCustomConfig,
    // gridLayoutConfig,
    // bgImageConfig,
    // tableColumnMixinsCustomConfig,
    // dialogContentConfig,
    // progressConfig,
    // subpageComponentConnectConfig,
    layoutConfig,
    buttonConfig,
    iconConfig,
    rateConfig,
    // 自定义配置
    cascadeCustomconfig,
    inputCustomPreConfig,
    selectConfig,
    textFormatSelector,
    valueSelect
  },
  props: {
    deviceDesignType: {
      type: String,
      default: "MOBILE"
    },
    subpageList: {
      type: Array,
      default: () => []
    },
    componentList: {
      type: Array,
      default: []
    },
    componentConfig: {
      type: Object,
      default: {}
    },
    collectionPermissionListPool: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // rightsRoleList: [],
      formLabelAlign: {},
      reloadDataSourceApiConfig: true,
      componentUuidList: [],
    };
  },
  watch: {
    componentConfig: {
      handler(val) {
        this.reloadDataSourceApiConfig = false;
        this.$nextTick(() => {
          this.reloadDataSourceApiConfig = true;
        });
        // if (val.options && val.options.commonConfigAssignRights) {
        //   val.configList.forEach(item => {
        //     if (item.key==='customOther') {
        //       item.collapsePanelColumnsConfigs.forEach(data => {
        //           if (data.key === 'commonConfigAssignRights') {
        //             data.typeConfigs = this.rightsRoleList
        //           }
        //       })
        //     }
        //   })
        // }
      }
    },
    componentList: {
      handler(val) {
        let tempArr = [];
        this.pickInputComponentList(this.componentList, tempArr, [
          "van-design-checkbox",
          "van-design-radio"
        ]);
        this.componentUuidList = tempArr;
      }
    }
  },
  created() {
    // TODO::: 这段代码可以删除了，权限功能已经迁移
    // getRoleListService().then(res => {
    //   let list = res.dataList || []
    //   this.rightsRoleList = []
    //   list.forEach(item => {
    //     this.rightsRoleList.push({
    //       label: item.roleName,
    //       value: item.roleName
    //     })
    //   })
    // })
  },
  methods: {
    pickInputComponentList,
    // 折叠版手风琴效果
    changeStatus(value, data) {
      if (data.type == "van-design-collapse" && !value) {
        this.componentConfig.options.active = [];
      }
    },
    // 设置input 前置图标
    changeSetConfigValue(data) {
      data.configOptions[data.configKey] = data.value;
    },
    // 设置是否显示前置图标
    changeIconPreShow(data) {
      data.iconPreShow = !data.iconPreShow;
    },
    changeIconPosShow(data) {
      data.iconPosShow = !data.iconPosShow;
    },
    changeIsShowLabel(data) {
      data.labelShow = !data.labelShow;
    },
    changeConfigValue(configOptions, configKey, value) {
      // console.log("changeConfigValue",configOptions, configKey, value);
      configOptions[configKey] = value;
    },
    handleChange(data, paramItem){
       console.log("handleChange", data, paramItem);
      if (paramItem.param_value_type == "T") {
        paramItem.relevanceComponentUuid = data[1].id;
        this.linkComponent(paramItem);
      } else {
        paramItem.param_v_key = data[1].id;
        paramItem.param_value = data[1].data.value.operateHrefPageParamValue;
      }
    },
    linkComponent(paramsItem) {
      let uuid = paramsItem.relevanceComponentUuid;
      this.componentUuidList.forEach((item) => {
        if (item.uuid === uuid) {
          paramsItem.primaryKey = item.options.value;
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.copyStyle {
  width: 80%;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
// .customStylePosition /deep/.el-form-item__label{
//   float: none;
//   display: inline-block;
//   text-align: left;
//   padding: 0 0 10px;
// }
.copy_common_id {
  vertical-align: middle;
  display: inline-block;
  margin-top: -20px;
  font-size: 22px;
  margin-left: 10px;
  cursor: pointer;
  &:active,
  &:hover {
    color: #3390ff;
  }
}
/deep/.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
</style>
