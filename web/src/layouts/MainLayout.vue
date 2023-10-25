<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar @click="toolbar = !toolbar">
        <q-btn flat dense round icon="menu" aria-label="Menu" />

        <q-toolbar-title> Менеджер задач </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="toolbar"
      :width="200"
      :breakpoint="500"
      overlay
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(item, index) in menuList" :key="index">
            <q-item
              clickable
              v-ripple
              :to="item.page"
              :active="item.page == currentPage"
              active-class="menu-active"
              @click="currentPage = item.page"
            >
              <q-item-section>
                {{ item.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="item.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watch } from "vue";

const menuList = [
  {
    label: "Создать заказ",
    page: "/create",
    separator: true,
  },
  {
    label: "Заказы",
    page: "/orders",
    separator: false,
  },
];

export default defineComponent({
  name: "MainLayout",

  setup() {
    const toolbar = ref(false);
    const currentPage = ref();

    return {
      toolbar,
      menuList,
      currentPage,
    };
  },
});
</script>

<style scoped>
.menu-active {
  background-color: cadetblue;
  color: aliceblue;
}
</style>
