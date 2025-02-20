<template>
  <v-container>
    <v-tabs v-model="resultsTabs">
      <v-tab>Graphics</v-tab>
      <v-tab>Raw Data</v-tab>
      <v-tab-item>
        <v-card>
          <v-card-title> {{ question ? question.text : "" }} </v-card-title>
          <v-card-text>
            <ApexChart
              height="500"
              width="100%"
              :type="type"
              v-if="!loading"
              :series="series"
              :options="options"
            ></ApexChart>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item><v-data-table></v-data-table></v-tab-item> </v-tabs
  ></v-container>
</template>
<script>
export default {
  data: () => ({
    headers: [],
    resultsTabs: 0,
    loading: false,
    aggregatedData: null,
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
  },

  methods: {
    calculateOptions() {
      if (this.question) {
        if (this.question.questionType.name == "MULTIPLE_CHOICE") {
          this.options = {
            labels: this.question.options,
            chart: {
              id: "vuechart-example",
            },
            xaxis: {
              categories: ["a", "b"],
            },
          };
        } else if (
          this.question.questionType.name == "NUMERIC" ||
          this.question.questionType.name == "SCALE"
        ) {
          this.options = {
            chart: {
              id: "vuechart-example",
            },
            xaxis: {
              categories: this.aggregatedData.map((elem) => elem.answer),
            },
          };
        }
      } else {
        this.options = {
          chart: {
            id: "vuechart-example",
          },
          xaxis: {
            categories: [],
          },
        };
      }
    },
    calculateSeries() {
      if (this.question) {
        if (this.question.questionType.name == "MULTIPLE_CHOICE") {
          this.series = this.aggregatedData.map((elem) => elem.count);
        } else {
          this.series = [
            {
              name: "series-1",
              data: this.aggregatedData.map((elem) => elem.count),
            },
          ];
        }
      } else {
        this.series = [
          {
            name: "series-1",
            data: [],
          },
        ];
      }
    },
  },
  computed: {
    type() {
      return this.question &&
        this.question.questionType &&
        this.question.questionType.name == "MULTIPLE_CHOICE"
        ? "pie"
        : "bar";
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
              console.log(data);
              this.aggregatedData = data;
              this.calculateOptions();
              this.calculateSeries();
              console.log(this.options);
              console.log(this.series);
              this.loading = false;
            });
        }
      },
    },
  },
};
</script>
