<template>
  <v-container>
    <ApexChart
      :height="height"
      :width="width"
      type="bar"
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
    answers: {
      type: Array,
      default: () => [],
    },
    height: String,
    width: String,
  },

  methods: {
    calculateOptions() {
      this.options = {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: this.aggregatedData.map((elem) => elem.answer),
        },
      };
    },
    calculateSeries() {
      if (this.question) {
        this.series = [
          {
            name: "series-1",
            data: this.aggregatedData.map((elem) => elem.count),
          },
        ];
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
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },
    },
  },
};
</script>
