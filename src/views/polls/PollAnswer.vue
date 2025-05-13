<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-row justify="center">
            <v-col cols="8">
              <v-container>
                <v-card>
                  <v-card-title> {{ poll ? poll.name : "" }} </v-card-title>
                  <v-card-subtitle class="text-left">{{
                    poll ? poll.description : ""
                  }}</v-card-subtitle>
                </v-card>
              </v-container>
            </v-col>
          </v-row>
          <v-row justify="center" v-if="error">
            <v-col cols="8"
              ><v-alert type="warning">{{ error.message }}</v-alert></v-col
            >
          </v-row>

          <v-row justify="center">
            <v-col cols="8">
              <v-container v-if="!successScreen">
                <v-card>
                  <v-card-title class="text-left">
                    Enter your email address
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="5">
                        <v-text-field
                          :rules="[
                            (v) =>
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
                              'The format is incorrect.',
                          ]"
                          v-model="emailAddress"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="8">
              <v-container v-if="!successScreen">
                <v-row
                  v-for="question of questions"
                  :key="question.id"
                  justify="center"
                >
                  <v-col
                    ><MultipleChoiceQuestionAnswerScreen
                      v-if="question.questionType.name == 'MULTIPLE_CHOICE'"
                      :question="question"
                      @answer="answers[question.id] = $event"
                      @valid="validArray[question.id] = $event"
                    ></MultipleChoiceQuestionAnswerScreen>

                    <NumericQuestionAnswerScreen
                      v-if="question.questionType.name == 'NUMERIC'"
                      :question="question"
                      @answer="answers[question.id] = $event"
                      @valid="validArray[question.id] = $event"
                    ></NumericQuestionAnswerScreen>

                    <ScaleQuestionAnswerScreen
                      v-if="question.questionType.name == 'SCALE'"
                      :question="question"
                      @answer="answers[question.id] = $event"
                      @valid="validArray[question.id] = $event"
                    ></ScaleQuestionAnswerScreen>

                    <TextQuestionAnswerScreen
                      v-if="question.questionType.name == 'TEXT'"
                      :question="question"
                      @answer="answers[question.id] = $event"
                      @valid="validArray[question.id] = $event"
                    ></TextQuestionAnswerScreen>
                  </v-col>
                </v-row>
                <v-row>
                  <v-container>
                    <v-btn
                      class="primary"
                      :loading="loading"
                      :disabled="!allQuestionsAndEmailAreValid"
                      @click="submit"
                      >Submit</v-btn
                    ></v-container
                  >
                </v-row>
              </v-container>
              <v-container v-else> Thanks for answering the poll. </v-container>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row> </v-row>
  </v-container>
</template>
<script setup>
import MultipleChoiceQuestionAnswerScreen from "@/components/screens/questions/answer/MultipleChoiceQuestionAnswerScreen";
import NumericQuestionAnswerScreen from "@/components/screens/questions/answer/NumericQuestionAnswerScreen";
import ScaleQuestionAnswerScreen from "@/components/screens/questions/answer/ScaleQuestionAnswerScreen";
import TextQuestionAnswerScreen from "@/components/screens/questions/answer/TextQuestionAnswerScreen";

import { computed, onMounted, ref, reactive, inject } from "vue";
import { useRoute } from "vue-router";

let poll = reactive({});
let questions = ref([]);
let emailAddress = ref(null);
let answers = reactive({});
let loading = ref(false);
let successScreen = ref(false);
let validArray = reactive({});
let error = ref(null);

const api = inject("api");
const route = useRoute();

function load() {
  api
    .get("/public/polls/" + route.params.pollKey)
    .then(({ data }) => {
      poll = data;
      return api
        .get("/public/polls/" + route.params.pollKey + "/questions")
        .then(({ data }) => {
          questions.value = data.sort((a, b) => a.rank - b.rank);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((err) => {
      console.log(err);
      error.value = err.response.data;
    });
}

function submit() {
  loading = true;
  let answerPayload = [];
  for (let answerKey of Object.keys(answers)) {
    let answer = answers[answerKey];
    if (Array.isArray(answer)) {
      for (let innerAnswer of answer) {
        answerPayload.push(innerAnswer);
      }
    } else {
      answerPayload.push(answer);
    }
  }
  let payload = {
    submissionAnswers: answerPayload,
    emailAddress: emailAddress.value,
  };

  api
    .post("/public/polls/" + route.params.pollKey + "/submissions", payload)
    .then(() => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      setTimeout(() => {
        successScreen.value = true;
        loading = false;
      }, 1000);
    })
    .catch((err) => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      error.value = err.response.data;
      loading = false;
      setTimeout(() => {
        error.value = null;
      }, 5000);
    });
}

let allQuestionsAndEmailAreValid = computed(() => {
  let valid = true;
  for (let question of questions.value) {
    valid &= validArray[question.id];
  }
  valid &= emailAddress.value != null;
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  valid &= emailRegex.test(emailAddress.value);
  return valid;
});
onMounted(() => {
  load();
});
</script>
