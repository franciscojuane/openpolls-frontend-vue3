<template>
  <v-container>
    <v-tabs v-model="tabs">
      <v-tab>Information</v-tab>
      <v-tab>Questions</v-tab>
      <v-tab v-if="isExistingPoll">Results</v-tab>

      <v-tab-item>
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
            </v-row> </v-form
        ></v-card-text>
      </v-tab-item>
      <v-tab-item>
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
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="secondary" v-bind="attrs" v-on="on"
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
      </v-tab-item>
      <v-tab-item
        ><PollResultsScreen
          v-if="isExistingPoll && internalPoll"
          :pollId="internalPoll.id"
        >
        </PollResultsScreen
      ></v-tab-item>
    </v-tabs>
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
<script>
import DateTimePickerField from "@/components/fields/DateTimePickerField";
import MultipleChoiceQuestionEditScreen from "@/components/screens/questions/edit/MultipleChoiceQuestionEditScreen";
import NumericQuestionEditScreen from "@/components/screens/questions/edit/NumericQuestionEditScreen";
import ScaleQuestionEditScreen from "@/components/screens/questions/edit/ScaleQuestionEditScreen";
import TextQuestionEditScreen from "@/components/screens/questions/edit/TextQuestionEditScreen";
import PollResultsScreen from "@/components/screens/PollResultsScreen";

export default {
  name: "PollEditScreen",
  components: {
    DateTimePickerField,
    MultipleChoiceQuestionEditScreen,
    NumericQuestionEditScreen,
    ScaleQuestionEditScreen,
    TextQuestionEditScreen,
    PollResultsScreen,
  },
  data: () => ({
    informationFormValid: false,
    internalPoll: {
      name: null,
      description: null,
      effectiveDate: null,
      expirationDate: null,
    },
    internalQuestions: [],
    effectiveQuestions: [],
    currentQuestion: 1,
    defaultQuestions: {
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
    },
    tabs: 0,
    resultsTabs: 0,
    showDeleteDialogFlag: false,
    itemSelectedForDeletion: null,
    showStepper: true,
    stepperKey: 0,
  }),
  props: {
    value: {
      type: Object,
    },
  },
  watch: {
    informationFormValid: {
      immediate: true,
      handler(v) {
        this.$emit("valid", v);
      },
    },
    value: {
      deep: true,
      handler(v) {
        if (v) {
          this.internalPoll = v.poll;
          this.internalQuestions = v.questions;
        } else {
          this.internalPoll = {
            name: null,
            description: null,
            effectiveDate: null,
            expirationDate: null,
          };
          this.internalQuestions = [];
        }
      },
    },
    internalQuestions: {
      deep: true,
      handler() {
        this.effectiveQuestions = this.internalQuestions.filter(
          (elem) => !elem.delete
        );
      },
    },
    fullObject: {
      deep: true,
      handler(v) {
        this.$emit("input", v);
      },
    },
  },

  computed: {
    fullObject() {
      return {
        poll: this.internalPoll,
        questions: this.internalQuestions,
      };
    },
    isExistingPoll() {
      return this.internalPoll && this.internalPoll.id;
    },
    currentQuestionObject() {
      return this.effectiveQuestions[this.currentQuestion - 1];
    },
  },

  methods: {
    addQuestion(type) {
      this.internalQuestions.push(
        JSON.parse(JSON.stringify(this.defaultQuestions[type]))
      );
      this.$nextTick(() => {
        this.currentQuestion = this.internalQuestions.length;
      });
    },
    deleteCurrentQuestion() {
      this.internalQuestions.splice(this.currentQuestion - 1, 1);
      this.currentQuestion--;
    },
    showDeleteDialog(item) {
      this.showDeleteDialogFlag = true;
      this.itemSelectedForDeletion = item;
    },
    deleteSelectedItem() {
      this.$set(this.itemSelectedForDeletion, "delete", true);
    },
  },
  created() {
    if (this.internalQuestions.length == 0) {
      this.addQuestion("multipleChoice");
      this.currentQuestion = 1;
    }
  },
};
</script>
