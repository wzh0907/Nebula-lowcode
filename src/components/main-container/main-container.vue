<template>
  <div class="container-full">
    <header v-if="$slots.header" ref="header" class="container-full__header">
      <slot name="header" />
    </header>
    <div class="container-full__body">
      <header v-if="$route.query.title || title" class="title">
        <span>{{ $route.query.title || title }}</span>
      </header>
      <slot />
    </div>
    <!-- <footer v-if="$slots.footer" class="container-full__footer" ref="footer">
            <slot name="footer"/>
    </footer>-->
  </div>
</template>

<script>
// import { mapActions, mapState } from 'vuex'
// import { API } from '@/constants'
export default {
  name: 'MainContainerFull',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      acquirerType: '',
      fullscreenLoading: false
    }
  },
  computed: {},
  created() {},
  methods: {}
}
</script>

<style lang="scss">
//elements get appended with "__" and the $name
@mixin e($name) {
  @at-root #{&}__#{$name} {
    @content;
  }
}
//modifiers get appended with "--" and the $name
@mixin m($name) {
  @at-root #{&}--#{$name} {
    @content;
  }
}

.container-full {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;

  @include e(header) {
    display: flex;
    align-items: center;
    padding: 25px 15px;
    margin-bottom: 15px;
    background-color: #fff;
    .el-form-item {
      margin-bottom: 0;
    }
  }

  @include e(body) {
    flex-grow: 1;
    padding: 20px 20px;
    overflow: auto;
    position: relative;
    background-color: #fff;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      font-size: 14px;
      color: #686f79;
      margin: -20px -20px 15px -20px;
      padding: 0 15px;
      border-bottom: 1px solid #ebeef5;
      letter-spacing: 0;
      font-weight: bold;
      text-align: left;
    }
  }
}
</style>
