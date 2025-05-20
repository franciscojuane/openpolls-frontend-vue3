<template>
  <v-container>
    <v-data-table
      :items="textTableItems"
      :headers="[{ title: 'Answer', value: 'answerText' }]"
      v-model:options="paginationOptions"
      :server-items-length="totalTextItems"
      :loading="loading"
    >
      <template v-slot:[`item.answerText`]="{ item }">
        <div style="text-align: start">{{ item }}</div>
      </template>
    </v-data-table>
  </v-container>
</template>
<script setup>
import { ref, reactive, defineProps, defineOptions, inject, watch } from "vue";

defineOptions({
  name: "TextTableQuestionViewScreen",
});

const api = inject("api");

let loading = ref(false);

let textTableItems = ref([]);
let paginationOptions = reactive({
  itemsPerPage: 10,
  page: 1,
});
let totalTextItems = ref(0);

const props = defineProps({
  question: {
    type: Object,
    default: () => {},
  },
  answers: {
    type: Array,
    default: () => [],
  },
});

function loadTextQuestionData(v) {
  if (!v) return;
  loading.value = true;
  api
    .get(
      "/polls/" +
        v.pollId +
        "/submissions/answersByQuestion/" +
        v.id +
        "?size=" +
        paginationOptions.itemsPerPage +
        "&page=" +
        (paginationOptions.page - 1)
    )
    .then(({ data }) => {
      textTableItems.value = data.content;
      totalTextItems.value = data.page.totalElements;
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
}
watch(
  () => props.question,
  (v) => {
    loading.value = true;

    if (v) {
      loadTextQuestionData(v);
    }
  },
  { immediate: true }
);

watch(
  paginationOptions,
  () => {
    loadTextQuestionData(props.question);
  },
  { deep: true }
);
</script>
