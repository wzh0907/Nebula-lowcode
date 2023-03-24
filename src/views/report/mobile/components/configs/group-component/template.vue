<template>
  <div class="layout-template-page">
    <div v-for="(item, key) in options.componentList" :key="key">
      <DynamicComponentLib
        v-if="options._isGenerateComponent"
        :componentConfig="item"
        :key="key"
        :elIndex="key"
      />
      <DynamicComponent
        v-else
        :componentConfig="item"
        :key="key"
        :elIndex="key"
        :operability="false"
        @chooseItemIndex="onChangeChooseItemIndex(key, item.uuid)"
      />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import Draggable from "vuedraggable";
import DynamicComponent from "../../dynamic-component.vue";
import DynamicComponentLib from "../../../generate-component/dynamic-component.vue";
import { EventBus } from "@/util/event-bus.js";
import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";
import optionsConfig from "./options-config";
import { generateUUID } from "@/views/report/utils/index.js";

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
      currentComponentConfigList: [],
    };
  },
  watch: {
    "options.componentList": {
      deep: true,
      handler(vals) {
        vals.forEach((item, index) => {
          if (!item.uuid) {
            let newItem = this.componentDeepClone(item);
            newItem.uuid = generateUUID();
            newItem.options.commonConfigAssignSign = newItem.uuid;
            vals[index] = newItem;
          }
        });
      },
    },
  },
  created() {},
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
    /************** end *************/
    onChangeChooseItemIndex(index, uuid) {
      store.dispatch("app/changeMobileDesignComponentUUID", uuid);
      this.currentComponentConfigList = this.options.componentList;
      let currentWidgetComponentConfig = this.currentComponentConfigList[index];
      EventBus.$emit(
        "onChangeCurrentWidgetComponentConfig",
        currentWidgetComponentConfig
      );
    },
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
