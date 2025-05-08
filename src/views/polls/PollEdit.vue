<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-title>
            <v-toolbar flat color="white">
              <v-toolbar-title>Edit poll</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ props }">
                  <v-btn
                    :loading="loading"
                    v-bind="props"
                    class="secondary mr-2"
                    @click="save"
                    :disabled="!valid || !auth.hasPermission('POLL_UPDATE')"
                    ><v-icon>mdi-content-save</v-icon></v-btn
                  >
                </template>
                Save
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ props }">
                  <v-btn
                    @click="copyPollKeyToClipboard()"
                    :class="copyToClipboardClass"
                    v-bind="props"
                    ><v-icon :disabled="!valid">{{
                      copyToClipboardIcon
                    }}</v-icon></v-btn
                  >
                </template>
                Copy Poll URL to Clipboard
              </v-tooltip>
            </v-toolbar>
          </v-card-title>

          <v-card-text>
            <v-alert :type="alertType" v-model="showAlert">{{
              alertMessage
            }}</v-alert>
            <PollEditScreen
              @valid="valid = $event"
              v-model="item"
            ></PollEditScreen>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import PollEditScreen from "@/components/screens/PollEditScreen";
import { reactive, ref, onMounted, inject, defineOptions } from "vue";
import { useRoute } from "vue-router";

defineOptions({
  name: "PollEdit",
});

const api = inject("api");
const auth = inject("auth");
const route = useRoute();

const item = reactive({});
const valid = ref(false);
const showAlert = ref(false);
const alertType = ref("warning");
const alertMessage = ref("");
const copyToClipboardClass = ref("secondary");
const copyToClipboardIcon = ref("mdi-share");
const loading = ref(false);

onMounted(() => {
  load();
  if (route.params.new) {
    alertType.value = "green";
    showAlert.value = true;
    alertMessage.value = "Poll created successfully";
    setTimeout(() => {
      showAlert.value = false;
    }, 5000);
  }
});

function load() {
  return api
    .get("/polls/" + route.params.id)
    .then(({ data }) => {
      item.poll = data;
      api
        .get("/polls/" + route.params.id + "/questions")
        .then(({ data }) => {
          item.questions = data;
        })
        .catch((error) => {
          showAlert.value = true;
          alertType.value = "warning";
          alertMessage.value = "Error happened while loading data.";
          console.log(error);
          setTimeout(() => {
            showAlert.value = false;
          }, 5000);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

function save() {
  loading.value = true;
  api
    .patch("/polls/" + route.params.id, item.poll)
    .then(({ data }) => {
      let pollId = data.id;
      let promises = [];
      item.poll = data;

      for (let questionNumber in item.questions) {
        let question = item.questions[questionNumber];
        question.rank = questionNumber;

        if (question.id) {
          if (question.delete) {
            promises.push(
              api
                .delete(
                  "/polls/" + pollId + "/questions/" + question.id,
                  question
                )
                .catch((error) => {
                  console.log(error);
                })
            );
          } else if (question.update) {
            promises.push(
              api
                .patch(
                  "/polls/" + pollId + "/questions/" + question.id,
                  question
                )
                .catch((error) => {
                  console.log(error);
                })
            );
          }
        } else {
          promises.push(
            api
              .post("/polls/" + pollId + "/questions", question)
              .catch((error) => {
                console.log(error);
              })
          );
        }
      }
      Promise.all(promises)
        .then(() => {
          load().then(() => {
            loading.value = false;
          });
          showAlert.value = true;
          alertType.value = "green";
          alertMessage.value = "Changes saved successfully.";
          setTimeout(() => {
            showAlert.value = false;
          }, 5000);
        })
        .catch((error) => {
          console.log(error);
          error = error.response.data;
          loading.value = false;
          showAlert.value = true;
          alertType.value = "warning";
          alertMessage.value = error.message;
          console.log(error);
          setTimeout(() => {
            showAlert.value = false;
          }, 5000);
        });
    })
    .catch((error) => {
      console.log(error);
      error = error.response.data;
      loading.value = false;
      showAlert.value = true;
      alertType.value = "warning";
      alertMessage.value = error.message;
      console.log(error);
      setTimeout(() => {
        showAlert.value = false;
      }, 5000);
    });
}
function copyPollKeyToClipboard() {
  navigator.clipboard
    .writeText(
      process.env.VUE_APP_SITE_URL + "/pollAnswer/" + item.poll.pollKey
    )
    .then(() => {
      copyToClipboardClass.value = "green";
      copyToClipboardIcon.value = "mdi-check";
      setTimeout(() => {
        copyToClipboardClass.value = "secondary";
        copyToClipboardIcon.value = "mdi-share";
      }, 1500);
    })
    .catch(function (err) {
      console.error("Error al copiar el texto: ", err);
    });
}
</script>
