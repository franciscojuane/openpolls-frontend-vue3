<template>
  <v-container>
    <apexchart
      :height="height"
      :width="width"
      type="pie"
      :series="series"
      :options="options"
    ></apexchart>
  </v-container>
</template>
<script setup>
import { ref, defineProps, defineOptions, watch, inject } from "vue";

defineOptions({
  name: "PieChartQuestionViewScreen",
});

const api = inject("api");

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
  height: {
    type: String,
    default: "100",
  },
  width: { type: String, default: "100" },
});

function calculateOptions() {
  options.value = {
    labels: props.question.options,
    chart: {
      id: "vuechart-example",
    },
    xaxis: {
      categories: [],
    },
  };
}
function calculateSeries() {
  if (props.question) {
    series.value = aggregatedData.value.map((elem) => elem.count);
  }
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
          let options = props.question.options;
          let result = [];
          for (let option of options) {
            let elemFromData = data.content.find(
              (elem) => elem.answer == option
            );
            if (elemFromData) {
              result.push(elemFromData);
            } else {
              result.push({ answer: option, count: 0 });
            }
          }

          aggregatedData.value = result;
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
