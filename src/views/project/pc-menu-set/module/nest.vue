<template>
  <div v-if="menuList && menuList.length > 0">
    <draggable
      class="dragArea"
      tag="div"
      v-bind="dragOptions"
      :list="menuList"
      @change="end"
    >
      <template v-for="(menu, index) in menuList">
        <div draggable=".item" class="list-group-item" v-if="!menu.emptyHolder" :key="index">
          <p
            :key="menu.id"
            :class="[menu.id == chosenId ? 'chosen_li' : '']"
            @click.stop="select(menu.id)"
          >
            {{ menu.name }}
          </p>
          <i
            class="el-icon-circle-plus-outline plus_sub"
            :class="{ chosen_plus: menu.id == chosenId }"
            @click="addSubMenu(menu.id)"
          ></i>
          <nested-draggable
            :menuList="menu.children"
            v-if="menu.children"
            :chosenId="chosenId"
            @menuChosen="select"
            @addSubMenu="addSubMenu"
            @endMove="end"
          ></nested-draggable>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "nested-draggable",
  components: {
    draggable,
  },
  props: {
    menuList: {
      required: true,
      type: Array,
      default: [],
    },
    chosenId: {
      type: Number | String,
      default: 0,
    },
  },
  data() {
    return {};
  },
  computed: {
    dragOptions() {
      return {
        group: "nested",
        ghostClass: "ghost",
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.65,
      };
    },
  },

  methods: {
    move() {
      console.log("move");
    },
    end(e) {
      this.$emit("endMove", this.menuList);
    },
    select(id) {
      this.$emit("menuChosen", id);
    },
    addSubMenu(id) {
      this.$emit("addSubMenu", id);
    },
  },
};
</script>
<style scoped>
.dragArea {
  /* min-height: 50px; */
  /* outline: 1px dashed; */
}
.dragArea:nth-child(0) {
  margin-left: -20px;
}
.list-group {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
}
.list-group-item {
  margin-top: 0px;
  position: relative;
  display: block;
  /* padding-left: 1.25rem; */
  margin-bottom: -1px;
  /* background-color: #fff; */
  /* border: 1px solid rgba(0, 0, 0, 0.125); */
}
.nested-1 {
  background-color: #e6e6e6;
}

.nested-2 {
  background-color: #cccccc;
}
.nested-3 {
  background-color: #b3b3b3;
}
.chosen_li {
  background-color: #5a6268;
  color: white;
}
p {
  padding-top: 5px;
  padding-bottom: 5px;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

.right_menu_info {
  padding-left: 10px;
}
.report_config_select_icon_p {
  color: #000;
}
.plus_sub {
  position: absolute;
  right: 5px;
  top: 9px;
  color: #000;
  cursor: pointer;
}
.chosen_plus {
  color: #fff;
}
</style>