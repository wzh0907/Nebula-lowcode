<template>
  <div class="layout-template-page" v-if="options.reloadView">
    <van-form @submit="onSubmit">
      <div v-for="(item, key) in options.inputItemConfigs" :key="key">
        <DynamicComponentLib
          v-if="options._isGenerateComponent && options.inputItemComponentConfigs[key] && options.inputItemComponentConfigs[key].type"
          :componentConfig="options.inputItemComponentConfigs[key]"
          :key="key"
          :elIndex="key"
        />
        <DynamicComponent
          v-else-if="options.inputItemComponentConfigs[key] && options.inputItemComponentConfigs[key].type"
          :componentConfig="options.inputItemComponentConfigs[key]"
          :key="key"
          :elIndex="key"
          :operability="false"
          @chooseItemIndex="onChangeChooseItemIndex(key, key, options.inputItemComponentConfigs[key].uuid)"
        />
      </div>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import store from '@/store'
import Draggable from "vuedraggable";
import DynamicComponent from "../../../dynamic-component.vue";
import DynamicComponentLib from "../../../../generate-component/dynamic-component.vue";
import { EventBus } from "@/util/event-bus.js";
import { componentDeepClone } from '@/views/report/utils/deal-component-data/deep-clone-component-config'
import optionsConfig from './options-config'
import { generateUUID } from "@/views/report/utils/index.js";
import componentsConfigs from "./module/index";
import { componentCopyConfig } from '@/views/report/utils/deal-component-data/copy-component-config'

export default {
  name: "layoutTemplate",
  components: {
    Draggable,
    DynamicComponent,
    DynamicComponentLib
  },
  data() {
    return {
      options: optionsConfig,
    };
  },
  watch: {
    'options.inputItemConfigs': {
      deep: true,
      handler(vals) {
        vals && vals.forEach && this.initComponentConfig(vals)
      }
    }
  },
  created() {
    this.options.inputItemComponentConfigs = []
    this.initComponentConfig(this.options.inputItemConfigs)
  },
  mounted() {
    document.body.ondrop = function (event) {
      const isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  },
  methods: {
    onSubmit(values){
      // console.log('submit', values)
      let fieldList = []
      for(let key in values) {
        let obj = {
          fieldName: key,
          fieldValue: values[key]
        }
        fieldList.push(obj)
      }
      let params = {
        dbConfigId: this.options.databaseId,
        tableName: this.options.dataTableName,
        fieldList
      }
      if (this.options.primaryKey) params.id = this.options.primaryKey
      if (!this.options.generateComponentsUUID) return false
      let eventHandle = new CustomEvent(`${this.options.generateComponentsUUID}-on-preload-handle-form-confirm`, {
        detail: {
          data: params
        }
      })
      window.dispatchEvent(eventHandle)
    },
    initComponentConfig(inputItemConfigs){
      let componentTypeMap = {
        'input': 'van-design-field',
        'switch': 'van-design-switch',
        'radio': 'van-design-radio'
      }
      let formComponentsConfigs = componentsConfigs[0]
      let inputItemComponentConfigs = this.options.inputItemComponentConfigs || []
      inputItemConfigs.forEach((inputItem, inputItemIndex) => {
        let type = inputItem.type || 'input'
        formComponentsConfigs.forEach(configItem => {
          if (!inputItemComponentConfigs[inputItemIndex] || inputItemComponentConfigs[inputItemIndex].type !== configItem.type) {
            if (configItem.type === componentTypeMap[type]) {
              let objTemp = JSON.parse(JSON.stringify(inputItem))
              for(let key in configItem.options) {
                if (!objTemp.hasOwnProperty(key)) {
                  objTemp[key] = configItem.options[key]
                  if (typeof configItem.options[key] === 'object') {
                    objTemp[key] = JSON.parse(JSON.stringify(configItem.options[key]))
                  }
                }
              }
              inputItemConfigs.splice(inputItemIndex, 1, objTemp) // 使vue侦听数据变化
              inputItem = inputItemConfigs[inputItemIndex]
              let newItem = this.componentDeepClone(configItem);
              newItem.uuid = generateUUID()
              newItem.options = inputItem
              newItem.options.commonConfigAssignSign = newItem.uuid
              newItem.options.commonConfigAssignName = newItem.name
              inputItemComponentConfigs[inputItemIndex] = newItem

              this.options.reloadView = false
              this.$nextTick(() => {
                this.options.reloadView = true
              })
            }
          } else if(inputItemComponentConfigs[inputItemIndex] && inputItemComponentConfigs[inputItemIndex].options) {
            inputItemComponentConfigs[inputItemIndex].options = inputItem
          }
        })
      })
    },
    /************** end *************/
    onChangeChooseItemIndex(colIndex, index, uuid) {
      store.dispatch('app/changeMobileDesignComponentUUID', uuid)
      let currentWidgetComponentConfig = this.options.inputItemComponentConfigs[colIndex]
      EventBus.$emit('onChangeCurrentWidgetComponentConfig', currentWidgetComponentConfig)
    },
    componentCopyConfig,
    componentDeepClone,
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
