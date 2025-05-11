<template>
  <v-container>
    <v-data-table
      :items="textTableItems"
      :headers="[{ text: 'Answer', value: 'answerText' }]"
      v-model:options="paginationOptions"
      :server-items-length="totalTextItems"
      :loading="loading"
    >
      <template v-slot:[`item.answerText`]="{ item }">
        {{ item }}
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    headers: [],
    loading: false,
    aggregatedData: null,
    textTableItems: [],
    paginationOptions: {
      itemsPerPage: 10,
      page: 1,
    },
    totalTextItems: 0,
  }),
  props: {
    question: {
      type: Object,
      default: () => {},
    },
    answers: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    loadTextQuestionData(v) {
      if (!v) return;
      this.loading = true;
      this.$api
        .get(
          "/polls/" +
            v.pollId +
            "/submissions/answersByQuestion/" +
            v.id +
            "?size=" +
            this.paginationOptions.itemsPerPage +
            "&page=" +
            (this.paginationOptions.page - 1)
        )
        .then(({ data }) => {
          this.textTableItems = data.content;
          this.totalTextItems = data.page.totalElements;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  watch: {
    question: {
      immediate: true,
      handler(v) {
        this.loading = true;

        if (v) {
          this.loadTextQuestionData(v);
        }
      },
    },
    paginationOptions: {
      deep: true,
      handler() {
        this.loadTextQuestionData(this.question);
      },
    },
  },
};
</script>
