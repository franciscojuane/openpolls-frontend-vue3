<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-title>
            <v-toolbar flat color="white">
              <v-toolbar-title
                >Poll Results: {{ poll ? poll.name : "" }}</v-toolbar-title
              >
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
                        question &&
                        question.questionType &&
                        (question.questionType.name == 'NUMERIC' ||
                          question.questionType.name == 'SCALE')
                      "
                    >
                    </BarChartQuestionViewScreen>
                    <PieChartQuestionViewScreen
                      height="500px"
                      width="100%"
                      :question="question"
                      v-if="
                        question &&
                        question.questionType &&
                        question.questionType.name == 'MULTIPLE_CHOICE'
                      "
                    ></PieChartQuestionViewScreen>
                    <TextTableQuestionViewScreen
                      :question="question"
                      v-if="
                        question &&
                        question.questionType &&
                        question.questionType.name == 'TEXT'
                      "
                    >
                    </TextTableQuestionViewScreen>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item
                ><v-data-table
                  :items="rawDataItems"
                  :headers="headers"
                  v-if="questions.length > 0"
                >
                  <template
                    v-slot:[`item.question${num}`]="{ item }"
                    v-for="num of questionsIds.length"
                  >
                    <td :key="num">
                      {{
                        item.data.find((elem) => elem.questionId == num)
                          ? item.data.find((elem) => elem.questionId == num)
                              .answer
                          : ""
                      }}
                    </td>
                  </template>
                  <template v-slot:[`item.identifier`]="{ item }">
                    <td v-if="item.ipAddress">
                      {{ item.ipAddress }}
                    </td>
                    <td v-else>
                      {{ item.emailAddress }}
                    </td>
                  </template>
                </v-data-table></v-tab-item
              >
            </v-tabs></v-card-text
          >
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
    questions: [{}],
    questionsIds: [],
    currentQuestion: 1,
    rawDataItems: [],
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
            this.headers = [{ text: "Identifier", value: "identifier" }];
            this.questions.forEach((elem) => {
              this.headers.push({
                text: elem.text,
                value: "question" + elem.id,
              });
            });
            this.questionsIds = this.questions.map((elem) => elem.id);
          });
      });
    },
    loadRawDataItems() {
      this.$api
        .get("/polls/" + this.poll.id + "/submissions/table")
        .then(({ data }) => {
          this.rawDataItems = data.rows;
        });
    },
  },
  computed: {
    question() {
      return this.questions[this.currentQuestion - 1];
    },
  },
  async mounted() {
    await this.load();
  },
  watch: {
    tabs: {
      immediate: true,
      handler(v) {
        console.log(v);
        if (v == 1 && this.rawDataItems.length == 0) {
          this.loadRawDataItems();
        }
      },
    },
  },
};
</script>
