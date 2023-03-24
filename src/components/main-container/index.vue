<template>
  <article ref="container" class="container-component">
    <!-- [container-full] 填充 -->
    <main-container-full v-if="type === 'full'" :title="title">
      <slot v-if="$slots.header" slot="header" name="header" />
      <!-- <slot v-if="$slots.operation" name="operation" slot="operation"/> -->
      <slot />
      <!-- <slot v-if="$slots.footer" name="footer" slot="footer"/> -->
    </main-container-full>
  </article>
</template>

<script>
import mainContainer from './main-container'
export default {
  name: 'MainContainer',
  components: {
    'main-container-full': mainContainer
  },
  props: {
    // 容器样式
    type: {
      type: String,
      required: false,
      default: 'full'
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.container-component {
    display: flex;
    flex: auto;
    // margin-left: 15px;
    overflow: hidden;
}
</style>
