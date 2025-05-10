<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-row cols="4">
            <v-text-field
              label="Text"
              v-model="internalQuestion.text"
            ></v-text-field>
          </v-row>
          <v-row
            ><v-text-field
              label="Subtext"
              v-model="internalQuestion.subText"
            ></v-text-field
          ></v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                type="number"
                label="Minimum length"
                v-model="internalQuestion.minLength"
                :max="internalQuestion.maxLength"
                min="1"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="number"
                max="10"
                :min="internalQuestion.minLength"
                label="Maximum length"
                v-model="internalQuestion.maxLength"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup>
import { defineOptions, defineProps, defineEmits, reactive, watch } from "vue";

defineOptions({
  name: "TextQuestionEditScreen",
});
let internalQuestion = reactive({});

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
});

let emit = defineEmits(["update:modelValue", "change"]);

watch(
  props.modelValue,
  (v) => {
    internalQuestion = v;
  },
  { immediate: true }
),
  watch(
    internalQuestion,
    (v) => {
      internalQuestion.update = true;
      emit("update:modelValue", v);
    },
    { deep: true }
  );
</script>
