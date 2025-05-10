export default function createPollModule({ ApiService }) {
  return {
    state: () => ({
      poll: {},
      questions: [],
    }),

    mutations: {
      setPoll(state, poll) {
        state.poll = poll;
      },

      setQuestions(state, questions) {
        state.questions = questions;
      },

      updateQuestion(state, { question, index }) {
        state.questions[index] = question;
      },

      addQuestion(state, { question }) {
        state.questions.push(question);
      },

      addQuestionAtIndex(state, { question, index }) {
        state.questions.splice(index, 0, question);
        debugger;
        for (let i = index; i < state.questions.length; i++) {
          state.questions[i].rank = i + 1;
          state.questions[i].update = true;
        }
      },
    },

    getters: {
      effectiveQuestions(state) {
        return state.questions.filter((elem) => !elem.delete);
      },
      questions(state) {
        return state.questions;
      },
      poll(state) {
        return state.poll;
      },
    },
    actions: {
      async loadPoll(state, { pollId }) {
        return ApiService.get("/polls/" + pollId)
          .then(({ data }) => {
            state.commit("setPoll", data);
            return ApiService.get("/polls/" + pollId + "/questions")
              .then(({ data }) => {
                data.sort((a, b) => a.rank - b.rank);
                state.commit("setQuestions", data);
              })
              .catch((error) => {
                console.error("Error happened while loading questions.");
                console.log(error);
                throw error;
              });
          })
          .catch((error) => {
            console.error("Error happened while loading poll.");
            console.log(error);
            throw error;
          });
      },
      async savePoll(state) {
        let pollId = state.getters.poll.id;
        return ApiService.patch("/polls/" + pollId, state.getters.poll)
          .then(({ data }) => {
            state.commit("setPoll", data);
            let promises = [];
            let questions = state.getters.questions;

            for (let questionNumber in questions) {
              let question = questions[questionNumber];
              question.rank = questionNumber;

              if (question.id) {
                if (question.delete) {
                  promises.push(
                    ApiService.delete(
                      "/polls/" + pollId + "/questions/" + question.id,
                      question
                    ).catch((error) => {
                      console.log(error);
                    })
                  );
                } else if (question.update) {
                  promises.push(
                    ApiService.patch(
                      "/polls/" + pollId + "/questions/" + question.id,
                      question
                    ).catch((error) => {
                      console.log(error);
                    })
                  );
                }
              } else {
                if (!question.delete) {
                  promises.push(
                    ApiService.post(
                      "/polls/" + pollId + "/questions",
                      question
                    ).catch((error) => {
                      console.log(error);
                    })
                  );
                }
              }
            }
            return Promise.all(promises)
              .then(() => {
                state.dispatch("load", { pollId });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      },
    },
  };
}
