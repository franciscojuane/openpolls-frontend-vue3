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
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :loading="loading"
                    v-on="on"
                    v-bind="attrs"
                    class="secondary mr-2"
                    @click="save"
                    ><v-icon :disabled="!valid">mdi-content-save</v-icon></v-btn
                  >
                </template>
                Save
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="copyPollKeyToClipboard()"
                    :class="copyToClipboardClass"
                    v-on="on"
                    v-bind="attrs"
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

<script>
import PollEditScreen from "@/components/screens/PollEditScreen";
export default {
  name: "PollEdit",
  components: {
    PollEditScreen,
  },

  data: () => ({
    item: null,
    valid: false,
    showAlert: false,
    alertType: "warning",
    alertMessage: "",
    copyToClipboardClass: "secondary",
    copyToClipboardIcon: "mdi-share",
    loading: false,
  }),
  mounted() {
    this.load();
    if (this.$route.params.new) {
      this.alertType = "green";
      this.showAlert = true;
      this.alertMessage = "Poll created successfully";
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
  },
  methods: {
    load() {
      return this.$api
        .get("/polls/" + this.$route.params.id)
        .then(({ data }) => {
          this.item.poll = data;
          this.$api
            .get("/polls/" + this.$route.params.id + "/questions")
            .then(({ data }) => {
              this.item.questions = data;
              console.log(this.item);
            })
            .catch((error) => {
              this.showAlert = true;
              this.alertType = "warning";
              this.alertMessage = "Error happened while loading data.";
              console.log(error);
              setTimeout(() => {
                this.showAlert = false;
              }, 5000);
            });
        });
    },
    save() {
      this.loading = true;
      this.$api
        .patch("/polls/" + this.$route.params.id, this.item.poll)
        .then(({ data }) => {
          let pollId = data.id;
          let promises = [];
          this.item.poll = data;

          for (let questionNumber in this.item.questions) {
            let question = this.item.questions[questionNumber];
            question.rank = questionNumber;

            if (question.id) {
              if (question.delete) {
                promises.push(
                  this.$api.delete(
                    "/polls/" + pollId + "/questions/" + question.id,
                    question
                  )
                );
              } else if (question.update) {
                promises.push(
                  this.$api.patch(
                    "/polls/" + pollId + "/questions/" + question.id,
                    question
                  )
                );
              }
            } else {
              promises.push(
                this.$api.post("/polls/" + pollId + "/questions", question)
              );
            }
          }
          Promise.all(promises)
            .then(() => {
              this.load().then(() => {
                debugger;
                this.loading = false;
              });
              this.showAlert = true;
              this.alertType = "green";
              this.alertMessage = "Changes saved successfully.";
              setTimeout(() => {
                this.showAlert = false;
              }, 5000);
            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
              this.showAlert = true;
              this.alertType = "warning";
              this.alertMessage = "Error happened while saving data.";
              console.log(error);
              setTimeout(() => {
                this.showAlert = false;
              }, 5000);
            });
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.showAlert = true;
          this.alertType = "warning";
          this.alertMessage = "Error happened while saving data.";
          console.log(error);
          setTimeout(() => {
            this.showAlert = false;
          }, 5000);
        });
    },
    copyPollKeyToClipboard() {
      navigator.clipboard
        .writeText(
          process.env.VUE_APP_SITE_URL + "/pollAnswer/" + this.item.poll.pollKey
        )
        .then(() => {
          this.copyToClipboardClass = "green";
          this.copyToClipboardIcon = "mdi-check";
          setTimeout(() => {
            this.copyToClipboardClass = "secondary";
            this.copyToClipboardIcon = "mdi-share";
          }, 1500);
        })
        .catch(function (err) {
          console.error("Error al copiar el texto: ", err);
        });
    },
  },
};
</script>
