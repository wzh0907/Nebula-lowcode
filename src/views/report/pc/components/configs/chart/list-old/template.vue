<template>
  <a-list
    class="demo-loadmore-list"
    :loading="options.loading"
    :pagination="options.pagination"
    item-layout="horizontal"
    :data-source="options.interfaceDataConfig.tableData"
  >
    <div
      v-if="options.showLoadingMore"
      slot="loadMore"
      :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
    >
      <a-spin v-if="options.loadingMore" />
      <a-button v-else @click="onLoadMore">
        loading more
      </a-button>
    </div>
    <a-list-item slot="renderItem" slot-scope="item">
      <a v-for="(value,key) in options.opert" slot="actions" :key="key">
        <a :href="value.value"><span>{{ value.label }}</span></a>
      </a>
      <a-list-item-meta>
        <a slot="description">
          <ul>
            <li v-for="(value,key) in options.options" :key="key">
              <span v-if="value.label">{{ value.label }}:</span> {{ item[value.value] }}
            </li>
          </ul>
        </a>

        <a slot="title">{{ item[options.title] }}</a>
        <a-avatar
          v-if="item[options.img]"
          slot="avatar"
          :src="item[options.img]"
        />
      </a-list-item-meta>
      <div>{{ item[options.contain] }}</div>
    </a-list-item>
  </a-list>
</template>

<script>
import optionsConfig from "./options-config";
export default {
  data() {
    return {
      options: optionsConfig,
      // loading: false,
      // loadingMore: false,
      // showLoadingMore: true
    };
  },
  computed: {},
  // watch: {
  //   "options.interfaceDataConfig": {
  //     deep: true,
  //     handler(val) {
  //     },
  //   },
  // },
  methods: {
    onLoadMore(){}
  }
};
</script>
<style lang="scss" scoped>
.demo-loadmore-list {
  min-height: 350px;
}
ul{
  word-break: break-all;
}
</style>
