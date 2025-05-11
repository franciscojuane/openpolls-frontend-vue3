<template>
  <v-container>
    <v-tabs v-model="tabs">
      <v-tab>Information</v-tab>
      <v-tab>Questions</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tabs">
      <v-tabs-window-item>
        <v-card-text>
          <v-form v-model="informationFormValid" ref="formRef">
            <v-row>
              <v-col cols="3"
                ><v-text-field
                  label="Name"
                  v-model="internalPoll.name"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field
              ></v-col>
              <v-col cols="3"
                ><DateTimePickerField
                  label="Select Datetime"
                  v-model="internalPoll.effectiveDate"
                >
                </DateTimePickerField
              ></v-col>

              <v-col cols="3"
                ><DateTimePickerField
                  label="Select Datetime"
                  v-model="internalPoll.expirationDate"
                >
                </DateTimePickerField
              ></v-col>
            </v-row>
            <v-row>
              <v-col cols="9"
                ><v-textarea
                  label="Description"
                  v-model="internalPoll.description"
                >
                </v-textarea
              ></v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-select
                  label="Select limiting criteria"
                  item-title="name"
                  item-value="value"
                  v-model="internalPoll.submissionLimitCriteria"
                  :items="submissionLimitCriteriaItems"
                  :rules="[(v) => !!v || 'Required']"
                ></v-select>
              </v-col>
            </v-row> </v-form
        ></v-card-text>
      </v-tabs-window-item>
      <v-tabs-window-item>
        <v-container>
          <v-card>
            <v-card-text>
              <v-container>
                <v-row
                  class="justify-center"
                  v-for="(object, index) in effectiveQuestions"
                  :key="object.key"
                >
                  <v-col cols="6"
                    ><v-card class="elevation-3 mt-2 pl-2 pr-2">
                      <v-card-title>Question # {{ index + 1 }}</v-card-title>
                      <v-card-text>
                        <MultipleChoiceQuestionEditScreen
                          v-if="
                            object &&
                            object.questionType &&
                            object.questionType.name == 'MULTIPLE_CHOICE'
                          "
                          :modelValue="effectiveQuestions[index]"
                          @update:modelValue="
                            store.commit('updateQuestion', {
                              question: $event,
                              index,
                            })
                          "
                        >
                        </MultipleChoiceQuestionEditScreen>
                        <NumericQuestionEditScreen
                          v-if="
                            object &&
                            object.questionType &&
                            object.questionType.name == 'NUMERIC'
                          "
                          :modelValue="effectiveQuestions[index]"
                          @update:modelValue="
                            store.commit('updateQuestion', {
                              question: $event,
                              index,
                            })
                          "
                        >
                        </NumericQuestionEditScreen>
                        <ScaleQuestionEditScreen
                          v-if="
                            object &&
                            object.questionType &&
                            object.questionType.name == 'SCALE'
                          "
                          :modelValue="effectiveQuestions[index]"
                          @update:modelValue="
                            store.commit('updateQuestion', {
                              question: $event,
                              index,
                            })
                          "
                        >
                        </ScaleQuestionEditScreen>
                        <TextQuestionEditScreen
                          v-if="
                            object &&
                            object.questionType &&
                            object.questionType.name == 'TEXT'
                          "
                          :modelValue="effectiveQuestions[index]"
                          @update:modelValue="
                            store.commit('updateQuestion', {
                              question: $event,
                              index,
                            })
                          "
                        >
                        </TextQuestionEditScreen>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-tooltip location="top">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              :disabled="internalQuestions.length == 1"
                              @click="showDeleteDialog(index)"
                              v-bind="props"
                              class="secondary mr-2"
                              ><v-icon>mdi-delete</v-icon></v-btn
                            >
                          </template>
                          Delete
                        </v-tooltip>
                        <v-menu offset-y>
                          <template v-slot:activator="{ props }">
                            <v-btn class="secondary" v-bind="props"
                              ><v-icon>mdi-plus</v-icon></v-btn
                            >
                          </template>
                          <v-list>
                            <v-list-item
                              @click="addQuestion('multipleChoice', index + 1)"
                              >Multiple Choice</v-list-item
                            >
                            <v-list-item
                              @click="addQuestion('numeric', index + 1)"
                              >Numeric</v-list-item
                            >
                            <v-list-item
                              @click="addQuestion('scale', index + 1)"
                              >Scale</v-list-item
                            >
                            <v-list-item @click="addQuestion('text', index + 1)"
                              >Text</v-list-item
                            >
                          </v-list>
                        </v-menu>
                      </v-card-actions>
                    </v-card></v-col
                  >
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>

    <v-dialog v-model="showDeleteDialogFlag" max-width="500">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="secondary"
            @click="
              deleteSelectedItem();
              showDeleteDialogFlag = false;
            "
            >Accept</v-btn
          ><v-btn class="secondary" @click="showDeleteDialogFlag = false"
            >Cancel</v-btn
          ></v-card-actions
        >
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import DateTimePickerField from "@/components/fields/DateTimePickerField";
import MultipleChoiceQuestionEditScreen from "@/components/screens/questions/edit/MultipleChoiceQuestionEditScreen";
import NumericQuestionEditScreen from "@/components/screens/questions/edit/NumericQuestionEditScreen";
import ScaleQuestionEditScreen from "@/components/screens/questions/edit/ScaleQuestionEditScreen";
import TextQuestionEditScreen from "@/components/screens/questions/edit/TextQuestionEditScreen";

import { useStore } from "vuex";
import {
  ref,
  reactive,
  computed,
  onMounted,
  defineOptions,
  defineEmits,
  watch,
  defineProps,
} from "vue";

defineOptions({
  name: "PollEditScreen",
});

const props = defineProps({
  modelValue: {
    type: Object,
  },
});

const emit = defineEmits(["valid", "update:modelValue"]);
let store = useStore();

let informationFormValid = ref(false);

let internalPoll = computed(() => {
  return store.getters.poll;
});

let internalQuestions = computed(() => {
  return store.getters.questions;
});

let effectiveQuestions = computed(() => {
  return store.getters.effectiveQuestions;
});

let selectedIndexForDeletion = 0;
let defaultQuestions = {
  multipleChoice: {
    text: "",
    subText: "",
    questionType: { name: "MULTIPLE_CHOICE" },
    minAmountOfSelections: 1,
    maxAmountOfSelections: 1,
    options: [],
    key: crypto.randomUUID(),
  },
  numeric: {
    text: "",
    subText: "",
    questionType: { name: "NUMERIC" },
    minValue: 0,
    maxValue: 100,
    key: crypto.randomUUID(),
  },
  scale: {
    text: "",
    subText: "",
    questionType: { name: "SCALE" },
    minValue: 1,
    maxValue: 5,
    scale: 1,
    key: crypto.randomUUID(),
  },
  text: {
    text: "",
    subText: "",
    questionType: { name: "TEXT" },
    minLength: 10,
    maxLength: 255,
    key: crypto.randomUUID(),
  },
};
let submissionLimitCriteriaItems = reactive([
  { name: "IP Address", value: "IP" },
  { name: "Email", value: "EMAIL" },
  { name: "No Limit", value: "NONE" },
]);
let tabs = ref(0);
let showDeleteDialogFlag = ref(false);

watch(informationFormValid, (v) => {
  emit("valid", v);
});

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      Object.assign(internalPoll, v.poll);
      if (v.questions) internalQuestions = [...v.questions];
    } else {
      Object.assign(internalPoll, {
        name: null,
        description: null,
        effectiveDate: null,
        expirationDate: null,
        submissionLimitCriteria: "NONE",
      });
      Object.assign(internalQuestions, []);
    }
  },
  { deep: true }
);

function addQuestion(type, index) {
  store.commit("addQuestionAtIndex", {
    question: JSON.parse(JSON.stringify(defaultQuestions[type])),
    index,
  });
}

function showDeleteDialog(index) {
  showDeleteDialogFlag.value = true;
  selectedIndexForDeletion = index;
}
function deleteSelectedItem() {
  effectiveQuestions.value[selectedIndexForDeletion].delete = true;
}

onMounted(() => {
  if (internalQuestions.value.length == 0) {
    addQuestion("multipleChoice");
  }
});
</script>
