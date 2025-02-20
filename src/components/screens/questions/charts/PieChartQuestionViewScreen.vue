<template>
  <v-container>
    <ApexChart
      :height="height"
      :width="width"
      type="pie"
      :series="series"
      :options="options"
    ></ApexChart>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    options: {
      chart: {
        id: "vuechart-example",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [
      {
        name: "series-1",
        data: [],
      },
    ],
  }),
  props: {
    question: {
      type: Object,
      default: () => {},
    },
    height: String,
    width: String,
  },

  methods: {
    calculateOptions() {
      this.options = {
        labels: this.question.options,
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [],
        },
      };
    },
    calculateSeries() {
      if (this.question) {
        this.series = this.aggregatedData.map((elem) => elem.count);
      }
    },
  },

  watch: {
    question: {
      immediate: true,
      handler(v) {
        this.loading = true;
        if (v) {
          this.options.xaxis.categories = v.options;
          this.$api
            .get(
              "/polls/" +
                v.pollId +
                "/submissions/answerCountByQuestion/" +
                v.id
            )
            .then(({ data }) => {
              this.aggregatedData = data.content;
              this.calculateOptions();
              this.calculateSeries();
              this.loading = false;
            });
        }
      },
    },
  },
};
</script>
