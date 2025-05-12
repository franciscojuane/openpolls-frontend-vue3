<template>
  <v-card v-if="question">
    <v-card-title class="text-left">{{ question.text }}</v-card-title>
    <v-card-subtitle>{{ question.subtext }}</v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row justify="center">
          <v-col cols="3">
            <v-form v-model="valid">
              <v-text-field
                v-model="numericValue"
                class="text-right"
                :rules="[
                  (v) =>
                    (v >= question.minValue && v <= question.maxValue) ||
                    'The value should be between ' +
                      question.minValue +
                      ' and ' +
                      question.maxValue,
                ]"
                @keypress="onlyNumbers($event)"
                @change="
                  validateNumber($event.target.value);
                  emitValue();
                "
              ></v-text-field></v-form
          ></v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { defineProps, watch, defineEmits, ref } from "vue";

let numericValue = ref("");
let valid = ref(false);

const props = defineProps({
  question: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["answer", "valid"]);

watch(props.question, () => {
  numericValue = null;
});
watch(valid, (v) => {
  emit("valid", v);
});

function validateNumber(value) {
  numericValue.value = value.replace(/[^0-9]/g, "");
}
function onlyNumbers() {
  if (event.key < "0" || event.key > "9") {
    event.preventDefault();
  }
}
function emitValue() {
  emit("answer", {
    answer: numericValue,
    questionId: props.question.id,
  });
}
</script>
<style scoped>
.text-right >>> input {
  text-align: right;
}
</style>
