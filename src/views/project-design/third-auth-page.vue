<template>
    <div class="file-tree">
        <NewUiIndex v-if="ready"/>
    </div>
  </template>
  
  <script>
  import NewUiIndex from "./new-ui-index.vue"
  import {setStorage} from "@/util/storageUtil.js";
  export default {
    name: 'authPage',
    components: {
        NewUiIndex
    },
    props: [],
    data() {
      return {
        ready:false
      }
    },
    watch: {
    },
    created() {
        let token = this.$route.query.token;
        setStorage('token', token)
        let phoneNumber = this.$route.query.phoneNumber;
        setStorage("phoneNumber",phoneNumber)
        this.ready=true;
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {
        to(){
        //     this.$store.dispatch("project/setProjectId", Number(projectItem.id));
        //   const merchantId = this.$store.getters.merchantId;
        //   const routeUrl = this.$router.resolve({
        //     path: "/design/zh-CN/",
        //     query: {
        //       name: projectItem.projectName,
        //       type: projectItem.type,
        //       projectId: projectItem.id,
        //       merchantId: merchantId,
        //     },
        //   });
        //   window.open(routeUrl.href, "_blank");
        }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  