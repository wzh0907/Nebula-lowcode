<template>
  <div>
    <div style="padding: 10px 0px">
      <span style="font-weight: bold">
        后端数据
        <el-tooltip
          effect="dark"
          content="配置后端数据的获取方式"
          placement="top"
        >
          <i class="el-icon-info" style="cursor: pointer"></i>
        </el-tooltip>
      </span>
      <el-button
        style="right: 100px"
        class="panel-add-btn"
        type="text"
        size="mini"
        @click.stop="addDataDialogVisible = true"
        >添加</el-button
      >
      <el-button
        class="panel-add-btn"
        type="text"
        size="mini"
        @click.stop="openMockDialog"
      >MOCK</el-button
      >
    </div>
    <div class="label-right" style="min-height: 260px">
      <el-collapse v-model="dataActiveName">
        <el-collapse-item
          :name="key"
          v-for="(item, key) in interfaceData"
          :key="key"
        >
          <template slot="title">
            <span style="padding-left: 20px; font-weight: bold">
              <!-- 依次判断数据接口、数据表、数据集 -->

              {{
                `${item.data.isMockData ? 'MOCK数据' : interfaceDataTypeDict[item.type]}: ${
                  item.data.name ||
                  item.data.tableName ||
                  item.data.dataSetName ||
                  item.data.processName
                }`
              }}
            </span>
            <i
              title="编辑"
              class="iconfont iconbianji project-edit"
              v-if="item.type == 'radio-button-interface'"
              @click.stop="editProject(item)"
            ></i>
            <i
              title="编辑"
              class="iconfont iconshanchu project-delete"
              @click.stop="onDelInterfaceData(key)"
            ></i>
            <!-- <el-button
              class="panel-del-btn"
              type="text"
              size="mini"
              @click.stop="onDelInterfaceData(key)"
              >删除</el-button
            > -->
          </template>
          <!-- 接口参数配置 -->
          <interfaceConfig
            :interfaceConfig="item"
            :chooseSubpageIndex="chooseSubpageIndex"
            :componentUuidList="componentUuidList"
          />
<!--          <div class="project-mock-div">-->
<!--            <el-checkbox v-model="item.data.mockFlag" @change="changeMock(item)"-->
<!--              >数据Mock</el-checkbox-->
<!--            >-->
<!--            <i class="iconfont iconjson project-mock" @click="openMockDialog(item)"></i>-->
<!--          </div>-->
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- pop -->
    <addDataDialog
      :visible="addDataDialogVisible"
      @onClose="addDataDialogVisible = false"
      @onSubmit="onAddDataDialogSubmit"
    />
    <mockDialog
      :dialog-visible.sync="mockDialogVisible"
      :mock="mockItem"
      @onClose="mockDialogVisible = false"
      @onSave="onMockDataDialogSave"
    />
  </div>
</template>
<script>
// TODO:: 只对列表组件van-design-list以uuid为key进行数据缓存，可能会对其他某些组件造成影响，待测试
import addDataDialog from "./dialog/add-data-dialog.vue";
import { EventBus } from "@/util/event-bus.js";
import interfaceConfig from "./modules/interface-config/index.vue";
import mockDialog from "./dialog/mock-dialog-comp.vue";
import { generateUUID } from "@/views/report/utils/index.js";

export default {
  name: "dataSourceApiConfigNew",
  components: {
    addDataDialog,
    interfaceConfig,
    mockDialog
  },
  props: {
    chooseSubpageIndex: {
      type: Number,
    },
  },
  data() {
    return {
      dataActiveName: "",
      addDataDialogVisible: false,
      mockDialogVisible: false,
      interfaceData: [],
      interfaceDataTypeDict: {
        "radio-button-interface": "后端服务",
        "radio-button-tables": "数据表",
        "radio-button-dataset": "SQL脚本",
        "radio-button-view": "视图",
        "radio-button-connect": "系统服务",
        // 'radio-button-sql': 'SQL脚本'
      },
      mockItem:{},
      componentUuidList: [],
      isEditMock: false
    };
  },
  watch: {},
  created() {
    this.interfaceData = this.$pageDataModelEngine.getInterfaceData();
  },
  mounted() {},
  methods: {
    openMockDialog() {
      this.isEditMock = false
      this.mockItem = {}
      this.mockDialogVisible = true
    },
    onMockDataDialogSave(mockData){
      //将模拟数据也作为接口保存到接口列表中
      if (this.isEditMock && this.mockItem.data.name == mockData.mockName) {
        this.mockItem.data.responseData = JSON.parse(mockData.mockData)
      } else {
        let interfaceItem = {
          type: 'radio-button-interface',
          id: generateUUID("data-interface-"),
          data: {
            id: Math.round(Math.random()*10000 + 10000),
            name: mockData.mockName,
            isMockData: true,
            type: 'radio-button-interface',
            responseData: JSON.parse(mockData.mockData)
          }
        }
        this.$pageDataModelEngine.saveInterfaceData(interfaceItem)
        EventBus.$emit("onChangeInterfaceData");
      }
    },
    onAddDataDialogSubmit(data) {
      this.addDataDialogVisible = false;
      this.$pageDataModelEngine.saveInterfaceData(data);

      //2022-04-14 这里想办法优化
      this.jugEmitChange(data.id,0)
    },
    jugEmitChange(key,tryCount){
      let _this=this;
      setTimeout(() => {
         let interfaceData = _this.$pageDataModelEngine.getInterfaceData(key);
					if (!interfaceData.data.responseData) {
						if (tryCount >= 8) {
							return ''
						}
						tryCount++
						return _this.jugEmitChange(key, tryCount)
					}
          EventBus.$emit("onChangeInterfaceData");
          return true;
				}, tryCount * 500)

    },
    onDelInterfaceData(index) {
      this.$pageDataModelEngine.deleteInterfaceData(index);
    },
    editProject(item) {
      //radio-button-interface  "radio-button-tables"  "radio-button-connect"
      let type = "";
      if (item.data.isMockData) {
        this.isEditMock = true
        this.mockDialogVisible = true
        this.mockItem = item
      }
      else if (item.type == "radio-button-interface") {
        type = "process";
        const data = {
          id: item.data.id,
          dataType: "process",
          subType: "process",
          queryId: item.data.id,
          name: item.data.name, //processName
          treeId: item.data.id,
          version:item.data.version
        };
        EventBus.$emit("onChangeDataTypeEvent", type, data);
      }
    },
    changeMock(value) {
      console.log("changeMock", value);
    },
  },
};
</script>
<style scoped lang="scss">
.panel-add-btn {
  position: absolute;
  right: 40px;
  padding: 4px;
}
.project-edit {
  position: absolute;
  right: 60px;
  padding: 4px;
}
.project-delete {
  position: absolute;
  right: 40px;
  padding: 4px;
}
.project-mock-div {
  display: flex;
  align-items: center;
  margin-left:40px;
}
.project-mock {
  font-size: 28px;
  margin-left: 20px;
  color: #409eff;
  cursor: pointer;
}
</style>
