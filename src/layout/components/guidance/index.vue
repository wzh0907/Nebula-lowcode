<template>
  <div class="guide-wapper">
    <img src="@/assets/images/guide/1.png" width="100%" v-if="activeImg == 1" />
    <img src="@/assets/images/guide/2.png" width="100%"  v-if="activeImg == 2" />
    <img src="@/assets/images/guide/3.png" width="100%"  v-if="activeImg == 3" />
    <img src="@/assets/images/guide/4.png" width="100%"  v-if="activeImg == 4" />
    <img src="@/assets/images/guide/5.png" width="100%"  v-if="activeImg == 5" />
    <img src="@/assets/images/guide/6.png" width="100%"  v-if="activeImg == 6" />
    <img src="@/assets/images/guide/7.png" width="100%"  v-if="activeImg == 7" />
    <img src="@/assets/images/guide/8.png" width="100%"  v-if="activeImg == 8" />
    <img src="@/assets/images/guide/9.png" width="100%"  v-if="activeImg == 9" />

    <img
      src="@/assets/images/guide/last.png"
      class="guide-last"
      @click="last"
      v-if="activeImg > 1 && activeImg <8"
    />
    <img
      src="@/assets/images/guide/next.png"
      class="guide-next"
      @click="next"
      v-if="activeImg < 8"
    />
    <img
      src="@/assets/images/guide/last.png"
      class="guide-last guide-8"
      @click="last"
      v-if="activeImg ==8"
    />
    <img
      src="@/assets/images/guide/next.png"
      class="guide-next guide-8"
      @click="next"
      v-if="activeImg ==8"
    />
    
    <img
      src="@/assets/images/guide/start.png"
      class="guide-start"
      @click="start"
      v-if="activeImg == 9"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeImg: 1,
    };
  },
  computed: {},
  created() {},
  mounted() {
  },
  methods: {
    last() {
      this.activeImg = this.activeImg - 1;
    },
    next() {
      this.activeImg = this.activeImg + 1;
    },
    start() {
      this.activeImg=1;
      this.$emit("start");
    },
  },
};
</script>
<style lang="scss">
.guide-wapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 102;
  background: rgba(170, 170, 170,1);
}
.guide-last {
  position: absolute;
  margin-top: 80vh;
  margin-left: 30vw;
  left: 20px;
  width: 250px;
  z-index: 200;
  cursor: pointer;
}
.guide-next {
  position: absolute;
  margin-top: 80vh;
  margin-left: 45vw;
  left: 20px;
  width: 250px;
  z-index: 200;
  cursor: pointer;
}
.guide-8{
   margin-top: 90vh;
   width: 200px;
}
.guide-start {
  position: absolute;
  margin-top: 40vh;
  margin-left: 65vw;
  left: 20px;
  width: 250px;
  z-index: 200;
  cursor: pointer;
}
</style>
