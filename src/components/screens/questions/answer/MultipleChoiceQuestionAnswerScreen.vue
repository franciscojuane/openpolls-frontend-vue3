<template>
  <v-card v-if="question" class="justify-center">
    <v-card-title class="text-left">{{ question.text }}</v-card-title>
    <v-card-subtitle>{{ question.subtext }}</v-card-subtitle>
    <v-card-text>
      <v-container v-if="onlyOneOptionToSelect">
        <v-row
          ><span :style="valid ? 'color:black' : 'color: red'">{{
            selectMessage
          }}</span></v-row
        >
        <v-row>
          <v-radio-group v-model="selectedOption">
            <v-radio
              v-for="option of question.options"
              :key="option"
              :label="option"
              :value="option"
            ></v-radio> </v-radio-group
        ></v-row>
      </v-container>

      <v-container v-else>
        <v-row
          ><span :style="valid ? 'color:black' : 'color: red'">{{
            selectMessage
          }}</span></v-row
        >
        <v-container>
          <v-row v-for="option of question.options" :key="option" dense>
            <v-checkbox
              :key="option"
              :value="option"
              v-model="selectedOptions"
              class="mb-n8"
            >
              <template v-slot:label> {{ option }}</template>
            </v-checkbox>
          </v-row>
        </v-container>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script setup>
import {
  defineProps,
  watch,
  computed,
  ref,
  defineOptions,
  defineEmits,
} from "vue";

let selectedOption = ref([]);
let selectedOptions = ref([]);

defineOptions({
  name: "MultipleChoiceQuestionAnswerScreen",
});

const props = defineProps({
  question: { type: Object, default: () => {} },
});

const emit = defineEmits(["answer", "valid"]);

let onlyOneOptionToSelect = computed(() => {
  return (
    props.question.minAmountOfSelections ==
      props.question.maxAmountOfSelections &&
    props.question.minAmountOfSelections == 1
  );
});

let formattedAnswer = computed(() => {
  if (onlyOneOptionToSelect.value) {
    if (selectedOption.value) {
      let x = [
        {
          answer: selectedOption,
          questionId: props.question.id,
        },
      ];
      return x;
    } else {
      return [];
    }
  } else {
    let answers = [];
    for (let selectedOption of selectedOptions.value) {
      answers.push({
        answer: selectedOption,
        questionId: props.question.id,
      });
    }
    return answers;
  }
});

watch(
  formattedAnswer,
  (v) => {
    emit("answer", v);
  },
  { deep: true }
);

let valid = computed(() => {
  if (onlyOneOptionToSelect.value) {
    return selectedOption.value != null;
  } else {
    return (
      selectedOptions.value.length >= props.question.minAmountOfSelections &&
      selectedOptions.value.length <= props.question.maxAmountOfSelections
    );
  }
});

watch(
  valid,
  (v) => {
    emit("valid", v);
  },
  { immediate: true }
);

let selectMessage = computed(() => {
  if (
    props.question.minAmountOfSelections == props.question.maxAmountOfSelections
  ) {
    if (props.question.minAmountOfSelections == 1) {
      return "Select 1 option";
    } else {
      return "Select" + props.question.minAmountOfSelections + " options.";
    }
  } else {
    return (
      "Select between " +
      props.question.minAmountOfSelections +
      " and " +
      props.question.maxAmountOfSelections
    );
  }
});
</script>
