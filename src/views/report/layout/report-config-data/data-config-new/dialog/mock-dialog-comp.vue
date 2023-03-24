<template>
  <el-dialog
    title="MOCK数据"
    :visible.sync="isShowDialog"
    :close-on-click-modal="false"
    width="800px"
    @open="dialogOpen"
  >
    <el-form
      style="margin-bottom: 20px"
      ref="mockForm"
      :rules="rules"
      label-width="120px"
      :model="mockItem"
    >
      <el-form-item label="MOCK名称：" prop="mockName" size="small">
        <el-input
          placeholder="请输入名称"
          v-model="mockItem.mockName"
        />
      </el-form-item>
    </el-form>
    <div style="display:flex;">
      <CodeEditor
        ref="editor"
        v-model="mockItem.mockData"
        height="400px"
        width="70%"
        mode="json"
        :editor-options="{showGutter: false}"
      />
      <div style="background-color: #f8f8f8; width: 30%; padding: 10px">
        <ul>
          <li class="codeSnippet" @click="listSampleHandler">列表样例数据</li>
          <li class="codeSnippet" @click="mapSampleHandler">数值样例数据</li>
          <li class="codeSnippet" @click="formatHandler">格式化</li>
        </ul>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
<!--      <el-button type="primary" @click="refresh">刷 新</el-button>-->
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="onSave">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveMockResult,getMockResult,getProcesseDataList } from "@/api/chartsData";
import CodeEditor from "@/components/CodeEditor";

export default {
  components: {
    CodeEditor
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    mock: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      rules: {
        mockName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      mockItem: {
        mockName: '',
        mockData: ''
      },
      insertValue: "",
      sampleMapJSON: `{
  "公司名称": "上海云座信息科技有限公司",
  "官网": "http://www.xingyunzuo.com",
  "产品": "星云座插件式低代码开发平台",
  "产品介绍": "请关注星云座公众号"
}`,
      sampleListJSON: `{
  "列表数据": [
    {
      "日期": "2015/10/12 00:00",
      "用户注册来源": "广告二维码",
      "订单来源": "微信公众号",
      "城市": "杭州",
      "新增订单量": 14827,
      "支付订单量": 9226,
      "待服务订单量": 1423,
      "取消订单量": 967,
      "被拒订单量": 1452,
      "好评订单量": 15386
    },
    {
      "日期": "2015/10/13 00:00",
      "用户注册来源": "UC浏览器引流",
      "订单来源": "iOS APP",
      "城市": "上海",
      "新增订单量": 15024,
      "支付订单量": 18570,
      "待服务订单量": 735,
      "取消订单量": 228,
      "被拒订单量": 180,
      "好评订单量": 10757
    },
    {
      "日期": "2015/10/14 00:00",
      "用户注册来源": "UC浏览器引流",
      "订单来源": "iOS APP",
      "城市": "武汉",
      "新增订单量": 18586,
      "支付订单量": 11427,
      "待服务订单量": 1589,
      "取消订单量": 902,
      "被拒订单量": 538,
      "好评订单量": 6825
    },
    {
      "日期": "2015/10/15 00:00",
      "用户注册来源": "微信朋友圈H5页面",
      "订单来源": "Android APP",
      "城市": "深圳",
      "新增订单量": 17052,
      "支付订单量": 17238,
      "待服务订单量": 1067,
      "取消订单量": 772,
      "被拒订单量": 341,
      "好评订单量": 5577
    },
    {
      "日期": "2015/10/16 00:00",
      "用户注册来源": "地推二维码扫描",
      "订单来源": "iOS APP",
      "城市": "广州",
      "新增订单量": 16397,
      "支付订单量": 10849,
      "待服务订单量": 1211,
      "取消订单量": 1028,
      "被拒订单量": 509,
      "好评订单量": 8214
    },
    {
      "日期": "2015/10/17 00:00",
      "用户注册来源": "微信朋友圈H5页面",
      "订单来源": "Android APP",
      "城市": "苏州",
      "新增订单量": 15465,
      "支付订单量": 14899,
      "待服务订单量": 448,
      "取消订单量": 1488,
      "被拒订单量": 2007,
      "好评订单量": 11310
    },
    {
      "日期": "2015/10/18 00:00",
      "用户注册来源": "微信朋友圈H5页面",
      "订单来源": "微信公众号",
      "城市": "合肥",
      "新增订单量": 10930,
      "支付订单量": 15239,
      "待服务订单量": 1109,
      "取消订单量": 203,
      "被拒订单量": 195,
      "好评订单量": 6462
    },
    {
      "日期": "2015/10/19 00:00",
      "用户注册来源": "广告二维码",
      "订单来源": "Android APP",
      "城市": "长沙",
      "新增订单量": 13618,
      "支付订单量": 9477,
      "待服务订单量": 2659,
      "取消订单量": 1121,
      "被拒订单量": 361,
      "好评订单量": 7425
    },
    {
      "日期": "2015/10/20 00:00",
      "用户注册来源": "地推二维码扫描",
      "订单来源": "Android APP",
      "城市": "无锡",
      "新增订单量": 15780,
      "支付订单量": 15021,
      "待服务订单量": 483,
      "取消订单量": 128,
      "被拒订单量": 148,
      "好评订单量": 7780
    },
    {
      "日期": "2015/10/21 00:00",
      "用户注册来源": "应用商店",
      "订单来源": "微信公众号",
      "城市": "北京",
      "新增订单量": 12257,
      "支付订单量": 10486,
      "待服务订单量": 1326,
      "取消订单量": 346,
      "被拒订单量": 99,
      "好评订单量": 5262
    },
    {
      "日期": "2015/10/22 00:00",
      "用户注册来源": "UC浏览器引流",
      "订单来源": "微信公众号",
      "城市": "杭州",
      "新增订单量": 20503,
      "支付订单量": 20464,
      "待服务订单量": 25,
      "取消订单量": 11,
      "被拒订单量": 3,
      "好评订单量": 15729
    },
    {
      "日期": "2015/10/23 00:00",
      "用户注册来源": "地推二维码扫描",
      "订单来源": "微信公众号",
      "城市": "成都",
      "新增订单量": 15446,
      "支付订单量": 10638,
      "待服务订单量": 3772,
      "取消订单量": 457,
      "被拒订单量": 579,
      "好评订单量": 5344
    }
  ]
}`
    };
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  created() {},
  mounted() {},
  methods: {
    dialogOpen() {
      if (this.mock.data == undefined) {
        this.mockItem = {
          mockName: '',
          mockData: ''
        }
        this.$nextTick(() => {
          this.$refs.editor.clearEditor()
        })
        return
      }
      this.mockItem.mockName = this.mock.data.name
      this.mockItem.mockData = JSON.stringify(this.mock.data.responseData)
      setTimeout(() => {
        this.$refs.editor.setValue(JSON.stringify(this.mock.data.responseData, null, 2))
      }, 300)
      // this.$nextTick(() => {
      //   this.$refs.editor.setValue(JSON.stringify(this.mock.data.responseData, null, 2))
      // })
    },
    onClose() {
      this.$emit("onClose");
    },
    onSave() {
      this.$refs.mockForm.validate(async(valid) => {
        if (valid) {
          this.$emit('onSave', this.mockItem)
          this.isShowDialog = false
        }
      })
    },
    listSampleHandler() {
      this.$refs.editor.setValue(this.sampleListJSON)
    },
    mapSampleHandler() {
      this.$refs.editor.setValue(this.sampleMapJSON)
    },
    formatHandler() {
      this.$refs.editor.setValue(JSON.stringify(JSON.parse(this.mockItem.mockData), null, 2))
    },
  },
};
</script>

<style scoped lang="scss">
p {
  margin: 0;
  padding: 0;
}
.codeSnippet {
  cursor: pointer;
  padding-left: 10px;
  height: 30px;
  line-height: 30px;
  color: #1890ff;
}
</style>
