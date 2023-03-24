<template>
  <div class="custom_collapse_panel">
    <el-collapse v-model="activeNames">
      <el-collapse-item  :title="config.labelName" name="1">
        <el-form  size="small" style="padding-left: 20px;" label-width="70px" label-position="left">
            <el-form-item :label="item.labelName" style="margin-bottom: 10px;" v-for="(item, index) in config.collapsePanelColumnsConfigs" :key="index">
              <el-switch
                @change="changeStatus(item,$event)"
                v-if="item.formType === 'switch'"
                v-model="componentConfig.options[item.key]"
              >
              </el-switch>
            </el-form-item>
            <!-- 公共 -->
            <el-form-item label="隐藏" style="margin-bottom: 10px;">
              <el-switch v-model="componentConfig.options.commonConfig.displayHide"></el-switch>
            </el-form-item>
            <!-- <el-form-item label="背景颜色" style="margin-bottom: 10px;">
              <el-color-picker v-model="componentConfig.options.commonConfig.backgroundColor" style="vertical-align: middle;" />
            </el-form-item> -->
            <el-form-item label="权限" style="margin-bottom: 10px;">
              <!-- 注意：下面被注释的代码不要删除，这个是新版权限管理的代码 -->
              <el-switch
                @change="onCollectionPermission"
                v-model="componentConfig.options.commonConfigAssignIsPermission"
              >
              </el-switch>
              <!-- <el-select multiple v-model="componentConfig.options.commonConfigAssignRights" placeholder="请选择" @change="onChangeAssignRights">
                <el-option
                  v-for="item in rightsRoleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="阴影" style="margin-bottom: 10px;">
              <el-switch v-model="componentConfig.options.commonConfig.isShowShadow"></el-switch>
            </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { deleteAuthorityService } from '@/api/authority/index'
export default {
  name: "columns-config",
  components: {
  },
  props: [
    'componentConfig','config','componentConfigKey','componentList', 'collectionPermissionListPool'
  ],
  data() {
    return {
      activeNames: ['1'],
      noBackgroundColorComponentList: ["van-design-notice-bar"],
      rightsRoleList: []
    };
  },
  watch: {
  },
  created() {
    // getRoleListService().then(res => {
    //   let list = res.dataList || []
    //   this.rightsRoleList = [
    //     {
    //       label: '无权限',
    //       value: ''
    //     }
    //   ]
    //   list.forEach(item => {
    //     this.rightsRoleList.push({
    //       label: item.roleName,
    //       value: item.roleName
    //     })
    //   })
    // })
  },
  methods: {
    onCollectionPermission(boole){
      if (boole) {
        this.collectionPermissionListPool[this.componentConfig.uuid] = this.componentConfig
      } else {
        delete this.collectionPermissionListPool[this.componentConfig.uuid]
        this.deletePermission(this.componentConfig.uuid)
      }
    },
    deletePermission(id){
      deleteAuthorityService({
        authorityId: id
      })
    },
    onChangeAssignRights(){
      if (this.componentConfig.options.commonConfigAssignRights.indexOf('') !== -1) {
        this.componentConfig.options.commonConfigAssignRights = []
      }
    },
    changeStatus(data,value) {
      this.config.collapsePanelColumnsConfigs.forEach(() => {
          this.componentConfig.options[data.type]=value
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.custom_collapse_panel{
  padding-top: 10px;
}

</style>
