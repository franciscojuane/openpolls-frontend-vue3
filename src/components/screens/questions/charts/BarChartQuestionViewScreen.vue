<template>
  <v-container>
    <apexchart
      v-if="series && series[0].data && series[0].data.length > 0"
      :height="height"
      :width="width"
      type="bar"
      :series="series"
      :options="options"
    ></apexchart>
  </v-container>
</template>
<script setup>
import { defineProps, defineOptions, watch, ref, inject } from "vue";

const api = inject("api");

defineOptions({
  name: "BarChartQuestionViewScreen",
});

let options = ref({
  chart: {
    id: "vuechart-example",
  },
  xaxis: {
    categories: [],
  },
});
let series = ref([
  {
    name: "series-1",
    data: [],
  },
]);
let aggregatedData = ref([]);

const props = defineProps({
  question: {
    type: Object,
    default: () => {},
  },
  answers: {
    type: Array,
    default: () => [],
  },
  height: {
    type: String,
    default: "100",
  },
  width: { type: String, default: "100" },
});

function calculateOptions() {
  options.value = {
    chart: {
      id: "vuechart-example",
    },
    xaxis: {
      categories: aggregatedData.value.map((elem) => "" + elem.answer),
    },
  };
}
function calculateSeries() {
  if (props.question) {
    series.value = [
      {
        name: "series-1",
        data: aggregatedData.value.map((elem) => elem.count),
      },
    ];
  }
  console.log(series);
}

watch(
  () => props.question,
  (v) => {
    if (v) {
      options.value.xaxis.categories = v.options;
      api
        .get(
          "/polls/" + v.pollId + "/submissions/answerCountByQuestion/" + v.id
        )
        .then(({ data }) => {
          aggregatedData.value = data.content;
          calculateOptions();
          calculateSeries();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  { immediate: true }
);
</script>
