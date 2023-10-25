<template>
  <q-page class="flex flex-center">
    <q-form autofocus @submit="onSubmit" class="q-gutter-md">
      <q-input v-model="comment" label="Комментарий к заказу" lazy-rules />

      <div>
        <q-btn
          label="Создать"
          type="submit"
          color="primary"
          :loading="loading"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "CreatePage",

  emits: {
    submit: () => {
      return true;
    },
  },

  setup() {
    const comment = ref("");
    let $q = useQuasar();
    console.log($q);

    let loading = ref(false);

    const notifySuccess = (message) => {
      $q.notify({
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
        message,
      });
    };

    const notifyWarning = (message) => {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message,
      });
    };

    function onSubmit() {
      loading.value = true;
      fetch("https://unknown-dorothea-eg.koyeb.app/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: comment.value }),
      })
        .then((res) => {
          console.log(res);
          return res;
        })
        .then((res) => {
          notifySuccess("Заказ успешно создан");
        })
        .catch((err) => {
          console.error(err);
          notifyWarning("Неполадки на сервере");
        })
        .finally(() => {
          loading.value = false;
        });
    }

    return { comment, onSubmit };
  },
});
</script>
