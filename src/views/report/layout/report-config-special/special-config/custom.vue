<template>
  <div>
    <p style="padding: 20px 0px 10px;">上传自定义代码</p>
    <el-button @click="addDataDialogVisible=true">上传</el-button>
    <customDialog :dialog-visible.sync="addDataDialogVisible" :config="config"/>
  </div>


</template>

<script>
import { EventBus } from "@/util/event-bus.js";
import store from '@/store'
import { mapGetters } from 'vuex'
import customDialog from './dialog/customDialog.vue'
export default {
  components: {
    customDialog
  },
  props: [
    'config'
  ],
  data() {
    return {
      addDataDialogVisible:false
    };
  },

  computed: {
    ...mapGetters(['merchantList'])
  },
  created() {
   
  },
  methods: {
    
    
  }
};
</script>
<style scoped lang="scss">
p {
  margin: 0;
  padding: 0;
}

</style>
