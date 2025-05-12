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
import { defineProps, watch, ref, inject } from "vue";

let options = {
  chart: {
    id: "vuechart-example",
  },
  xaxis: {
    categories: [],
  },
};
let series = [
  {
    name: "series-1",
    data: [],
  },
];
const props = defineProps({
  question: {
    type: Object,
    default: () => {},
  },
  height: String,
  width: String,
});

let aggregatedData = ref([]);
let loading = ref(false);

const api = inject("api");

function calculateOptions() {
  options = {
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
    series = aggregatedData.value.map((elem) => elem.count);
  }
}
watch(
  props.question,
  (v) => {
    loading.value = true;
    if (v) {
      options.xaxis.categories = v.options;
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
          loading.value = false;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  { immediate: true }
);
</script>
