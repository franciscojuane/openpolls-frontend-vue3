<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-title>
            <v-toolbar flat color="white">
              <v-toolbar-title>Edit poll</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn class="secondary"
                ><v-icon @click="save" :disabled="!valid"
                  >mdi-content-save</v-icon
                ></v-btn
              >
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
  }),
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.$api.get("/polls/" + this.$route.params.id).then(({ data }) => {
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
              this.load();
              this.showAlert = true;
              this.alertType = "success";
              this.alertMessage = "Changes saved successfully.";
              setTimeout(() => {
                this.showAlert = false;
              }, 5000);
            })
            .catch((error) => {
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
          this.showAlert = true;
          this.alertType = "warning";
          this.alertMessage = "Error happened while saving data.";
          console.log(error);
          setTimeout(() => {
            this.showAlert = false;
          }, 5000);
        });
    },
  },
};
</script>
