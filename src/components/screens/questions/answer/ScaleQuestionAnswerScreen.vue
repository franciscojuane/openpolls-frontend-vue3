<template>
  <v-card v-if="question">
    <v-card-title class="text-left">{{ question.text }}</v-card-title>
    <v-card-subtitle>{{ question.subtext }}</v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row justify="center">
          <v-col cols="9">
            <v-slider
              v-model="numericValue"
              :step="question.scale"
              :min="question.minValue"
              :max="question.maxValue"
              :tick-labels="ticksLabels"
              ticks="always"
              thumb-label="always"
              @update:modelValue="emitValue($event)"
            ></v-slider>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { defineProps, watch, defineEmits, computed, ref } from "vue";
let numericValue = ref(1);

const emit = defineEmits("answer", "valid");
const props = defineProps({
  question: { type: Object, default: () => {} },
});

watch(
  props.question,
  (v) => {
    numericValue.value = v.minValue;
    emitValue(numericValue);
    emit("valid", true);
  },
  { immediate: true }
);

let ticksLabels = computed(() => {
  let result = [];
  for (let i = props.question.minValue; i <= props.question.maxValue; i++) {
    result.push(i);
  }
  return result;
});

function emitValue(value) {
  emit("answer", {
    answer: value,
    questionId: props.question.id,
  });
}
</script>
<style>
.v-slider__tick-label {
  font-size: 70%;
}
</style>
