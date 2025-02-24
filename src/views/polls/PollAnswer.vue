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
                  <v-card-title> Enter your email address </v-card-title>
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
                      @valid="$set(valid, question.id, $event)"
                    ></MultipleChoiceQuestionAnswerScreen>

                    <NumericQuestionAnswerScreen
                      v-if="question.questionType.name == 'NUMERIC'"
                      :question="question"
                      @answer="answers[question.id] = $event"
                      @valid="$set(valid, question.id, $event)"
                    ></NumericQuestionAnswerScreen>

                    <ScaleQuestionAnswerScreen
                      v-if="question.questionType.name == 'SCALE'"
                      :question="question"
                      @answer="answers[question.id] = $event"
                      @valid="$set(valid, question.id, $event)"
                    ></ScaleQuestionAnswerScreen>

                    <TextQuestionAnswerScreen
                      v-if="question.questionType.name == 'TEXT'"
                      :question="question"
                      @answer="answers[question.id] = $event"
                      @valid="$set(valid, question.id, $event)"
                    ></TextQuestionAnswerScreen>
                  </v-col>
                </v-row>
                <v-row>
                  <v-container>
                    <v-btn
                      class="primary"
                      @click="submit"
                      :loading="loading"
                      :disabled="!allQuestionsAndEmailAreValid"
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
<script>
import MultipleChoiceQuestionAnswerScreen from "@/components/screens/questions/answer/MultipleChoiceQuestionAnswerScreen";
import NumericQuestionAnswerScreen from "@/components/screens/questions/answer/NumericQuestionAnswerScreen";
import ScaleQuestionAnswerScreen from "@/components/screens/questions/answer/ScaleQuestionAnswerScreen";
import TextQuestionAnswerScreen from "@/components/screens/questions/answer/TextQuestionAnswerScreen";
export default {
  components: {
    MultipleChoiceQuestionAnswerScreen,
    NumericQuestionAnswerScreen,
    ScaleQuestionAnswerScreen,
    TextQuestionAnswerScreen,
  },
  data: () => ({
    poll: {},
    tabs: 0,
    questions: [],
    emailAddress: null,
    answers: {},
    loading: false,
    successScreen: false,
    valid: {},
    error: null,
  }),
  props: {},

  methods: {
    load() {
      this.$api
        .get("/public/polls/" + this.$route.params.pollKey)
        .then(({ data }) => {
          this.poll = data;
          return this.$api
            .get("/public/polls/" + this.$route.params.pollKey + "/questions")
            .then(({ data }) => {
              this.questions = data;
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
          this.error = error.response.data;
        });
    },

    submit() {
      this.loading = true;
      let answerPayload = [];
      for (let answerKey of Object.keys(this.answers)) {
        let answer = this.answers[answerKey];
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
        emailAddress: this.emailAddress,
      };

      this.$api
        .post(
          "/public/polls/" + this.$route.params.pollKey + "/submissions",
          payload
        )
        .then(() => {
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          setTimeout(() => {
            this.successScreen = true;
            this.loading = false;
          }, 1000);
        })
        .catch((error) => {
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          this.error = error.response.data;
          this.loading = false;
          setTimeout(() => {
            this.error = null;
          }, 5000);
        });
    },
  },
  computed: {
    allQuestionsAndEmailAreValid() {
      let valid = true;
      for (let question of this.questions) {
        valid &= this.valid[question.id];
      }
      valid &= this.emailAddress != null;

      let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valid &= emailRegex.test(this.emailAddress);
      return valid;
    },
  },
  async mounted() {
    await this.load();
  },
};
</script>
