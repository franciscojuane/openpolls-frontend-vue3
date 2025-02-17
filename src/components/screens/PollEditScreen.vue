<template>
  <v-container>
    <v-tabs v-model="tabs">
      <v-tab>Information</v-tab>
      <v-tab>Questions</v-tab>

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
                  @click="deleteCurrentQuestion()"
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
              <v-stepper v-model="currentQuestion">
                <v-stepper-header center>
                  <v-stepper-step
                    v-for="i in internalQuestions.length"
                    :key="i"
                    :step="i"
                    :editable="true"
                  ></v-stepper-step>
                </v-stepper-header>
                <v-stepper-items v-if="internalQuestions.length > 0">
                  <v-stepper-content
                    v-for="i in internalQuestions.length"
                    :key="i"
                    :step="i"
                  >
                    <MultipleChoiceQuestionEditScreen
                      v-if="
                        internalQuestions[currentQuestion - 1] &&
                        internalQuestions[currentQuestion - 1].questionType &&
                        internalQuestions[currentQuestion - 1].questionType
                          .name == 'MULTIPLE_CHOICE'
                      "
                      v-model="internalQuestions[currentQuestion - 1]"
                    >
                    </MultipleChoiceQuestionEditScreen>
                    <NumericQuestionEditScreen
                      v-if="
                        internalQuestions[currentQuestion - 1] &&
                        internalQuestions[currentQuestion - 1].questionType &&
                        internalQuestions[currentQuestion - 1].questionType
                          .name == 'NUMERIC'
                      "
                      v-model="internalQuestions[currentQuestion - 1]"
                    >
                    </NumericQuestionEditScreen>
                    <ScaleQuestionEditScreen
                      v-if="
                        internalQuestions[currentQuestion - 1] &&
                        internalQuestions[currentQuestion - 1].questionType &&
                        internalQuestions[currentQuestion - 1].questionType
                          .name == 'SCALE'
                      "
                      v-model="internalQuestions[currentQuestion - 1]"
                    >
                    </ScaleQuestionEditScreen>
                    <TextQuestionEditScreen
                      v-if="
                        internalQuestions[currentQuestion - 1] &&
                        internalQuestions[currentQuestion - 1].questionType &&
                        internalQuestions[currentQuestion - 1].questionType
                          .name == 'TEXT'
                      "
                      v-model="internalQuestions[currentQuestion - 1]"
                    >
                    </TextQuestionEditScreen>

                    {{ internalQuestions[i - 1] }}
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-card-text>
          </v-card>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import DateTimePickerField from "@/components/fields/DateTimePickerField";
import MultipleChoiceQuestionEditScreen from "@/components/screens/MultipleChoiceQuestionEditScreen";
import NumericQuestionEditScreen from "@/components/screens/NumericQuestionEditScreen";
import ScaleQuestionEditScreen from "@/components/screens/ScaleQuestionEditScreen";
import TextQuestionEditScreen from "@/components/screens/TextQuestionEditScreen";

export default {
  name: "PollEditScreen",
  components: {
    DateTimePickerField,
    MultipleChoiceQuestionEditScreen,
    NumericQuestionEditScreen,
    ScaleQuestionEditScreen,
    TextQuestionEditScreen,
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
    tabs: 1,
  }),
  props: {
    poll: {
      type: Object,
    },
  },
  watch: {
    informationFormValid: {
      immediate: true,
      handler(v) {
        console.log("valid " + v);
        this.$emit("valid", v);
      },
    },
    item: {
      deep: true,
      handler() {
        if (this.item) {
          this.internalPoll = this.item;
        } else {
          this.internalPoll = {
            name: null,
            description: null,
            effectiveDate: null,
            expirationDate: null,
          };
        }
      },
    },
    internalPoll: {
      deep: true,
      handler(v) {
        this.$emit("input", v);
      },
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
  },
  created() {
    if (this.internalQuestions.length == 0) {
      this.addQuestion("multipleChoice");
      this.currentQuestion = 1;
    }
  },
};
</script>
