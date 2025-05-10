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
                label="Minimum value"
                v-model="internalQuestion.minValue"
                :max="internalQuestion.maxValue"
                min="1"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="number"
                max="10"
                :min="internalQuestion.minValue"
                label="Maximum value"
                v-model="internalQuestion.maxValue"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup>
import { defineOptions, defineProps, watch, defineEmits, reactive } from "vue";

defineOptions({
  name: "NumericQuestionEditScreen",
});

let emit = defineEmits(["update:modelValue", "change"]);

let internalQuestion = reactive({});

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
});

watch(
  props.modelValue,
  (v) => {
    internalQuestion = v;
  },
  { immediate: true }
);

watch(
  internalQuestion,
  (v) => {
    internalQuestion.update = true;
    emit("update:modelValue", v);
  },
  { deep: true }
);
</script>
