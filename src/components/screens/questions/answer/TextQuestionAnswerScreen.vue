<template>
  <v-card v-if="question">
    <v-card-title class="text-left">{{ question.text }}</v-card-title>
    <v-card-subtitle>{{ question.subtext }}</v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row justify="center">
          <v-col cols="9">
            <v-form v-model="valid">
              <v-textarea
                :maxLength="question.maxLength"
                outlined
                :rules="[
                  (v) =>
                    (v &&
                      v.length >= question.minLength &&
                      v.length <= question.maxLength) ||
                    'The length should be between ' +
                      question.minLength +
                      ' and ' +
                      question.maxLength,
                ]"
                :hint="
                  'The length should be between ' +
                  question.minLength +
                  ' and ' +
                  question.maxLength
                "
                @change="emitValue($event.target.value)"
              >
              </v-textarea>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { defineProps, ref, watch, defineEmits } from "vue";

let textValue = ref(null);
let valid = ref(false);

const emit = defineEmits(["valid", "answer"]);

const props = defineProps({
  question: { type: Object, default: () => {} },
});

watch(props.question, () => {
  textValue.value = null;
});

watch(valid, (v) => {
  emit("valid", v);
});

function emitValue(value) {
  emit("answer", {
    answer: value,
    questionId: props.question.id,
  });
}
</script>
