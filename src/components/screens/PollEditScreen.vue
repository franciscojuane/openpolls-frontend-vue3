<template>
  <v-container>
    <v-tabs v-model="tabs">
      <v-tab>Information</v-tab>
      <v-tab>Questions</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tabs">
      <v-tabs-window-item>
        <v-card-text>
          <v-form v-model="informationFormValid">
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
                ></v-select>
              </v-col>
            </v-row> </v-form
        ></v-card-text>
      </v-tabs-window-item>
      <v-tabs-window-item>
        <v-container>
          <v-card>
            <v-card-title>
              <v-row>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="internalQuestions.length == 1"
                  @click="
                    showDeleteDialog(effectiveQuestions[currentQuestion - 1])
                  "
                  class="secondary mr-2"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
                <v-menu offset-y>
                  <template v-slot:activator="{ props }">
                    <v-btn class="secondary" v-bind="props"
                      ><v-icon>mdi-plus</v-icon></v-btn
                    >
                  </template>
                  <v-list>
                    <v-list-item @click="addQuestion('multipleChoice')"
                      >Multiple Choice</v-list-item
                    >
                    <v-list-item @click="addQuestion('numeric')"
                      >Numeric</v-list-item
                    >
                    <v-list-item @click="addQuestion('scale')"
                      >Scale</v-list-item
                    >
                    <v-list-item @click="addQuestion('text')">Text</v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-pagination
                v-model="currentQuestion"
                :length="effectiveQuestions.length"
                prev-icon="mdi-menu-left"
                next-icon="mdi-menu-right"
              ></v-pagination>
              <v-container>
                <v-row>
                  <v-col cols="3"> </v-col>
                  <v-col cols="6"
                    ><v-card class="elevation-3 mt-2 pl-2 pr-2">
                      <v-card-title>Question</v-card-title>
                      <v-card-text>
                        <MultipleChoiceQuestionEditScreen
                          v-if="
                            currentQuestionObject &&
                            currentQuestionObject.questionType &&
                            currentQuestionObject.questionType.name ==
                              'MULTIPLE_CHOICE'
                          "
                          v-model="currentQuestionObject"
                          @change="currentQuestionObject.update = true"
                        >
                        </MultipleChoiceQuestionEditScreen>
                        <NumericQuestionEditScreen
                          v-if="
                            currentQuestionObject &&
                            currentQuestionObject.questionType &&
                            currentQuestionObject.questionType.name == 'NUMERIC'
                          "
                          v-model="currentQuestionObject"
                          @change="currentQuestionObject.update = true"
                        >
                        </NumericQuestionEditScreen>
                        <ScaleQuestionEditScreen
                          v-if="
                            currentQuestionObject &&
                            currentQuestionObject.questionType &&
                            currentQuestionObject.questionType.name == 'SCALE'
                          "
                          v-model="currentQuestionObject"
                          @change="currentQuestionObject.update = true"
                        >
                        </ScaleQuestionEditScreen>
                        <TextQuestionEditScreen
                          v-if="
                            currentQuestionObject &&
                            currentQuestionObject.questionType &&
                            currentQuestionObject.questionType.name == 'TEXT'
                          "
                          v-model="currentQuestionObject"
                          @change="currentQuestionObject.update = true"
                        >
                        </TextQuestionEditScreen>
                      </v-card-text> </v-card
                  ></v-col>
                  <v-col cols="3"> </v-col>
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
import {
  ref,
  reactive,
  onMounted,
  defineOptions,
  defineEmits,
  watch,
  computed,
  defineProps,
  nextTick,
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

let informationFormValid = ref(false);
let internalPoll = reactive({
  name: null,
  description: null,
  effectiveDate: null,
  expirationDate: null,
  submissionLimitCriteria: "NONE",
});
let internalQuestions = ref([]);
let effectiveQuestions = reactive([]);
let currentQuestion = ref(1);
let defaultQuestions = reactive({
  multipleChoice: {
    text: "",
    subText: "",
    questionType: { name: "MULTIPLE_CHOICE" },
    minAmountOfSelections: 1,
    maxAmountOfSelections: 1,
    options: [],
  },
  numeric: {
    text: "",
    subText: "",
    questionType: { name: "NUMERIC" },
    minValue: 0,
    maxValue: 100,
  },
  scale: {
    text: "",
    subText: "",
    questionType: { name: "SCALE" },
    minValue: 1,
    maxValue: 5,
    scale: 1,
  },
  text: {
    text: "",
    subText: "",
    questionType: { name: "TEXT" },
    minLength: 10,
    maxLength: 255,
  },
});
let submissionLimitCriteriaItems = reactive([
  { name: "IP Address", value: "IP" },
  { name: "Email", value: "EMAIL" },
  { name: "No Limit", value: "NONE" },
]);
let tabs = ref(0);
let showDeleteDialogFlag = ref(false);
let itemSelectedForDeletion = null;

watch(informationFormValid, (v) => {
  emit("valid", v);
});

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      Object.assign(internalPoll, v.poll);

      Object.assign(internalQuestions.value, v.questions);
    } else {
      Object.assign(internalPoll, {
        name: null,
        description: null,
        effectiveDate: null,
        expirationDate: null,
        submissionLimitCriteria: "NONE",
      });
      Object.assign(internalQuestions.value, []);
    }
  },
  { deep: true }
);
watch(
  internalQuestions,
  () => {
    effectiveQuestions = internalQuestions.value.filter((elem) => !elem.delete);
  },
  { deep: true }
);

watch(
  [internalPoll, () => internalQuestions],
  () => {
    emit("update:modelValue", {
      poll: internalPoll,
      questions: internalQuestions.value,
    });
  },
  { deep: true }
);

let currentQuestionObject = computed({
  get() {
    return effectiveQuestions[currentQuestion.value - 1];
  },
  set(newValue) {
    Object.assign(effectiveQuestions[currentQuestion.value - 1], newValue);
  },
});

function addQuestion(type) {
  internalQuestions.value.push(
    JSON.parse(JSON.stringify(defaultQuestions[type]))
  );
  nextTick(() => {
    currentQuestion.value = internalQuestions.value.length;
    console.log(currentQuestion.value);
  });
}

function showDeleteDialog(item) {
  showDeleteDialogFlag.value = true;
  itemSelectedForDeletion = item;
}
function deleteSelectedItem() {
  itemSelectedForDeletion.delete = true;
}

onMounted(() => {
  if (internalQuestions.value.length == 0) {
    addQuestion("multipleChoice");
    currentQuestion.value = 1;
  }
});
</script>
