<script>
/**
 * 使用说明：支持多列的值配置（双列：输入框形式）
 * 对应的有单列的值配置（columns-config）
 */
import imgUpload from "./img-upload";
import Draggable from 'vuedraggable'
export default {
  name: "columns-config",
  components: {
    imgUpload,
    Draggable
  },
  props: {
    itemKey: {
      type: String,
      default: 'label'
    },
    addBtnText: {
      type: String,
      default: "",
    },
    columnsConfigs: {
      type: Array,
      default: () => [],
    },
    columnsConfigType: {
      type: String,
      default: "input",
    },
    addColumnConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    handleAddColumn() {
      let obj = (!this.isEmptyObject(this.addColumnConfig) && JSON.parse(JSON.stringify(this.addColumnConfig))) || {
        value: "",
      };
      if (this.columnsConfigs[0] && this.columnsConfigs[0].componentList)
        obj.componentList = []; // TODO: 临时解决方法，待优化
      this.columnsConfigs.push(obj);
    },
    handleOptionsRemove(index) {
      this.columnsConfigs.splice(index, 1);
    },
    changeConfigValue(configOptions, configKey, value) {
      configOptions[configKey].value = value;
    },
    isEmptyObject(obj) {
      for (let key in obj) {
        return false;
      }
      return true;
    }
  },
};
</script>

<template>
  <div class="selectTypesOpert">
    <!-- <div class="columnSetting">
      <ul style="text-agling">
        <li>列名</li>
        <li>列值</li>
      </ul>
    </div> -->
    <el-checkbox-group>
      <draggable
        tag="ul"
        v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
        handle=".drag-item"
      >
        <li v-for="(item, index) in columnsConfigs" :key="index" style="display:flex;margin-bottom:10px;">
          <el-input v-model="item[itemKey]" style="width:90px;" size="mini" placeholder="名称" />
          <el-input v-model="item.value" :style="{'width': '90px' }" size="mini" placeholder="值" />
          <!-- <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;">
            <i class="iconfont iconbar" />
          </i> -->
          <!-- <el-button
            circle
            plain
            type="danger"
            size="mini"
            icon="el-icon-minus"
            style="padding: 4px;margin-left: 5px;"
            @click="handleOptionsRemove(index)"
          /> -->
             <i class="iconfont iconbar columns-icon drag-item" />
          
            <i class="iconfont icontrash columns-icon" @click="handleOptionsRemove(index)"/>
        </li>
      </draggable>
    </el-checkbox-group>
    <div style="margin-left: 22px;">
      <el-button type="text" @click="handleAddColumn">{{ addBtnText || '添加列' }}</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.selectTypesOpert{
  .columnSetting{
    width: 100%;
    display: flex;
    ul{
      li{
        float: left;
        &:nth-child(2){
          margin-left: 62px;
        }
      }
    }
  }

}
.columns-icon{
  font-size: 24px;
  line-height: 28px;
  cursor: pointer;
  margin-left: 5px;
}
</style>
