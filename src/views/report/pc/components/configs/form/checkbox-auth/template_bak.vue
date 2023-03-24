<template>
  <div class="custom_total_form_component">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="电脑端权限" name="PC">
        <el-tree
          ref="tree"
          :data="authorityPCListTree"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkList"
          node-key="authorityId"
          @check="handlePcCheckChange"
        ></el-tree>
      </el-tab-pane>
      <el-tab-pane label="移动端权限" name="MOBILE">
        <el-tree
          ref="tree"
          :data="authorityMobileListTree"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkList"
          node-key="authorityId"
          @check="handleMobileCheckChange"
        ></el-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import optionsConfig from "./options-config";
import { getAuthorityAllListTree } from "@/api/authority/index";
export default {
  name: "checkbox-auth",
  components: {},
  data() {
    return {
      authorityPCListTree: [],
      authorityMobileListTree: [],
      activeName: "PC",
      options: optionsConfig,
    };
  },
  watch: {
    "options.values": {
      deep: true,
      handler(val) {
        console.log("----options.values----", val);
      },
    },
  },
  computed: {
    checkList() {
      return this.options.values;
    },
  },
  mounted() {
    this.queryAuthorityAllList();
    this.activeName = "PC";
  },
  created() {},
  methods: {
    queryAuthorityAllList() {
      getAuthorityAllListTree().then((res) => {
        this.authorityPCListTree = res.data.pcTree || [];
        this.authorityMobileListTree = res.data.mobileTree || [];
        this.$forceUpdate();
      });
    },
    handlePcCheckChange(data, checkData) {
      let checkedKeys = checkData.checkedKeys || [];
      // 2022-07-06 这是之前的逻辑，去从数组里 删值，我发现有些问题，不如直接把checkedKeys 赋值给values
      // if (data.authorityId) {
      //   let pickDataIndex = this.options.values.indexOf(data.authorityId)
      //   if (pickDataIndex !== -1 && checkedKeys.indexOf(data.authorityId) === -1) {
      //     this.options.values.splice(pickDataIndex, 1)
      //   } else if (pickDataIndex === -1 && checkedKeys.indexOf(data.authorityId) !== -1) {
      //     this.options.values.push(data.authorityId)
      //   }
      // }
      let tempArray = new Array();
      checkedKeys.forEach((cItem) => {
        if (cItem ) {
          tempArray.push(cItem);
        }
      });
      this.options.pcvalues = tempArray;
      this.handlerAllValue();
    },
    handleMobileCheckChange(data, checkData) {
      let checkedKeys = checkData.checkedKeys || [];
      let tempArray = new Array();
      checkedKeys.forEach((cItem) => {
        if (cItem  ) {
          tempArray.push(cItem);
        }
      });
      this.options.mobilevalues = tempArray;
      this.handlerAllValue();
    },
    handlerAllValue() {
      this.options.values = this.options.pcvalues.concat(
        this.options.mobilevalues
      );
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="scss" scoped>
.custom_total_form_component {
  min-height: 100px;
}
</style>
