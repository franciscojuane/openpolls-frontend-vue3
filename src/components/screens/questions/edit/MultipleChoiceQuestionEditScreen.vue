<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="6">
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
                label="Minimum amount of selections"
                v-model="internalQuestion.minAmountOfSelections"
                :max="internalQuestion.maxAmountOfSelections"
                min="1"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="number"
                max="10"
                :min="internalQuestion.minAmountOfSelections"
                label="Maximum amount of selections"
                v-model="internalQuestion.maxAmountOfSelections"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6"
          ><v-row>
            <v-col cols="11" offset="1"
              ><v-text-field
                v-model="newItem"
                label="Add Element"
                append-outer-icon="mdi-plus"
                @click:append-outer="addItem"
                @keydown.enter="addItem"
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row>
            <v-col cols="11" offset="1">
              <v-chip
                v-for="(item, index) in internalQuestion.options"
                :key="index"
                class="ma-2"
              >
                {{ item }}

                <template #append
                  ><v-icon class="ml-2" @click="removeItem(index)"
                    >mdi-close</v-icon
                  ></template
                >
              </v-chip>

              <v-alert
                v-if="internalQuestion.options.length === 0"
                type="info"
                class="mt-4"
              >
                No elements in the list
              </v-alert>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup>
import {
  reactive,
  ref,
  watch,
  defineProps,
  defineOptions,
  defineEmits,
} from "vue";

defineOptions({
  name: "MultipleChoiceQuestionEditScreen",
});

let defaultInternalQuestion = {
  text: "",
  subText: "",
  minAmountOfSelections: "",
  maxAmountOfSelections: "",
  options: {
    length: 0,
  },
};

let emit = defineEmits(["update:modelValue", "change"]);

let internalQuestion = reactive(defaultInternalQuestion);

let newItem = ref("");
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      Object.assign(internalQuestion, defaultInternalQuestion);
    } else {
      Object.assign(internalQuestion, newValue);
    }
  },
  { immediate: true }
);

watch(
  internalQuestion,
  (newValue) => {
    emit("update:modelValue", newValue);
    emit("change");
  },
  { deep: true }
);

function addItem() {
  if (newItem.value.trim()) {
    internalQuestion.options.push(newItem.value.trim());
    newItem.value = "";
  }
}
function removeItem(index) {
  internalQuestion.options.splice(index, 1);
}
</script>
