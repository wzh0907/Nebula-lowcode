<template>
  <router-view />
</template>

<script>
import Vue from "vue";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  watch: {
    "$route.params.lang": function (val) {
      this.loadLanguage();
    },
  },
  created() {
    this.loadLanguage();
  },
  methods: {
    loadLanguage() {
      if (this.$route.params.lang === "zh-CN") {
        Vue.config.lang = "zh-CN";
        setStorage("language", "zh-CN");
      } else if (this.$route.params.lang === "en-US") {
        Vue.config.lang = "en-US";
        setStorage("language", "en-US");
      } else {
        this.$router.replace({
          name: this.$route.name,
          params: { lang: navigator.language === "zh-CN" ? "zh-CN" : "en-US" },
        });
      }
    },
  },
};
</script>
