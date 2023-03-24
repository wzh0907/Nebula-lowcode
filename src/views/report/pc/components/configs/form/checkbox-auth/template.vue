<template>
  <div class="custom_total_form_component">
    <a-tabs default-active-key="PC" @tab-click="handleClick">
      <a-tab-pane tab="电脑端权限" key="PC">
        <a-row style="background: #fff">
          <a-col :span="12">
            <div style="padding: 10px">菜单权限</div>
            <!-- <el-tree
              ref="pcTree"
              :data="authorityPCListTree"
              show-checkbox
              default-expand-all
              :default-checked-keys="checkList"
              node-key="authorityId"
              @check="handlePcCheckChange"
              @node-click="handleNodeClick"
            ></el-tree> -->
            <a-tree
              v-if="authorityPCListTree.length>0"
              ref="pcTree"
              :tree-data="authorityPCListTree"
              default-expand-all
              :defaultExpandAll="true"
              :checkedKeys="checkList"
              :replace-fields="replaceFields"
              checkable
              :checkStrictly="options.checkStrictly"
              @select="onSelect"
              @check="onCheck"
            />
          </a-col>
          <a-col :span="12">
            <div style="padding: 10px">功能权限</div>
            <div style="padding: 10px">
              <a-checkbox
                v-for="authComponent in authorityComponentList"
                v-model="authComponent.checked"
                :label="authComponent.authorityId"
                :key="authComponent.authorityId"
                @change="handleCheckedChange"
                >{{ authComponent.label }}</a-checkbox
              >
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>

      <a-tab-pane tab="移动端权限" key="MOBILE">
        <!-- <el-tree
          ref="tree"
          :data="authorityMobileListTree"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkList"
          node-key="authorityId"
          @check="handleMobileCheckChange"
        ></el-tree> -->
         <a-tree
              v-if="authorityMobileListTree.length>0"
              ref="mobileTree"
              :tree-data="authorityMobileListTree"
              default-expand-all
              :defaultExpandAll="true"
              :checkedKeys="checkList"
              :replace-fields="replaceFields"
              checkable
              :checkStrictly="options.checkStrictly"
              @select="onSelect"
              @check="onMobileCheck"
            />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import optionsConfig from "./options-config";
import { getAllListTree, getComponentById } from "@/api/authority/index";
export default {
  name: "checkbox-auth",
  components: {},
  data() {
    return {
      authorityPCListTree: [],
      authorityMobileListTree: [],
      authorityComponentList: [],
      replaceFields: {      },
      activeName: "PC",
      options: optionsConfig,
    };
  },
  watch: {
    "options.values": {
      deep: true,
      handler(val) {
      },
    },
  },
  computed: {
    checkList() {
      console.log('checklist',this.options.values)
      return this.options.values;
    },
  },
  mounted() {
    this.queryAuthorityAllList();
    this.activeName = "PC";
    this.replaceFields= {
        title: "label",
        key: "authorityId",
      };
  },
  created() {},
  methods: {
    queryAuthorityAllList() {
      getAllListTree().then((res) => {
        this.authorityPCListTree = res.data.pcTree || [];
        this.authorityMobileListTree = res.data.mobileTree || [];
        this.$forceUpdate();


        let that = this;
        // this.$nextTick(() => {
        //   console.log('----22-that.options.values----',that.options.values);
        //     that.options.values.forEach((element) => {
        //       console.log('----333----',element,that.$refs.pcTree);
        //         var node = that.$refs.pcTree.getNode(element);
        //         console.log('----444----',node);
        //         if (node.isLeaf) {
        //             that.$refs.pcTree.setChecked(node, true);
        //         }
        //     });
        // })
        
      });
    },
    handleNodeClick(data, node) {
      // 初始化回显
      if (this.options.componentvalues.length == 0) {
        this.options.componentvalues = this.options.values;
      }
      getComponentById({ reportId: data.queryId }).then((res) => {
        this.authorityComponentList = res.dataList;
        this.authorityComponentList.forEach((cItem) => {
          this.options.componentvalues.forEach((cValues) => {
            if (cItem.authorityId == cValues) {
              cItem.checked = true;
            }
          });
        });
        this.$forceUpdate();
      });
    },
    handleCheckedChange(value) {
      this.authorityComponentList.forEach((item) => {
        if (item.checked) {
          this.deDuplication(item.authorityId, this.options.componentvalues);
        }
      });
      this.handlerAllValue();

      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.cities.length;
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    deDuplication(item, values) {
      let existFlag = false;
      values.forEach((pcItem) => {
        if (pcItem == item) {
          existFlag = true;
        }
      });
      if (!existFlag) {
        values.push(item);
      }
    },
    onSelect(selectedKeys, info) {
      console.log("selected", selectedKeys, info);
      if(info.selected){
           
        this.handleNodeClick(info.selectedNodes[0].data.props)
      }
   
    },
    onCheck(checkedKeys, info) {
      console.log('----ant-onCheck', checkedKeys, info);
      let tempCheckKeys;
      if(this.options.checkStrictly){
        tempCheckKeys= checkedKeys.checked;
       
      }else{
        tempCheckKeys=checkedKeys
      }
      let tempArray = new Array();
      tempCheckKeys.forEach((cItem) => {
        if (cItem) {
          tempArray.push(cItem);
        }
      });
   
      this.options.pcvalues = tempArray;
      this.handlerAllValue();
    },
    onMobileCheck(checkedKeys, info){
      let tempCheckKeys;
      if(this.options.checkStrictly){
        tempCheckKeys= checkedKeys.checked;
       
      }else{
        tempCheckKeys=checkedKeys
      }
      let tempArray = new Array();
      tempCheckKeys.forEach((cItem) => {
        if (cItem) {
          tempArray.push(cItem);
        }
      });
      this.options.mobilevalues = tempArray;
      this.handlerAllValue();
    },
    // old
    handlePcCheckChange(data, checkData) {
      console.log('------handlePcCheckChange',data,checkData);
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
        if (cItem) {
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
        if (cItem) {
          tempArray.push(cItem);
        }
      });
      this.options.mobilevalues = tempArray;
      this.handlerAllValue();
    },
    handlerAllValue() {
      this.options.values = this.options.pcvalues
        .concat(this.options.mobilevalues)
        .concat(this.options.componentvalues);
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
