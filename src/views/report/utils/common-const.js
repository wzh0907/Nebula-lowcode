export const coverBigComponent = [ // 可嵌套组件
  "van-design-tabs",
  "van-design-collapse",
  "van-design-layout",
  "van-design-form",
  "van-design-list",
  'van-design-group-component'
]

export const inputInterfaceComponent = [ // 输入组件类型的组件
  'van-design-segment',
  'van-design-slider',
  'van-design-select',
  'van-design-radio',
  'van-design-datetime-picker',
  'van-design-calendar',
  'van-design-calendar-range',
  'van-design-checkbox',
  'van-design-field',
  'van-design-form',
  'van-design-cascade',
  'van-design-switch',
  'van-design-rate',
  'van-design-dropdown-menu',
  'van-design-upload-img',
  'van-design-upload-file',
  'van-design-checkbox-auth',
  // 'van-design-tree-select',
  // 'van-design-tree',

  // 图表的点击事件
  'van-design-chart-histogram', // 测试：图表点击带参跳转功能，暂时通过把图表做为输入型组件来实现该功能
  'van-design-chart-line',
  'van-design-chart-bar',
  'van-design-chart-ring',
  'van-design-location',
  'van-design-list',
  'van-design-stepper',
  'van-design-swipe',
  'van-design-editor',
]

export const inputFormComponent = [ // 输入组件类型的组件
  'van-design-select',
  'van-design-radio',
  'van-design-datetime-picker',
  'van-design-calendar',
  'van-design-calendar-range',
  'van-design-checkbox',
  'van-design-field',
  'van-design-segment',
  'van-design-dropdown-menu',
  'van-design-countdown',
  'van-design-checkbox-auth',
  'van-design-upload-img',
  'van-design-stepper',
]
export const inputFormBaseComponent = [ // 基础输入组件---不需要配置列表的默认值
  'van-design-datetime-picker',
  'van-design-calendar',
  'van-design-calendar-range',
  'van-design-field',
  'van-design-countdown',
  'van-design-checkbox-auth',
  'van-design-upload-img',
  'van-design-cascade',
  'van-design-tree-select',
  'van-design-tree',
]


export const dataRefreshComponents = [ // 可数据刷新组件
  // "van-design-text-title", // 已废弃
  "van-design-text",
  "van-design-placeholder",
  "van-design-circle",
  "van-design-tag",
  // 表单
  "van-design-select",
  "van-design-radio",
  "van-design-checkbox",
  // chart
  "van-design-list",
  "van-design-progress",
  "van-design-table",
  // 图表
  "van-design-chart-histogram",
  "van-design-chart-line",
  "van-design-chart-ring",
  "van-design-chart-waterfall",
  "van-design-chart-scatter",
  "van-design-chart-radar",
  "van-design-chart-pie",
  "van-design-chart-pie-radius",
  "van-design-chart-line-area",
  "van-design-chart-heatmap",
  "van-design-chart-funnel",
  "van-design-chart-bar",
  "van-design-image"
];

/**
 * 定义各类组件的数据输入类型：
 *    布局类组件：不支持该类组件的数据配置
 *    图表类组件：只支持Array类型的数据输入
 *    展示类组件: 基本都是基础类型（如：number、string、boole）
 *    表单类组件：暂时未定义表单类型，需要研究一下表单组件的功能再进行配置
 *
 * 类型定义：
 *    Array: 数组类型
 *    Atom: 基础类型（number、string、boole）
 */
export const componentDataTypes = {
  // 图表类组件
  'van-design-list': 'Array',
  'van-design-progress-bar': 'Array', // 该组件待确认类型
  'van-design-table': 'Array',
  'van-design-chart-bar': 'Array',
  'van-design-chart-histogram': 'Array',
  'van-design-chart-line': 'Array',
  'van-design-chart-ring': 'Array',
  // pc独有的图表组件
  'van-design-chart-waterfall': 'Array',
  'van-design-chart-scatter': 'Array',
  'van-design-chart-radar': 'Array',
  'van-design-chart-pie': 'Array',
  'van-design-chart-pie-radius': 'Array',
  'van-design-chart-line-area': 'Array',
  'van-design-chart-heatmap': 'Array',
  'van-design-chart-funnel': 'Array',
  // 展示类组件
  'van-design-text': 'Atom',
  'van-design-tag': 'Atom',
  // 'van-design-progress': 'Atom', // Number
  'van-design-circle': 'Atom', // Number
  'van-design-progress': 'Array', // Object
  // 表单类组件
  'van-design-select': 'Array',
  'van-design-checkbox': 'Array',
  'van-design-radio': 'Array',
  'van-design-form': 'Array',
  'van-design-field': 'Atom',
  "van-design-calendar": 'Atom',
  "van-design-datetime-picker":'Atom',
  "van-design-switch" : 'Atom',
  "van-design-checkbox-auth": 'Atom',
  "van-design-stepper": 'Atom',

  "van-design-notice-bar": 'Array',
  "van-design-image": 'Atom',
  "van-design-video-player": 'Atom',
  "van-design-swipe": 'Array',
  'van-design-editor':'Atom',
  'van-design-upload-img':'Atom',
  'van-design-workflow':'Atom',
  'van-design-cascade':'Atom',
  'van-design-tree-select':'Atom',
  'van-design-tree':'Atom',
  'van-design-calendar-range':'Atom'
}

