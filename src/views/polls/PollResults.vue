<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-title>
            <v-toolbar flat color="white">
              <v-toolbar-title>Poll Results: {{ poll.name }}</v-toolbar-title>
            </v-toolbar>
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="tabs">
              <v-tab>Graphics</v-tab>
              <v-tab>Raw Data</v-tab>
              <v-tab-item>
                <v-card>
                  <v-card-title>
                    Question: {{ question ? question.text : "" }}
                  </v-card-title>
                  <v-card-text>
                    <v-pagination
                      v-model="currentQuestion"
                      :length="questions.length"
                      prev-icon="mdi-menu-left"
                      next-icon="mdi-menu-right"
                    ></v-pagination>
                    <BarChartQuestionViewScreen
                      :question="question"
                      height="500px"
                      width="100%"
                      v-if="
                        question.questionType.name == 'NUMERIC' ||
                        question.questionType.name == 'SCALE'
                      "
                    >
                    </BarChartQuestionViewScreen>
                    <PieChartQuestionViewScreen
                      height="500px"
                      width="100%"
                      :question="question"
                      v-if="question.questionType.name == 'MULTIPLE_CHOICE'"
                    ></PieChartQuestionViewScreen>
                    <TextTableQuestionViewScreen
                      :question="question"
                      v-if="question.questionType.name == 'TEXT'"
                    >
                    </TextTableQuestionViewScreen>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item><v-data-table></v-data-table></v-tab-item> </v-tabs
          ></v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import BarChartQuestionViewScreen from "@/components/screens/questions/charts/BarChartQuestionViewScreen";
import PieChartQuestionViewScreen from "@/components/screens/questions/charts/PieChartQuestionViewScreen";
import TextTableQuestionViewScreen from "@/components/screens/questions/charts/TextTableQuestionViewScreen";

export default {
  components: {
    BarChartQuestionViewScreen,
    PieChartQuestionViewScreen,
    TextTableQuestionViewScreen,
  },
  data: () => ({
    headers: [],
    poll: {},
    tabs: 0,
    questions: [],
    currentQuestion: 1,
  }),
  props: {},

  methods: {
    load() {
      this.$api.get("/polls/" + this.$route.params.id).then(({ data }) => {
        this.poll = data;
        return this.$api
          .get("/polls/" + this.$route.params.id + "/questions")
          .then(({ data }) => {
            this.questions = data;
          });
      });
    },
  },
  computed: {
    question() {
      return this.questions[this.currentQuestion - 1];
    },
    type() {
      return this.question &&
        this.question.questionType &&
        this.question.questionType.name == "MULTIPLE_CHOICE"
        ? "pie"
        : "bar";
    },
  },
  async mounted() {
    await this.load();
  },
  watch: {
    question: {
      immediate: true,
      handler(v) {
        this.loading = true;

        if (v) {
          if (v.questionType.name != "TEXT") {
            this.options.xaxis.categories = v.options;
            this.$api
              .get(
                "/polls/" +
                  this.poll.id +
                  "/submissions/answerCountByQuestion/" +
                  v.id
              )
              .then(({ data }) => {
                this.aggregatedData = data.content;
                this.calculateOptions();
                this.calculateSeries();
                this.loading = false;
              });
          } else {
            this.loadTextQuestionData(v);
          }
        }
      },
    },
    paginationOptions: {
      deep: true,
      handler() {
        this.loadTextQuestionData(this.question);
      },
    },
  },
};
</script>
