<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-title>
            <v-toolbar flat color="white">
              <v-toolbar-title>Add new Poll</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn @click="save" :disabled="!valid" class="secondary"
                ><v-icon>mdi-content-save</v-icon></v-btn
              >
            </v-toolbar>
          </v-card-title>
          <v-row justify="center" v-if="error">
            <v-col cols="11"
              ><v-alert type="warning">{{ error.message }}</v-alert></v-col
            >
          </v-row>
          <v-card-text>
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
  name: "PollAdd",
  components: {
    PollEditScreen,
  },

  data: () => ({
    item: null,
    valid: false,
    error: null,
  }),
  mounted() {},
  methods: {
    save() {
      this.$api
        .post("/polls", this.item.poll)
        .then(({ data }) => {
          let pollId = data.id;
          let promises = [];
          this.item.poll = data;
          let newQuestions = [];
          for (let questionNumber in this.item.questions) {
            let question = this.item.questions[questionNumber];
            question.rank = questionNumber;
            if (question.id) {
              promises.push(
                this.$api
                  .patch(
                    "/polls/" + pollId + "/questions/" + question.id,
                    question
                  )
                  .then(({ data }) => {
                    console.log(data);
                    newQuestions.push(data);
                  })
                  .catch((error) => {
                    console.log(error);
                  })
              );
            } else {
              promises.push(
                this.$api
                  .post("/polls/" + pollId + "/questions", question)
                  .then(({ data }) => {
                    console.log(data);
                    newQuestions.push(data);
                  })
                  .catch((error) => {
                    console.log(error);
                  })
              );
            }
          }
          Promise.all(promises)
            .then(() => {
              this.$router.push({
                name: "pollEdit",
                params: { id: pollId, new: true },
              });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          this.error = error.response.data;
          this.loading = false;
          setTimeout(() => {
            this.error = null;
          }, 5000);
        });
    },
  },
};
</script>
