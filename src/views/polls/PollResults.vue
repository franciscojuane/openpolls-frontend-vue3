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
            </v-tabs>

            <v-tabs-window v-model="tabs">
              <v-tabs-window-item>
                <v-card :key="question.id">
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
              </v-tabs-window-item>
              <v-tabs-window-item>
                <v-data-table
                  :items="rawDataItems"
                  :headers="headers"
                  v-if="questions.length > 0"
                >
                  <template
                    v-slot:[`item.question${num}`]="{ item }"
                    v-for="num of questionsIds.length"
                    :key="num"
                  >
                    <td>
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
                </v-data-table>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import BarChartQuestionViewScreen from "@/components/screens/questions/charts/BarChartQuestionViewScreen";
import PieChartQuestionViewScreen from "@/components/screens/questions/charts/PieChartQuestionViewScreen";
import TextTableQuestionViewScreen from "@/components/screens/questions/charts/TextTableQuestionViewScreen";
import { inject, ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

let headers = ref([]);
let poll = reactive({});
let tabs = ref(0);
let questions = ref([{}]);
let questionsIds = [];
let currentQuestion = ref(1);
let rawDataItems = [];
const api = inject("api");
const route = useRoute();

function load() {
  api
    .get("/polls/" + route.params.id)
    .then(({ data }) => {
      poll = data;
      return api
        .get("/polls/" + route.params.id + "/questions")
        .then(({ data }) => {
          questions.value = data.sort((a, b) => a.rank - b.rank);
          headers.value = [{ title: "Identifier", value: "identifier" }];
          questions.value.forEach((elem) => {
            headers.value.push({
              title: elem.text,
              value: "question" + elem.id,
            });
          });
          questionsIds = questions.value.map((elem) => elem.id);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}
function loadRawDataItems() {
  api
    .get("/polls/" + poll.id + "/submissions/table")
    .then(({ data }) => {
      rawDataItems = data.rows;
    })
    .catch((error) => {
      console.log(error);
    });
}

let question = computed(() => {
  return questions.value[currentQuestion.value - 1];
});

onMounted(() => {
  load();
});

watch(
  tabs,
  (newValue) => {
    if (newValue == 1 && rawDataItems.length == 0) {
      loadRawDataItems();
    }
  },
  { immediate: true }
);
</script>
