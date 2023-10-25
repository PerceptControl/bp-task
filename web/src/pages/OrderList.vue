<template>
  <q-page class="flex flex-center">
    <q-btn
      color="secondary"
      @click="getOrders"
      label="Обновить"
      class="absolute-right absolute-top"
    />
    <q-list bordered class="fit">
      <template v-for="(order, index) in orders" :key="order.id">
        <q-item>
          <q-item-section>
            <q-item-label>{{ order.values[3] }}</q-item-label>
            <q-item-label caption>ID: {{ order.id }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator v-if="index < orders.length - 1" />
      </template>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";

export default defineComponent({
  name: "OrdersPage",
  setup() {
    const orders = ref([]);
    let interval = null;

    async function getOrders() {
      fetch("https://unknown-dorothea-eg.koyeb.app/orders")
        .then(async (res) => {
          if (!res.ok) return;
          return res.json();
        })
        .then((res) => {
          orders.value = res;
        })
        .catch((e) => {
          console.error(e);
        });
    }

    onMounted(() => {
      interval = setInterval(getOrders, 5000);
    });

    onUnmounted(() => {
      clearInterval(interval);
    });

    return { orders, getOrders };
  },
});
</script>

<style scoped>
button {
  width: 80px;
  height: 50px;
}
</style>
