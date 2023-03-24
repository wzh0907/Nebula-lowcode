<template>
  <div>
    <!-- <ul style="width: 1px; height: 10px;"></ul> -->
    <ul>
      <li
        :class="{
          selected: componentConfig.options.columnsSpanType === item.name
        }"
        :title="item.name"
        @click="onChangeColumns(item.values, item.name)"
        v-for="(item, key) in oneDataList"
        :key="key"
      >
        <img :src="imgMap[item.name]" alt="" />
      </li>
    </ul>
    <ul>
      <li
        :class="{
          selected: componentConfig.options.columnsSpanType === item.name
        }"
        :title="item.name"
        @click="onChangeColumns(item.values, item.name)"
        v-for="(item, key) in twoDataList"
        :key="key"
      >
        <img :src="imgMap[item.name]" alt="" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  watch: {},
  props: {
    componentConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      imgMap: {
        "24": require("@/assets/images/report/layout-config/24.png"),
        "12:12": require("@/assets/images/report/layout-config/12-12.png"),
        "6:18": require("@/assets/images/report/layout-config/6-18.png"),
        "18:6": require("@/assets/images/report/layout-config/18-6.png"),
        "8:8:8": require("@/assets/images/report/layout-config/8-8-8.png"),
        "6:12:6": require("@/assets/images/report/layout-config/6-12-6.png"),
        "6:6:6:6": require("@/assets/images/report/layout-config/6-6-6-6.png"),
        "4:4:4:4:4:4": require("@/assets/images/report/layout-config/4-4-4-4-4-4.png")
      },
      oneDataList: [
        {
          name: "24",
          values: [24]
        },
        {
          name: "12:12",
          values: [12, 12]
        },
        {
          name: "6:18",
          values: [6, 18]
        },
        {
          name: "18:6",
          values: [18, 6]
        }
      ],
      twoDataList: [
        {
          name: "8:8:8",
          values: [8, 8, 8]
        },
        {
          name: "6:12:6",
          values: [6, 12, 6]
        },
        {
          name: "6:6:6:6",
          values: [6, 6, 6, 6]
        },
        {
          name: "4:4:4:4:4:4",
          values: [4, 4, 4, 4, 4, 4]
        }
      ]
    };
  },
  created() {},
  methods: {
    onChangeColumns(columnsArr, columnsSpanType) {
      if (
        !this.componentConfig.options ||
        !this.componentConfig.options.columns
      ) {
        return false;
      }
      this.componentConfig.options.columnsSpanType = columnsSpanType;
      let columnsConfig = this.componentConfig.options.columns;
      columnsArr.forEach((columnsSpan, index) => {
        if (columnsConfig[index]) {
          columnsConfig[index].value = columnsSpan;
        } else {
          this.$set(columnsConfig, index, {
            value: columnsSpan,
            componentList: []
          });
        }
      });
      if (columnsConfig.length > columnsArr.length) {
        columnsConfig.splice(
          columnsArr.length - 1,
          columnsConfig.length - columnsArr.length
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
ul {
  display: flex;
  li {
    flex: 1;
    margin-left: 10px;
    margin-bottom: 10px;
    padding: 2px;
    // width: 30%;
    // height: 24px;
    // line-height: 24px;
    // text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    cursor: pointer;
    img {
      display: block;
      width: 100%;
    }
    &.selected {
      border: 1px solid #0079f2;
    }
  }
}
</style>
